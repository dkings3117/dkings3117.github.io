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
    var deathArray = new Array(max_index + 1);
    for (var i = 0; i < dayArray.length; i++) {
      dayArray[i] = new Array();
      caseArray[i] = new Array();
      deathArray[i] = new Array();
    }
    console.log(dayArray);
    stateArray = new Array(max_index + 1);
    fipsArray = [];
    diffArray = [];
    pctArray = [];
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
        caseArray[fips].push(fulldata[i].cases);
        deathArray[fips].push(fulldata[i].deaths);
        stateArray[fips] = fulldata[i].state;
        diffArray.push(fulldata[i][fulldata.columns[3]]);
        pctArray.push(0);
    }
    console.log("dayArray:");
    console.log(dayArray);
    console.log("caseArray:");
    console.log(caseArray);
    console.log("diffArray:");
    console.log(diffArray);
    console.log("pctArray");
    console.log(pctArray);
  
    // Set x and y arrays
    barx = [];
    bary = [];
    for (i = 0; i < max_index + 1; i++)
    {
      console.log("*" + stateArray[i] + "*");
      if (stateArray[i] != "")
      {
        barx.push(dayArray[i]);
        bary.push(caseArray[i]);
        // bary.push(deathArray[i]);
      }
    }

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

    var updatemenus = [{
      y: 1,
      yanchor: 'top',
      buttons: dropdownlist
    }]

    var maplist = new Array(max_index + 1);
    console.log("maplist");
    counter = 0;
    for (i = 0; i < maplist.length; i++)
    {
      if (stateArray[i] != "")
      {
        maplist[counter] = counter;
        counter++;
      }
    }
    for (i = counter; i < maplist.length; i++)
    {
      maplist[i] = i;
    }
    console.log(maplist);
    var data = maplist.map(makeTrace)

    var layout = {
      updatemenus: updatemenus,
      title: "Confirmed cases by day",
      yaxis: { title: "Confirmed cases" }
    } 

    Plotly.plot('lineplot', data, layout);
    
}