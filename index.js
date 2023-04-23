const { prompt } = require('inquirer'); // import prompt
const cli = require('./helpers/cli.js'); // import prompt messages for cms
const db = require('./db/connection.js'); // connect to DB
const cTable = require('console.table'); // display tables nicely
const clear = require('clear'); // clear the screen
const returnChoices = require('./helpers/returnChoices.js'); // get array of objects from mysql

// check database connection, then start main function.
// do not forget to set connection.js file with your user data
db.connect((err) => {
    err ? console.error(err) : init();
});

// clear the terminal and display logo
const clearThenLogo = () => {
    clear();
    console.log(cli.logo);
};
clearThenLogo();

// convert data to nice table using cTable
const convertToTable = (data) => {
    clearThenLogo();
    const table = cTable.getTable(data);
    console.table('\n' + table);
    init();
};

// start the app
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
    db.query('SELECT * FROM departments ORDER BY id', (err, results) => {
        convertToTable(results);
    });
};

// VIEW ALL ROLES
// ##########################################################################################################
const viewAllRoles = () => {
    db.query(`
        SELECT roles.id, roles.title, departments.department_name, roles.salary FROM roles 
        INNER JOIN departments 
        ON roles.department_id = departments.id
        ORDER BY roles.title ASC`,

        (err, results) => {
            convertToTable(results);
        });
};

// VIEW ALL EMPLOYEES
// ##########################################################################################################
const viewAllEmployees = () => {
    db.query(`
                SELECT
                    employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, 
                    CONCAT(manager.first_name, " ", manager.last_name) AS "Manager"
                    FROM employees AS employees
                    LEFT JOIN employees AS manager ON employees.manager_id = manager.id
                    INNER JOIN roles ON employees.role_id = roles.id
                    INNER JOIN departments ON roles.department_id = departments.id
                    ORDER BY employees.first_name ASC`, (err, results) => {
                    convertToTable(results);
                }
                );
};

// ADD NEW DEPARTMENT
// ##########################################################################################################
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
        db.query(`INSERT INTO departments (department_name) VALUES ("${data.department_name}")`, (err, results) => {
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
const addNewRole = async () => {
    const departments = await returnChoices("departments");
    
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
const addNewEmployee = async () => {
    const roles = await returnChoices("roles");
    const managers = await returnChoices("managers");

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
        db.query(`INSERT INTO employees SET ?`, 
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
const updateEmployeeRole = async() => {
    const employees = await returnChoices("employees");
    const roles = await returnChoices("roles");

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
            db.query(`UPDATE employees SET role_id = ${role.newRole} WHERE id = ${selectedEmployee.employee}`, (err) => {
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
};

// UPDATE AN EMPLOYEE MANAGER
// ##########################################################################################################
const updateEmployeeManager = async () => {
    const employees = await returnChoices("employees");

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
        db.query(`UPDATE employees SET manager_id = ${answers.selectedManager} WHERE id = ${answers.selectedEmployee}`, (err) => {
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
    const managers = await returnChoices("actualManagers");

    prompt([
        {
            type: 'list',
            name: 'manager',
            message: 'Select manager to view his team:',
            choices: managers
        }
    ]).then((selectedManager) => {
        db.query(`SELECT e.first_name, e.last_name, r.title FROM employees e 
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
    const departments = await returnChoices("departments");

    prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Select department to view all employees:',
            choices: departments
        }
    ]).then((selectedDepartment) => {
        db.query(`SELECT e.first_name, e.last_name, r.title
                  FROM employees e 
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
    const departments = await returnChoices("departments");

    prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Select department to delete (it will delete all roles and employees from selected department)',
            choices: departments
        }
    ]).then((selectedDepartment) => {
        db.query(`DELETE FROM departments WHERE id = ${selectedDepartment.department}`, (err) => {
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
    const roles = await returnChoices("roles");

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
    const employees = await returnChoices("employees");

    prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select employee to delete:',
            choices: employees
        }
    ]).then((selectedEmployee) => {
        db.query(`DELETE FROM employees WHERE id = ${selectedEmployee.employee}`, (err) => {
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
              FROM employees AS e 
              LEFT JOIN roles AS r ON e.role_id = r.id
              LEFT JOIN departments AS d ON r.department_id = d.id
              GROUP BY d.id`,

                (err, results) => {
                    if(err) throw new Error(err);
                    convertToTable(results);
                  });
};
