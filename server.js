// Dependencies
const inquirer = require("inquirer");
const table = require("console.table");
const connection = require("./config/connection");

const prompt = require("./config/prompts");
require("console.table");

console.log( "Welcome to the Employe Manager ");

firstPrompt();

function firstPrompt() {
	// Main Prompt
	inquirer.prompt(prompt.firstPrompt).then(function ({ task }) {
		switch (task) {
      case "View Departments":
				viewDepartments();
				break;
        case "View Department Budget":
          viewDepartmentBudget();
          break;
          case "View Roles":
            viewRoles();
            break;
			case "View Employees":
				viewEmployee();
				break; 
        case "View Employees by Department":
          viewEmployeeByDepartment();
          break; 
			case "View Employees by Manager":
				viewEmployeeByManager();
				break; 
				case "Add Department":
				addDepartment();
				break;
				case "Add Role":
				addRole();
				break;
			case "Add Employee":
				addEmployee();
				break;
			case "Update Employee Role":
				updateEmployeeRole();
				break; 
			case "Update Employee Manager":
				updateEmployeeManager();
				break;
			case "Remove Employee":
				deleteEmployee();
				break;
			case "Remove Department":
				deleteDepartment();
				break;
			case "Remove Role":
				deleteRole();
				break;
			case "Done":
				connection.end();
				break;
		}
	});
}

function viewDepartments() {
	var query = "SELECT * FROM department";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`DEPARTMENTS:`);
		res.forEach((department) => {
			console.log(`ID: ${department.id} | ${department.name} Department`);
		});
		console.log("You have viewed the department");
		firstPrompt();
	});
}

function viewDepartmentBudget() {
	var query = `SELECT d.name, 
		r.salary, sum(r.salary) AS budget
		FROM employee e 
		LEFT JOIN role r ON e.role_id = r.id
		LEFT JOIN department d ON r.department_id = d.id
		group by d.name`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		console.log(`DEPARTMENT BUDGETS:`);
		res.forEach((department) => {
			console.log(
				`Department: ${department.name} Budget: ${department.budget}`,
			);
		});
		console.log("You have viewed the department Budget");
		firstPrompt();
	});
}

function viewRoles() {
	var query = "SELECT * FROM role";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`ROLES:`);
		res.forEach((role) => {
			console.log(
				`ID: ${role.id} | Title: ${role.title} Salary: ${role.salary}`,
			);
		});
		console.log("You have viewed the Roles");
		firstPrompt();
	});
}

function viewEmployee() {
	console.log("Employee Rota:\n");

	var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		console.table(res);
		console.log("You have viwed the employee");

		firstPrompt();
	});
}

function viewEmployeeByDepartment() {
	console.log("View employees by department\n");

	var query = `SELECT d.id, d.name
	FROM employee e
	LEFT JOIN role r
	ON e.role_id = r.id
	LEFT JOIN department d
	ON d.id = r.department_id
	GROUP BY d.id, d.name`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		// choose the department
		const departmentChoices = res.map((data) => ({
			value: data.id,
			name: data.name,
		}));

		inquirer
			.prompt(prompt.departmentPrompt(departmentChoices))
			.then(function (answer) {
				var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
			FROM employee e
			JOIN role r
				ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			WHERE d.id = ?`;

				connection.query(query, answer.departmentId, function (err, res) {
					if (err) throw err;

					console.table("Department Rota: ", res);
					console.log("you have viewed the employee by Department");

					firstPrompt();
				});
			});
	});
}

function viewEmployeeByManager() {
	console.log("Manager Rota:\n");

	var query = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r
	ON e.role_id = r.id
  	LEFT JOIN department d
  	ON d.id = r.department_id
  	LEFT JOIN employee m
	ON m.id = e.manager_id GROUP BY e.manager_id`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		// Choose the manager and see what's under
		const managerChoices = res
			// purposely add NULL to prevent choosing employees with no assigned manager.
			.filter((mgr) => mgr.manager_id)
			.map(({ manager_id, manager }) => ({
				value: manager_id,
				name: manager,
			}));

		inquirer
			.prompt(prompt.viewManagerPrompt(managerChoices))
			.then(function (answer) {
				var query = `SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
			FROM employee e
			JOIN role r
			ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			LEFT JOIN employee m
			ON m.id = e.manager_id
			WHERE m.id = ?`;

				connection.query(query, answer.managerId, function (err, res) {
					if (err) throw err;

					console.table("\nManager's subordinates:", res);
					console.log("you have viewed the employee by manager");

					firstPrompt();
				});
			});
	});
}

function addDepartment() {
  inquirer.prompt(questions.newDepartName).then((answers) => {
    connection.query(
      `INSERT INTO department (name) VALUES ("${answers.newDepartName}");`,
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

// async 
async function addRole() {
  const departments = await getDepartment();
  console.log(departments, "Departments");
  let names = departments.map((department) => {
    return { value: department.id, name: department.name };
  });
  inquirer.prompt(questions.newRoleInfo(names)).then((answers) => {
    connection.query(
      `INSERT INTO role (title, salary, department_id) VALUES ("${answers.newRoleTitle}", "${answers.newRoleSalary}", "${answers.newRoleDepartment_ID}");`,
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
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.newFirstName}", "${answers.newLastName}", "${answers.newEmployeeID}", "${answers.newEmployeeManager_ID}");`,
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

function updateRole() {
  let query = "SELECT * FROM employee";
  let employees = [];
  connection.query(query, (err, res) => {
    if (err) throw err;

    for (let i = 0; i < res.length; i++) {
      employees.push({
        name: res[i].first_name + " " + res[i].last_name,
        value: res[i].id,
      });
    }

    let roles = [];
    let query =
      "select role.id, role.title, role.salary, department.name from role inner JOIN department on role.department_id = department.id";
    connection.query(query, (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        roles.push({
          name: res[i].title,
          value: res[i].id,
        });
      }
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "updateEmployee",
          message: "Which employee would you like to update?",
          choices: employees,
        },
        {
          type: "list",
          name: "updateRole",
          message: "Which role would you like to allocate?",
          choices: roles,
        },
      ])
      .then((answers) => {
        console.log(answers);
        let query = "UPDATE employee SET ? WHERE ?";
        connection.query(
          query,
          [
            {
              role_id: answers.updateRole,
            },
            {
              id: answers.updateEmployee,
            },
          ],

          function (err, res) {
            if (err) throw err;
            console.log(res);
            starter();
          }
        );
      });
  });
}
