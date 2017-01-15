// get the team from user selection
var input = document.getElementById("team_picker");
input.addEventListener('change',updatePage);

// counter = 0 when there is no graph to remove
counter = 0

function updatePage() {
      if(counter > 0){
      	var oldPlot = document.getElementById("points")
      	oldPlot.remove()
     	}
      var team = this.value;
      if(team !== "null"){
      	plotRecord(team)
      } else {
      	counter = 0
      };
  }


function plotRecord(team){
	// initialize the svg
	var plotArea = d3.select("body");

	var margin = {top: 30, right: 30, bottom: 30, left: 30},
	    w = 1000 - margin.left - margin.right,
	    h = 500 - margin.top - margin.bottom;

	var vizArea = plotArea.append("svg")
		.attr("id","points")
		.attr("width", w + margin.left + margin.right)
	    .attr("height", h + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", 
	              "translate(" + margin.left + "," + margin.top + ")");

	// scale x and y values to plot area
	var x = d3.scaleLinear()
		.domain([0,35])
	    .range([0, w]);

	var y = d3.scaleLinear()
		.domain([0,3])
	    .range([h, 0]);

	// generate x and y values
	var trendline = d3.line()
	    .x(function(d) { return x(d.Week);  })
	    .y(function(d) { return y(d[team]); })
	    .curve(d3.curveMonotoneX); // define curve function here

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
	      	.enter()
	      	.append("circle")
	        .attr("r", 4)
	        .attr("cx", function(d) { return x(d.Week); })
	        .attr("cy", function(d) { return y(d[team]); });

	    vizArea.append("g")
	      .call(d3.axisBottom(x))
	      .attr("transform", "translate(0," + h + ")");

	  	vizArea.append("g")
	      .call(d3.axisLeft(y).tickValues([0,1,3]));
	});
	
	// increment counter
	counter++
}

