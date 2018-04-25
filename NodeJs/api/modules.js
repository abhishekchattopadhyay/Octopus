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
    ModuleRouter = express.Router(),
    mkdirp = require('mkdirp');
const directory = '../automation/xml/options';
const ModuleFilePath = '../automation/xml/options/module.xml';

ModuleRouter.route('/Module')
    .get(function (req, res) {
        if (fs.existsSync(ModuleFilePath)) {
            console.log("Directory Present");
            fs.readFile(ModuleFilePath, function (err, data) {
                parser.parseString(data, function (err, jresult) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {

                        res.status(200).json(jresult.MODULE.NAME);
                    }
                });
            });
        }
        else {
            console.log("Directory not Present");
            mkdirp(directory, function (err) {
                if (err) console.error(err)
                else {
                    fs.writeFileSync(ModuleFilePath, '<MODULE></MODULE>');
                    console.log('Directory created');
                    fs.readFile(ModuleFilePath, function (err, data) {
                        parser.parseString(data, function (err, jresult) {
                            if (err) {
                                res.status(500).send(err);
                            }
                            else {

                                res.status(200).json(jresult.MODULE.NAME);
                            }
                        });
                    });

                }
            });


        }
    })
    .post(function (req, res) {
        try {
            var xmlString = fs.readFileSync(ModuleFilePath, 'utf-8');
            console.log(xmlString);
            var doc;
            doc = new DOMParser().parseFromString(xmlString, 'application/xml');
            var newEle = doc.createElement("NAME");
            var newText = doc.createTextNode(req.body.name);
            newEle.appendChild(newText);
            doc.getElementsByTagName("MODULE")[0].appendChild(newEle);
            console.log(serializer.serializeToString(doc));
            fs.writeFileSync(ModuleFilePath, serializer.serializeToString(doc));
            res.status(201).send('Added Value:' + req.body.name);
        }
        catch (ex) {
            res.status(500).send(ex);
        }
    })
    .put(function (req, res) {
        try {
            var xmlString = fs.readFileSync(ModuleFilePath, 'utf-8'),
                doc,
                flag = false,
                Message,
                doc = new DOMParser().parseFromString(xmlString, 'application/xml'),
                Element = doc.getElementsByTagName('NAME'),
                //New Element creation
                NewElement = doc.createElement("NAME"),
                newText = doc.createTextNode(req.body.newname);
            NewElement.appendChild(newText);
            for (let i = 0; i < Element.length; i++) {
                if (serializer.serializeToString(Element[i].childNodes[0]) === req.body.oldname) {
                    doc.documentElement.replaceChild(NewElement, Element[i]);
                    flag = true;
                }
            }
            if (flag === true) {
                fs.writeFileSync(ModuleFilePath, serializer.serializeToString(doc));
                console.log(serializer.serializeToString(doc));
                Message = 'Item Upadted Success:' + req.body.newname;
            }
            else {
                Message = 'No such item found in list:' + req.body.oldname;
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
            var xmlString = fs.readFileSync(ModuleFilePath, 'utf-8'),
                doc,
                flag = false,
                Message,
                doc = new DOMParser().parseFromString(xmlString, 'application/xml'),
                Element = doc.getElementsByTagName('NAME');
            console.log(Element.length);
            for (let i = 0; i < Element.length; i++) {
                console.log(i);
                console.log(serializer.serializeToString(Element[i]));
                console.log(serializer.serializeToString(Element[i].childNodes[0]));
                if (serializer.serializeToString(Element[i].childNodes[0]) === req.body.name) {
                    doc.documentElement.removeChild(Element[i]);
                    flag = true;
                }
            }
            if (flag === true) {
                fs.writeFileSync(ModuleFilePath, serializer.serializeToString(doc));
                console.log(serializer.serializeToString(doc));
                Message = 'Item deteled Success:' + req.body.name;
            }
            else {
                Message = 'No such item found in list:' + req.body.name;
            }

            res.status(201).send(Message);
        }
        catch (ex) {
            res.status(500).send(ex);
        }

    });
ModuleRouter.route('/getModuleByName/:name')
    .get(function (req, res) {
        try {
            fs.readFile(ModuleFilePath, function (err, data) {
                parser.parseString(data, function (err, jresult) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        var result;
                        if (req.params.name) {
                            result = _.filter(jresult.MODULE.NAME, function (item) {
                                return item == req.params.name;
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

module.exports = ModuleRouter;