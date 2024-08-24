function copyToNodeProp (node, field, from, fields) {
  node[field] = fields.reduce((prev, curr) => ({ ...prev, [curr]: from[curr] }), {})
}


module.exports = {
  copyToNodeProp
}
