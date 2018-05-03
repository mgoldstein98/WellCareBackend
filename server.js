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
 
     mysqlCon.query("SELECT FirstName FROM User", function (error, results, fields) {
 
       
 
       console.log(results); 
 
       resolve(reply.response("Hello " + results[0].FirstName + ", welcome to WellCare!"));
 
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

      mysqlCon.query("SELECT LastName FROM Doctor", function (error, results, fields) {
  
        
  
        console.log(results); 
  
        resolve(reply.response("Welcome back Dr. " + results[0].LastName + "!"));
  
      })
  });
  }
 });

// server.route({
//   method: 'POST',
//   path: '/user',
//   handler: function(request, reply) {
//     return ('User Added: ' + request.payload['lName'] + ', '
//     + request.payload['fName']);
//   }
// });

server.route({
  method: 'POST',
  path: '/user/makeAppt',
  handler: function(request, reply) {
    
    const appointmentID = request.payload.appointmentID;
    const doc_id = request.payload.doc_id;
    const user_id = request.payload.user_id;
    const Date = request.payload.Date;
    const Time = request.payload.Time ;
    const Reason = request.payload.Reason;
   
    return new Promise(function(resolve, reject) {
      var sql = 'INSERT INTO Appointment (appointmentID, doc_id, user_id, Date, Time, Reason) VALUES(' + appointmentID + ',' + "'" + doc_id + "'" + ','
      + "'" + user_id + "'" + ',' + "'" + Date + "'" + ',' + "'" + Time + "'" + ',' + "'" + Reason +  "'" + ')';
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

      mysqlCon.query("SELECT * FROM Doctor", function (error, results, fields) {

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
  method: 'POST',
  path: '/patient/myDocs',
  handler: function(request, reply){
      const PatientId = request.payload.patient_id;
      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT doctor.* FROM Appointment INNER JOIN doctor ON Appointment.patient = " + PatientId + ";", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(reply.response(results));

        })
    });
  }
});


server.route({
  method: 'PUT',
  path: '/wellcare/updateAppointments',
  handler: function(request, reply){

      return new Promise(function(resolve, reject){

        mysqlCon.query("UPDATE Appointment INNER JOIN User ON Appointment.doctor = User.UserId SET Time = '12:20' WHERE Appointment.user_id = User.UserId", function (error, results, fields) {

          if (error) throw error;

          console.log(results.affectedRows + " record(s) updated"); 

          resolve(reply.response(results.affectedRows + " record(s) updated"));

        })
    });
  }
});

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



server.route({

  method: 'POST',

  path: '/_register/patient',

  handler: function(request, reply) {

  //post to patient

    console.log(request.payload.allData);



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




// server.route({
//   method: 'POST',
//   path: '/_register',
//   handler: function(request, reply) {

//     const UserId = request.payload.UserId;
//     const Password = request.payload.Password;
//     const FirstName = request.payload.FirstName;
//     const LastName = request.payload.LastName;
//     const Email = request.payload.Email;
//     const Gender = request.payload.Gender;
//     const HomeAddress = request.payload.HomeAddress;

//     console.log(request.payload);

//     return new Promise(function(resolve, reject) {
//       var sql = 'INSERT INTO User (UserId, Password, FirstName, LastName, Email, Gender, HomeAddress) VALUES(' + UserId + "," + "'" + Password + "'" + ','
//       + "'" + FirstName + "'" + ',' + "'" + LastName + "'" + ',' + "'" + Email + "'" + ',' + "'" + Gender + "'" + ',' + "'" + HomeAddress + "'" + ')';
//       mysqlCon.query(sql, function (err, result) {
//         if (err) {
//           throw err;
//           resolve(reply.response("404: User not added"));
//         }
//         else {
//           // console.log(result);
//           resolve(reply.response(result));
//         }
//       });
//     }); 
//   }
// });

// server.route({
//   method: 'POST',
//   path: '/login',
//   handler: function(request, reply) {
  
//     const Email = request.payload.Email;
//     const Password = request.payload.Password;

//     return new Promise(function(resolve, reject) {
//       var sql = "SELECT Password FROM User WHERE Email = '" + Email + "';";

//       mysqlCon.query(sql, function (err, result) {
//         if (err) {
//           throw err;
//           resolve(reply.response("404: User not added"));
//         }
//         else {
//           var pass = result[0].Password;
//           if(Password === pass)
//             resolve(reply.response(JSON.stringify('Login Success')));
            
//           else
//             resolve(reply.response(JSON.stringify('Login Failed')));
//         }
//       });
//     });
//   }
// });


// server.route({
//   method: 'POST',
//   path: '/login',
//   handler: function(request, reply) {
  
//     const UserId = request.payload.UserId;
//     const Password = request.payload.Password;

//     return new Promise(function(resolve, reject) {
//       var sql = "SELECT Password FROM User WHERE UserId = '" + UserId + "';";

//       mysqlCon.query(sql, function (err, result) {
//         if (err) {
//           throw err;
//           resolve(reply.response("404: User not added"));
//         }
//         else {
//           var pass = result[0].Password;
//           if(Password === pass)
//             resolve(reply.response(JSON.stringify('Login Success')));
            
//           else
//             resolve(reply.response(JSON.stringify('Login Failed')));
//         }
//       });
//     });
//   }
// });


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


server.route({
  method: 'POST',
  path: '/changepassword',
  handler: function(request, h) {

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


          // var pass = result[0].password;
          // if(password === pass)
          //   resolve(reply.response(JSON.stringify('Login Success')));
            
          // else
          //   resolve(reply.response(JSON.stringify('Login Failed')));
        }
      });
    });
  }
});

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

          // var pass = result[0].password;
          // if(password === pass)
          resolve(reply.response(JSON.stringify(result[0])));
            
          // else
          //   resolve(reply.response(JSON.stringify('Login Failed')));
        }
      });
    });
  }
});


