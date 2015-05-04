require("babel/register");

var url = require('url');
var path = require('path');
var React = require('react');
var reactHttp = require('async-react-router').http;
var route = require('./route.js').route;
var DataSource = require('./dataSource.js');

var dataSource = new DataSource();

// Start server
reactHttp.createServer({
	route: route,
	staticFileDirectory: path.join(__dirname, 'statics/'),
	htmlTemplate: path.join(__dirname, 'template.html'),
	props: {dataSource: dataSource},
	lookupHandler: function(request, response) {
		var query = url.parse(request.url, true).query;
		var data = dataSource.getData(query);

		response.write({data: data});
		response.end();
	}
}).listen(8080);