// @ts-nocheck
const { Pool } = require('pg');


require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'course',
    password: process.env.pw,
    port: 5432
})

function insert(pcname: string, time: string, app: string) {

    pool.query('INSERT INTO activity(pcname, time, app) VALUES($1, $2, $3)', [pcname, parseInt(time), app],  
        (err, res) => {
        if (err) {
            console.log(err);
        }
    })
}

function allpcs() : Promise {
    return pool.query('SELECT DISTINCT pcname FROM activity');
}

function indivpc(pcname: string) : Promise {
    return pool.query('SELECT * FROM activity WHERE pcname = $1', [pcname]);
}

export {insert, allpcs, indivpc};