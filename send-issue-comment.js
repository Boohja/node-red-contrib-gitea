const {copyToNodeProp} = require("./helpers/nodes");
const {apiPost} = require("./helpers/gitea-api");


module.exports = function(RED) {
  function SendIssueCommentNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.credentials = RED.nodes.getCredentials(config.integration);
    node.integration = RED.nodes.getNode(config.integration);

    copyToNodeProp(node, 'params', config, ['repoOwner', 'repo', 'comment', 'issue'])

    node.on('input', async function(msg) {
      node.status({ "fill": "gray", "shape": "dot", "text": "Starting" });
      const body = {
        body: msg.comment || node.params.comment
      }
      const issue = msg.issue || node.params.issue
      try {
        msg.payload = await apiPost(node.credentials, `/repos/${node.params.repoOwner}/${node.params.repo}/issues/${issue}/comments`, body);
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
  RED.nodes.registerType("gitea-send-issue-comment", SendIssueCommentNode);
}