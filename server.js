'use strict';

const Hapi = require('hapi');
// const Intert = require('inert');
const Path = require('path');

const server = new Hapi.Server({ host: '0.0.0.0', port: 4000 });

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

server.route({
  method: 'POST',
  path: '/user',
  handler: function(request, reply) {
    return ('User Added: ' + request.payload['lName'] + ', '
    + request.payload['fName']);
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

//Route for scheduling an appointment 
server.route({
  method: 'GET',
  path: '/wellcare/appointments',
  handler: function(request, reply){

      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT * FROM Appointment", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(reply.response(results));

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
  path: '/createaccount',
  handler: function(request, reply) {

    const UserId = request.payload.UserId;
    const Password = request.payload.Password;
    const FirstName = request.payload.FirstName;
    const LastName = request.payload.LastName;
    const Email = request.payload.Email;
    const Gender = request.payload.Gender;
    const HomeAddress = request.payload.HomeAddress;

    return new Promise(function(resolve, reject) {
      var sql = 'INSERT INTO User (UserId, Password, FirstName, LastName, Email, Gender, HomeAddress) VALUES(' + UserId + ',' + "'" + Password + "'" + ','
      + "'" + FirstName + "'" + ',' + "'" + LastName + "'" + ',' + "'" + Email + "'" + ',' + "'" + Gender + "'" + ',' + "'" + HomeAddress + "'" + ')';
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

server.route({
  method: 'POST',
  path: '/login',
  handler: function(request, h) {
    return new Promise(function(resolve, reject) {
      resolve(h.response("User log-in"));
    });
  }
});

server.route({
  method: 'POST',
  path: '/changepassword',
  handler: function(request, h) {
    return new Promise(function(resolve, reject) {
      resolve(h.response("User added"));
    });
  }
});

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