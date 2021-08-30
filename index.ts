import express, { Request, Response } from "express";

import pc from "./responces/pc"
import upload from "./responces/upload"
import pcs from "./responces/pcs";
import auth, {register, update} from "./auth"


const app = express();
const router = express.Router();
const port = process.env.port || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.listen(port, () => console.log('ready'));

// GET
// /api/pc
// get list of all available pcs
// requires auth
router.get('/pc', (req: Request, res: Response) => {
	pcs(res);
})

// GET
// /api/pc/:pcname
// get individual stats for pc with the name pcname
// requires auth
router.get('/pc/:name', (req: Request, res: Response) => {
	pc(req, res);
})

// POST
// /api/update
// change password of the currently logged in user
// requires auth
router.post('/update', (req: Request, res: Response) => {
	update(req, res);
})

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

})

// POST 
// /register
// register the user
app.post('/register', (req: Request, res: Response) => {
	register(req, res);
})

app.use('/api', auth, router);


// wildcard route
app.get('/*', (req: Request, res: Response) => {
	res.status(400).send('Bad request');
})
