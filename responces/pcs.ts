import { IncomingMessage, ServerResponse } from "http";

import { allpcs } from "../sql";

export default function pcs(req : IncomingMessage, res : ServerResponse) {
    
    allpcs()
        .then(reply => {
            res.end(reply.rows.map(pc => pc.pcname).join('\n'))})
        .catch(e => console.error(e.stack));

//    res.end("done");
    res.statusCode = 200;
}