var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
  // Create new map
	// Set map's center to Philadelphia
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.9524, lng: -75.1636},
    zoom: 4,
		mapTypeControl: false
  });

  // Set initial locations for cheesesteak spots
  var locations = [
    {title: "Steve's Prince of Steaks", location: {lat: 40.045603, lng: -75.060888}},
    {title: "Jim's Steaks", location: {lat: 39.941556, lng: -75.149310}},
    {title: "Delassandro's Steaks", location: {lat: 40.029478, lng: -75.205988}},
    {title: "Rocky's Glenside", location: {lat: 40.100190, lng: -75.152634}},
    {title: "Talk of the Town", location: {lat: 39.912618, lng: -75.172882}},
		{title: "Pat's King of Steaks", location: {lat: 39.933191, lng: -75.159235}},
		{title: "Geno's Steaks", location: {lat: 39.933824, lng: -75.158839}},
		{title: "Tony Luke's", location: {lat: 39.914103, lng: -75.148756}}
  ];

	// Create new infowindow
	// Create bounds variable
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Use location array to initialize markers
  for (var i = 0; i < locations.length; i++) {
    // Update position and title from each location within array
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker for the current location
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

    // Push (add) the marker to our array of markers.
    markers.push(marker);

    // Create a click event on markers which opens an infowindow for selected marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
	// Ensures that all markers are visible when map is initialized
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
