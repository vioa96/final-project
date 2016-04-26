var dataset = 'https://raw.githubusercontent.com/vioa96/final-project/master/Farmers_Markets.geojson';
var layerUrl = 'https://viola96.cartodb.com/api/v2/viz/ac76eb7a-fb43-11e5-aee9-0e674067d321/viz.json';

var map = L.map('map', {
  center: [20, 0],
  zoom: 2
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);


// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polyline: false,
    polygon: false,
    circle: false
  }
});

var drawnLayerID;
map.addControl(drawControl);
map.on('draw:created', function (e) {
  var type = e.layerType;
  var layer = e.layer;

  if (type === 'marker') {
    nClosest(layer._latlng,5);
  } else if (type === 'rectangle') {
    pointsWithin(layer._latlngs);
  }

  if (drawnLayerID) { map.removeLayer(map._layers[drawnLayerID]); }
  map.addLayer(layer);
  drawnLayerID = layer._leaflet_id;
});



// Use of CartoDB.js
cartodb.createLayer(map, layerUrl)
  .addTo(map)
  .on('done', function(layer) {
    layer.on('featureClick', function(e, latlng, pos, data) {
      nClosest(latlng[0], latlng[1], 10);
      console.log(e, latlng, pos, data);
    });
  }).on('error', function(err) {
    console.log('error: ' + err);
  });
