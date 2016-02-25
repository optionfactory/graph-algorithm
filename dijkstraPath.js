var DijkstraPath = {
    _navigate: function(nodes, startingFromId, result) {
        var start = nodes.find(function(node) {
            return node.id === startingFromId
        });
        if (start == undefined) {
            return result;
        }
        result.push(startingFromId);
        return DijkstraPath._navigate(nodes, start.previous, result);
    },
    _currier: function(fn) {
        var args = Array.prototype.slice.call(arguments, 1);

        return function() {
            return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
        };
    },
    _sortByCost: function(lhs, rhs) {
        return lhs.cost < rhs.cost ? -1 : lhs.cost > rhs.cost ? 1 : 0;
    },
    _updateCostIfLower: function(nodes, fromNode) {
        if (fromNode.cost === Infinity) {
            fromNode.cost = 0;
        }
        var reachablefromNode = nodes.filter(function(node) {
            return node.parents.map(function(parent) {
                return parent.id;
            }).indexOf(fromNode.id) > -1;
        })
        reachablefromNode.forEach(function(node) {
            var costIncrement = node.parents.find(function(parent) {
                return parent.id === fromNode.id
            }).weight;
            var newCost = fromNode.cost + costIncrement;
            if (node.cost < newCost) {
                return;
            }
            node.cost = newCost;
            node.previous = fromNode.id;
        });
    },
    _getLowestCostNode: function(nodes) {
        return nodes.sort(DijkstraPath._sortByCost)[0];
    },
    _visitAndRemove: function(nodes, visited, fromNodeId) {
        if (nodes.length <= 1) {
            return visited.concat(nodes);
        }
        var head = nodes.find(function(node) {
            return node.id === fromNodeId;
        });
        otherNodes = nodes.filter(function(node) {
            return node.id !== fromNodeId;
        });
        DijkstraPath._updateCostIfLower(otherNodes, head);
        visited.push(head);
        var nextNode = DijkstraPath._getLowestCostNode(otherNodes);
        return DijkstraPath._visitAndRemove(otherNodes, visited, nextNode.id);
    },
    _createNodesStructure: function(graph, defaultCostToParent) {
        return graph.map(function(node) {
            return {
                id: node.id,
                parents: node.parents.map(function(nodeId) {
                    return { id: nodeId, weight: defaultCostToParent };
                }),
                cost: Infinity,
                previous: undefined
            }
        });
    },
    _sortByCostToNode: function(nodeId, lhs, rhs) {
        var lhsNode = lhs.find(function(node) {
            return node.id === nodeId;
        });
        var rhsNode = rhs.find(function(node) {
            return node.id === nodeId
        });
        return lhsNode.cost - rhsNode.cost;
    },
    shortestToNode: function(graph, toNodeId) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var routesByStartingPoint = rootNodes.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, 1);
            return DijkstraPath._visitAndRemove(nodes, [], root.id);
        });

        var rootWithShortestPathToNode = routesByStartingPoint.length === 0 ? [] : routesByStartingPoint.sort(DijkstraPath._currier(DijkstraPath._sortByCostToNode, toNodeId))[0];
        return DijkstraPath._navigate(rootWithShortestPathToNode, toNodeId, []).reverse();
    },
    longestToNode: function(graph, toNodeId) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var routesByStartingPoint = rootNodes.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, -1);
            var result = DijkstraPath._visitAndRemove(nodes, [], root.id);
            return result;
        });

        var rootWithLongestPathToNode = routesByStartingPoint.length === 0 ? [] : routesByStartingPoint.sort(DijkstraPath._currier(DijkstraPath._sortByCostToNode, toNodeId))[0];
        return DijkstraPath._navigate(rootWithLongestPathToNode, toNodeId, []).reverse();
    },
    _notInfinity: function(node) {
        return node.cost !== Infinity;
    },
    longestPossible: function(graph) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var routesByStartingPoint = rootNodes.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, -1);
            var result = DijkstraPath._visitAndRemove(nodes, [], root.id);
            return result;
        });
        if (routesByStartingPoint.length === 0) {
            return [];
        }

        var routeWithLongestPathToNode = routesByStartingPoint.sort(function(lhs, rhs) {
            var lhsMostCostlyNodeNode = lhs
                .filter(DijkstraPath._notInfinity)
                .sort(DijkstraPath._sortByCost)[0];
            var rhsMostCostlyNodeNode = rhs
                .filter(DijkstraPath._notInfinity)
                .sort(DijkstraPath._sortByCost)[0];
            return lhsMostCostlyNodeNode.cost - rhsMostCostlyNodeNode.cost;
        })[0];
        var mostCostlyNodeToReach = routeWithLongestPathToNode
            .filter(DijkstraPath._notInfinity)
            .sort(DijkstraPath._sortByCost)[0];
        if (mostCostlyNodeToReach === undefined) {
            return routeWithLongestPathToNode.map(function(node) {
                return node.id;
            });
        }
        return DijkstraPath._navigate(routeWithLongestPathToNode, mostCostlyNodeToReach.id, []).reverse();
    }
}
