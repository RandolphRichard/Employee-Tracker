-- This is my schema

SELECT * FROM employee_trackerdb.department;
SELECT * FROM employee_trackerdb.role;
SELECT * FROM employee_trackerdb.employee;



DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT auto_increment Not NULL Primary Key,
  name VARCHAR(30) not NULL
);


CREATE TABLE role (
	id INT auto_increment Not NULL Primary Key,
	title VARCHAR(30) not NULL,
	salary decimal not NULL,
	department_id INT not NULL
);

CREATE TABLE employee (
  id INT auto_increment Not NULL Primary Key,
  first_name VARCHAR(30) not NULL,
  last_name VARCHAR(30) not NULL,
  role_id INT not NULL,
  manager_id INT
  );



insert into employee (first_name,last_name, role_id)
value ("Randy", "Rich", 1);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;