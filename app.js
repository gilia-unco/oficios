const http = require('http'),
    fs = require('fs'),
    path = require('path'),
    env = process.env;

var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost:27017/Oficios", { useNewUrlParser: true });

// DECLARAR ROUTES


express = require('express');
bodyParser = require('body-parser');
var cfg = require('./config.js');
var jwt = require('jwt-simple');

var auth = require("./auth.js")();
app = express();



// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, authorization');

    // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); //para peticiones application/json
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(auth.initialize());

// USAR ROUTES

//#########################################################
//            INDEX RENDER PARA ANGULAR2
//######################################################
app.set('views', path.join(__dirname, 'src'));
// engine
app.set('view enginer', 'ejs');
app.engine('html', require('ejs').renderFile);
// angular  dist -- VERY IMPORTANT
app.use(express.static(__dirname + '/dist'));


app.get('/', function (req, res, next) {
    res.render('index.html');
});







var reportingApp = express();
app.use('/reporting', reportingApp);

var jsreport = require('jsreport-core')();
jsreport.use(require('jsreport-templates')());
jsreport.use(require('jsreport-express')({
    app: reportingApp
}));

jsreport.init();


var server = http.createServer(app);
server.listen(process.env.PORT || 4000, function () {
    console.log("Servidor Corriendo");
});