QUnit.module( "DijkstraPath.shortestToNode");
QUnit.test( "path to not existing node is empty", function( assert ) {
	var graph = demoGraphs[graphName];
	assert.deepEqual(DijkstraPath.shortestToNode(graph.nodes, "notExisting"),[]);
});
for (var graphName in demoGraphs){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(DijkstraPath.shortestToNode(graph.nodes, "tip"),graph.shortestToTip);
	});
}

QUnit.module( "DijkstraPath.longestToNode");
QUnit.test( "path to not existing node is empty", function( assert ) {
	var graph = demoGraphs[graphName];
	assert.deepEqual(DijkstraPath.longestToNode(graph.nodes, "notExisting"),[]);
});
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
