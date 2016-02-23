var nodeExample = {
	id: justAnyString,
	timestamp: 0,
	parents:[]
}

var graphExamples={
	empty:[
	],
	singleNode:[
		{ id: "2c77781", timestamp: 0,	parents:[] }
	],
	twoNodes:[
		{ id: "2c77781", timestamp: 0,	parents:[] }
		{ id: "b571a26", timestamp: 1,	parents:["2c77781"] }
	],
	threeNodes:[
		{ id: "2c77781", timestamp: 0,	parents:[] }
		{ id: "b571a26", timestamp: 1,	parents:["2c77781"] }
		{ id: "3295c5a", timestamp: 2,	parents:["b571a26"] }
	]
}



