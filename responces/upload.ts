import { Request, Response } from "express";

import { insert } from "../sql";

export default function upload(req : Request, res : Response) {
    if (req.body.pc !== '' && req.body.time !== '' && req.body.window !== '')
        insert(req.body.pc, req.body.time, req.body.window)
            .then((res) => {
                res.status(200).send('Success');
            })
            .catch((err) => {
                res.status(500).json(err);
            });
}