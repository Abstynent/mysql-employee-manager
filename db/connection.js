const mysql = require('mysql2');
module.exports = db = mysql.createConnection(
    {
        host: '127.0.0.1', 
        user: 'root',
        password: '152413',
        database: 'employee_db'
      },
)
