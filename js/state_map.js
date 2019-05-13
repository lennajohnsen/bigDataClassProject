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
        if (stateCode == iD) {
          usa[j].properties.shareMM2018 = +data[i].share_MM18;
          usa[j].properties.shareMM2017 = +data[i].share_MM17;
          usa[j].properties.shareMM2016 = +data[i].share_MM16;
          usa[j].properties.shareMM2015 = +data[i].share_MM15;
          usa[j].properties.shareMM2014 = +data[i].share_MM14;
          usa[j].properties.resettled2018 = +data[i].resettled18;
          usa[j].properties.resettled2017 = +data[i].resettled17;
          usa[j].properties.resettled2016 = +data[i].resettled16;
          usa[j].properties.resettled2015 = +data[i].resettled15;
          usa[j].properties.resettled2014 = +data[i].resettled14;
          usa[j].properties.resettledMM2018 = +data[i].resettled_MM18;
          usa[j].properties.resettledMM2017 = +data[i].resettled_MM17;
          usa[j].properties.resettledMM2016 = +data[i].resettled_MM16;
          usa[j].properties.resettledMM2015 = +data[i].resettled_MM15;
          usa[j].properties.resettledMM2014 = +data[i].resettled_MM14;
          usa[j].State = data[i].state;
          //usa[j].id = data[i].state_code;
          break;
        }
    }
  }

console.log(usa)

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
      })
  .on("click", function(d, i) {
        selector(d);
    });

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(json, json.objects.states, function(a, b) { return a !== b; })));

  function reporter(x) {
    d3.select("#report").text(function() {
      return x.State;
        });
      };

  function selector(x) {
      selected = x.State;
    };

  })
})

switch (selected) {
    case "South Boston Waterfront": return usa[0].properties
    case "Back Bay": return boston311data[1]
    case "East Boston": return boston311data[2]
    case "Roxbury": return boston311data[3]
    case "South End": return boston311data[4]
    case "Beacon Hill": return boston311data[5]
    case "Downtown": return boston311data[6]
    case "Charlestown": return boston311data[7]
    case "West End": return boston311data[8]
    case "Mission Hill": return boston311data[9]
    case "Longwood Medical Area": return boston311data[10]
    case "Roslindale": return boston311data[11]
    case "Jamaica Plain": return boston311data[12]
    case "Chinatown": return boston311data[13]
    case "North End": return boston311data[14]
    case "Bay Village": return boston311data[15]
    case "Leather District": return boston311data[16]
    case "West Roxbury": return boston311data[17]
    case "Mattapan": return boston311data[18]
    case "Fenway": return boston311data[19]
    case "Brighton": return boston311data[20]
    case "South Boston": return boston311data[21]
    case "Allston": return boston311data[22]
    case "Dorchester": return boston311data[23]
  }

var variables = ["Resettled 2014","Resettled_MM 2014","Resettled 2015","resettled_MM15","resettled16","resettled_MM16","resettled17","resettled_MM17","resettled18","resettled_MM18"]
var stateResettle = [
  {"type":variables[0], "num": selected.properties.resettled14},
  {"type":variables[1], "num": selected.properties.resettled_MM14},
  {"type":variables[2], "num": selected.properties.resettled15},
  {"type":variables[3], "num": selected.properties.resettled_MM15},
  {"type":variables[4], "num": selected.properties.resettled16},
  {"type":variables[5], "num": selected.properties.resettled_MM16},
  {"type":variables[6], "num": selected.properties.resettled17},
  {"type":variables[7], "num": selected.properties.resettled_MM17},
  {"type":variables[8], "num": selected.properties.resettled18},
  {"type":variables[9], "num": selected.properties.resettled_MM18},
]

x = d3.scaleBand()
    .domain(stateResettle.map(d => d.type))
    .range([height - margin.bottom, margin.top])
    .padding(0.1)

y = d3.scaleLinear()
    .domain([0, d3.max(stateResettle, d => d.num)])
    .range([margin.left, width - margin.right])

xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.format("d")))
 
yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold"))

var svg4 = d3.select("#id6").append("svg")
      .attr("width", 570)
      .attr("height", 300)
      .style("-webkit-tap-highlight-color", "transparent")
      .style("overflow", "visible");

    svg4.append("g")
      .call(xAxis);
   
    svg4.append("g")
      .call(yAxis);
    
    svg4.append("g")
    .selectAll("rect")
    .data(stateResettle.sort((a, b) => b.num - a.num))
    .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.type))
      .attr("width", d => x(d.num) - x(0))
      .attr("fill", "steelblue")
      .attr("height", y.bandwidth());

    svg4.node().update = () => {
        const t = svg.transition()
            .duration(750);
    
    bar.data(usa, d => d.State)
            .order()
          .transition(t)
            .delay((d, i) => i * 20)
            .attr("x", d => x(d.State));
    }