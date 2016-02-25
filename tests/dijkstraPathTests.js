var deepEqual = function(x, y) {
    if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
        if (Object.keys(x).length != Object.keys(y).length)
            return false;
        for (var prop in x) {
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

QUnit.module("DijkstraPath.shortestToTip");
QUnit.test("path to not existing node is empty", function(assert) {
    var graph = demoGraphs.singleNode;
    assert.deepEqual(DijkstraPath.shortestToNode(graph.nodes, "notExisting"), []);
});
Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName, function(assert) {
        var graph = demoGraphs[graphName];
        var got = DijkstraPath.shortestToNode(graph.nodes, "tip");
        assert.ok(graph.shortestToTip.some(function(expected){return deepEqual(expected,got)}), "expected: \""+graph.shortestToTip+"\",got: \""+got+"\"");
    });
});

QUnit.module("DijkstraPath.longestToTip");
QUnit.test("path to not existing node is empty", function(assert) {
    var graph = demoGraphs.singleNode;
    assert.deepEqual(DijkstraPath.longestToNode(graph.nodes, "notExisting"), []);
});
Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName, function(assert) {
        var graph = demoGraphs[graphName];
        var got = DijkstraPath.longestToNode(graph.nodes, "tip");
        assert.ok(graph.longestToTip.some(function(expected){return deepEqual(expected,got)}), "expected: \""+graph.longestToTip+"\",got: \""+got+"\"");
    });
});

QUnit.module("DijkstraPath.longestPossible");
Object.keys(demoGraphs).forEach(function(graphName) {
    QUnit.test(graphName, function(assert) {
        var graph = demoGraphs[graphName];
        var got = DijkstraPath.longestPossible(graph.nodes);
        assert.ok(graph.longestPossible.some(function(expected){return deepEqual(expected,got)}), "expected: \""+graph.longestPossible+"\",got: \""+got+"\"");
    });
});
