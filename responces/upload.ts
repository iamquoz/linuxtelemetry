import { IncomingMessage, ServerResponse } from "http";

import { insert } from "../sql";

export default function upload(req : IncomingMessage, res : ServerResponse) {
    var body = '';
	req.on('data', (data) => {
		body += data;
	})
	req.on('end', () => {
        var payload = {
            window: '',
            pc: '',
            time: ''
        };
        
        try {
            payload = JSON.parse(body);
        } catch (error) {
            console.log(error);
        }

        insert(payload.pc, payload.time, payload.window);
	})

	res.end(body);
	res.statusCode = 200;
}