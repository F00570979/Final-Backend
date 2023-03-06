'use strict';

const movieSchemaValidator = require('../models/movie.SchemaValidator');

function moviesController(Movie) {

    async function post(request, response) {

        console.log(`Input Received: ${JSON.stringify(request.body)}`);

        const isMovieValid = movieSchemaValidator.validate(request.body);

        if (isMovieValid.error) {
            console.log("validation result", isMovieValid);
            return response.status(400).json(isMovieValid.error);
        }

        const similarMovieExist = await Movie.findOne({ director: request.body.director, name: request.body.name, language: request.body.language });

        if (similarMovieExist) {
            console.log(`Does Similar Movie Exists: ${similarMovieExist}`);
            return response.status(400).json(`Movie with "${request.body.name}" name exists from "${request.body.director}" director.`);
        }

        try {
            const movie = await (Movie.create(request.body))

            console.log(`Sending Output: ${JSON.stringify(movie)}`);
            return response.status(201).json(movie);

        } catch (error) {
            return response.status(500).json(error);
        }

    }

    async function get(request, response) {
        try {

            const allMovies = await Movie.find({});

            if (allMovies && allMovies.length > 0) {
                return response.status(200).json(allMovies);
            } else {
                return response.status(404).json();
            }

        } catch (error) {
            return response.status(500).json(error);
        }
    }

    async function getMovieById(request, response) {
        return response.status(200).json(request.movie);
    }

    async function updateMovieById(request, response) {

        console.log(`Movie Id: ${JSON.parse(JSON.stringify(request.movie))._id} | Complete Movie: ${JSON.stringify(request.movie)}`);

        Movie.findByIdAndUpdate(request.params.movieId, request.body, {
            new: true,
            useFindAndModify: false,
            runValidators: true
        },
            function (error, movie) {
                if (error) {
                    return response.status(500).json(error);
                } else {
                    return response.status(200).json({ 'success': true, 'Message': 'Movie updated Successfully', data: movie });
                }
            });

    }

    async function deleteMovieById(request, response) {

        console.log(`Movie Id: ${JSON.parse(JSON.stringify(request.movie))._id} | Completed Movie: ${JSON.stringify(request.movie)}`);

        Movie.findByIdAndDelete(request.movie._id, function (error, movie) {
            if (error) {
                return response.status(500).json(error);
            }
            else {
                return response.status(204).json({ 'success': true, 'Message': 'Movie Deleted Successfully' });
            }
        });

    }

    return { post, get, getMovieById, updateMovieById, deleteMovieById };
}

module.exports = moviesController;
