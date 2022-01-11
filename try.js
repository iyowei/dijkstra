/* eslint-disable */

import {
  grapher,
  addEdge,
  find,
  deleteNode,
  deleteDependence,
} from './dijkstra.js';

const graph = grapher();
graph.acyclic = true;
graph.source = true;

addEdge('one', 'two', 5, graph);
addEdge('one', 'three', 2, graph);

addEdge('three', 'two', 8, graph);
addEdge('three', 'five', 1, graph); // 1/7

addEdge('two', 'four', 4, graph);
addEdge('two', 'five', 2, graph);

addEdge('four', 'five', 6, graph);
addEdge('four', 'final', 3, graph);
addEdge('four', 'what', 1, graph); // 多叉树

addEdge('five', 'final', 1, graph);
addEdge('five', 'final', 1, graph); // 重复添加

// deleteNode('two', graph);
// deleteNode('five', graph);

const { path, weight } = find({
  startNode: 'one',
  endNode: 'what',
  graph,
});

console.log(graph);
console.log(graph.content);
console.log('path', path);
console.log('weight', weight);
