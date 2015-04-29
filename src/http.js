/**
 * @flow
 */
var http = require('http');

type HttpSettings = any; //TODO, defined needed/optional settings

/*------------------------------------------------------------------------------------------------*/
//	--- Create Server Function ---
/*------------------------------------------------------------------------------------------------*/
function createServer(settings: HttpSettings): HttpServer {
	return http.createServer(requestHandler);
}

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Http Request Handlers ---
/*------------------------------------------------------------------------------------------------*/
function createRequestHandler(settings: HttpSettings) {
	return (request, response) => { 
		//TODO, handle http requests
	};
}

function staticFilesRequestHandler(request: HttpRequest, response: HttpResponse, settings: HttpSettings) {
	//TODO, handle requests for static files
}

function lookupDataRequestHandler(request: HttpRequest, response: HttpResponse, settings: HttpSettings) {
	//TODO, handle request for data
}

function actionRequestHandler(request: HttpRequest, response: HttpResponse, settings: HttpSettings) {
	//TODO, handle action
}

function initalPageRequestHandler(request: HttpRequest, response: HttpResponse, settings: HttpSettings) {
	//TODO, handle initial page load request (render react on server)
}

function onErrorRequestHandler(request: HttpRequest, response: HttpResponse, settings: HttpSettings, httpStatus: number) {
	//TODO, send http error
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createServer = createServer;