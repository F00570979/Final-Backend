'use strict';

const Movie = require('../../src/models/movie.Model');
const moviesController = require('../../src/controllers/movies.Controller')(Movie);
const httpMock = require('node-mocks-http');

describe('Testing movies.Controller /src/controllers/movies.Controller.js', () => {

    // Variables.
    let request, response;

    const _movie = {
        'director': 'SSR',
        'name': 'RRR',
        'dateOfRelease': '01-Jan-2020',
        'language': "Telugu",
        'watch': false
    };

    const _movieInvalid = {
        name: 'Akanda',
        dateOfRelease: '01-Jan-2020',
        language: "Hindi",
        watch: false
    };

    const _movieExists = {
        dateOfRelease: '2023 - 01 - 01T01: 00: 00.000Z',
        language: 'English',
        watch: false,
        _id: '5f03ee290d4b4a1198c4e1e8',
        director: 'James',
        name: 'Jungle Book',
        __v: 0
    };

    beforeEach(() => {
        request = httpMock.createRequest();
        response = httpMock.createResponse();

        request.movie = _movie;
        Movie.find = jest.fn();
    });

    afterEach(() => {
        Movie.find.mockClear();

        request.movie = {};
    });

    // getMovieById() return 200
    describe('Movies Controller :: getMovieById()', () => {

        test('getMovieById() function is defined', async (done) => {

            expect(typeof moviesController.getMovieById).toBe('function');

            done();
        });

        test('getMovieById() function should return 200', async (done) => {

            await moviesController.getMovieById(request, response);

            expect(response.statusCode).toBe(200);
            expect(response._getJSONData()).toStrictEqual(_movie);

            done();
        });

    });

    // get() Returns all the movies. 200, 404 OR 500
    describe('Movies Controller :: get()', () => {

        test('get() function is defined', async () => {

            expect(typeof moviesController.get).toBe('function');

        });

        test('get() function should return 404', async (done) => {

            Movie.find = jest.fn().mockReturnValue([]);

            await moviesController.get(request, response);

            expect(response.statusCode).toBe(404);

            done();
        });

        test('get() function should return 200', async (done) => {
            Movie.find = jest.fn().mockResolvedValue([_movie]);

            await moviesController.get(request, response);

            expect(response.statusCode).toBe(200);

            done();
        });

        test('get() function should return 500', async (done) => {
            Movie.find = jest.fn().mockRejectedValue('Dummy Error');

            await moviesController.get(request, response);

            expect(response.statusCode).toBe(500);

            done();
        });

    });

    // post() return 200, 400, and 500
    describe('Movies Controller :: post()', () => {

        test('post() function is defined', async (done) => {

            expect(typeof moviesController.post).toBe('function');

            done();
        });

        test('post() function should return 400 when Invalid request is sent', async (done) => {

            request.body = _movieInvalid;

            await moviesController.post(request, response);

            expect(response.statusCode).toBe(400);

            done();
        });

        test('post() function should return 400 when record already exists', async (done) => {

            request.body = _movie;

            Movie.findOne = jest.fn().mockReturnValue(_movieExists);

            await moviesController.post(request, response);

            expect(response.statusCode).toBe(400);

            console.log(`Response: ${JSON.stringify(response._getJSONData())}`);

            done();
        });

        test('post() function should return 201 when record does not exists', async (done) => {

            request.body = _movie;

            Movie.findOne = jest.fn().mockReturnValue(null);
            Movie.create = jest.fn().mockReturnValue(_movie);

            await moviesController.post(request, response);

            expect(response.statusCode).toBe(201);

            done();
        });

        test('post() function should return 500 when it fail to create', async (done) => {

            request.body = _movie;

            Movie.findOne = jest.fn().mockReturnValue(null);
            Movie.create = jest.fn().mockRejectedValue('Unable to save');

            await moviesController.post(request, response);

            expect(response.statusCode).toBe(500);

            done();
        });

    });

});
