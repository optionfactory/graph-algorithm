var nodePrototype = { id: "anyString",	timestamp: 0, parents:[] }

var demoGraphs ={
	empty:{
		nodes:[],
		shortestToTip:	[],
		longestToTip:	[], 
		longest:		[]
	},
	singleNode:{
		nodes:[
			{ id: "tip", 	timestamp: 0, parents:[] }
		],
		shortestToTip:	["tip"],
		longestToTip:	["tip"], 
		longest:		["tip"]
	},
	twoNodes:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "tip", 	timestamp: 1, parents:["root"] }
		],
		shortestToTip:	["root", "tip"],
		longestToTip:  	["root", "tip"],
		longest:		["root", "tip"]
	},
	threeNodes:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 1, parents:["root"] },
			{ id: "tip", 	timestamp: 2, parents:["node1"] }
		],
		shortestToTip:	["root", "node1", "tip"],
		longestToTip:	["root", "node1", "tip"],
		longest:		["root", "node1", "tip"]
	},
	forkAtRoot:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "tip", 	timestamp: 1, parents:["root"] },
			{ id: "branch",	timestamp: 2, parents:["root"] }
		],
		shortestToTip:	["root","tip"],
		longestToTip:	["root","tip"],
		longest:		["root","branch"]
	},
	forkAtFirstLeaf:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 1, parents:["root"] },
			{ id: "tip", 	timestamp: 2, parents:["node1"] },
			{ id: "branch",	timestamp: 3, parents:["node1"] }
		],
		shortestToTip:	["root","node1", "tip"],
		longestToTip:	["root", "node1","tip"],
		longest:		["root","node1","branch"]
	},
	forkAndMerge:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "br1", 	timestamp: 1, parents:["root"] },
			{ id: "br2", 	timestamp: 2, parents:["root"] },
			{ id: "tip", 	timestamp: 3, parents:["br1", "br2"] }
		],
		shortestToTip:	["root", "br2", "tip"],
		longestToTip:	["root", "br1", "tip"],
		longest:		["root", "br1", "tip"]
	},
	forkAtRootLongerBranch:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "br1", 	timestamp: 1, parents:["root"] },
			{ id: "br2", 	timestamp: 2, parents:["root"] },
			{ id: "tip", 	timestamp: 5, parents:["br1"] }
		],
		shortestToTip:	["root", "br1", "tip"],
		longestToTip:	["root", "br1", "tip"],
		longest:		["root", "br1", "tip"]
	},
	forkAtRootShorterBranch:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "br1n1", 	timestamp: 1, parents:["root"] },
			{ id: "tip", 	timestamp: 2, parents:["root"] },
			{ id: "br1n2", 	timestamp: 5, parents:["br1n1"] }
		],
		shortestToTip:	["root", "tip"],
		longestToTip:	["root", "tip"],
		longest:		["root", "br1n1", "br1n2"]
	},
	forkAtFirstLeafLongerBranch:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 1, parents:["root"] },
			{ id: "br1", 	timestamp: 2, parents:["node1"] },
			{ id: "br2", 	timestamp: 3, parents:["node1"] },
			{ id: "tip", 	timestamp: 4, parents:["br1"] }
		],
		shortestToTip:	["root", "node1", "br1", "tip"],
		longestToTip:	 ["root", "node1", "br1", "tip"],
		longest:		["root", "node1", "br1", "tip"]
	},
	forkAndMergeLongerBranch:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "br1n1", 	timestamp: 1, parents:["root"] },
			{ id: "br2", 	timestamp: 2, parents:["root"] },
			{ id: "br1n2", 	timestamp: 3, parents:["br1n1"] },
			{ id: "tip", 	timestamp: 4, parents:["br1n2", "br2"] }
		],
		shortestToTip:	["root", "br2", "tip"],
		longestToTip:	["root", "br1n1", "br1n2", "tip"],
		longest:		["root", "br1n1", "br1n2", "tip"]
	},
	twoRoots:{
		nodes:[
			{ id: "root1", 	timestamp: 0, parents:[] },
			{ id: "root2", 	timestamp: 2, parents:[] },
			{ id: "tip", 	timestamp: 4, parents:["root1", "root2"] }
		],
		shortestToTip:	["root1", "tip"],
		longestToTip:	["root2", "tip"],
		longest:		["root2", "tip"]
	},
	twoRootsLongerBranch:{
		nodes:[
			{ id: "root1", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 2, parents:["root1"] },
			{ id: "root2", 	timestamp: 4, parents:[] },
			{ id: "tip", 	timestamp: 8, parents:["node1", "root2"] }
		],
		shortestToTip:	["root2", "tip"],
		longestToTip:	["root1", "node1", "tip"],
		longest:		["root1", "node1", "tip"]
	}
}



