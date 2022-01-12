/* eslint-disable */

import Benchmark from 'benchmark';
import { grapher, addEdge, find } from './dijkstra.js';

const grapherInstance = grapher();
grapherInstance.acyclic = true;
grapherInstance.source = true;

addEdge('one', 'two', 5, grapherInstance);
addEdge('one', 'three', 2, grapherInstance);
addEdge('three', 'two', 8, grapherInstance);

addEdge('three', 'five', 7, grapherInstance);

addEdge('two', 'four', 4, grapherInstance);

addEdge('two', 'five', 2, grapherInstance);
addEdge('four', 'five', 6, grapherInstance);

addEdge('four', 'final', 3, grapherInstance);

addEdge('five', 'final', 1, grapherInstance);

const foundShortestPath = find({
  startNode: 'one',
  endNode: 'final',
  grapherInstance,
});

new Benchmark.Suite()
  .add('find', () => {
    find({
      startNode: 'one',
      endNode: 'final',
      grapherInstance,
    });
  })
  .add('path', () => {
    foundShortestPath.path;
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
