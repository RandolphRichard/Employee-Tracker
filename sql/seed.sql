USE employeesDB;


INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Legal");

/*- Keeping track of the roles */
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales lead", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 115000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id) 
VALUES ("Lawyer", 300000, 5);

/*- Keeping track of the employee and category */


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Amanda", "Richard", 1, null); 
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lyanna", "Richard", 1, 1);
/*Salesperson */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Charbel", "Ahmed", 2, 2);
/*Lead Engineer */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Robert", "Ross", 3, null);
/* Software Engineer */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sean", "Kingston", 4, 4);
/* Account Manager*/
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christopher", "Concalvez", 5, null);
/* Accountant */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Marcus", "Allen", 6, 6);
/* Leagl Team Lead */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("May", "Affricot", 7, null);
