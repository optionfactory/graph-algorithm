var navigate = function(nodes, startingFromId, result){
	var start = nodes.find(function(node){return node.id===startingFromId});
	if(start == undefined){
		return result;
	}
	result.push(startingFromId);
	return navigate(nodes, start.previous, result);
}
var sortByCost = function(lhs, rhs){
	return lhs.cost < rhs.cost? -1 : lhs.cost > rhs.cost ? 1 : 0;
};

var shortestPathToTipDijkstra = function(graph){
	var updatecosts = function(nodes, fromHead){
		if(fromHead.cost === Infinity){
			fromHead.cost = 0;
		}
		var newCost = fromHead.cost + 1;
		var reachableFromHead = nodes.filter(function(node){return node.parents.indexOf(fromHead.id)>-1;})
		reachableFromHead.forEach(function(node){
			if(node.cost < newCost){
				return;
			}
			node.cost = newCost;
			node.previous = fromHead.id;
		});
	}

	var visitAndRemove = function(nodes, visited, fromHeadId){
		if(nodes.length<=1){
			return visited.concat(nodes);
		}
		var head = nodes.find(function(node){return node.id===fromHeadId;});
		nodes = nodes.filter(function(node){return node.id!==fromHeadId;});
		updatecosts(nodes, head);
		visited.push(head);	
		nodes.sort(sortByCost);
		return visitAndRemove(nodes, visited, nodes[0].id);
	}

	var roots = graph.filter(function(node){return node.parents.length == 0;});
    var byRoot = roots.map(function(root){
		var nodes = graph.map(function(node){
			return {
				id: node.id,
				parents: node.parents,
				cost: Infinity,
				previous: undefined
			}
		});
		return visitAndRemove(nodes, [], root.id);
    });

    var rootWithShortestPathToTip = byRoot.length===0?[] : byRoot.sort(function(lhs, rhs){
    	var lhsNode = lhs.find(function(node){return node.id==="tip"});
    	var rhsNode = rhs.find(function(node){return node.id==="tip"});
    	return lhsNode.cost - rhsNode.cost;
    })[0];

	return navigate(rootWithShortestPathToTip,"tip",[]).reverse();
}

var longestPathToTipDijkstra = function(graph){
	var updatecosts = function(nodes, fromHead){
		if(fromHead.cost === -Infinity){
			fromHead.cost = 0;
		}
		var newCost = fromHead.cost + 1;
		var reachableFromHead = nodes.filter(function(node){return node.parents.indexOf(fromHead.id)>-1;})
		reachableFromHead.forEach(function(node){
			if(node.cost > newCost){
				return;
			}
			node.cost = newCost;
			node.previous = fromHead.id;
		});
	}

	var visitAndRemove = function(nodes, visited, fromHeadId){
		if(nodes.length<=1){
			return visited.concat(nodes);
		}
		var head = nodes.find(function(node){return node.id===fromHeadId;});
		nodes = nodes.filter(function(node){return node.id!==fromHeadId;});
		updatecosts(nodes, head);
		visited.push(head);	
		nodes.sort(sortByCost).reverse();
		return visitAndRemove(nodes, visited, nodes[0].id);
	}

	var roots = graph.filter(function(node){return node.parents.length == 0;});
    var byRoot = roots.map(function(root){
		var nodes = graph.map(function(node){
			return {
				id: node.id,
				parents: node.parents,
				cost: -Infinity,
				previous: undefined
			}
		});
		return visitAndRemove(nodes, [], root.id);
    });
    
    var rootWithLongestPathToTip =byRoot.length===0?[]: byRoot.sort(function(lhs, rhs){
    	var lhsNode = lhs.find(function(node){return node.id==="tip"});
    	var rhsNode = rhs.find(function(node){return node.id==="tip"});
    	return rhsNode.cost - lhsNode.cost;
    })[0];

	return navigate(rootWithLongestPathToTip,"tip",[]).reverse();
}

var longestPathDijkstra = function(graph){
	var updatecosts = function(nodes, fromHead){
		if(fromHead.cost === -Infinity){
			fromHead.cost = 0;
		}
		var newCost = fromHead.cost + 1;
		var reachableFromHead = nodes.filter(function(node){return node.parents.indexOf(fromHead.id)>-1;})
		reachableFromHead.forEach(function(node){
			if(node.cost > newCost){
				return;
			}
			node.cost = newCost;
			node.previous = fromHead.id;
		});
	}

	var visitAndRemove = function(nodes, visited, fromHeadId){
		if(nodes.length<=1){
			return visited.concat(nodes);
		}
		var head = nodes.find(function(node){return node.id===fromHeadId;});
		nodes = nodes.filter(function(node){return node.id!==fromHeadId;});
		updatecosts(nodes, head);
		visited.push(head);	
		nodes.sort(function(lhs, rhs){
			return lhs.cost < rhs.cost? 1 : lhs.cost > rhs.cost ? -1 : 0;
		});
		return visitAndRemove(nodes, visited, nodes[0].id);
	}

	var roots = graph.filter(function(node){return node.parents.length == 0;});
    var byRoot = roots.map(function(root){
		var nodes = graph.map(function(node){
			return {
				id: node.id,
				parents: node.parents,
				cost: -Infinity,
				previous: undefined
			}
		});
		return visitAndRemove(nodes, [], root.id);
    });
    
    var rootWithLongestPathToTip = byRoot.length===0
	    ? []
	    : byRoot.sort(function(lhs, rhs){
	    	var lhsNode = lhs.sort(sortByCost).reverse()[0];
	    	var rhsNode = rhs.sort(sortByCost).reverse()[0];
	    	return rhsNode.cost - lhsNode.cost;
		  })[0];
	var mostCostlyNodeToReach = rootWithLongestPathToTip.sort(sortByCost).reverse()[0];
	return navigate(rootWithLongestPathToTip,mostCostlyNodeToReach.id,[]).reverse();
}