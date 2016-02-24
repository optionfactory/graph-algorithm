var shortestPathDijkstra = function(graph){
	var updatecosts = function(nodes, fromHead){
		if(fromHead.cost === Infinity){
			fromHead.cost = 0;
		}
		var reachableFromHead = nodes.filter(function(node){return node.parents.indexOf(fromHead.id)>-1;})
		reachableFromHead.forEach(function(node){
			if(node.cost < fromHead.cost+1){
				return;
			}
			node.cost = fromHead.cost+1;
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
			return lhs.cost < rhs.cost? -1 : lhs.cost > rhs.cost ? 1 : 0;
		});
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
    
    var rootWithShortestPathToTip = byRoot.sort(function(lhs, rhs){
    	lhs.find(function(node){return node.id==="tip"});
    	rhs.find(function(node){return node.id==="tip"});
    	return lhs.cost - rhs.cost;
    })[0];

    var navigate = function(nodes, startingFromId, result){
		var start = nodes.find(function(node){return node.id===startingFromId});
		if(start == undefined){
			return result;
		}
		result.push(startingFromId);
		return navigate(nodes, start.previous, result);
    }

	rootWithShortestPathToTip.find(function(node){return node.id==="tip"}).previous;
	return navigate(rootWithShortestPathToTip,"tip",[]).reverse();
}