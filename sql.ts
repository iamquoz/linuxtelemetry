// TABLE activity
// pcname varchar 
// time bigint 
// app varchar 
// innerid integer (primary key)

// TABLE users
// username varchar 
// hash varchar

import { Pool, QueryResult } from "pg";

import { pcEvent, user } from "./interfaces";

require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'course',
    password: process.env.pw,
    port: 5432
})

function insert(pcname: string, time: string, app: string) : Promise<QueryResult<pcEvent>> {
    return pool.query('INSERT INTO activity(pcname, time, app) VALUES($1, $2, $3) RETURNING *', [pcname, parseInt(time), app]);
}

function allpcs() : Promise<QueryResult<pcEvent>> {
    return pool.query('SELECT DISTINCT pcname FROM activity');
}

function indivpc(pcname: string | string[]) : Promise<QueryResult<pcEvent>> {
    if (Array.isArray(pcname)) 
        pcname = pcname[0];
    
    return pool.query('SELECT * FROM activity WHERE pcname = $1', [pcname]);
}

function usercred(username: string) : Promise<QueryResult<user>> {
	return pool.query('SELECT * FROM users WHERE username = $1', [username]);
}

function adduser(username: string, hash : string) : Promise<QueryResult<user>> {
	return pool.query('INSERT INTO users (username, hash) VALUES ($1, $2) RETURNING *', [username, hash]);
}

function changepw(username: string, hash : string) : Promise<QueryResult<user>> {
	return pool.query('UPDATE users SET hash = $2 WHERE username = $1 RETURNING *', [username, hash]);
}

function check(username: string) : Promise<QueryResult<user>> {
	return pool.query('SELECT 1 FROM users WHERE username = $1 LIMIT 1', [username]);
}

export {insert, allpcs, indivpc, usercred, adduser, changepw, check};