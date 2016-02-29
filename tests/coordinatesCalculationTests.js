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
        assert.ok(!nodesAndClashes.some(function(nodeAndClashes) {
            return nodeAndClashes.clashingNodesIds.length !== 0
        }))
    });
})
QUnit.module("Coordinates.navigateForwardAndDetachChunk");
var testCases = {
    closeBothEnds: {
        nodes: [{
            id: "a1",
            x: 0,
            y: 0,
            parents: []

        }, {
            id: "a2",
            x: undefined,
            y: undefined,
            parents: ["a1"]
        }, {
            id: "a3",
            x: 0,
            y: 0,
            parents: ["a2"]
        }],
        pathToExplore: ["a1", "a2", "a3"],
        startingPoint: "a1",
        expectedPath: ["a2"],
        expectedParents: {a1: [], a2: [], a3: []}
    }
}
Object.keys(testCases).forEach(function(testCaseName) {
    QUnit.test("correct subpath is extracted for test case '" + testCaseName + "'", function(assert) {
        var testCase = testCases[testCaseName];
        var got = navigateForwardAndDetachChunk(testCase.nodes, testCase.pathToExplore, testCase.startingPoint);
        var expected = testCase.expectedPath;
        assert.deepEqual(got, expected);
    });
});
