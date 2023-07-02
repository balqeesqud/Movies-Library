'use strict';

const express = require('express');
const movieData = require('./Movie Data/data.json'); // importing data from json file and save it in a variable
const cors = require('cors');
const app = express();
const axios = require('axios');
require('dotenv').config();

const pg = require('pg'); // pg client library for databases.
app.use(cors()); // who can touch the server
app.use(express.json()); // extracting info from a JSON written in the body and convert it into a JavaScript object

let PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL); // Connecting data base then connect to server

///////////////////////////////////////////////////////////
// ReST APIs

// Deleting movie from database using (delete) & params
app.delete('/delete/:id', (req, res) => {
  try {
    let idParam = req.params.id;
    let sql = `DELETE FROM movies WHERE id=${idParam}`;
    client.query(sql).then(() => {
      // res.status(200).send(`movie ${idParam} deleted`);
      res.status(204).end(); // (204) status wont send anything since is a delete req.
    });
  } catch (error) {
    res.status(500).send('An error occurred while deleting the movie ' + error);
  }
});

// Update a comment in database using (put) & params
app.put('/update/:id', (req, res) => {
  try {
    let idParam = req.params.id;
    let { newcomment } = req.body;

    let sql = `UPDATE movies SET comment = $1 WHERE id=${idParam}`;

    client.query(sql, [newcomment]).then((movieData) => {
      res.status(200).send('Your comment is updated');
    });
  } catch (error) {
    res
      .status(500)
      .send('An error occurred while updating the comment' + error);
  }
});

// Get movie from the database using (get)  & params
app.get('/getMovie/:id', (req, res) => {
  try {
    let id = req.params.id;
    let sql = `SELECT * FROM movies WHERE id=${id};`;
    client.query(sql).then((moviesData) => {
      res.status(200).send(moviesData.rows);
    });
  } catch (error) {
    res
      .status(500)
      .send('An error ocurred while getting the required movie' + error);
  }
});

///////////////////////////////////////////////////////////

app.get('/getMovies', (req, res) => {
  // to get all movies inserted into movies table in the movieslibrary database
  let sql = `SELECT * FROM movies`;
  client.query(sql).then((moviesData) => {
    res.status(200).send(moviesData.rows);
  });
});

// Adding Route using post
app.post('/addMovie', (req, res) => {
  let movieTitle = req.body.movieTitle; // requesting the keys in the body
  let release_year = req.body.year; // these are columns
  let overView = req.body.overView;
  let comment = req.body.comment;

  // or using destructuring
  // let { movieTitle,release_year,overView,comment} = req.body;

  //insert into should match with the created schema file
  let sql = `INSERT INTO movies(title, release_year,overView,comment) values ($1,$2,$3,$4)`; //(Insert)columns names with values should match schema
  client.query(sql, [movieTitle, release_year, overView, comment]).then(() => {
    // from the req.body
    // ordering important
    //we use to do CRUD (client.query)
    res.status(201).send(`Movie ${movieTitle} added to database`); // add new data use status 201
  });
});

client.connect().then(() => {
  // connect to database then run the server
  app.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
  });
});

//Routes
app.get('/', handleHome);
app.get('/favorite', handleFavorite);

//Handlers Functions
function handleHome(req, res) {
  let movie = new HomeMovie( //added as a harden copy
    movieData.title,
    movieData.poster_path,
    movieData.overview
  );

  // (/d movies to show the columns inside the movies table using postgressql server)

  res.json(movie); //to convert it into JSON-formatted response. ({"key":"pair"})
}

function handleFavorite(req, res) {
  res.send('Welcome to our Favorite page');
}

app.get('/trending', async (req, res) => {
  let axiosRespone = await axios.get(
    // API Key (created from TMDB) added using ${} with back-tic with declaring "dotenv" above.
    `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.SECERT_API}&language=en-US`
  );
  // res.send(axiosRespone.data);

  let arrayData = axiosRespone.data['results'];
  let trendingMovies = [];
  for (let i = 0; i < arrayData.length; i++) {
    let mov = {
      //grouping data in group value pairs
      id: arrayData[i].id,
      title: arrayData[i].title,
      release_date: arrayData[i].release_date,
      poster_path: arrayData[i].poster_path,
      overview: arrayData[i].overview,
    };
    trendingMovies.push(mov);
  }
  res.send(trendingMovies);
});

app.get('/search', async (req, res) => {
  let searchArr = [];
  let movieName = req.query.name;
  let axiosRespone = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.SECERT_API}&language=en-US&query=${movieName}&page=2`
  );
  let searchArray = axiosRespone.data['results'];
  let movieSearchArr = searchArr.map((x) => {
    return {
      id: x.id,
      title: x.title,
      poster_path: x.poster_path,
      release_date: x.release_date,
      overview: x.overview,
    };
  });
  res.send(movieSearchArr);
});

app.get('/top_rated', async (req, res) => {
  let axiosRespone = await axios.get(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.SECERT_API}&language=en-US&page=1`
  );
  let topRatedArr = axiosRespone.data['results'];
  let ratedMovies = topRatedArr.map((item) => {
    return {
      id: item.id,
      title: item.title,
      vote_average: item.vote_average,
      release_date: item.release_date,
      overview: item.overview,
    };
  });
  res.send(ratedMovies);
});

app.get('/tv_list', async (req, res) => {
  let axiosRespone = await axios.get(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.SECERT_API}&language=en-US&page=1`
  );

  let tvArray = axiosRespone.data['genres'];
  let tvListArr = tvArray.map((x) => {
    return {
      id: x.id,
      name: x.name,
    };
  });
  res.send(tvListArr);
});

//constructor function                 ( since the response example look like json map )
function HomeMovie(title, poster_path, overview) {
  //form to be followed for other movies
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

// handleNotFound(req, res)  here is a middleware
app.use((req, res, next) => {
  res.status(404).send({
    // we can use .json or .send
    status: 404,
    responseText: 'Page not found',
  });
});

// {

// Server Error(4 parameters)  here is a middleware
app.use((err, req, res, next) => {
  res.status(500).send({
    // we can use .json or .send
    status: 500,
    responseText: 'Sorry, something went wrong',
  });
});

// Starting the server handler

// app.listen(PORT, startingLog);

// function startingLog(req, res) {
//   console.log('Running at 3000');
// }
