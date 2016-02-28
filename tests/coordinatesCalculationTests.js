QUnit.module("Coordinates.Calculation");
Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName + ": all nodes have coordinates", function(assert) {
        var graph = demoGraphs[graphName];
        var coords = calculateCoordinates(graph, 0, 0);
        var untouchedNodes = coords.filter(function(node) {
            return node.x === undefined && node.y === undefined;
        });
        assert.equal(untouchedNodes.length, 0);
    });
    QUnit.test(graphName + ": no two nodes on the same coordinates", function(assert) {
        var graph = demoGraphs[graphName];
        var coords = calculateCoordinates(graph);
        var nodesAndClashes = coords.map(function(node) {
            return {
                node: node,
                clashingNodesIds: coords.filter(function(otherNode) {
                    //search nodes with different id, but same coordinates
                    return otherNode.id !== node.id && otherNode.x === node.x && otherNode.y === node.y;
                }).map(graphs.toId)
            }
        })
        assert.ok(!nodesAndClashes.some(function(nodeAndClashes){return nodeAndClashes.clashingNodesIds.length!==0}))
    });
})
