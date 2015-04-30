require("babel/register");

var path = require('path');
var React = require('react');
var reactHttp = require('async-react-router').http;
var route = require('./route.js').route;

// Start server
reactHttp.createServer({
	route: route,
	staticFileDirectory: path.join(__dirname, 'statics/'),
	htmlTemplate: path.join(__dirname, 'template.html')
}).listen(8080);