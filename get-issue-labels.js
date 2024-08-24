const {apiGet} = require('./helpers/gitea-api');
const {copyToNodeProp} = require("./helpers/nodes");

module.exports = function(RED) {
  function GetIssueLabelsNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.credentials = RED.nodes.getCredentials(config.integration);
    node.integration = RED.nodes.getNode(config.integration);

    copyToNodeProp(node, 'params', config, ['repoOwner', 'repo', 'issue'])

    node.on('input', async function(msg) {
      node.status({ "fill": "gray", "shape": "dot", "text": "Starting" });
      const issue = msg.issue || node.params.issue
      try {
        msg.payload = await apiGet(node.credentials, `/repos/${node.params.repoOwner}/${node.params.repo}/issues/${issue}/labels`);
        node.status({ "fill": "green", "shape": "dot", "text": "Done" });
        node.send([msg, null]);
      }
      catch (error) {
        msg.error = `Unexpected error: ${error.message}`;
        node.status({ "fill": "red", "shape": "dot", "text": "Error" });
        node.send([null, msg]);
      }
    });
  }
  RED.nodes.registerType("gitea-get-issue-labels", GetIssueLabelsNode);
};
