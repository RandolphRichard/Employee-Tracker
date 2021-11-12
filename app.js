const inquirer = require("inquirer");
const path = require("path");
const consoleTable = require("console.table");
const fs = require("fs");
const mysql2 = require("mysql2");
const questions = require("./questions");
const PORT = process.env.PORT || 8080;

const connection = mysql2.createConnection({
    host: "localhost",
    port: 3999,
    user: "root",
    password: "Awesome910!",
    database: "employee_trackerdb",
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    starter();
});

function starter() {
    inquirer.prompt(questions.questionStart).then((answers) => {
      if (answers.startQuestion === "View departments.") {
        viewDepartment();
      } else if (answers.startQuestion === "View Roles.") {
        getRoles();
      } else if (answers.startQuestion === "View Employees.") {
        getEmployees();
      } else if (answers.startQuestion === "Add Department.") {
        addDepartment();
      } else if (answers.startQuestion === "Add Role.") {
        addRole();
      } else if (answers.startQuestion === "Add Employee.") {
        addEmployee();
      } else if (answers.startQuestion === "Update an employee's role.") {
        updateRole();
      } else {
        console.log("Nicely done, ending session now.");
        afterConnection();
      }
    });
  }

  function viewDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
      if (err) throw err;
  
      console.table(res);
      starter();
    });
  }
  
  async function getDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log(res);
      return res;
    });
  }

  function getRoles(cb) {
    const query = "select * from role";
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      starter();
    });
  }
  
  function getEmployees() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
      let table = res.map((employee) => {
        return {
          ID: employee.id,
          NAME: `${employee.first_name} ${employee.last_name}`,
          ROLE_ID: employee.role_id,
          MANAGER_ID: employee.manager_id,
        };
      });
      console.table(table);
      starter();
    });
  }

  function addDepartment() {
    inquirer.prompt(questions.newDepartmentName).then((answers) => {
      connection.query(
        `INSERT INTO department (name) VALUES ("${answers.newDepartmentName}");`,
        function (err) {
          if (err) throw err;
          const query = "SELECT * FROM department";
          connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`
            ---------------------------------------------
            Great job, your department name was created successfully!
            ---------------------------------------------`);
            console.table(res);
            starter();
          });
        }
      );
    });
  }

  async function addRole() {
    const departments = await getDepartment();
    console.log(departments, "Departments");
    let names = departments.map((department) => {
      return { value: department.id, name: department.name };
    });
    inquirer.prompt(questions.newRoleInfo(names)).then((answers) => {
      connection.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${answers.newRoleTitle}", ${answers.newRoleSalary}, ${answers.newRoleDepartment_ID});`,
        function (err) {
          if (err) throw err;
          console.log(`
            ---------------------------------------
            Great job, Your new role was created successfully!
            ---------------------------------------`);
          viewDepartment();
        }
      );
    });
  }

  function addEmployee() {
    getRoles((res) => {
      let roles = res.map((role) => {
        return { value: role.id, name: role.title };
      });
      inquirer.prompt(questions.newEmployeeInfo(roles)).then((answers) => {
        if (answers.newEmployeeManager_ID !== "") {
          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.newFirstName}", "${answers.newLastName}", ${answers.newEmployeeID}, ${answers.newEmployeeManager_ID});`,
            function (err) {
              if (err) throw err;
              console.log(`
              -------------------------------------------
              Great job,  Your new employee was created successfully!
              -------------------------------------------`);
              console.table(res);
              starter();
            }
          );
        } else {
          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id) VALUES ("${answers.newFirstName}", "${answers.newLastName}", ${answers.newEmployeeID});`,
            function (err) {
              if (err) throw err;
              console.log(`
              -------------------------------------------
              Great job, Your new employee was created successfully!
              -------------------------------------------`);
              console.table(res);
              starter();
            }
          );
        }
      });
    });
  }
  
