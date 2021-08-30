import { Request, Response } from "express";

import { indivpc } from "../sql";

export default function pc(req : Request, res : Response) {
	const name: string =  req.params.name;
	
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
        res.status(400).send('Bad request');
    }
}