export class GraphDFS {
  nodes = [];
  edges = [];
  graph = {};
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.graph = {};

    // create adjacency list
    for (let edge of this.edges) {
      if (!this.graph[edge.source]) {
        this.graph[edge.source] = [];
      }
      this.graph[edge.source].push(edge);
    }
  }

  dfs(node, path = []) {
    // add current node to path
    path.push(node.id.toString());
    // console.log(path.push(node.id.toString()));
    // if node has no outgoing edges, return the current path as a single-element list
    if (!this.graph[node.id.toString()]) {
      return [path];
    }

    // explore each outgoing edge
    let paths = [];
    for (let edge of this.graph[node.id.toString()]) {
      let childNode = this.nodes.find((n) => n.id === edge.target.toString());
      let childPaths = this.dfs(childNode, [...path]);
      paths.push(...childPaths);
    }

    return paths;
  }

  findAllPaths() {
    let allPaths = [];
    for (let node of this.nodes) {
      // console.log(node.id.toString());

      let paths = this.dfs(node);
      allPaths.push(...paths);
    }
    return allPaths;
  }

  findAllPathsStartingFromNode(startNodeId) {
    let allPaths = this.findAllPaths();
    return allPaths.filter((path) => path[0] === startNodeId.toString());
  }
}
