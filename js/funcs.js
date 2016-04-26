function nClosest(point,n) {

  var sql = 'SELECT * FROM farmers_markets_copy ORDER BY the_geom <-> ST_SetSRID(ST_Point(' + point.lng + ',' + point.lat + '), 4326) LIMIT ' + n;
  console.log('https://viola96.cartodb.com/api/v2/sql/?q=' + sql);
  $.ajax('https://viola96.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    addRecords(results);
  });
}


function pointsWithin(rect) {
  var sw = rect[0];
  var ne = rect[2];

  var sql = 'SELECT * FROM farmers_markets_copy WHERE the_geom @ ST_MakeEnvelope(' +
    sw.lng + ','+ sw.lat + ',' + ne.lng + ',' + ne.lat + ', 4326)';
  console.log('https://viola96.cartodb.com/api/v2/sql/?q=' + sql);
  $.ajax('https://viola96.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    addRecords(results);
  });
}

 var sublayer;

 $( "#go" ).click(function() {
   var sql = "SELECT * FROM farmers_markets_copy WHERE (neighborhood= '" + $('#neighborhood-input').val() + "')";
   console.log(sql);
   $.ajax('https://viola96.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
     addRecords(results);
   });



   cartodb.createLayer(map, layerUrl)
     .addTo(map)
     .on('done', function(layer) {

       sublayer = layer.getSubLayer(1);
       sublayer.setSQL("SELECT * FROM farmers_markets_copy WHERE (neighborhood='" + $('#neighborhood-input').val() + "')");

       sublayer.on('featureClick', function(e, latlng, pos, data) {
       });
     }).on('error', function(err) {

     });

 });

 $( "#clear" ).click(function() {
   sublayer.remove();
 $('#project-list').text('');
 });

function addOneRecord(rec) {
  var title = $('<p></p>')
    .text('Farm Market nearby Neighorhood: ' + rec.neighborhood);

  var name = $('<p></p>')
    .text('Farm Market Name: ' + rec.name);

  var location = $('<p></p>')
    .text('Location: ' + rec.address);

  var time = $('<p></p>')
    .text('Open Date: ' + rec.months + ', '+rec.day+', '+rec.time);

  var way = $('<p></p>')
      .text('Public Transit: ' + rec.major_bus_subway_routes);


  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .append(title)
    .append(name)
    .append(location)
    .append(time)
    .append(way);

  $('#project-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#project-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}
