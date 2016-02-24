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
        var newCost = fromNode.cost + 1;
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
    _updateCostIfHigher: function(nodes, fromNode) {
        if (fromNode.cost === -Infinity) {
            fromNode.cost = 0;
        }
        var newCost = fromNode.cost + 1;
        var reachablefromNode = nodes.filter(function(node) {
            return node.parents.indexOf(fromNode.id) > -1;
        })
        reachablefromNode.forEach(function(node) {
            if (node.cost > newCost) {
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
        var roots = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var byRoot = roots.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, Infinity);
            return DijkstraPath._visitAndRemove(nodes, [], root.id, DijkstraPath._updateCostIfLower, DijkstraPath._getLowestCostNode);
        });

        var rootWithShortestPathToNode = byRoot.length === 0 ? [] : byRoot.sort(DijkstraPath._currier(DijkstraPath._sortByCostToNode, toNodeId))[0];
        return DijkstraPath._navigate(rootWithShortestPathToNode, toNodeId, []).reverse();
    },
    longestToNode: function(graph, toNodeId) {
        var roots = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var byRoot = roots.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, -Infinity);
            return DijkstraPath._visitAndRemove(nodes, [], root.id, DijkstraPath._updateCostIfHigher, DijkstraPath._getHighestCostNode);
        });

        var rootWithLongestPathToNode = byRoot.length === 0 ? [] : byRoot.sort(DijkstraPath._currier(DijkstraPath._sortByCostToNode, toNodeId)).reverse()[0];
        return DijkstraPath._navigate(rootWithLongestPathToNode, toNodeId, []).reverse();
    },
    longestPossible: function(graph) {
        var roots = graph.filter(function(node) {
            return node.parents.length == 0;
        });
        var byRoot = roots.map(function(root) {
            var nodes = DijkstraPath._createNodesStructure(graph, -Infinity);
            return DijkstraPath._visitAndRemove(nodes, [], root.id, DijkstraPath._updateCostIfHigher, DijkstraPath._getHighestCostNode);
        });

        var rootWithLongestPathToNode = byRoot.length === 0 ? [] : byRoot.sort(function(lhs, rhs) {
            var lhsMostCostlyNodeNode = lhs.sort(DijkstraPath._sortByCost).reverse()[0];
            var rhsMostCostlyNodeNode = rhs.sort(DijkstraPath._sortByCost).reverse()[0];
            return rhsMostCostlyNodeNode.cost - lhsMostCostlyNodeNode.cost;
        })[0];
        var mostCostlyNodeToReach = rootWithLongestPathToNode.sort(DijkstraPath._sortByCost).reverse()[0];
        return DijkstraPath._navigate(rootWithLongestPathToNode, mostCostlyNodeToReach.id, []).reverse();
    }
}
