var express = require('express'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    _ = require('lodash'),
    bodyParser = require('body-parser')
xmldom = require('xmldom');

const ProtocolFilePath = '../automation/xml/options/protocol.xml';
var parser = new xml2js.Parser(),
    xmlBuilder = new xml2js.Builder(),
    DOMParser = xmldom.DOMParser,
    XMLSerializer = xmldom.XMLSerializer,
    serializer = new XMLSerializer();;


var app = express();

var port = process.env.Port || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var ProtocolRouter = express.Router();

ProtocolRouter.route('/getProtocol')
    .put(function (req, res) {
        fs.readFile(ProtocolFilePath, function (err, data) {
            parser.parseString(data, function (err, result) {

                console.log(result);

                result.PROTOCOL.NAME = [req.body.name];

                var xml = xmlBuilder.buildObject(result);

                fs.writeFile(ProtocolFilePath, xml);

            });
        });
        console.log(req.body);
        res.status(201).send(req.body.name);
    })
    .post(function (req, res) {

        var xmlString = fs.readFileSync(ProtocolFilePath, 'utf-8')
        console.log(xmlString);
        var doc;            
        doc = new DOMParser().parseFromString(xmlString, 'application/xml');
        var newEle = doc.createElement("NAME");
        var newText = doc.createTextNode(req.body.name);
        newEle.appendChild(newText);
        doc.getElementsByTagName("PROTOCOL")[0].appendChild(newEle);

        console.log(serializer.serializeToString(doc));
        fs.writeFileSync(ProtocolFilePath, serializer.serializeToString(doc));           
        res.status(201).send('Added Value:'+req.body.name);
    })
    .get(function (req, res) {
        fs.readFile(ProtocolFilePath, function (err, data) {
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
        fs.readFile(ProtocolFilePath, function (err, data) {
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