const mongoose = require('mongoose');
require('../models/scotches');

exports.mongoDatabaseUrl = process.env.mongoDatabaseUrl;
let connection;

exports.connectToMongo = () =>  {
    //mongoose.connect(this.mongoDatabaseUrl);
    console.log(this.mongoDatabaseUrl);
    mongoose.connect(this.mongoDatabaseUrl, { useNewUrlParser: true })
    .then(() => {
      console.log('Database connected.');
    })
    .catch((err) => {
      console.log('Error on start: ' + err.stack);
      //process.exit(1);
    });
};