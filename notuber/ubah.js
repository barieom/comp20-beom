function requestData(self, icons, map) {
	request = new XMLHttpRequest();
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			ride_data = JSON.parse(request.responseText);
			setAllMarkers(self, ride_data, icons, map);
		} else if (request.readyState === 4 && request.status !== 200) {
      		alert("XML request error");
    	}
	}

	request.send("username=" + self.username + "&lat=" + self.lat + "&lng=" + self.lng);
}

min_dist = Number.MAX_SAFE_INTEGER;
function setAllMarkers(self, data, icons, map) {
	infowindow = new google.maps.InfoWindow();
	if (ride_data.vehicles){
		for (i = 0; i < ride_data.vehicles.length; i++){
			setMarker(self, ride_data.vehicles[i], 'vehicle', icons, map);
		}
	} else if (ride_data.passengers) {
		for (i = 0; i < ride_data.passengers.length; i++) {
			setMarker(self, ride_data.passengers[i], 'passenger', icons, map);
		}
	}

	setMarker(self, self, self.type, icons, map);

	map.setCenter(self.position);
 	map.setZoom(15);
}

function setMarker(self, data, type, icons, map) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.lng),
			icon: icons[type],
			title: "Here I Am!",
			map: map
		});

		var dist = 0;
		var ctx = "";
		if (type != 'self') {
			dist = getDist(new google.maps.LatLng(self.lat, self.lng), new google.maps.LatLng(data.lat, data.lng));
			ctx  = data.username + "\n[Dist: " + dist + " miles]";
			if (dist < min_dist) {
				min_dist = dist;
			}
		} else {
			ctx = data.username + "\n[Closest dist: " + min_dist + " miles]";		
		}

		marker.addListener('click', function() { 
			infowindow.setContent(ctx); 
			infowindow.open(map, this); 
		});
	}



function initMap() {
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
      // passenger: {
      //   url: "passenger.png",
      //   scaledSize: new google.maps.Size(15, 30),
      // },
      vehicle: {
        url: "car.png",        
        scaledSize: new google.maps.Size(15, 30),
      },
      self: {
        url: "me.png",
        scaledSize: new google.maps.Size(50, 50),
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


function getDist(latLng1, latLng2) {
	return (0.000621371192 * google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2)).toFixed(2);
}