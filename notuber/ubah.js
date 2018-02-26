var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

function initMap() {
  "use strict";
  var mass = new google.maps.LatLng(42.4072, -71.3824),
    map = new google.maps.Map(document.getElementById('map'), {
      center: mass,
      zoom: 8
    });
    // icons = {
    //   passenger: {
    //   },
    //   vehicle: {
    //   },
    //   self: {
    //   }
    // },
    // self = {
    //   username: 'HTRHha9MYl',
    //   lat: 0,
    //   lng: 0,
    //   position: new google.maps.LatLng(0, 0),
    //   type: "self"
    // };
    getMyLocation();
}

function getMyLocation() {
	console.log("hey")
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);
	
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "Here I Am!"
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}