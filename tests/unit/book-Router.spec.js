'use strict';

const sinon = require('sinon');
const proxyquire = require('proxyquire')
const httpMock = require('node-mocks-http');

describe('Testing /src/routes/movieRouter.js', () => {

    let expressStub, controllerStub, RouterStub, rootRouteStub, idRouteStub
    let request, response, next;

    describe('router', () => {

        beforeEach(() => {

            rootRouteStub = {
                "get": sinon.stub().callsFake(() => rootRouteStub),
                "post": sinon.stub().callsFake(() => rootRouteStub)
            };

            idRouteStub = {
                "get": sinon.stub().callsFake(() => idRouteStub),
                "use": sinon.stub().callsFake(() => idRouteStub)
            };

            RouterStub = {
                route: sinon.stub().callsFake((route) => {
                    if (route === '/movies/:movieId') {
                        return idRouteStub
                    }
                    return rootRouteStub
                })
            };

            expressStub = {
                Router: sinon.stub().returns(RouterStub)
            };

            controllerStub = {
                post: sinon.mock(),
                get: sinon.mock(),
                getMovieById: sinon.mock()
            };

            proxyquire('../../src/routes/movie-Router.js',
                {
                    'express': expressStub,
                    '../controllers/movies.Controller.js': controllerStub
                }
            );

            request = httpMock.createRequest();
            response = httpMock.createResponse();
            next = sinon.mock();

        });

        test('should map root get() router with controller::get()', () => {

            rootRouteStub.get('/movies', controllerStub.get);

            expect(RouterStub.route.calledWith('/movies'));
            expect(rootRouteStub.get.calledWith(controllerStub.get));
        });

        test('should map root getMovieById() router with controller::getMovieById()', () => {

            idRouteStub.use('/movies/:movieId', (request, response, next) => { });

            idRouteStub.get('/movies/:movieId', controllerStub.getMovieById);

            expect(RouterStub.route.calledWith('/movies/:movieId'));
            expect(idRouteStub.get.calledWith(controllerStub.getMovieById));
        });

        test('should map root post() router with controller::post()', () => {

            rootRouteStub.post('/movies', controllerStub.post);

            expect(RouterStub.route.calledWith('/movies'));
            expect(rootRouteStub.post.calledWith(controllerStub.post));

        });

    });

});

