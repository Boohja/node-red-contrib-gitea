module.exports = function(RED) {
  function GiteaIntegrationNode(n) {
    RED.nodes.createNode(this,n);
    this.name = n.name;
    this.apiUrl = n.credentials?.apiUrl;
    this.apiKey = n.credentials?.apiKey;
  }
  RED.nodes.registerType("gitea integration",GiteaIntegrationNode, {
    credentials: {
      apiUrl: {type: "text", required: true},
      apiKey: {type: "password", required: true}
    }
  });
}