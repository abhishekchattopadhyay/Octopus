var express = require('express'),
    bodyParser = require('body-parser');
cors = require('cors');
var app = express();

var port = process.env.Port || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*'); //<-- you can change this with a specific url like http://localhost:4200
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
var ProtocolRouter = require('./api/protocol');
var RmxTypeRouter = require('./api/rmxtype');
var TestTypeRouter = require('./api/testtype');
var VideoTypeRouter = require('./api/videotype');
var originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
    'http://www.URL.com'
];
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}
//here is the magic
app.use(cors(corsOptions));
app.use('/api', ProtocolRouter);
app.use('/api', RmxTypeRouter);
app.use('/api', TestTypeRouter);
app.use('/api', VideoTypeRouter);
app.get('/', function (req, res) {
    res.status(202).send('Welcome to my TestRunner API');
});
app.listen(port, function () {
    console.log('Server is on and running on Port number:' + port);
});
