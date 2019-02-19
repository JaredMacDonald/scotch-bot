const mongoose = require('mongoose');
require('../models/scotches');

exports.mongoDatabaseUrl = process.env.mongoDatabaseUrl;
let connection;

exports.connectToMongo = () =>  {
    mongoose.connect(this.mongoDatabaseUrl);
};