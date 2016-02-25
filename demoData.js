var nodePrototype = { id: "anyString", timestamp: 0, parents: [] }

var demoGraphs = {
    empty: {
        nodes: [],
        shortestToTip: [
            []
        ],
        longestToTip: [
            []
        ],
        longestPossible: [
            []
        ]
    },
    singleNode: {
        nodes: [
            { id: "tip", timestamp: 0, parents: [] }
        ],
        shortestToTip: [
            ["tip"]
        ],
        longestToTip: [
            ["tip"]
        ],
        longestPossible: [
            ["tip"]
        ]
    },
    twoNodes: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "tip", timestamp: 1, parents: ["root"] }
        ],
        shortestToTip: [
            ["root", "tip"]
        ],
        longestToTip: [
            ["root", "tip"]
        ],
        longestPossible: [
            ["root", "tip"]
        ]
    },
    threeNodes: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "node1", timestamp: 1, parents: ["root"] },
            { id: "tip", timestamp: 2, parents: ["node1"] }
        ],
        shortestToTip: [
            ["root", "node1", "tip"]
        ],
        longestToTip: [
            ["root", "node1", "tip"]
        ],
        longestPossible: [
            ["root", "node1", "tip"]
        ]
    },
    forkAtRoot: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "tip", timestamp: 1, parents: ["root"] },
            { id: "branch", timestamp: 2, parents: ["root"] }
        ],
        shortestToTip: [
            ["root", "tip"]
        ],
        longestToTip: [
            ["root", "tip"]
        ],
        longestPossible: [
            ["root", "branch"],
            ["root", "tip"]
        ]
    },
    forkAtFirstLeaf: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "node1", timestamp: 1, parents: ["root"] },
            { id: "tip", timestamp: 2, parents: ["node1"] },
            { id: "branch", timestamp: 3, parents: ["node1"] }
        ],
        shortestToTip: [
            ["root", "node1", "tip"]
        ],
        longestToTip: [
            ["root", "node1", "tip"]
        ],
        longestPossible: [
            ["root", "node1", "branch"],
            ["root", "node1", "tip"]
        ]
    },
    forkAndMerge: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "br1", timestamp: 1, parents: ["root"] },
            { id: "br2", timestamp: 2, parents: ["root"] },
            { id: "tip", timestamp: 3, parents: ["br1", "br2"] }
        ],
        shortestToTip: [
            ["root", "br1", "tip"],
            ["root", "br2", "tip"]
        ],
        longestToTip: [
            ["root", "br1", "tip"],
            ["root", "br2", "tip"]
        ],
        longestPossible: [
            ["root", "br1", "tip"],
            ["root", "br2", "tip"]
        ]
    },
    forkAtRootLongerBranch: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "br1", timestamp: 1, parents: ["root"] },
            { id: "br2", timestamp: 2, parents: ["root"] },
            { id: "tip", timestamp: 5, parents: ["br1"] }
        ],
        shortestToTip: [
            ["root", "br1", "tip"]
        ],
        longestToTip: [
            ["root", "br1", "tip"]
        ],
        longestPossible: [
            ["root", "br1", "tip"]
        ]
    },
    forkAtRootShorterBranch: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "br1n1", timestamp: 1, parents: ["root"] },
            { id: "br1n2", timestamp: 5, parents: ["br1n1"] },
            { id: "tip", timestamp: 2, parents: ["root"] }
        ],
        shortestToTip: [
            ["root", "tip"]
        ],
        longestToTip: [
            ["root", "tip"]
        ],
        longestPossible: [
            ["root", "br1n1", "br1n2"]
        ]
    },
    forkAtFirstLeafLongerBranch: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "node1", timestamp: 1, parents: ["root"] },
            { id: "br1", timestamp: 2, parents: ["node1"] },
            { id: "br2", timestamp: 3, parents: ["node1"] },
            { id: "tip", timestamp: 4, parents: ["br1"] }
        ],
        shortestToTip: [
            ["root", "node1", "br1", "tip"]
        ],
        longestToTip: [
            ["root", "node1", "br1", "tip"]
        ],
        longestPossible: [
            ["root", "node1", "br1", "tip"]
        ]
    },
    forkAndMergeLongerBranch: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "br1n1", timestamp: 1, parents: ["root"] },
            { id: "br1n2", timestamp: 3, parents: ["br1n1"] },
            { id: "br2", timestamp: 2, parents: ["root"] },
            { id: "tip", timestamp: 4, parents: ["br1n2", "br2"] }
        ],
        shortestToTip: [
            ["root", "br2", "tip"]
        ],
        longestToTip: [
            ["root", "br1n1", "br1n2", "tip"]
        ],
        longestPossible: [
            ["root", "br1n1", "br1n2", "tip"]
        ]
    },
    twoRoots: {
        nodes: [
            { id: "root1", timestamp: 0, parents: [] },
            { id: "root2", timestamp: 2, parents: [] },
            { id: "tip", timestamp: 4, parents: ["root1", "root2"] }
        ],
        shortestToTip: [
            ["root1", "tip"],
            ["root2", "tip"]
        ],
        longestToTip: [
            ["root1", "tip"],
            ["root2", "tip"]
        ],
        longestPossible: [
            ["root1", "tip"],
            ["root2", "tip"]
        ]
    },
    twoRootsOneMissing: {
        nodes: [
            { id: "root2", timestamp: 2, parents: [] },
            { id: "tip", timestamp: 4, parents: ["root1", "root2"] }
        ],
        shortestToTip: [
            ["root2", "tip"]
        ],
        longestToTip: [
            ["root2", "tip"]
        ],
        longestPossible: [
            ["root2", "tip"]
        ]
    },
    twoRootsLongerBranch: {
        nodes: [
            { id: "root1", timestamp: 0, parents: [] },
            { id: "node1", timestamp: 2, parents: ["root1"] },
            { id: "root2", timestamp: 4, parents: [] },
            { id: "tip", timestamp: 8, parents: ["node1", "root2"] }
        ],
        shortestToTip: [
            ["root2", "tip"]
        ],
        longestToTip: [
            ["root1", "node1", "tip"]
        ],
        longestPossible: [
            ["root1", "node1", "tip"]
        ]
    },
    crossingBranches: {
        nodes: [
            { id: "root", timestamp: 0, parents: [] },
            { id: "m1", timestamp: 0, parents: ["root"] },
            { id: "m2", timestamp: 0, parents: ["m1"] },
            { id: "m3", timestamp: 0, parents: ["m2", "b3"] },
            { id: "m4", timestamp: 0, parents: ["m3", "a3"] },
            { id: "m5", timestamp: 0, parents: ["m4"] },
            { id: "m6", timestamp: 0, parents: ["m5"] },
            { id: "m7", timestamp: 0, parents: ["m6"] },
            { id: "a1", timestamp: 0, parents: ["m1"] },
            { id: "a3", timestamp: 0, parents: ["a1"] },
            { id: "a4", timestamp: 0, parents: ["m4"] },
            { id: "tip", timestamp: 0, parents: ["a4"] },
            { id: "b1", timestamp: 0, parents: ["root"] },
            { id: "b2", timestamp: 0, parents: ["b1"] },
            { id: "b3", timestamp: 0, parents: ["b2"] },
            { id: "b4", timestamp: 0, parents: ["m2"] },
            { id: "b5", timestamp: 0, parents: ["b4"] },
        ],
        shortestToTip: [
            ["root", "m1", "a1", "a3", "m4", "a4", "tip"],
            ["root","m1","m2","m3","m4","a4","tip"]
        ],
        longestToTip: [
            ["root", "b1", "b2", "b3","m3", "m4", "a4", "tip"]
        ],
        longestPossible: [
            ["root", "b1", "b2", "b3","m3", "m4", "m5", "m6"]
        ]
    }
}
