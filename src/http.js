/**
 * @flow
 */
var http: any = require('http'); //NOTE, needs any because 'http.createServer' isn't defined by flow
var fs = require('fs');
var path = require('path');
var AsyncReact = require('./asyncReact');
var AsyncRouter = require('./asyncReactRouter');

/*------------------------------------------------------------------------------------------------*/
//	--- Constants ---
/*------------------------------------------------------------------------------------------------*/
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
 *			staticFileDirectory	{string}				The directory that contains static files
 *			htmlTemplate 		{string}				The file that contains the html template
 *															where '<react />' is replaced with the
 *															component rendered for the root
 *			props				{[key: string]: any}	The props to send to the Handlers
 *			lookupHandler?: 	{HttpHandlerFunction}	A function to call when data is requested by
 *														the client
 *			actionHandler?: 	{HttpHandlerFunction}	A function to call when an action is
 *														preformed by the client
 */
type ReactHttpSettings = {
	route: ReactRouterRoute;
	staticFileDirectory: string;
	htmlTemplate: string;
	props: {[key: string]: any};
	lookupHandler?: HttpHandlerFunction;
	actionHandler?: HttpHandlerFunction;
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
	var urlStartsWith = (pre) => this._request.url.startsWith(pre);
	
	// Check type of request	//TODO, allow pages called statics, lookup and/or action
	if(urlStartsWith(STATICS_URI))		this._handleStaticFile();
	else if(urlStartsWith(LOOKUP_URI))	this._handleLookup();
	else if(urlStartsWith(ACTION_URI))	this._handleAction();
	else								this._handleInitalPageLoad();
};

/*------------------------------------------------------------------------------------------------*/
//	React Router Http Request Handler 'Private' Methods
/*------------------------------------------------------------------------------------------------*/
/**
 * Handle a request for a static file.
 */
ReactRouterRequestHandler.prototype._handleStaticFile = function() {
	// Get static file
	var fileName = this._request.url.substring(STATICS_URI.length);
	var readStream = fs.createReadStream(
		path.join(this._severSettings.staticFileDirectory, fileName)
	);
	readStream
		.on('open', () => readStream.pipe(this._request, true)) //NOTE, true is for flowtype
		.on('error', (err) => this.handleError(err));
};

/**
 * Handle a request for data lookup.
 */
ReactRouterRequestHandler.prototype._handleLookup = function() {
	if(!this._severSettings.lookupHandler) {
		this.handleError(new Error('Unable to do any lookups'));
		return;
	}

	this._severSettings.lookupHandler(this._request, this._response);
};

/**
 * Handle a client side action.
 */
ReactRouterRequestHandler.prototype._handleAction = function() {
	if(!this._severSettings.actionHandler) {
		this.handleError(new Error('Unable to do any actions'));
		return;
	}

	this._severSettings.actionHandler(this._request, this._response);
};

/**
 * Handle an initial page load request.
 */
ReactRouterRequestHandler.prototype._handleInitalPageLoad = function() {
	// Render the page for the current route
	AsyncRouter.run(this._serverSettings.route, this._request.url, (Handler, state) => {
		// Read File
		var chunks = [];
		var htmlStream = fs.createReadStream(
			this._severSettings.htmlTemplate, 
			{ encoding: 'utf8' }
		);
		htmlStream.on('data', (chunk) => { chunks.push(chunk); });
		
		// Render Element
		var props = this._severSettings.props? this._severSettings.props: {}
		AsyncReact.renderToString(<Handler {...props} />)	//ERROR, incorrect flow error
			.then((reactHtml) => {
				// Add rendered react to html file when both are completed
				htmlStream.on('end', () => {
					var htmlDoc = chunks.join('').replace('<react />', reactHtml);
					this._response.write(htmlDoc); 
					this._response.end();
				});
			})
			.catch((err) => {
				this.handleError(err);
			});
	});
};

/**
 * Handle the given error, send appropriate response to client.
 *
 * @param error {Error}	The error to handle
 */
ReactRouterRequestHandler.prototype._handleError = function(err: Error) {
	//TODO, create response based on error
	this._response.writeHead(500, {'Content-Type': 'application/json'});
	this._response.write(JSON.stringify({
		errors: [
			{type: 'InternalServerError', message: 'NYI'},
		]
	}));
	this._response.end();
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createServer = createServer;
module.exports.ReactRouterRequestHandler = ReactRouterRequestHandler;