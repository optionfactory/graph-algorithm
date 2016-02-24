QUnit.test( "shortestPathDijkstra", function( assert ) {
  assert.deepEqual(shortestPathDijkstra(demoGraphs.singleNode),["tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.twoNodes),["root", "tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.threeNodes),["root", "node1", "tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.fourNodes),["root", "node1", "node2", "tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.forkAtRoot),["root", "tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.forkAtFirstLeaf),["root", "node1", "tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.forkAndMerge),["root", "br2", "tip"]);

  assert.deepEqual(shortestPathDijkstra(demoGraphs.forkAtRootLongerBranch),["root", "br1n1", "tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.forkAtFirstLeafLongerBranch),["root", "node1", "br1n1", "tip"]);
  assert.deepEqual(shortestPathDijkstra(demoGraphs.forkAndMergeLongerBranch),["root", "br2", "tip"]);
});