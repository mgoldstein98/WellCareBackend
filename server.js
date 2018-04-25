'use strict';

const Hapi = require('hapi');
// const Intert = require('inert');
const Path = require('path');

const server = new Hapi.Server({ host: '0.0.0.0', port: 4000});

var mysql = require('mysql');


var mysqlCon = mysql.createConnection({
    //host will be the name of the service from the docker-compose file.
    host     : 'database',
    user     : 'USR',
    password : 'abc123',
    database : 'WellcareDB'
});

// Route for Home Landing Page 
server.route({
 method: 'GET',
 path: '/Home',
 handler: function (request, reply) {
    return('<h1> Welcome to WellCare</h1>');
 }
});

//Route For Specific User account 
server.route({
  method: 'GET',
  path: '/account/user/name',
 
  //returns welcome message and user's first name from Database
  handler: function (request, reply) {
   return new Promise(function(resolve, reject){
 
     mysqlCon.query("SELECT firstName FROM patient", function (error, results, fields) {
 
 
       console.log(results); 
 
       resolve(reply.response("Hello " + results[0].firstName + ", welcome to WellCare!"));
 
     })
 });
  }
 });

//Route For Specific Doctor account 
server.route({
  method: 'GET',
  path: '/account/doc/name',

  //returns welcome message and doctor's last name from Database
  handler: function (request, reply) {
    return new Promise(function(resolve, reject){

      mysqlCon.query("SELECT lastName FROM doctor", function (error, results, fields) {
  
        console.log(results); 
  
        resolve(reply.response("Welcome back Dr. " + results[0].lastName + "!"));
  
      })
  });
  }
 });

//creates an appt
server.route({
  method: 'POST',
  path: '/user/makeAppt',
  handler: function(request, reply) {
    
    const appointmentID = request.payload.appointment_id;
    const doc_id = request.payload.doc_id;
    const user_id = request.payload.user_id;
    const Date = request.payload.A_Date;
    const Time = request.payload.A_Time ;
    const Reason = request.payload.Reason;
   
    return new Promise(function(resolve, reject) {
      var sql = 'INSERT INTO Appointment (appointment_id, doc_id, user_id, A_Date, A_Time, Reason) VALUES(' + appointmentID + ',' + "'" + doc_id + "'" + ','
      + "'" + user_id + "'" + ',' + "'" + Date + "'" + ',' + "'" + Time + "'" + ',' + "'" + Reason +  "'" + ') ' ;
      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }
        else {
        console.log(result);
        resolve(reply.response(result));
        }
      });
    });
  }
});


//Route for returning all users
server.route({
  method: 'GET',
  path: '/account/user',

  //returns all user data
  handler: function(request, reply){

      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT * FROM patient", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(reply.response(results));

        })
    });
  }
});

///Route for Doctor Account page #default 
server.route({
  method: 'GET',
  path: '/account/doc',
  handler: function(request, reply){

    //returns all data from Doctor table
    return new Promise(function(resolve, reject){

      mysqlCon.query("SELECT * FROM doctor", function (error, results, fields) {

        if (error) throw error;

        console.log(results); 

        resolve(reply.response(results));

      })
  });
  }
});

//Route for Logout Page 
server.route({
  method: 'GET',
  path: '/wellcare/logout',
  handler: function(request, reply){

      return new Promise(function(resolve, reject){

          resolve(reply.response("Goodbye!"));

    });
  }
});

//Route for managing an appointment 
server.route({
  method: 'GET',
  path: '/wellcare/manageAppointments',
  handler: function(request, reply){

      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT A_Date, A_Time, Reason, firstName, lastName, address FROM Appointment INNER JOIN doctor ON Appointment.doc_id = doctor.doc_id", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(reply.response(results));

        })
    });
  }
});

//update to appts table, changes appt time (hardcoded)
server.route({
  method: 'PUT',
  path: '/wellcare/updateAppointments',
  handler: function(request, reply){

      return new Promise(function(resolve, reject){

        mysqlCon.query("UPDATE Appointment INNER JOIN patient ON Appointment.user_id = patient.patient_id SET A_Time = '14:00' WHERE Appointment.user_id = patient.patient_id", function (error, results, fields) {

          if (error) throw error;

          console.log(results.affectedRows + " record(s) updated"); 

          resolve(reply.response(results.affectedRows + " record(s) updated"));

        })
    });
  }
});

//gets reason for appt
server.route({
  method: 'GET',
  path: '/account/user/reason',
  handler: function(request, reply){

      //returns user reason for appointment
      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT Reason FROM Appointment", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(reply.response(results[0].Reason));

        })
    });
  }
});

