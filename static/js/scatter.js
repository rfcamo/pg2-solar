

function makeResponsive() {


    // clear svg if not empty
    var svgArea = d3.select("body").select("svg");
      
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SET SVG DIMENSIONS
    // SVG wrapper dimensions determined by current width/height of browser window.
    var svgWidth = (window.innerWidth / 1.75);
    var svgHeight = (window.innerHeight / 1.75);
  
    var margin = {
      top: 50,
      bottom: 100,
      right: 100,
      left: 100
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3.select("#scatter") 
      .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth); 
  
    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
      

    // SET LENGEND DIMENSIONS
    var legendFullHeight = height;
    var legendFullWidth = 50;
    var legendMargin = { top: 20, bottom: 20, left: 5, right: 20 };

    var legendWidth = legendFullWidth - legendMargin.left - legendMargin.right;
    var legendHeight = legendFullHeight - legendMargin.top - legendMargin.bottom;


    
    // READ JSON FROM API
    d3.json("/api/v1.0/install").then(function(installD) {

      d3.json("/api/v1.0/output").then(function(outputD) {     
        
        d3.json("/api/v1.0/income").then(function(incomeD) {

          d3.json("/api/v1.0/rebate").then(function(rebateD) {
            
            var currentSuburb = 6000

            filter = d3.select('.autocomplete-input')
            filter.on("change", function() {
              currentSuburb = d3.select(this).node().value;
              transistionChart(0)
              updateLegend()
            });



            // Select just the relevant columns and rename 
            installData = installD.map(function(d) { return {'Install_total': d.Total,
                                                             'postcode': d.postcode}}) 
          
            outputData = outputD.map(function(d) { return {'Output_total': d.Total,
                                                             'postcode': d.postcode}}) 

            incomeData = incomeD.map(function(d) { return {'Average_total': d.Average_total,
                                                            'postcode': d.postcode}}) 

            rebateData = rebateD.map(function(d) { return {'rebate': d.rebate,
                                                            'postcode': d.postcode}}) 

                
            // Merge the data
            var mergedData = incomeData.map((item, i) => Object.assign({}, item, rebateData[i]));
            var mergedData = mergedData.map((item, i) => Object.assign({}, item, installData[i]));
            var mergedData = mergedData.map((item, i) => Object.assign({}, item, outputData[i]));

            
                
                // the currently selected postcode
                var currentSuburb = 2500
              
          
                // CREATE SCALES
                // returns scale for x-axes
                function x_scaler(data) {
                  var dataRange =  d3.max(mergedData.map(d => d[data])) - d3.min(mergedData.map(d => d[data]))
                  var buffer = dataRange/8
                  return d3.scaleLinear()
                    .domain([(d3.min(mergedData, d => d[data]))- buffer, (d3.max(mergedData, d => d[data]))+buffer])
                    .range([0, width]);
                };
                // returns scale for y-axes
                function y_scaler(data) {
                  var dataRange =  d3.max(mergedData.map(d => d[data])) - d3.min(mergedData.map(d => d[data]))
                  var buffer = dataRange/8
                  return d3.scaleLinear()
                    .domain([(d3.min(mergedData, d => d[data]))- 280, (d3.max(mergedData, d => d[data]))+buffer])
                    .range([height, 0]);
                };

                // returns scale for scatter colours
                function colour_scaler(data) {
                  return d3.scaleQuantize()
                    .domain([(d3.min(mergedData, d => d[data])), (d3.max(mergedData, d => d[data]))])  
                    .range(['#E7F1D7', '#D0E7BD', '#B2DDA3', '#8FD28A', '#71C67B', '#59BA76', '#41ae76', '#379A7C', '#2E857E', '#256770', '#1D465B'])
                };
                
                // returns scale for the legend colourbar
                function legend_scaler(data) {
                  return d3.scaleLinear()
                  .domain([(d3.min(mergedData, d => d[data])), (d3.max(mergedData, d => d[data]))])
                  .range([legendHeight, 0]);
                }
              

                // Set variables and default datasets to display
                var x_data = "Average_total"
                var y_data = "Install_total"
                var legend = "rebate"


                
                // SET THE SCALES
                var x_scale = x_scaler(x_data)
                var y_scale = y_scaler(y_data)
                var colour_scale = colour_scaler(legend)     


                // CREATE THE AXES
                // x-axes
                var rebate_axis = d3.axisBottom(x_scaler("rebate")).ticks(10);
                var income_axis = d3.axisBottom(x_scaler("Average_total")).ticks(10);

                // y-axes
                var installs_axis = d3.axisLeft(y_scaler("Install_total")).ticks(7);
                var output_axis = d3.axisLeft(y_scaler("Output_total")).ticks(7);

                // legend axes
                updateLegend("rebate")  // generate gradient
                var legendScale = legend_scaler("rebate")
                var legendAxis = d3.axisRight(legendScale)
                  .tickFormat(d3.format("d"));

                
                // APPEND THE DEAFUALT STARTING AXES
                // x-axes
                chartGroup.append("g")
                  .attr("transform", `translate(0, ${height})`)
                  .attr("class", "x-axis")
                  .call(income_axis)
                
                // y-axis 
                chartGroup.append("g")
                  .attr("class", "y-axis")
                  .call(installs_axis)

                // legend-axis
                chartGroup.append("g")
                .attr("class", "legend-axis")
                .attr("transform", "translate("+ width +", 0)")
                .call(legendAxis);

          
                // APPEND THE AXES LABELS
                chartGroup.append("text")
                  .attr("transform", `translate(${width / 2}, ${height + 40 })`)   
                  .attr("class", "axis-label x-label selected")
                  .text("Total Yearly Income ($)")  

                  chartGroup.append("text")
                  .attr("transform", `translate(${width / 2}, ${height + 65 })`)  
                  .attr("class", "axis-label x-label")
                  .text("Solar Rebate ($)")


                  chartGroup.append("text")
                  .attr("transform", `translate(-50, ${height / 2 }) rotate(-90)`)
                  .attr("class", "axis-label y-label selected")
                  .text("Total Installations (n)");

                  chartGroup.append("text")
                  .attr("transform", `translate(-75, ${height / 2 }) rotate(-90)`)
                  .attr("class", "axis-label y-label")
                  .text("Total Output (kW)");


                // Variable containing all the axis label properties
                var axis_labels = d3.selectAll('.axis-label')
                  .attr("font-size", "16px")
                  .style("font-weight", 300)
                  .attr("fill", function(d) {
                    if (d3.select(this).classed("selected")) {   // if classed 'selected' change font-color to black
                      return "black"
                    } else {                                     // else, font-color gray
                      return "#979595f8"
                    }})
                  .attr("text-anchor", "middle")

                
                // Event listener for click on axis labels (hover effects styled with css)
                // 'i' is the index of the axis clicked on 
                axis_labels.on("click", function(d, i) {
                      // if y-axis clicked
                      // first reset the y-axis label classes, then change the selected axis class to 'selected', then run transition function
                    if (d3.select(this).classed("y-label")){
                      d3.selectAll(".y-label").attr("class", "axis-label y-label").attr("fill", "#979595f8")
                      d3.select(this).attr("class", "axis-label y-label selected").attr("fill", "black")
                      transistionChart(i)
                      // if x-axis clicked
                      // first reset the x-axis label classes, then change the selected axis class to 'selected', then run transition function  
                    } else if (d3.select(this).classed("x-label")){
                      d3.selectAll(".x-label").attr("class", "axis-label x-label").attr("fill", "#979595f8")
                      d3.select(this).attr("class", "axis-label x-label selected").attr("fill", "black")
                      transistionChart(i)
                    }
                });

                // Transitions the axes and scatter points
                function transistionChart(index) {
                  
                  // Detrmine which axis clicked on, and update the data accordingly
                  if (index == 0) { 
                    x_axis = income_axis;
                    x_data = "Average_total";
                    legend = 'rebate';
                    updateLegend('rebate')
                  } else if (index == 1 ) { 
                    x_axis = rebate_axis;
                    x_data = "rebate";
                    legend = 'Average_total';
                    updateLegend('Average_total')
                  } else if (index == 2 ) { 
                    y_axis = installs_axis;
                    y_data = "Install_total";
                  } else if (index == 3 ) { 
                    y_axis = output_axis;
                    y_data = "Output_total"; 
                  }
              


                  // Update scale
                  var x_scale = x_scaler(x_data)
                  var y_scale = y_scaler(y_data)
                  
                  // Create a trasition object for the svg
                  chartTransition = chartGroup.transition();
                  
                  // Transition axes
                  if (index < 2) {
                    chartTransition.select(".x-axis")
                      .duration(400)
                        .call(x_axis)
                  } else {
                    chartTransition.select(".y-axis")
                    .duration(400)
                      .call(y_axis)
                  }

                  // Transition circle positions
                  chartTransition.selectAll("circle")
                    .duration(400)
                      .attr("cx", d => x_scale(d[x_data]))
                      .attr("cy", d => y_scale(d[y_data]))
                


                  // // Moves the currently selected postcode marker to the front
                  d3.selection.prototype.moveToFront = function() {
                    return this.each(function(){
                    this.parentNode.appendChild(this);
                    });
                  };

                  // // Stores the currently selected postcode marker
                  sel = []    
                  // Transition circle colours
                  current_colour_scale = colour_scaler(legend)
                  chartTransition.selectAll("circle")
                    .duration(400)
                      .attr("fill", function(d) {
                        if (d.postcode == currentSuburb) {
                          sel = d3.select(this)
                          return '#f7e31a'
                        } else {
                          return current_colour_scale(d[legend])
                        }})
                      .attr("stroke-width", "4px")
                      .attr("stroke", function(d) {
                        if (d.postcode == currentSuburb) {
                          return '#f7e31a'
                        } else {
                          return current_colour_scale(d[legend])
                        }})
                       .attr("r", function(d) {
                        if (d.postcode == currentSuburb) {
                          return 10
                        } else {
                          return 2
                        }})
                       .attr("class", function(d) {
                        if (d.postcode == currentSuburb) {
                          return "pulse"
                        } else {
                          return "circle"
                        }}) 

                  // call the move to front function on the selected marker
                  sel.moveToFront() 

                };
                    


                // Moves the currently selected postcode marker to the front
                d3.selection.prototype.moveToFront = function() {
                  return this.each(function(){
                  this.parentNode.appendChild(this);
                  });
                };
                
                // Stores the currently selected postcode marker
                sel = []

                // Append the CIRCLES to the chart 
                var circlesGroup = chartGroup.selectAll("circle")
                  .data(mergedData)
                  .enter().append("circle")
                    .attr("class", function(d) {
                      if (d.postcode == currentSuburb) {
                        sel = d3.select(this)
                        return "pulse"
                      } else {
                        return "circle"
                      }})  
                    .attr("cx", d => x_scale(d[x_data]))
                    .attr("cy", d => y_scale(d[y_data]))
                    .attr("r", function(d) {
                      if (d.postcode == currentSuburb) {
                      return 10
                  } else {
                      return 2
                  }})
                  .attr("fill", function(d) {
                    if (d.postcode == currentSuburb) {
                    return '#f7e31a'
                } else {
                    return colour_scale(d[legend])
                }})
                    .attr("stroke-width", "4px")
                    .attr("stroke", function(d) {
                      if (d.postcode == currentSuburb) {
                      return '#f7e31a'
                  } else {
                      return colour_scale(d[legend])
                  }})
                  
                // call the move to front function on the selected marker
                sel.moveToFront()


                // UPDATE LEGEND
                // Updates the legend scale and colourbar x-axis change
                function updateLegend(selected) {
                              
                  // append the gradient color ba
                  var gradient = chartGroup.append('defs')
                      .append('linearGradient')
                      .attr('id', 'gradient')
                      .attr('x1', '0%') // bottom
                      .attr('y1', '0%')
                      .attr('x2', '0%') // to top
                      .attr('y2', '100%')
                      .attr('spreadMethod', 'pad');
            
                  // Generate the gradient for the legend by creating an array of 
                  // [pct, colour] pairs as stop values for legend (pct = percent)
                  var colours = ['#1D465B', '#256770', '#2E857E', '#379A7C', '#41ae76', '#59BA76', '#71C67B', '#8FD28A', '#B2DDA3', '#D0E7BD', '#E7F1D7']
                  
                  // Creats an array of % values between 0-100 to match the colours above
                  var pct = linspace(0, 100, colours.length).map(function(d) {
                      return Math.round(d) + '%';
                  });
            
                  // Combine the colour and pct values into pairs in a single variable
                  var colourPct = d3.zip(pct, colours);

                  // Create the gradient
                  colourPct.forEach(function(d) {
                      gradient.append('stop')
                          .attr('offset', d[0])
                          .attr('stop-color', d[1])
                          .attr('stop-opacity', 1);
                  });
                  
                  // Create a rectangle with the gradient and append it to the id created above
                  chartGroup.append('rect')
                      .attr('x', width - legendWidth)
                      .attr('y', 0)
                      .attr('width', legendWidth)
                      .attr('height', legendHeight)
                      .style('fill', 'url(#gradient');
            
                  // Create a scale and axis for the legend
                  var legendScale = legend_scaler(selected)
                  
                  // Create the legend axis
                  var legendAxis = d3.axisRight(legendScale)
                      .tickFormat(d3.format("d"));
            
                  // Add a transition for the legend axis change
                  chartGroup.select(".legend-axis")
                      .transition()
                      .duration(400)
                      .call(legendAxis);

                };


                // TOOL-TIP 
                // Initialize the Tooltip
                var toolTip = d3.tip()
                  .attr("class", "d3-tip")
                  .direction('w') 
                  .html(function(d) { 
                    return (`<strong><center>${(d.postcode)}</center></strong>
                                <hr>Total Installations: ${d['Install_total']}
                                <hr>Total Output: ${d['Output_total'].toFixed(0)} MWh
                                <hr>Average income: $${d['Average_total']} <hr>
                                <ht>Rebate: $${d['rebate']}<hr>`)});
                  

                // Call the tooltip on the chartGroup visualisation
                chartGroup.call(toolTip);
                
                pulseCircle = d3.select(".pulse")
                // Create event listener to display/hide/move the tooltip
                pulseCircle.on("mouseover", d => toolTip.show(d, this).style("display", null))
                  .on('mouseout', function() {
                      d3.select(".d3-tip")
                      .transition()
                        .duration(300)
                        .style("opacity",0)
                        .style('pointer-events', 'none')
                      })

                
                // Function to evenly space gradient values (see updateColourScale() )          
                function linspace(start, end, n) {
                  var out = [];
                  var delta = (end - start) / (n - 1);
                  var i = 0;
                  while(i < (n - 1)) {
                      out.push(start + (i * delta));
                      i++;
                  }
          
                  out.push(end);
                  return out;
              }          
              
                }).catch(function(error) { 
                console.log(error);
              });
          
            })

      })

    })

  }




  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);