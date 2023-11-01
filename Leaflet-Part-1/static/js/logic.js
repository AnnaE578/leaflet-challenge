 // Create the base layers.
 let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [street, topo]
});

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// We make an AJAX call that retrieves our earthquake geoJSON data.
d3.json(queryUrl).then(function (earthquakeData) {
  console.log(earthquakeData)

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function colorFill(depth){
  // console.log(depth)
     switch (true) {
      case depth > 90:
        return "#191970";
      case depth > 70:
        return "#00008B";
      case depth > 50:
        return "#4169E1";
      case depth > 30:
        return "#0000FF";
      case depth > 20:
        return "#00BFFF"; 
      case depth > 10:
        return "#87CEFA"; 
      case depth > 0:
        return "#B0C4DE"; 
      default: return "#F0F8FF"
    }  
  }

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return{

    radius: getRadius(feature.properties.mag),
    fillColor: colorFill(feature.geometry.coordinates[2]),
    color: "#000000",
    weight: 0.5,
    opacity: 1,
    fillOpacity: 1
};}

 // Here we add a GeoJSON layer to the map once the file is loaded.
L.geoJSON(earthquakeData, {
  // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
     },

  // We set the style for each circleMarker using our styleInfo function.
     style:styleInfo,

  // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
onEachFeature: function(feature, layer) {
  layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
  }
}).addTo(myMap);

let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #191970"></i><span>>90</span><br>';
  div.innerHTML += '<i style="background: #00008B"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #4169E1"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #00BFFF"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #00BFFF></i><span>20-30</span><br>';
  div.innerHTML += '<i style="background: #87CEFA"></i><span>10-20</span><br>';
  div.innerHTML += '<i style="background: #B0C4DE"></i><span>0-10</span><br>';
  div.innerHTML += '<i style="background: #F0F8FF"></i><span>>0</span><br>';

  
  return div;
};

// Finally, we add our legend to the map.
legend.addTo(myMap); 
});
