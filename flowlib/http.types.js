//Not defined by flowtype, but are types built in to node
declare module http {
	declare function createServer(callback?: HttpHandlerFunction): HttpServer;
}

type HttpHandlerFunction = (req: HttpIncomingMessage, res: HttpServerResponse) => void;
type HttpHeaderObject = {[key: string]: string | number};

declare class HttpServer {}
declare class HttpIncomingMessage {
	url: string;
}

type MessageOrHeaders = string | HttpHeaderObject
declare class HttpServerResponse {
	writeHead(statusCode: number, msg_or_hs?: MessageOrHeaders, headers?: HttpHeaderObject): void;
	write(chunk: any, encoding_or_callback?: any | Function, callback?: Function): void;
	end(chunk?: string): void;
}
