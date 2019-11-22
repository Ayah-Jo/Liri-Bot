require("dotenv").config();
//Add the code required to import the keys.js file and store it in a variable.
let keys = require("./keys");
let axios = require("axios");
let moment = require("moment");
let Spotify = require("node-spotify-api");
let fs = require("fs");
let spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
});
// let defaultSong = require("The Sign");
let defaultMovie = "Mr. Nobody";
// let spotify = new Spotify(keys.spotify);



/**
 * Name of the venue
Venue location
Date of the Event (use moment to format this as "MM/DD/YYYY")
 */
let action = process.argv[2];
let value = process.argv[3];

switch (action) {
    case "concert-this":
        getBands(value)
        break;
    case "spotify-this-song":
        //If user has not specified a song , use default
        // if (value === "") {
        //   value = defaultSong;
        // }
        getSongs(value)
        break;
    case "movie-this":
        //If user has not specified a movie , use default
        if (value == "") {
            value = defaultMovie;
        }
        getMovies(value)
        break;
    case "do-what-it-says":
        doWhatItSays()
        break;
    default:
        break;
}

function getBands(artist) {
    // let artist = value;
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("Name of the venue:", response.data[0].venue.name);
            console.log("Venue location:", response.data[0].venue.city);
            let eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log("Date of the Event:", eventDate);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getSongs(songName) {
    // let songName = value;

    //If user has not specified a song , default to "The Sign" by Ace of Bass
    if (songName === "") {
        songName = "I Saw the Sign";
    }

    spotify.search({
        type: 'track',
        query: songName
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // else {
        //   console.log("Not right now. Later?")

        // console.log(JSON.stringify(data)); 

        // The song's name

        //Artist(s)
        console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
        // A preview link of the song from Spotify
        console.log("Preview Link: ", data.tracks.items[0].preview_url)
        // The album that the song is from
        console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}

function getMovies(movieName) {
    // let movieName = value;
    axios.get("http://www.omdbapi.com/?apikey=42518777&t=" + movieName)
        .then(function (data) {
            // console.log(data.data); 
            let results = `
      Title of the movie: ${data.data.Title}
      Year the movie came out: ${data.data.Year}
      IMDB Rating of the movie: ${data.data.Rated}
      Rotten Tomatoes Rating of the movie: ${data.data.Ratings[1].Value}
      Country where the movie was produced: ${data.data.Country}
      Language of the movie: ${data.data.Language}
      Plot of the movie: ${data.data.Plot}
      Actors in the movie: ${data.data.Actors}`;
            console.log(results)

            // console.log(data);
            // console.log("Name of the venue:", response.data[0].venue.name);
            // console.log("Venue location:", response.data[0].venue.city);
            // let eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            // console.log("Date of the Event:", eventDate);
        })
        .catch(function (error) {
            console.log(error);
        });
    //Response if user does not type in a movie title
    if (movieName === "Mr. Nobody") {
        console.log("-----------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    };
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        data = data.split(",");
        let action = data[0]
        let value = data[1]
        // getSongs(value)
        switch (action) {
            case "concert-this":
                getBands(value)
                break;
            case "spotify-this-song":
                getSongs(value)
                break;
            case "movie-this":
                getMovies(value)
                break;
            default:
                break;
        }
    });
}