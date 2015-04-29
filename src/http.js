/**
 * @flow
 */
var http: any = require('http'); //NOTE, needs any because 'http.createServer' isn't defined by flow
var fs = require('fs');
var path = require('path');

/*------------------------------------------------------------------------------------------------*/
//	--- Constants ---
/*------------------------------------------------------------------------------------------------*/
var STATICS_URI = '/statics';
var LOOKUP_URI = '/lookup';
var ACTION_URI = '/action';


/*------------------------------------------------------------------------------------------------*/
//	--- Create Server Function ---
/*------------------------------------------------------------------------------------------------*/
type ReactHttpSettings = {
	staticFileDirectory: string;
	lookupHandler?: HttpHandlerFunction;
	actionHandler?: HttpHandlerFunction;
};
/**
 * //TODO
 */
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
type ReactRouterRequestHandlerSettings = {
	request: HttpIncomingMessage,
	response: HttpServerResponse,
	serverSettings: ReactHttpSettings
};
/**
 * //TODO
 */
function ReactRouterRequestHandler(settings: ReactRouterRequestHandlerSettings) {
	this._request = settings.request;
	this._response = settings.response;
	this._severSettings = settings.serverSettings;
}

/*------------------------------------------------------------------------------------------------*/
//	React Router Http Request Handler Methods
/*------------------------------------------------------------------------------------------------*/
ReactRouterRequestHandler.prototype.handleRequest = function() {
	var urlStartsWith = (pre) => this._request.url.startsWith(pre);
	
	// Check type of request	//TODO, allow pages called statics, lookup and/or action
	if(urlStartsWith(STATICS_URI))		this.handleStaticFile();
	else if(urlStartsWith(LOOKUP_URI))	this.handleLookup();
	else if(urlStartsWith(ACTION_URI))	this.handleAction();
	else								this.handleInitalPageLoad();
};

ReactRouterRequestHandler.prototype.handleStaticFile = function() {
	// Get static file
	var fileName = this._request.url.substring(STATICS_URI.length);
	var readStream = fs.createReadStream(
		path.join(this._severSettings.staticFileDirectory, fileName)
	);
	readStream
		.on('open', () => readStream.pipe(this._request, true)) //NOTE, true is for flowtype
		.on('error', (err) => this.handleError(err));
};

ReactRouterRequestHandler.prototype.handleLookup = function() {
	if(!this._severSettings.lookupHandler) {
		this.handleError(new Error('Unable to do any lookups'));
		return;
	}

	this._severSettings.lookupHandler(this._request, this._response);
};

ReactRouterRequestHandler.prototype.handleAction = function() {
	if(!this._severSettings.actionHandler) {
		this.handleError(new Error('Unable to do any actions'));
		return;
	}

	this._severSettings.actionHandler(this._request, this._response);
};

ReactRouterRequestHandler.prototype.handleInitalPageLoad = function() {
	//TODO, handle initial page load request (render react on server)
	//TODO, close response
};

ReactRouterRequestHandler.prototype.handleError = function(err: Error) {
	//TODO, send http error
	//TODO, close response
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createServer = createServer;