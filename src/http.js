/**
 * @flow
 */
var http: any = require('http'); //Because lib/node.js  is missing http.createServer
var fs = require('fs');
var path = require('path');
var React = require('react');
var AsyncReact = require('./asyncReact.js');
var AsyncRouter = require('./asyncReactRouter.js');

/*------------------------------------------------------------------------------------------------*/
//	--- Constants ---
/*------------------------------------------------------------------------------------------------*/
var APP_URI = '/app.js';
var STATICS_URI = '/statics';
var LOOKUP_URI = '/lookup';
var ACTION_URI = '/action';

/*------------------------------------------------------------------------------------------------*/
//	--- Create Server Function ---
/*------------------------------------------------------------------------------------------------*/
/**
 * Create a new http server to serve a React Router Website.
 *
 * @param settings	{ReactHttpSettings}	The settings for the server
 *			route 				{ReactRouterRoute}		The react router root for the site
 *			htmlTemplate 		{string}				The html template string, where '<react />'
 *														is replaced with the component rendered for
 *														the root
 *			props				{[key: string]: any}	The props to send to the Handlers
 */
type ReactHttpSettings = {
	route: ReactRouterRoute;
	htmlTemplate: string;
	props?: {[key: string]: any};
};
function createServer(settings: ReactHttpSettings): HttpServer {
	return http.createServer((request, response) => {
		var requestHandler = new ReactRouterRequestHandler({
			request: request,
			response: response,
			serverSettings: settings
		});
		requestHandler.handleRequest();
	});
}

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Http Request Handler Class ---
/*------------------------------------------------------------------------------------------------*/
/**
 * A class that handles a http request for the react-router server.
 *
 * @param settings	{ReactRouterRequestHandler}	The settings for the request handler
 *			request			{HttpIncomingMessage}	The http request to handle
 *			response		{HttpServerResponse}	The http response to send results to
 *			serverSettings	{ReactHttpSetting}		The settings for react-router server
 *														(see createServer documentation for details)
 */
type ReactRouterRequestHandlerSettings = {
	request: HttpIncomingMessage;
	response: HttpServerResponse;
	serverSettings: ReactHttpSettings;
};
function ReactRouterRequestHandler(settings: ReactRouterRequestHandlerSettings) {
	this._request = settings.request;
	this._response = settings.response;
	this._severSettings = settings.serverSettings;
}

/*------------------------------------------------------------------------------------------------*/
//	React Router Http Request Handler Methods
/*------------------------------------------------------------------------------------------------*/
/**
 * Handle the request given in the constructor.
 */
ReactRouterRequestHandler.prototype.handleRequest = function() {
	// Get Handler for the current route
	AsyncRouter.run(this._severSettings.route, this._request.url, (Handler, state) => {
		// 404 Error (maybe)
		if(!state.routes || state.routes.length === 0) {
			this._handleError(new Error('No route'));
			return;
		}

		// Check if Handler is an Http Request Handler function
		var InnerHandler = state.routes[state.routes.length-1].handler;
		if(InnerHandler.isHttpRequestHandler) {
			try{
				InnerHandler.handle(this._request, this._response);
			}
			catch(err) {
				this._handleError(err);
			}
			return;
		}

		// Render Element
		var props = this._severSettings.props? this._severSettings.props: {}
		AsyncReact.renderToString(<Handler {...props} />)	//ERROR, incorrect flow error
			.then((reactHtml) => {
				// Add rendered react to html file when both are completed
				var htmlDoc = this._severSettings.htmlTemplate.replace('<react />', reactHtml);
				this._response.write(htmlDoc); 
				this._response.end();
			})
			.catch((err) => {
				console.log('Render Error: ', err);
				this._handleError(err);
			});
	});
};

/*------------------------------------------------------------------------------------------------*/
//	React Router Http Request Handler 'Private' Methods
/*------------------------------------------------------------------------------------------------*/
/**
 * Handle the given error, send appropriate response to client.
 *
 * @param error {Error}	The error to handle
 */
ReactRouterRequestHandler.prototype._handleError = function(err: Error) {
	//TODO, create response based on error
	console.log(err, err.stack);
	this._response.writeHead(500, {'Content-Type': 'application/json'});
	this._response.write(JSON.stringify({
		errors: [
			{type: 'InternalServerError', message: `Error Message: ${err.message}`},
		]
	}));
	this._response.end();
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createServer = createServer;
module.exports.ReactRouterRequestHandler = ReactRouterRequestHandler;