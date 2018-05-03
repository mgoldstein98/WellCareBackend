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


///gets all doctor attributes 
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

//gets all patient attributes
server.route({
  method: 'GET',
  path: '/account/patient',
  handler: function(request, reply){

    //returns all data from Doctor table
    return new Promise(function(resolve, reject){

      mysqlCon.query("SELECT * FROM patient", function (error, results, fields) {

        if (error) throw error;

        console.log(results); 

        resolve(reply.response(results));

      })
  });
  }
});

//gets doctor attributes by given ID
server.route({
  method: 'POST',
  path: '/_doctor-profile',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.username;

      var sql = "SELECT * FROM doctor WHERE doc_id = " + doc_id + ";";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          
        }
        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));

        }
      });
    });
  }
});

//gets doctor attributes by given ID
server.route({
  method: 'POST',
  path: '/_patient-profile',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.username;
      
      var sql = "SELECT * FROM patient WHERE patient_id = " + patient_id + ";";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          
        }
        else {
          console.log(result[0]);

          resolve(reply.response(JSON.stringify(result[0])));

        }
      });
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
  method: 'POST',
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

//gets reason for appt
server.route({
  method: 'GET',
  path: '/patientAppointmentArray',
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

//creates a patient account
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

//shows all availiable times for a given date (YYYY-MM-DD)
server.route({
  method: 'POST',
  path: '/appointments/availableTimes',
 
  //returns welcome message and doctor's last name from Database
  handler: function (request, reply) {
    const Date = request.payload._Date;
    return new Promise(function(resolve, reject){

      mysqlCon.query("SELECT _Time FROM avail_Times WHERE avail_Times._Date = " + "'" + Date + "';" , function (error, results, fields) {
  
        var count =  results.length;
        console.log(count);
        console.log(results); 
        console.log(results[0]); 
        var timeString = "";
        for(var i = 0; i < count; i++){
          timeString += (results[i]._Time + "|");
         
        }
        //returning a string of times, delimited by pipes, approved by: Jeremy Brachle
        resolve(reply.response(JSON.stringify(timeString)));
  
      })
  });
  }
 });

//login function to connect
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

//gets all doctor perscriptions given an ID
server.route({
  method: 'POST',
  path: '/appointment/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM Appointment WHERE doc_id = " + doc_id + ";";

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

//gets all doctor perscriptions given an ID
server.route({
  method: 'POST',
  path: '/appointments/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const pat_id = request.payload.username;

      var sql = "SELECT * FROM Appointment WHERE user_id = " + pat_id + ";";

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

//gets all patient perscription given an ID
server.route({
  method: 'POST',
  path: '/perscription/patient',
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

//gets all patient perscription given an ID
server.route({
  method: 'POST',
  path: '/perscription/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doct_id = request.payload.doc_id;

      var sql = "SELECT * FROM perscription WHERE doc_id = " + doct_id + ";";

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

//gets all patient doctor notes given an ID
server.route({
  method: 'POST',
  path: '/docnotes/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

      var sql = "SELECT * FROM DocNote WHERE patient_id = " + patient_id + ";";

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

//gets all doctor notes for doctor given an ID
server.route({
  method: 'POST',
  path: '/docnotes/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doct_id = request.payload.doc_id;

      var sql = "SELECT * FROM DocNote WHERE doc_id = " + doct_id + ";";

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

//gets all patient notifications given an ID
server.route({
  method: 'POST',
  path: '/notifications/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.username;

      var sql = "SELECT * FROM Notification WHERE patient_id = " + patient_id + ";";

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

//gets all doctor notifications given an ID
server.route({
  method: 'POST',
  path: '/notifications/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doct_id = request.payload.doc_id;

      var sql = "SELECT * FROM Notification WHERE doc_id = " + doct_id + ";";

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

server
  .start()
  .catch(err => {
    console.log(err);
})

