/* eslint-disable */

import {
  grapher,
  addEdge,
  find,
  deleteNode,
  deleteDependence,
} from './dijkstra.js';

const grapherInstance = grapher();
grapherInstance.acyclic = true;
grapherInstance.source = true;

addEdge('one', 'two', 5, grapherInstance);
addEdge('one', 'three', 2, grapherInstance);

addEdge('three', 'two', 8, grapherInstance);
addEdge('three', 'five', 1, grapherInstance); // 1/7

addEdge('two', 'four', 4, grapherInstance);
addEdge('two', 'five', 2, grapherInstance);

addEdge('four', 'five', 6, grapherInstance);
addEdge('four', 'final', 3, grapherInstance);
addEdge('four', 'what', 1, grapherInstance); // 多叉树

addEdge('five', 'final', 1, grapherInstance);
addEdge('five', 'final', 1, grapherInstance); // 重复添加

// deleteNode('two', grapherInstance);
// deleteNode('five', grapherInstance);

const { path, weight } = find({
  startNode: 'one',
  endNode: 'what',
  grapherInstance,
});

console.log(grapherInstance);
console.log(grapherInstance.content);
console.log('path', path);
console.log('weight', weight);
