var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var showapp = require('./routes/shows')
var http = require('http');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({"extended" : false}));

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.urlencoded());
    app.use(express.json());
});

app.get('/showsList', showapp.findAll);

app.get('/shows/:id', showapp.findById);

app.post('/shows', showapp.addShow);

app.delete('/shows/:id', showapp.deleteShow);

app.delete('/showsList', showapp.deleteAllShow);


 app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080);
 app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
 app.get('/', function(req,res){ res.send("Hello World"); });
 http.createServer(app).listen(app.get('port') ,app.get('ip'),
 function () { console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));

              }
);
