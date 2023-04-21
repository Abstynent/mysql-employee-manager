// cli object to hold all main prompt questions
module.exports = cli = {
    options: {
        type: 'list',
        name: 'userChoice',
        message: 'Select an option to see more options:',
        choices: [
            { name: '🔎 View...', value: 'viewOption' },
            { name: '➕ Add...', value: 'addOption'},
            { name: '📝 Update...', value: 'updateOption' },
            { name: '❌ Delete...', value: 'deleteOption' },
            { name: '🔴 EXIT', value: 'exit' }
        ]
    },
    viewOptions: {
        type: 'list',
        name: 'selectedViewOption',
        message: '🔎 VIEW OPTIONS:',
        choices: [
            { name: 'View all departments', value: 'viewAllDepartments' },
            { name: 'View all roles', value: 'viewAllRoles' },
            { name: 'View all employees', value: 'viewAllEmployees' },
            { name: 'View employees by department', value: 'viewEmployeesByDepartment' },
            { name: 'View employees by manager', value: 'viewEmployeesByManager' },
            { name: 'View the total utilized budget of department', value: 'viewDepartmentBudget' },
            { name: '🔙 BACK', value: 'goBack' }
        ]
    },
    addOptions: {
        type: 'list',
        name: 'selectedAddOption',
        message: '➕ ADD OPTIONS:',
        choices: [
            { name: 'Add a department', value: 'addDepartment' },
            { name: 'Add a role', value: 'addRole' },
            { name: 'Add an employee', value: 'addEmployee' },
            { name: '🔙 BACK', value: 'goBack' }
        ]
    },
    updateOptions: {
        type: 'list',
        name: 'selectedUpdateOption',
        message: '📝 UPDATE OPTIONS:',
        choices: [
            { name: 'Update an employee role', value: 'updateEmployeeRole' },
            { name: 'Update an employee manager', value: 'updateEmployeeManager' },
            { name: '🔙 BACK', value: 'goBack' }
        ]
    },
    deleteOptions: {
        type: 'list',
        name: 'selectedDeleteOption',
        message: '🚮 DELETE OPTIONS:',
        choices: [
            { name: 'Delete a department', value: 'deleteDepartment' },
            { name: 'Delete a role', value: 'deleteRole' },
            { name: 'Delete an employee', value: 'deleteEmployee' },
            { name: '🔙 BACK', value: 'goBack' }
        ]
    },
    logo: `
    --------------------------------------------------------------------
     _____           _                    _____                         
    |   __|_____ ___| |___ _ _ ___ ___   |     |___ ___ ___ ___ ___ ___ 
    |   __|     | . | | . | | | -_| -_|  | | | | .'|   | .'| . | -_|  _|
    |_____|_|_|_|  _|_|___|_  |___|___|  |_|_|_|__,|_|_|__,|_  |___|_|  
                |_|       |___|                            |___|        
               
    --------------------------------------------------------------------`,
};