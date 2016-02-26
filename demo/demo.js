/*
var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

{
  "nodes": [
    {"id": "red"},
    {"id": "orange"},
    {"id": "yellow"},
    {"id": "green"},
    {"id": "blue"},
    {"id": "violet"}
  ],
  "links": [
    {"source": "red", "target": "yellow"},
    {"source": "red", "target": "blue"},
    {"source": "red", "target": "green"}
  ]
}
var width = 960,
    height = 500;

var force = d3.layout.force()
    .charge(-200)
    .linkDistance(40)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("graph.json", function(error, graph) {
  if (error) throw error;

  var nodeById = d3.map();

  graph.nodes.forEach(function(node) {
    nodeById.set(node.id, node);
  });

  graph.links.forEach(function(link) {
    link.source = nodeById.get(link.source);
    link.target = nodeById.get(link.target);
  });

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 6)
      .style("fill", function(d) { return d.id; })
      .call(force.drag);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});

*/


Object.keys(demoGraphs).forEach(function(graphName) {
	var demoGraph = demoGraphs[graphName];
    var coordinatesForNodes = calculateCoordinates(demoGraph.nodes, 0, 0);

    var graph = {
        nodes: demoGraph.nodes.map(function(node) {
            var coords = coordinatesForNodes.find(graphs.byId(node.id));
            return {
                "id": node.id,
                "fixed": true,
                "x": coords.x,
                "y": coords.y
            }
        }),
        links: [].concat.apply([], demoGraph.nodes.map(function(node) {
            return node.parents.map(function(parentId) {
                return { "source": node.id, "target": parentId }
            })
        }))
    }

    var x_max = d3.max(graph.nodes, function(d) {
        return d.x; });
    var y_max = d3.max(graph.nodes, function(d) {
        return d.y; });

    var width = 400,
        height = 200;

    var xScaler = d3.scale.linear()
        .domain([0, x_max])
        .range([30, width - 30]);

    var yScaler = d3.scale.linear()
        .domain([0, y_max])
        .range([height - 30, 30]);


    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

svg.append("rect")
	.attr("x", 5)
	.attr("y", 5)
	.attr("width", width-10)
	.attr("height", height-10)
	.attr("fill", "#EEE");

    var nodeById = d3.map();

    graph.nodes.forEach(function(node) {
        nodeById.set(node.id, node);
    });

    graph.links.forEach(function(link) {
        link.source = nodeById.get(link.source);
        link.target = nodeById.get(link.target);
    });

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })
        .style("fill", function(d) {
            return color(d.group);
        })
        .call(force.drag);
    node.append("title")
        .text(function(d) {
            return d.id;
        });


    force.on("tick", function() {
        link.attr("x1", function(d) {
                return xScaler(d.source.x);
            })
            .attr("y1", function(d) {
                return yScaler(d.source.y);
            })
            .attr("x2", function(d) {
                return xScaler(d.target.x);
            })
            .attr("y2", function(d) {
                return yScaler(d.target.y);
            });

        node.attr("cx", function(d) {
                return xScaler(d.x);
            })
            .attr("cy", function(d) {
                return yScaler(d.y);
            });
    });

});
