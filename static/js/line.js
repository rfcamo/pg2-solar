//Define api urls
var data_url = `/api/v1.0/sgu`


filter = d3.select(".autocomplete")
filter.on("change", function() {
    auto = d3.select(".autocomplete-input")
    currentSuburb = auto.node().value;
    lineChart(currentSuburb)
});


// default value when page lands

    var defaultID = "6000"
    lineChart(defaultID);



// function to trigger the change

    function optionChanged(selectedSuburb) {
            lineChart(selectedSuburb);
    };

// function to select the data set

    function lineChart(selectedSuburb){
        d3.json(data_url).then((data) => {
            
            
// OUTPUT
            var sub = data.map(su => su.postcode);
            
            var select_sub = data.filter(su=>su.postcode==selectedSuburb);
            

            value = []
            var valuearray = select_sub.forEach(function(selsub){
                value.push(Object.values(selsub.output.years));
            });
            
        
            year = []
            var yer = select_sub.forEach(function(selsub){
                    year.push(Object.keys(selsub.output.years));
            });
            
// INSTALL

            value1 = []
            var valuearray = select_sub.forEach(function(selsub){
                value1.push(Object.values(selsub.install.years));
            });
            
        
            year1 = []
            var yer = select_sub.forEach(function(selsub){
                    year1.push(Object.keys(selsub.install.years));
            });
            

            
// plot details
        

            // var trace1 = {x: year[0],y: value[0],name:"Output in KW",line:{color:'red',width:2},type: 'line'};
            // var trace2 = {x: year1[0],y: value1[0],name:"Installation in numbers",line:{color:'purple',width:2},type: 'line',yaxis: 'y2'};

            var trace1 = {x: year[0],y: value[0],name:"Output in KW",stackgroup:'one',line:{color:'red',width:2},
            type: 'scatter'};
            var trace2 = {x: year1[0],y: value1[0],name:"Installation in numbers",stackgroup:'one',line:{color:'purple',width:2},
            type: 'scatter',yaxis: 'y2'};
            
            var data = [trace1, trace2];
// plot layout
            var layout = {
                title: `<b>Postcode:</b> ${selectedSuburb} `,
                // xaxis: { title: "Year ",position: 0.1 },
                xaxis: { title: "Year ",position: 0 },
                xaxis2: { title: "Year ",position: 0,overlaying: 'x' },
                legend: {x: -0.2,y: 1,traceorder: 'normal'},
                autosize: true,
                width: 1000,
                height: 650,
                yaxis: { title: "Output in kW",titlefont:{color: "red"},tickfont:{color:"red"}},
                yaxis2:{title:'Installation in Numbers',
                titlefont: {color: 'rgb(148, 103, 189)'},
                tickfont: {color: 'rgb(148, 103, 189)'},
                overlaying: 'y',
                side: 'right'}
            };
            const config = {
                displayModeBar: false, 
              };
            
            Plotly.newPlot('plot1', data, layout, config);

    

    })};