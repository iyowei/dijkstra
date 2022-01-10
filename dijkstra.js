function updateNodeSource(fromNodeId, forwardNodeId, ins) {
  const forwardSrc = ins.content.get(forwardNodeId).source;
  const fromSrc = ins.content.get(fromNodeId).source;

  if (fromSrc.size > 1) {
    fromSrc.forEach((val) => {
      forwardSrc.add(`${val} - ${forwardNodeId}`);
    });
  } else if (fromSrc.size === 1) {
    forwardSrc.add(`${Array.from(fromSrc)[0]} - ${forwardNodeId}`);
  } else {
    forwardSrc.add(`${fromNodeId} - ${forwardNodeId}`);
  }
}

function createOrUpdateFromNode(ins, fromNodeId, forwardNodeId, weight) {
  if (!ins.content.get(fromNodeId)) {
    const depth = 1;
    const payload = {
      childs: new Map(
        Object.entries({
          [forwardNodeId]: weight,
        }),
      ),
      parent: new Set(),
      depth,
    };

    if (ins.source) {
      payload.source = new Set();
    }

    ins.groupByDepth.set(depth, new Set([fromNodeId]));

    ins.content.set(fromNodeId, payload);
  } else {
    ins.content.get(fromNodeId).childs.set(forwardNodeId, weight);
  }
}

function createOrUpdateForwardNode(ins, fromNodeId, forwardNodeId) {
  if (!ins.content.get(forwardNodeId)) {
    const depth = ins.content.get(fromNodeId).depth + 1;

    const payload = {
      childs: new Map(),
      parent: new Set([fromNodeId]),
      depth,
    };

    if (ins.source) {
      payload.source = new Set();
    }

    ins.content.set(forwardNodeId, payload);

    if (!ins.groupByDepth.has(depth)) {
      ins.groupByDepth.set(depth, new Set([forwardNodeId]));
    } else {
      ins.groupByDepth.get(depth).add(forwardNodeId);
    }
  } else if (
    ins.content.get(forwardNodeId) &&
    ins.content.get(forwardNodeId).parent.size !== 0
  ) {
    ins.content.get(forwardNodeId).parent.add(fromNodeId);
  }
}

// TODO: 可重复设置吗？
export function addEdge(fromNodeId, forwardNodeId, weight, ins) {
  if (ins.content.size === 0) {
    ins.sourceNode = fromNodeId;
  }

  // 不合法：权重不可以是负的
  if (!weight) {
    return -1;
  }

  // 不合法：如果 content 不是空的，但 fromNodeId 并不存在
  // 确保是多叉树
  if (ins.content.size !== 0 && !ins.content.get(fromNodeId)) {
    // console.log(`不合法：${fromNodeId} 节点不存在`);
    return -1;
  }

  /**
   * 无环：确保指向节点不在开始节点的父节点上
   * 1. 开始节点历史路径只有一个，其包含指向节点，不合法
   * 2. 开始节点历史路径有多个，其中之一包含指向节点，不合法
   * 3. 开始节点无历史路径，合法
   */
  if (ins.acyclic && ins.content.size !== 0) {
    // console.log(detect(fromNodeId, forwardNodeId, ins));
    if (detect(fromNodeId, forwardNodeId, ins) === -1) {
      return -1;
    }
  }

  /**
   * 合法,
   *
   * - 被指向节点还没有权重记录，说明它还没有被连接过
   *   - 条件 `!ins.content.get(forwardNodeId)`
   *   - 新建被指向节点的空权重记录
   *   - 更新开始节点的子节点记录
   *
   * - 被指向节点有权重记录，但其中没有指向开始节点的权重记录
   *   - 条件 `!ins.content.get(forwardNodeId)[fromNodeId]`
   *   - 更新开始节点的子节点记录
   */

  // 创建 / 更新开始节点
  createOrUpdateFromNode(ins, fromNodeId, forwardNodeId, weight);

  // 创建 / 更新结束节点
  createOrUpdateForwardNode(ins, fromNodeId, forwardNodeId);

  // 更新图深度
  if (ins.content.get(forwardNodeId).depth > ins.depth) {
    ins.depth = ins.content.get(forwardNodeId).depth;
  }

  // 创建结束节点溯源记录
  if (ins.source) {
    updateNodeSource(fromNodeId, forwardNodeId, ins);
  }

  return 1;
}

