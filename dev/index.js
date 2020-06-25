const connection = require("./db/connection");
const inquirer = require("inquirer");

function addDepartment(){
    inquirer.prompt([
        {
        message: "what is the department's name?",
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


};

function viewDepartment(){


};

function viewRole(){


};

function viewEmployee(){


};

function updateEmployeeRoles(){


;}
addRole();