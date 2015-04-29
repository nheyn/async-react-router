//Not defined by flowtype, but are types built in to node
declare module http {
	declare function createServer(callback?: HttpHandlerFunction): HttpServer;
}

type HttpHandlerFunction = (req: HttpIncomingMessage, res: HttpServerResponse) => void;

declare class HttpServer {}
declare class HttpIncomingMessage {
	url: string;
}

declare class HttpServerResponse {
	end(chunk?: string): void;
}
