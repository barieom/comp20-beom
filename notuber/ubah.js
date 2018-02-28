var myLat = 0;
var myLng = 0;
// var me = new google.maps.LatLng(myLat, myLng);

var marker;
var map;
// var infowindow = new google.maps.InfoWindow();
function setAllMarkers(self, data, icons, map) {
	var infowindow = new google.maps.InfoWindow(), i;
	function setMarker(data, type, icons, map) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.lng),
			icon: icons[type],
			title: "Here I Am!",
			map: map
		});

		var ctx = "";
		if (type == 'self') {
			ctx = data.username;
			console.log(data.username + " is my username");
			infowindow.setContent(ctx);
      		infowindow.open(map, marker);
		} else {
			ctx = data.username;
			console.log(data.username + " is their username");			
		}

		marker.addListener('click', function() { infowindow.setContent(ctx); infowindow.open(map, marker); });
	}

	setMarker(self, self.type, icons, map);
	//marker.setMap(map);

	if (ride_data.vehicles){
		for (i = 0; i < ride_data.vehicles.length; i++){
			setMarker(ride_data.vehicles[i], 'vehicle', icons, map);
		}
	}

	map.setCenter(self.position);
 	map.setZoom(15);
}



function requestData(self, icons, map) {
	request = new XMLHttpRequest();
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			msg = document.getElementById("json_data");
			ride_data = JSON.parse(request.responseText);
			msg.innerHTML = ride_data.vehicles;
			setAllMarkers(self, ride_data, icons, map);
		} else if (request.readyState === 4 && request.status !== 200) {
      		alert("Error: XML request went wrong.");
    	}
	}

	request.send("username=" + self.username + "&lat=" + self.lat + "&lng=" + self.lng);
}




function initMap() {
  "use strict";
  var mass = new google.maps.LatLng(42.4072, -71.3824),
  map = new google.maps.Map(document.getElementById('map'), {
      center: mass,
      zoom: 8
    }),
    self = {
      username: 'HTRHha9MYl',
      position: new google.maps.LatLng(0, 0),
      type: "self",
      lat: 0,
      lng: 0,
    },
    icons = {
      passenger: {
        url: "passenger.png",
        anchor: new google.maps.Point(15, 50)
        scaledSize: new google.maps.Size(25, 30),
        origin: new google.maps.Point(0, 0),
      },
      vehicle: {
        url: "car.png",        
        anchor: new google.maps.Point(25, 20)
        scaledSize: new google.maps.Size(25, 30),
        origin: new google.maps.Point(0, 0),
      },
      self: {
        url: "me.png",         
        anchor: new google.maps.Point(25, 20)
        scaledSize: new google.maps.Size(50, 40),
        origin: new google.maps.Point(0, 0),
      }
    };
    getMyLocation(map, self, icons);
}

function getMyLocation(map, self, icons) {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			self.lat = position.coords.latitude;
			self.lng = position.coords.longitude;
			self.position = new google.maps.LatLng(self.lat, self.lng);
			renderMap(map, self, icons);
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap(map, self, icons) {
	requestData(self, icons, map);
}