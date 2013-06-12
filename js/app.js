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

//$(.)

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
  $( "#accordion-menu-item2").accordion({collapsible: true, autoHeight: false}); 
  
  // $.ajax({
  //   url: "http://api.census.gov/data/2010/sf1?get=P0010001&for=state:*&key=c494feb17269e3f3e0bba78162e9d8d260d7c406",
  //   success: function(data) {
  //     $('#map_div').html(data);
  //   },
  //   error: function() {
  //     console.log("error")
  //   }
  // });
  
  $('.showhide').change(function(){
    if($('#' + this.id).is(':checked')) {
        $("." + this.id + "parks").show(); 
    } else {
      $("." + this.id + "parks").hide(); 
    }
  });
});