export function grapher() {
  return {
    content: new Map(),
    order: new Map(),
    pathCosts: new Map(),
    sourceNode: undefined,
    processed: new Set(),
    source: false,
    acyclic: false,
    depth: 0,
    groupByDepth: new Map(),
  };
}

function getCheapestNode(ins) {
  let tmpCost = Number.POSITIVE_INFINITY;
  let tmpNode = null;

  // TODO: 1000 条数据的话，难道遍历 1000 次么
  ins.pathCosts.forEach((nodeCost, nodeName) => {
    /**
     * costs = [ [ 'two', 5 ], [ 'five', 9 ] ]
     * 一旦 two 被设置到 tmpCost 中，因为 nodeCost < tmpCost 才会更新 tmpCost，而 five 节点
     * 的消耗大于最新的 tmpcost 所以不会更新 tmpCost，进而确保每次返回的都是最小消耗节点
     *
     * nodeCost 与 tmpCost 也不会更新 tmpCost，既然是一样的，的确没必要更新
     */
    if (nodeCost < tmpCost && !ins.processed.has(nodeName)) {
      tmpCost = nodeCost;
      tmpNode = nodeName;
    }
  });

  return [tmpNode, tmpCost];
}

// 查找最短路径时的副作用
function findEffect(neighbor, cheapestNode, ins) {
  const [cheapestNodeName, cheapestNodeCost] = cheapestNode;

  const [neighborName, neighborCost] = neighbor;

  let newPathCost = cheapestNodeCost + neighborCost;
  /**
   * 如果邻居还没有消耗记录，或者，邻居有消耗记录，但是它的
   * 消耗比 "当前节点的权重 + 该邻居的权重" 总和大
   */
  if (
    !ins.pathCosts.get(neighborName) ||
    ins.pathCosts.get(neighborName) > newPathCost
  ) {
    if (ins.pathCosts.get(neighborName)) {
      console.log(`${neighborName} 已有路径消耗记录`);
    }

    if (!ins.pathCosts.get(neighborName)) {
      console.log(`${neighborName} 没有路径消耗记录，初始化`);
    }

    if (ins.pathCosts.get(neighborName) > newPathCost) {
      console.log(
        `${neighborName} 的既有消耗记录是 ${ins.pathCosts.get(
          neighborName,
        )}，比目前最少权重节点 ${cheapestNodeName}（${cheapestNodeCost}） + 它到 ${neighborName} 节点的消耗（${neighborCost}）还要大，所以更新为后者之和 ${newPathCost}`,
      );
    }

    ins.pathCosts.set(neighborName, newPathCost); // 添加/更新邻居的消耗
    ins.order.set(neighborName, cheapestNodeName); // 键先值后，即：当前节点被排在该邻居的后头，记录导致该消耗的前一个节点是谁
    // 当前节点到它的邻居们，找出最小消耗的组合，记录这个组合，以及消耗值
  }
}

