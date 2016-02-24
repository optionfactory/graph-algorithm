var nodePrototype = { id: "anyString",	timestamp: 0, parents:[] }

var demoGraphs ={
	empty:{
		nodes:[],
		shortest:[],
		longest:[]
	},
	singleNode:{
		nodes:[
			{ id: "tip", 	timestamp: 0, parents:[] }
		],
		shortest:["tip"],
		longest:["tip"]
	},
	twoNodes:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "tip", 	timestamp: 1, parents:["root"] }
		],
		shortest:["root", "tip"],
		longest:["root", "tip"]
	},
	threeNodes:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 1, parents:["root"] },
			{ id: "tip", 	timestamp: 2, parents:["node1"] }
		],
		shortest:["root", "node1", "tip"],
		longest:["root", "node1", "tip"]
	},
	fourNodes:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 1, parents:["root"] },
			{ id: "node2", 	timestamp: 2, parents:["node1"] },
			{ id: "tip", 	timestamp: 3, parents:["node2"] }
		],
		shortest:["root", "node1", "node2", "tip"],
		longest:["root", "node1", "node2", "tip"]
	},
	forkAtRoot:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "tip", 	timestamp: 1, parents:["root"] },
			{ id: "branch",	timestamp: 2, parents:["root"] }
		],
		shortest:[],
		longest:[]
	},
	forkAtFirstLeaf:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 1, parents:["root"] },
			{ id: "tip", 	timestamp: 2, parents:["node1"] },
			{ id: "branch",	timestamp: 3, parents:["node1"] }
		],
		shortest:["root", "tip"],
		longest:["root", "tip"]
	},
	forkAndMerge:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "br1", 	timestamp: 1, parents:["root"] },
			{ id: "br2", 	timestamp: 2, parents:["root"] },
			{ id: "tip", 	timestamp: 3, parents:["br1", "br2"] }
		],
		shortest:["root", "br2", "tip"],
		longest:["root", "br2", "tip"]
	},
	forkAtRootLongerBranch:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "br1", 	timestamp: 1, parents:["root"] },
			{ id: "br2", 	timestamp: 2, parents:["root"] },
			{ id: "tip", 	timestamp: 1, parents:["br1"] }
		],
		shortest:["root", "br1", "tip"],
		longest:["root", "br1", "tip"]
	},
	forkAtFirstLeafLongerBranch:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 1, parents:["root"] },
			{ id: "br1", 	timestamp: 2, parents:["node1"] },
			{ id: "br2", 	timestamp: 3, parents:["node1"] },
			{ id: "tip", 	timestamp: 1, parents:["br1"] }
		],
		shortest:["root", "node1", "br1", "tip"],
		longest: ["root", "node1", "br1", "tip"]
	},
	forkAndMergeLongerBranch:{
		nodes:[
			{ id: "root", 	timestamp: 0, parents:[] },
			{ id: "br1n1", 	timestamp: 2, parents:["root"] },
			{ id: "br2", 	timestamp: 2, parents:["root"] },
			{ id: "br1n2", 	timestamp: 3, parents:["br1n1"] },
			{ id: "tip", 	timestamp: 4, parents:["br1n2", "br2"] }
		],
		shortest:["root", "br2", "tip"],
		longest:["root", "br1n1", "br1n2", "tip"]
	},
	twoRoots:{
		nodes:[
			{ id: "root1", 	timestamp: 0, parents:[] },
			{ id: "root2", 	timestamp: 0, parents:[] },
			{ id: "tip", 	timestamp: 4, parents:["root1", "root2"] }
		],
		shortest:["root1", "tip"],
		longest:["root1", "tip"]
	},
	twoRootsLongerBranch:{
		nodes:[
			{ id: "root1", 	timestamp: 0, parents:[] },
			{ id: "node1", 	timestamp: 0, parents:["root1"] },
			{ id: "root2", 	timestamp: 0, parents:[] },
			{ id: "tip", 	timestamp: 4, parents:["node1", "root2"] }
		],
		shortest:["root2", "tip"],
		longest:["root1", "node1", "tip"]
	}
}



