DROP DATABASE IF EXISTS employee_tracker_db;
    CREATE DATABASE employee_tracker_db;
    USE employee_tracker_db;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(100),
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR (30),
    salary DECIMAL (6,0),
    department_id INTEGER,
    PRIMARY KEY (id) 

);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR (30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id)
);