 DROP DATABASE IF EXISTS Wellcare;
 CREATE DATABASE Wellcare ;
 USE Wellcare;
 
 Create TABLE User(
	UserId int,
    Password VARCHAR(255),
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Gender VARCHAR(255),
    HomeAddress VARCHAR(255)
);

INSERT INTO User(UserId, Password, FirstName, LastName, Email, Gender, HomeAddress)
	VALUES(1, 'abc123', 'John', 'Smith', 'jSmith@gmail.com', 'Male', '123 Main st.');

SELECT * from User;


    
    
    


	
 