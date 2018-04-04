var express = require('express');
var fs=require('fs'),xml2js=require('xml2js');
var app = express();
var conf;
var result;

var parser=new xml2js.Parser();
var jsonResult=null;
app.get('/getting', function(req, res){
res.writeHead(200, {'Content-Type': 'application/json'});
    fs.readFile('D:/NodeJSCode/protocol.xml',function(err,data){
	parser.parseString(data,function(err,jresult){
	console.dir(jresult);
	console.log('Read Over');
	jsonResult=jresult;
	
	});
	});
	console.log('This is response stream'+jsonResult);
	res.end(jsonResult+'');    
});

app.post('/posting',function(req,res){  
var body = '';
req.on('data', function(data) {
        body += data;
    });

    req.on('end', function (){
        fs.writeFile('D:/NodeJSCode/protocol.xml', body, function() {
           console.log(body);
            res.end('Successfully Posted');
        });
    });

});
app.listen(3000);
console.log('Listening on port 3000');