const mySql = require("mysql");

const connection = mySql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "F!r3T35tH3rtLocker",
    database: "employees_db"

});

connection.connect((err) =>{
    if(err) throw err;
    console.log("Connected as "+ connection.threadId)
})

module.exports = connection;