import { createServer, IncomingMessage, ServerResponse } from "http";

import pc from './responces/pc'
import upload from './responces/upload'
import pcs from "./responces/pcs";

const port = 5000;

const server = createServer( (request : IncomingMessage, response : ServerResponse) => {
	var url = new URL("http://" + request.headers.host + request.url);

	if (url.pathname === '/upload') {
		upload(request, response);
	}
	else if (url.pathname === '/pcs') {
		pcs(request, response);
	}
	else if (url.pathname === '/pc') {
		pc(request, response, url);
	}
	else {
		console.log('else');
		response.end("Nothing");
		response.statusCode = 418;
	}
});

server.listen(port);