var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
  // Create new map
	// Set map's center to Philadelphia
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.9524, lng: -75.1636},
    zoom: 8,
		mapTypeControl: false
  });

  // Set initial locations for cheesesteak spots
  var locations = [
    {title: "Steve's Prince of Steaks", location: {lat: 40.045603, lng: -75.060888}, neighborhood: "Northeast"},
    {title: "Jim's Steaks", location: {lat: 39.941556, lng: -75.149310}, neighborhood: "Center City"},
    {title: "Delassandro's Steaks", location: {lat: 40.029478, lng: -75.205988}, neighborhood: "Roxborough"},
    {title: "Talk of the Town", location: {lat: 39.912618, lng: -75.172882}, neighborhood: "South Philadelphia"},
		{title: "Pat's King of Steaks", location: {lat: 39.933191, lng: -75.159235}, neighborhood: "Passyunk"},
		{title: "Geno's Steaks", location: {lat: 39.933824, lng: -75.158839}, neighborhood: "Passyunk"},
		{title: "Tony Luke's", location: {lat: 39.914103, lng: -75.148756}, neighborhood: "South Philadelphia"}
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
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><br><div id="pano">' + data.location.latLng + '</div>');
          var panoramaOptions = {
						navigationControl: false,
						addressControl: false,
						enableCloseButton: false,
						fullscreenControl: false,
						panControl: false,
						clickToGo: false,
						disableDefaultUI: true,
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 10
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}
