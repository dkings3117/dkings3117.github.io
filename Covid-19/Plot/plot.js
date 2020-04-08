// Define data variable
// var fulldata;

// Retrieve CSV data
d3.csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv").then(function(fulldata) {
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
    // fulldata.forEach(function(row) {
    //   console.log(Object.keys(row))
    // });
    dayArray = [];
    caseArray = [];
    for (i =0; i < fulldata.length; i++) {
      if (i == 225)
      {
        console.log(fulldata[i]);
        console.log("columns:");
        console.log(Object.keys(fulldata[i]));
        // for (j = 0; j < fulldata.columns.length; j++)
        // {
        //   console.log("j = " + j);
        //   console.log(fulldata.columns[j]);
        //   console.log(fulldata[i][fulldata.columns[j]]);
        // }
        for (j = 4; j < fulldata.columns.length; j++)
        {
          dayArray.push(fulldata.columns[j]);
          caseArray.push(fulldata[i][fulldata.columns[j]]);
        }
      }
      // var activedate = fulldata[i].date;
      // initialdates.push(activedate);
      // var parts = initialdates[i].split('-');
      // var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
      // var mydatestring = mydate.toDateString();
      // var mydatearray = mydatestring.split(' ');
      // var mymonth = mydatearray[1];
      // mymontharray.push(mymonth);
      // var myday = mydatearray[0];
      // mydayarray.push(myday);
    }
    console.log("dayArray:");
    console.log(dayArray);
    console.log("caseArray:");
    console.log(caseArray);
    // Create empty arrays to hold total sightings for each month/day of the week
    var monthtotals = {};
    var daytotals = {};

    // Populate arrays with total sightings for each month/day of the week
    caseArray.forEach(function(x) { monthtotals[x] = (monthtotals[x] || 0)+1; });
    mydayarray.forEach(function(x) { daytotals[x] = (daytotals[x] || 0)+1; });

    // Set x and y arrays
    //var barx = [["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayArray];
    //var bary = [[monthtotals.Jan, monthtotals.Feb, monthtotals.Mar, monthtotals.Apr, monthtotals.May, monthtotals.Jun, monthtotals.Jul, monthtotals.Aug, monthtotals.Sep, monthtotals.Oct, monthtotals.Nov, monthtotals.Dec], caseArray];
    var barx = [dayArray];
    var bary = [caseArray];


    function makeTrace(i) {
      return {
        x: barx[i],
        y: bary[i],
        type: 'line',
        visible: i === 0,
      };
    }

    var updatemenus = [{
      y: 1,
      yanchor: 'top',
      buttons: [{
      method: 'restyle',
      args: ['visible', [true, false]],
      label: 'Confirmed cases by day'
    }]
    }]

    var data = [0, 1].map(makeTrace)


    var layout = {
      updatemenus: updatemenus,
      title: "Confirmed cases by day",
      yaxis: { title: "Number of confirmed cases" }
    } 

    Plotly.plot('lineplot', data, layout);
    
}