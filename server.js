require('./models/scotches');

var app = require('express')(),
  bodyParser = require('body-parser'),
  database = require('./config/database'),
  scotchController = require('./controllers/ScotchesController'),
  axios = require('axios');

database.connectToMongo();

// configure the app to use bodyParser()
// this will let us get data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(morgan('dev'));
//app.use(helmet());

app.set('view engine', 'ejs'); // set up ejs for templating

app.get('/', (req, res) => {
    res.render('pages/index');
});
  
app.route('/scotch')
  .get(scotchController.getAllScotch)
  .post(scotchController.createScotch);
  
app.listen(process.env.PORT, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
  
    console.log(`server is listening on ${process.env.PORT}`)
});

exports.GetAllScotches = function(bot, message) {
    axios.get(`http://localhost:${process.env.PORT}/scotch`)
    .then((res) => {

        var data = res.data;
        
        var response = '';
        
        var response = {
            "text": '*The Scotch Club Menu:*\n\n',
            "mrkdwn": true
          }

        data.forEach(element => {
            response.text += '*Name:* ' + element.name + '\n';
            response.text += '*Price:* $' + element.price + '\n';
            response.text += '*Link:* ' + element.lcboLink + '\n';
            response.text += '*Image:* ' + element.imgLink + '\n\n';
          });

          bot.reply(message, response);
    })
    .catch((error) => {
        console.log(err);
    });
}