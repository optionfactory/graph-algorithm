QUnit.module("Coordinates.Calculation");
Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName + ": all nodes have coordinates", function(assert) {
        var graph = demoGraphs[graphName];
        var coords = calculateCoordinates(graph.nodes, 0, 0);
        var untouchedNodes = coords.filter(function(node) {
            return node.x === undefined && node.y === undefined;
        });
        assert.equal(untouchedNodes.length, 0);
    });
    QUnit.test(graphName + ": no two nodes on the same coordinates", function(assert) {
        var graph = demoGraphs[graphName];
        var coords = calculateCoordinates(graph.nodes);
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

function getPathNavigationTestCases() {
    return {
        //p = placed, f = floating
        pffp: {
            nodes: [{
                id: "p1",
                x: 0,
                y: 0,
                parents: []

            }, {
                id: "f1",
                x: undefined,
                y: undefined,
                parents: ["p1"]
            }, {
                id: "f2",
                x: undefined,
                y: undefined,
                parents: ["f1"]
            }, {
                id: "p2",
                x: 0,
                y: 0,
                parents: ["f2"]
            }],
            pathToExplore: ["p1", "f1", "f2", "p2"],
            forward: {
                startingPoint: "p1",
                expectedPath: ["f1", "f2"],
                expectedParents: { p1: [], f1: [], f2: [], p2: [] }
            },
            backwards: {
                endingPoint: "p2",
                expectedPath: ["f1", "f2"],
                expectedParents: { p1: [], f1: [], f2: [], p2: [] }
            }
        },
        //p = placed, f = floating
        pffpf: {
            nodes: [{
                id: "p1",
                x: 0,
                y: 0,
                parents: []

            }, {
                id: "f1",
                x: undefined,
                y: undefined,
                parents: ["p1"]
            }, {
                id: "f2",
                x: undefined,
                y: undefined,
                parents: ["f1"]
            }, {
                id: "p2",
                x: 0,
                y: 0,
                parents: ["f2"]
            }, {
                id: "f3",
                x: undefined,
                y: undefined,
                parents: ["p2"]
            }],
            pathToExplore: ["p1", "f1", "f2", "p2", "f3"],
            forward: {
                startingPoint: "p1",
                expectedPath: ["f1", "f2"],
                expectedParents: { p1: [], f1: [], f2: [], p2: [], f3: ["p2"] }
            },
            backwards: {
                endingPoint: "p2",
                expectedPath: ["f1", "f2"],
                expectedParents: { p1: [], f1: [], f2: [], p2: [], f3: ["p2"] }
            }
        },
        //p = placed, f = floating
        pff: {
            nodes: [{
                id: "p1",
                x: 0,
                y: 0,
                parents: []

            }, {
                id: "f1",
                x: undefined,
                y: undefined,
                parents: ["p1"]
            }, {
                id: "f2",
                x: undefined,
                y: undefined,
                parents: ["f1"]
            }],
            pathToExplore: ["p1", "f1", "f2"],
            forward: {
                startingPoint: "p1",
                expectedPath: ["f1", "f2"],
                expectedParents: { p1: [], f1: [], f2: [] }
            },
            backwards: {
                endingPoint: "p1",
                expectedPath: [],
                expectedParents: { p1: [], f1: ["p1"], f2: ["f1"] }
            }
        },
        //p = placed, f = floating
        ffp: {
            nodes: [{
                id: "f1",
                x: undefined,
                y: undefined,
                parents: []
            }, {
                id: "f2",
                x: undefined,
                y: undefined,
                parents: ["f1"]
            }, {
                id: "p1",
                x: 0,
                y: 0,
                parents: ["f2"]

            }],
            pathToExplore: ["f1", "f2", "p1"],
            forward: {
                startingPoint: "p1",
                expectedPath: [],
                expectedParents: { f1: [], f2: ["f1"], p1: ["f2"] }
            },
            backwards: {
                endingPoint: "p1",
                expectedPath: ["f1", "f2"],
                expectedParents: { f1: [], f2: [], p1: [] }
            }
        },
        fpffpf: {
            nodes: [{
                id: "f1",
                x: undefined,
                y: undefined,
                parents: []
            }, {
                id: "p1",
                x: 0,
                y: 0,
                parents: ["f1"]
            }, {
                id: "f2",
                x: undefined,
                y: undefined,
                parents: ["p1"]
            }, {
                id: "f3",
                x: undefined,
                y: undefined,
                parents: ["f2"]
            }, {
                id: "p2",
                x: 0,
                y: 0,
                parents: ["f3"]
            }, {
                id: "f4",
                x: undefined,
                y: undefined,
                parents: ["p2"]
            }],
            pathToExplore: ["f1", "p1", "f2", "f3", "p2", "f4"],
            forward: {
                startingPoint: "p1",
                expectedPath: ["f2", "f3"],
                expectedParents: { f1: [], p1: ["f1"], f2: [], f3: [], p2: [], f4: ["p2"] }
            },
            backwards: {
                endingPoint: "p2",
                expectedPath: ["f2", "f3"],
                expectedParents: { f1: [], p1: ["f1"], f2: [], f3: [], p2: [], f4: ["p2"] }
            }
        }
    }
}
var pathNavigationTestCases = getPathNavigationTestCases();
Object.keys(pathNavigationTestCases).forEach(function(testCaseName) {
    var testCase = pathNavigationTestCases[testCaseName];
    QUnit.test("correct forward subpath is extracted for test case '" + testCaseName + "'", function(assert) {
        var got = navigateForwardAndDetachChunk(testCase.nodes, testCase.pathToExplore, testCase.forward.startingPoint);
        var expected = testCase.forward.expectedPath;
        assert.deepEqual(got, expected);
    });
});

var pathNavigationTestCases = getPathNavigationTestCases();
Object.keys(pathNavigationTestCases).forEach(function(testCaseName) {
    var testCase = pathNavigationTestCases[testCaseName];
    QUnit.test("all parents are updated correctly for test case '" + testCaseName + "'", function(assert) {
        var result = navigateForwardAndDetachChunk(testCase.nodes, testCase.pathToExplore, testCase.forward.startingPoint);
        var expected = testCase.forward.expectedParents;
        Object.keys(expected).forEach(function(nodeId) {
            assert.deepEqual(testCase.nodes.find(graphs.byId(nodeId)).parents, expected[nodeId], "for node " + nodeId);
        })
    });
});
QUnit.module("Coordinates.navigateBackwardsAndDetachChunk");

var pathNavigationTestCases = getPathNavigationTestCases();
Object.keys(pathNavigationTestCases).forEach(function(testCaseName) {
    var testCase = pathNavigationTestCases[testCaseName];
    QUnit.test("correct forward subpath is extracted for test case '" + testCaseName + "'", function(assert) {
        var got = navigateBackwardsAndDetachChunk(testCase.nodes, testCase.pathToExplore, testCase.backwards.endingPoint);
        var expected = testCase.backwards.expectedPath;
        assert.deepEqual(got, expected);
    });
});

var pathNavigationTestCases = getPathNavigationTestCases();
Object.keys(pathNavigationTestCases).forEach(function(testCaseName) {
    var testCase = pathNavigationTestCases[testCaseName];
    QUnit.test("all parents are updated correctly for test case '" + testCaseName + "'", function(assert) {
        var result = navigateBackwardsAndDetachChunk(testCase.nodes, testCase.pathToExplore, testCase.backwards.endingPoint);
        var expected = testCase.backwards.expectedParents;
        Object.keys(expected).forEach(function(nodeId) {
            assert.deepEqual(testCase.nodes.find(graphs.byId(nodeId)).parents, expected[nodeId], "for node " + nodeId);
        })
    });
});
