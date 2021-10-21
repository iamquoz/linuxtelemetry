import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'

import regular from "./regular";
import admin from "./admin";

import upload from "./responces/upload"

import {login} from "./auth"

const app = express();

const port = process.env.port || 5000;
const secret = process.env.secret || "secret";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(secret));
app.use(cors());
app.listen(port, () => console.log(`ready, port = ${port}`));


// POST
// /upload
// add info from the request into the db
app.post('/upload', (req: Request, res: Response) => {
	upload(req, res)
})

// GET
// /auth/login
// checks if the user is logged in
app.get('/auth/login', (req: Request, res: Response) => {
	if (req.signedCookies.user)
		res.status(200).send(req.signedCookies.user)
	else
		res.status(401).end();
})

// POST
// /auth/logout
// removes the auth cookie
app.post('/auth/logout', (req: Request, res: Response) => {
	res.clearCookie('user').end();
})

// POST
// /auth/login
// auth the user
app.post('/auth/login', (req: Request, res: Response) => {
	login(req, res);
})

app.use('/api', regular);
app.use('/admin', admin);

// wildcard route
app.get('/*', (req: Request, res: Response) => {
	res.status(400).json({ message: 'Bad request'});
})
