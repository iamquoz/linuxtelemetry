import { Request, Response } from "express";

import { allpcs } from "../sql";

export default function pcs(req: Request ,res : Response) {
    allpcs(req.signedCookies.user)
        .then(reply => res.status(200).json(reply.rows.map(pc => ({
            pcid: pc.pcid,
            pcname: pc.pcname, 
            note: pc.note,
            clearance: pc.clearance
        }))))
        .catch(e => res.status(500).json(e));

}