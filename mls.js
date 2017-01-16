// get the team from user selection
var input = document.getElementById("team_picker");
input.addEventListener('change',updatePage);

// counter = 0 when there is no graph to remove
counter = 0

const teamColors = {
	"Chicago Fire" : ['#102141','#B51737'],
	"Colorado Rapids" : ['#862633','#8BB8E8'],
	"Columbus Crew" : ['#FFF200','#000000'],
	"DC United" : ['#EF3E42','#000000'],
	"FC Dallas" : ['#BF0D3E','#00205B'],
	"Houston Dynamo" : ['#F68712','#8DC6ED'],
	"Los Angeles Galaxy" : ['#00245D','#3365B1'],
	"Montreal Impact" : ['#00529B','#000000'],
	"New England Revolution" : ['#C63323','#222352'],
	"New York City" : ['#69ACE5','#0F1D41'],
	"New York Red Bulls" : ['#ED1E36','#23326A'],
	"Orlando City" : ['#612B9B','#FFE198'],
	"Philadelphia Union" : ['#0E1B2A','#B1872D'],
	"Portland Timbers" : ['#EAE727','#004812'],
	"Real Salt Lake" : ['#B30838','#013A81'],
	"San Jose Earthquakes" : ['#231F20','#0D4C92'],
	"Seattle Sounders" : ['#005695','#5D9732'],
	"Sporting Kansas City" : ['#93B1D7','#002A5C'],
	"Toronto FC" : ['#E31937','#455560'],
	"Vancouver Whitecaps" : ['#00245E','#9DC2EA']
	};

function updatePage() {
      if(counter > 0){
      	var oldPlot = document.getElementById("points")
      	oldPlot.remove()
     	}
      var team = this.value;
      if(team !== "null"){
      	document.documentElement.style.setProperty(`--primary`, teamColors[team][0]);
      	document.documentElement.style.setProperty(`--secondary`, teamColors[team][1]);
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
		.domain([1,34])
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

		vizArea.append("g")
	      .call(d3.axisBottom(x))
	      .attr("class", "axis")
	      .attr("transform", "translate(0," + h + ")");

	  	vizArea.append("g")
	      .call(d3.axisLeft(y)
	      .tickValues([0,1,3])
	      .tickFormat(d3.format("d")))
	      .attr("class", "axis");

		path = vizArea.append("path")
			.attr("class", "line")
	        .attr("d", trendline(data));
	       
	    var pathLength = path.node().getTotalLength();

    	path
	      .attr("stroke-dasharray", pathLength + " " + pathLength)
	      .attr("stroke-dashoffset", pathLength)
	      .transition()
	      .duration(5000)
          .attr("stroke-dashoffset", 0);

	    vizArea.selectAll("dot")
	        .data(data)
	      	.enter()
	      	.append("circle")
	        .attr("r", 5)
	        .attr("cx", function(d) { return x(d.Week); })
	        .attr("cy", function(d) { return y(d[team]); })
	       	.attr("class","dot");

		});
	
	// increment counter
	counter++

	}

