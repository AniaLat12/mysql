import mysql from 'mysql';

const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
})

con.connect();

export default con;
