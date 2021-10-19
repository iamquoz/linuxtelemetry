import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { usercred, changepw, adduser, check } from "./sql";

const saltRounds = 10;

function login(req: Request, res: Response) {
	const username: string = req.body.username;
	const password: string = req.body.password;

	if (username.length !== 0 && password.length !== 0)
		usercred(username)
			.then(result => {
				bcrypt.compare(password, result.rows[0].hash)
					.then(bool => bool 
						? res.status(200).cookie('user', username, { httpOnly: true, signed: true })
						  .json({ message: 'Success' })
						: res.status(401).json({ message: 'Wrong password' }))
					.catch(err => {res.status(500).json(err)});
			})
			.catch(_ => res.status(404).json({ message: 'Account doesn`t exist' }));
	else 
		res.status(400).end();
}

function register(req: Request, res: Response) {
	const username: string = req.body.username;
	const password: string = req.body.password;

	if (username.length !== 0 && password.length !== 0)
		check(username).then(result => {
			if (result.rows.length === 0)
				bcrypt.hash(password, saltRounds)
					.then(hash => {
							adduser(username, hash);
							res.status(200).json({ message: 'Success'});
						})
					.catch(err => res.status(500).json(err));		
			else 
				res.status(403).json({ message: 'User already exists' });
		})
	else 
		res.status(400).end();
}

function update(req: Request, res: Response) {
	const username: string = req.signedCookies.user;
	const password: string = req.body.password;

	const account: string = req.body.name;
	const resetting: boolean = req.body.reset;

	if (username.length !== 0 && password.length !== 0)
		bcrypt.hash(password, saltRounds)
			.then(hash => {
				changepw(resetting ? username : account, hash)
					.then(_ => res.status(200).json({ message: 'Success'}))
					.catch(err => res.status(500).json(err));		
			})
	else 
		res.status(400).end();
}


export {login, register, update};