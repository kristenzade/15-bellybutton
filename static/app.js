/ Use d3 to read the data
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
      buildGauge(result.wfreq);
    });
  }

//   define the variables needed to build the charts and put into an array; build filter at same time for the drop down
    function buildCharts(sample) {
        d3.json("samples.json").then((data) => {
          var samples = data.samples;
          var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
          var result = resultArray[0];
          var otu_ids = result.otu_ids;
          var otu_labels = result.otu_labels;
          var sample_values = result.sample_values; 
          var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30}
          };

// define the variable for the buble chart, as well as the mode which defines the bubble, ie mode, markers, size based on samples
var bubbleData = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }
  ];
//  call the bubble chart and place in the div on the index
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
//   Define the variables for the bar chart, as well at the type to prepare to the plot
  var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
  var barData = [
    {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }
  ];
  
//   define bar layout, including title, and margins
  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
  };

  //   call bar plot and put into bar div on html
  Plotly.newPlot("bar", barData, barLayout);
});
}
 
// Display the sample metadata, i.e., an individual's demographic information.

// Display each key-value pair from the metadata JSON object somewhere on the page.

// Update all of the plots any time that a new sample is selected. 

function init() {
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  init();