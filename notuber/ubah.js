var myLat = 0;
var myLng = 0;
// var me = new google.maps.LatLng(myLat, myLng);

var marker;
// var infowindow = new google.maps.InfoWindow();


function requestData(self) {
	request = new XMLHttpRequest();
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			console.log("hey");
			msg = document.getElementById("json_data");
			ride_data = JSON.parse(request.responseText);
			console.log(ride_data);
			_msg = ""

			for (i = 0; i < ride_data.length; i++) {
				_msg += ride_data[i].content;
				console.log(ride_data[i].content)
			}
			msg.innerHTML = _msg;
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
    });
    // icons = {
    //   passenger: {
    //   },
    //   vehicle: {
    //   },
    //   self: {
    //   }
    // },
    self = {
      username: 'HTRHha9MYl',
      lat: 0,
      lng: 0,
      position: new google.maps.LatLng(0, 0),
      type: "self"
    };
    getMyLocation(map, self);
}

function getMyLocation(map, self) {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			self.lat = position.coords.latitude;
			self.lng = position.coords.longitude;
			self.position = new google.maps.LatLng(self.lat, self.lng);
			renderMap(map, self);
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap(map, self) {
	// Update map and go there...
	map.panTo(self);
	
	// Create a marker
	marker = new google.maps.Marker({
		position: self,
		title: "Here I Am!"
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
	requestData(self);
}