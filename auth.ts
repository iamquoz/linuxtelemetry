import basicAuth from "express-basic-auth"
import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { usercred, changepw, adduser } from "./sql";

const saltRounds = 10;
const auth = basicAuth({
	authorizeAsync: true,
	authorizer: login,
	// temp 
	challenge: true,
})

async function login(username: string, password: string, cb: basicAuth.AsyncAuthorizerCallback) {
	const result = await usercred(username);

	const match = await bcrypt.compare(password, result.rows[0].hash);
	
	if (match)
		cb(null, true);
	else 
		cb(null, false);
}

function register(req: Request, res: Response) {
	const username: string = req.body.username;
	const password: string = req.body.password;

	if (username.length !== 0 && password.length !== 0)
		bcrypt.hash(password, saltRounds)
			.then(hash => {
					adduser(username, hash);
					res.status(200).send('Success');
				})
			.catch(err => res.status(500).json(err));		
}

function update(req: Request, res: Response) {
	const username: string = req.body.username;
	const password: string = req.body.password;

	if (username.length !== 0 && password.length !== 0)
		bcrypt.hash(password, saltRounds)
			.then(hash => {
				changepw(username, hash)
				res.status(200).send('Success')
			})
			.catch(err => res.status(500).json(err));		
}

export default auth;
export {register, update};