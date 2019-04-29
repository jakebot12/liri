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

var spotifyRequest = function(song = "The Sign Ace of Base") {
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

var consoleScript = function() {
  console.log("-------------------------");
  console.log(
    "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/"
  );
  console.log("It's on Netflix!");
  console.log("-------------------------");
  movieRequest();
};

var movieRequest = function(movie = "Mr. Nobody") {
  axios
    .get("https://www.omdbapi.com/?t=" + movie + "&y=short&apikey=trilogy")
    .then(function(response) {
      //console.log(response);

      //could't find the data for Rotten Tomatoes Ratings in the OMDB data object, so I entered the Metascore in this field for now, which uses the same scoring methods as Rotten Tomatoes, and is also statistically very congruent with it.

      console.log("Movie Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);

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

var axiosCall = function() {
  //axios = require("axios");
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        queryEntry +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      console.log("Venue Name: " + response.data[0].venue.name);
      console.log(
        "General Venue Location: " +
          response.data[0].venue.city +
          ", " +
          response.data[0].venue.country
      );
    });
};

//Add function for do-what-it-says

//doWhatItSays();
//add logic for do-what-it-says
if (process.argv[2] === "concert-this") {
  axiosCall();
} else if (process.argv[2] === "spotify-this-song") {
  spotifyRequest(queryEntry);
} else if ((process.argv[2] === "movie-this") && (queryEntry === undefined)) {
  consoleScript();
} else if (process.argv[2] === "movie-this") {
  movieRequest(queryEntry);
} else {
  console.log("I'm sorry, I didn't recognise that request.");
}
