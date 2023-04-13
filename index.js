// SET YOU USERNAME AND PASSWORD
// const db = mysql.createConnection(
//     {
//       host: 'localhost', 
//       user: 'root',
//       password: '',
//       database: 'classlist_db'
//     },
//     console.log(`Connected to the classlist_db database.`)
//   );

const { prompt } = require('inquirer');
const cli = require('./cli.js')

const init = () => {
    console.log(cli.logo);
    prompt(cli.options).then((data) => {
        switch(data.userChoice) {
            case cli.options.choices[0]: // View all departments
                break;
    
            case cli.options.choices[1]: // View all roles
                break;
    
            case cli.options.choices[2]: // View all employees
                break;
    
            case cli.options.choices[3]: // Add a department
                break;  
    
            case cli.options.choices[4]: // Add a role
                break;
    
            case cli.options.choices[5]: // Add an employee
                break;
    
            case cli.options.choices[6]: // Update an employee role
                break;             
        }

    })
}

init();