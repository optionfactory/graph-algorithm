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
    _updateCostIfLower: function(costIncrement, nodes, fromNode) {
        if (fromNode.cost === Infinity) {
            fromNode.cost = 0;
        }
        var newCost = fromNode.cost + costIncrement;
        var reachablefromNode = nodes.filter(function(node) {
            return node.parents.indexOf(fromNode.id) > -1;
        })
        reachablefromNode.forEach(function(node) {
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
    _getHighestCostNode: function(nodes) {
        return nodes.sort(DijkstraPath._sortByCost).reverse()[0];
    },
    _visitAndRemove: function(nodes, visited, fromNodeId, updateStrategy, nextNodeStrategy) {
        if (nodes.length <= 1) {
            return visited.concat(nodes);
        }
        var head = nodes.find(function(node) {
            return node.id === fromNodeId;
        });
        nodes = nodes.filter(function(node) {
            return node.id !== fromNodeId;
        });
        updateStrategy(nodes, head);
        visited.push(head);
        var nextNode = nextNodeStrategy(nodes);
        return DijkstraPath._visitAndRemove(nodes, visited, nextNode.id, updateStrategy, nextNodeStrategy);
    },
    _createNodesStructure: function(graph, initialCost) {
        return graph.map(function(node) {
            return {
                id: node.id,
                parents: node.parents,
                cost: initialCost,
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
        if (lhsNode == undefined) {
            return rhsNode === undefined ? 0 : 1;
        }
        if (rhsNode == undefined) {
            return -1;
        }
        return lhsNode.cost - rhsNode.cost;
    },
    shortestToNode: function(graph, toNodeId) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var routesByRoot = rootNodes.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, Infinity);
            return DijkstraPath._visitAndRemove(nodes, [], root.id, DijkstraPath._currier(DijkstraPath._updateCostIfLower, 1), DijkstraPath._getLowestCostNode);
        });

        var rootWithShortestPathToNode = routesByRoot.length === 0 ? [] : routesByRoot.sort(DijkstraPath._currier(DijkstraPath._sortByCostToNode, toNodeId))[0];
        return DijkstraPath._navigate(rootWithShortestPathToNode, toNodeId, []).reverse();
    },
    longestToNode: function(graph, toNodeId) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var routesByRoot = rootNodes.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, Infinity);
            var result = DijkstraPath._visitAndRemove(nodes, [], root.id, DijkstraPath._currier(DijkstraPath._updateCostIfLower, -1), DijkstraPath._getLowestCostNode);
            result.forEach(function(node) {
                node.cost = node.cost === Infinity ? Infinity : -node.cost;
            })
            return result;
        });

        var rootWithLongestPathToNode = routesByRoot.length === 0 ? [] : routesByRoot.sort(DijkstraPath._currier(DijkstraPath._sortByCostToNode, toNodeId)).reverse()[0];
        return DijkstraPath._navigate(rootWithLongestPathToNode, toNodeId, []).reverse();
    },
    _notInfinity: function(node) {
        return node.cost !== Infinity;
    },
    longestPossible: function(graph) {
        var rootNodes = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var routesByRoot = rootNodes.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, Infinity);
            var result = DijkstraPath._visitAndRemove(nodes, [], root.id, DijkstraPath._currier(DijkstraPath._updateCostIfLower, -1), DijkstraPath._getLowestCostNode);
            result.forEach(function(node) {
                node.cost = node.cost === Infinity ? Infinity : -node.cost;
            })
            return result;
        });
        if (routesByRoot.length === 0) {
            return [];
        }

        var routeWithLongestPathToNode = routesByRoot.sort(function(lhs, rhs) {
            var lhsMostCostlyNodeNode = lhs
                .filter(DijkstraPath._notInfinity)
                .sort(DijkstraPath._sortByCost)
                .reverse()[0];
            var rhsMostCostlyNodeNode = rhs
                .filter(DijkstraPath._notInfinity)
                .sort(DijkstraPath._sortByCost)
                .reverse()[0];
            return lhsMostCostlyNodeNode.cost - rhsMostCostlyNodeNode.cost;
        }).reverse()[0];
        var mostCostlyNodeToReach = routeWithLongestPathToNode
            .filter(DijkstraPath._notInfinity)
            .sort(DijkstraPath._sortByCost)
            .reverse()[0];
        if (mostCostlyNodeToReach === undefined) {
            return routeWithLongestPathToNode.map(function(node) {
                return node.id;
            });
        }
        return DijkstraPath._navigate(routeWithLongestPathToNode, mostCostlyNodeToReach.id, []).reverse();
    }
}
