// TABLE activity
// pcid integer
// time bigint 
// app varchar 
// innerid integer (primary key)

// TABLE users
// username varchar 
// hash varchar
// perms int[]

// TABLE pcs
// pcid integer (pkey)
// pcname text
// note text
// clearance int

// TABLE permissions
// permid integer
// permname text

import { Pool, QueryResult } from "pg";

import { pcEvent, permissions, user, pc } from "./interfaces";

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

function allpcs(username: string) : Promise<QueryResult<pc>> {
    return pool.query('SELECT pcname, pcid, note, clearance FROM pcs INNER JOIN users ON pcs.clearance = ANY(users.perms) WHERE $1 = users.username UNION SELECT pcname, pcid, note, clearance FROM pcs WHERE $1 = \'admin\' ORDER BY pcid', [username]);
}

function indivpc(pcid: number | number[], before: number, after: number) : Promise<QueryResult<pcEvent>> {
    if (Array.isArray(pcid)) 
        pcid = pcid[0];
    
    return pool.query('SELECT * FROM activity WHERE pcid = $1 AND "time" BETWEEN $3 AND $2', [pcid, before, after]);
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

function users() : Promise<QueryResult<user>> {
    return pool.query('SELECT username, ARRAY_AGG(permissions.permname) AS perms FROM users LEFT JOIN permissions ON permissions.permid = ANY(users.perms) GROUP BY username');
}

function perms() : Promise<QueryResult<permissions>> {
    return pool.query('SELECT * FROM permissions ORDER BY permid');
}

function perm(permid: number) : Promise<QueryResult<permissions>> {
    return pool.query('SELECT * FROM permissions WHERE permid = $1', [permid]);
}

function deleteperm(permid: number) : Promise<QueryResult<permissions>> {
    return pool.query('DELETE FROM permissions WHERE permid = $1', [permid]);
}

function addpermgroup(permission: string) : Promise<QueryResult<permissions>> {
    return pool.query('INSERT INTO permissions(permname) VALUES ($1) RETURNING *', [permission]);
}

function giveperms(username: string, permid: number) : Promise<QueryResult<user>> {
    return pool.query('UPDATE users SET perms = ARRAY_APPEND(perms, $2) WHERE username = $1 RETURNING *', [username, permid]);
}

function removeperms(username: string, permid: number) : Promise<QueryResult<user>> {
    return pool.query('UPDATE users SET perms = (SELECT array(unnest(perms) EXCEPT SELECT unnest(\'{$2}\'::int[])))', [username, permid]);
}

function deletepc(pcid: number) : Promise<QueryResult<pc>> {
    return pool.query('DELETE FROM pcs WHERE pcid = $1 RETURNING *', [pcid])
}

function addnote(pcid: number, text: string) : Promise<QueryResult<pc>> {
    return pool.query('UPDATE pcs SET note = $2 WHERE pcid = $1 RETURNING *', [pcid, text]);
}

function addclearance(pcid: number, clearance: number) : Promise<QueryResult<pc>> {
    return pool.query('UPDATE pcs SET clearance = $2 WHERE pcid = $1', [pcid, clearance]);
}

function allusersforperm(permid: number) : Promise<QueryResult<user>> {
    return pool.query('SELECT username, perms FROM users WHERE $1 = ANY(perms)', [permid]);
}

function allpcsforperm(permid: number) : Promise<QueryResult<pc>> {
    return pool.query('SELECT * FROM pcs WHERE clearance = $1 UNION SELECT * FROM pcs WHERE $1 = 0', [permid]);
}

export {insert, allpcs, indivpc, usercred, adduser, changepw, check, users, perms, perm, addpermgroup, deleteperm, giveperms, removeperms, deletepc, addnote, addclearance, allusersforperm, allpcsforperm};