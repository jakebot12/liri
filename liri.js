//initialize variables
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var https = require("https");
var queryEntry = process.argv[3];
var Spotify = require("node-spotify-api");
var spotify = new Spotify({
  id: "1614bc440f4948d8894916b6018691d5",
  secret: "20c17c8313b34f9383b113aa07496b5e"
});

//create function to grab text from file 'random.txt' and use it as the input for spotify-this-song.
var textGetter = function() {
  var fs = require("fs");
  var array1 = fs
    .readFileSync("random.txt")
    .toString()
    .split(",");
  for (i in array1) {
    //console.log(array1[i]);
    queryEntry = array1[1];
  }
  console.log("The song you have stored in file 'random.txt' = " + queryEntry);
  spotifyRequest(); 
};

//create a function to handle requests to SpotifyAPI.
var spotifyRequest = function(song = "The Sign - Ace of Base") {
  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    //console.log(data.tracks.items[0]);
    console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
    console.log("Album Name: " + data.tracks.items[0].album.name);
  });
};

//a script to run if there is no input chosen for the movie search.
var consoleScript = function() {
  console.log("-------------------------");
  console.log(
    "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/"
  );
  console.log("It's on Netflix!");
  console.log("-------------------------");
  movieRequest();
};

//create a function to handle movie requests from OMDB API.
var movieRequest = function(movie = "Mr. Nobody") {
  axios
    .get("https://www.omdbapi.com/?t=" + movie + "&y=short&apikey=trilogy")
    .then(function(response) {
      //console.log(response);
      console.log("Movie Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);

      //loop for finding the correct rating for Rotten Tomatoes in the [Ratings] object(they're not always in the same index position).
      for (i = 0; i < response.data.Ratings.length; i++) {
        var rottenTomatoesRating = response.data.Ratings[i].Value;
        if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
          console.log("Rotten Tomatoes Rating: " + rottenTomatoesRating);
        } else {
          rottenTomatoesRating = "This rating is uvailable for this selection.";
        }
      }
      console.log("Country where Produced: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Acting Cast: " + response.data.Actors);
    })
    .catch(function(err) {
      console.error("Error occurred: " + err);
    });
};

//create a function for handling the Bands in Town concert finder API.
var axiosCall = function(artists = "Metallica") {
  //axios = require("axios");
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artists +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      //console.log(response);
      console.log(artists);
      console.log("Venue Name: " + response.data[0].venue.name);
      console.log(
        "General Venue Location: " +
          response.data[0].venue.city +
          ", " +
          response.data[0].venue.country
      );
    });
};

//logical case statements handling the CLI functions.
if (process.argv[2] === "concert-this") {
  axiosCall(queryEntry);
} else if (process.argv[2] === "spotify-this-song") {
  spotifyRequest(queryEntry);
} else if (process.argv[2] === "movie-this" && queryEntry === undefined) {
  consoleScript();
} else if (process.argv[2] === "movie-this") {
  movieRequest(queryEntry);
} else if (process.argv[2] === "do-what-it-says") {
  textGetter();
} else {
  console.log("I'm sorry, I didn't recognise that request.");
}
