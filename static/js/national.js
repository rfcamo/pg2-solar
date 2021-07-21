//Define api urls
var state_url = `/api/v1.0/state`

// Initializes the page with a default plot
function init() {

    d3.json(state_url).then(function(data) {

        // // Test json data
        console.log(data);



        state_ins ={};
        state_out ={};
        state_ins_cum ={};
        state_out_cum ={};
        rebate_avg = [];
        states = [];
        sizes = [];
        weekly_income = []
        total_ins =[]

        data.forEach(st => {
            // Years
            years = Object.keys(st.install.years);

            // retrive Installation and output data
            ins_his = [];
            out_his =[];
            ins_cum_his = [];
            out_cum_his =[];
            ins = 0;
            out = 0;
            ins_years = st.install.years;
            out_years = st.output.years;
            for (key in ins_years){
                ins_his.push(ins_years[key]);
                out_his.push(out_years[key]/1000);
                ins += ins_years[key];
                out += out_years[key]/1000;
                ins_cum_his.push(ins);
                out_cum_his.push(out);
            }

            // Contain installation/Output data
            state_ins[st.state] = ins_his;
            state_out[st.state] = out_his;

            // Contain installation/Output cumulative  data
            state_ins_cum[st.state] = ins_cum_his;
            state_out_cum[st.state] = out_cum_his;

            // rebate average per state 
            rebate_avg.push(st.rebate_avg)
            // States
            states.push(st.state)
            // Weekly income data in 2018 (latest available )
            weekly_income.push(st.weekly_income_AVG)
            // Size of bubbles based on weekly income
            sizes.push(st.weekly_income_AVG / 30)

            // Total installation per state
            total_ins.push(st.install.Total)
        })

        console.log(years);

        for (i=0;i<years.length;i++){
            years[i] = parseInt(years[i]);
            // years[i] = Date.parse(years[i]);
        }

        console.log(years);        


        state_output_2020 = Object.values(state_out).map(row => row[19]);


        buildLinePlot(years,state_ins,"Installation");

        buildBubblePlot(rebate_avg.slice(0,8) ,state_output_2020.slice(0,8),states.slice(0,8),weekly_income.slice(0,8))


        buildDonutPlot(total_ins.slice(0,8),states.slice(0,8))

    });
    
}


// Plot the line chart
function buildLinePlot(years,state_data,data_type){  
    var act_trace = {
        x: years,
        y: state_data.ACT,
        mode : 'lines',
        name: 'ACT'
    };
    
    var nsw_trace = {
        x: years,
        y: state_data.NSW,
        mode: 'lines',
        name: 'NSW'
    };

    var nt_trace = {
        x: years,
        y: state_data.NT,
        mode: 'lines',
        name: 'NT'
    };
    
    var qld_trace = {
        x: years,
        y: state_data.QLD,
        mode: 'lines',
        name: 'QLD'
    };

    var sa_trace = {
        x: years,
        y: state_data.SA,
        mode: 'lines',
        name: 'SA'
    };

    var tas_trace = {
        x: years,
        y: state_data.TAS,
        mode: 'lines',
        name: 'TAS'
    };

    var vic_trace = {
        x: years,
        y: state_data.VIC,
        mode: 'lines',
        name: 'VIC'
    };

    var wa_trace = {
        x: years,
        y: state_data.WA,
        mode: 'lines',
        name: 'WA'
    };

    var national_trace = {
        x: years,
        y: state_data.National,
        mode: 'lines',
        name: 'National'
    };

    var data = [act_trace, nsw_trace, nt_trace, qld_trace, sa_trace, tas_trace, vic_trace, wa_trace,national_trace];

    var layout = {
        // title:`States comparison on ${data_type} over years`,
        xaxis: {
          title: "Years",
          type:"category"
      },
        yaxis: {title: "Total installations",
        type: 'log'
      }
      };

    Plotly.newPlot(`${data_type} line chart`,data, layout);
}

function buildBubblePlot(X,Y,states,S){  

    console.log(S)

    // Trace for Bubble Plot
    var trace1 = {
        x: X,
        y: Y,
        text:states,
        mode: 'markers',
        marker: {
          color: ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f'],
          size: S,
          sizeref : 30
        //   colorscale: Earth
        },
        hovertemplate: '<b>State</b>: %{text}<br>'+
                        '<b>Average Rebate</b>: $%{x:$,.2f}<br>' +
                        '<b>Output</b>: %{y:,.2f}MWh<br>' +
                        '<b>Weekly Income</b> $%{marker.size}'
      };
      
      var data = [trace1];
      
      var layout = {
        // title:"Output vs Rebate per state in 2020",
        height:700,
        xaxis: {title: "Average Rebate ($)"},
        yaxis: {title: "Total Output (MWh) in 2020"}
      };
      
      Plotly.newPlot('Output chart', data,layout);

}

function buildDonutPlot(V,states){
    trace = {
        domain: {row:0, column: 0},
        name:'Total Installations',
        type: 'pie',
        textposition: 'inside',
        marker: {
          colors:['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f']
        },
        values: V,
        labels: states,
        text : states,
        hole: 0.5,
        textinfo: 'text',
        hoverinfo: 'label+percent'
      }
        var data = [trace];
  
        var layout = {
          // title: 'Cumulative Installations over years',
          annotations: [
            {
              font: {
                size: 20
              },
              showarrow: false,
              text: 'Total <br> Installations <br> in <br>Australia',
              x: 0.5,
              y: 0.5
            }],
          showlegend : false
        };
        
        Plotly.newPlot('Installation donut chart', data, layout); 

}


init();