const mysql = require('mysql2');
module.exports = db = mysql.createConnection(
    {
        host: 'localhost', 
        user: 'root',
        password: '152413',
        database: 'employee_db'
      },
)
