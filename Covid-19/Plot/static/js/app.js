// Use D3 to select the table
var table = d3.select("table");

// Use D3 to select the table body
var tbody = table.select("tbody");

function clearTable() {
  tbody.html("");
};

// Retrieve CSV data
d3.csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv").then(function(fulldata) {
  refresh(fulldata)
});

// refresh the table based on filtered data
function refresh(refreshData) {
    console.log(refreshData);
    console.log(refreshData.columns);
    data_length = refreshData.length;
    var dayArray = new Array(data_length);
    var caseArray = new Array(data_length);
    var diffArray = new Array(data_length);
    var pctArray = new Array(data_length);
    var roll7DiffArray = new Array(data_length);
    var stateArray = new Array(data_length);
    var countryArray = new Array(data_length);
    var us_index = 0;
    for (var i = 0; i < data_length; i++) {
      dayArray[i] = new Array();
      caseArray[i] = new Array();
      diffArray[i] = new Array();
      pctArray[i] = new Array();
      roll7DiffArray[i] = new Array();
      stateArray[i] = refreshData[i][refreshData.columns[0]];
      countryArray[i] = refreshData[i][refreshData.columns[1]];
      if (countryArray[i] == "US")
      {
        us_index = i;
      }
      console.log(refreshData[i]);
      console.log("columns:");
      console.log(Object.keys(refreshData[i]));
      for (j = 4; j < refreshData.columns.length; j++)
      {
        dayArray[i].push(refreshData.columns[j]);
        caseArray[i].push(refreshData[i][refreshData.columns[j]]);
        if (j == 4)
        {
          diffArray[i].push(refreshData[i][refreshData.columns[j]]);
          pctArray[i].push(0);
        }
        else
        {
          diffArray[i].push(refreshData[i][refreshData.columns[j]] - refreshData[i][refreshData.columns[j-1]]);
          pctArray[i].push(100 * (refreshData[i][refreshData.columns[j]] / refreshData[i][refreshData.columns[j-1]] - 1) );
        }
      }
    }
    counter = 0;
    console.log("dayArray:");
    console.log(dayArray);

    for (i = 0; i < refreshData.length; i++) {
      console.log("i = " + i);
      console.log("refreshData[i]");
      console.log(refreshData[i]);
      console.log("columns:");
      console.log(Object.keys(refreshData[i]));
    }

    console.log("dayArray:");
    console.log(dayArray);
    console.log("caseArray:");
    console.log(caseArray);
    console.log("diffArray:");
    console.log(diffArray);
    for (i = 0; i < caseArray.length; i++)
    {
      diffArray[i].push(0);
      for (j = 1; j < caseArray[i].length; j++)
      {
        diffArray[i].push(caseArray[i][j] - caseArray[i][j-1]);
      }
    }
    console.log("diffArray:");
    console.log(diffArray);
    console.log("pctArray");
    console.log(pctArray);

    for (i = 0; i < caseArray.length; i++)
    {
      console.log("i = " + i);
      rollingTotalDiff7 = 0;
      console.log("caseArray[i].length = " + caseArray[i].length);
      for (j = 0; j < caseArray[i].length; j++)
      {
        console.log("j = " + j);
        if (j >= 7)
        {
          rollingTotalDiff7 -= diffArray[i][j-7];
        }
        rollingTotalDiff7 += parseInt(diffArray[i][j]);
        roll7DiffArray[i].push(rollingTotalDiff7 / 7.0);
        console.log("caseArray[i][j] = " + caseArray[i][j]);
        console.log("diffArray[i][j] = " + diffArray[i][j]);
        console.log("rollingTotalDiff7 = " + rollingTotalDiff7);
      }
    }
    console.log("roll7DiffArray");
    console.log(roll7DiffArray);

    clearTable();
    console.log("caseArray:");
    console.log(caseArray);  
    console.log("table");
    for (i = 0; i < data_length; i++)
    {
      console.log("*" + countryArray[i] + "-" + stateArray[i] + "*");
      var countryDropdown = document.getElementById("countrySelector");
      if (countryArray[i] != "")
      {
        var option = document.createElement("option");
        option.value = i;
        option.text = countryArray[i];
        if (stateArray[i] != "")
        {
          option.text += "-" + stateArray[i];
        }
        if (option.text == "US")
        {
          option.setAttribute('selected', true);
        }
        countryDropdown.add(option);

        var tableRef = document.getElementById('country-table').getElementsByTagName('tbody')[0];
        // Insert a row in the table at row index 0
        var newRow   = tableRef.insertRow(tableRef.rows.length);
        // Insert a cell in the row at index 0        
        var newCell  = newRow.insertCell(0);
        var newText  = document.createTextNode(i);
        newCell.appendChild(newText);
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(countryArray[i]);
        newCell.appendChild(newText);
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(stateArray[i]);
        newCell.appendChild(newText);
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(caseArray[i][caseArray[i].length-1]);
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(diffArray[i][diffArray[i].length-1]);
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(roll7DiffArray[i][roll7DiffArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
      }
    }
    onRowClick("country-table", function (row){
      var value = row.getElementsByTagName("td")[0].innerHTML;
      console.log("value>", value);
      show_country_graph(value, countryArray[value], stateArray[value], dayArray[value],
        caseArray[value], diffArray[value], roll7DiffArray[value]);
    });
    onChange("countrySelector", function (){
      var e = document.getElementById("countrySelector");
      var value = e.options[e.selectedIndex].value;
      console.log("value>", value);
      show_country_graph(value, countryArray[value], stateArray[value], dayArray[value],
        caseArray[value], diffArray[value], roll7DiffArray[value]);
    });

    // functions assigned to onchange properties
    document.getElementById('countrySelector').onchange = function() {
      var e = document.getElementById("countrySelector");
      var value = e.options[e.selectedIndex].value;
      console.log("value>", value);
      show_country_graph(value, countryArray[value], stateArray[value], dayArray[value],
        caseArray[value], diffArray[value], roll7DiffArray[value]);
    };

    value = us_index;
    show_country_graph(value, countryArray[value], stateArray[value], dayArray[value],
      caseArray[value], diffArray[value], roll7DiffArray[value]);
    console.log("END");
  };

function onRowClick(tableId, callback) {
  var table = document.getElementById(tableId),
      rows = table.getElementsByTagName("tr"),
      i;
  console.log(table);
  console.log(rows);
  for (i = 0; i < rows.length; i++) {
      table.rows[i].onclick = function (row) {
          return function () {
              callback(row);
          };
      }(table.rows[i]);
  }
};

function onChange(selectId, callback) {
  var select = document.getElementById(selectId);
  var options = select.getElementsByTagName("option");
  var i;
  console.log(select);
  console.log(options);
  select.onchange = function () {
    return function() {
      callback();
    }
  }
  console.log(select);
}

function show_country_graph(fips, countryName, stateName, dayArray, caseArray, diffArray, roll7DiffArray) {
    // Set x and y arrays
    var barx = [dayArray, dayArray, dayArray];
    var bary = [caseArray, diffArray, roll7DiffArray];
    countryStateName = countryName;
    if (stateName != "")
    {
      countryStateName += "-" + stateName;
    }
    
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
      args: ['visible', [true, false, false]],
      label: 'Total confirmed cases by day'
      },
      {
        method: 'restyle',
        args: ['visible', [false, true, false]],
        label: 'New cases by day'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, true]],
        label: 'Rolling 7 day avg. new cases'
      }
      ]
    }]

    var data = [0,1,2].map(makeTrace)

    var layout = {
      updatemenus: updatemenus,
      title: countryStateName,
      yaxis: { title: "Number of cases" }
    } 

    Plotly.newPlot('lineplot', data, layout);
}
