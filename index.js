const connection = require("./dev/db/connection");
const inquirer = require("inquirer");
const figlet = require('figlet');
const cTable = require('console.table');

function banner() {
    figlet('Employee Manager', (err, data) =>{
        if(err) throw err;
        console.log(data);
        initialize();
    })
};

function initialize(){
      
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["Add to the Employee Database", "View information from the Database", "Update an existing employee's role"],
            name: "addOrView"
        }
    ]).then((response) =>{
        if(response.addOrView === "Add to the Employee Database"){
            addInit();
        }else if( response.addOrView === "View information from the Database"){
            viewInit();
        }else if( response.addOrView === "Update an existing employee's role"){
            updateEmployeeRole();
        }
    })
};

function addInit(){
    inquirer.prompt([
        {
            message: "What would you like to add?",
            type: "list",
            choices: ["Add new Department", "Add new Role", "Add new Employee"],
            name: "addInitChoices"
        }
    ]).then((response) =>{
        
        if(response.addInitChoices === "Add new Department"){
            addDepartment();
        }else if( response.addInitChoices === "Add new Role"){
            addRole();
        }else if( response.addInitChoices === "Add new Employee"){
            addEmployee();
        };
    })
    .catch(err =>{
        console.log(err)
    })
};

function viewInit(){
    inquirer.prompt([
        {
            message: "what would you like to view?",
            type: "list",
            choices: ["View employees by department", "View employees by role", "View All Employees"],
            name: "viewInitChoices"
        }
    ]).then( (response ) =>{
        console.log("====================================")
        if(response.viewInitChoices === "View employees by department"){
            viewEmployeesByDepartments();
            console.clear();

        } else if(response.viewInitChoices === "View employees by role") {
            viewEmployeesByRole();
            console.clear();

        }else if(response.viewInitChoices === "View All Employees"){
            console.clear();
            viewAllEmployees();
        }
    })
}


function addDepartment(){
    inquirer.prompt([
        {
        message: "What is the department's name?",
        type: "input",
        name: "departmentName"
        }
    ]).then((response) =>{
        connection.query( "INSERT INTO department (name) VALUES (?)", response.departmentName, (err, result) =>{
            if( err ) throw err;

            console.log( "inserted as ID" + result.insertId );
            askToContinue();
        })
    })

};


function addRole(){
    connection.query("SELECT * FROM department", (err, results) =>{
        if( err ) throw err;
    
    
    inquirer.prompt([
        {
            message: "What is the title?",
            type: "input",
            name: "title"
        },
        {
            message: "What is the salary?",
            type: "input",
            name: "salary",
            validate: (value) =>{
               return !isNaN(value) ? true : "Please provide a number value."
            }
        },
        {
            message: "What department does the role belong to?",
            type: "list",
            name: "department_id",
            choices: results.map( department =>{
                return {
                    name: department.name,
                    value: department.id
                }
            })
        }
        ]).then((response) =>{
            console.log(response);
            connection.query( "INSERT INTO role SET ?", response, (err, result) =>{
                if( err ) throw err;
                console.log( "inserted as ID" + result.insertId );
                askToContinue();
            })
        })
    });
};

function addEmployee(){
    getRoles((roles) =>{
        getEmployees((employees) =>{
            employeeSelections =  employees.map( employee =>{
                return{
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                }
            })
            employeeSelections.unshift( { name: "None", value: null } );
             
            inquirer.prompt([
                {
                    message: "What is the Employee's First Name?",
                    type: "input",
                    name: "first_name"
                },
                {
                    message: "What is the Employee's Last Name?",
                    type: "input",
                    name: "last_name",
                },
                {
                    message: "What is the employee's role?",
                    type: "list",
                    name: "role_id",
                    choices: roles.map( role =>{
                        return {
                            name: role.title,
                            value: role.id 
                        }
                    })
                },
                {
                    message: "Enter the employee's manager?",
                    type: "list",
                    name: "manager_id",
                    choices: employeeSelections
                }
            ]).then((response) =>{
                connection.query( "INSERT INTO employee SET ?", response, (err, result) =>{
                    if( err ) throw err;
                    console.log( "inserted as ID" + result.insertId );
                    askToContinue();

                })
                
            });
        });
    })
};

function getRoles(cb){
    connection.query("SELECT * FROM role", (err, results) =>{
        if(err) throw err;
        
        cb( results );
    })

};

function getEmployees(cb){
    connection.query("SELECT * FROM employee", (err, results) =>{
        if(err) throw err;
        
        cb(results);

    })
}


function viewEmployeesByDepartments(){
    connection.query("SELECT first_name, last_name, name FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department on role.department_id = department.id", 
    (err, results) => {
        console.table(results);
        askToContinue();
    })

};

function viewEmployeesByRole(){
    connection.query("SELECT first_name, last_name, title FROM employee LEFT JOIN role ON role.id = employee.role_id", 
    (err, results) => {
        console.table(results);
        askToContinue();
    })

};

function viewAllEmployees(){
    connection.query("SELECT first_name, last_name, name, title, salary FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department on role.department_id = department.id",
    (err, results) =>{
        console.table(results);
        askToContinue();
    })
    
 
};

function updateEmployeeRole(){
    getRoles((roles) =>{
        getEmployees((employees) =>{
            employeeSelections = employees.map( employee =>{
                return{
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                }
            })
            inquirer.prompt([
                {
                    message: "Select an employee to change their role?",
                    type: "list",
                    name: "employee",
                    choices: employeeSelections
                },
                {
                    message: "Which role would you like to change it to?",
                    type: "list",
                    name: "newRole",
                    choices: roles.map( role =>{
                        return{
                            name: role.title,
                            value: role.id
                        };
                    })
                }
            ]).then((response) => {
                connection.query(`UPDATE employee SET role_id =  ${response.newRole} WHERE employee.id =  ${response.employee}` , (err, result) =>{
                    if(err) throw err;
                    console.log("==================");
                    console.log("Database updated");
                    console.log("==================");
                    askToContinue();
                })
            })
        });
    });
};


function askToContinue() {
    inquirer
    .prompt({
        type: "confirm",
        message: "Would you like to make another inquiry?",
        name: "continue"
    })
    .then( ( response ) =>{
        console.log("=============================")
        if(response.continue === true){
            console.clear();
            initialize();
        } else {
            console.clear();
            console.log("===============================");
            console.log("| Thank You, Have a nice day! |");
            console.log("===============================");
            setTimeout( ()=> { console.clear, process.exit();}, 5000)
            

        };
        
    });
};

banner();