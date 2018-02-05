// Initialize Firebase
var config = {
  apiKey: "AIzaSyCvpTUzbU9prXZLDP9BtwBE1viuztTbt0k",
  authDomain: "audiosauce-6eb52.firebaseapp.com",
  databaseURL: "https://audiosauce-6eb52.firebaseio.com",
  projectId: "audiosauce-6eb52",
  storageBucket: "",
  messagingSenderId: "266026610182"
};
firebase.initializeApp(config);

// Initialize global variable
var userLatitude; 
var userLongitude; 
var weatherFromCoordinates;
var weatherSearchString;
var userCity = "";
var userZip = "";

// Running on page load
getLocation();

// Get location data ----------------------------

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    alert("Geolocation is not supported by this browser");
  }
}

// Location success
function geoSuccess(position) {
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;
  console.log("Latitude: " + userLatitude + " Longitude: " + userLongitude);
  weatherSearchString = "?lat=" + userLatitude + "&lon=" + userLongitude;
  getWeather();
}

// Location error
function geoError() {
  // If location access is denied
  $("#location-input-container").show();
  alert("Geocoder failed.");
}
// End location --------------------------------------------


// Wrapper for API call
function getWeather() {
// Setup for weather API call
var weatherAPIKey = "&APPID=4aa09d0ed51ac90ebeb79c63e62ba521";
var weatherSiteString = "http://api.openweathermap.org/data/2.5/weather";

var weatherQueryURL = weatherSiteString + weatherSearchString + weatherAPIKey;

// Weather API call
$.ajax({
  url: weatherQueryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
}); // End ajax
} // End getWeather

// Button event for name and/or location
$("#submit-button").on("click", function(event) {
  event.preventDefault();
  console.log(this);

    // Test for username input
  var usernameInput = $("username-input").val().trim();
  if (usernameInput === "") {
    alert("You must enter your name");
  } 
  // Test for user location input
  var userCity = $("#location-input").val().trim();
  var userZip = $("#location-input").val().trim();
  if ((userCity === "") && (userZip === "")) {
    
  }; 
  
  if (userZip !== ""){
    weatherSearchString = "?zip=" + $("#city-location").val().trim();
    
    
  };


  getWeather();

});

