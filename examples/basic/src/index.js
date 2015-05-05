require("babel/register");

var url = require('url');
var path = require('path');
var React = require('react');
var reactHttp = require('async-react-router').http;
var route = require('./route.js').route;
var DataSource = require('./dataSource.js');
var Dispatcher = require('./dispatcher.js');

// Data Lookup / Action Dispatcher
var dataSource = new DataSource();
var lookup = function(query) {
	var data = dataSource.getData(query);
	return data? Promise.resolve(data): Promise.reject(new Error('Unable to lookup data'));
};

var dispatcher = new Dispatcher(dataSource);
var dispatch = function(payload) {
	return dispatcher.dispatch(payload);
};


// Start server
reactHttp.createServer({
	route: route,
	staticFileDirectory: path.join(__dirname, 'statics/'),
	htmlTemplate: path.join(__dirname, 'template.html'),
	props: {
		dataSource: dataSource,
		lookup: lookup,
		dispatch: dispatch
	},
	lookupHandler: function(request, response) {
		var queryChunks = [];
		request.on('data', function(chunk) { queryChunks.push(chunk); });
		request.on('end', function() {
			var query = JSON.parse(queryChunks.join(''));
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
	},
	actionHandler: function(request, response) {
		var payloadChunks = [];
		request.on('data', function(chunk) { payloadChunks.push(chunk); });
		request.on('end', function() {
			var payload = JSON.parse(payloadChunks.join(''));
			dispatch(payload)
				.then(function() {
					// Send Success
					response.writeHead(200);
					response.end();
				})
				.catch(function(err){
					console.log('Action Error: ', err);
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