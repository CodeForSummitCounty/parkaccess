/* Map base layer 
========================================*/

$(document).ready(function() {
  var map = L.map('map', {
    center: [41.241667, -81.549722],
    zoom: 12
  });

  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);

  cartodb.createLayer(map, {
    type: 'cartodb',
    options: {
      table_name: 'census_blocks',
      user_name: 'cfsc'
    }
  }).done(function(layer) {
    map.addLayer(layer);
  });
  cartodb.createLayer(map, {
    type: 'cartodb',
    options: {
      table_name: 'cvnp_trails',
      user_name: 'cfsc'
    }
  }).done(function(layer) {
    map.addLayer(layer);

  });   

});


/* Get List of Parks
========================================*/
/*
$()

function listparks () {

}

listparks

$(".Cuyahoga")
$(".CVNP")
$(".Summit")

/* Accordion List
========================================*/

$(document).ready(function() {
  $('.Summit-parks').hide();
  $('.CVNP-parks').hide();
  $('.Cuyahoga-parks').hide();
  // $( "#accordion-menu-item2").accordion({collapsible: true, autoHeight: false}); 

  // $.ajax({
  //   url: "http://api.census.gov/data/2010/sf1?get=P0010001&for=state:*&key=c494feb17269e3f3e0bba78162e9d8d260d7c406",
  //   success: function(data) {
  //     $('#map_div').html(data);
  //   },
  //   error: function() {
  //     console.log("error")
  //   }
  // });

  $('.showhide').change(function() {
    if ($('#' + this.id).is(':checked')) {
      $("." + this.id + "parks").show();
    } else {
      $("." + this.id + "parks").hide();
    }
  });

  $("#measure-button").click(function() {
    if ($("#checkboxOneInput").is(':checked')) {
      var metroParkNames = getMetroparkList();

    }
  });

  var endpoint = "http://cfsc.cartodb.com/api/v2/sql/";

  getTractsWithinDistanceOfMetroPark("Springfield Bog");
  getMetroparkList();

  // this just gets the list of MPSSC parks. add something below to do something with it
  function getMetroparkList() {

    var park_names = [];
    var mp_list_query = "select name from mpssc_parks";
    var calldata = {
      q: mp_list_query
    };
    var request = $.ajax({
      url: endpoint,
      data: calldata
    }).done(function(response, textStatus, errorThrown) {
      $.each(response.rows, function(index, val) {
        park_names.push(val.name);
      });
      console.log(park_names);
      // call something to fill out list of parks here
      // NOTE: longer park names are truncated
    });
  }

  var currentBlockLayer;

  // WARNING: this doesn't work here: "cartodb.js can't guess the map type"
  // For some confounding reason it almost works when I stick
  // it into the first ready() block, but the query is slower than molasses in something frozen.
  // Don't know if the speed is a cartodb problem or something else.
  function getTractsWithinDistanceOfMetroPark(metroParkName) {
    var distance = 1000; // in meters
    var mp_dist_query = "select ST_Distance_Sphere(mpssc_parks.the_geom, census_blocks.the_geom) " + 
      "as distance, " +
      "mpssc_parks.name, " +
      "census_blocks.* " +
      "from census_blocks, mpssc_parks " +
      "where ST_Distance_Sphere(mpssc_parks.the_geom, census_blocks.the_geom) " +
      "< " + distance + " and " +
      "mpssc_parks.name = 'Springfield Bog' " +
      "order by distance";

    if (currentBlockLayer) {
      cartodb.removeLayer(currentBlockLayer);
    }

    cartodb.createLayer(map, {
      type: 'cartodb',
      options: {
        table_name: 'census_blocks',
        user_name: 'cfsc',
        query: mp_dist_query
      }
    }).done(function(layer) {
      console.log("done");
      currentBlockLayer = layer;
      map.addLayer(layer);
    }).error(function(error) {
      console.log("error");
      console.log(error);
    });

  }
});


