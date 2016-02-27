var xStep = 15;
var yStep = 10;

function positionAncestors(nodes, coords, connectedToNodeId, alreadyPositioned, positionOnDirectrix) {
    var subGraph = nodes.filter(function(node) {
        return node.id === connectedToNodeId || !alreadyPositioned.includes(node.id);
    }).map(function(node) {
        return {
            id: node.id,
            parents: node.parents.filter(function(parentId) {
                return parentId === connectedToNodeId || !alreadyPositioned.includes(parentId);
            })
        };
    });

    var longestAncestorsChain = BellmanFord.costliestToNode(subGraph, connectedToNodeId);
    longestAncestorsChain = longestAncestorsChain.filter(function(nodeId) {
        return !alreadyPositioned.includes(nodeId);
    }); // remove already positioned points;
    longestAncestorsChain = longestAncestorsChain.reverse(); // end to start
    if (longestAncestorsChain.length === 0) {
        return []; //no new nodes were positioned
    }

    var x = coords.find(graphs.byId(connectedToNodeId)).x - xStep/2;
    var positioning = [].concat(longestAncestorsChain);
    for (var nodeIdx in longestAncestorsChain) {
        var nodeId = longestAncestorsChain[nodeIdx];
        var currentNode = nodes.find(graphs.byId(nodeId));
        //position nodes along the directriX
        coords.find(graphs.byId(currentNode.id)).y = positionOnDirectrix;
        coords.find(graphs.byId(currentNode.id)).x = x;
        var onDirectrix = positionOnDirectrix;
        do {
            onDirectrix += yStep;
            var positionedAncestors = positionAncestors(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedAncestors);
            var positionedDescendants = positionDescendants(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedDescendants);
        } while (positionedAncestors.length !== 0 && positionedDescendants !== 0)
        x -= xStep;
    }
    return positioning;
}

function positionDescendants(nodes, coords, connectedToNodeId, alreadyPositioned, positionOnDirectrix) {
    var subGraph = nodes.filter(function(node) {
        return node.id === connectedToNodeId || !alreadyPositioned.includes(node.id);
    }).map(function(node) {
        return {
            id: node.id,
            parents: node.parents.filter(function(parentId) {
                return parentId === connectedToNodeId || !alreadyPositioned.includes(parentId);
            })
        };
    });
    var longestDescendantsChain = BellmanFord.costliestFromNode(subGraph, connectedToNodeId);
    longestDescendantsChain = longestDescendantsChain.filter(function(nodeId) {
        return !alreadyPositioned.includes(nodeId);
    }); // remove already positioned points;
    if (longestDescendantsChain.length === 0) {
        return []; //no new nodes were positioned
    }

    var x = coords.find(graphs.byId(connectedToNodeId)).x +xStep/2;
    var positioning = [].concat(longestDescendantsChain);
    for (var nodeIdx in longestDescendantsChain) {
        var nodeId = longestDescendantsChain[nodeIdx];
        var currentNode = nodes.find(graphs.byId(nodeId));
        //position nodes along the directriX
        coords.find(graphs.byId(currentNode.id)).y = positionOnDirectrix;
        coords.find(graphs.byId(currentNode.id)).x = x;
        var onDirectrix = positionOnDirectrix;
        do {
            onDirectrix += yStep;
            var positionedAncestors = positionAncestors(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedAncestors);
            var positionedDescendants = positionDescendants(nodes, coords, currentNode.id, alreadyPositioned.concat(positioning), onDirectrix);
            positioning = positioning.concat(positionedDescendants);
        } while (positionedAncestors.length !== 0 && positionedDescendants !== 0)
        x += xStep;
    }
    return positioning;
}

function calculateCoordinates(nodes, currentDirectrix, startingPoint) {
    var coords = nodes.map(function(node) {
        return {
            id: node.id,
            x: undefined,
            y: undefined
        }
    });
    var costliestPossiblePath = BellmanFord.costliestPossible(nodes);
    var x = startingPoint;
    // position nodes in longest possible chain along the main directriX
    for (var nodeIdx in costliestPossiblePath) {
        var nodeId = costliestPossiblePath[nodeIdx];
        var currentNode = nodes.find(graphs.byId(nodeId));
        coords.find(graphs.byId(currentNode.id)).y = currentDirectrix;
        coords.find(graphs.byId(currentNode.id)).x = x;
        x += xStep;
    }
    // then navigate backwards from the last node and position 
    // ancestors and descendants along parallel directrixes
    var inversePath = costliestPossiblePath.reverse();
    var alreadyVisited = [].concat(costliestPossiblePath);
    for (var nodeIdx in inversePath) {
        var nodeId = inversePath[nodeIdx];
        alreadyVisited = alreadyVisited.concat(positionAncestors(nodes, coords, nodeId, alreadyVisited, currentDirectrix + yStep));
        alreadyVisited = alreadyVisited.concat(positionDescendants(nodes, coords, nodeId, alreadyVisited, currentDirectrix + yStep));
    }
    return coords;
}
