import { Request, Response } from "express";

import pc from './responces/pc'
import upload from './responces/upload'
import pcs from "./responces/pcs";

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const port = process.env.port || 5000;
app.listen(port, () => console.log('ready'));

app.get('/pcs', (req, res) => {
	pcs(req, res);
})

app.get('/pc/:name', (req, res) => {
	pc(req.params.name, res);
})

app.post('/upload', (req, res) => {
	upload(req, res)
})