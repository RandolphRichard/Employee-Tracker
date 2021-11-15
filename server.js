// Dependencies
const inquirer = require("inquirer");
const table = require("console.table");
const connection = require("./config/connection");

const prompt = require("./config/prompts");
require("console.table");

console.log( `Welcome to the Employe Manager 


╔═════════════════════════════════════════════════════╗
║                                                     ║
║     _____                 _                         ║
║    | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   ║
║    |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  ║
║    | |___| | | | | | |_) | | (_) | |_| |  __/  __/  ║
║    |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  ║
║                    |_|            |___/             ║
║                                                     ║
║     __  __                                          ║
║    |  \\/  | __ _ _ __   __ _  __ _  ___ _ __        ║
║    | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |\/ _ \\ '__|       ║
║    | |  | | (_| | | | | (_| | (_| |  __/ |          ║
║    |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|          ║
║                              |___/                  ║
║                                                     ║
\╚═════════════════════════════════════════════════════╝`
);

firstPrompt();

function firstPrompt() {
	// Main Prompt
	inquirer.prompt(prompt.firstPrompt).then(function ({ task }) {
		switch (task) {
    case "View Departments":
				viewDepartments();
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

					console.table("Department team: ", res);
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

					console.table("\nManager's team:", res);
					console.log("you have viewed the employee by manager");

					firstPrompt();
				});
			});
	});
}

function addDepartment() {
	inquirer.prompt(prompt.insertDepartment).then(function (answer) {
		var query = "INSERT INTO department (name) VALUES ( ? )";
		connection.query(query, answer.department, function (err, res) {
			if (err) throw err;
			console.log(
				`You have added this department: ${answer.department.toUpperCase()}.`,
			);
		});
		console.log(`
		-------------------------------------------
		Great job,  Your new department was created successfully!
		-------------------------------------------
		`);
		viewDepartments();
	});
}

function addRole() {
	var query = `SELECT * FROM department`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		// Select department for role
		const departmentChoices = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

		inquirer
			.prompt(prompt.insertRole(departmentChoices))
			.then(function (answer) {
				var query = `INSERT INTO role SET ?`;
				// Insert Title, Salary and Department into Role Array
				connection.query(
					query,
					{
						title: answer.roleTitle,
						salary: answer.roleSalary,
						department_id: answer.departmentId,
					},
					function (err, res) {
						if (err) throw err;

						console.log("\n" + res.affectedRows + " role created");
						console.log(`
		-------------------------------------------
		Great job,  Your new role was created successfully!
		-------------------------------------------
		`);

						viewRoles();
					},
				);
			});
	});
}

const addEmployee = () => {
	// Employee's Department
	let departmentArray = [];
	connection.query(`SELECT * FROM department`, (err, res) => {
		if (err) throw err;

		res.forEach((element) => {
			departmentArray.push(`${element.id} ${element.name}`);
		});
		// Employee's Role
		let roleArray = [];
		connection.query(`SELECT id, title FROM role`, (err, res) => {
			if (err) throw err;

			res.forEach((element) => {
				roleArray.push(`${element.id} ${element.title}`);
			});
			// Employee's Manager
			let managerArray = [];
			connection.query(
				`SELECT id, first_name, last_name FROM employee`,
				(err, res) => {
					if (err) throw err;
					res.forEach((element) => {
						managerArray.push(
							`${element.id} ${element.first_name} ${element.last_name}`,
						);
					});
					// New Employee
					inquirer
						.prompt(
							prompt.insertEmployee(departmentArray, roleArray, managerArray),
						)
						.then((response) => {
							
							let roleCode = parseInt(response.role);
							let managerCode = parseInt(response.manager);
							connection.query(
								"INSERT INTO employee SET ?",
								{
									first_name: response.firstName,
									last_name: response.lastName,
									role_id: roleCode,
									manager_id: managerCode,
								},
								(err, res) => {
									if (err) throw err;
									console.log("\n" + res.affectedRows + " employee created");
									console.log(`
									-------------------------------------------
									Great job,  Your new employee was created successfully!
									-------------------------------------------
									`);
									viewEmployee();
								},
							);
						});
				},
			);
		});
	});
};

