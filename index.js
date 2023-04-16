const { prompt } = require('inquirer');
// const mysql = require('mysql2');
const cli = require('./helpers/cli.js')
const cTable = require('console.table');
const db = require('./db/connection.js');
const getDepartmentList = require('./helpers/sqlQuery.js');

const convertToTable = (data) => {
    const table = cTable.getTable(data);
    console.table('\n' + table);
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
            // I am presented with the job title, role id, the department 
            // that role belongs to, and the salary for that role
                db.query(`
                    SELECT roles.id, roles.title, department.department_name, roles.salary FROM roles 
                    INNER JOIN department 
                    ON roles.department_id = department.id`, (err, results) => {
                        convertToTable(results);
                });
                break;
    
            case cli.options.choices[2]: // View all employees
            // I am presented with a formatted table showing employee data, including employee ids,
            //  first names, last names, job titles, departments, salaries,
            //  and managers that the employees 
                db.query(`
                SELECT
                    employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, 
                    CONCAT(manager.first_name, " ", manager.last_name) AS "Manager"
                FROM employee AS employee
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                INNER JOIN roles ON employee.role_id = roles.id
                INNER JOIN department ON roles.department_id = department.id`, (err, results) => {
                    convertToTable(results);
                });
                break;
     
            case cli.options.choices[3]: // Add a department
            // I am prompted to enter the name of the 
            // department and that department is added to the database
                prompt(cli.addDepartment).then((data => {
                    db.query(`INSERT INTO department (department_name) VALUES ("${data.department_name}")`, (err, results) => {
                        if(err) {
                            // console.error(err);
                            console.error(`\n\n❌ Unable to add new department. Entered name cannot be empty or duplicated.`);
                        } else {
                            console.log(`✅ New department ${data.department_name} added!`)
                        }
                    })
                init();
            }))
                break;  
    
            case cli.options.choices[4]: // Add a role
            // I am prompted to enter the name, salary, 
            // and department for the role and that role is added to the database
                prompt(cli.addRole).then((data) => {
                    console.log(data);
                })
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
db.connect((err) => {
    err ? console.error(err) : init();
});