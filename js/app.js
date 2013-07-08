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

  // cartodb.createLayer(map, {
  //   type: 'cartodb',
  //   options: {
  //     table_name: 'census_blocks',
  //     user_name: 'cfsc'
  //   }
  // }).done(function(layer) {
  //   map.addLayer(layer);
  // });
  cartodb.createLayer(map, {
    type: 'cartodb',
    options: {
      table_name: 'cvnp_trails',
      user_name: 'cfsc'
    }
  }).done(function(layer) {
    map.addLayer(layer);

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

  getTractsWithinDistanceOfMetroPark("Sand Run Metro Park");
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

  // In theory, this should create and display a CartoDB layer with the census blocks
  // that are within 2600 feet of the supplied SC Metro Park.
  // Not sure how to configure Cartodb to display the results of this query just yet, 
  // but it only takes a couple of seconds now.
  function getTractsWithinDistanceOfMetroPark(metroParkName) {
    var distance = 2600; // in feet
    var mp_dist_query = "select census_blocks.*, " + 
    "ST_Distance(ST_Transform(census_blocks.the_geom,3734),ST_Transform(mpssc_parks.the_geom,3734)) " + 
    "from census_blocks, mpssc_parks " + 
    "where mpssc_parks.name='" + metroParkName + "' " +
    "and ST_Distance(ST_Transform(census_blocks.the_geom,3734),ST_Transform(mpssc_parks.the_geom,3734)) " +
    " < " + distance;

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


