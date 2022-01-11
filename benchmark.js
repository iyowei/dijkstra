/* eslint-disable */

import Benchmark from 'benchmark';
import { grapher, addEdge, find } from './dijkstra.js';

const graph = grapher();
graph.acyclic = true;
graph.source = true;

addEdge('one', 'two', 5, graph);
addEdge('one', 'three', 2, graph);
addEdge('three', 'two', 8, graph);

addEdge('three', 'five', 7, graph);

addEdge('two', 'four', 4, graph);

addEdge('two', 'five', 2, graph);
addEdge('four', 'five', 6, graph);

addEdge('four', 'final', 3, graph);

addEdge('five', 'final', 1, graph);

const foundShortestPath = find({
  startNode: 'one',
  endNode: 'final',
  graph,
});

new Benchmark.Suite()
  .add('dijkstra',  () => {
    find({
      startNode: 'one',
      endNode: 'final',
      graph,
    });
  })
  .add('path',  () => {
    foundShortestPath.path;
  })
  .on('cycle',  (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
