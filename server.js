//connect to db 
const inquirer = require ('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const viewDepartments = require('./lib/Department');

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
        if (answer.menu === 'view employees by manager') {
        
            
            
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