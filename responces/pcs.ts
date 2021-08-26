import { Response } from "express";

import { allpcs } from "../sql";

export default function pcs(res : Response) {
    allpcs()
        .then(reply => res.status(200).json(reply.rows.map(pc => pc.pcname)))
        .catch(e => res.status(500).json(e));

}