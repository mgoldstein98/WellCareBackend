
'use strict';

// const cors = require 
const Hapi = require('hapi');
// const Intert = require('inert');
const Path = require('path');

const server = new Hapi.Server({ host: '0.0.0.0', port: 4000, routes: {cors: true } }); //{origin: ['http://localhost:4200'] }
var mysql = require('mysql');


var mysqlCon = mysql.createConnection({
    //host will be the name of the service from the docker-compose file.
    host     : 'database',
    user     : 'USR',
    password : 'abc123',
    database : 'WellcareDB'
});

//makes appointment for a patient
server.route({
  method: 'POST',
  path: '/patient/makeAppt',
  handler: function(request, reply) {
    
    
    const doc_id = request.payload.doc_id;
    const user_id = request.payload.user_id;
    const Date = request.payload.Date;
    const Time = request.payload.Time ;
    const Reason = request.payload.Reason;
    const status = request.payload.status;

    return new Promise(function(resolve, reject) {
      var sql = 'INSERT INTO Appointment (doc_id, user_id, A_Date, A_Time, Reason, status) VALUES(' + doc_id  + ','
      + user_id + ',' + "'" + Date + "'" + ',' + "'" + Time + "'" + ',' + "'" + Reason +  "'" + ',' + "'" + status + "'" + ')';
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

        mysqlCon.query("SELECT * FROM User", function (error, results, fields) {

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

//Route for managing an appointment 
server.route({
  method: 'POST',
  path: '/patient/myDocs',
  handler: function(request, reply){
      const PatientId = request.payload.user_id;
      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT doctor.* FROM Appointment INNER JOIN doctor ON Appointment.user_id = " + PatientId + ";", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(reply.response(results));

        })
    });
  }
});

//changes a patients appointment time
server.route({
  method: 'PUT',
  path: '/wellcare/updateAppointments',
  handler: function(request, reply){
      const Time = request.payload.time;
      const PatientId = request.payload.patient_id;
      return new Promise(function(resolve, reject){

        mysqlCon.query("UPDATE Appointment INNER JOIN patient ON Appointment.doc_id = " + PatientId + " SET A_Time = " + "'" + Time + "'" + " WHERE Appointment.user_id = patient.patient_id", function (error, results, fields) {

          if (error) throw error;

          console.log(results.affectedRows + " record(s) updated"); 

          resolve(reply.response(results.affectedRows + " record(s) updated"));

        })
    });
  }
});

//gets reasons for appointments
server.route({
  method: 'GET',
  path: '/account/user/reason',
  handler: function(request, reply){

      //returns user reason for appointment
      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT Reason FROM Appointment", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(reply.response(results));

        })
    });
  }
});


//route that registers the patient, and puts username, password, and isDoc into User DB
server.route({

  method: 'POST',

  path: '/_register/patient',

  handler: function(request, reply) {

  //post to patient

    console.log(request.payload.allData);

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

      var sql = 'INSERT INTO patient (gender,username, password, firstName, lastName, email, phone,address,emergency_contact,dob,profPic) VALUES('+ "'" + Gender + "'" + "," + "'" + Username + "'" + ','
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

//route that registers the doctor, and puts username, password, and isDoc into User DB
server.route({

  method: 'POST',

  path: '/_register/doc',

  handler: function(request, reply) {

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

        var docSql = 'INSERT INTO doctor (username, password, firstName, lastName, specialty, email, phone,address,rating,profPic) VALUES(' + "'" + Username + "'" + ','
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

//login logic
server.route({
  method: 'POST',
  path: '/login',
  handler: function(request, reply) {
  
    const username = request.payload.username;
    const password = request.payload.password;

    console.log(username, password);

    return new Promise(function(resolve, reject) {
      var sql = "SELECT * FROM User WHERE username = '" + username + "';";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }
        else {
          console.log(result);
          var pass = result[0].password;
          if(password === pass)
            if(result[0].isDoc === 1)
              resolve(reply.response(JSON.stringify('1')));
            else
              resolve(reply.response(JSON.stringify('0')));
            
          else
            resolve(reply.response(JSON.stringify('-1')));
        }
      });
    });
  }
});

//route to change user password
server.route({
  method: 'POST',
  path: '/changepassword',
  handler: function(request, reply) {

    const username = request.payload.username;
    const password = request.payload.password;

    console.log(username, password);

    return new Promise(function(resolve, reject) {
      var sql = "UPDATE User SET password = '" + password + "' WHERE username = '" + username + "';";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }
        else {
          console.log('true');

          resolve(reply.response(JSON.stringify('Password Changed!')));
          
        }
      });
    });
  }
});


