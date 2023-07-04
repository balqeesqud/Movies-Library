const pg = require('pg');
const {DATABASE_URL}=require('./config');
const client = new pg.Client(DATABASE_URL);

module.exports=client; 
