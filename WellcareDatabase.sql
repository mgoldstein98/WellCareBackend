 DROP DATABASE IF EXISTS Wellcare;
 CREATE DATABASE Wellcare ;
 USE Wellcare;
 
 Create TABLE User(
	UserId int NOT NULL,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255) NOT NULL,
    Gender VARCHAR(255),
    HomeAddress VARCHAR(255),
    PRIMARYKEY(UserId)

);

INSERT INTO User(UserId, Password, FirstName, LastName, Email, Gender, HomeAddress)
	VALUES(1, 'abc123', 'John', 'Smith', 'jSmith@gmail.com', 'Male', '123 Main st.');

SELECT * from User;


    
    
    


	
 
