INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Legal");
INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Account Manager", 125000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Accoutant", 115000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Lawyer", 300000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Amanda", "Richard", 3, 1 );
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Lyanna", "Richard", 4, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Charbel", "Ahmed", 5, 3 );
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Robert", "Ross",4 , 4 );

select * from employee
inner join role on employee.role_id = role.id
inner join department on role.department_id = department.id;