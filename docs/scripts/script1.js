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

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5,0])
  .html((EVENT, d)=>d);
svg.call(tip);


d3.csv("https://github.com/edavGroup3/usairpollution/blob/main/data/statespercent.csv").then(function(data){
  var dataArray = [];
  for (var d=0; d < data.length; d++){
    dataArray.push(parseFloat(data[d].value));
  }
  var minVal = d3.min(dataArray);
  var maxVal = d3.max(dataArray);
  var ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor]);
  
  d3.json("https://github.com/edavGroup3/usairpollution/blob/main/data/us-states.json").then(function(json){
    for (var i = 0; i < data.length; i++){
      var dataState = data[i].state;
      var dataValue = data[i].value;
      var dataC = data[i].so2;
      for (var j=0; j < json.features.length; j++){
        var jsonState = json.features[j].properties.name;
        if (dataState == jsonState){
          json.features[j].properties.value = dataValue;
          json.features[j].properties.so2 = dataC;
          break;
        }
      }
    }
      
  svg.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d){return ramp(d.properties.value)});
  
  svg.selectAll("path")
      .on("mouseover", function(event, d){
        tip.show(event, d.properties.name + '<br/><br/>' +
        'Lung Cancer Rate: ' + d.properties.value +'%' + '<br/>' + 
        'SO2 Concentration: ' + d.properties.so2 + ' µg/m^3');
      })
      .on("mouseout", tip.hide);
  
    //legend (not necessary)
    var w = 140;
    var h = 300;
    var key = d3.select("div#plot")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "legend");
    var legend = key.append("defs")
		.append("svg:linearGradient")
		.attr("id", "gradient")
		.attr("x1", "100%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

    legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", highColor)
			.attr("stop-opacity", 1);
    
  legend.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", lowColor)
    .attr("stop-opacity", 1);

  key.append("rect")
    .attr("width", w - 100)
    .attr("height", h)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0,10)");

  var y = d3.scaleLinear()
    .range([h, 0])
    .domain([minVal, maxVal]);

  var yAxis = d3.axisRight(y);

  key.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(41,10)")
    .call(yAxis);
  });
});