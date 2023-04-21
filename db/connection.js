const mysql = require('mysql2');
module.exports = db = mysql.createConnection(
    {
        host: 'localhost',
        user: '', // enter your mysql username
        password: '', // enter your password
        database: 'employee_db'
      },
)
