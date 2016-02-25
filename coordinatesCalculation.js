function positionOtherBranches(nodes, coords, connectedToNodeId, alreadyPositioned, positionOnDirectrix) {
    var edgeWeightCalculator = function(from, to) {
        //Prefer paths to nodes not yet placed
        return alreadyPositioned.includes(to) ? -1000 : 1;
    }
    var longestChain = BellmanFord.longestToNode(nodes, connectedToNodeId, edgeWeightCalculator);
    longestChain = longestChain.filter(function(nodeId) {
        return !alreadyPositioned.includes(nodeId);
    }); // remove already positioned points;
    longestChain = longestChain.reverse(); // end to start
    if (longestChain.length === 0) {
        return []; //no new nodes were positioned
    }

    var x = coords.find(graphs.byId(connectedToNodeId)).x - 5;
    var positioning = [].concat(longestChain);
    for (var nodeIdx in longestChain) {
        var nodeId = longestChain[nodeIdx];
        var currentNode = nodes.find(graphs.byId(nodeId));
        //position nodes along the directriX
        coords.find(graphs.byId(currentNode.id)).y = positionOnDirectrix;
        coords.find(graphs.byId(currentNode.id)).x = x;

        var positionedBackwards = positionOtherBranches(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), positionOnDirectrix + 10);
        positioning = positioning.concat(positionedBackwards);
        x -= 10;
    }
    return positioning;
}

function fixNodes(nodes, currentDirectrix, startingPoint) {
    var coords = nodes.map(function(node) {
        return {
            id: node.id,
            x: undefined,
            y: undefined
        }
    });
    var longestPossiblePath = BellmanFord.longestPossible(nodes);
    var x = startingPoint;
    // position nodes in longest possible chain along the main directriX
    for (var nodeIdx in longestPossiblePath) {
        var nodeId = longestPossiblePath[nodeIdx];
        var currentNode = nodes.find(graphs.byId(nodeId));
        coords.find(graphs.byId(currentNode.id)).y = currentDirectrix;
        coords.find(graphs.byId(currentNode.id)).x = x;
        x += 10;
    }
    // then navigate backwards from the last node and position 
    // ancestors and descendants along parallel directrixes
    var inversePath = longestPossiblePath.reverse();
    for (var nodeIdx in inversePath) {
        var nodeId = inversePath[nodeIdx];
        positionOtherBranches(nodes, coords, nodeId, longestPossiblePath, currentDirectrix + 5);
    }
    return coords;
}
