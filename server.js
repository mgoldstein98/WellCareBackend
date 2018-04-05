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


// server.route({
//   method: 'GET',
//   path: '/picture',
//   handler: {
//       file: 'picture.jpg'
//   }
// });


// Mock up minimum of 10 endpoints in postman, mixture of get and post
// 


server.route({
 method: 'GET',
 path: '/',
 handler: function (request, reply) {
    return('<h1> Hello World </h1>');
    // return 'hey'
 }
});

// server.route({
//  method: 'GET',
//  path: '/{name}',
//  handler: function (request, reply) {
//     return('Hello, ' + encodeURIComponent(request.params.name) + '!');
//     // return 'hey'
//  }
// });

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

      resolve(h.response("User added"));
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
