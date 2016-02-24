QUnit.module("coordinatesCalculation");
/*Object.keys(demoGraphs).forEach(function(graphName){
	console.log(graphName);
    QUnit.test("all " + graphName + " nodes have coordinates", function(assert) {
        var graph = demoGraphs[graphName];
        var coords = calculateCoordinates(graph);
        var untouchedNodes = coords.filter(function(node) {
            return node.x === undefined && node.y === undefined;
        });
        console.log(graph, coords, untouchedNodes, untouchedNodes.length);
        assert.deepEqual(untouchedNodes.length, 0);
    });
})
*/