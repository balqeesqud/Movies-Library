'use strict';

const express = require('express');
const movieData = require('./Movie Data/data.json'); // importing data from json file and save it in a variable
const cors = require('cors');

const app = express();

app.use(cors()); // who can touch the server

// Error handling middleware
app.use(handleServerError);

//Routes
app.get('/', handleHome);
app.get('/favorite', handleFavorite);
app.get('*', handleNotFound);

//constructor function                 ( since the response example look like json map )

function HomeMovie(title, poster_path, overview) {
  //form to be followed for other movies
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

// {

//Handlers Functions
function handleHome(req, res) {
  let movie = new HomeMovie( //added as a harden copy
    movieData.title,
    movieData.poster_path,
    movieData.overview
  );

  res.json(movie); //to convert it into JSON-formatted response. ({"key":"pair"})
}

function handleFavorite(req, res) {
  res.send('Welcome to Favorite Page');
}

// Server Error
function handleServerError(err, req, res, next) {
  res.status(500).json({
    status: 500,
    responseText: 'Sorry, something went wrong',
  });
}

//Other Routes
function handleNotFound(req, res) {
  res.status(404).json({
    status: 404,
    responseText: 'Page not found',
  });
}

// Starting the server handler

app.listen(3001, startingLog);

function startingLog(req, res) {
  console.log('Running at 3001');
}
