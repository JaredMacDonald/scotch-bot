const mongoose = require('mongoose');
require('../models/scotches');

exports.mongoDatabaseUrl = process.env.mongoDatabaseUrl;
let connection;

exports.connectToMongo = () =>  {
    //mongoose.connect(this.mongoDatabaseUrl);
    mongoose.connect(this.mongoDatabaseUrl)
  .then(() => {
    //server.start();
  })
  .catch((err) => {
    console.log('Error on start: ' + err.stack);
    process.exit(1);
  });
};