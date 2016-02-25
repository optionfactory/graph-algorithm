Function.prototype.curry = function() {
    if (arguments.length < 1) {
        return this; //nothing to curry with - return function
    }
    var __method = this;
    var args = Array.prototype.slice.call(arguments, 0);
    return function() {
        return __method.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
    }
}
var graphs = {
    byId: function(nodeId) {
        return function(node) {
            return node.id === nodeId;
        }
    },
    createNodesStructure: function(graph, edgeWeightCalculator) {
        return graph.map(function(node) {
            return {
                id: node.id,
                parents: node.parents.map(function(parentId) {
                    return { id: parentId, weight: edgeWeightCalculator(node.id, parentId) };
                }),
                cost: Infinity,
                previous: undefined
            }
        });
    },
    defaultEdgeWeight: function(from, to) {
        return 1;
    },
    updateCostIfLower: function(reachablefromNode, fromNode) {
        if (fromNode.cost === Infinity) {
            fromNode.cost = 0;
        }
        reachablefromNode.forEach(function(node) {
            var costIncrement = node.parents.find(graphs.byId(fromNode.id)).weight;
            var newCost = fromNode.cost + costIncrement;
            if (node.cost < newCost) {
                return;
            }
            node.cost = newCost;
            node.previous = fromNode.id;
        });
    },
    sortNodesByCost: function(lhs, rhs) {
        //Don't user lhs.cost - rhs.cost because costs can be Infinite, and that messes up things
        return lhs.cost < rhs.cost ? -1 : lhs.cost > rhs.cost ? 1 : 0;
    },
    sortByCostToNode: function(nodeId, lhsRoute, rhsRoute) {
        var lhsNode = lhsRoute.find(graphs.byId(nodeId));
        var rhsNode = rhsRoute.find(graphs.byId(nodeId));
        if (lhsNode === undefined) {
            return rhsNode === undefined ? 0 : 1;
        }
        if (rhsNode === undefined) {
            return -1;
        }
        return graphs.sortNodesByCost(lhsNode, rhsNode);
    },
    getLowestCostNode: function(nodes) {
        return nodes.sort(graphs.sortNodesByCost)[0];
    },
    navigate: function(nodes, startingFromId, result) {
        var start = nodes.find(graphs.byId(startingFromId));
        if (start == undefined) {
            return result;
        }
        result.push(startingFromId);
        return graphs.navigate(nodes, start.previous, result);
    },
    toId: function(node) {
        return node.id;
    },
    finiteCost: function(node) {
        return node.cost !== Infinity;
    },
    reachablefromNode: function(fromNodeId) {
        return function(node) {
            return node.parents.map(graphs.toId).indexOf(fromNodeId) > -1;
        }
    }
}

