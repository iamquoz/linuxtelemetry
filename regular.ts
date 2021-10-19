import express, { Request, Response } from "express";
import pc from "./responces/pc"
import pcs from "./responces/pcs";
import { update } from "./auth";

const regular = express.Router();

// check if a cookie is present for protected routs
regular.use((req: Request, res: Response, next: express.NextFunction) => {
	if (!req.signedCookies.user) 
		res.status(401).json({ message: 'Unauthorized'})
	else 
		next();
})

// GET
// /api/pc
// get list of all available pcs
regular.get('/pc', (req: Request, res: Response) => {
	pcs(req, res);
})

// GET
// /api/pc/:pcname
// get individual stats for pc with the name pcname
regular.get('/pc/:name', (req: Request, res: Response) => {
	pc(req, res);
})

// POST
// /api/update
// change password of the currently logged in user
regular.post('/update', (req: Request, res: Response) => {
	update(req, res);
})

export default regular;
