import assert from 'assert';
import { grapher, addEdge, find, deleteDependence } from './dijkstra.js';

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
    // 图 G19
    const grapherInstance = grapher();

    addEdge('one', 'two', 5, grapherInstance);
    addEdge('one', 'three', 2, grapherInstance);

    addEdge('three', 'two', 8, grapherInstance);
    addEdge('three', 'five', 7, grapherInstance);

    addEdge('two', 'four', 4, grapherInstance);
    addEdge('two', 'five', 2, grapherInstance);

    addEdge('four', 'five', 6, grapherInstance);
    addEdge('four', 'final', 3, grapherInstance);

    addEdge('five', 'final', 1, grapherInstance);

    const { path } = find({
      startNodeId: 'one',
      endNodeId: 'what',
      grapherInstance,
    });

    assert.equal(path, null);
  });

  it('图 G19 `find({ startNode: "one", endNode: "what", graph })`结果应为 `["one", "two", "five", "final"]`', () => {
    // 图 G19
    const grapherInstance = grapher();

    addEdge('one', 'two', 5, grapherInstance);
    addEdge('one', 'three', 2, grapherInstance);

    addEdge('three', 'two', 8, grapherInstance);
    addEdge('three', 'five', 7, grapherInstance);

    addEdge('two', 'four', 4, grapherInstance);
    addEdge('two', 'five', 2, grapherInstance);

    addEdge('four', 'five', 6, grapherInstance);
    addEdge('four', 'final', 3, grapherInstance);

    addEdge('five', 'final', 1, grapherInstance);

    const { path } = find({
      startNodeId: 'one',
      endNodeId: 'final',
      grapherInstance,
    });

    assert.deepEqual(path, ['one', 'two', 'five', 'final']);
  });

  it('图 G19 尝试删除 "two" 节点到 "four" 关联，可删', () => {
    // 图 G19
    const grapherInstance = grapher();

    addEdge('one', 'two', 5, grapherInstance);
    addEdge('one', 'three', 2, grapherInstance);

    addEdge('three', 'two', 8, grapherInstance);
    addEdge('three', 'five', 7, grapherInstance);

    addEdge('two', 'four', 4, grapherInstance);
    addEdge('two', 'five', 2, grapherInstance);

    addEdge('four', 'five', 6, grapherInstance);
    addEdge('four', 'final', 3, grapherInstance);

    addEdge('five', 'final', 1, grapherInstance);

    deleteDependence('two', 'four', grapherInstance);

    assert.equal(grapherInstance.content.has('four'), false);
  });
});
