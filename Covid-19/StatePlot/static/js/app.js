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
    var data_length = refreshData.length;
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
    var stateArray = [];
    var fipsArray = [];
    var populationArray = [];
    
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
      populationArray[i] = 0;
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

    var dataset = [];
    d3.csv("https://cors-anywhere.herokuapp.com/https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/state/detail/SCPRC-EST2019-18+POP-RES.csv",
    function(popdata) {
      console.log("Population CSV");

      popdata.forEach(function(d) { dataset.push([ +d.STATE, d.NAME, +d.POPESTIMATE2019 ]) });
      console.log("dataset");
      console.log(dataset);

      pop_function(dataset);
    });

    function pop_function (pdata) {
      console.log("Population CSV");
      console.log("pdata");
      for (i = 0; i < pdata.length; i++)
      {
        console.log(i + " " + pdata[i]);
      }

    console.log("join");
    var popArray = new Array(stateArray.length);
    var lookupIndex = new Array(stateArray.length);
    var output = [];
    console.log("dataset");
    console.log(dataset);
    console.log(dataset.length);
    for (var i = 0; i < stateArray.length; i++) {
      popArray[i] = "";
      lookupIndex[i] = 0;
    }
    for (var i = 0; i < dataset.length; i++) {
          var row = dataset[i];
          console.log(i, row);
          lookupIndex[row[0]] = row; // create an index for lookup table
    }
    console.log("lookupIndex");
    console.log(lookupIndex);
    console.log("stateArray");
    console.log(stateArray);
    for (var j = 0; j < stateArray.length; j++) {
          var y = stateArray[j];
          console.log(y);
          console.log(j);
          var x = lookupIndex[j]; // get corresponding row from lookupTable
          console.log(x);
          if (j == 0 || y != "" && x != 0)
          {
            popArray[j] = x[2];
          }
    }
    /* hard code values for territories that are not in the CSV data */
    popArray[66] = 168485; // Guam
    popArray[69] = 51433; // Northern Mariana Islands
    popArray[78] = 106235; // US Vigin Islands
    console.log("popArray");
    console.log(popArray);

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
    console.log("populationArray");
    console.log(populationArray);
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

    casesPerCapitaArray = new Array(arrSize);
    deathsPerCapitaArray = new Array(arrSize);
    newCasesPerCapitaArray = new Array(arrSize);
    newDeathsPerCapitaArray = new Array(arrSize);
    roll7CasesPerCapitaArray = new Array(arrSize);
    roll7DeathsPerCapitaArray = new Array(arrSize);
    for (i = 0; i < arrSize; i++)
    {
      casesPerCapitaArray[i] = new Array(caseArray[i].length);
      deathsPerCapitaArray[i] = new Array(deathArray[i].length);
      newCasesPerCapitaArray[i] = new Array(diffArray[i].length);
      newDeathsPerCapitaArray[i] = new Array(deathDiffArray[i].length);
      roll7CasesPerCapitaArray[i] = new Array(roll7DiffArray[i].length);
      roll7DeathsPerCapitaArray[i] = new Array(roll7DeathDiffArray[i].length);

      if (popArray[i] != "")
      {
        for (j = 0; j < caseArray[i].length; j++)
        {
          casesPerCapitaArray[i][j] = 100000 * caseArray[i][j] / popArray[i];
        }
        for (j = 0; j < caseArray[i].length; j++)
        {
          deathsPerCapitaArray[i][j] = 100000 * deathArray[i][j] / popArray[i];
        }
        for (j = 0; j < caseArray[i].length; j++)
        {
          newCasesPerCapitaArray[i][j] = 100000 * diffArray[i][j]/ popArray[i];
        }
        for (j = 0; j < caseArray[i].length; j++)
        {
          newDeathsPerCapitaArray[i][j] = 100000 * deathDiffArray[i][j] / popArray[i];
        }
        for (j = 0; j < caseArray[i].length; j++)
        {
          roll7CasesPerCapitaArray[i][j] = 100000 * roll7DiffArray[i][j] / popArray[i];
        }
        for (j = 0; j < caseArray[i].length; j++)
        {
          roll7DeathsPerCapitaArray[i][j] = 100000 * roll7DeathDiffArray[i][j] / popArray[i];
        }
      }
    }
    console.log("casesPerCapitaArray");
    console.log(casesPerCapitaArray);

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
        var newText = document.createTextNode(stateArray[i]);
        newCell.appendChild(newText);

        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(popArray[i]);
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";

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
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(casesPerCapitaArray[i][casesPerCapitaArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(deathsPerCapitaArray[i][deathsPerCapitaArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(newCasesPerCapitaArray[i][newCasesPerCapitaArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(newDeathsPerCapitaArray[i][newDeathsPerCapitaArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(roll7CasesPerCapitaArray[i][roll7CasesPerCapitaArray[i].length-1]).toFixed(2));
        newCell.appendChild(newText);
        newCell.style.textAlign = "right";
        var newCell  = newRow.insertCell();
        var newText  = document.createTextNode(parseFloat(roll7DeathsPerCapitaArray[i][roll7DeathsPerCapitaArray[i].length-1]).toFixed(2));
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
    var newText  = document.createTextNode(popArray[totalIndex]);
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
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
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(casesPerCapitaArray[totalIndex][casesPerCapitaArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(deathsPerCapitaArray[totalIndex][deathsPerCapitaArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(newCasesPerCapitaArray[totalIndex][newCasesPerCapitaArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(newDeathsPerCapitaArray[totalIndex][newDeathsPerCapitaArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(roll7CasesPerCapitaArray[totalIndex][roll7CasesPerCapitaArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    var newCell  = newRow.insertCell();
    var newText  = document.createTextNode(parseFloat(roll7DeathsPerCapitaArray[totalIndex][roll7DeathsPerCapitaArray[totalIndex].length-1]).toFixed(2));
    newCell.appendChild(newText);
    newCell.style.textAlign = "right";
    [roll7DeathDiffArray[totalIndex].length-1]
    onRowClick("state-table", function (row){
      var value = row.getElementsByTagName("td")[0].innerHTML;
      //document.getElementById('click-response').innerHTML = value + " clicked!";
      console.log("value>", value);
      show_state_graph(value, stateArray[value], dayArray[value],
        caseArray[value], deathArray[value], diffArray[value],
        deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value],
        casesPerCapitaArray[value], deathsPerCapitaArray[value], newCasesPerCapitaArray[value],
        newDeathsPerCapitaArray[value], roll7CasesPerCapitaArray[value], roll7DeathsPerCapitaArray[value]
        );
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
        deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value],
        casesPerCapitaArray[value], deathsPerCapitaArray[value], newCasesPerCapitaArray[value],
        newDeathsPerCapitaArray[value], roll7CasesPerCapitaArray[value], roll7DeathsPerCapitaArray[value]
        );
    });

    // functions assigned to onchange properties
    document.getElementById('stateSelector').onchange = function() {
      var e = document.getElementById("stateSelector");
      var value = e.options[e.selectedIndex].value;
      console.log("value>", value);
      show_state_graph(value, stateArray[value], dayArray[value],
        caseArray[value], deathArray[value], diffArray[value],
        deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value],
        casesPerCapitaArray[value], deathsPerCapitaArray[value], newCasesPerCapitaArray[value],
        newDeathsPerCapitaArray[value], roll7CasesPerCapitaArray[value], roll7DeathsPerCapitaArray[value]  
        );
    };

    value = totalIndex;
    show_state_graph(value, stateArray[value], dayArray[value],
      caseArray[value], deathArray[value], diffArray[value],
      deathDiffArray[value], roll7DiffArray[value], roll7DeathDiffArray[value],
      casesPerCapitaArray[value], deathsPerCapitaArray[value], newCasesPerCapitaArray[value],
      newDeathsPerCapitaArray[value], roll7CasesPerCapitaArray[value], roll7DeathsPerCapitaArray[value]
      );
    }

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

function show_state_graph(fips, stateName, dayArray, caseArray, deathArray, diffArray, deathDiffArray, roll7DiffArray, roll7DeathDiffArray,
  casesPerCapitaArray, deathsPerCapitaArray, newCasesPerCapitaArray, newDeathsPerCapitaArray, roll7CasesPerCapitaArray, roll7DeathsPerCapitaArray) {
    // Set x and y arrays
    var barx = [dayArray, dayArray, dayArray, dayArray, dayArray, dayArray, dayArray, dayArray, dayArray, dayArray, dayArray, dayArray];
    var bary = [caseArray, deathArray, diffArray, deathDiffArray, roll7DiffArray, roll7DeathDiffArray,
                casesPerCapitaArray, deathsPerCapitaArray, newCasesPerCapitaArray, newDeathsPerCapitaArray,
                roll7CasesPerCapitaArray, roll7DeathsPerCapitaArray];
    
    function makeTrace(i) {
      return {
        x: barx[i],
        y: bary[i],
        type: i==2||i==3||i==8||i==9?'bar':'line',
        name: i==2||i==3||i==8||i==9?'Daily':i==4||i==5||i==10||i==11?'Rolling 7 day avg':'', // legend labels
        marker: {
          color: i==2||i==3||i==8||i==9?'rgb(255,151,76)':'rgb(57,106,177)', // bar graph color : line graph color
          line: {
            color: i==2||i==3||i==8||i==9?'rgb(255,151,76)':'rgb(57,106,177)',
            width: 1
          }
        },
        visible: i === 0,
      };
    }
  
    var updatemenus = [{
      y: 1,
      yanchor: 'top',
      buttons: [
      {
        method: 'restyle',
        args: ['visible', [true, false, false, false, false, false, false, false, false, false, false, false]],
        label: 'Total confirmed cases'
      },
      {
        method: 'restyle',
        args: ['visible', [false, true, false, false, false, false, false, false, false, false, false, false]],
        label: 'Total deaths'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, true, false, true, false, false, false, false, false, false, false]],
        label: 'New cases'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, false, true, false, true, false, false, false, false, false, false]],
        label: 'New deaths'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, false, false, false, false, true, false, false, false, false, false]],
        label: 'Total cases per 100,000'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, false, false, false, false, false, true, false, false, false, false]],
        label: 'Total deaths per 100,000'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, false, false, false, false, false, false, true, false, true, false]],
        label: 'New cases per 100,000'
      },
      {
        method: 'restyle',
        args: ['visible', [false, false, false, false, false, false, false, false, false, true, false, true]],
        label: 'New deaths per 100,000'
      }

      ]
    }]

    // map trace for each array element in barx and bary
    var data = [0,1,2,3,4,5,6,7,8,9,10,11].map(makeTrace)

    var layout = {
      updatemenus: updatemenus,
      title: stateName,
      yaxis: { title: "Number of cases" }
    } 

    Plotly.newPlot('lineplot', data, layout);
}
