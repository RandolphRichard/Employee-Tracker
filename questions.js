const entryValidate = (answer) => {
    if (answer === "") {
      return "You need to fill this section.";
    }
    return true;
  };
  const numberValidate = (answer) => {
    if (isNaN(answer) === false) {
      return true;
    }
    return "Cannot be other than a number.";
  };
  
  const starterQ = [
    {
      type: "list",
      name: "starterQuestion",
      message: "What would you like to do?",
      choices: [
        "View departments.",
        "View Roles.",
        "View Employees.",
        "Add Department.",
        "Add Role.",
        "Add Employee.",
        "Update an employee's role.",
        "Done.",
      ],
    },
  ];
  
  const add = [
    {
      type: "list",
      name: "add",
      message: "What would you like to add Today?",
      choices: [
        "Add new department.",
        "Add new role.",
        "Add new employee.",
        "Done, show me the primary table.",
      ],
    },
  ];
  
  const newDepartName = [
    {
      type: "input",
      name: "newDepartName",
      message: "What's the new department's name?",
      validate: entryValidate,
    },
  ];
  const newRoleInfo = (roles) => [
    {
      type: "input",
      name: "newRoleTitle",
      message: "What's the new role's title?",
      validate: entryValidate,
    },
    {
      type: "input",
      name: "newRoleSalary",
      message: "What's the new role's salary?",
      validate: numberValidate,
    },
    {
      type: "list",
      name: "newRoleDepartment_ID",
      message: "What's the new role's Department ID number?",
      choices: roles,
    },
  ];
  
  const newEmployeeInfo = (roles) => [
    {
      type: "input",
      name: "newFirstName",
      message: "What is the employee's first name?",
      validate: entryValidate,
    },
    {
      type: "input",
      name: "newLastName",
      message: "What's the employee's last name?",
      validate: entryValidate,
    },
    {
      type: "list",
      name: "newEmployeeID",
      message: "What's the new employee's Role?",
      choices: roles,
    },
    {
      type: "input",
      name: "newEmployeeManager_ID",
      message:
        "What's the new employee's manager ID number? (you need to fill this section)",
    },
  ];
  
  const view = [
    {
      type: "list",
      name: "viewSomething",
      message: "What would you like to view?",
      choices: [
        "View departments.",
        "View roles.",
        "View employees.",
        "Done, show me the complete table.",
      ],
    },
  ];
  
  const update = [
    {
      type: "list",
      name: "updateEmployee",
      message: "Which employee's role would you like to update?",
      choices: "",
    },
    {
      type: "list",
      name: "updateRole",
      message: "Which employee's role would you like to update?",
      choices: "",
    },
  ];
  
  module.exports = {
    add,
    view,
    update,
    starterQ,
    newRoleInfo,
    newDepartName,
    newEmployeeInfo,
  };