//get the client
import mysql from 'mysql2/promise';

console.log("Creating connection pool...")
//creat the connection to database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 't&land'
});

export default pool;