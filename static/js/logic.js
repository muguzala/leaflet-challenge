// API URL for earthquake data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data from the API
d3.json(queryUrl).then(function(earthquakeData) {
  console.log(earthquakeData);
  createFeatures(earthquakeData.features);
});

// Create markers whose size increases with magnitude and color with depth
function createMarker(feature, latlng) {
  return L.circleMarker(latlng, {
    radius: markerSize(feature.properties.mag),
    fillColor: markerColor(feature.geometry.coordinates[2]),
    color:"#000",
    weight: 0.5,
    opacity: 0.5,
    fillOpacity: 1
  });
}

// Create GeoJSON features and add them to the map
function createFeatures(earthquakeData) {
  // Function to run for each feature in the features array
  function onEachFeature(feature, layer) {
    // Popup content for each earthquake marker
    layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
  }

  // Create a GeoJSON layer with the earthquake data
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarker
  });

  // Create the map with the base layer and earthquake layer
  createMap(earthquakes);
}

// Create the map with base layers and overlay layers
function createMap(earthquakes) {
  // Create the base layer (Street Map)
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create the map and set the initial view
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create the control for layer selection
  let baseMaps = {
    "Street Map": street
  };

  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create the legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 60, 90],
        labels = [],
        legendInfo = "<h5>Magnitude</h5>";

    // Loop through the grades to generate legend colors and labels
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  // Add the legend to the map
  legend.addTo(myMap);
}

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 5;
}
//#F06A6A', '#F0A76A', '#F3B94C', '#F3DB4C', '#E1F34C', '#B6F34C'

// Function to determine
function markerColor(depth) {
  return depth > 90 ? '#F06A6A' :
    depth > 70 ? '#F0A76A' :
    depth > 50 ? '#F3B94C' :
    depth > 30 ? '#F3DB4C' :
    depth > 10 ? '#E1F34C' :
    '#B6F34C';
}