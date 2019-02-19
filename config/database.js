const mongoose = require('mongoose');
require('../models/scotches');

exports.mongoDatabaseUrl = process.env.mongoDatabaseUrl;
let connection;

exports.connectToMongo = () =>  {
    //mongoose.connect(this.mongoDatabaseUrl);
    console.log(this.mongoDatabaseUrl);
    mongoose.connect(this.mongoDatabaseUrl, { useNewUrlParser: true }, (err) => {
      console.log('Error on start: ' + err.message);
      console.log('Error on start: ' + err.stack);
    });
};