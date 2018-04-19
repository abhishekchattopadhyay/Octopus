var express = require('express'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    _ = require('lodash'),
    bodyParser = require('body-parser');


var parser = new xml2js.Parser();
var app = express();

var port = process.env.Port || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var ProtocolRouter = express.Router();

ProtocolRouter.route('/getProtocol')
    .post(function (req, res) {
        console.log(req.body);
        res.status(201).send(req.body);
    })
    .get(function (req, res) {
        fs.readFile('../automation/xml/options/protocol.xml', function (err, data) {
            parser.parseString(data, function (err, jresult) {
                if (err) {
                    res.status(500).send(err);
                }
                else {

                    res.json(jresult.PROTOCOL.NAME);
                }
            });
        });
    });
ProtocolRouter.route('/getProtocolByName/:name')
    .get(function (req, res) {
        fs.readFile('../automation/xml/options/protocol.xml', function (err, data) {
            parser.parseString(data, function (err, jresult) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    var result;
                    if (req.params.name) {
                        result = _.filter(jresult.PROTOCOL.NAME, function (item) {
                            return item == req.params.name;
                        });
                    }
                    else {
                        result = jresult.PROTOCOL.NAME;
                    }

                    res.json(result);
                }
            });
        });
    });
app.use('/api', ProtocolRouter);

app.get('/', function (req, res) {
    res.send('Welcome to My TestRunner Api');
});

app.listen(port, function () {
    console.log('Server is on and running on Port number' + port);
});