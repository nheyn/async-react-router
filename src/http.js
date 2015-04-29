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
	//TODO, check kind of request
		//TODO, call request handler for type
};

ReactRouterRequestHandler.prototype.staticFilesRequestHandler = function() {
	//TODO, handle requests for static files
	//TODO, close response
};

ReactRouterRequestHandler.prototype.lookupDataRequestHandler = function() {
	//TODO, handle request for data
	//TODO, close response
};

ReactRouterRequestHandler.prototype.actionRequestHandler = function() {
	//TODO, handle action
	//TODO, close response
};

ReactRouterRequestHandler.prototype.initalPageRequestHandler = function() {
	//TODO, handle initial page load request (render react on server)
	//TODO, close response
};

ReactRouterRequestHandler.prototype.onErrorRequestHandler = function(httpStatus: number) {
	//TODO, send http error
	//TODO, close response
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createServer = createServer;