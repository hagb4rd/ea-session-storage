#!/usr/bin/env node
var http=require('http')
var express=require('express');
var app=express();
var Storage = require('../src/storage');
var PORT=process.env['PORT']||process.argv[2]||5555;
var opn=require('opn');
//just bind module to some route
app.use('/storage', Storage({sessionSecret:'23skidoo',expireDays:90}));

app.get('/', function(req,res) {
	res.redirect('/storage');
});

var server=http.createServer(app).listen(PORT);

//Client 
var baseURI=`http://localhost:${PORT}/storage/`;




var test=`(async()=>{
	storage.baseURI="${baseURI}";
	await storage.setItem('person',{jenny:13});
	console.log(await storage.getItem('person'));
})()`;

console.log("type in console:");
console.log(test);

opn(baseURI);