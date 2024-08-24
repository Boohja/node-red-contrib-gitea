const { apiGetPagination} = require('./helpers/gitea-api');
const {copyToNodeProp} = require("./helpers/nodes");

module.exports = function(RED) {
  function GetIssuesNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.credentials = RED.nodes.getCredentials(config.integration);
    node.integration = RED.nodes.getNode(config.integration);

    copyToNodeProp(node, 'params', config, ['repoOwner', 'repo', 'q', 'issueType', 'state', 'labels', 'milestones', 'since', 'before', 'created_by', 'assigned_by', 'mentioned_by', 'limit', 'page'])

    node.on('input', async function(msg) {
      node.status({ "fill": "gray", "shape": "dot", "text": "Starting" });
      const query = {
        q: msg.q || node.params.q,
        type: msg.issueType || node.params.issueType,
        state: msg.state || node.params.state,
        labels: msg.labels || node.params.labels,
        milestones: msg.milestones || node.params.milestones,
        since: msg.since || node.params.since,
        before: msg.before || node.params.before,
        created_by: msg.created_by || node.params.created_by,
        assigned_by: msg.assigned_by || node.params.assigned_by,
        mentioned_by: msg.mentioned_by || node.params.mentioned_by
      }
      const pagination = { page: msg.page || node.params.page, limit: msg.limit || node.params.limit }
      try {
        const data = await apiGetPagination(node.credentials, `/repos/${node.params.repoOwner}/${node.params.repo}/issues`, query, pagination);
        msg.payload = data.result;
        msg.total = data.total;
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
  RED.nodes.registerType("gitea-get-issues", GetIssuesNode);
};
