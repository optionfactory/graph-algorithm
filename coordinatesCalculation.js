var alongDirectrixStep = 10;
var betweenDirectrixesStep = 10;


var distributionStrategies = {
    horizontalStartingFrom: function(startNode, increment) {
        return function(nodes, directrix, parentDirectrix) {
            var chunkPositions = [];
            var current = startNode.x;
            for (var nodeIdx in nodes) {
                var node = nodes[nodeIdx];
                node.x = current + (directrix === parentDirectrix ? increment : increment / 2);
                node.y = directrix;
                chunkPositions.push({ x: node.x, y: node.y });
                current += increment;
            }
            return chunkPositions;
        }
    },
    horizontalEndingAt: function(endNode, increment) {
        return function(nodes, directrix, parentDirectrix) {
            var current = endNode.x;
            var chunkPositions = [];
            var reversed = [].concat(nodes).reverse();
            for (var nodeIdx in reversed) {
                var node = reversed[nodeIdx];
                node.x = current - (directrix === parentDirectrix ? increment : increment / 2);
                node.y = directrix;
                chunkPositions.push({ x: node.x, y: node.y });
                current -= increment;
            }
            return chunkPositions;
        }
    },
    verticalStartingFrom: function(startNode, increment) {
        return function(nodes, directrix, parentDirectrix) {
            var chunkPositions = [];
            var current = startNode.y;
            for (var nodeIdx in nodes) {
                var node = nodes[nodeIdx];
                node.y = current + (directrix === parentDirectrix ? increment : increment / 2);
                node.x = directrix;
                chunkPositions.push({ x: node.x, y: node.y });
                current += increment;
            }
            return chunkPositions;
        }
    },
    verticalEndingAt: function(endNode, increment) {
        return function(nodes, directrix, parentDirectrix) {
            var current = endNode.y;
            var chunkPositions = [];
            var reversed = [].concat(nodes).reverse();
            for (var nodeIdx in reversed) {
                var node = reversed[nodeIdx];
                node.y = current - (directrix === parentDirectrix ? increment : increment / 2);
                node.x = directrix;
                chunkPositions.push({ x: node.x, y: node.y });
                current -= increment;
            }
            return chunkPositions;
        }
    }

}

var directrixSelectionStrategies = {
    incremental: function(increment) {
        return function(baseline, alreadyTried) {
            var current = baseline;
            while (alreadyTried.includes(current)) {
                current += increment;
            }
            return current;
        }
    },
    flipFlop: function(increment) {
        return function(baseline, alreadyTried) {
            function getOffset(index) {
                //0, 1, -1, 2, -2, 3, ...
                return Math.pow(-1, index + 1) * Math.ceil(index / 2);
            }
            var offset = getOffset(alreadyTried.length);
            return baseline + offset * increment;
        }
    }
}

