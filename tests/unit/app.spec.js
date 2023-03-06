'use strict';

const request = require('supertest');
const app = require('../../src/app');
const mockMongoDb = require('./__mocks__/MongoDbMock');

describe('Testing /src/app.js', () => {

    const apiServer = request(app);

    beforeAll(async () => await mockMongoDb.connect());

    afterEach(async () => await mockMongoDb.clearDatabase());

    afterAll(async () => await mockMongoDb.closeDatabase());

    describe('Testing API Routes', () => {

        // "/" Routes
        describe('App :: "/" Routes', () => {

            const defaultMessage = 'Welcome to Movies Web API.';

            test('API Should return default response', async function (done) {
                const response = await apiServer.get('/api');

                expect(response.status).toBe(200);
                expect(JSON.parse(response.text)).toBe(defaultMessage);

                done();
            });

        });

        // "/api/movies" Routes
        describe('Movie Routers :: "/api/movies" Routes', () => {

            const Movie = require('../../src/models/movie.Model');

            const _movie = {
                '_id': '5f0745314c16a3084cfa41fc',
                'director': 'SS Rajamouli',
                'name': 'RRR',
                'dateOfRelease': '01-Jan-2023',
                'language': "English",
                'watch': false
            };

            test('Movie Router Should return 500 when invalid id is sent', async function (done) {
                const response = await apiServer.get('/api/movies/InvalidId');

                expect(response.status).toBe(500);

                done();
            });

            test('Movie Router Should return 404 when no data available', async function (done) {
                const response = await apiServer.get('/api/movies/5f0745314c16a3084cfa41fc');

                expect(response.status).toBe(404);

                done();
            });

            test('Movie Router Should return 200 when data available', async function (done) {
                Movie.create(_movie);

                const response = await apiServer.get('/api/movies/5f0745314c16a3084cfa41fc');

                expect(response.status).toBe(200);

                done();
            });

        });

    });

});
