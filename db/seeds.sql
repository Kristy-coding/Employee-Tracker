
USE employee_tracker_db;

INSERT INTO department (name) 
VALUES 
('Marketing'),
('Engineering'),
('Finance'),
('Sales'),
('HR');

INSERT INTO role (title, salary, department_id)
VALUES 
('Global Media Manager', 70000, 1),
('Marketing Analyst', 50000, 1),
('Brand Coordinator', 55000, 1),
('Ecommerce Specialist', 65000,1),
('Software Engineering Manager', 100000, 2),
('Web Developer', 80000, 2),
('Front End Engineer', 90000, 2),
('Senior Software Engineer', 95000,2),
('Finance Manager', 100000, 3),
('Financial Analyst', 80000, 3),
('Sales Manager', 100000, 4),
('Sales Representative', 75000, 4),
('Human Resource Manager', 75000, 5),
('Human Resource Associate', 65000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Lola', 'Brown', 1, NULL),
('Elsa','Cooper',2, 1),
('Jackie', 'Fletcher', 2, 1),
('Joan', 'Cortez', 3, 1),
('Jon', 'Roberts', 4, NULL),
('Willie', 'Pearson', 5, NULL),
('Luz', 'Higgins', 6, 6),
('Charlotte', 'Silva', 6, 6),
('Shelley', 'Cannon', 7, 6),
('Larry', 'Holland', 7, 6),
('Kirk', 'Burke', 8, 6),
('Sharon', 'Rivera', 8, 6),
('Willard', 'Santos', 8, 6),
('Pamela', 'Baldwin', 9, NULL),
('Lynn', 'Parker', 10, 14),
('Gail', 'Sims', 10, 14),
('Eugene', 'Tran', 11, NULL),
('Desiree', 'Pratt', 12, 17),
('Clarence', 'Howell', 12, 17),
('Dexter', 'McDonald', 13, NULL),
('Miranda', 'Fletcher', 14, 20);








