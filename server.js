//connect to db 
const inquirer = require ('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const departmentsArr = ['Marketing', 'Engineering', 'Finance', 'Sales', 'HR'];


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: '#Hbunny12',
  database: 'employee_tracker_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');

  // call prompt user???
   promptUser()
});


// inquirer prompt logic? 
const promptUser = function() {
    inquirer .prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'menu',
        choices: ['view all departments', 'view all roles', 'view all employees', 'view employees by manager', 'view employees by department','view total utilized budget of a department', 'add a department', 'add a role', 'add an employee', 'update an employee role','update employee manager', 'delete department', 'delete role', 'delete employee']
    })
    .then(answer => {
        // user feedback comes from name 
        // Use user feedback for... whatever!!
        console.log(answer)
        if (answer.menu === 'view all departments') {

            connection.query(`SELECT * FROM department`, function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                connection.end();
            });
        }
        if (answer.menu === 'view all roles') {
            //WHEN I choose to view all roles
            // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
            
            connection.query(`SELECT  role.title, role.id AS role_id,department.name AS department, role.salary
            FROM role 
            LEFT JOIN department ON department.id = role.department_id`, function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                connection.end();
            });
        }
        if (answer.menu === 'view all employees') {
        //WHEN I choose to view all employees
        //THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees reports to
            connection.query(
                `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id
                FROM employee
                LEFT JOIN role ON role.id = employee.role_id
                LEFT JOIN department ON department.id = role.department_id
                `, function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                connection.end();
            });
        }
        if (answer.menu === 'add a department') {
            inquirer.prompt(
                {
                    type: 'input',
                    name: 'department',
                    message: `What department would you like to add?`,
                    validate: Input => {
                        if (Input){
                            return true;
                        } else {
                            console.log(`Please enter a name!`);
                            return false;
                        }
                    }
                }
            ).then(answer => {
                console.log(answer);
                // pushing added departments into an array so I can use them when a new role is added and I need to present department choices that the role will be added upder 
                departmentsArr.push(answer.department);
                console.log(departmentsArr);

                console.log('Inserting a new department...\n');
               connection.query(
                    'INSERT INTO department SET ?',
                    {
                    name: `${answer.department}`
                    },
                    function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' department inserted!\n');
                    }
                );
                return promptUser();
            })    
            
        }
        if (answer.menu === 'add a role') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: `What is the title of the role?`,
                    validate: Input => {
                        if (Input){
                            return true;
                        } else {
                            console.log(`Please enter title!`);
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: `What is the salary for this position?`,
                    validate: Input => {
                        if (Input){
                            return true;
                        } else {
                            console.log(`Please enter a salary!`);
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    message: 'What department does this role belong to?',
                    name: 'department',
                    choices: departmentsArr
                }
            ]).then(answer => {
                console.log(answer);
                // answer = { title: 'Account Dev Rep', salary: '60000', department: 'Marketing' }

                // loop through the departmentArr and find a match and set that index+1 to the department_id that you will insert into the table 
                for(var i= 0; i < departmentsArr.length; i++) {
                    if (answer.department === departmentsArr[i]){
                        var departmentId = parseInt([i+1])
                        console.log(departmentId);
                    }
                }
                
                    console.log('Inserting a new role...\n');
                    connection.query(
                        'INSERT INTO role SET ?',
                        {
                        title: answer.title,
                        salary: answer.salary ,
                        department_id: departmentId 
                        },
                        function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + ' role inserted!\n');
                        }
                    );
                return promptUser();
            })    
            
        }
        
    })
}
 



// connection.query(
//     `INSERT INTO department (name) 
//     VALUES (?)`,
//     answers.department,

//     function(err, results, fields) {
//     console.log(results); // results contains rows 
//     //returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
    
//     }
// );