server.route({
  method: 'POST',
  path: '/_patient-profile',
  handler: function(request, reply) {
    console.log(request.arguments);
    return new Promise(function(resolve, reject) {
      console.log("XXXXXXX");
      const username = request.payload.username;
      console.log(username);
      var sql = "SELECT * FROM patient WHERE username = '" + username + "';";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }
        else {
          console.log(result[0]);

          // var pass = result[0].password;
          // if(password === pass)
          resolve(reply.response(JSON.stringify(result[0])));
            
          // else
          //   resolve(reply.response(JSON.stringify('Login Failed')));
        }
      });
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


server.route({
  method: 'POST',
  path: '/prescription/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

      var sql = "SELECT * FROM prescription WHERE patient_id = " + patient_id + ";";

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
  path: '/notifications/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

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

server.route({
  method: 'POST',
  path: '/perscriptions/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {
      const patient_id = request.payload.patient_id;
      console.log(patient_id);

      var sql = "SELECT * FROM prescription WHERE patient = " + patient_id + ";";

      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }

        else {
          console.log(result);

          resolve(reply.response(JSON.stringify(result[0])));
            
        }
      });
    });
  }
});

server.route({
  method: 'POST',
  path: '/appointments/patient',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const patient_id = request.payload.patient_id;

      var sql = "SELECT * FROM Appointment WHERE patient = " + patient_id + ";";

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
        } else {
          console.log(result[0]);
          resolve(reply.response(JSON.stringify(result[0])));
        }
      });
    });
  }
});

// ///////////////// Doctor Routes ///////////////////////////
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

          // var pass = result[0].password;
          // if(password === pass)
          resolve(reply.response(JSON.stringify(result[0])));
            
          // else
          //   resolve(reply.response(JSON.stringify('Login Failed')));
        }
      });
    });
  }
});
server.route({
  method: 'POST',
  path: '/_doc-profile/byId',
  handler: function(request, reply) {
    console.log(request.arguments);
    return new Promise(function(resolve, reject) {
      console.log("XXXXXXX");
      const doc_id = request.payload.doc_id;
      console.log(doc_id);
      var sql = "SELECT * FROM doctor WHERE doc_id = " + doc_id + ";";

      mysqlCon.query(sql, function (err, result) {
        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        }
        else {
          console.log(result[0]);

          // var pass = result[0].password;
          // if(password === pass)
          resolve(reply.response(JSON.stringify(result[0])));
            
          // else
          //   resolve(reply.response(JSON.stringify('Login Failed')));
        }
      });
    });
  }
});

server.route({
  method: 'POST',
  path: '/docnotes/doctor',
  handler: function(request, reply) {
    console.log(request.payload.doc_id + " ****");
    return new Promise(function(resolve, reject) {
      const doc_id = request.payload.doc_id;
      console.log(patient_id);

      var sql = "SELECT * FROM DocNote WHERE doc_id = " + doc_id + ";";
      mysqlCon.query(sql, function (err, result) {

        if (err) {
          throw err;
          resolve(reply.response("404: User not added"));
        } else {
          console.log(result[0]);
          resolve(reply.response(JSON.stringify(result[0])));
        }
      });
    });
  }
});

server.route({
  method: 'POST',
  path: '/prescription/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM prescription WHERE doc_id = " + doc_id + ";";

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

server.route({
  method: 'POST',
  path: '/perscriptions/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;
      console.log(patient_id);

      var sql = "SELECT * FROM prescription WHERE doc_id = " + doc_id + ";";

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
  path: '/appointments/doctor',
  handler: function(request, reply) {
    return new Promise(function(resolve, reject) {

      const doc_id = request.payload.doc_id;

      var sql = "SELECT * FROM Appointment WHERE doctor = " + doc_id + ";";

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