const express = require('express');
const Router = express.Router();
const axios = require('axios');
const movieData = require('../Movie Data/data.json');
const { SECRET_API } = require('../config');

Router.get('/', handleHome);
Router.get('/favorite', handleFavorite);

//Handlers Functions
function handleHome(req, res, next) {
  try {
    let movie = new HomeMovie(
      movieData.title,
      movieData.poster_path,
      movieData.overview
    );
    res.json(movie);
  } catch (error) {
    next(`An error occurred while reaching Home Route: ${error}`);
  }
}
function handleFavorite(req, res) {
  res.send('Welcome to our Favorite page');
}

Router.get('/trending', async (req, res, next) => {
  try {
    let axiosRespone = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.SECRET_API}&language=en-US`
    );

    let arrayData = axiosRespone.data['results'];
    let trendingMovies = arrayData.map((element) => {
      return {
        id: element.id,
        title: element.title,
        release_date: element.release_date,
        poster_path: element.poster_path,
        overview: element.overview,
      };
    });
    res.send(trendingMovies);
  } catch (error) {
    next(`An error occurred while reaching favorite Route: ${error}`);
  }
});

Router.get('/search', async (req, res, next) => {
  try {
    let movieName = req.query.name;
    let axiosRespone = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.SECRET_API}&language=en-US&query=${movieName}&page=2`
    );
    let searchArray = axiosRespone.data['results'];
    let movieSearchArr = searchArray.map((x) => {
      return {
        id: x.id,
        title: x.title,
        poster_path: x.poster_path,
        release_date: x.release_date,
        overview: x.overview,
      };
    });
    res.send(movieSearchArr);
  } catch (error) {
    next(`An error occurred while searching for a movie: ${error}`);
  }
});

Router.get('/top_rated', async (req, res, next) => {
  try {
    let axiosRespone = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.SECRET_API}&language=en-US&page=1`
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
  } catch (error) {
    next(`An error occurred while looking for the top rated movies: ${error}`);
  }
});

Router.get('/tv_list', async (req, res, next) => {
  try {
    let axiosRespone = await axios.get(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.SECRET_API}&language=en-US&page=1`
    );

    let tvArray = axiosRespone.data['genres'];
    let tvListArr = tvArray.map((x) => {
      return {
        id: x.id,
        name: x.name,
      };
    });
    res.send(tvListArr);
  } catch (error) {
    next(`An error occurred while looking for tv lists: ${error}`);
  }
});

function HomeMovie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

module.exports = Router;
