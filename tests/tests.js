QUnit.module( "shortestPathToTipDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(shortestPathToTipDijkstra(graph.nodes),graph.shortestToTip);
	});
}

QUnit.module( "longestPathToTipDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(longestPathToTipDijkstra(graph.nodes),graph.longestToTip);
	});
}


QUnit.module( "longestPathDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(longestPathDijkstra(graph.nodes),graph.longest);
	});
}
