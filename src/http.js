/**
 * @flow
 */
var http = require('http');

type HttpSettings = any; //TODO, define needed/optional settings

/*------------------------------------------------------------------------------------------------*/
//	--- Create Server Function ---
/*------------------------------------------------------------------------------------------------*/
function createServer(settings: HttpSettings): HttpServer {
	return http.createServer((request, response) => {
		var requestHandler = new ReactRouterRequestHandler({
			request: request,
			response: response,
			serverSettings: settings
		});
		handleRequest.handlerRequest();
	});
}

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Http Request Handler Class ---
/*------------------------------------------------------------------------------------------------*/
type ReactRouterRequestHandlerSettings = {
	request: IncomingMessage,
	response: OutgoingMessage,
	serverSettings: HttpSettings
}
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
	
	// Check type of request
	if(urlStartsWith('/statics'))		this.handleStaticFile();
	else if(urlStartsWith('/lookup'))	this.handleLookup();
	else if(urlStartsWith('/action'))	this.handleAction();
	else								this.handleInitalPageLoad();
};

ReactRouterRequestHandler.prototype.handleStaticFile = function() {
	//TODO, handle requests for static files
	//TODO, close response
};

ReactRouterRequestHandler.prototype.handleLookup = function() {
	//TODO, handle request for data
	//TODO, close response
};

ReactRouterRequestHandler.prototype.handleAction = function() {
	//TODO, handle action
	//TODO, close response
};

ReactRouterRequestHandler.prototype.handleInitalPageLoad = function() {
	//TODO, handle initial page load request (render react on server)
	//TODO, close response
};

ReactRouterRequestHandler.prototype.handleError = function(httpStatus: number) {
	//TODO, send http error
	//TODO, close response
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createServer = createServer;