var default_configuration = {
    directrixSelectionStrategy: directrixSelectionStrategies.flipFlop,
    forwardNodeDistributionStrategy: distributionStrategies.horizontalStartingFrom,
    backwardsNodeDistributionStrategy: distributionStrategies.horizontalEndingAt
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

function positionNodes(distributionStrategy, directrixSelectionStrategy, nodes, chainToBePositioned, previousChunksPositions, baselineDirectrix) {
    var nodesToBePositioned = chainToBePositioned.map(function(nodeId) {
        return nodes.find(graphs.byId(nodeId));
    });
    var attemptedDirectrixes = [];
    while (true) {
        var directrix = directrixSelectionStrategy(baselineDirectrix, attemptedDirectrixes);
        var currentChunkPositions = {
            directrix: directrix,
            chunkPositions: distributionStrategy(nodesToBePositioned, directrix, baselineDirectrix)
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

function removeIfPresent(array, elementToRemove) {
    var removeIndex = array.indexOf(elementToRemove);
    if (removeIndex !== -1) {
        array.splice(removeIndex, 1);
    }
}

function navigateForwardAndDetachChunk(nodes, pathToExplore, startingPoint) {
    var finalChain = [];
    var chainStarted = false;
    for (var i = 0; i < pathToExplore.length - 1; ++i) {
        var parentNodeId = pathToExplore[i];
        if (parentNodeId !== startingPoint && !chainStarted) {
            continue;
        } else {
            chainStarted = true;
        }
        var childNodeId = pathToExplore[i + 1];
        var childNode = nodes.find(graphs.byId(childNodeId));
        removeIfPresent(childNode.parents, parentNodeId);
        if (childNode.x !== undefined && childNode.y !== undefined) {
            break;
        } else {
            finalChain.push(childNodeId);
        }
    }
    return finalChain;
}

function navigateBackwardsAndDetachChunk(nodes, pathToExplore, endingPoint) {
    var finalChain = [];
    var chainStarted = false;
    for (var i = pathToExplore.length; i >= 1; --i) {
        var parentNodeId = pathToExplore[i - 1];
        var childNodeId = pathToExplore[i];

        if (childNodeId !== endingPoint && !chainStarted) {
            continue;
        } else {
            chainStarted = true;
        }
        var childNode = nodes.find(graphs.byId(childNodeId));
        var parentNode = nodes.find(graphs.byId(parentNodeId));
        removeIfPresent(childNode.parents, parentNodeId);
        if (parentNode.x !== undefined && parentNode.y !== undefined) {
            break;
        } else {
            finalChain.push(parentNodeId);
        }
    }
    return finalChain.reverse();
}

function positionAncestorsAndDescendants(allNodes, ofNodeId, currentDirectrix, previousChunksPosition, configuration) {
    var node = allNodes.find(graphs.byId(ofNodeId));
    var newChunksPositions = [];
    do {
        var longestAncestorsChain = BellmanFord.costliestToNode(allNodes, ofNodeId);
        var longestValidAncestorsChain = navigateBackwardsAndDetachChunk(allNodes, longestAncestorsChain, ofNodeId);
        var anchestorsChunk = positionNodes(
            configuration.backwardsNodeDistributionStrategy(node, alongDirectrixStep),
            configuration.directrixSelectionStrategy(betweenDirectrixesStep),
            allNodes,
            longestValidAncestorsChain,
            previousChunksPosition,
            currentDirectrix
        );
        if (anchestorsChunk.chunkPositions.length > 0) {
            newChunksPositions.push(anchestorsChunk);
        }
        var longestDescendantsChain = BellmanFord.costliestFromNode(allNodes, ofNodeId);
        var longestValidDescendantsChain = navigateForwardAndDetachChunk(allNodes, longestDescendantsChain, ofNodeId);
        var descendantsChunk = positionNodes(
            configuration.forwardNodeDistributionStrategy(node, alongDirectrixStep),
            configuration.directrixSelectionStrategy(betweenDirectrixesStep),
            allNodes,
            longestValidDescendantsChain,
            previousChunksPosition.concat(newChunksPositions),
            currentDirectrix
        );
        if (descendantsChunk.chunkPositions.length > 0) {
            newChunksPositions.push(descendantsChunk);
        }

        longestValidAncestorsChain.reverse().forEach(function(ancestor) {
            newChunksPositions = newChunksPositions.concat(
                positionAncestorsAndDescendants(allNodes, ancestor, anchestorsChunk.directrix, previousChunksPosition.concat(newChunksPositions), configuration)
            );
        })
        longestValidDescendantsChain.forEach(function(descendant) {
            newChunksPositions = newChunksPositions.concat(
                positionAncestorsAndDescendants(allNodes, descendant, descendantsChunk.directrix, previousChunksPosition.concat(newChunksPositions), configuration)
            );
        })
    } while (longestValidAncestorsChain.length !== 0 || longestValidDescendantsChain.length !== 0)
    return newChunksPositions;
}

function calculateCoordinates(graph, startingPoint, mainDirectrix, configuration) {
    var nodes = graph.nodes.map(function(node) {
        return {
            id: node.id,
            originalNode: node,
            parents: [].concat(node.parents),
            x: undefined,
            y: undefined
        }
    });
    configuration = configuration || default_configuration;
    var costliestPossiblePath = BellmanFord.costliestPossible(nodes);
    navigateForwardAndDetachChunk(nodes, costliestPossiblePath, costliestPossiblePath[0]);

    var allChunksPositions = [];
    var mainChunkPositions = positionNodes(
        configuration.forwardNodeDistributionStrategy(startingPoint || { x: 0, y: 0 }, alongDirectrixStep),
        configuration.directrixSelectionStrategy(betweenDirectrixesStep),
        nodes,
        costliestPossiblePath,
        allChunksPositions,
        mainDirectrix || 0
    );

    allChunksPositions.push(mainChunkPositions);
    // then navigate backwards from the last node and position 
    // ancestors and descendants along parallel directrixes
    costliestPossiblePath.reverse().forEach(function(nodeId) {
        allChunksPositions = allChunksPositions.concat(
            positionAncestorsAndDescendants(nodes, nodeId, mainChunkPositions.directrix, allChunksPositions, configuration)
        );
    });
    return nodes;
}
