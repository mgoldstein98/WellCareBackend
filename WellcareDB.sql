CREATE DATABASE IF NOT EXISTS WellcareDB;

USE WellcareDB;
 
 Create TABLE IF NOT EXISTS User(
	UserId int NOT NULL PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255) NOT NULL,
    Gender VARCHAR(255),
    HomeAddress VARCHAR(255)

);

INSERT INTO User(UserId, Password, FirstName, LastName, Email, Gender, HomeAddress)
	VALUES(1, 'abc123', 'Sterling', 'Conner', 'jSmith@gmail.com', 'Female', '123 Main st.');

SELECT * from User;

