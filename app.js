require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(expressLayouts);
('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (request, response) => {
  response.render('home.ejs');
});

app.get('/artist-search', (request, response) => {
  const { artist } = request.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const artists = data.body.artists.items;
      response.render('artist-search-results', { artists });
    })
    .catch(error => console.log('The error while searching artists occurred: ', error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));