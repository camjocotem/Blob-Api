var bodyParser = require('body-parser'),
    express = require('express'),
    env = require('node-env-file'),
    app = express();

env(__dirname + '/../.env');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var routes = require('./routes/routes');
app.use('/api', routes);

app.listen(process.env.PORT, function(){
    console.log("Listening on port ", process.env.PORT);
});