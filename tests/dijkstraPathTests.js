QUnit.module( "DijkstraPath.shortestToTip");
QUnit.test( "path to not existing node is empty", function( assert ) {
	var graph = demoGraphs.singleNode;
	assert.deepEqual(DijkstraPath.shortestToNode(graph.nodes, "notExisting"),[]);
});
Object.keys(demoGraphs).forEach(function(graphName){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(DijkstraPath.shortestToNode(graph.nodes, "tip"),graph.shortestToTip);
	});
});

QUnit.module( "DijkstraPath.longestToTip");
QUnit.test( "path to not existing node is empty", function( assert ) {
	var graph = demoGraphs.singleNode;
	assert.deepEqual(DijkstraPath.longestToNode(graph.nodes, "notExisting"),[]);
});
Object.keys(demoGraphs).forEach(function(graphName){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(DijkstraPath.longestToNode(graph.nodes, "tip"),graph.longestToTip);
	});
});

QUnit.module( "DijkstraPath.longestPossible");
Object.keys(demoGraphs).forEach(function(graphName){
	QUnit.test( graphName, function( assert ) {
		var graph = demoGraphs[graphName];
		assert.deepEqual(DijkstraPath.longestPossible(graph.nodes),graph.longest);
	});
});
