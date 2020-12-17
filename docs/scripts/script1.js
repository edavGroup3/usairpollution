var width = 960;
var height = 500;

var lowColor = '#E8F8F5';
var highColor = '#0E6251';

var projection = d3.geoAlbersUsa()
  .translate([width/2, height/2])
  .scale([1000]);

var path = d3.geoPath()
  .projection(projection);

var svg = d3.select("div#plot")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg.append("circle").attr("cx", "100").attr("cy", "100").attr("r", "25").attr("fill", "red");
