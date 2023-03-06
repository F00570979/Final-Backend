'use strict';

const express = require('express');

const Movie = require('./models/movie.Model');
const movieRouter = require('./routes/movie-Router')(Movie);
const morganLogger = require('./middleware/logger');


// Initialized the application
const webApi = express();

// Logger Middleware
webApi.use(morganLogger);

// Allowing CORS
webApi.use(function (_, response, next) {
    
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    next();
});

// express middleware to handle the json body request
webApi.use(express.json());

// Default Route
webApi.get('/api', (request, response) => {
    response.status(200).json("Welcome to Movies Web API.");
});

// Middleware (To Import Additional Routes)
webApi.use('/api', movieRouter);


module.exports = webApi;
