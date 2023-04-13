const { prompt } = require('inquirer');
const mysql = require('mysql2');
const cli = require('./helpers/cli.js')
const cTable = require('console.table');
// const db = require('./db/connection.js');

const db = mysql.createConnection(
    {
        host: '127.0.0.1', 
        user: 'root',
        password: '152413',
        database: 'employee_db'
      },
);

db.connect((err) => {
    err ? console.error(err) : init();
});

const convertToTable = (data) => {
    const table = cTable.getTable(data);
    console.table(table);
                        init();
}

const init = () => {
    prompt(cli.options).then((data) => {
        switch(data.userChoice) {
            case cli.options.choices[0]: // View all departments
                db.query('SELECT * FROM department', (err, results) => {
                    convertToTable(results);
                });
                break;
    
            case cli.options.choices[1]: // View all roles
                db.query('SELECT * FROM roles', (err, results) => {
                    convertToTable(results);
                });
                break;
    
            case cli.options.choices[2]: // View all employees
            // I am presented with a formatted table showing employee data, including employee ids,
            //  first names, last names, job titles, departments, salaries,
            //  and managers that the employees 
                db.query('SELECT * FROM employee', (err, results) => {
                    convertToTable(results);
                });
                break;
     
            case cli.options.choices[3]: // Add a department
            // I am prompted to enter the name of the 
            // department and that department is added to the database
                break;  
    
            case cli.options.choices[4]: // Add a role
            // I am prompted to enter the name, salary, 
            // and department for the role and that role is added to the database
                break;
    
            case cli.options.choices[5]: // Add an employee
            // I am prompted to enter the employee’s first name,
            //  last name, role, and manager, and that employee is added to the database
                break;
    
            case cli.options.choices[6]: // Update an employee role
            // I am prompted to select an employee to
            //  update and their new role and this information is updated in the database 
                break;         
            
            case cli.options.choices[7]:
                db.end();
        }

    })
}

console.log(cli.logo);