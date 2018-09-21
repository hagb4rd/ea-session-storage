var url = require('url');
var querystring = require('querystring');
var path=require('path');
var express = require('express');
var session = require('express-session');
//var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var SQLiteStore = require('connect-sqlite3')(session);
//var FormData=require('form-data');

var readToEnd = (stream) => new Promise((resolve, reject)=>{
  var text="";
  stream.on("data", chunk=>{
    text+=chunk.toString("utf8");
  });
  stream.on("end", chunk=>{
    if(chunk) {
      text+=chunk.toString("utf8");
    }
    resolve(text);
  });
  stream.on("error", e=>{
    reject(e);
  });
})



module.exports = function({sessionSecret,expireDays}) {
	if(sessionSecret==null) 
		throw TypeError('Missing Argument: sessionSecret')

	expireDays=expireDays||90;
  
  var api = express.Router();

	//api.use(express.methodOverride());
	api.use(function(req,res,next){
    readToEnd(req).then(body=>{ req.bodyText=body; next(); return req; });
  });
  api.use(cookieParser());
  /*
  api.use(session({
    store: new SQLiteStore,
    secret: sessionSecret,
    cookie: { maxAge: expireDays * (24 * 60 * 60 * 1000) }, // expires in n days
    saveUninitialized: true,
    resave: false
  }));
  /* */
  //*
  api.use(function(req,res,next){ 
    if(!req.session) {
      var sess=session({
        store: new SQLiteStore,
        secret: sessionSecret,
        cookie: { maxAge: expireDays * (24 * 60 * 60 * 1000) }, // expires in n days
        saveUninitialized: true,
        resave: false
      })
      sess(req,res,next);
    } else {
      next();
    }
  });
  /* */

  //init storage in session middleware  
  api.use(function(req,res,next){
    if(req.session) {
      if(!req.session.storage) {
        req.session.storage={}
      }
      req.session.save();
		}
		next()
	})
	
	//api.use('/public', express.static(path.resolve(__dirname, "../public")));
  api.get('/client.js', function(req,res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    var file=require('fs').createReadStream(require('path').resolve(__dirname, './client.js'), {encoding: 'utf8'});
    file.pipe(res);
  })

  //load
  api.get('/:key', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
  	res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      if(req.params.key) {
        var key=decodeURIComponent(req.params.key); 
        var body = req.session.storage[key];
        if(!body) {
          throw new Error('No Object stored @ key: '+ key);
        }
      } else {
        throw new Error('No key specified');
      }
      res.send(JSON.stringify({status:200, ok:true, data:body}));
    } catch(e){
      res.send(JSON.stringify({status:200, ok:false, data:e.message}))
    }

  })

  //save
  api.post('/:key', function(req, res) {
		res.setHeader('Content-Type', 'application/json');;
  	res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      if(req.params.key) {
        var key=decodeURIComponent(req.params.key);
				var body=JSON.parse(req.bodyText);
				req.session.storage[key]=body;
        req.session.save();
      } else {
        throw new Error('No key specified');
      }
      res.send(JSON.stringify({status:200, ok:true, data: key}))
    } catch (e) {
      res.send(JSON.stringify({status:200, ok:false, data:e.message}))
    }
  });

  api.get('/', function(req,res) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send("<script src='client.js'></script>");
  });


  
  return api;
};
