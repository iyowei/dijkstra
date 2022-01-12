# @iyowei/dijkstra

找到两个顶点之间的最短路径。

- [x] 现代化；
- [x] 高性能；
- [x] 包含 "单源、有向、无环、无负权、多叉树" 图的编辑、最短路径查询等函数；
- [x] Treeshaking 友好；
- [x] 充分测试；

## 使用

```js
import { log } from 'console';
import { grapher, addEdge, find } from '@iyowei/dijkstra';

const grapherInstance = grapher();

addEdge('one', 'two', 5, graph);
addEdge('one', 'three', 2, graph);

addEdge('three', 'two', 8, graph);
addEdge('three', 'five', 7, graph);

addEdge('two', 'four', 4, graph);
addEdge('two', 'five', 2, graph);

addEdge('four', 'five', 6, graph);
addEdge('four', 'final', 3, graph);

addEdge('five', 'final', 1, graph);

const { path } = find({
  startNode: 'one',
  endNode: 'final',
  grapherInstance,
});

log(path); // ['one', 'two', 'five', 'final']
```

## APIs

### `grapher()`

初始化实例数据，支持多实例。

### `addEdge(parentNodeId, childNodeId, weight, grapherInstance)`

- `parentNodeId` { String } 父节点 ID
- `childNodeId` { String } 子节点 ID
- `weight` { Number } 权重
- `grapherInstance` 使用 `grapher()` 创建的图实例
- 返回 { Number } 添加权重成功与否，`1` 表示成功，`-1` 表示操作失败

向图中增加新的权重关系。

### `find({ startNodeId, endNodeId, grapherInstance })`

- `startNodeId` { String } 开始节点 ID
- `endNodeId` { String } 结束节点 ID
- `grapherInstance` 使用 `grapher()` 创建的图实例
- 返回 { Object }
  - `path` { Array } 最短路径
  - `weight` { Array } 最短路径权重

指定开始节点、结束节点，寻找它们的最短路径。

### `isAcyclic(startNodeId, endNodeId, grapherInstance)`

- `startNodeId` { String } 开始节点 ID
- `endNodeId` { String } 结束节点 ID
- `grapherInstance` 使用 `grapher()` 创建的图实例
- 返回 { Boolean }
  - `true` 无环
  - `false` 回环

指定开始节点、结束节点，检查是否回环。

### `deleteNode(nodeId, grapherInstance)`

- `nodeId` { String } 节点 ID
- `grapherInstance` 使用 `grapher()` 创建的图实例
- 返回 { Number } 删除节点成功与否，`1` 表示成功，`-1` 表示操作失败

删除指定节点。

### `deleteDependence(startNodeId, endNodeId, grapherInstance)`

- `startNodeId` { String } 开始节点 ID
- `endNodeId` { String } 结束节点 ID
- `grapherInstance` 使用 `grapher()` 创建的图实例
- 返回 { Number } 删除节点成功与否，`1` 表示成功，`-1` 表示操作失败

删除指定节点间的权重。

## 安装

<!-- 标明支持的宿主、宿主版本，模块类型 -->

![esm][esm] [![Node Version Badge][node version badge]][download node.js] ![browser][browser]

### NPM

```shell
npm add @iyowei/dijkstra
```

### PNPM

```shell
pnpm add @iyowei/dijkstra
```

### Yarn

```shell
yarn add @iyowei/dijkstra
```

## 相关

## 参与贡献

![PRs Welcome][prs welcome badge]

## 其它

"@iyowei/dijkstra" 使用 [@iyowei/create-esm][create-esm] 脚手架生成。

[browser]: https://img.shields.io/badge/Browser-orange?style=flat
[node version badge]: https://img.shields.io/badge/node.js-%3E%3D12.20.0-brightgreen?style=flat&logo=Node.js
[download node.js]: https://nodejs.org/en/download/
[esm]: https://img.shields.io/badge/ESM-brightgreen?style=flat
[prs welcome badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat
[create-esm]: https://github.com/iyowei/create-esm

<!-- 更多文档细节，参考 https://github.com/iyowei/readme-templates -->

<!-- ## 性能

```shell
dijkstra x 1,423,100 ops/sec ±1.41% (91 runs sampled)
``` -->