const updateEmployeeRole = () => {
	
	let employees = [];
	connection.query(
		`SELECT id, first_name, last_name
  FROM employee`,
		(err, res) => {
			if (err) throw err;

			res.forEach((element) => {
				employees.push(
					`${element.id} ${element.first_name} ${element.last_name}`,
				);
			});
			
			let job = [];
			connection.query(`SELECT id, title FROM role`, (err, res) => {
				if (err) throw err;

				res.forEach((element) => {
					job.push(`${element.id} ${element.title}`);
				});

				inquirer.prompt(prompt.updateRole(employees, job)).then((response) => {
					// Update Employee with Chosen Role
					let idCode = parseInt(response.update);
					let roleCode = parseInt(response.role);
					connection.query(
						`UPDATE employee SET role_id = ${roleCode} WHERE id = ${idCode}`,
						(err, res) => {
							if (err) throw err;

							console.log(res.affectedRows);
							console.log(`
							-------------------------------------------
							Great job,  You have updated the employee role successfully!
							------------------------------------------
							`);
							firstPrompt();
						},
					);
				});
			});
		},
	);
};

const updateEmployeeManager = () => {
	let employees = [];
	connection.query(
		`SELECT id, first_name, last_name
  FROM employee`,
		(err, res) => {
			res.forEach((element) => {
				
				employees.push(
					`${element.id} ${element.first_name} ${element.last_name}`,
				);
			});
			// Select employee's new manager
			inquirer.prompt(prompt.updateManager(employees)).then((answer) => {
				
				let idCode = parseInt(answer.update);
				let managerCode = parseInt(answer.manager);
				connection.query(
					
					`UPDATE employee SET manager_id = ${managerCode} WHERE id = ${idCode}`,
					(err, res) => {
						if (err) throw err;

						console.log(res.affectedRows);
						console.log(`
						-------------------------------------------
						Great job,  You have updated the employee manager successfully!
						------------------------------------------
						`);
						firstPrompt();
					},
				);
			});
		},
	);
};

function deleteEmployee() {
	console.log("Removing an employee");

	var query = `SELECT e.id, e.first_name, e.last_name
      FROM employee e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		
		const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
			value: id,
			name: `${id} ${first_name} ${last_name}`,
		}));

		inquirer
			.prompt(prompt.deleteEmployeePrompt(deleteEmployeeChoices))
			.then(function (answer) {
				var query = `DELETE FROM employee WHERE ?`;
				
				connection.query(query, { id: answer.employeeId }, function (err, res) {
					if (err) throw err;

					console.log(res.affectedRows);
					console.log(`
					-------------------------------------------
					Great job, You have deleted the  employee successfully!
					------------------------------------------
					`);

					firstPrompt();
				});
			});
	});
}

function deleteDepartment() {
	console.log("Remove a Department:");

	var query = `SELECT e.id, e.name FROM department e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		// Select Department to Remove
		const deleteDepartmentChoices = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

		inquirer
			.prompt(prompt.deleteDepartmentPrompt(deleteDepartmentChoices))
			.then(function (answer) {
				var query = `DELETE FROM department WHERE ?`;
				connection.query(query, { id: answer.departmentId }, function (
					err,
					res,
				) {
					if (err) throw err;

					console.log(res.affectedRows);
					console.log(`
					-------------------------------------------
					Great job, You have deleted the department successfully!
					------------------------------------------
					`);

					viewDepartments();
				});
			});
	});
}

function deleteRole() {
	console.log("Removing a role");

	var query = `SELECT e.id, e.title, e.salary, e.department_id FROM role e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		// Select Role to Remove
		const deleteRoleChoices = res.map(({ id, title }) => ({
			value: id,
			name: `${id} ${title}`,
		}));

		inquirer
			.prompt(prompt.deleteRolePrompt(deleteRoleChoices))
			.then(function (answer) {
				var query = `DELETE FROM role WHERE ?`;
				connection.query(query, { id: answer.roleId }, function (err, res) {
					if (err) throw err;

					console.log(res.affectedRows);
					console.log(`
					-------------------------------------------
					Great job, You have deleted the department successfully!
					------------------------------------------
					`);

					viewRoles();
				});
			});
	});
}

