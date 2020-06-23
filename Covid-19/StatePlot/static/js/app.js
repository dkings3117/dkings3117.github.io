// Use D3 to select the table
var table = d3.select("table");

// Use D3 to select the table body
var tbody = table.select("tbody");

function clearTable() {
  tbody.html("");
};

// Retrieve CSV data
d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv").then(function(fulldata) {
  refresh(fulldata)
});

// refresh the table based on filtered data
function refresh(refreshData) {

    console.log(refreshData);
    console.log(refreshData.columns);
    data_length = refreshData.length;
    var dayArray = new Array;
    var caseArray = new Array;
    var deathArray = new Array;
    var diffArray = new Array;
    var deathDiffArray = new Array;
    var pctArray = new Array;   /*** DELETE ***/
    var roll7Array = new Array; /*** DELETE ***/
    var roll7DeathArray = new Array;  /*** DELETE ***/
    var roll7DiffArray = new Array;
    var roll7DeathDiffArray = new Array;
    var maxFips = 0;
    var totalIndex = 0;
    stateArray = [];
    fipsArray = [];
    /* for (i = 0; i < stateArray.length; i++)
    {
      stateArray[i] = "";
    } */
  
    
    console.log("dayArray:");
    console.log(dayArray);
    dayCounter = -1;
    lastDate = "";

    for (i = 0; i < refreshData.length; i++)
    {
      fips = parseInt(refreshData[i].fips);
      if (fips > maxFips)
      {
        maxFips = fips;
      }
    }
    var arrSize = maxFips + 1;
    for (var i = 0; i < arrSize; i++)
    {
      dayArray[i] = new Array();
      stateArray[i] = "";
      caseArray[i] = new Array();
      deathArray[i] = new Array();
      diffArray[i] = new Array();
      deathDiffArray[i] = new Array();
      pctArray[i] = new Array();
      roll7Array[i] = new Array();
      roll7DeathArray[i] = new Array();
      roll7DiffArray[i] = new Array();
      roll7DeathDiffArray[i] = new Array();
    }

    for (i = 0; i < refreshData.length; i++)
    {
      console.log("i = " + i);
      console.log("refreshData[i]");
      console.log(refreshData[i]);
      console.log("columns:");
      console.log(Object.keys(refreshData[i]));
      fips = parseInt(refreshData[i].fips);
      console.log("fips = " + fips);

      if (refreshData[i].date == lastDate)
      {
        caseArray[totalIndex][dayCounter] += parseInt(refreshData[i].cases);
        deathArray[totalIndex][dayCounter] += parseInt(refreshData[i].deaths);
      }
      else
      {
        dayCounter++;
        lastDate = refreshData[i].date;
        dayArray[totalIndex].push(refreshData[i].date);
        caseArray[totalIndex].push(parseInt(refreshData[i].cases));
        deathArray[totalIndex].push(parseInt(refreshData[i].deaths));
      }
      dayArray[fips].push(refreshData[i].date);
      caseArray[fips].push(refreshData[i].cases);
      deathArray[fips].push(refreshData[i].deaths);
      stateArray[fips] = refreshData[i].state;
      pctArray[fips].push(0);
    }

    console.log("dayArray:");
    console.log(dayArray);
    console.log("caseArray:");
    console.log(caseArray);
    console.log("deathArray:");
    console.log(deathArray);
    console.log("diffArray:");
    console.log(diffArray);
    console.log("deathDiffArray");
    console.log(deathDiffArray);
    for (i = 0; i < arrSize; i++)
    {
      diffArray[i].push(0);
      deathDiffArray[i].push(0);
      for (j = 1; j < caseArray[i].length; j++)
      {
        newCases = caseArray[i][j] - caseArray[i][j-1];
        newDeaths = deathArray[i][j] - deathArray[i][j-1];
        diffArray[i].push(newCases);
        deathDiffArray[i].push(deathArray[i][j] - deathArray[i][j-1]);
      }
    }
    console.log("diffArray:");
    console.log(diffArray);
    console.log("deathDiffArray");
    console.log(deathDiffArray);
    console.log("pctArray");
    console.log(pctArray);

    for (i = 0; i < arrSize; i++)
    {
      console.log("i = " + i);
      rollingTotal7 = 0;
      rollingTotalDeath7 = 0;
      rollingTotalDiff7 = 0;
      rollingTotalDeathDiff7 = 0;
      console.log("caseArray[i].length = " + caseArray[i].length);
      for (j = 0; j < caseArray[i].length; j++)
      {
        console.log("j = " + j);
        if (j >= 7)
        {
          rollingTotal7 -= caseArray[i][j-7];
          rollingTotalDeath7 -= deathArray[i][j-7];
          rollingTotalDiff7 -= diffArray[i][j-7];
          rollingTotalDeathDiff7 -= deathDiffArray[i][j-7];
        }
        rollingTotal7 += parseInt(caseArray[i][j]);
        roll7Array[i].push(rollingTotal7 / 7.0);
        rollingTotalDeath7 += parseInt(deathArray[i][j]);
        roll7DeathArray[i].push(rollingTotalDeath7 / 7.0);
        rollingTotalDiff7 += diffArray[i][j];
        roll7DiffArray[i].push(rollingTotalDiff7 / 7.0);
        rollingTotalDeathDiff7 += deathDiffArray[i][j];
        roll7DeathDiffArray[i].push(rollingTotalDeathDiff7 / 7.0);
        console.log("caseArray[i][j] = " + caseArray[i][j]);
        console.log("deathArray[i][j] = " + deathArray[i][j]);
        console.log("diffArray[i][j] = " + diffArray[i][j]);
        console.log("deathDiffArray[i][j] = " + deathDiffArray[i][j]);
        console.log("rollingTotal7 = " + rollingTotal7);
        console.log("rollingTotalDeath7 = " + rollingTotalDeath7);
        console.log("rollingTotalDiff7 = " + rollingTotalDiff7);
        console.log("rollingTotalDeathDiff7 = " + rollingTotalDeathDiff7);
      }
    }
    console.log("roll7Array");
    console.log(roll7Array);
    console.log("roll7DeathArray");
    console.log(roll7DeathArray);
    console.log("roll7DiffArray");
    console.log(roll7DiffArray);
    console.log("roll7DeathDiffArray");
    console.log(roll7DeathDiffArray);

    clearTable();
    console.log("caseArray:");
    console.log(caseArray);  
    console.log("table");
    var stateDropdown = document.getElementById("stateSelector");
    var option = document.createElement("option");
    option.value = totalIndex;
    stateArray[totalIndex] = "TOTAL";
    option.text = stateArray[totalIndex];
    stateDropdown.add(option);

    for (i = 1; i < arrSize; i++)
    {
      console.log("*" + stateArray[i] + "*");
      if (stateArray[i] != "")
      {
        var option = document.createElement("option");
        option.value = i;
        option.text = stateArray[i];
        stateDropdown.add(option);

        var tableRef = document.getElementById('state-table').getElementsByTagName('tbody')[0];
        // Insert a row in the table at row index 0
        var newRow   = tableRef.insertRow(tableRef.rows.length);
        // Insert a cell in the row at index 0        
        var newCell  = newRow.insertCell(0);
        //newCell.style("visibility:hidden");
        var newText  = document.createTextNode(i);
        newCell.appendChild(newText);
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(stateArray[i]);
        newCell.appendChild(newText);
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(caseArray[i][caseArray[i].length-1]);
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(deathArray[i][deathArray[i].length-1]);
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(diffArray[i][diffArray[i].length-1]);
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(deathDiffArray[i][deathDiffArray[i].length-1]);
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(roll7DiffArray[i][roll7DiffArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(roll7DeathDiffArray[i][roll7DeathDiffArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
      }
    }

    var tableRef = document.getElementById('state-table').getElementsByTagName('tbody')[0];
    // Insert a row in the table at row index 0
    var newRow   = tableRef.insertRow(tableRef.rows.length);
    // Insert a cell in the row at index 0        
    var newCell  = newRow.insertCell(0);
    //newCell.style("visibility:hidden");
    var newText  = document.createTextNode(totalIndex);
    newCell.appendChild(newText);
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(stateArray[totalIndex]);
    newCell.appendChild(newText);
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(caseArray[totalIndex][caseArray[totalIndex].length-1]);
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(deathArray[totalIndex][deathArray[totalIndex].length-1]);
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(diffArray[totalIndex][diffArray[totalIndex].length-1]);
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(deathDiffArray[totalIndex][deathDiffArray[totalIndex].length-1]);
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(roll7DiffArray[totalIndex][roll7DiffArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(roll7DeathDiffArray[totalIndex][roll7DeathDiffArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";

    onRowClick("state-table", function (row){
      var value = row.getElementsByTagName("td")[0].innerHTML;
      //document.getElementById('click-response').innerHTML = value + " clicked!";
      console.log("value>", value);
      show_state_graph(value, stateArray[value], dayArray[value],
        caseArray[value], deathArray[value], diffArray[value],
        deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value]);
    });
    onChange("stateSelector", function (){
      //var value = row.getElementById("stateSelector")[0].innerHTML;
      alert("onChange 2");
      var e = document.getElementById("stateSelector");
      var value = e.options[e.selectedIndex].value;
      //document.getElementById('click-response').innerHTML = value + " clicked!";
      console.log("value>", value);
      show_state_graph(value, stateArray[value], dayArray[value],
        caseArray[value], deathArray[value], diffArray[value],
        deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value]);
    });

    // functions assigned to onchange properties
    document.getElementById('stateSelector').onchange = function() {
      var e = document.getElementById("stateSelector");
      var value = e.options[e.selectedIndex].value;
      console.log("value>", value);
      show_state_graph(value, stateArray[value], dayArray[value],
        caseArray[value], deathArray[value], diffArray[value],
        deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value]);
    };

    value = totalIndex;
    show_state_graph(value, stateArray[value], dayArray[value],
      caseArray[value], deathArray[value], diffArray[value],
      deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value]);

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

function show_state_graph(fips, stateName, dayArray, caseArray, deathArray, diffArray, deathDiffArray, roll7DiffArray, roll7DeathDiffArray) {
    // Set x and y arrays
    var barx = [dayArray, dayArray, dayArray, dayArray, dayArray, dayArray];
    var bary = [caseArray, deathArray, diffArray, deathDiffArray, roll7DiffArray, roll7DeathDiffArray];
    
    function makeTrace(i) {
      return {
        x: barx[i],
        y: bary[i],
        type: i==2||i==3?'bar':'line',
        name: i==2||i==3?'Daily':i==4||i==5?'Rolling 7 day avg':'',
        marker: {
          color: i==2||i==3?'rgb(255,151,76)':'rgb(57,106,177)',
          line: {
            color: i==2||i==3?'rgb(255,151,76)':'rgb(57,106,177)',
            width: 1
          }
        },
        visible: i === 0,
      };
    }
  
    var updatemenus = [{
      y: 1,
      yanchor: 'top',
      buttons: [{
      method: 'restyle',
      args: ['visible', [true, false, false, false, false, false]],
      label: 'Total confirmed cases by day'
      },
      {
        method: 'restyle',
        args: ['visible', [false, true, false, false, false, false]],
        label: 'Total deaths by day'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, true, false, true, false]],
        label: 'New cases by day'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, false, true, false, true]],
        label: 'New deaths by day'
      }
      ]
    }]

    var data = [0,1,2,3,4,5].map(makeTrace)

    var layout = {
      updatemenus: updatemenus,
      title: stateName,
      yaxis: { title: "Number of cases" }
    } 

    Plotly.newPlot('lineplot', data, layout);
}
