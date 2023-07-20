const express = require('express');
const Router = express.Router();
const client = require('../client');

// Adding Route using post
Router.post('/', (req, res, next) => {
  try {
    let movieTitle = req.body.movieTitle;
    let release_year = req.body.year;
    let overView = req.body.overView;
    let comment = req.body.comment;

    let sql = `INSERT INTO movies(title, release_year,overView,comment) values ($1,$2,$3,$4)`;
    client
      .query(sql, [movieTitle, release_year, overView, comment])
      .then(() => {
        res.status(201).json(`Movie ${movieTitle} added to database`);
      });
  } catch (error) {
    next(`An error occurred while adding a movie: ${error}`);
  }
});

Router.delete('/:id', (req, res, next) => {
  try {
    let idParam = req.params.id;
    let sql = `DELETE FROM movies WHERE id=${idParam}`;
    client.query(sql).then(() => {
      res.status(204).end();
    });
  } catch (error) {
    next(`An error occurred while deleting the movie: ${error}`);
  }
});

// Update a comment in database using (put) & params
Router.put('/:id', (req, res, next) => {
  try {
    let idParam = req.params.id;
    let { newcomment } = req.body;

    let sql = `UPDATE movies SET comment = $1 WHERE id=${idParam}`;

    client.query(sql, [newcomment]).then((movieData) => {
      res.status(200).json('Your comment is updated');
    });
  } catch (error) {
    next(`An error occurred while updating the movie Comment: ${error}`);
  }
});

// Get movie from the database using (get)  & params
Router.get('/:id', (req, res, next) => {
  try {
    let id = req.params.id;
    let sql = `SELECT * FROM movies WHERE id=${id};`;
    client.query(sql).then((moviesData) => {
      res.status(200).send(moviesData.rows);
    });
  } catch (error) {
    next(`An error occurred while get the required movie: ${error}`);
  }
});

///////////////////////////////////////////////////////////

Router.get('/', (req, res, next) => {
  try {
    let sql = `SELECT * FROM movies`;
    client.query(sql).then((moviesData) => {
      res.status(200).send(moviesData.rows);
    });
  } catch (error) {
    next(`An error occurred while get all the movies: ${error}`);
  }
});

module.exports = Router;