export function find({ startNode, endNode, graph: ins }) {
  ins.pathCosts = ins.content.get(startNode).childs;
  let cheapestNode = getCheapestNode(ins);

  let loop = 0;
  while (cheapestNode[0] !== null) {
    loop++;
    console.log(`start ${loop}`);

    const cheapestNodeName = cheapestNode[0];

    console.log('cheapestNodeName', cheapestNodeName);

    const cheapestNodeNeighbors = ins.content.get(cheapestNodeName).childs;

    console.log('cheapestNodeNeighbors', cheapestNodeNeighbors);

    if (cheapestNodeNeighbors.size === 0) {
      console.log('最少权重路径终点没有邻居了，也没必要爬别的节点了');
      break;
    }

    if (cheapestNodeNeighbors.size === 1) {
      console.log(`最少权重路径终点 ${cheapestNodeName} 有 1 个邻居`);
      // TODO: 但，"2 次数据转换"，"1 次循环"，两者哪个更耗时呢？
      const neighbor = Object.entries(
        Object.fromEntries(cheapestNodeNeighbors),
      )[0];

      findEffect(neighbor, cheapestNode, ins);
    }

    if (cheapestNodeNeighbors.size > 1) {
      console.log(`最少权重路径终点 ${cheapestNodeName} 有多个邻居`);
      cheapestNodeNeighbors.forEach((neighborCost, neighborName) => {
        findEffect([neighborName, neighborCost], cheapestNode, ins);
      });
    }

    console.log(`标记已爬过的节点 ${cheapestNodeName}`);
    ins.processed.add(cheapestNodeName);

    console.log(
      '目前的可用权重记录',
      new Map(
        Object.entries(Object.fromEntries(ins.pathCosts)).filter(
          (cur) => !ins.processed.has(cur[0]),
        ),
      ),
    );

    console.log('完整权重记录', ins.pathCosts);

    if (cheapestNodeName === endNode) {
      console.log(`最实惠的路径终点即 ${endNode}，没必要爬别的节点了`);
      break;
    }

    cheapestNode = getCheapestNode(ins); // 找到消耗记录里消耗最少的节点
    console.log(
      `已爬过节点 ${cheapestNodeName}，接下来爬 ${cheapestNode[0]} \n`,
    );
  }

  return {
    get path() {
      if (
        ins.content.get(endNode).depth - ins.content.get(startNode).depth ===
        1
      ) {
        // 深度相邻
        return [startNode, endNode];
      }

      if (!ins.order.has(endNode)) {
        // 未找到最短路径
        return -1;
      }

      const road = [endNode];

      let s = ins.order.get(endNode);

      while (s) {
        road.unshift(s);
        s = ins.order.get(s);
      }

      road.unshift(startNode);

      return road;
    },
    qz: ins.pathCosts.get(endNode),
  };
}

export function deleteNode(nodeId, ins) {
  // console.log(`正在删除 ${nodeId} 节点`);
  // console.log(`检测 ${nodeId} 节点是否在图中`);
  // console.log(`检测 ${nodeId} 节点是不是顶点`);
  if (ins.content.has(nodeId) && ins.sourceNode !== nodeId) {
    // console.log(`${nodeId} 节点在图中，且不是顶点`);

    // console.log("删除包含当前节点的父节点的子节点记录");
    const parents = Array.from(ins.content.get(nodeId).parent);

    if (parents.length !== 0 && parents.length > 1) {
      parents.forEach((cur) => {
        ins.content.get(cur).childs.delete(nodeId);
      });
    }

    if (parents.length !== 0 && parents.length === 1) {
      ins.content.get(parents[0]).childs.delete(nodeId);
    }

    // console.log("删除以当前节点为父节点的子节点的父节点记录");
    const childs = ins.content.get(nodeId).childs;
    childs.forEach((val, key) => {
      // console.log(nodeId);
      ins.content.get(key).parent.delete(nodeId);
    });

    // console.log("删除当前节点记录");
    ins.content.delete(nodeId);

    // TODO: 清空 ROAD、ORDER、PATH_COSTS

    if (ins.content.size === 1) {
      // console.log("删除完当前节点后图中只有 1 个节点了，所以直接清空");
      ins.content.clear();
    }

    return 1;
  }

  // console.log(`${nodeId} 节点要么不在图中，要么是顶点，不可进行删操作`);
  return -1;
}

