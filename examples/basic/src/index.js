require("babel/register");

var fs = require('fs');
var url = require('url');
var path = require('path');
var React = require('react');
var AsyncRouter = require('async-react-router');
var route = require('./route.js');
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

// Error handling
function handleError(request, response, err) {
	console.log('Error[', request.url, ']: ', err, err.stack);
	response.writeHead(500, {'Content-Type': 'application/json'});
	response.write(JSON.stringify({
		errors: [
			{type: 'InternalServerError', message: 'Error Message: ' + err.message},
		]
	}));
	response.end();
}

// Read Template File
var readFile = new Promise(function(resolve, reject) {
	var templateChuncks = [];
	var templateStream = fs.createReadStream(
		path.join(__dirname, 'template.html'), 
		{ encoding: 'utf8' }
	);

	templateStream.on('data',	function(chunk)	{ templateChuncks.push(chunk);			});
	templateStream.on('error',	function(err)	{ reject(err);							});
	templateStream.on('end',	function()		{ resolve(templateChuncks.join(''));	});
});

// Start server
readFile.then(function(htmlTemplate) {
	AsyncRouter.http.createServer(function(req, res) {
		return {
			htmlTemplate: htmlTemplate,
			props: {
				dataSource: dataSource,
				lookup: lookup,
				dispatch: dispatch
			},
			handleError: handleError,
			route: route.makeRoute({
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
								handleError(request, response, err);
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
							.catch(function(err) {
								handleError(request, response, err);
							});
					});
				}
			})
		};
	}).listen(8080);
}).catch(function(err) {
	console.log('HTML Template Error:', err, err.stack);
	throw err;
});