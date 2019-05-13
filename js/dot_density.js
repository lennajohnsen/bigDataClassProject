//https://observablehq.com/@floledermann/dot-density-maps-with-d3

var svg = d3.select("#id5").append("svg")
  .attr("width", 1200)
  .attr("height", 1200);


var height = 1200
var width = 1200
var margin = 20
var path = d3.geoPath()

d3.csv("data/MMresettle_2014-2018.csv", function(data) {
 d3.json("data/us.json", function(json) {
    var presimplified = topojson.presimplify(json)
    var simplified = topojson.simplify(presimplified, topojson.quantile(presimplified, .11))
    var usa = topojson.feature(simplified, simplified.objects.states).features
    var states = topojson.feature(simplified, simplified.objects.states)
    //var projection = d3.geoAlbers().fitExtent([[margin, margin], [width - margin, height - margin]], states)

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
      break;
      }
  }
}
    
    var boundaries = topojson.mesh(simplified, simplified.objects.states)
    //var numPoints = states[5].properties.resettledMM2018
    //console.log(numPoints)
    //console.log(states.features[0])
    console.log(usa)
    //console.log(usa.properties.resttledMM2017)

  


    var points = usa.map(geo => makeDots(geo.geometry.coordinates[0][0], geo.properties.resettledMM2014, {distance: 2, edgeDistance: Math.max(3,2.5)}))

    //console.log(points, 9393939339)
    //console.log(states.features)
    //states.features.map(geo => console.log(geo.geometry.coordinates[0][0]))
    //console.log(states.features)

    svg.selectAll('g.dots')
      .data(points)
      .enter()
       .append('g')
       .classed('dots',true)
      //.attr('fill',d => d.complete ? '#000000' : '#ff0000')
       .selectAll('circle')
       .data(d => d)
     .enter()
       .append('circle')
       .attr('cx', d => d[0])
       .attr('cy', d => d[1])
       .attr('r', 2)


     svg.selectAll('path')
       .data([boundaries])
       .enter()
       .append('path')
       .attr('d', path)
       .attr('fill', 'none')
       .attr('stroke', '#bbbbbb')
       .attr('stroke-width', 1.5)

    }
 )

  }
)


/*Generate points at random locations inside polygon.
    polygon: polygon (Array of points [x,y])
    numPoints: number of points to generate
Returns an Array of points [x,y].
The returned Array will have a property complete, which is set to false if the
desired number of points could not be generated within `options.numIterations` attempts
*/

function makeDots(polygon, numPoints, options) { 
  options = Object.assign({
    // DEFAULT OPTIONS:
    maxIterations: numPoints * 50,
    distance: null, // by default: MIN(width, height) / numPoints / 4,
    edgeDistance: options.distance
  },options);

  numPoints = Math.floor(numPoints)

  // calculate bounding box
  
  let xMin = Infinity,
    yMin = Infinity,
    xMax = -Infinity,
    yMax = -Infinity
  
  polygon.forEach(p => {
    if (p[0]<xMin) xMin = p[0]
    if (p[0]>xMax) xMax = p[0]
    if (p[1]<yMin) yMin = p[1]
    if (p[1]>yMax) yMax = p[1]
  });

  let width = xMax - xMin
  let height = yMax - yMin
  
  // default options depending on bounds
  
  options.distance = options.distance || Math.min(width, height) / numPoints / 4
  options.edgeDistance = options.edgeDistance || options.distance
  
  // generate points
  
  let points = [];
  
  outer:
  for (let i=0; i<options.maxIterations; i++) {
    let p = [xMin + Math.random() * width, yMin + Math.random() * height]
    if (d3.polygonContains(polygon, p)) {
      // check distance to other points
      for (let j=0; j<points.length; j++) {
        let dx = p[0]-points[j][0],
            dy = p[1]-points[j][1]
        
        if (Math.sqrt(dx*dx+dy*dy) < options.distance) continue outer;
      }
      // check distance to polygon edge
      for (let j=0; j<polygon.length-1; j++) {
        if (distPointEdge(p, polygon[j], polygon[j+1]) < options.edgeDistance) continue outer;
      }
      points.push(p);
      if (points.length == numPoints) break;
    }
  }
  //points.complete = (points.length >= numPoints)
  return points
}


// calculates the distance between a point p and an edge defined by two vertices l1 and l2
//ported from https://stackoverflow.com/q/30559799
function distPointEdge(p, l1, l2) {

    var A = p[0] - l1[0],
        B = p[1] - l1[1],
        C = l2[0] - l1[0],
        D = l2[1] - l1[1];
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    
    // alpha is proportion of closest point on the line between l1 and l2
    var alpha = -1;
    if (len_sq != 0) //in case of 0 length line
        alpha = dot / len_sq;
  
    // points on edge closest to p
    var X, Y;
  
    if (alpha < 0) {
      X = l1[0];
      Y = l1[1];
    }
    else if (alpha > 1) {
      X = l2[0];
      Y = l2[1];
    }
    else {
      X = l1[0] + alpha * C;
      Y = l1[1] + alpha * D;
    }
  
    var dx = p[0] - X;
    var dy = p[1] - Y;
    
    return Math.sqrt(dx * dx + dy * dy);
  }