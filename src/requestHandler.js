/**
 * @flow
 */
var React = require('react');
var path = require('path');
var fs = require('fs');

type FileRequestConstructorType = {
	path: string,
	mimeTypes?: Map<string, string>,
	mimeType?: string
};

/**
 * //TODO
 */
function createRequestHandlerClass(requestHandler: HttpHandlerFunction): ReactClass {
	var RequestHandler = React.createClass({
		statics: {
			handle: requestHandler,
			isHttpRequestHandler: true
		},
		render() {
			throw new Error('ERROR, RequestHandler should never be rendered');
			return 'ERROR, RequestHandler should never be rendered';
		}
	});

	return RequestHandler;
}

/**
 * //TODO
 */
function createDirectoryRequestClass(settings: FileRequestConstructorType): ReactClass {
	return createRequestHandlerClass((request, response) => {
		var queryStr = request.url.split('?');
		if(queryStr.length !== 2) throw new Error('File in directory needs "?path=" in url');

		// Get path from query
		var pathFromQuery = null;
		queryStr[1].split('&').forEach((queryPart) => {
			var queryParts = queryPart.split('=');
			if(queryParts.length !== 2) throw new Error('Invalid query in url');

			if(queryParts[0] === 'path') pathFromQuery = queryParts[1];
		});
		if(!pathFromQuery) throw new Error('File in directory needs "?path=" in url');

		// Check if trying to get a file outside the directory
		if(pathFromQuery.indexOf('..') !== -1) throw new Error('File must be in the directory');

		// Send file
		var fullPath = path.resolve(path.join(settings.path, pathFromQuery));
		var handleFile = fileRequestHandlerFunctionFor(
			fullPath,
			settings.mimeType? settings.mimeType: getMimeType(fullPath, settings.mimeTypes)
		);
		handleFile(request, response);
	});
}

/**
 * //TODO
 */
function createFileRequestClass(settings: FileRequestConstructorType): ReactClass {
	var fullPath = path.resolve(settings.path);
	return createRequestHandlerClass(fileRequestHandlerFunctionFor(
		fullPath,
		settings.mimeType? settings.mimeType: getMimeType(fullPath, settings.mimeTypes)
	));
}

/*------------------------------------------------------------------------------------------------*/
//	--- Helper functions ---
/*------------------------------------------------------------------------------------------------*/
function fileRequestHandlerFunctionFor(filePath: string, mimeType: string): HttpHandlerFunction {
	return (request, response) => {
		openFile(filePath)
			.then((fileContent) => {
				response.writeHead(200, {'Content-Type': mimeType});
				response.write(fileContent);
				response.end();
			})
			.catch((err) => {
				console.log(err, err.stack);
				response.writeHead(500, {'Content-Type': 'application/json'});
				response.write(JSON.stringify({
					errors: [
						{
							type: 'InternalServerError', 
							message: `Error Loading File(2): ${err.message}`
						}
					]
				}));
				response.end();
			});
	};
}

function getMimeType(filePath: string, mimeTypes: ?Map<string, string>): string {
	if(!mimeTypes)	return 'text/plain';

	var ext = path.extname(filePath).slice(1);
	return mimeTypes.has(ext)? 
			mimeTypes.get(ext): 
			'text/plain';
}

function openFile(filePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		var chunks = [];
		var fileStream = fs.createReadStream(filePath);
		fileStream.on('data',	(chunk) => chunks.push(chunk)	);
		fileStream.on('end',	() => resolve(chunks.join(''))	);
		fileStream.on('error',	(err) => reject(err)			);
	});
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createRequestHandlerClass = createRequestHandlerClass;
module.exports.createDirectoryRequestClass = createDirectoryRequestClass;
module.exports.createFileRequestClass = createFileRequestClass;