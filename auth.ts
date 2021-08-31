import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { usercred, changepw, adduser } from "./sql";

const saltRounds = 10;

function login(req: Request, res: Response) {
	const username: string = req.body.username;
	const password: string = req.body.password;

	if (username.length !== 0 && password.length !== 0)
		usercred(username)
			.then(result => {
				bcrypt.compare(password, result.rows[0].hash)
					.then(bool => bool 
						? res.status(200).json({ message: 'Success' })
							.cookie('user', username, { httpOnly: true, signed: true })
						: res.status(401).json({ message: 'Wrong password' }))
					.catch(err => res.status(500).json(err));
			})
			.catch(_ => res.status(404).json({ message: 'Account doesn`t exist' }));
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
	const username: string = req.signedCookies.user;
	const password: string = req.body.password;

	if (username.length !== 0 && password.length !== 0)
		bcrypt.hash(password, saltRounds)
			.then(hash => {
				changepw(username, hash)
				res.status(200).send('Success')
			})
			.catch(err => res.status(500).json(err));		
}


export {login, register, update};