export function deleteDependence(nodeOneId, nodeTwoId, ins) {
  if (ins.content.size === 2) {
    // console.log("deleteDependence: 目前就 2 个节点，直接清空了");
    ins.content.clear();
    return;
  }

  // console.log("deleteDependence: 检查俩节点是不是相邻的");
  const theOne = ins.content.get(nodeOneId);
  const does = [
    theOne.parent.has(nodeTwoId),
    theOne.childs.has(nodeTwoId),
  ].some((cur) => cur === true);

  if (!does) {
    // console.log("deleteDependence: 不相邻，退出");
    return -1;
  }

  // console.log("deleteDependence: 是相邻的，继续");

  // console.log("deleteDependence: 检测哪个是父节点哪个是子节点中...");
  const tmp = {
    parent: undefined,
    child: undefined,
  };

  if (ins.content.get(nodeOneId).childs.has(nodeTwoId)) {
    tmp.parent = nodeOneId;
    tmp.child = nodeTwoId;
  }

  if (ins.content.get(nodeOneId).parent.has(nodeTwoId)) {
    tmp.parent = nodeTwoId;
    tmp.child = nodeOneId;
  }

  // console.log(
  //   `deleteDependence: 检测到父节点是 "${tmp.parent}" 子节点是 "${tmp.child}"`
  // );

  // console.log(`deleteDependence: 检测节点 "${tmp.child}" 有没有子节点`);
  const childsFromGivenChildNode = ins.content.get(tmp.child).childs;
  if (childsFromGivenChildNode.size === 0) {
    //! 测试用例 G3，deleteDependence('one', 'two')

    // console.log(
    //   `deleteDependence: 检测节点 "${tmp.child}" 没有子节点，删除 "${tmp.child}" 节点`
    // );
    deleteNode(ins.content, tmp.child);
  } else {
    // console.log(`deleteDependence: 节点 "${tmp.child}" 有子节点`);

    if (childsFromGivenChildNode.size === 1) {
      //! 测试用例 G8，deleteDependence('two', 'three')

      // console.log(`deleteDependence: 节点 "${tmp.child}" 只有 1 个子节点`);
      const childNodeId = Object.entries(
        Object.fromEntries(childsFromGivenChildNode),
      )[0][0];

      // console.log("检查这个子节点有没有其它父节点，没有的话，就不能删除 A");
      if (ins.content.get(childNodeId).parent.size > 1) {
        // console.log("可删 A");
        deleteNode(ins.content, tmp.child);
      } else {
        // console.log("不可删 A");
        return -1;
      }
    } else if (childsFromGivenChildNode.size > 1) {
      //! 测试用例 G9，deleteDependence('two', 'three')

      // console.log(`deleteDependence: 节点 "${tmp.child}" 有多个子节点`);

      // console.log(
      //   `deleteDependence: 遍历 "${tmp.child}" 的所有子节点，只要发现有一个子节点的父节点就只有 1 个，就说明不能删除 "${tmp.child}" 节点`
      // );

      const mapIter = childsFromGivenChildNode.entries();

      let can = 1;

      for (let i = 0; i < childsFromGivenChildNode.size; i++) {
        if (ins.content.get(mapIter.next().value[0]).parent.size <= 1) {
          can = -1;
          break;
        }
      }

      if (can === -1) {
        // console.log(`deleteDependence: 不可删 "${tmp.child}" 节点`);
        return -1;
      } else {
        // console.log(`deleteDependence: 可删 "${tmp.child}" 节点`);
        deleteNode(ins.content, tmp.child);
      }
    }
  }

  return 1;
}

export function detect(fromNodeId, forwardNodeId, ins) {
  let tmp = 1;
  let n = 0;

  const parents = ins.content.get(fromNodeId).parent;
  const entries = parents.entries();

  while (parents.size !== 0 && n < parents.size) {
    if (Array.from(parents).indexOf(forwardNodeId) !== -1) {
      tmp = -1;
      break;
    }
    const parentNodeId = entries.next().value[0];
    const s = detect(parentNodeId, forwardNodeId, ins);

    if (s === -1) {
      tmp = -1;
      break;
    }

    n++;
  }

  return tmp;
}
