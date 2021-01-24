//connect to db 
const inquirer = require ('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');



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
        choices: ['view all departments', 'view all roles', 'view all employees', 'view employees by manager', 'view employees by department','view total utilized budget of a department', 'add a department', 'add a role', 'add an employee', 'update an employee role','update employee manager', 'delete department', 'delete role', 'delete employee','EXIT APPLICATION']
    })
    .then(answer => {
        // user feedback comes from name 
        // Use user feedback for... whatever!!
        //console.log(answer)
        if (answer.menu === 'EXIT APPLICATION'){
            connection.end()
            return
        }
        if (answer.menu === 'view all departments') {

            connection.query(`SELECT department.name AS Department FROM department`, function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                //connection.end();
                return promptUser();
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
                //connection.end();
                return promptUser();
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
                //connection.end();
                return promptUser();
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
                 
                console.log('Inserting a new department...\n');
               connection.query(
                    'INSERT INTO department SET ?',
                    {
                    name: `${answer.department}`
                    },
                    function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' department inserted!\n');
                    return promptUser(); 
                });
                
            })    
            
        }
        if (answer.menu === 'add a role') {

            // query to pull department list
            // in quirer prompts/ logic will then be in the call back of the query 
            connection.query(`SELECT * FROM department`, function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                // console.log(res);
                // console.log(res[1].id);
                // console.log(res[1].name);

                const departmentNameArr = []
               
                for (var i= 0; i <res.length; i++) {
                    // found out that inquirer needs the property name to be 'value'
                    // replace a property name with value for whatever one it will pass back
                    // in this case I changed :id to :value so inquirer knew to pass back that value in the answer
                    departmentNameArr.push({name: res[i].name, value: res[i].id})
                    // replace a property name with value for whatever one it will pass back
                  
                }

                //console.log(departmentNameArr);
                // NO NOT END THE CONNECTION UNTIL AFTER INFO IS ADDED ***************************************** do not do connection.end here!
                // NEED TO PUT INQUIRER PROMTS AND LOGIC IN THE CALL BACK FUNCTION OF QUERY*********************** 
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
                        choices: departmentNameArr
                    }
                
                ]).then(answer => {
                        console.log(answer);
                        console.log('Inserting a new role...\n');
                        connection.query(
                            'INSERT INTO role SET ?',
                            {
                            title: answer.title,
                            salary: answer.salary ,
                            department_id: answer.department
                            },
                            function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + ' role inserted!\n');
                           
                            return promptUser();
                        });
                    
                })    
            });
         }
        if (answer.menu === 'add an employee'){

            connection.query(`SELECT * FROM role`, function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                // console.log(res);
                // console.log(res[1].title)
                // console.log(res[1].id)
                const roleArr = []
               
                for (var i= 0; i <res.length; i++) {
                    // found out that inquirer needs the property name to be 'value'
                    // replace a property name with value for whatever one it will pass back
                    // in this case I changed :id to :value so inquirer knew to pass back that value in the answer
                    roleArr.push({name: res[i].title, value: res[i].id})
                    // replace a property name with value for whatever one it will pass back
                  
                }

                 //console.log(roleArr);
                
           
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first',
                        message: `What is the employee's first name?`,
                        validate: Input => {
                            if (Input){
                                return true;
                            } else {
                                console.log(`Please enter first name!`);
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'last',
                        message: `What is the employee's last name?`,
                        validate: Input => {
                            if (Input){
                                return true;
                            } else {
                                console.log(`Please enter last name!`);
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        message: `What is the employee's role?`,
                        name: 'role',
                        choices: roleArr
                    }//,
                    //{
                    //     type: 'List',
                    //     message: `Who is the employee's manager?`,
                    //     name: 'manager',
                    //     choises: // make sure choices include ' no manager'
                
                    // }
                ]).then(answer => {
                    console.log(answer);
                
                        console.log('Inserting a new employee...\n');
                        connection.query(
                            'INSERT INTO employee SET ?',
                            {
                            first_name: answer.first,
                            last_name: answer.last ,
                            role_id: answer.role,
                            //manager_id: answer.manager 
                            },
                            function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + ' employee inserted!\n');

                            return promptUser();

                            }
                        );
                    
                })
            })
        }
        if (answer.menu === 'delete department'){

            connection.query(`SELECT * FROM department`, function(err, res) {
                
                //console.log(res)

                const deleteDepArr = []

                for (var i= 0; i <res.length; i++) {
                    // found out that inquirer needs the property name to be 'value'
                    // replace a property name with value for whatever one it will pass back
                    // in this case I changed :id to :value so inquirer knew to pass back that value in the answer
                    deleteDepArr.push(res[i].name)
                    // replace a property name with value for whatever one it will pass back
                  
                }
            

                inquirer.prompt(
                    {
                        type: 'list',
                        name: 'department',
                        message: `What department would you like to delete?`,
                        // need to get list of choices from database to included added ones
                        choices: deleteDepArr
                        
                    }
                ).then(answer => {
                    //console.log(answer);
                    console.log('Deleting department...\n');
                    const query = connection.query(
                        'DELETE FROM department WHERE ?',
                        {
                        name: answer.department
                        },
                        function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + ' department deleted!\n');

                        return promptUser();    
                    });

                }) 
                
            })   
             
        }
        if (answer.menu === 'delete role'){

            connection.query(`SELECT * FROM role`, function(err, res) {
                
                //console.log(res)

                const deleteRoleArr = []

                for (var i= 0; i <res.length; i++) {
                    // found out that inquirer needs the property name to be 'value'
                    // replace a property name with value for whatever one it will pass back
                    // in this case I changed :id to :value so inquirer knew to pass back that value in the answer
                    deleteRoleArr.push(res[i].title)
                    // replace a property name with value for whatever one it will pass back
                  
                }
            

                inquirer.prompt(
                    {
                        type: 'list',
                        name: 'role',
                        message: `What role would you like to delete?`,
                        // need to get list of choices from database to included added ones
                        choices: deleteRoleArr
                        
                    }
                ).then(answer => {
                    //console.log(answer);
                    console.log('Deleting role...\n');
                    const query = connection.query(
                        'DELETE FROM role WHERE ?',
                        {
                        title: answer.role
                        },
                        function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + ' role deleted!\n');

                        return promptUser();    
                    });

                }) 
                
            })   
             
        }
        if (answer.menu === 'delete employee'){

            connection.query(`SELECT * FROM employee`, function(err, res) {
                
                //console.log(res)

                const deleteEmployeeArr = []

                for (var i= 0; i <res.length; i++) {
                    // found out that inquirer needs the property name to be 'value'
                    // replace a property name with value for whatever one it will pass back
                    // in this case I changed :id to :value so inquirer knew to pass back that value in the answer
                    
                    deleteEmployeeArr.push({name:`${res[i].first_name} `+ `${res[i].last_name}` +` (employee id: ${res[i].id})`, value: res[i].id})
                    // replace a property name with value for whatever one it will pass back
                  
                }
            

                inquirer.prompt(
                    {
                        type: 'list',
                        name: 'employee',
                        message: `Which employee would you like to delete?`,
                        // need to get list of choices from database to included added ones
                        choices: deleteEmployeeArr
                        
                    }
                ).then(answer => {
                    //console.log(answer);
                    console.log('Deleting employee...\n');
                    const query = connection.query(
                        'DELETE FROM employee WHERE ?',
                        {
                        id: answer.employee
                        },
                        function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + ' employee deleted!\n');

                        return promptUser();    
                    });

                }) 
                
            })   
             
        }
        if (answer.menu === 'update an employee role') {

            connection.query(`SELECT employee.*, role.title  FROM employee JOIN role ON employee.role_id = role.id`, function(err, res) {
                
                //console.log(res)

                const updateEmployeeArr = [];
                const updateRoleArr = [];

                for (var i= 0; i <res.length; i++) {
                    // found out that inquirer needs the property name to be 'value'
                    // replace a property name with value for whatever one it will pass back
                    // in this case I changed :id to :value so inquirer knew to pass back that value in the answer
                    
                    updateEmployeeArr.push({name:`${res[i].first_name} `+ `${res[i].last_name}` +` (employee id: ${res[i].id})`, value: res[i].id})
                    
                    updateRoleArr.push({name: res[i].title, value: res[i].role_id})
                  
                }

                //console.log(updateEmployeeArr);
                //console.log(updateRoleArr);
            

                inquirer.prompt(
                    [{
                        type: 'list',
                        name: 'employee',
                        message: `Which employee would you like to update?`,
                        // need to get list of choices from database to included added ones
                        choices: updateEmployeeArr
                        
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: `Which role are you giving this employee?`,
                        // need to get list of choices from database to included added ones
                        choices: updateRoleArr
                        
                    }

                    ]
                ).then(answer => {
                    //console.log(answer);
                     console.log('Updating employee role...\n');
                        connection.query(
                                'UPDATE employee SET ? WHERE ?',
                                [
                                {
                                    role_id: answer.role
                                },
                                {
                                    id: answer.employee
                                }
                                ],
                                function(err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + ' employee role updated!\n');
                                
                                return promptUser();

                                }
                        );   
                    

                }) 
                
            })
           
        }
        
    })
};
 

// view employee by manager 
//SELECT employee.first_name, employee.last_name FROM employee  WHERE manager_id =1;