var BellmanFord = {
    _exploreAndUpdate: function(nodes, visited, fromNode) {
        var reachablefromNode = nodes.filter(graphs.reachablefromNode(fromNode.id));
        graphs.updateCostIfLower(reachablefromNode, fromNode);
        visited.push(fromNode);
        var reachableNotVisited = nodes.filter(function(node) {
            return node.cost !== Infinity && !visited.some(graphs.byId(node.id));
        });
        if (reachableNotVisited.length === 0) {
            return nodes;
        }
        var nextNode = reachableNotVisited[0];
        return BellmanFord._exploreAndUpdate(nodes, visited, nextNode);
    },
    shortestToNode: function(graph, toNodeId, edgeWeightCalculator) {
        if (!graph.map(graphs.toId).includes(toNodeId)) {
            return [];
        }
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        edgeWeightCalculator = edgeWeightCalculator || graphs.defaultEdgeWeight;
        var routesByStartingPoint = rootNodes.map(function(root) {
            var nodes = graphs.createNodesStructure(graph, edgeWeightCalculator);
            if (nodes.length <= 1) {
                return nodes;
            }
            for (var i = 0; i < nodes.length - 1; ++i) {
                nodes = BellmanFord._exploreAndUpdate(nodes, [], nodes.find(graphs.byId(root.id)));
            }
            return nodes;
        });

        var routeWithShortestPathToNode = routesByStartingPoint.length === 0 ? [] : routesByStartingPoint.sort(graphs.sortByCostToNode.curry(toNodeId))[0];
        return graphs.navigate(routeWithShortestPathToNode, toNodeId, []).reverse();
    },
    longestToNode: function(graph, toNodeId, edgeWeightCalculator) {
        edgeWeightCalculator = edgeWeightCalculator || graphs.defaultEdgeWeight;
        var inverseEdgeWeightCalculator = function(from, to) {
            return -edgeWeightCalculator(from, to);
        }
        return BellmanFord.shortestToNode(graph, toNodeId, inverseEdgeWeightCalculator);
    },
    longestFromNode: function(graph, fromNodeId, edgeWeightCalculator) {
        if (!graph.map(graphs.toId).includes(fromNodeId)) {
            return [];
        }

        edgeWeightCalculator = edgeWeightCalculator || graphs.defaultEdgeWeight;
        var inverseEdgeWeightCalculator = function(from, to) {
            return -edgeWeightCalculator(from, to);
        }
        var nodes = graphs.createNodesStructure(graph, inverseEdgeWeightCalculator);
        if (nodes.length <= 1) {
            return nodes.map(graphs.toId);
        }
        for (var i = 0; i < nodes.length - 1; ++i) {
            nodes = BellmanFord._exploreAndUpdate(nodes, [], nodes.find(graphs.byId(fromNodeId)));
        }
        var mostCostlyNodeToReach = nodes
            .filter(graphs.finiteCost)
            .sort(graphs.sortNodesByCost)[0];
        if (mostCostlyNodeToReach === undefined) {
            return nodes.map(function(node) {
                return node.id;
            });
        }
        return graphs.navigate(nodes, mostCostlyNodeToReach.id, []).reverse();
    },
    longestPossible: function(graph, edgeWeightCalculator) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        edgeWeightCalculator = edgeWeightCalculator || function(from, to) {
            return -1;
        };

        var routesByStartingPoint = rootNodes.map(function(root) {
            var nodes = graphs.createNodesStructure(graph, edgeWeightCalculator);
            if (nodes.length <= 1) {
                return nodes;
            }
            for (var i = 0; i < nodes.length - 1; ++i) {
                nodes = BellmanFord._exploreAndUpdate(nodes, [], nodes.find(graphs.byId(root.id)));
            }
            return nodes;
        });
        if (routesByStartingPoint.length === 0) {
            return [];
        }

        var routeWithLongestPathToNode = routesByStartingPoint.sort(function(lhs, rhs) {
            var lhsMostCostlyNodeNode = lhs
                .filter(graphs.finiteCost)
                .sort(graphs.sortNodesByCost)[0];
            var rhsMostCostlyNodeNode = rhs
                .filter(graphs.finiteCost)
                .sort(graphs.sortNodesByCost)[0];
            return lhsMostCostlyNodeNode.cost - rhsMostCostlyNodeNode.cost;
        })[0];
        var mostCostlyNodeToReach = routeWithLongestPathToNode
            .filter(graphs.finiteCost)
            .sort(graphs.sortNodesByCost)[0];
        if (mostCostlyNodeToReach === undefined) {
            return routeWithLongestPathToNode.map(function(node) {
                return node.id;
            });
        }
        return graphs.navigate(routeWithLongestPathToNode, mostCostlyNodeToReach.id, []).reverse();
    }
}

var Dijkstra = {
    _exploreAndUpdate: function(nodes, visited, fromNode) {
        var reachablefromNode = nodes.filter(graphs.reachablefromNode(fromNode.id));
        graphs.updateCostIfLower(reachablefromNode, fromNode);
        visited.push(fromNode);
        var notVisited = nodes.filter(function(node) {
            return !visited.some(graphs.byId(node.id));
        });
        if (notVisited.length === 0) {
            return nodes;
        }
        var nextNode = graphs.getLowestCostNode(notVisited);
        return Dijkstra._exploreAndUpdate(nodes, visited, nextNode);
    },
    shortestToNode: function(graph, toNodeId, edgeWeightCalculator) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        edgeWeightCalculator = edgeWeightCalculator || graphs.defaultEdgeWeight;
        var routesByStartingPoint = rootNodes.map(function(root) {
            var nodes = graphs.createNodesStructure(graph, edgeWeightCalculator);
            return Dijkstra._exploreAndUpdate(nodes, [], nodes.find(graphs.byId(root.id)));
        });

        var routeWithShortestPathToNode = routesByStartingPoint.length === 0 ? [] : routesByStartingPoint.sort(graphs.sortByCostToNode.curry(toNodeId))[0];
        return graphs.navigate(routeWithShortestPathToNode, toNodeId, []).reverse();
    }
}
