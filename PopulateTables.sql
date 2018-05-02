USE WellcareDB;

-- 
-- INSERT INTO User (username, password, isDoc) 
-- 	VALUES(19, "abe",1);
    
-- INSERT INTO User (username, password, isDoc) 
-- 	VALUES(20, "abe",0);

-- INSERT INTO doctor (doc_id,username, password, firstName, lastName, specialty, email, phone,address,rating,profPic) 
-- 	VALUES(2, "doc1", "docPass1", "Doctor", "doctorman", "Brains", "doc@gmail.com", "555-555-5555", "123 doc st.", 5, "profPic.jpg");

-- 
-- INSERT INTO patient (patient_id,gender,username, password, firstName, lastName, email, phone,address,emergency_contact,dob,profPic) 
-- 	VALUES(20,"male","user1", "pass1", "John", "Smith", "jsmith@gmail.com", "555-555-5555", "123 st.", "mom", '1998-02-17', "prof.com");




-- INSERT INTO DocNote (doc_id, patient_id, note) 
-- 	VALUES(2, 20,"drive fast eat ass");


-- 	doc_id int,
-- 	patient_id int,
-- 	start_Date date, 
-- 	Rx_Numb int,
-- 	refill int default 0,
-- 	_ID int generated always AS (patient_id + Rx_Numb)STORED PRIMARY KEY,
-- 	script varchar(255),
-- 
-- 
-- INSERT INTO prescription (doc_id, patient_id, start_Date, Rx_Numb, refill, script) 
-- 	VALUES(2, 20,"12-12-18", 10, 5,  "mo sleep");

SELECT * FROM prescription;
-- SELECT * FROM User;


-- var sql = "SELECT * FROM doctor WHERE doc_id = " + doc_id + ";";