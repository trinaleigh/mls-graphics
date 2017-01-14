const team = 'Philadelphia Union'

// initialize the svg
var plotArea = d3.select("body");
 
var vizArea = plotArea.append("svg")
	.attr("width", 1000)
    .attr("height", 600);

var x = d3.scaleLinear()
	.domain([1,34])
    .range([0, 1000]);

var y = d3.scaleLinear()
	.domain([0,3])
    .range([600, 0]);

var trendline = d3.line()
    .x(function(d) { return x(d.Week);  })
    .y(function(d) { console.log(d[team]); return y(d[team]); });

// plot team info from data file
d3.csv("data.txt", function(data){
	data.forEach(function(d){
		// convert to numbers
		d.Week = +d.Week
		d[team] = +d[team];  
	});

	vizArea.append("path")
		.attr("class", "line")
        .attr("d", trendline(data));

    vizArea.selectAll("dot")
        .data(data)
      	.enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.Week); })
        .attr("cy", function(d) { return y(d[team]); });


});


