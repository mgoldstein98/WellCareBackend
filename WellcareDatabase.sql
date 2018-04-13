DROP DATABASE IF EXISTS WellcareDB;

CREATE DATABASE IF NOT EXISTS WellcareDB;

USE WellcareDB;
 
 Create TABLE IF NOT EXISTS User(
	UserId int NOT NULL PRIMARY KEY auto_increment,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255) NOT NULL,
    Gender VARCHAR(255),
    HomeAddress VARCHAR(255)

);

 Create TABLE IF NOT EXISTS Doctor(
	doc_id int NOT NULL PRIMARY KEY auto_increment,
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
    Date date DEFAULT NULL,
    Time time DEFAULT NULL,
    Reason VARCHAR(255),
    FOREIGN KEY (doc_id) REFERENCES Doctor(doc_id),
	FOREIGN KEY (user_id) REFERENCES User(UserId)
);



INSERT INTO User(UserId, Password, FirstName, LastName, Email, Gender, HomeAddress)
	VALUES(User.UserId, 'abc123', 'Max', 'Gold', 'jSmith@gmail.com', 'Male', '123 Main st.');

INSERT INTO Doctor(doc_id, Password, FirstName, LastName, Email, Gender, OfficeAddress, specialization)
	VALUES(Doctor.doc_id, 'doc123', 'Doctor', 'Doctorson M.D.', 'doctor@gmail.com', 'Male', '123 Main st.', 'bellybutton');
    
INSERT INTO Appointment(appointmentID, doc_id, user_id, Date, Time, Reason)
	VALUES(100, 1, 1, '4/12/18', '12:00', 'Bellybutton Hurting');
    

SELECT * from Appointment;
SELECT * from User;
