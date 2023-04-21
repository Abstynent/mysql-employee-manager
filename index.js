const { prompt } = require('inquirer'); // import prompt
const cli = require('./helpers/cli.js'); // import prompt messages for cms
const db = require('./db/connection.js'); // connect to DB
const cTable = require('console.table'); // display tables nicely
const clear = require('clear'); // clear the screen
const mapChoices = require('./helpers/mapChoices.js'); // get array of objects from mysql

const clearThenLogo = () => {
    clear();
    console.log(cli.logo);
};

const convertToTable = (data) => {
    clearThenLogo();
    const table = cTable.getTable(data);
    console.table('\n' + table);
    init();
};

db.connect((err) => {
    err ? console.error(err) : init();
});

clearThenLogo();

const init = () => {
    prompt(cli.options).then((data) => {
        switch(data.userChoice) {
            case 'viewOption':      viewMenu();    break;
            case 'addOption':       addMenu();     break;
            case 'updateOption':    updateMenu();  break;
            case 'deleteOption':    deleteMenu();  break;
            case 'exit':            exitFunc();    break;
        };
    });
};

// VIEW MENU
// ##########################################################################################################
const viewMenu = () => {
    prompt(cli.viewOptions).then((selection) => {
        switch(selection.selectedViewOption) {
            case 'viewAllDepartments':        viewAllDepartments();         break;
            case 'viewAllRoles':              viewAllRoles();               break;
            case 'viewAllEmployees':          viewAllEmployees();           break;
            case 'viewEmployeesByDepartment': viewEmployeesByDepartment();  break;
            case 'viewEmployeesByManager':    viewEmployeesByManager();     break;
            case 'viewDepartmentBudget':      viewDepartmentBudget();       break;
            case 'goBack':                    init();                       break;
        };
    });
};

// ADD MENU
// ##########################################################################################################
const addMenu = () => {
    prompt(cli.addOptions).then((selection) => {
        switch(selection.selectedAddOption) {
            case 'addDepartment':   addNewDepartment();    break;
            case 'addRole':         addNewRole();          break;
            case 'addEmployee':     addNewEmployee();      break;
            case 'goBack':          init();                break;
        };
    });
};

// UPDATE MENU
// ##########################################################################################################
const updateMenu = () => {
    prompt(cli.updateOptions).then((selection) => {
        switch(selection.selectedUpdateOption) {
            case 'updateEmployeeRole':    updateEmployeeRole();    break;
            case 'updateEmployeeManager': updateEmployeeManager(); break;
            case 'goBack':                init();                  break;
        }
    })
};
// DELETE MENU
// ##########################################################################################################
const deleteMenu = () => {
    prompt(cli.deleteOptions).then((selection) => {
        switch(selection.selectedDeleteOption) {
            case 'deleteDepartment':    deleteDepartment();     break;
            case 'deleteRole':          deleteRole();           break;
            case 'deleteEmployee':      deleteEmployee();       break;
            case 'goBack':              init();                 break;
        }
    })
};
// Exit function
// ##########################################################################################################
const exitFunc = () => {
    clear();
    db.end();
    console.log('Goodbye! 👋');
};


// VIEW ALL DEPARTMENTS
// ##########################################################################################################
const viewAllDepartments = () => {
    db.query('SELECT * FROM department ORDER BY id', (err, results) => {
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
        ON roles.department_id = department.id
        ORDER BY roles.title ASC`,

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
                    INNER JOIN department ON roles.department_id = department.id
                    ORDER BY employee.first_name ASC`, (err, results) => {
                    convertToTable(results);
                }
                );
};

// ADD NEW DEPARTMENT
// ##########################################################################################################
// I am prompted to enter the name of the 
// department and that department is added to the database
const addNewDepartment = () => {
    prompt([
        {
        type: 'input',
        name: 'department_name',
        message: 'Enter new department name:',
        validate: async (input) => {
            return input.length >= 3 ? true : 'Incorrect input. Must be at least 3 characters.';
        }
    }
    ]).then((data => {
        db.query(`INSERT INTO department (department_name) VALUES ("${data.department_name}")`, (err, results) => {
            if(err) {
                clearThenLogo();
                console.error(`\n\n❌ Unable to add new department. Entered name cannot be empty or duplicated.\n`);
                init();
            } else {
                clearThenLogo();
                console.log(`\n\n✅ New department ${data.department_name} added!\n`);
                init();
            }
        })
    }))
};

// ADD NEW ROLE
// ##########################################################################################################
// I am prompted to enter the name, salary, 
// and department for the role and that role is added to the database
const addNewRole = async () => {
    const departments = await mapChoices("departments");
    
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
            choices: departments
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

        clearThenLogo();
        console.log(`\n✅ New role added: ${answers.title}.\n`)
        init();
    });
}
// ADD NEW EMPLOYEE
// ##########################################################################################################
// I am prompted to enter the employee’s first name,
//  last name, role, and manager, and that employee is added to the database
const addNewEmployee = async () => {
    const roles = await mapChoices("roles");
    const managers = await mapChoices("managers");

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
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select manager from the list:',
            choices: managers
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
        clearThenLogo();
        console.log(`\n✅ New employee added!\n`)
        init();
    }) // end of prompt
};

