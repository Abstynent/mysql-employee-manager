const db = require('../db/connection.js');

module.exports = getDepartmentList = (input) => {
    db.query(`SELECT * FROM department`, (err, results) => {
        let departmentNamesArr = [];
        results.forEach((department) => {
            departmentNamesArr.push(department.department_name);
        });
        console.log(departmentNamesArr)
        return departmentNamesArr;

    });
    
}
