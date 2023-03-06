'use strict';

const express = require('express');
const moviesController = require('../controllers/movies.Controller');

function routes(Movie) {

    const movieRouter = express.Router();
    const movieController = moviesController(Movie);

    // Middleware For Retrieving the Movie
    movieRouter.use('/movies/:movieId', (request, response, next) => {
        console.log(`Using Middleware for finding Movie. ${request.params.movieId}`);

        Movie.findById(request.params.movieId, (error, movie) => {

            if (error) {
                return response.status(500).json(`Error from Middleware: ${error}`);
            }

            if (movie) {
                console.log(`Movie Found: ${movie}`);
                request.movie = movie;
                return next();
            }

            return response.status(404).json();
        });

    });

    movieRouter.route('/movies')
        .post(movieController.post)
        .get(movieController.get);

    movieRouter.route('/movies/:movieId')
        .get(movieController.getMovieById)
        .put(movieController.updateMovieById)
        .delete(movieController.deleteMovieById);

    return movieRouter;
}

module.exports = routes;
