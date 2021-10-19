import { Request, Response } from "express";

import { insert } from "../sql";

export default function upload(req : Request, res : Response) {
    if (req.body.pc !== '' && req.body.time !== '' && req.body.window !== '')
        insert(req.body.pc, req.body.time, req.body.window)
            .then(_ => res.status(200).end())
            .catch(err => {
                console.log(err, '/upload')
                res.status(500).end();
            });
}