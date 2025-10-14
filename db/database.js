
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'bansal_user', 
  password: 'Ban@@sal',
  database: 'bansal_db', 
  connectionLimit: 10, 
  port:3306,
});


module.exports = pool;
