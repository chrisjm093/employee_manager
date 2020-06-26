const connection = require("./db/connection");
const inquirer = require("inquirer");

function initialize(){
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["Add to the Employee Database", "View information from the Database"],
            name: "addOrView"
        }
    ]).then((response) =>{
        if(response.addOrView === "Add to the Employee Database"){
            addInit();
        }else if( response.addOrView === "View information from the Database"){
            viewInit();
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
            choices: ["View Departments", "View Roles", "View Employees"],
            name: "viewInitChoices"
        }
    ]).then( (response ) =>{
        if(response.viewInitChoices === "View Departments"){
            viewDepartments();
        } else if(response.viewInitChoices === "View Roles") {
            viewRoles();
        }else if(response.viewInitChoices === "View Employees"){
            viewEmployees();
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
    connection.query("SELECT * FROM role", (err, results) =>{
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
            addManager(response);
        });
    });
    
            // connection.query( "INSERT INTO role SET ?", response, (err, result) =>{
            //     if( err ) throw err;
            //     console.log( "inserted as ID" + result.insertId );
            // })
        // })

        // });

};

function getRoles(cb){
    connection.query("SELECT * FROM role", (err, results) =>{
        if(err) throw err;
        cb( results );
    })

};

function getEmployees(cb){
    connection.query("SELECT * FROM employees", (err, results) =>{
        if(err) throw err;
        cb(results);
    })
}

function addManager( data ){
   
    connection.query("SELECT * FROM employee WHERE role_id = ", 
            (err, results) =>{
            if( err ) throw err
                console.log(results);
            // inquirer.prompt([
            //     {
            //         message: "Who is the employee's manager?",
            //         type: "list",
            //         choices: results.map( manager =>{
            //             return {
            //                 name: role.title,
            //                 value: role.id 
            //             }
            //         } )
            //     }
            // ]).then((response) =>{
            // console.log(response);
            // });
    })
};

function viewDepartments(){


};

function viewRoles(){


};

function viewEmployees(){


};

function updateEmployeeRoles(){


;}
initialize();