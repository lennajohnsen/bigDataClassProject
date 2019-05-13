//bl.ocks.org/mbostock/4090848
//bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
//bl.ocks.org/phil-pedruco/10447085

var svg = d3.select("#id5").append("svg")
  .attr("width", 1000)
  .attr("height", 600);

var projection = d3.geoAlbersUsa()
  .scale([100]);

var path = d3.geoPath()
 //.projection(projection)

d3.csv("data/MMresettle_2014-2018.csv", function(data) {
  d3.json("data/us.json", function(json) {

    var usa = topojson.feature(json, json.objects.states).features;
     
    for (var i = 0; i < data.length; i++) {
        var stateCode = +data[i].state_code
      for (var j in usa){
        var iD = +usa[j].id
        if (stateCode == iD){
          usa[j].State = data[i].state;
        }
          break;
        }
    }


console.log(usa[2])

var stateShapes = svg.append("g")
    .attr("class", "states")
    .selectAll("path")
	  .data(usa)
	.enter().append("path")
	  .attr("d", path)
    .attr("class", "resettle")
   //.attr("opacity", d => d.properties.shareMM2016)
   
  .on("mouseover", function(d, i) {
          reporter(d);
      });

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(json, json.objects.states, function(a, b) { return a !== b; })));

  function reporter(x) {
    d3.select("#report").text(function() {
      return x.State;
        });
};

  })
})

// var line = d3.line()
//   .defined(d => !isNaN(d.Cap))
//   .x(d => x(d.Year))
//   .y(d => y(d.Cap))

// var line2 = d3.line()
//   .defined(d => !isNaN(d.resettled))
//   .x(d => x(d.Year))
//   .y(d => y(d.resettled))

// function update(year){
// 		slider.property("value", year);
// 		d3.select(".year").text(year);
// 		stateShapes.style("opacity", function(d) {
// 			return d.shareMM
// 		});
// 	}

// var slider = d3.select(".slider")
// 		.append("input")
// 			.attr("type", "range")
// 			.attr("min", 2014)
// 			.attr("max", 2018)
// 			.attr("step", 1)
// 			.on("input", function() {
// 				var year = this.value;
// 				update(year);
// 			});

// update(2014)