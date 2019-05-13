//bl.ocks.org/mbostock/4090848
//bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
//bl.ocks.org/phil-pedruco/10447085

var svg = d3.select("#id5").append("svg")
  .attr("width", 1000)
  .attr("height", 600);

var projection = d3.geoAlbersUsa()
  .scale([100]);

var tooltip = floatingTooltip('gates_tooltip', 240);  

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
    let stateChosen = d3.select(this);
    const node = svg4.node();
    node.value = value = value === d.State ? 0 : d.State;
    node.dispatchEvent(new CustomEvent("input"));
    })
    .on('mouseover', showDetail)
    .on('mouseout', hideDetail);

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

//an attempt to make a bar chart appear like final question here https://observablehq.com/@cesandoval/pset-8/2
//but .filter is unhappy with the data

// bos311 = d3.csv("data/MMresettle_2014-2018.csv")

// var variables = ["resettled14","resettled_MM14","resettled15","resettled_MM15","resettled16","resettled_MM16","resettled17","resettled_MM17","resettled18","resettled_MM18"]
// // var stateResettle = [
// //   {"type":variables[0], "num": selected.properties.resettled14},
// //   {"type":variables[1], "num": selected.properties.resettled_MM14},
// //   {"type":variables[2], "num": selected.properties.resettled15},
// //   {"type":variables[3], "num": selected.properties.resettled_MM15},
// //   {"type":variables[4], "num": selected.properties.resettled16},
// //   {"type":variables[5], "num": selected.properties.resettled_MM16},
// //   {"type":variables[6], "num": selected.properties.resettled17},
// //   {"type":variables[7], "num": selected.properties.resettled_MM17},
// //   {"type":variables[8], "num": selected.properties.resettled18},
// //   {"type":variables[9], "num": selected.properties.resettled_MM18},
// // ]

 margin = ({top: 10, right: 10, bottom: 20, left: 120})
// width = 570
// height = 300

// y = d3.scaleBand()
//     .domain(variables)
//     .range([height - margin.bottom, margin.top])
//     .padding(0.1)

// x = d3.scaleLinear()
//     .domain([0, d3.max(bos311, d => d.Resettle)])
//     .range([margin.left, width - margin.right])

yAxis = g => g
     .attr("transform", `translate(0,${height - margin.bottom})`)
     .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.format("d")))
 
xAxis = g => g
     .attr("transform", `translate(${margin.left},0)`)
     .call(d3.axisLeft(y))
     .call(g => g.select(".domain").remove())
     .call(g => g.select(".tick:last-of-type text").clone()
       .attr("x", 3)
       .attr("text-anchor", "start")
       .attr("font-weight", "bold"))

 svg4 = d3.select("#id6").append("svg")
       .attr("width", 570)
       .attr("height", 300)
       .style("-webkit-tap-highlight-color", "transparent")
       .style("overflow", "visible");
       //.attr("viewBox", `0 0 ${width} ${height}`);
  
//   if (!this) {
//     svg4.append("g")
//         .attr("fill", "steelblue")
//       .selectAll("rect")
//       .data(data)
//       .join("rect")
//         .attr("width", 0)
//         .attr("class", "bar")

     svg4.append("g")
       .attr("class", "x-axis")

       svg4.append("g")
       .attr("class", "y-axis")
//   }
  
//   svg4.selectAll(".bar")
//     .data(mapfilter_data)
//       .attr("x", d => x(0))
//       .attr("y", d => y(d.Name))
//       .attr("height", y.bandwidth())
//     .transition()
//       .delay((d, i) => i * 20)
//       .attr("width", d => x(d.Resettled));
  
//   function mapfilter_data(){
//         let reshape = []
//         bos311 = d3.csv("data/MMresettle_2014-2018.csv", function(bos311){
//         nhoodActivity = bos311.filter(d => d.State == stateChosen)
//         for (let va in variables) {
//           reshape.push({Name : variables[va], Resettled : nhoodActivity[0][variables[va]]})
//         }
//         return reshape
//     })
//   }

  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
*/
function showDetail(d) {
  // change outline to indicate hover state.
  d3.select(this).attr('stroke', 'black');

  firstDiff = (+d.properties.resettled2014) - (+d.properties.resettled2018)
  console.log(firstDiff)
  secondDiff = +d.properties.resettledMM2014 - +d.properties.resettled2018

  var content = '<span class="name">State: </span><span class="value">' +
                d.State +
                '</span><br/>' +
                '<span class="name">Difference in Number Resettled in 2014 vs 2018: </span><span class="value">' +
                addCommas(d.properties.resettled2014) +
                '</span><br/>' +
                '<span class="name">Difference in Number Resettled in 2014 vs 2018 from Muslim-Majority Countries: </span><span class="value">' +
                addCommas(secondDiff) +
                '</span>';

  tooltip.showTooltip(content, d3.event);
}

/*
 * Hides tooltip
*/
function hideDetail(d) {
  // reset outline
  d3.select(this)
    .attr('stroke', d3.rgb("#beccae").darker());

  tooltip.hideTooltip();
}


// var svg4 = d3.select("#id6").append("svg")
//       .attr("width", 570)
//       .attr("height", 300)
//       .style("-webkit-tap-highlight-color", "transparent")
//       .style("overflow", "visible");

//     svg4.append("g")
//       .call(xAxis);
   
//     svg4.append("g")
//       .call(yAxis);
    
//     svg4.append("g")
//     .selectAll("rect")
//     .data(stateResettle.sort((a, b) => b.num - a.num))
//     .join("rect")
//       .attr("x", x(0))
//       .attr("y", d => y(d.type))
//       .attr("width", d => x(d.num) - x(0))
//       .attr("fill", "steelblue")
//       .attr("height", y.bandwidth());

//     svg4.node().update = () => {
//         const t = svg.transition()
//             .duration(750);
    
//     bar.data(usa, d => d.State)
//             .order()
//           .transition(t)
//             .delay((d, i) => i * 20)
//             .attr("x", d => x(d.State));
//     }