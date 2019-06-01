// from data.js
var tableData = data;

// YOUR CODE HERE!

// Use D3 to select the table
var table = d3.select("table");

// Use D3 to select the table body
var tbody = table.select("tbody");

// Use D3 to select the selection lists
var selectCity = d3.select("#city");
var selectState = d3.select("#state");
var selectCountry = d3.select("#country");
var selectShape = d3.select("#shape");

// initialize lists of unique values for select tags
var cities = [];
var states = [];
var countries = [];
var shapes = [];

/* capitalizes the first letter in each word */
function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
};

/* format text depending on key value */
function cellText(key, value) {
  if (key == "state" || key == "country")
  {
    return value.toUpperCase();
  }
  else if (key == "city")
  {
    return titleCase(value);
  }
  else
  {
    return value;
  }
};

// build table and lists of unique values
tableData.forEach((ufoReport) => {
    var row = tbody.append("tr");
    Object.entries(ufoReport).forEach(([key, value]) => {
      var cell = tbody.append("td");
      console.log(key, value);
      cell.text(cellText(key, value));
      if (key == "city" && !cities.includes(value))
      {
        cities.push(value);
      }
      if (key == "state" && !states.includes(value))
      {
        states.push(value);
      }
      if (key == "country" && !countries.includes(value))
      {
        countries.push(value);
      }
      if (key == "shape" && !shapes.includes(value))
      {
        shapes.push(value);
      }
    });
  });

// sort selection lists and insert into select tags

cities.sort();
console.log("cities");
console.log(cities);

cities.forEach((value) => {
  var opt = selectCity.append("option");
  opt.attr("value", titleCase(value));
  opt.text(titleCase(value));
});

states.sort();
console.log("states");
console.log(states);

states.forEach((value) => {
  var opt = selectState.append("option");
  opt.attr("value", value.toUpperCase());
  opt.text(value.toUpperCase());
});

countries.sort();
console.log("countries");
console.log(countries);

countries.forEach((value) => {
  var opt = selectCountry.append("option");
  opt.attr("value", value.toUpperCase());
  opt.text(value.toUpperCase());
});

shapes.sort();
console.log("shapes");
console.log(shapes);

shapes.forEach((value) => {
  var opt = selectShape.append("option");
  opt.attr("value", value);
  opt.text(value);
});


function clearTable() {
  tbody.html("");
};

// refresh the table based on filtered data
function refresh(refreshData) {
    clearTable();
    refreshData.forEach((ufoReport) => {
        var row = tbody.append("tr");
        Object.entries(ufoReport).forEach(([key, value]) => {
          var cell = tbody.append("td");
          cell.text(cellText(key, value));
        });
      });
};

// Select the submit button
var submit = d3.select("#filter-btn");

submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the field and get the raw HTML node
  var dateTimeField = d3.select("#datetime");
  var cityField = d3.select("#city");
  var stateField = d3.select("#state");
  var countryField = d3.select("#country");
  var shapeField = d3.select("#shape");

  // Get the value property of the input element
  var dateTimeValue = dateTimeField.property("value");
  var cityValue = cityField.property("value");
  var stateValue = stateField.property("value");
  var countryValue = countryField.property("value");
  var shapeValue = shapeField.property("value");

  console.log('dateTimeValue:' + dateTimeValue);
  console.log('cityValue:' + cityValue);
  console.log('stateValue:' + stateValue);
  console.log('countryValue:' + countryValue);
  console.log('shapeValue:' + shapeValue);
  console.log('tableData:');
  console.log(tableData);

  // filter data
  if (dateTimeValue == "")
  {
    var filteredData = tableData;
  }
  else
  {
    var filteredData = tableData.filter(sighting => sighting.datetime === dateTimeValue);
  };
  if (cityValue != "")
  {
    filteredData = filteredData.filter(sighting => sighting.city.toUpperCase() === cityValue.toUpperCase());
  }  
  if (stateValue != "")
  {
    filteredData = filteredData.filter(sighting => sighting.state.toUpperCase() === stateValue.toUpperCase());
  }  
  if (countryValue != "")
  {
    filteredData = filteredData.filter(sighting => sighting.country.toUpperCase() === countryValue.toUpperCase());
  }  
  if (shapeValue != "")
  {
    filteredData = filteredData.filter(sighting => sighting.shape.toUpperCase() === shapeValue.toUpperCase());
  }  

  console.log(filteredData);

  refresh(filteredData);
});
