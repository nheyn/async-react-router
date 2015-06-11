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
 * @param getSettings	{ReactHttpSettingsFunction}	A function that returns the server settings:
 *			route 				{ReactRouterRoute}		The react router root for the site
 *			htmlTemplate 		{string}				The html template string, where '<react />'
 *														is replaced with the component rendered for
 *														the root
 *			handleError			{Function}				Called with errors emitted by the server
 *			props				{?[key: string]: any}	The props to send to the outer Handler
 *			context				{?[key: string]: any}	the context to send to the Components
 */
type ReactHttpSettings = {
	route: ReactRouterRoute;
	htmlTemplate: string;
	handleError?: (request: HttpIncomingMessage, response: HttpServerResponse, err: Error) => void;
	props?: {[key: string]: any};
	context?: {[key: string]: any};
};
function createServer(getSettings: ReactHttpSettingsFunction): HttpServer {
	return http.createServer((request, response) => {
		Promise.resolve(getSettings(request, response))
			.then((settings) => {
				var requestHandler = new ReactRouterRequestHandler({
					request: request,
					response: response,
					serverSettings: settings? settings: {}
				});
				requestHandler.handleRequest();
			})
			.catch((err) => { throw err });
	});
}

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Http Request Handler ---
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
		if(!state.routes || state.routes.length === 0) {
			this._handleError(new Error('No route'));
			return;
		}

		// Check type of request
		try {
			var InnerHandler = state.routes[state.routes.length-1].handler;
			if(InnerHandler.isHttpRequestHandler)	this._handleRequest(InnerHandler);
			else									this._handleInitalPageLoad(Handler);
		}
		catch(err) {
			this._handleError(err);
		}
	});
};

/*------------------------------------------------------------------------------------------------*/
//	React Router Http Request Handler 'Private' Methods
/*------------------------------------------------------------------------------------------------*/
/**
 * Handle request handled by RequestHandlers.
 */
ReactRouterRequestHandler.prototype._handleRequest = function(InnerHandler: any) {
	InnerHandler.handle(this._request, this._response);
};

/**
 * Handle request for the initial page load.
 */
ReactRouterRequestHandler.prototype._handleInitalPageLoad = function(Handler: any) {
	var props = this._severSettings.props? this._severSettings.props: {}
	var context = this._severSettings.context? this._severSettings.context: {};
	
	React.withContext(context, () => {		//TODO, change from .withContext to .getChildContext
		AsyncReact.renderToString(<Handler {...props} />)
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

/**
 * Handle the given error, send appropriate response to client.
 *
 * @param error {Error}	The error to handle
 */
ReactRouterRequestHandler.prototype._handleError = function(err: Error) {
	if(!this._severSettings || this._severSettings.handleError) throw err;

	this._severSettings.handleError(this._request, this._response, err);
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createServer = createServer;
module.exports.ReactRouterRequestHandler = ReactRouterRequestHandler;