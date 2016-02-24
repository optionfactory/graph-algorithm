QUnit.module( "shortestPathToTipDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(Dijkstra.shortestPathToNode(graph.nodes, "tip"),graph.shortestToTip);
	});
}

QUnit.module( "longestPathToTipDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(Dijkstra.longestPathToNode(graph.nodes, "tip"),graph.longestToTip);
	});
}

QUnit.module( "longestPathDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(Dijkstra.longestPathPossible(graph.nodes),graph.longest);
	});
}
