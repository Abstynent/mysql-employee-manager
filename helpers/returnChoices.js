const db = require('../db/connection.js');
const util = require('util');
const queryPromise = util.promisify(db.query).bind(db);

// function to get list of selected data and turn into array of objects that can be used in prompt as choices
module.exports = returnChoices = async (option) => {
    switch(option) {
        case "departments":
            try {
                let results = await queryPromise(`SELECT * FROM department ORDER BY department_name ASC`)
                results = results.map((department) => {
                    return {
                        name: department.department_name,
                        value: department.id,
                    };
                });
            
                return results;
            } catch (error) {
            console.error(error);
            }
            break;
            
        case "managers":
            let managers = await returnChoices("employees");
                managers.unshift(
                    {
                        name: '⚪️ No manager',
                        value: null,
                    });

            return managers;
            break;

        case "actualManagers":
            try {
                let results = await queryPromise(`SELECT first_name, last_name, id FROM employee WHERE (id IN (SELECT manager_id FROM employee)) ORDER BY first_name`);
                results = results.map((actualManagers) => {
                    return {
                        name: actualManagers.first_name + ' ' + actualManagers.last_name,
                        value: actualManagers.id,
                    }
            });
            return results;
            } catch (error) {
                console.error(error);
            }
            break;

        case "roles":
            try {
                let results = await queryPromise(`SELECT * FROM roles ORDER BY title ASC`);
                results = results.map((roles) => {
                    return {
                        name: roles.title,
                        value: roles.id,
                    };
                });

                return results;
            } catch (error) {
                console.error(error);
            }
            break;

        case "employees":
            try {
                let results = await queryPromise(`SELECT first_name, last_name, id FROM employee ORDER BY first_name ASC`);
                results = results.map((employee) => {
                    return {
                        name: employee.first_name + ' ' + employee.last_name,
                        value: employee.id,
                    }
                })

                return results;
            } catch (error) {
                console.error(error);
            }
            break;
    }
}