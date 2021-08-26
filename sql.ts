import { Pool, QueryResult } from "pg";

import { pcEvent } from "./interfaces";

require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'course',
    password: process.env.pw,
    port: 5432
})

function insert(pcname: string, time: string, app: string) : Promise<QueryResult<pcEvent>> {
    return pool.query('INSERT INTO activity(pcname, time, app) VALUES($1, $2, $3)', [pcname, parseInt(time), app]);
}

function allpcs() : Promise<QueryResult<pcEvent>> {
    return pool.query('SELECT DISTINCT pcname FROM activity');
}

function indivpc(pcname: string | string[]) : Promise<QueryResult<pcEvent>> {
    if (Array.isArray(pcname)) 
        pcname = pcname[0];
    
    return pool.query('SELECT * FROM activity WHERE pcname = $1', [pcname]);
}

export {insert, allpcs, indivpc};