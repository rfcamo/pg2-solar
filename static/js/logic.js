







// Function to change the name of the key that holds the suburb name in geoData
// (original key names were different for each state) 
function formatSuburbs(suburb) {

  if (suburb.properties.hasOwnProperty('nsw_loca_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['nsw_loca_2']
  } else if (suburb.properties.hasOwnProperty('act_loca_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['act_loca_2']
  } else if (suburb.properties.hasOwnProperty('vic_loca_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['vic_loca_2']
  } else if (suburb.properties.hasOwnProperty('qld_loca_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['qld_loca_2']  
  } else if (suburb.properties.hasOwnProperty('sa_local_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['sa_local_2'] 
  } else if (suburb.properties.hasOwnProperty('wa_local_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['wa_local_2']
  } else if (suburb.properties.hasOwnProperty('tas_loca_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['tas_loca_2']  
  } else if (suburb.properties.hasOwnProperty('nt_local_2')) {
      suburb['properties']['Suburb'] = suburb['properties']['nt_local_2']
  } else {
      
  }
  
  //Convert the suburb name to lower case for merging
  suburb.properties.Suburb = suburb.properties.Suburb.toLowerCase()
}

d3.json("static/data/australian-suburbs.geojson").then(function(geoData) {
          
    d3.json("/api/v1.0/mapdata").then(function(mapData) {
        
        function changeZoom(city) {
            
            myMap.removeLayer(installsLayer)
            myMap.removeLayer(outputLayer)
            myMap.removeLayer(incomeLayer)




            var zoomLevel = 0
            var coords = []
              
            // var bounds = myMap.getBounds()
            // center = bounds.getCenter() 
            // console.log(center)
            
              switch(city) {
                case('Perth'):
                zoomLevel = 11; coords = [-32.016, 115.896];
                break
                case('Australia'):
                zoomLevel = 5; coords = [-28, 133];
                break
                case('Melbourne'):
                zoomLevel = 12; coords = [-37.826, 144.965];
                break
                case('Sydney'):
                zoomLevel = 12; coords = [-33.8486, 151.1833];
                break
                case('Brisbane'):
                zoomLevel = 12; coords = [-27.4626, 153.0327];
                break
                case('Hobart'):
                zoomLevel = 13; coords = [-42.8727, 147.3427]
                break
                case('Adelaide'):
                zoomLevel = 13; coords = [-34.9259, 138.569]
                break
                case('Canberra'):
                zoomLevel = 13; coords =[-35.295, 149.1139]
                break
                case('Darwin'):
                zoomLevel = 13; coords =[-12.428, 130.927]
                break
              };
          // console.log(coords)
          myMap.flyTo(coords, zoomLevel, {
              "animate": true,
              "duration": 1.2 //in seconds
              });
        
        }
        
        d3.selectAll('.zoom-button').on('click', function() {
          city = d3.select(this).text();
          changeZoom(city);
        });


        // Create tile layer
        streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY
        });

        var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/satellite-v9",
            accessToken: API_KEY
        });

        // Create map
        var myMap = L.map("map", {
            center: [-28, 133],
            zoom: 5,
            layers: [streetMap],
        });



        // Redefine mapData inorder to convert the suburb names to lower case 
        mapData = mapData.map(function(d) { return {"total_installs": d.total_installs,
                                              "total_output": d.total_output,
                                              "postcode": d.postcode,
                                              "Average_total": d.Average_total,
                                              "rebate": d.rebate,
                                              "suburb":  d.suburb.toLowerCase(),
                                              "lat": d.lat,
                                              "long": d.long}
                                            });
            


              // Format the suburb names in the geoData
              L.geoJson(geoData, {
                onEachFeature: formatSuburbs
              }) 

              matchCount = 0
              // Add the post codes to geoData
              L.geoJson(geoData, {
                filter: function(feature, layer) {
                    suburbName = feature.properties.Suburb
                     // filter postcodeData to suburbs with matching name 
                    matchedData = mapData.filter(d => d.suburb == suburbName)
                    
                    // If match found 
                    if (matchedData.length > 0) {
                        // Iterate through results (because more than one suburb with same name)
                        // Compare latitude to determine the correct match 
                        for (var i=0; i<matchedData.length; i++) {
                            var val1 = Math.abs(feature.geometry.coordinates[0][0][1])
                            var val3 = Math.abs(feature.geometry.coordinates[0][0][0])
                            var val2 = Math.abs(matchedData[i].lat)
                            var val4 = Math.abs(matchedData[i].long)
                            // if difference in lat and long between each file < 2, match found, append the data 
                            if ((Math.abs(val1 - val2) < 3 ) && (Math.abs(val3 - val4) < 3 )){
                                feature['properties']['postcode'] = matchedData[i].postcode
                                feature['properties']['installs'] = matchedData[i].total_installs
                                feature['properties']['output'] = matchedData[i].total_output
                                feature['properties']['rebate'] = matchedData[i].rebate
                                feature['properties']['income'] = matchedData[i].Average_total
                                matchCount = matchCount + 1
                          }
                        }
                    } else {
                      feature['properties']['postcode'] = "unknown"
                      feature['properties']['installs'] = 0
                      feature['properties']['output'] = 0
                      feature['properties']['rebate'] = "unknown"
                      feature['properties']['income'] ="unknown"
                    }    
              }})


              // Create the installs choropleth map
              installsLayer = L.choropleth(geoData, {

                    // Define what  property in the features to use
                    valueProperty: "installs",

                    // Set color scale
                    scale: ["#c8ddf0", "#08306b"],

                    // Number of breaks in step range
                    steps: 7,

                    // q for quartile, e for equidistant, k for k-means
                    mode: "q",
                    style: {
                      // Border color
                      color: "#fff",
                      weight: 0.5,
                      fillOpacity: 0.8
                    },
                    // Add a pop-op
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup("<strong>Suburb: </strong>" + feature.properties.Suburb.charAt(0).toUpperCase() + feature.properties.Suburb.substring(1) + "<br>" +
                                        "<strong>Postcode: </strong>" + feature.properties.postcode + "<br>" +
                                        "<strong>Total Installs: </strong>" + feature.properties.installs + "<br>" + 
                                        "<strong>Total Output: </strong>" + Math.floor(feature.properties.output) + " MWh"+ "<br>");
                      }
                    })

                                  // Create the installs choropleth map
              outputLayer = L.choropleth(geoData, {

                // Define what  property in the features to use
                valueProperty: "output",

                // Set color scale
                scale: ["#c8ddf0", "#b10026"],

                // Number of breaks in step range
                steps: 7,

                // q for quartile, e for equidistant, k for k-means
                mode: "q",
                style: {
                  // Border color
                  color: "#fff",
                  weight: 0.5,
                  fillOpacity: 0.8
                },
                // Add a pop-op
                onEachFeature: function(feature, layer) {
                    layer.bindPopup("<strong>Suburb: </strong>" + feature.properties.Suburb.charAt(0).toUpperCase() + feature.properties.Suburb.substring(1) + "<br>" +
                                    "<strong>Postcode: </strong>" + feature.properties.postcode + "<br>" +
                                    "<strong>Total Installs: </strong>" + feature.properties.installs + "<br>" + 
                                    "<strong>Total Output: </strong>" + Math.floor(feature.properties.output) + " MWh"+ "<br>");
                  }
                })

                                                  // Create the installs choropleth map
              incomeLayer = L.choropleth(geoData, {

                // Define what  property in the features to use
                valueProperty: "income",

                // Set color scale
                scale: ["#c8ddf0", "#8B8000"],

                // Number of breaks in step range
                steps: 7,

                // q for quartile, e for equidistant, k for k-means
                mode: "q",
                style: {
                  // Border color
                  color: "#fff",
                  weight: 0.5,
                  fillOpacity: 0.8
                },
                // Add a pop-op
                onEachFeature: function(feature, layer) {
                    layer.bindPopup("<strong>Suburb: </strong>" + feature.properties.Suburb.charAt(0).toUpperCase() + feature.properties.Suburb.substring(1) + "<br>" +
                                    "<strong>Postcode: </strong>" + feature.properties.postcode + "<br>" +
                                    "<strong>Total Installs: </strong>" + feature.properties.installs + "<br>" + 
                                    "<strong>Total Output: </strong>" + Math.floor(feature.properties.output) + " MWh"+ "<br>");
                  }
                })






              
              // Create BASE and OVERLAYS 
              var baseMaps = {
                "Street Map": streetMap,
                "Satellite Map": satelliteMap
                };
                
              // Overlays that may be toggled on or off
              var overlayMaps = {
              "Installations": installsLayer,
              "Power Output": outputLayer,
              "Income": incomeLayer,
              // "Solar Rebate": rebateLayer
              };
             

             var currentLayer = "" 
             myMap.on('overlayadd', function(layer, event) {
                currentLayer = layer.name;
                try {
                    myMap.removeControl(legend)
                }
                catch (e) {}
                legend = changeLegend() ;
                legend.addTo(myMap)
             })

             myMap.on('overlayremove', function(layer, event) {
                try {
                    myMap.removeControl(legend)
                }
                catch (e) {}
             });
             
 
              // Pass map layers into layer control and add layer control to map
              L.control.layers(baseMaps, overlayMaps).addTo(myMap);

            data = mapData.map(d => d.Average_total)
            data.sort((a, b) => a - b)

              console.log(d3.quantile(data,0.143))
              console.log(d3.quantile(data,0.286))
              console.log(d3.quantile(data,0.429))
              console.log(d3.quantile(data,0.572))
              console.log(d3.quantile(data,0.715))
              console.log(d3.quantile(data,0.858))
              

            
            function legendColour(currentLayer) {
                // Returns a single rgb color interpolation between given rgb color
                // based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
                function interpolateColor(color1, color2, factor) {
                    if (arguments.length < 3) { 
                        factor = 0.5; 
                    }
                    var result = color1.slice();
                    for (var i = 0; i < 3; i++) {
                        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
                    }
                    return result;
                };
                // function to interpolate between two colors completely, returning an array
                function interpolateColors(color1, color2, steps) {
                    var stepFactor = 1 / (steps - 1),
                        interpolatedColorArray = [];

                    color1 = color1.match(/\d+/g).map(Number);
                    color2 = color2.match(/\d+/g).map(Number);

                    for(var i = 0; i < steps; i++) {
                        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
                    }

                    return interpolatedColorArray;
                
                }              
                
                if (currentLayer == "Installations") {
                    return interpolateColors("rgb(8, 48, 107)", "rgb(200, 221, 240)", 7);
                } else if (currentLayer == "Power Output") {
                    return interpolateColors("rgb(177, 0, 38)", "rgb(200, 221, 240)", 7)
                } else if (currentLayer == "Income") {
                    return interpolateColors("rgb(139, 128, 0)", "rgb(200, 221, 240)", 7)
                }
                
            } 
           
            //   LEGEND
            // Create the legend div at the bottom right of screen
            function changeLegend() {
                
                var legend = L.control({ position: "bottomright" });
                legend.onAdd = function() {

                    if (currentLayer == "Installations") {
                        var div = L.DomUtil.create("div", "install info legend");
                        labels = ['<Strong>Total Installations</strong>']
                        legendColours = legendColour(currentLayer)
                        categories = ['>4300', '2100 - 4300', '1200 - 1200', '700 - 1200', '360 - 700', '130 - 360', '< 130']

                        div.innerHTML += labels[0]  + '<hr>'
                        for (var i=0; i<categories.length; i++) {
                            div.innerHTML += '<i class="leg" style="background:' + `rgb(${legendColours[i][0]}, ${legendColours[i][1]}, ${legendColours[i][2]})` + '"></i>' + categories[i] + "<br>";
                        }
                        return div;
                    } else if (currentLayer == "Power Output") {
                        var div = L.DomUtil.create("div", "ouput info legend");
                        labels = ['<Strong>Total Power Output</strong>']
                        legendColours = legendColour(currentLayer)
                        categories = ['> 21400 kW', '11400 - 21400 kW', '6400 - 11400 kW', '3700 - 6400 kW', '2100 - 3700 kW', '790 - 2100 kW', '< 790 kW']

                        div.innerHTML += labels[0]  + '<hr>'
                        for (var i=0; i<categories.length; i++) {
                            div.innerHTML += '<i class="leg" style="background:' + `rgb(${legendColours[i][0]}, ${legendColours[i][1]}, ${legendColours[i][2]})` + '"></i>' + categories[i] + "<br>";
                        }
                        return div;
                    } else if (currentLayer == "Income") {
                        var div = L.DomUtil.create("div", "ouput info legend");
                        labels = ['<Strong>Total Power Output</strong>']
                        legendColours = legendColour(currentLayer)
                        categories = ['>$94000', '$86000 - 94000', '$82000 - 86000', '$78000 - 82000', '$75000 - 78000', '$72000 - 75000', '< $72000']

                        div.innerHTML += labels[0]  + '<hr>'
                        for (var i=0; i<categories.length; i++) {
                            div.innerHTML += '<i class="leg" style="background:' + `rgb(${legendColours[i][0]}, ${legendColours[i][1]}, ${legendColours[i][2]})` + '"></i>' + categories[i] + "<br>";
                        }
                        return div;
                    }
                };
           
                return legend

            }
            


              })


  })