use employee_trackerdb;

select * from employee
inner join role on employee.role_id = role.id
inner join department on role.department_id = department.id;