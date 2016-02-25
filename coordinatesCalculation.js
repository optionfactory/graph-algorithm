function byId(nodeId) {
    return function(node) {
        return node.id === nodeId;
    }
}

function putInLineAncestors(nodes, coords, ofId, finalX, lineY) {
    var longestChain = DijkstraPath.longestToNode(nodes, ofId);
    //remove current destination
    longestChain = longestChain.splice(0, longestChain.length - 1).reverse();
    
    var x = finalX;
    for (var nodeIdx in longestChain) {
        var nodeId = longestChain[nodeIdx];
        var currentNode = nodes.find(byId(nodeId));
        coords.find(byId(currentNode.id)).y = lineY;
        coords.find(byId(currentNode.id)).x = x;

        putInLineAncestors(nodes.filter(function(node) {
            return longestChain.indexOf(node.id) === -1;
        }), currentNode.id, x - 5, lineY + 10)
        x -= 10;
    }
}

function calculateCoordinates(graph) {
    var coords = graph.nodes.map(function(node) {
        return {
            id: node.id,
            x: undefined,
            y: undefined
        }
    });
    var longestPossiblePath = DijkstraPath.longestPossible(graph.nodes);

    var otherNodes = graph.nodes.filter(function(node) {
        return longestPossiblePath.indexOf(node.id) === -1;
    });
    var x = 0;
    for (var nodeIdx in longestPossiblePath) {
        var nodeId = longestPossiblePath[nodeIdx];
        var currentNode = graph.nodes.find(byId(nodeId));
        coords.find(byId(currentNode.id)).y = 0;
        coords.find(byId(currentNode.id)).x = x;
        putInLineAncestors(otherNodes.concat(currentNode), coords, nodeId, x - 5, 10);
        x += 10;
    }
    return coords;
}
