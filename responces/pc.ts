import { Request, Response } from "express";

import { indivpc } from "../sql";

export default function pc(req : Request, res : Response) {
	const pcid: number = parseInt(req.params.name);
    const before: number = req.body.before || Number.MAX_SAFE_INTEGER;
    const after: number = req.body.after || 0;
    
    if (pcid >= 0)
        indivpc(pcid, before, after)
            .then(reply => {
                res.status(200).json(reply.rows.map(row => ({
                    app: row.app, 
                    time: row.time
                })))
            })
            .catch(err => res.status(500).json(err));
    else
        res.status(400).json({ message: 'Bad request'});
}