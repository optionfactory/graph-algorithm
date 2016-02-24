QUnit.module( "DijkstraPath.shortestToNode");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(DijkstraPath.shortestToNode(graph.nodes, "tip"),graph.shortestToTip);
	});
}

QUnit.module( "DijkstraPath.longestToNode");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(DijkstraPath.longestToNode(graph.nodes, "tip"),graph.longestToTip);
	});
}

QUnit.module( "DijkstraPath.longestPossible");
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(DijkstraPath.longestPossible(graph.nodes),graph.longest);
	});
}
