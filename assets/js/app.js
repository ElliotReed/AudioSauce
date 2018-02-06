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

// Variable for Firebase
var database = firebase.database();

// Initialize global variable
var weatherCondition;
var geolocationAllowed = false;
var userLatitude; 
var userLongitude; 
var weatherFromCoordinates;
var weatherSearchString;
var userCity = "";
var userZipcode = "";
var cityName; // Retrieved from API

// Running on page load
$(document).ready(function(){
  getLocation();
});

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
  geolocationAllowed = true;
  $("#location-input-container").hide();
  console.log("Latitude: " + userLatitude + " Longitude: " + userLongitude);
  weatherSearchString = "?lat=" + userLatitude + "&lon=" + userLongitude;
  getWeather();
}

// Location error
function geoError() {
  // If location access is denied
  $("#location-input-container").show();
  // alert("Geocoder failed.");
}
// End location --------------------------------------------


// Wrapper for API call --------------------------------------------
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
  // console.log(response);
  cityName = response.name;
  $("#city-name").text(cityName);
  weatherCondition = response.weather[0].main;
  var weatherDescription = response.weather[0].description;
  getBackgroundImage(weatherDescription);
  // console.log(weatherDescription);

}); // End ajax
} // End getWeather ------------------------------------------------------

// Button event for name and/or location ---------------------------
$("#submit-button").on("click", function(event) {
  event.preventDefault();
  // Test for username input
  var usernameInput = $("#username-input").val().trim();

  if (usernameInput === "") {
    $("#username-input").addClass("error");
    alert("You must enter your name.");
    return;
  } 

  if (!geolocationAllowed) {
    // Test for user location input
    userCity = $("#city-input").val().trim();
    userZipcode = $("#zipcode-input").val().trim();
    if ((userCity !== "") || (userZipcode !== "")) {
      if (userZipcode !== ""){
        weatherSearchString = "?zip=" + $("#zipcode-input").val().trim();
      } else {
        weatherSearchString = "?q=" + $("#city-input").val().trim();
      }
    } else {
      $("#city-input").addClass("error");
      $("#zipcode-input").addClass("error");
      alert("You must enter a location.");
      return;
    }
  }
  // Successfull! close opening screen and get weather
  $(".information-input").addClass("scale-out");
  getWeather();
}); // End submit ----------------------------------------------------------------

// Display messages
function displayMessages(messages) {
  $("#messages").text(message);
}

// Check database and display comments
database.ref().on("value", function(dataSnapshot) {
  var username = dataSnapshot.user.val();
  var comment = dataSnapshot.comment.val(); 
  console.log(username);
  var commentDiv = $("<div>");
  var commentParagraph = $("<p>" + username + ": " + comment + "</p>");
  commentDiv.append(commentParagraph);
  // $("#comment-container").prepend(commentDiv);
})

// Submit comment
$("#submit-comment").on("click", function(event) {
  event.preventDefault();
  database.ref().push({
    username: usernameInput,
    comment: userComment
  })
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// Wrapper for the Giphy call
function getBackgroundImage(weatherDescription) {
 // Create query request
 var giphyAPIKey = "&api_key=aPXKMDgpfICV4wcHOcnFcWS0Tqgr0w8C";
 var giphySiteString = "https://api.giphy.com/v1/gifs/";
 var giphySearchString = "search?q=weather+evening" + weatherDescription;
 var giphyLimit = "&limit=1";
 var giphyQueryURL = giphySiteString + giphySearchString + giphyAPIKey + giphyLimit; 

 $.ajax({
   url: giphyQueryURL,
   method: "GET"
 }).then(function(response) {
    console.log(response.data[0].images.original.url);
    var htmlBackground = "url(" + response.data[0].images.original.url + ") no-repeat center center fixed";
    $("html").css({background : htmlBackground});
 })
}