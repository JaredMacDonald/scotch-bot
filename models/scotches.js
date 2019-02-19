'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScotchesSchema = new Schema({
    name: {
        type: String
    },
    lcboLink: {
        type: String
    },
    price: {
        type: String
    },
    imgLink: {
        type: String
    }
});

module.exports = mongoose.model('Scotch', ScotchesSchema);