//gets all patient attributes for an ID
server.route({
  method: 'POST',
  path: '/_patient-profile',
  handler: function(request, reply) {

    console.log(request.arguments);

    return new Promise(function(resolve, reject) {
 
      const username = request.payload.username;

      var sql = "SELECT * FROM patient WHERE username = '" + username + "';";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
         
        }
      });
    });
  }
});

//gets all patients prescriptions
server.route({
  method: 'POST',
  path: '/prescription/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

      var sql = "SELECT * FROM perscription WHERE patient_id = " + patient_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

//gets all patients notifications given ID
server.route({
  method: 'POST',
  path: '/notifications/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

      var sql = "SELECT Notification.*, firstName , lastName , address  FROM Notification INNER JOIN doctor ON Notification.patient_id =" + patient_id + ";"
      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

//gets prescription for a given patient ID
server.route({
  method: 'POST',
  path: '/prescriptions/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {
      const patient_id = request.payload.patient_id;
      console.log(patient_id);

      var sql = "SELECT * FROM perscription WHERE patient_id = " + patient_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result);

          resolve(reply.response(JSON.stringify(result)));
            
        }
      });
    });
  }
});

//gets appointments for patient
server.route({
  method: 'POST',
  path: '/appointments/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

      var sql = "SELECT * FROM Appointment WHERE user_id = " + patient_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result);

          resolve(reply.response(JSON.stringify(result)));
            
        }
      });
    });
  }
});

//gets patients doctor notes
server.route({
  method: 'POST',
  path: '/docnotes/patient',
  handler: function(request, reply) {

    console.log(request.payload.patient_id + " ****");
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

      console.log(patient_id);
      var sql = "SELECT * FROM DocNote WHERE patient_id = " + patient_id + ";";
      mysqlCon.query(sql, function (err, result) {

        if (err) {

          throw err;
          resolve(reply.response("404: User not added"));

        } 
        else {

          console.log(result);
          resolve(reply.response(JSON.stringify(result)));

        }
      });
    });
  }
});

// ///////////////// Doctor Routes ///////////////////////////

//gets doctors profile given a username
server.route({
  method: 'POST',
  path: '/_doc-profile',
  handler: function(request, reply) {

    console.log(request.arguments);
    return new Promise(function(resolve, reject) {

      console.log("XXXXXXX");
      const username = request.payload.username;
      console.log(username);
      var sql = "SELECT * FROM doctor WHERE username = '" + username + "';";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }
        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

//gets all doctor attributes for an ID
server.route({
  method: 'POST',
  path: '/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM doctor WHERE doc_id = " + doc_id + ";";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }
        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

//gets doctors doctor notes
server.route({
  method: 'POST',
  path: '/docnotes/doctor',
  handler: function(request, reply) {

    console.log(request.payload.doc_id + " ****");
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM DocNote WHERE doc_id = " + doc_id + ";";
      mysqlCon.query(sql, function (err, result) {

        if (err) {

          throw err;
          resolve(reply.response("404: User not added"));

        } 
        else {

          console.log(result[0]);
          resolve(reply.response(JSON.stringify(result[0])));

        }
      });
    });
  }
});

//get prescription by doc ID
server.route({
  method: 'POST',
  path: '/prescription/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM perscription WHERE doc_id = " + doc_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

server.route({
  method: 'POST',
  path: '/notifications/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM Notification WHERE patient_id = " + doc_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

//get prescriptions given docID
server.route({
  method: 'POST',
  path: '/perscriptions/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM perscription WHERE doc_id = " + doc_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

//gets appointments given docID
server.route({
  method: 'POST',
  path: '/appointments/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM Appointment WHERE doc_id  = " + doc_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result)));
            
        }
      });
    });
  }
});

//delete an appointment
server.route({
  method: 'DELETE',
  path: '/appointments/delete',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patientID = request.payload.user_id;
      const time = request.payload.A_Time;
      const date = request.payload.A_Date;

      var sql = "DELETE FROM Appointment WHERE user_id =" + patientID + " AND A_Time = " + "'" + time + "'" + "AND A_Date = " + "'" + date + "'";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result)));
            
        }
      });
    });
  }
});

server
  .start()
  .catch(err => {
    console.log(err);
})