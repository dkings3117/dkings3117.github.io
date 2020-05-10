// Retrieve CSV data
d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv").then(function(fulldata) {
  buildPlot(fulldata)
});

// Create empty arrays
var initialdates = [];
var mymontharray = [];
var mydayarray = [];

// Parse desired months/days
function buildPlot(fulldata) {
    console.log(fulldata);
    console.log(fulldata.columns);
    max_index = 78;
    var dayArray = new Array(max_index + 1);
    var caseArray = new Array(max_index + 1);
    var diffArray = new Array(max_index + 1);
    for (var i = 0; i < dayArray.length; i++) {
      dayArray[i] = new Array();
      caseArray[i] = new Array();
      diffArray[i] = new Array();
    }
    console.log(dayArray);
    stateArray = new Array(max_index + 1);
    fipsArray = [];
    for (i = 0; i < stateArray.length; i++)
    {
      stateArray[i] = "";
    }
    for (i =0; i < fulldata.length; i++) {
        console.log("i = " + i);
        console.log("fulldata[i]");
        console.log(fulldata[i]);
        console.log("columns:");
        console.log(Object.keys(fulldata[i]));
        fips = parseInt(fulldata[i].fips);
        console.log("fips = " + fips);
        dayArray[fips].push(fulldata[i].date);
        caseArray[fips].push(parseInt(fulldata[i].cases));
        stateArray[fips] = fulldata[i].state;
        console.log("diffArray[" + fips + "]");
        console.log(diffArray[fips]);
    }
    for (i = 0; i < stateArray.length; i++)
    {
      diffArray[i].push(0);
      for (j = 1; j < caseArray[i].length; j++)
      {
        diffArray[i].push(caseArray[i][j] - caseArray[i][j-1]);
      }
    }
    console.log("dayArray:");
    console.log(dayArray);
    console.log("caseArray:");
    console.log(caseArray);
    console.log("diffArray:");
    console.log(diffArray);
  
    // Set x and y arrays
    barx = [];
    bary = [];
    for (i = 0; i < max_index + 1; i++)
    {
      console.log("*" + stateArray[i] + "*");
      if (stateArray[i] != "")
      {
        barx.push(dayArray[i]);
        bary.push(diffArray[i]);
      }
    }
    console.log("barx");
    console.log(barx);
    console.log("bary");
    console.log(bary);

    function makeTrace(i) {
      return {
        x: barx[i],
        y: bary[i],
        type: 'line',
        visible: i === 0,
      };
    }
  
    dropdownlist = [];
    counter = 0;
    for (i = 0; i < max_index + 1; i++)
    {
      if (stateArray[i] != "")
      {
        visible_list = [];
        for (j = 0; j < max_index + 1; j++)
        {
          if (counter == j)
          {
            visible_list.push(true);
          }
          else
          {
            visible_list.push(false);
          }
        }
        dropdownlist.push( { method: 'restyle',
                                  args: ['visible', visible_list],
                                  label: stateArray[i]
                        } );
        counter++;
      }
    }

    var updatemenus = [
    {
      y: 1,
      yanchor: 'top',
      buttons: dropdownlist
    }]

    maplist = new Array(max_index + 1);
    console.log("maplist");
    counter = 0;
    for (i = 0; i < max_index + 1; i++) // loop through states
    {
      if (stateArray[i] != "") // state is defined
      {
        maplist[counter] = counter;
        counter++;
      }
    }
    for (i = counter; i < max_index + 1; i++)
    {
      maplist[i] = i;
    }
    console.log(maplist);
    var data = maplist.map(makeTrace)

    var layout = {
      updatemenus: updatemenus,
      title: "Change in confirmed cases by day",
      yaxis: { title: "Confirmed cases" },
      height: 400,
      widht: 400
    } 

    setLinePlot(data, layout);
}

function setLinePlot(data, layout) {
    Plotly.newPlot('lineplot', data, layout);
};
