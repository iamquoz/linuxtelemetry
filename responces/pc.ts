import { Request, Response } from "express";

import { indivpc } from "../sql";

export default function pc(name : string, res : Response) {
    if (name) {
        indivpc(name)
            .then(reply => {
                res.status(200).json(reply.rows.map(row => ({
                    app: row.app, 
                    time: row.time
                })))
            })
            .catch(err => res.status(500).json(err));
    }
    else {
        res.send('Bad Request');
        res.status(400);
    }
}