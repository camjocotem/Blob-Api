var db = require('./DAL.js'),
    bodyParser = require('body-parser'),
    express = require('express'),
    logger = require('winston'),
    env = require('node-env-file'),
    router = express.Router();

var app = express();


env(__dirname + '/../.env');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var routes = require('./routes/routes')(router);
app.use('/', express.static('./pages'));
app.use('/api', routes);

app.listen(process.env.PORT, function(){
    console.log("Listening on port ", process.env.PORT);
});