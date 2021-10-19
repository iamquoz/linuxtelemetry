import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

import regular from "./regular";
import admin from "./admin";

import upload from "./responces/upload"

import {login, register, update} from "./auth"


const app = express();

const port = process.env.port || 5000;
const secret = process.env.secret || "secret";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(secret));
app.listen(port, () => console.log('ready'));


// POST
// /upload
// add info from the request into the db
app.post('/upload', (req: Request, res: Response) => {
	upload(req, res)
})

// POST
// /login
// auth the user
app.post('/login', (req: Request, res: Response) => {
	login(req, res);
})

app.use('/api', regular);
app.use('/admin', admin);

// wildcard route
app.get('/*', (req: Request, res: Response) => {
	res.status(400).json({ message: 'Bad request'});
})
