var wage = document.getElementById("textsearch");
wage.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        validate(e);
    }
});

function validate(e) {
  console.log(e);
  var postcode=document.getElementById("textsearch").value;
  console.log(postcode);
  // callf(postcode);
  psearch(postcode);
  barplot(postcode);
  return postcode;
  
}

//Pass search filter to function
// function callf(postcode){
  
  
//   console.log(postcode);
  
//   return postcode;
//   }


// On page reload
function fload(){
  var firstload = "800, DARWIN";
  psearch(firstload);
  console.log(firstload);
  barplot2(firstload);
}



// console.log(callf);
psearch(validate)
// Load data from json
function psearch(postcode2){
 d3.json("/api/v1.0/rdata").then(function(mydata) {
  // buildtable(mydata);
    var filtercitydata = mydata.filter(function(d, i)
    {
      if( d["location"] == postcode2)
      {
        return d;
       }
});
console.log(filtercitydata);
buildtable(filtercitydata)
});
}
function barplot(plotdata){
  console.log(plotdata);
  d3.json("/api/v1.0/rdata").then(function(mydata2) {
    var idata1 = d3.nest()
    .rollup(function(v) { return d3.sum(v, function(d) { return d.ins_total; }); })
    .entries(mydata2);
    console.log(idata1);
    var idata2 = d3.nest()
    .rollup(function(v) { return d3.sum(v, function(d) { return d.ins_avg; }); })
    .entries(mydata2);
    console.log(idata2);
    var plot1 = document.getElementById("textsearch").value;
    console.log(plot1);
    var plot1filter = mydata2.filter(function(d, i)
    {
      if( d["location"] == plot1)
      {
        console.log(d);
        var data1 = [
        {group: "Total Installation", value: d.ins_total},
        {group: "Average Installation", value: d.ins_avg},
        {group: "State Total Install * 1000", value: idata1/1000},
        {group: "State Average Install * 100", value: idata2/100}
];
        console.log(data1);
        update(data1);
        return data1;
      }
});
});
}
function barplot2(plotdata){
  console.log(plotdata);
  d3.json("/api/v1.0/rdata").then(function(mydata3) {
    var odata1 = d3.nest()
    .rollup(function(v) { return d3.sum(v, function(d) { return d.out_total; }); })
    .entries(mydata3);
    console.log(odata1);
    var odata2 = d3.nest()
    .rollup(function(v) { return d3.sum(v, function(d) { return d.out_avg; }); })
    .entries(mydata3);
    console.log(odata2);
    var plot2 = document.getElementById("textsearch").value;
    console.log(plot2);
    var plot2filter = mydata3.filter(function(d, i)
    {
      if( d["location"] == plotdata)
      {
        // console.log(d.ins_avg);
        var data2 = [
          {group: "Total Ouput", value: d.out_total},
          {group: "Average Output", value: d.out_avg},
          {group: "State Total Output * 1000", value: odata1/1000},
          {group: "State Average Output * 100", value: odata2/100}
        ];
        console.log(data2);
        update(data2);
        return data2;
      }
});
});
}
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  console.log(svg);
// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")
// A function that create / update the plot for a given variable:
function update(data) {
console.log(data)
  // Update the X axis
  x.domain(data.map(function(d) { return d.group; }))
  xAxis.call(d3.axisBottom(x))
  // Update the Y axis
  y.domain([0, d3.max(data, function(d) { return d.value }) ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));
  // Create the u variable
  var u = svg.selectAll("rect")
    .data(data)
  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return x(d.group); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#69B3A2")
  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove()
}
// Initialize the plot with the first dataset
function buildtable(data){
  console.log(data)
var table = document.getElementById('myTable')
table.innerHTML = ''
for (var i = 0; i < data.length; i++){
  var row = `<tr><b>Location: </b>${data[i].location}</tr><br>
             <tr><b>Install Tot: </b>${data[i].ins_total.toFixed(2)}</tr><br>
             <tr><b>Install Ave:  </b>${data[i].ins_avg.toFixed(2)}</tr><br>
             <tr><b>Output Tot: </b>${data[i].out_total.toFixed(2)}</tr><br>
             <tr><b>Output Ave: </b>${data[i].out_avg.toFixed(2)}</tr><br>
             `
  table.innerHTML += row
}
}
fload();