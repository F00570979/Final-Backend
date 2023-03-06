'use strict';

const joiValidator = require('@hapi/joi');

const movieSchemaValidator = joiValidator.object({

    director: joiValidator.string().required(),

    name: joiValidator.string().required(),

    dateOfRelease: joiValidator.date(),

    language: joiValidator.string(),

    watch: joiValidator.bool()

});

module.exports = movieSchemaValidator;
