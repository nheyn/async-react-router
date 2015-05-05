require("babel/register");

var url = require('url');
var path = require('path');
var React = require('react');
var reactHttp = require('async-react-router').http;
var route = require('./route.js').route;
var DataSource = require('./dataSource.js');

var dataSource = new DataSource();
var lookup = function(query) {
	var data = dataSource.getData(query);
	return data? Promise.resolve(data): Promise.reject(new Error('Unable to lookup data'));
};

// Start server
reactHttp.createServer({
	route: route,
	staticFileDirectory: path.join(__dirname, 'statics/'),
	htmlTemplate: path.join(__dirname, 'template.html'),
	props: {
		dataSource: dataSource,
		lookup: lookup
	},
	lookupHandler: function(request, response) {
		var queryChunks = [];
		request.on('data', function(chunk) { queryChunks.push(chunk); });
		request.on('end', function() {
			var query = JSON.parse(queryChunks.join(''));
			console.log('query', query);
			lookup(query)
				.then(function(data) {
					response.writeHead(200, {'Content-Type': 'application/json'});
					response.write(JSON.stringify({
						data: data
					}));
					response.end();
				})
				.catch(function(err) {
					console.log('Lookup Error: ', err);
					response.writeHead(500, {'Content-Type': 'application/json'});
					response.write(JSON.stringify({
						errors: [
							{type: 'InternalServerError', message: 'Error performing lookup'},
						]
					}));
					response.end();
				});
		});
	}
}).listen(8080);