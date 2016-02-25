function positionOtherBranches(nodes, coords, connectedToNodeId, alreadyPositioned, positionOnDirectrix) {
    var edgeWeightCalculator = function(from, to) {
        //Prefer paths from nodes not yet placed
        return alreadyPositioned.includes(to) ? -1000 : 1;
    }
    var longestAncestorsChain = BellmanFord.longestToNode(nodes, connectedToNodeId, edgeWeightCalculator);
    longestAncestorsChain = longestAncestorsChain.filter(function(nodeId) {
        return !alreadyPositioned.includes(nodeId);
    }); // remove already positioned points;
    longestAncestorsChain = longestAncestorsChain.reverse(); // end to start
    if (longestAncestorsChain.length === 0) {
        return []; //no new nodes were positioned
    }

    var x = coords.find(graphs.byId(connectedToNodeId)).x - 5;
    var positioning = [].concat(longestAncestorsChain);
    for (var nodeIdx in longestAncestorsChain) {
        var nodeId = longestAncestorsChain[nodeIdx];
        var currentNode = nodes.find(graphs.byId(nodeId));
        //position nodes along the directriX
        coords.find(graphs.byId(currentNode.id)).y = positionOnDirectrix;
        coords.find(graphs.byId(currentNode.id)).x = x;
        var onDirectrix = positionOnDirectrix;
        do {
            onDirectrix += 10;
            var positionedBackwards = positionOtherBranches(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedBackwards);
            var positionedForward = positionDescendants(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedForward);
        } while (positionedBackwards.length !== 0 && positionedForward !== 0)
        x -= 10;
    }
    return positioning;
}

function positionDescendants(nodes, coords, connectedToNodeId, alreadyPositioned, positionOnDirectrix) {
    var edgeWeightCalculator = function(from, to) {
        //Prefer paths from nodes not yet placed
        return alreadyPositioned.includes(from) ? -1000 : 1;
    }
    var longestDescendantsChain = BellmanFord.longestFromNode(nodes, connectedToNodeId, edgeWeightCalculator);
    longestDescendantsChain = longestDescendantsChain.filter(function(nodeId) {
        return !alreadyPositioned.includes(nodeId);
    }); // remove already positioned points;
    if (longestDescendantsChain.length === 0) {
        return []; //no new nodes were positioned
    }

    var x = coords.find(graphs.byId(connectedToNodeId)).x + 5;
    var positioning = [].concat(longestDescendantsChain);
    for (var nodeIdx in longestDescendantsChain) {
        var nodeId = longestDescendantsChain[nodeIdx];
        var currentNode = nodes.find(graphs.byId(nodeId));
        //position nodes along the directriX
        coords.find(graphs.byId(currentNode.id)).y = positionOnDirectrix;
        coords.find(graphs.byId(currentNode.id)).x = x;
        var onDirectrix = positionOnDirectrix;
        do {
            onDirectrix += 10;
            var positionedBackwards = positionOtherBranches(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedBackwards);
            var positionedForward = positionDescendants(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedForward);
        } while (positionedBackwards.length !== 0 && positionedForward !== 0)
        x += 10;
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
    var alreadyVisited = [].concat(longestPossiblePath);
    for (var nodeIdx in inversePath) {
        var nodeId = inversePath[nodeIdx];
        alreadyVisited.concat(positionOtherBranches(nodes, coords, nodeId, alreadyVisited, currentDirectrix + 5));
        alreadyVisited.concat(positionDescendants(nodes, coords, nodeId, alreadyVisited, currentDirectrix + 5));
    }
    return coords;
}
