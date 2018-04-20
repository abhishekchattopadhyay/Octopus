var express = require('express'),
bodyParser = require('body-parser');
var app = express();

var port = process.env.Port || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var ProtocolRouter = require('./api/protocol');

app.use('/api',ProtocolRouter);
app.get('/', function (req, res) {
    res.send('Welcome to my TestRunner API');
});
app.listen(port, function () {
    console.log('Server is on and running on Port number:' + port);
});