// UPDATE EMPLOYEE ROLE
// ##########################################################################################################
// I am prompted to select an employee to
//  update and their new role and this information is updated in the database 
const updateEmployeeRole = async() => {
    const employees = await mapChoices("employees");
    const roles = await mapChoices("roles");

    prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select employee from the list:',
            choices: employees
        }
    ]).then((selectedEmployee) => {
        prompt([
            {
                type: 'list',
                name: 'newRole',
                message: `Select new role for ${selectedEmployee.employee}: `,
                choices: roles
            }
        ]).then((role) => {
            db.query(`UPDATE employee SET role_id = ${role.newRole} WHERE id = ${selectedEmployee.employee}`, (err) => {
                if(err) {
                    console.error(err);
                } else {
                    clearThenLogo();
                    console.log(`\n✅ Role for updated.\n`)
                }
                init();
            });
        });
    });
}

// UPDATE AN EMPLOYEE MANAGER
// ##########################################################################################################
const updateEmployeeManager = async () => {
    const employees = await mapChoices("employees");

    prompt([
        {
            type: 'list',
            name: 'selectedEmployee',
            message: 'Select an employee to update:',
            choices: employees
        },
        {
            type: 'list',
            name: 'selectedManager',
            message: 'Select a manager that this employee has to report to:',
            choices: employees
        }
    ]).then((answers) => {
        db.query(`UPDATE employee SET manager_id = ${answers.selectedManager} WHERE id = ${answers.selectedEmployee}`, (err) => {
            if(err) {
                console.error(err);
            } else {
                clearThenLogo();
                console.log(`\n✅ Manager for ${answers.selectedEmployee} updated to ${answers.selectedManager}.\n`)
            }
            init();
        });
    });
};

// VIEW EMPLOYEES BY MANAGER
// ##########################################################################################################
const viewEmployeesByManager = async () => {
    const managers = await mapChoices("actualManagers");

    prompt([
        {
            type: 'list',
            name: 'manager',
            message: 'Select manager to view his team:',
            choices: managers
        }
    ]).then((selectedManager) => {
        db.query(`SELECT e.first_name, e.last_name, r.title FROM employee e 
                  INNER JOIN roles r ON e.role_id = r.id 
                  WHERE manager_id = ${selectedManager.manager}
                  ORDER BY e.first_name`, (err, results) => {
            convertToTable(results);
        });
    });
};

// VIEW EMPLOYEES BY DEPARTMENT
// ##########################################################################################################
const viewEmployeesByDepartment = async () => {
    const departments = await mapChoices("departments");

    prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Select department to view all employees:',
            choices: departments
        }
    ]).then((selectedDepartment) => {
        db.query(`SELECT e.first_name, e.last_name, r.title
                  FROM employee e 
                  INNER JOIN roles r ON e.role_id = r.id 
                  WHERE department_id = ${selectedDepartment.department}
                  ORDER BY e.first_name ASC`, (err, results) => {
                    if(err) throw new Error(err);
                    convertToTable(results);
                  });
    });
};
// DELETE DEPARTMENT
// ##########################################################################################################
const deleteDepartment = async () => {
    const departments = await mapChoices("departments");

    prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Select department to delete (it will delete all roles and employees from selected department)',
            choices: departments
        }
    ]).then((selectedDepartment) => {
        db.query(`DELETE FROM department WHERE id = ${selectedDepartment.department}`, (err) => {
            if(err) {
                throw err;
            } else {
                clearThenLogo();
                console.log(`\n\n✅ Department ID: ${selectedDepartment.department} deleted.\n\n`);
                init();
            };
        });
    });
};

// DELETE ROLE
// ##########################################################################################################
const deleteRole = async () => {
    const roles = await mapChoices("roles");

    prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Select role to delete (it will delete all employees in that role)',
            choices: roles
        }
    ]).then((selectedEmployee) => {
        db.query(`DELETE FROM roles WHERE id = ${selectedEmployee.role}`, (err) => {
            if(err) {
                throw new Error(err);
            } else {
                clearThenLogo();
                console.log(`\n\n✅ Role ID: ${selectedEmployee.role} deleted.\n\n`);
                init();
            };
        });
    });
};

// DELETE EMPLOYEE
// ##########################################################################################################
const deleteEmployee = async () => {
    const employees = await mapChoices("employees");

    prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select employee to delete:',
            choices: employees
        }
    ]).then((selectedEmployee) => {
        db.query(`DELETE FROM employee WHERE id = ${selectedEmployee.employee}`, (err) => {
            if(err) {
                throw err;
            } else {
                clearThenLogo();
                console.log(`\n\n✅ Employee ID: ${selectedEmployee.employee} deleted.\n\n`);
                init();
            };
        });
    });
};

// VIEW BUDGET
// ##########################################################################################################
const viewDepartmentBudget = () => {
    db.query(`SELECT d.department_name AS Department, 
                SUM(r.salary) AS "Total Budget" 
              FROM employee AS e 
              LEFT JOIN roles AS r ON e.role_id = r.id
              LEFT JOIN department AS d ON r.department_id = d.id
              GROUP BY d.id`,

                (err, results) => {
                    if(err) throw new Error(err);
                    convertToTable(results);
                  });
};
