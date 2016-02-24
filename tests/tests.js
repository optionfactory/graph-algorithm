QUnit.module( "shortestPathDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(shortestPathDijkstra(graph.nodes),graph.shortest);
	});
}

QUnit.module( "longestPathDijkstra");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(longestPathDijkstra(graph.nodes),graph.longest);
	});
}
