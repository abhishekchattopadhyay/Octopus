var express = require('express'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    _ = require('lodash'),
    xmldom = require('xmldom'),
    parser = new xml2js.Parser(),
    xmlBuilder = new xml2js.Builder(),
    DOMParser = xmldom.DOMParser,
    XMLSerializer = xmldom.XMLSerializer,
    serializer = new XMLSerializer(),
    TestTypeRouter = express.Router(),
    mkdirp = require('mkdirp');
const directory = '../automation/xml/options';

const TestTypeFilePath = '../automation/xml/options/testType.xml';

TestTypeRouter.route('/testtype')
    .get(function (req, res) {
        if (fs.existsSync(TestTypeFilePath)) {
            console.log("Directory Present");
            fs.readFile(TestTypeFilePath, function (err, data) {
                parser.parseString(data, function (err, jresult) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {

                        res.status(200).json(jresult.TEST.TYPE);
                    }
                });
            });
        } else {
            console.log("Directory not Present");
            mkdirp(directory, function (err) {
                if (err) console.error(err)
                else {
                    fs.writeFileSync(TestTypeFilePath, '<TEST></TEST>');
                    console.log('Directory created');
                    fs.readFile(TestTypeFilePath, function (err, data) {
                        parser.parseString(data, function (err, jresult) {
                            if (err) {
                                res.status(500).send(err);
                            }
                            else {

                                res.status(200).json(jresult.TEST.TYPE);
                            }
                        });
                    });

                }
            });
        }
    })
    .post(function (req, res) {
        try {
            var xmlString = fs.readFileSync(TestTypeFilePath, 'utf-8');
            console.log(xmlString);
            var doc;
            doc = new DOMParser().parseFromString(xmlString, 'application/xml');
            var newEle = doc.createElement("TYPE");
            var newText = doc.createTextNode(req.body.type);
            newEle.appendChild(newText);
            doc.getElementsByTagName("TEST")[0].appendChild(newEle);
            console.log(serializer.serializeToString(doc));
            fs.writeFileSync(TestTypeFilePath, serializer.serializeToString(doc));
            res.status(201).send('Added Value:' + req.body.type);
        }
        catch (ex) {
            res.status(500).send(ex);
        }
    })
    .put(function (req, res) {
        try {
            var xmlString = fs.readFileSync(TestTypeFilePath, 'utf-8'),
                doc,
                flag = false,
                Message,
                doc = new DOMParser().parseFromString(xmlString, 'application/xml'),
                Element = doc.getElementsByTagName('TYPE'),
                //New Element creation
                NewElement = doc.createElement("TYPE"),
                newText = doc.createTextNode(req.body.newtype);
            NewElement.appendChild(newText);
            for (let i = 0; i < Element.length; i++) {
                if (serializer.serializeToString(Element[i].childNodes[0]) === req.body.oldtype) {
                    doc.documentElement.replaceChild(NewElement, Element[i]);
                    flag = true;
                }
            }
            if (flag === true) {
                fs.writeFileSync(TestTypeFilePath, serializer.serializeToString(doc));
                console.log(serializer.serializeToString(doc));
                Message = 'Item Upadted Success:' + req.body.newtype;
            }
            else {
                Message = 'No such item found in list:' + req.body.oldtype;
            }
            //console.log(req.body.newname);
            res.status(201).send(Message);
        }
        catch (ex) {
            res.status(500).send(ex);
        }
    })
    .delete(function (req, res) {
        try {
            var xmlString = fs.readFileSync(TestTypeFilePath, 'utf-8'),
                doc,
                flag = false,
                Message,
                doc = new DOMParser().parseFromString(xmlString, 'application/xml'),
                Element = doc.getElementsByTagName('TYPE');
            console.log(Element.length);
            for (let i = 0; i < Element.length; i++) {
                console.log(i);
                console.log(serializer.serializeToString(Element[i]));
                console.log(serializer.serializeToString(Element[i].childNodes[0]));
                if (serializer.serializeToString(Element[i].childNodes[0]) === req.body.type) {
                    doc.documentElement.removeChild(Element[i]);
                    flag = true;
                }
            }
            if (flag === true) {
                fs.writeFileSync(TestTypeFilePath, serializer.serializeToString(doc));
                console.log(serializer.serializeToString(doc));
                Message = 'Item deteled Success:' + req.body.type;
            }
            else {
                Message = 'No such item found in list:' + req.body.type;
            }

            res.status(201).send(Message);
        }
        catch (ex) {
            res.status(500).send(ex);
        }

    });
TestTypeRouter.route('/testtype/:type')
    .get(function (req, res) {
        try {
            fs.readFile(TestTypeFilePath, function (err, data) {
                parser.parseString(data, function (err, jresult) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        var result;
                        if (req.params.type) {
                            result = _.filter(jresult.TEST.TYPE, function (item) {
                                return item == req.params.type;
                            });
                        }
                        res.status(200).json(result);
                    }
                });
            });
        } catch (ex) {
            res.status(500).send(ex);
        }
    });

module.exports = TestTypeRouter;