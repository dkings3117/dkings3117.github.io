// Function to determine marker size based on magnitude
function markerSize(mag) {
  return Math.sqrt(mag * 100000);
}

// Function to determine marker color based on magnitude
function getColor(d) {
  return d >= 10000000 ? '#800026' :
         d >= 1000000  ? '#BD0026' :
         d >= 100000  ? '#E31A1C' :
         d >= 10000  ? '#FC4E2A' :
         d >= 1000   ? '#FD8D3C' :
         d >= 100   ? '#FEB24C' :
         d >= 10   ? '#FED976' :
                    '#FFEDA0';
}

// Store our API endpoint inside queryUrl
var queryUrl =
  "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  createMap(data.features);
});

function createMap(covid19Data) {

  // Define variables for our base layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define arrays to hold created case markers
  var caseMarkers = [];
  var total_recovered = 0;

  for (var i = 0; i < covid19Data.length; i++) {
    // console.log(i);
    if (covid19Data[i].geometry)
    {
      var latitude = covid19Data[i].geometry.coordinates[1];
      var longitude = covid19Data[i].geometry.coordinates[0];
      var mag = covid19Data[i].properties.Confirmed;
      total_recovered += covid19Data[i].properties.Recovered;
      var deaths = covid19Data[i].properties.Deaths;
      var fillColor = getColor(mag);
      caseMarkers.push(
        L.circle([latitude, longitude], {
          stroke: false,
          fillOpacity: 0.75,
          color: fillColor,
          fillColor: fillColor,
          radius: markerSize(mag)
        }).bindPopup("<h3>" + covid19Data[i].properties.Combined_Key +
          "</h3><hr><p>" + "(" + i + ") " + new Date(covid19Data[i].properties.Last_Update) +
           ", confirmed: " + mag + ", deaths: " + deaths + "</p>")
      );
    }
  }
  console.log(total_recovered);
  
  var cases = L.layerGroup(caseMarkers);

  // Create a baseMaps object
  var baseMaps = {
    "Streets": streetmap,
    "Light": lightmap,
    "Dark": darkmap,
    "Outdoors": outdoormap,
    "Satellite": satellitemap
  };

  // Create an overlay object
  var overlayMaps = {
    // "Heat Map": cases,
    "Markers": cases
  };
  
  // Define a map object
  var myMap = L.map("map", {
    center: [38.09, -95.71],
    zoom: 5,
    layers: [streetmap, cases]
  });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 10, 100, 1000, 10000, 100000],
        labels = [];
  
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<b style="background:' + getColor(magnitudes[i] + 1) + '">&nbsp;&nbsp;&nbsp;&nbsp;</b> ' +
          magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + (magnitudes[i + 1]-1) + '<br>' : '+');
    }
  
    return div;
  };
  
  legend.addTo(myMap);  
}