//registers a user, puts all user info into doctor DB
server.route({

  method: 'POST',

  path: '/_register/doc',

  handler: function(request, reply) {

      const DocId = request.payload.doc_id;
      const Username = request.payload.username;
      const Password = request.payload.password;
      const FirstName = request.payload.firstName;
      const LastName = request.payload.lastName;
      const Specialty = request.payload.specialty;
      const Email = request.payload.email;
      const Phone = request.payload.phone;
      const Address = request.payload.address;
      const Rating = request.payload.rating;
      const ProfilePic = request.payload.profPic;
    
      console.log(request.payload);

      return new Promise(function(resolve, reject) {

        var docSql = 'INSERT INTO doctor (doc_id,username, password, firstName, lastName, specialty, email, phone,address,rating,profPic) VALUES(' + DocId + "," + "'" + Username + "'" + ','
        + "'" + Password + "'" + ',' + "'" + FirstName + "'" + ',' + "'" + LastName + "'" + ',' + "'" + Specialty + "'" + ',' + "'" + Email + "'" + ',' + "'" + Phone + "'" + ','
         + "'" + Address + "'" + ',' +  Rating + ',' + "'" + ProfilePic + "'" +'); ';

        mysqlCon.query(docSql, function (err, result) {

          if (err) {

            throw err;
            resolve(reply.response("404: User not added"));

          }

          else {

            // console.log(result);
            resolve(reply.response(result));
            
          }
        });

        var userSql = 'INSERT INTO User (username, password, isDoc) VALUES(' + "'" + Username + "'" + "," + "'" + Password + "'" + "," + 1 +'); ';

        mysqlCon.query(userSql, function (err, result) {

          if (err) {

            throw err;
            resolve(reply.response("404: User not added"));

          }

          else {

            // console.log(result);
            resolve(reply.response(result));
            
          }
        });
      
      });
    }
  });

server.route({

    method: 'POST',
  
    path: '/_register/patient',
  
    handler: function(request, reply) {
  
    //post to patient
  

      const PatientId = request.payload.patient_id;
      const Gender = request.payload.gender;
      const Username = request.payload.username;
      const Password = request.payload.password;
      const FirstName = request.payload.firstName;
      const LastName = request.payload.lastName;
      const Email = request.payload.email;
      const Phone = request.payload.phone;
      const Address = request.payload.address;
      const EmergencyContact = request.payload.emergency_contact;
      const Dob = request.payload.dob;
      const ProfilePic = request.payload.profPic;
    
      console.log(request.payload);

      return new Promise(function(resolve, reject) {

        var sql = 'INSERT INTO patient (patient_id,gender,username, password, firstName, lastName, email, phone,address,emergency_contact,dob,profPic) VALUES(' + PatientId + "," + "'" + Gender + "'" + "," + "'" + Username + "'" + ','
        + "'" + Password + "'" + ',' + "'" + FirstName + "'" + ',' + "'" + LastName + "'" + ',' + "'" + Email + "'" + ',' + "'" + Phone + "'" + ','
         + "'" + Address + "'" + ',' + "'" + EmergencyContact + "'" + ',' + "'" + Dob + "'" + "," + "'" + ProfilePic + "'" +')';

        mysqlCon.query(sql, function (err, result) {

          if (err) {

            throw err;
            resolve(reply.response("404: User not added"));

          }

          else {

            // console.log(result);
            resolve(reply.response(result));

          }
        
        });

        var userSql = 'INSERT INTO User (username, password, isDoc) VALUES(' + "'" + Username + "'" + "," + "'" + Password + "'" + "," + 0 +'); ';

        mysqlCon.query(userSql, function (err, result) {

          if (err) {

            throw err;
            resolve(reply.response("404: User not added"));

          }

          else {

            // console.log(result);
            resolve(reply.response(result));
            
          }
        });

      });
    }
});

//change password for USER
server.route({
  method: 'POST',
  path: '/changepassword',
  handler: function(request, h) {
    return new Promise(function(resolve, reject) {
      resolve(h.response("User added"));
    });
  }
});

//add doctor acct info
server.route({
  method: 'POST',
  path: '/doctor',
  handler: function(request, h) {
    return new Promise(function(resolve, reject) {

      resolve(h.response("User added"));
    });
  }
});


server.route({
  method: 'POST',
  path: '/HIPPA',
  handler: function(request, h) {
    return new Promise(function(resolve, reject) {

      resolve(h.response("User added"));
    });
  }
});

server
  .start()
  .catch(err => {
    console.log(err);
})