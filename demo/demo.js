function pluck(name) {
    var v, params = Array.prototype.slice.call(arguments, 1);
    return function(o) {
        return (typeof(v = o[name]) === 'function' ? v.apply(o, params) : v);
    };
}

function identity(d) {
    return d;
}

function adaptGraphToD3Format(rawGraph, canvas, padding) {
    function createXScaler(nodes, svgWidth, horizontalPadding) {
        var x_min = d3.min(nodes, function(d) {
            return d.x;
        });
        var x_max = d3.max(nodes, function(d) {
            return d.x;
        });
        return d3.scale.linear()
            .domain([x_min, x_max])
            .range([horizontalPadding, svgWidth - horizontalPadding]);
    }

    function createYScaler(nodes, svgHeight, verticalPadding) {
        var y_min = d3.min(nodes, function(d) {
            return d.y;
        });
        var y_max = d3.max(nodes, function(d) {
            return d.y;
        });

        return d3.scale.linear()
            .domain([y_min, y_max])
            .range([svgHeight - verticalPadding, verticalPadding]);
    }

    var coordinatesForNodes = calculateCoordinates(rawGraph);
    var coordsById = d3.map();


    coordinatesForNodes.forEach(function(coordinates) {
        coordsById.set(coordinates.id, coordinates);
    });

    var xScaler = createXScaler(coordinatesForNodes, canvas.width, padding.horizontal);
    var yScaler = createYScaler(coordinatesForNodes, canvas.height, padding.vertical);

    var adaptedNodes = rawGraph.nodes.map(function(node) {
        return {
            "id": node.id,
            "fixed": true,
            "x": xScaler(coordsById.get(node.id).x),
            "y": yScaler(coordsById.get(node.id).y)
        }
    });
    var adaptedNodeById = d3.map();
    adaptedNodes.forEach(function(node) {
        adaptedNodeById.set(node.id, node);
    });

    return {
        nodes: adaptedNodes,
        links: [].concat.apply([], rawGraph.nodes.map(function(node) {
            return node.parents.map(function(parentId) {
                return { "source": adaptedNodeById.get(node.id), "target": adaptedNodeById.get(parentId) }
            })
        }))
    }

}
Object.keys(demoGraphs).forEach(function(graphName) {
    var demoGraph = demoGraphs[graphName];
    var canvas = {
        width: 400,
        height: 200
    }
    var graphPadding = {
        horizontal: canvas.width * .08,
        vertical: canvas.height * .25
    }

    var graph = adaptGraphToD3Format(demoGraph, canvas, graphPadding);
    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(0)
        .linkDistance(0)
        .size([canvas.width, canvas.height])
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", canvas.width)
        .attr("height", canvas.height);


    //canvas background
    svg.append("rect")
        .attr("x", 5)
        .attr("y", 5)
        .attr("width", canvas.width - 5)
        .attr("height", canvas.height - 5)
        .attr("fill", "#EEE");

    var nodeRadius = 8;

    var nodeLabels = svg.append("g")
        .selectAll(".title")
        .data([graphName])
        .enter()
        .append("text")
        .attr("class", "nodeLabel")
        .attr("x", canvas.width / 2)
        .attr("y", "0")
        .attr("dy", "1.25em")
        .attr("text-anchor", "middle")
        .text(identity);

    //draw actual svg elements
    var nodes = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", nodeRadius)
        .attr("cx", pluck("x"))
        .attr("cy", pluck("y"))
        .style("fill", function(d) {
            return color(d.group);
        })
        .call(force.drag);

    var nodeLabels = svg.append("g")
        .selectAll(".nodeLabel")
        .data(graph.nodes)
        .enter()
        .append("text")
        .attr("class", "nodeLabel")
        .attr("x", pluck("x"))
        .attr("y", function(d) {
            return d.y + nodeRadius
        })
        .attr("dy", ".75em")
        .attr("text-anchor", "middle")
        .text(pluck("id"));

    var links = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("marker-end", "url(#arrow)")
        .attr("d", function(d) {
            var path = "";
            // move to starting node's center
            path += "M " + (d.source.x - nodeRadius) + " " + d.source.y + " ";
            // cubic Bezier curve control points. magic number here
            path += "C " + (d.source.x - 30) + " " + d.source.y + " ";
            path += ", " + (d.target.x + 30) + " " + d.target.y + " ";
            // final destination (just right of the destination node)
            path += ", " + (d.target.x + nodeRadius) + " " + d.target.y + " ";
            return path;
        });

    var lineArrow = svg.append("defs").selectAll("marker")
        .data(["arrow"])
        .enter().append("marker")
        .attr("id", identity)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", nodeRadius)
        .attr("refY", 5)
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z");

    force.on("tick", function() {

    });

});
