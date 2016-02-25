var deepEqual = function(x, y) {
    if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
        if (Object.keys(x).length != Object.keys(y).length)
            return false;
        for (var prop in x) {
            if (typeof x[prop] === "function") {
                continue;
            }
            if (y.hasOwnProperty(prop)) {
                if (!deepEqual(x[prop], y[prop]))
                    return false;
            } else
                return false;
        }

        return true;
    } else if (x !== y)
        return false;
    else
        return true;
}

function errorMessage(possibleExpectedSolutions, gotSolution) {
    var msg = "expected: ";
    if (possibleExpectedSolutions.length < 2) {
        msg = msg + "\"" + possibleExpectedSolutions + "\"";
    } else {
        msg = msg + " either \"" + possibleExpectedSolutions[0] + "\"";
        msg = msg + possibleExpectedSolutions.splice(1).map(function(expected) {
            return " or \"" + expected + "\"";
        });
    }
    msg += "; got: \"" + gotSolution + "\"";
    return msg;
}

QUnit.module("Dijkstra.shortestToTip");
QUnit.test("path to not existing node is empty", function(assert) {
    var graph = demoGraphs.singleNode;
    assert.deepEqual(Dijkstra.shortestToNode(graph.nodes, "notExisting"), []);
});
QUnit.test("path to root is itself", function(assert) {
    var graph = demoGraphs.twoRoots;
    assert.deepEqual(Dijkstra.shortestToNode(graph.nodes, "root2"), ["root2"]);
});

Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName, function(assert) {
        var graph = demoGraphs[graphName];
        var got = Dijkstra.shortestToNode(graph.nodes, "tip");
        assert.ok(graph.shortestToTip.some(function(expected) {
            return deepEqual(expected, got);
        }), errorMessage(graph.shortestToTip, got));
    });
});

QUnit.module("BellmanFord.shortestToTip");
QUnit.test("path to not existing node is empty", function(assert) {
    var graph = demoGraphs.singleNode;
    assert.deepEqual(BellmanFord.shortestToNode(graph.nodes, "notExisting"), []);
});
QUnit.test("path to root is itself", function(assert) {
    var graph = demoGraphs.twoRoots;
    assert.deepEqual(BellmanFord.shortestToNode(graph.nodes, "root2"), ["root2"]);
});

Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName, function(assert) {
        var graph = demoGraphs[graphName];
        var got = BellmanFord.shortestToNode(graph.nodes, "tip");
        assert.ok(graph.shortestToTip.some(function(expected) {
            return deepEqual(expected, got);
        }), errorMessage(graph.shortestToTip, got));
    });
});

QUnit.module("BellmanFord.shortestToNode for longestToTip");
Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName, function(assert) {
        var graph = demoGraphs[graphName];
        var got = BellmanFord.shortestToNode(graph.nodes, "tip", function(from, to) {
            return -1;
        });
        assert.ok(graph.longestToTip.some(function(expected) {
            return deepEqual(expected, got)
        }), errorMessage(graph.longestToTip, got));
    });
});

QUnit.module("BellmanFord.longestPossible");
Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName, function(assert) {
        var graph = demoGraphs[graphName];
        var got = BellmanFord.longestPossible(graph.nodes);
        assert.ok(graph.longestPossible.some(function(expected) {
            return deepEqual(expected, got)
        }), errorMessage(graph.longestPossible, got));
    });
});
