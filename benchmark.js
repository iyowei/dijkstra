/* eslint-disable */

import Benchmark from 'benchmark';
import {
  grapher,
  addEdge,
  find,
  deleteNode,
  deleteDependence,
  detect,
} from './dijkstra.js';

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

const SUITE = new Benchmark.Suite();

SUITE.add('dijkstra', function () {
  find({
    startNode: 'one',
    endNode: 'finals',
    graph,
  });
})
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run({ async: true });
