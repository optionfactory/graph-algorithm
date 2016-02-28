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
    },
    incrementDecrementY: function(baseline, increment) {
        return function(alreadyTried) {
            function getOffset(index) {
                //0, 1, -1, 2, -2, 3, ...
                return Math.pow(-1, index + 1) * Math.ceil(index / 2);
            }
            var offset = getOffset(alreadyTried.length);
            return baseline+offset*increment;
        }
    }
}

// works only when chunks are positioned horizontally or vertically,
// unreliable on diagonal positioning
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
    if (lhsCoordinatesChunk.directrix !== rhsCoordinatesChunk.directrix) {
        return false;
    }
    lhs = getMinMax(lhsCoordinatesChunk.chunkPositions);
    rhs = getMinMax(rhsCoordinatesChunk.chunkPositions);
    var disjointedOnX = lhs.max.x < rhs.min.x || lhs.min.x > rhs.max.x;
    var disjointedOnY = lhs.max.y < rhs.min.y || lhs.min.y > rhs.max.y;
    return !disjointedOnX && !disjointedOnY;
}

function positionNodes(distributionStrategy, directrixSelectionStrategy, nodes, chainToBePositioned, previousChunksPositions) {
    var nodesToBePositioned = chainToBePositioned.map(function(nodeId) {
        return nodes.find(graphs.byId(nodeId));
    });
    var attemptedDirectrixes = [];
    while (true) {
        var directrix = directrixSelectionStrategy(attemptedDirectrixes);
        var currentChunkPositions = {
            directrix: directrix,
            chunkPositions: distributionStrategy(nodesToBePositioned, directrix)
        };
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

function positionAncestorsAndDescendants(allNodes, ofNodeId, currentDirectrix, previousChunksPosition) {
    var node = allNodes.find(graphs.byId(ofNodeId));
    var newChunksPositions = [];
    do {
        var longestAncestorsChain = BellmanFord.costliestToNode(allNodes, ofNodeId);
        removeUsedPaths(allNodes, longestAncestorsChain);
        longestAncestorsChain = longestAncestorsChain.filter(function(ancestorId) {
            var ancestorNode = allNodes.find(graphs.byId(ancestorId));
            return ancestorNode.x === undefined && ancestorNode.y === undefined;
        });
        var anchestorsChunk = positionNodes(
            distributionStrategies.distributeEndingAt(node.x - xStep / 2, xStep),
            directrixSelectionStrategies.incrementDecrementY(currentDirectrix, yStep),
            allNodes,
            longestAncestorsChain,
            previousChunksPosition
        );
        if (anchestorsChunk.chunkPositions.length > 0) {
            newChunksPositions.push(anchestorsChunk);
        }
        var longestDescendantsChain = BellmanFord.costliestFromNode(allNodes, ofNodeId);
        removeUsedPaths(allNodes, longestDescendantsChain);
        longestDescendantsChain = longestDescendantsChain.filter(function(descendantId) {
            var descendantNode = allNodes.find(graphs.byId(descendantId));
            return descendantNode.x === undefined && descendantNode.y === undefined;
        });
        var descendantsChunk = positionNodes(
            distributionStrategies.distributeStartingFrom(node.x + xStep / 2, xStep),
            directrixSelectionStrategies.incrementDecrementY(currentDirectrix, yStep),
            allNodes,
            longestDescendantsChain,
            previousChunksPosition.concat(newChunksPositions)
        );
        if (descendantsChunk.chunkPositions.length > 0) {
            newChunksPositions.push(descendantsChunk);
        }

        longestAncestorsChain.forEach(function(ancestor) {
            newChunksPositions = newChunksPositions.concat(
                positionAncestorsAndDescendants(allNodes, ancestor, anchestorsChunk.directrix, previousChunksPosition.concat(newChunksPositions))
            );
        })
        longestDescendantsChain.forEach(function(descendant) {
            newChunksPositions = newChunksPositions.concat(
                positionAncestorsAndDescendants(allNodes, descendant, descendantsChunk.directrix, previousChunksPosition.concat(newChunksPositions))
            );
        })
    } while (longestAncestorsChain.length !== 0 || longestDescendantsChain.length !== 0)
    return newChunksPositions;
}

function calculateCoordinates(graph, startingPoint, mainDirectrix) {
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

    var allChunksPositions = [];
    var mainChunkPositions = positionNodes(
        distributionStrategies.distributeStartingFrom(startingPoint || 0, xStep),
        directrixSelectionStrategies.incrementDecrementY(mainDirectrix || 0, yStep),
        nodes,
        costliestPossiblePath,
        allChunksPositions
    );

    allChunksPositions.push(mainChunkPositions);
    // then navigate backwards from the last node and position 
    // ancestors and descendants along parallel directrixes
    costliestPossiblePath.reverse().forEach(function(nodeId) {
        allChunksPositions = allChunksPositions.concat(
            positionAncestorsAndDescendants(nodes, nodeId, mainChunkPositions.directrix, allChunksPositions)
        );
    });
    return nodes;
}
