
// create SVG element
var svg2 = d3.select("#id5").append("svg")
.attr("width", 1200)
.attr("height", 1200);

var path = d3.geoPath()

d3.csv("data/MMresettle_2014-2018.csv", function(data) {
    d3.json("data/us.json", function(json) {
        var presimplified = topojson.presimplify(json)
        var simplified = topojson.simplify(presimplified, topojson.quantile(presimplified, .11))
        var states = topojson.feature(simplified, simplified.objects.states).features
        
        //var usa = topojson.feature(json, json.objects.states).features;
        for (var i = 0; i < data.length; i++) {
            var stateCode = +data[i].state_code
        for (var j in states){
            var iD = +states[j].id
            if (stateCode == iD) {
            states[j].properties.shareMM2018 = +data[i].share_MM18;
            states[j].properties.shareMM2017 = +data[i].share_MM17;
            states[j].properties.shareMM2016 = +data[i].share_MM16;
            states[j].properties.shareMM2015 = +data[i].share_MM15;
            states[j].properties.shareMM2014 = +data[i].share_MM14;
            states[j].properties.resettled2018 = +data[i].resettled18;
            states[j].properties.resettled2017 = +data[i].resettled17;
            states[j].properties.resettled2016 = +data[i].resettled16;
            states[j].properties.resettled2015 = +data[i].resettled15;
            states[j].properties.resettled2014 = +data[i].resettled14;
            states[j].properties.resettledMM2018 = +data[i].resettled_MM18;
            states[j].properties.resettledMM2017 = +data[i].resettled_MM17;
            states[j].properties.resettledMM2016 = +data[i].resettled_MM16;
            states[j].properties.resettledMM2015 = +data[i].resettled_MM15;
            states[j].properties.resettledMM2014 = +data[i].resettled_MM14;
            states[j].State = data[i].state;
            break;
            }
        }
    }

        var stateIndex = 5
        var state = states[stateIndex]
        var resolution = state.properties.resettledMM2016
        
        var polygon = state.geometry.coordinates
        //states.features.map(geo => console.log(geo.geometry.coordinates[0][0]))
        
        //let polygon = state.geometry.coordinates[0].map(c => c.map(val => Math.round(val/resolution)))
    
        let cleanedPoly = [];
        for (let i=0; i<polygon.length; i++) {
        let p = polygon[i];
        let prev = i>0 ? polygon[i-1] : polygon[polygon.length-1];
        let next = i<polygon.length-1 ? polygon[i+1] : polygon[0];
        
        if (p[1] == prev[1] && p[1] == next[1]) continue;
        if (p[0] == prev[0] && p[0] == next[0]) continue;
            
        cleanedPoly.push(p);
        }
    
    
    fillPoly(cleanedPoly, function(x,y){
      // this is our setPixel function
      svg2.append('circle')
        .attr('cx', (x+0.5) * resolution)
        .attr('cy', y * resolution)
        .attr('r', resolution/3)
    })
    
    
    // draw polygon outline for comparison
    svg2.selectAll('path')
      .data([state])
    .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#bbbbbb')
      .attr('stroke-width', 1.5)

})
})

// Ported from C code in Hearn & Baker "Computer Graphics - C Version", 2nd edition
function fillPoly(polygon, setPixel) {
  
    /*
    Struct Edge = {
      int yUpper,
      float xIntersect,
      float dxPerScan,
      Edge next
    }
    */
    
    function insertEdge(list, edge) {
      let q = list,
          p = list.next
      
      while (p) {
        if (edge.xIntersect < p.xIntersect) {
          p = null
        }
        else {
          q = p
          p = p.next
        }
      }
      
      edge.next = q.next
      q.next = edge
    }
    
    function yNext(k, cnt, pts) {
      let j
      
      if ((k+1) > (cnt-1)) {
        j = 0
      }
      else {
        j = k+1
      }
      
      while (pts[k][1] == pts[j][1]) {
        if ((j+1) > (cnt-1)) {
          j = 0
        }
        else {
          j++
        }
      }
      
      return pts[j][1]
    }
    
    function makeEdgeRec(lower, upper, yComp, edges) {
      let edge = {}
      edge.dxPerScan = (upper[0] - lower[0]) / (upper[1] - lower[1])
      edge.xIntersect = lower[0]
      if (upper[1] < yComp) {
        edge.yUpper = upper[1] - 1
      }
      else {
        edge.yUpper = upper[1]
      }
      insertEdge(edges[lower[1]], edge)
    }
    
    function buildEdgeList(pts, edges) {
      let cnt = pts.length,
          i,
          v1 = [0,0],
          v2 = [0,0],
          yPrev = pts[cnt-2][1]
          
      
      v1[0] = pts[cnt-1][0]
      v1[1] = pts[cnt-1][1]
      
      for (i=0; i<cnt; i++) {
        v2 = pts[i]
        if (v1[1] <= v2[1]) {
          makeEdgeRec(v1, v2, yNext(i, cnt, pts), edges)
        }
        if (v1[1] > v2[1]) {
          makeEdgeRec(v2, v1, yPrev, edges)
        }
        yPrev = v1[1]
        v1 = v2
      }
    }
    
    function buildActiveList(scan, active, edges) {
      let p = edges[scan].next,
          q
      
      while (p) {
        q = p.next
        insertEdge(active, p)
        p = q
      }
    }
    
    function fillScan(scan, active) {
      let p1 = active.next,
          p2,
          i
      
      while (p1) {
        p2 = p1.next
        // HACK FL for some reason we sometimes don't get pairwise lists...?
        if (p2) {
          for (i=Math.floor(p1.xIntersect); i<p2.xIntersect; i++) {
            setPixel(i, scan)
          }
        }
        p1 = p2 && p2.next
      }
    }
    
    function deleteAfter(q) {
      let p = q.next
      q.next = p.next
    }
    
    function updateActiveList(scan, active) {
      let q = active,
          p = active.next
      
      while (p) {
        if (scan >= p.yUpper) {
          p = p.next
          deleteAfter(q)
        }
        else {
          p.xIntersect = p.xIntersect + p.dxPerScan
          q = p
          p = p.next
        }
      }
    }
    
    function resortActiveList(active) {
      let q,
          p = active.next
      
      active.next = null
      while (p) {
        q = p.next
        insertEdge(active, p)
        p = q
      }
    }
    
    let edges = [],
        active,
        i,scan
    
    for (i = 0; i<500; i++) {
      edges[i] = {next: null}
    }
    
    buildEdgeList(polygon, edges)
    active = { next: null }
    
    for (scan = 0; scan<500; scan++) {
      buildActiveList(scan, active, edges)
      if (active.next) {
        fillScan(scan, active)
        updateActiveList(scan, active)
        resortActiveList(active)
      }
    }
  }