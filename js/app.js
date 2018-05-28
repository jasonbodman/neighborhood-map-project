// Creates a global map marker
var map;

// Creates a Global variable for all of the locations
var Location;

// Declaring Global clientID & secret for Foursquare API
var clientID;
var clientSecret;

// Create a global variable for last marker
var lastClickedMarker = null;
var openedInfoWindow = null;

// Default Locations that are displayed on the map
var defaultLocations = [
	{name: "Steve's Prince of Steaks", lat: 40.045603, long: -75.060888, neighborhood: "Northeast"},
	{name: "Jim's Steaks", lat: 39.941556, long: -75.149310, neighborhood: "Center City"},
	{name: "Delassandro's Steaks", lat: 40.029478, long: -75.205988, neighborhood: "Roxborough"},
	{name: "Talk of the Town", lat: 39.912618, long: -75.172882, neighborhood: "South Philadelphia"},
	{name: "Pat's King of Steaks", lat: 39.933191, long: -75.159235, neighborhood: "Passyunk"},
	{name: "Geno's Steaks", lat: 39.933824, long: -75.158839, neighborhood: "Passyunk"},
	{name: "Tony Luke's", lat: 39.914103, long: -75.148756, neighborhood: "South Philadelphia"}
];

//Set Google Maps style
var styles = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 33
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2e5d4"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5dac6"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5c6c6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e4d7c6"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbfaf7"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#acbcc9"
            }
        ]
    }
]


// Foursquare API data
Location = function(data) {
  var self = this;
  this.name = data.name;
  this.lat = data.lat;
  this.long = data.long;
	this.neighborhood = data.neighborhood;
  this.URL = '';
  this.street = '';
  this.city = '';
  this.phone = '';

  // Make sure all markers are visible by default
  this.visible = ko.observable(true);

	// Set Foursquare API details
	clientID = "U2HV0YOLPT2X5TDODTGJW4YFY4DB0SEXIUM1WI2VSFXK2C3M";
	clientSecret = "0X5PTPK5X3RVG3JE5T3SMC5W53X2V22KC4RZYZRPG2TRFXO2";

	// Set Foursquare API link
	 var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170413' + '&query=' + this.name;

	// Stores Foursquare data as its own variable
	$.getJSON(foursquareURL).done(function (data) {
		var results = data.response.venues[0];
		self.URL = results.url;
		if (typeof self.URL === 'undefined') {
				self.URL = "";
		}
		self.street = results.location.formattedAddress[0] || 'No Address Provided';
		self.city = results.location.formattedAddress[1] || 'No Address Provided';
		self.phone = results.contact.formattedPhone || 'No Phone Provided';
	}).fail(function () {
		$('.list').html('There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.');
	});

	// Set infoWindow content
	this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
		'<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
		'<div class="content">' + self.street + "</div>" +
		'<div class="content">' + self.city + "</div>" +
		'<div class="content">' + self.phone + "</div></div>"+
		'<br><div class="content">Information provided by <a href="http://www.foursquare.com">Foursquare</a>.</div></div>';

	// Place contentString inside of InfoWindow
	this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

	// Sets marker on map
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat, data.long),
		map: map,
		title: data.name
	});

	// Open marker when clicked and close previously opened markers
	this.marker.addListener('click', function(){
		// Close previously opened infoWindow
		if (openedInfoWindow) {
			openedInfoWindow.close();
		}

		// Set clicked marker as lastClickedMarker
		var cancelAnimation = function() {
			lastClickedMarker.setAnimation(null);
			lastClickedMarker = null;
		};

		//
		if (lastClickedMarker) {
			cancelAnimation();
		}

		// Set contentString with clicked marker info
		self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
				'<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
				'<div class="content">' + self.street + "</div>" +
				'<div class="content">' + self.city + "</div>" +
				'<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div>" +
				'<br><div class="content">Information provided by <a href="http://www.foursquare.com">Foursquare</a>.</div></div>';

		self.infoWindow.setContent(self.contentString);
		openedInfoWindow = self.infoWindow;

		// Set selected marker on map and animate
		self.infoWindow.open(map, self.marker);
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
				self.marker.setAnimation(null);
		}, 2100);
		lastClickedMarker = self.marker;

		google.maps.event.addListener(infoWindow, 'closeclick', cancelAnimation);
	});

	// Makes the marker bounce animation whenever clicked.
	this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};


/*******************************
Google Maps API
*******************************/
function ViewModel(){

	var self = this;

	// Holds value for list togglings
	this.toggleSymbol = ko.observable('hide');

	// Set search term to be blank by default
	this.searchTerm = ko.observable('');

	// Sets a blank array for locations
	this.locationList = ko.observableArray([]);

	// Create new map centered on Philadelphia's City Hall
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.9524, lng: -75.1636},
    zoom: 11,
 		mapTypeControl: false,
		styles: styles
  });

	// Pushes default locations array into new location list array
	defaultLocations.forEach(function(locationItem){
			self.locationList.push( new Location(locationItem));
	});

	// Searches for user input from search field using the locationlist array
	// Search will only display an exact match if available in the locationlist array
	this.filteredList = ko.computed( function() {
			var filter = self.searchTerm().toLowerCase();
			if (!filter) {
					self.locationList().forEach(function(locationItem){
							locationItem.visible(true);
					});
					return self.locationList();
			} else {
					return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
							var string = locationItem.name.toLowerCase();
							var result = (string.search(filter) >= 0);
							locationItem.visible(result);
							return result;
					});
			}
	}, self);
}

// Error handling if map doesn't load.
function errorHandlingMap() {
	$('#map').html('We had trouble connecting to Google Maps. Please refresh your browser and try again in a minute.');
}


// Function that starts process of loading map and locations
function startApp() {
	ko.applyBindings(new ViewModel());
}
