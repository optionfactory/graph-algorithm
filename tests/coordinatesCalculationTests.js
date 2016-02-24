QUnit.module("coordinatesCalculation");
for (var graphName in demoGraphs) {
    QUnit.test("all " + graphName + " nodes have coordinates", function(assert) {
        var graph = demoGraphs[graphName];
        var coords = calculateCoordinates(graph);
        var untouchedNodes = coords.filter(function(node) {
            return node.x === undefined && node.y === undefined;
        });
        console.log(coords, untouchedNodes, untouchedNodes.length);

        assert.deepEqual(untouchedNodes.length, 0);
    });
}
