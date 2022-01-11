import assert from 'assert';
import { grapher, addEdge, find } from './dijkstra.js';

// 图 G19
const graphOne = grapher();

addEdge('one', 'two', 5, graphOne);
addEdge('one', 'three', 2, graphOne);

addEdge('three', 'two', 8, graphOne);
addEdge('three', 'five', 7, graphOne);

addEdge('two', 'four', 4, graphOne);
addEdge('two', 'five', 2, graphOne);

addEdge('four', 'five', 6, graphOne);
addEdge('four', 'final', 3, graphOne);

addEdge('five', 'final', 1, graphOne);

// 图 G11
const graphFlower = grapher();

graphFlower.acyclic = true;
graphFlower.source = true;

addEdge('one', 'two', 5, graphFlower);
addEdge('one', 'three', 2, graphFlower);

addEdge('three', 'two', 8, graphFlower);
addEdge('three', 'five', 1, graphFlower);

addEdge('two', 'four', 4, graphFlower);
addEdge('two', 'five', 2, graphFlower);

addEdge('four', 'five', 6, graphFlower);
addEdge('four', 'final', 3, graphFlower);
addEdge('four', 'what', 1, graphFlower);

addEdge('five', 'final', 1, graphFlower);
addEdge('five', 'final', 1, graphFlower);

describe('@iyowei/dijkstra', () => {
  it('图 G19 中没有 ID 为 "what" 的节点，`find({ startNode: "one", endNode: "what", graph })`结果应为 "-1"', () => {
    const { path } = find({
      startNode: 'one',
      endNode: 'what',
      graph: graphOne,
    });

    assert.equal(path, null);
  });

  it('图 G19 `find({ startNode: "one", endNode: "what", graph })`结果应为 `["one", "two", "five", "final"]`', () => {
    const { path } = find({
      startNode: 'one',
      endNode: 'final',
      graph: graphOne,
    });

    assert.deepEqual(path, ['one', 'two', 'five', 'final']);
  });
});
