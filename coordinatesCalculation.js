function byId(nodeId) {
    return function(node) {
        return node.id === nodeId;
    }
}

function retrofitAncestors(nodes, coords, ancestorsOfId, previouslyPositioned, positionOnDirectrix, endingAtPoint) {
    var edgeWeightCalculator = function(from, to) {
        //Prefer paths to nodes not yet placed
        return previouslyPositioned.indexOf(to) > -1 ? 0 : -1;
    }
    var longestChain = DijkstraPath.longestToNode(nodes, ancestorsOfId, edgeWeightCalculator)
        .reverse() //end to start
        .splice(1) //remove final point;
    if (longestChain.length === 0) {
        return [];
    }
    var x = endingAtPoint;
    var positioning = [].concat(longestChain);
    for (var nodeIdx in longestChain) {
        var nodeId = longestChain[nodeIdx];
        var currentNode = nodes.find(byId(nodeId));
        //position nodes along the directriX
        coords.find(byId(currentNode.id)).y = positionOnDirectrix;
        coords.find(byId(currentNode.id)).x = x;

        var positionedBackword = retrofitAncestors(nodes, coords, currentNode.id, previouslyPositioned.concat(positioning), positionOnDirectrix + 10, x - 5);
        positioning = positioning.concat(positionedBackword);
        x -= 10;
    }
    return positioning;
}


function positionDescendants(nodes, coords, ancestorsOfId, previouslyPositioned, positionOnDirectrix, endingAtPoint) {
    return [];
}

function fixNodes(nodes, currentDirectrix, startingPoint) {
    var coords = nodes.map(function(node) {
        return {
            id: node.id,
            x: undefined,
            y: undefined
        }
    });
    var longestPossiblePath = DijkstraPath.longestPossible(nodes);
    var positioning = longestPossiblePath;
    var x = startingPoint;
    // position nodes along the directriX
    for (var nodeIdx in longestPossiblePath) {
        var nodeId = longestPossiblePath[nodeIdx];
        var currentNode = nodes.find(byId(nodeId));
        coords.find(byId(currentNode.id)).y = currentDirectrix;
        coords.find(byId(currentNode.id)).x = x;
        x += 10;
    }
    // then navigate backwards and position ancestors and descendants along a parallel directrix
    var inversePath = longestPossiblePath.reverse();
    for (var nodeIdx in inversePath) {
        var nodeId = inversePath.reverse[nodeIdx];
        var positionedBackword = retrofitAncestors(nodes, coords, currentNode.id, positioning, currentDirectrix + 5, coords.find(byId(currentNode.id)).x - 5);
        positioning = positioning.concat(positionedBackword);
        var positionedForward = positionDescendants(nodes, coords, currentNode.id, positioning, currentDirectrix + 15, coords.find(byId(currentNode.id)).x + 5);
        positioning = positioning.concat(positionedBackword);
    }
    return coords;
}
