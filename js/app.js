var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.9524, lng: -75.1636},
    zoom: 13
  });

  // Set initial locations
  var locations = [
    {
        title: "Steve's Prince of Steaks",
        location: {
            lat: 40.045603,
            lng: -75.060888
        }
    },

    {
        title: "Jim's Steaks",
        location: {
            lat: 39.941556,
            lng: -75.149310
        }
    },

    {
        title: "Delassandro's Steaks",
        location: {
            lat: 40.029478,
            lng: -75.205988
        }
    },

    {
        title: "Rocky's Glenside",
        location: {
            lat: 40.100190,
            lng: -75.152634
        }
    },

    {
        title: "Talk of the Town",
        location: {
            lat: 39.912618,
            lng: -75.172882
        }
    }
  ];

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}
