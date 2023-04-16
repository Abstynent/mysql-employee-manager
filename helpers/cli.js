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
        message: 'Enter new department name:',
        validate: async () => {
            return input.length >= 3 ? true : 'Incorrect input. Must be at least 3 characters.';
        }
    }
};