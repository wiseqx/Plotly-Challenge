function init(){
    d3.json("samples.json").then((data) => {
        // create a dropdown menu
        var idArray = data.names;
        d3.select("#selDataset").selectAll("option")
            .data(idArray)
            .enter()
            .append("option")
            .attr("value", d=>d)
            .text(d=>d);
        
        // make the first id the default page
        const firstName = idArray[0];
        buildCharts(firstName);
        demoInfo(firstName);
            
    });
}

function buildCharts(name){

    d3.json("samples.json").then((data) => {

        var ds = data.samples;

        var filteredData_2 = ds.filter(row => row.id == name);
        var labels = filteredData_2[0].otu_ids;
        var values = filteredData_2[0].sample_values;
        var texts = filteredData_2[0].otu_labels;

        // create a bar chart
        var trace1 = {
            x: values.slice(0, 10).reverse(),
            y: labels.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: texts.slice(0, 10),
            type: "bar",
            hoverinfo: "text",
            orientation: "h"
        };

        var layout = {
            title: `<b>Top Ten OTUs for ID ${name}</b>`,
            margin: {t: 100, l:100},
            width: 500,
            height: 600
        };

        var data = [trace1];
        Plotly.newPlot("bar", data, layout);

        // create a bubble chart
        var trace2 = {
            x: labels,
            y: values,
            text: texts,
            mode: 'markers',
            hoverinfo: "text",
            marker: {
                size: values,
                color: labels,
                colorscale: "Electric"
            }
        };

        var layout2 = {
            title: `<b>Bacteria Cultures for ID ${name} </b>`,
            xaxis: { title: `OTU ID`},
            yaxis: { title: "OTU Sample Value"},
            width: 1250,
            height: 500
        };

        var data2 = [trace2];
        Plotly.newPlot("bubble", data2, layout2)
    });
};


// Demographic info
function demoInfo(name){

    d3.json("samples.json").then((data) => {

        var md = data.metadata;

        var filteredData = md.filter(row => row.id == name);
        var filteredValue = filteredData[0];

        var panelValue = d3.select("#sample-metadata");
        
        panelValue.html("");

        Object.entries(filteredValue).forEach(([key, value]) => {
            //Capitalize first letter
            var newKey = key.charAt(0).toUpperCase() + key.slice(1);
            //update info
            panelValue.append("p").text(`${newKey}: ${value}`);
        });

        // create a Gauge Chart
        var trace3 = {
            type: "pie",
            showlegend: false,
            hole: 0.5,
            rotation: 90,
            values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 /9, 100 / 9, 100 / 9, 100 / 9, 100],
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            direction: "clockwise",
            textinfo: "text",
            textposition: "inside",
            marker: {
              colors: ["rgba(241, 129, 48, 0.62)", "rgba(241, 164, 48, 0.62)", "rgba(241, 209, 48, 0.62)", "rgba(238, 241, 48, 0.62)", "rgba(216, 241, 48, 0.62)","rgba(180, 241, 48, 0.62)", "rgba(109, 241, 48, 0.62)", "rgba(48, 241, 64, 0.62)", "rgba(48, 241, 132, 0.62)",  "white"]
            },
            labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            hoverinfo: "text"
          };

        // create a pointer
        var degrees = 180 - filteredValue.wfreq * 20, radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        var mainPath = path1,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        
        trace4 = {
            type: 'scatter',
            x:[0],
            y:[0],
            marker: {size: 14, color: '850000'},
            showlegend: false,
            text: `Washing frequency: ${filteredValue.wfreq}`,
            hoverinfo: 'text'
        };

        var layout3 = {
            width: 500,
            height: 580,
            margin: {t: 150},
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            title: '<b>Belly Button Washing Frequency</b><br> Scrubs per Week',
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1, 1]}
          };

    
        var data3 = [trace3, trace4];
        Plotly.newPlot("gauge", data3, layout3);

    });

};

//update data
function optionChanged(newName){
    buildCharts(newName);
    demoInfo(newName);
}

// initialize the dashboard
init();