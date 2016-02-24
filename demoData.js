var nodePrototype = { id: "anyString",	timestamp: 0, parents:[] }

var demoGraphs ={
	empty:[
	],
	singleNode:[
		{ id: "tip", 	timestamp: 0, parents:[] }
	],
	twoNodes:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "tip", 	timestamp: 1, parents:["root"] }
	],
	threeNodes:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "node1", 	timestamp: 1, parents:["root"] },
		{ id: "tip", 	timestamp: 2, parents:["node1"] }
	],
	fourNodes:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "node1", 	timestamp: 1, parents:["root"] },
		{ id: "node2", 	timestamp: 2, parents:["node1"] },
		{ id: "tip", 	timestamp: 3, parents:["node2"] }
	],
	forkAtRoot:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "tip", 	timestamp: 1, parents:["root"] },
		{ id: "branch",	timestamp: 2, parents:["root"] }
	],
	forkAtFirstLeaf:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "node1", 	timestamp: 1, parents:["root"] },
		{ id: "tip", 	timestamp: 2, parents:["node1"] },
		{ id: "branch",	timestamp: 3, parents:["node1"] }
	],
	forkAndMerge:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "br1", 	timestamp: 1, parents:["root"] },
		{ id: "br2", 	timestamp: 2, parents:["root"] },
		{ id: "tip", 	timestamp: 3, parents:["br1", "br2"] }
	],
	forkAtRootLongerBranch:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "br1n1", 	timestamp: 1, parents:["root"] },
		{ id: "br2", 	timestamp: 2, parents:["root"] },
		{ id: "tip", 	timestamp: 1, parents:["br1n1"] }
	],
	forkAtFirstLeafLongerBranch:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "node1", 	timestamp: 1, parents:["root"] },
		{ id: "br1n1", 	timestamp: 2, parents:["node1"] },
		{ id: "br2", 	timestamp: 3, parents:["node1"] },
		{ id: "tip", 	timestamp: 1, parents:["br1n1"] }
	],
	forkAndMergeLongerBranch:[
		{ id: "root", 	timestamp: 0, parents:[] },
		{ id: "br1n1", 	timestamp: 2, parents:["root"] },
		{ id: "br2", 	timestamp: 2, parents:["root"] },
		{ id: "br1n2", 	timestamp: 3, parents:["br1n1"] },
		{ id: "tip", 	timestamp: 4, parents:["br1n2", "br2"] }
	]
}



