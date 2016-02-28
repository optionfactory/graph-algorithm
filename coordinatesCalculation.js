var xStep = 10;
var yStep = 10;




var distributionStrategies = {
    distributeStartingFrom: function(start, increment) {
        return function(nodes, directrix) {
            var chunkPositions = [];
            var current = start;
            for (var nodeIdx in nodes) {
                var node = nodes[nodeIdx];
                node.x = current;
                node.y = directrix;
                chunkPositions.push({ x: node.x, y: node.y });
                current += increment;
            }
            return chunkPositions;
        }
    },
    distributeEndingAt: function(end, increment) {
        return function(nodes, directrix) {
            var current = end;
            var chunkPositions = [];
            var reversed = [].concat(nodes).reverse();
            for (var nodeIdx in reversed) {
                var node = reversed[nodeIdx];
                node.x = current;
                node.y = directrix;
                chunkPositions.push({ x: node.x, y: node.y });
                current -= increment;
            }
            return chunkPositions;
        }
    }
}

var directrixSelectionStrategies = {
    alwaysIncrementY: function(baseline, increment) {
        return function(alreadyTried) {
            var current = baseline;
            while (alreadyTried.includes(current)) {
                current += increment;
            }
            return current;
        }
    }
}

function doCollide(lhsCoordinatesChunk, rhsCoordinatesChunk) {
    function getMinMax(coordinatesChunk) {
        var validCoordinates = coordinatesChunk.filter(function(coords) {
            return coords.x !== undefined && coords.y !== undefined;
        });
        var allX = validCoordinates.map(function(coords) {
            return coords.x;
        });
        var minX = Math.min(...allX);
        var maxX = Math.max(...allX);
        var allY = validCoordinates.map(function(coords) {
            return coords.y;
        });
        var minY = Math.min(...allY);
        var maxY = Math.max(...allY);
        return {
            min: { x: minX, y: minY },
            max: { x: maxX, y: maxY }
        }
    }
    lhs = getMinMax(lhsCoordinatesChunk);
    rhs = getMinMax(rhsCoordinatesChunk);
    var disjointedOnX = lhs.max.x < rhs.min.x || lhs.min.x > rhs.max.x;
    var disjointedOnY = lhs.max.y < rhs.min.y || lhs.min.y > rhs.max.y;
    return !(disjointedOnX || disjointedOnY);
}

function positionNodes(distributionStrategy, directrixSelectionStrategy, nodes, chainToPosition, previousChunksPositions) {
    var nodesToBePositioned = chainToPosition.map(function(nodeId) {
        return nodes.find(graphs.byId(nodeId));
    });
    var attemptedDirectrixes = [];
    while (true) {
        var directrix = directrixSelectionStrategy(attemptedDirectrixes);
        var currentChunkPositions = distributionStrategy(nodesToBePositioned, directrix);
        //search for colliding nodes (among those already placed)
        var thereAreCollisions = previousChunksPositions.some(function(previousChunkPosition) {
            return doCollide(previousChunkPosition, currentChunkPositions);
        })
        if (!thereAreCollisions) {
            return currentChunkPositions;
        }
        attemptedDirectrixes.push(directrix);
    }
}

function removeUsedPaths(nodes, pathToRemove) {
    for (var i = 0; i < pathToRemove.length - 1; ++i) {
        var fromNodeId = pathToRemove[i];
        var toNodeId = pathToRemove[i + 1];
        var toNode = nodes.find(graphs.byId(toNodeId));
        removeIndex = toNode.parents.indexOf(fromNodeId);
        if (removeIndex !== -1) {
            toNode.parents.splice(removeIndex, 1);
        }
    }
}

function positionAncestorsAndDescendants(nodes, nodeId, previousChunksPosition) {
    var node = nodes.find(graphs.byId(nodeId));
    var newChunksPositions = [];
    do {
        var longestAncestorsChain = BellmanFord.costliestToNode(nodes, nodeId);
        removeUsedPaths(nodes, longestAncestorsChain);
        longestAncestorsChain = longestAncestorsChain.filter(function(nId) {
            var n = nodes.find(graphs.byId(nId));
            return n.x === undefined && n.y === undefined;
        });
        var anchestorsChunk = positionNodes(
            distributionStrategies.distributeEndingAt(node.x - xStep / 2, xStep),
            directrixSelectionStrategies.alwaysIncrementY(0, yStep),
            nodes,
            longestAncestorsChain,
            previousChunksPosition
        );
        if (anchestorsChunk.length > 0) {
            newChunksPositions.push(anchestorsChunk);
        }
        var longestDescendantsChain = BellmanFord.costliestFromNode(nodes, nodeId);
        removeUsedPaths(nodes, longestDescendantsChain);
        longestDescendantsChain = longestDescendantsChain.filter(function(nId) {
            var n = nodes.find(graphs.byId(nId));
            return n.x === undefined && n.y === undefined;
        });
        var descendantsChunk = positionNodes(
            distributionStrategies.distributeStartingFrom(node.x + xStep / 2, xStep),
            directrixSelectionStrategies.alwaysIncrementY(0, yStep),
            nodes,
            longestDescendantsChain,
            previousChunksPosition.concat(newChunksPositions)
        );
        if (descendantsChunk.length > 0) {
            newChunksPositions.push(descendantsChunk);
        }

        longestAncestorsChain.forEach(function(ancestor) {
            newChunksPositions = newChunksPositions.concat(
                positionAncestorsAndDescendants(nodes, ancestor, previousChunksPosition.concat(newChunksPositions))
            );
        })
        longestDescendantsChain.forEach(function(descendant) {
            newChunksPositions = newChunksPositions.concat(
                positionAncestorsAndDescendants(nodes, descendant, previousChunksPosition.concat(newChunksPositions))
            );
        })
    } while (longestAncestorsChain.length !== 0 || longestDescendantsChain.length !== 0)
    return newChunksPositions;
}

function calculateCoordinates(graph, currentDirectrix, startingPoint) {
    var nodes = graph.nodes.map(function(node) {
        return {
            id: node.id,
            originalNode: node,
            parents: [].concat(node.parents),
            x: undefined,
            y: undefined
        }
    });
    var costliestPossiblePath = BellmanFord.costliestPossible(nodes);
    removeUsedPaths(nodes, costliestPossiblePath);

    var mainChunkPositions = positionNodes(
        distributionStrategies.distributeStartingFrom(0, xStep),
        directrixSelectionStrategies.alwaysIncrementY(0, yStep),
        nodes,
        costliestPossiblePath, []
    );

    var allChunksPositions = [];
    allChunksPositions.push(mainChunkPositions);
    // then navigate backwards from the last node and position 
    // ancestors and descendants along parallel directrixes
    costliestPossiblePath.reverse().forEach(function(nodeId) {
        allChunksPositions = allChunksPositions.concat(positionAncestorsAndDescendants(nodes, nodeId, allChunksPositions));
    });
    return nodes;
}
