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

 Create TABLE IF NOT EXISTS Doctor(
	doc_id int NOT NULL PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255) NOT NULL,
    Gender VARCHAR(255),
    OfficeAddress VARCHAR(255),
    specialization VARCHAR(255)
);

 Create TABLE IF NOT EXISTS Appointment (
	appointmentID int NOT NULL PRIMARY KEY,
    doc_id int NOT NULL,
    user_id int NOT NULL ,
    Date VARCHAR(255),
    Time VARCHAR(255),
    Reason VARCHAR(255),
    FOREIGN KEY (doc_id) REFERENCES Doctor(doc_id),
	FOREIGN KEY (user_id) REFERENCES User(UserId)
);


Select * from Doctor;

INSERT INTO User(UserId, Password, FirstName, LastName, Email, Gender, HomeAddress)
	VALUES(1, 'abc123', 'Max', 'Gold', 'jSmith@gmail.com', 'Male', '123 Main st.');

INSERT INTO User(UserId, Password, FirstName, LastName, Email, Gender, HomeAddress)
	VALUES(2, 'abc123', 'Max', 'Gold', 'jSmith@gmail.com', 'Male', '123 Main st.');
    

SELECT * from User;

