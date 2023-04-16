const { prompt } = require('inquirer');
const cli = require('./helpers/cli.js')
const db = require('./db/connection.js');
const cTable = require('console.table');

const convertToTable = (data) => {
    const table = cTable.getTable(data);
    console.table('\n' + table);
    init();
};

console.log(cli.logo);
db.connect((err) => {
    err ? console.error(err) : init();
});

const init = () => {
    prompt(cli.options).then((data) => {
        switch(data.userChoice) {
            case cli.options.choices[0]: // View all departments
                viewAllDepartments();
                break;

            case cli.options.choices[1]: // View all roles
                viewAllRoles();
                break;
    
            case cli.options.choices[2]: 
                viewAllEmployees();
                break;
     
            case cli.options.choices[3]: // Add a department
                addNewDepartment();
                break;  
    
            case cli.options.choices[4]: // Add a role
                addNewRole();
                break;
    
            case cli.options.choices[5]: // Add an employee
                    addNewEmployee();
                break;
    
            case cli.options.choices[6]: // Update an employee role
                    updateEmployeeRole();
                break;         
            
            case cli.options.choices[7]:
                db.end();
        }

    })
};

// VIEW ALL DEPARTMENTS
// ##########################################################################################################
const viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, results) => {
        convertToTable(results);
    });
};

// VIEW ALL ROLES
// ##########################################################################################################
// I am presented with the job title, role id, the department 
// that role belongs to, and the salary for that role
const viewAllRoles = () => {
    db.query(`
        SELECT roles.id, roles.title, department.department_name, roles.salary FROM roles 
        INNER JOIN department 
        ON roles.department_id = department.id`,

        (err, results) => {
            convertToTable(results);
        });
};

// VIEW ALL EMPLOYEES
// ##########################################################################################################
// View all employees I am presented with a formatted table showing employee data,
// including employee ids, first names, last names, job titles, departments,
// salaries, and managers that the employees 
const viewAllEmployees = () => {
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
};

// ADD NEW DEPARTMENT
// ##########################################################################################################
// I am prompted to enter the name of the 
// department and that department is added to the database
const addNewDepartment = () => {
    prompt(cli.addDepartment).then((data => {
        db.query(`INSERT INTO department (department_name) VALUES ("${data.department_name}")`, (err, results) => {
            if(err) {
                console.error(`\n\n❌ Unable to add new department. Entered name cannot be empty or duplicated.`);
            } else {
                console.log(`✅ New department ${data.department_name} added!`)
            }
        })
    init();
    }))
};

// ADD NEW ROLE
// ##########################################################################################################
// I am prompted to enter the name, salary, 
// and department for the role and that role is added to the database
const addNewRole = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        if(err) console.error(err);

        results = results.map((department) => {
            return {
                name: department.department_name,
                value: department.id,
            };
        });

            prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter new role title:',
                    validate: async (input) => {
                        return input.length >= 3 ? true : 'Incorrect input. Must be at least 3 characters.';
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter salary for the new role:',
                    validate: async (input) => {
                        return isNaN(input) ? 'Entered value is not a number.' : true;
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select a department:',
                    choices: results
                }
            ]).then((answers) => {
                db.query(`INSERT INTO roles SET ?`,
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: answers.department
                },
                (err) => {
                    if (err) console.error(err);
                });
                console.log(`\n✅ New role added: ${answers.title}.\n`)
                init();
            });
    })
};

// ADD NEW EMPLOYEE
// ##########################################################################################################
// I am prompted to enter the employee’s first name,
//  last name, role, and manager, and that employee is added to the database
const addNewEmployee = () => {
    db.query('SELECT * FROM roles', (err, rolesResult) => {
        if(err) console.error(err);

        rolesResult = rolesResult.map((roles) => {
            return {
                name: roles.title,
                value: roles.id,
            }
        }); // end of roles.map
        
        db.query(`SELECT first_name, last_name, id 
              FROM employee
              WHERE 
              (id IN (SELECT manager_id FROM employee))`,
            (err, managerResults) => {
                if(err) console.error(err);
                managerResults = managerResults.map((manager) => {
                    return {
                        name: manager.first_name + ' ' + manager.last_name,
                        value: manager.id,
                    };
                })
                managerResults.push(
                    {
                        name: '⚪️ No manager',
                        value: null,
                    });

                prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'Enter first name:',
                        validate: async (input) => {
                            return input.length >= 2 ? true : 'Entered name must be at least 2 characters long.';
                        }
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Enter last name:',
                        validate: async (input) => {
                            return input.length >= 2 ? true: 'Entered name must be at least 2 characters long';
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Select role for the new employee:',
                        choices: rolesResult
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select manager from the list:',
                        choices: managerResults
                    }
                ]).then((answers) => {
                    db.query(`INSERT INTO employee SET ?`, 
                    {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: answers.role,
                        manager_id: answers.manager
                    },
                    (err) => {
                        if (err) console.error(err);
                    });
                    console.log(`\n✅ New employee added!\n`)
                    init();
                }) // end of prompt
              })
    }) // end of query select all roles
};

// UPDATE EMPLOYEE ROLE
// ##########################################################################################################
// I am prompted to select an employee to
//  update and their new role and this information is updated in the database 
const updateEmployeeRole = () => {
    db.query(`SELECT * FROM employee`, (err, employeeResults) => {
        if(err) console.error(err);

        employeeResults = employeeResults.map((employee) => {
            return {
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id,
            };
        });

        db.query(`SELECT * FROM roles`, (err, rolesResults) => {
            if(err) console.error(err);

            rolesResults = rolesResults.map((roles) => {
                return {
                    name: roles.title,
                    value: roles.id,
                };
            });

            prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select employee from the list:',
                    choices: employeeResults
                }
            ]).then((selectedEmployee) => {
                prompt([
                    {
                        type: 'list',
                        name: 'newRole',
                        message: `Select new role for ${selectedEmployee.employee}: `,
                        choices: rolesResults
                    }
                ]).then((role) => {
                    db.query(`UPDATE employee SET role_id = ${role.newRole} WHERE id = ${selectedEmployee.employee}`, (err) => {
                        if(err) {
                            console.error(err);
                        } else {
                            console.log(`\n✅ Role for updated.\n`)
                        }
                        init();
                    } );
                })
            })
        })
    }) // end of select employee query
};