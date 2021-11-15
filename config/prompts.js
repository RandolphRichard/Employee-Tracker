module.exports = {
	
	firstPrompt: {
		type: "list",
		name: "task",
		message: "Make a selection:",
		choices: [
			/* VIEW*/
			"View Departments", 
			"View Roles", 
			"View Employees", 
			"View Employees by Department", 
			"View Employees by Manager", 
			/* ADD */
			"Add Department",
			"Add Role", 
			"Add Employee", 
			/* UPDATE */
			"Update Employee Role", 
			"Update Employee Manager", 
			/* REMOVE */
			"Remove Employee", 
			"Remove Department", 
			"Remove Role", 
			/* EXIT */
			"Done",
		],
	},


	/* EMPLOYEE BY MANAGER*/
	viewManagerPrompt: (managerChoices) => [
		// Select Manager
		{
			type: "list",
			name: "managerId",
			message: "do you have a manager in mind?",
			choices: managerChoices,
		},
	],

	/* EMPLOYEE BY DEPARTMENT*/
	departmentPrompt: (departmentChoices) => [
		// Select Department
		{
			type: "list",
			name: "departmentId",
			message: "choose the right department?",
			choices: departmentChoices,
		},
	],



	/* ADD EMPLOYEE*/
	insertEmployee: (departmentArray, roleArray, managerArray) => [
		// Employee First Name
		{
			name: "firstName",
			type: "input",
			message: "fill this section with the employee's first name:",
		},
		// Employee Last Name
		{
			name: "lastName",
			type: "input",
			message: "fill this section with the employee's last name:",
		},
		// Employee Department
		{
			name: "department",
			type: "list",
			message: "Choose employee's department",
			choices: departmentArray,
		},
		// Employee Role
		{
			name: "role",
			type: "list",
			message: "Choose employee's job title",
			choices: roleArray,
		},
		// Employee Manager
		{
			name: "manager",
			type: "list",
			message: "if you know the manager name of the employee, Choose it:",
			choices: managerArray,
		},
	],

	/* ADD DEPARTMENT */
	insertDepartment: {
		// New Departments
		name: "department",
		type: "input",
		message: "choose the new department?",
	},

	/* ADD ROLE */
	insertRole: (departmentChoices) => [
		// New Role name
		{
			type: "input",
			name: "roleTitle",
			message: "Role title?",
		},
		// New Role Salary
		{
			type: "input",
			name: "roleSalary",
			message: "Role Salary",
		},
		// New Role Department
		{
			type: "list",
			name: "departmentId",
			message: "Department?",
			choices: departmentChoices,
		},
	],

	/* UPDATE ROLE*/
	updateRole: (employees, job) => [
		// Update employee
		{
			name: "update",
			type: "list",
			message: "Choose the employee whose role is to be updated:",
			choices: employees,
		},
		// Employee New Role
		{
			name: "role",
			type: "list",
			message: "Choose employee's job title",
			choices: job,
		},
	],

	/* UPDATE MANAGER */
	updateManager: (employees) => [
		// Update Employee 
		{
			name: "update",
			type: "list",
			message: "Choose the employee that you will update the manager:",
			choices: employees,
		},
		// Employee New Manager
		{
			name: "manager",
			type: "list",
			message: "Choose employee's new manager",
			choices: employees,
		},
	],

	/* REMOVE EMPLOYEE */
	deleteEmployeePrompt: (deleteEmployeeChoices) => [
		// Remove Employee
		{
			type: "list",
			name: "employeeId",
			message: "choose the employee that you want to remove?",
			choices: deleteEmployeeChoices,
		},
	],

	/* REMOVE DEPARTMENT */
	deleteDepartmentPrompt: (deleteDepartmentChoices) => [
		// Remove Department
		{
			type: "list",
			name: "departmentId",
			message: "Choose the department that you want to remove?",
			choices: deleteDepartmentChoices,
		},
	],

	/* REMOVE ROLE */
	deleteRolePrompt: (deleteRoleChoices) => [
		// Remove Role
		{
			type: "list",
			name: "roleId",
			message: "choose the role that you want to remove?",
			choices: deleteRoleChoices,
		},
	],
};
