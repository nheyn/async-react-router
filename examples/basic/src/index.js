require("babel/register");

var url = require('url');
var path = require('path');
var React = require('react');
var reactHttp = require('async-react-router').http;
var route = require('./route.js').route;

// Start server
reactHttp.createServer({
	route: route,
	staticFileDirectory: path.join(__dirname, 'statics/'),
	htmlTemplate: path.join(__dirname, 'template.html'),
	lookupHandler: function(request, response) {
		var query = url.parse(request.url, true).query;
		switch(query.page) {
			case 'p2':
				response.write('Page Two Content [From Server]');
				response.end();
				break;
			case 'p3':
				response.write('Page Three Content [From Server]');
				response.end();
				break;

		}
	}
}).listen(8080);