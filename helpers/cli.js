const getDepartmentList = require('../helpers/sqlQuery.js');

module.exports = cli = {
    options: {
        type: 'list',
        name: 'userChoice',
        message: 'Select an option:',
        choices: ['🔎 View all departments', '🔎 View all roles', '🔎 View all employees',
                  '➕ Add a department', '➕ Add a role', '➕ Add an employee',
                  '🔧 Update an employee role', '🔴 EXIT']
    },
    logo: `
    --------------------------------------------------------------------
     _____           _                    _____                         
    |   __|_____ ___| |___ _ _ ___ ___   |     |___ ___ ___ ___ ___ ___ 
    |   __|     | . | | . | | | -_| -_|  | | | | .'|   | .'| . | -_|  _|
    |_____|_|_|_|  _|_|___|_  |___|___|  |_|_|_|__,|_|_|__,|_  |___|_|  
                |_|       |___|                            |___|        
               
    --------------------------------------------------------------------`,

    addDepartment: {
        type: 'input',
        name: 'department_name',
        message: 'Enter new department name:'
    },
    addRole: [
        {
            type: 'input',
            name: 'title',
            message: 'Enter new role title:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary for the new role:'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Select a department:',
            choices: getDepartmentList
        }
    ]
};