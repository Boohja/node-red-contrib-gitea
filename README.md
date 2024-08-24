# node-red-gitea
[Gitea](https://about.gitea.com/) nodes for [Node-RED](https://nodered.org/).

You need a gitea access token to use these nodes.

## Features

### Nodes
* Get all isses of a repository
* Get all labels of an issue
* Add  comment to an issue

More nodes will be added over time.
I don't expect a high demand for this package anyways, but if missing nodes get requested, I should be able to add them rather quickly.

### Pagination

For nodes like "get issues", the pagination handling can be taken care of. In this case, the node qould query all pages one by one and return an array containing all items.\
This feature is optional and pagination can be manually handled by providing `page` und `limit` parameters.

## Installation

You can either install this package from within Node-RED using the command palette and search for "node-red-gitea", or you run the following command in your Node-RED user directory (typically `~/.node
red` on Linux, `%APPDATA%\node-red` on Windows):

```bash
npm install node-red-gitea
```
