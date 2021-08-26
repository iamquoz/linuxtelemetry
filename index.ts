import express, { Request, Response } from "express";

import pc from './responces/pc'
import upload from './responces/upload'
import pcs from "./responces/pcs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = process.env.port || 5000;
app.listen(port, () => console.log('ready'));

app.get('/pc', (req : Request, res : Response) => {
	pcs(res);
})

app.get('/pc/:name', (req : Request, res : Response) => {
	pc(req.params.name, res);
})

app.post('/upload', (req : Request, res : Response) => {
	upload(req, res)
})

app.get('/*', (req : Request, res : Response) => {
	res.status(400).send('Bad request');
})