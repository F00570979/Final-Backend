'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieModel = new Schema({
    director: { type: String, required: true },

    name: { type: String, required: true },

    dateOfRelease: { type: Date, required: true, default: new Date().toUTCString() },

    language: { type: String, default: 'C#' },

    watch: { type: Boolean, default: false }
});

module.exports = mongoose.model('movie', movieModel);


