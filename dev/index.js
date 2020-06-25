const connection = require("./db/connection");
const inquirer = require("inquirer");

function initialize(){
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["Add new Department", "Add new Role", "Add new Employee"],
            name: "initChoices"
        }
    ]).then((response) =>{
        console.log(response);
        if(response.initChoices === "Add new Department"){
            addDepartment();
        }else if( response.initChoices === "Add new Role"){
            addRole();
        }else if( response.initChoices === "Add new Employee"){
            addEmployee();
        };
    })
    .catch(err =>{
        console.log(err)
    })
};


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
            })
        })
    });
};

function addEmployee(){
    connection.query("SELECT * FROM department", (err, results) =>{
        if( err ) throw err;
        
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
                message: "What department does the role belong to?",
                type: "list",
                name: "department_id",
                choices: results.map( role =>{
                    return {
                        name: role.title,
                        value: role.id
                    }
                })
            }
        ]).then((response) =>{
            console.log(response);
        });
    
    connection.query("SELECT role FROM employee WHERE ?", 
        { manager }, (err, results) =>{
            if( err ) throw err;

            inquirer.prompt([
                {
                    message: "Who is the employee's manager?",
                    type: "list",
                    choices: results.map( results )

                }
            ]).then((response) =>{
            console.log(response);
            // connection.query( "INSERT INTO role SET ?", response, (err, result) =>{
            //     if( err ) throw err;
            //     console.log( "inserted as ID" + result.insertId );
            // })
        })

        });
         
        
    });

};

function viewDepartment(){


};

function viewRole(){


};

function viewEmployee(){


};

function updateEmployeeRoles(){


;}
initialize();