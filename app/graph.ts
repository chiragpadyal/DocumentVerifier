function dfs(node, graph, path = []) {
  // add current node to path
  path.push(node.id);

  // if node has no outgoing edges, return the current path as a single-element list
  if (!graph[node.id]) {
    return [path];
  }

  // explore each outgoing edge
  let paths = [];
  for (let edge of graph[node.id]) {
    let childNode = nodes.find((n) => n.id === edge.target);
    let childPaths = dfs(childNode, graph, [...path]);
    paths.push(...childPaths);
  }

  return paths;
}

// Example usage
let nodes = [
  {
    id: "1",
    label: "root",
    properties: [],
    connectedTo: [],
    meta: { forceDimensions: false },
    dimension: { width: 48.125, height: 30 },
    position: { x: 44.0625, y: 135 },
    data: { color: "#a27ea8" },
    transform: "translate(20, 120)",
  },
  {
    id: "8",
    label: "database",
    properties: [
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
    ],
    connectedTo: [],
    meta: { forceDimensions: false },
    dimension: { width: 85.9375, height: 30 },
    position: { x: 211.09375, y: 135 },
    data: { color: "#a8385d" },
    transform: "translate(168.125, 120)",
  },
  {
    id: "9",
    label: "input",
    properties: [[Object], [Object], [Object], [Object], [Object]],
    connectedTo: [],
    meta: { forceDimensions: false },
    dimension: { width: 55.25, height: 30 },
    position: { x: 381.6875, y: 35 },
    data: { color: "#7aa3e5" },
    transform: "translate(354.0625, 20)",
  },
  {
    id: "10",
    label: "input",
    properties: [[Object], [Object], [Object], [Object], [Object]],
    connectedTo: [],
    meta: { forceDimensions: false },
    dimension: { width: 55.25, height: 30 },
    position: { x: 381.6875, y: 135 },
    data: { color: "#7aa3e5" },
    transform: "translate(354.0625, 120)",
  },
  {
    id: "11",
    label: "input",
    properties: [[Object], [Object], [Object], [Object], [Object]],
    connectedTo: [],
    meta: { forceDimensions: false },
    dimension: { width: 55.25, height: 30 },
    position: { x: 381.6875, y: 235 },
    data: { color: "#7aa3e5" },
    transform: "translate(354.0625, 220)",
  },
];
let edges = [
  { id: "a", source: 1, target: "8" },
  { id: "a", source: "8", target: "9" },
  { id: "a", source: "8", target: "10" },
  { id: "a", source: "8", target: "11" },
];

// create adjacency list
let graph = {};
for (let edge of edges) {
  if (!graph[edge.source]) {
    graph[edge.source] = [];
  }
  graph[edge.source].push(edge);
}

// perform DFS on each node in the graph
let allPaths = [];
for (let node of nodes) {
  let paths = dfs(node, graph);
  allPaths.push(...paths);
}

console.log(allPaths.filter((path) => path[0] === "1"));
