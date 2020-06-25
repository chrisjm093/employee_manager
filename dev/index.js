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
    // connection.query("SELECT * FROM department", (err, results) =>{
    //     if( err ) throw err;
    // });
    
    inquirer.prompt([
        {
            message: "What is the title?",
            type: "input",
            name: "title"
        },
        {
            message: "What is the salary?",
            type: "number",
            name: "salary"
            // validate: (value) =>{
            //     if( value === isNAN)
            //     done console.log("Please enter a number for the Salary only.")
            //     return
            // }
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
    ]).then((res) =>{

        connection.query( "INSERT INTO department (name) VALUES (?)", res.departmentName, (err, result) =>{
            if( err ) throw err;
            console.log( "inserted as ID" + result.insertID );
        })
    })

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