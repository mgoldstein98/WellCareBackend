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



// const start = async () => {

//   await server.register(require('inert'));

//   server.route({
//       method: 'GET',
//       path: '/picture',
//       handler: function (request, h) {

//           return h.file('picture.jpg');
//       }
//   });

//   await server.start();

//   console.log('Server running at:', server.info.uri);
// };

// start();



//internals.init();

server.route({
 method: 'GET',
 path: '/',
 handler: function (request, reply) {
    return('<h1> Hello World </h1>');
    // return 'hey'
 }
});

server.route({
 method: 'GET',
 path: '/user/{name}',
 handler: function (request, reply) {
    return('Hello, ' + encodeURIComponent(request.params.name) + '!');
    // return 'hey'
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


server.route({
  method: 'GET',
  path: '/user/data',
  handler: function(request, h){

      return new Promise(function(resolve, reject){

        mysqlCon.query("SELECT * FROM User", function (error, results, fields) {

          if (error) throw error;

          console.log(results); 

          resolve(h.response(results));

        })
    });
  }
});

server.route({
  method: 'GET',
  path: '/wellcare/docProfile',
  handler: function(request, h){

      return new Promise(function(resolve, reject){

          resolve(h.response("Hello World"));

    });
  }
});

server.route({
  method: 'GET',
  path: '/wellcare/logout',
  handler: function(request, h){

      return new Promise(function(resolve, reject){

          resolve(h.response("Hello World"));

    });
  }
});

server.route({
  method: 'GET',
  path: '/wellcare/appointments',
  handler: function(request, h){

      return new Promise(function(resolve, reject){

          resolve(h.response("Hello World"));

    });
  }
});

server.route({
  method: 'GET',
  path: '/wellcare/settings',
  handler: function(request, h){

      return new Promise(function(resolve, reject){

          resolve(h.response("Hello World"));

    });
  }
});

server
  .start()
  .catch(err => {
    console.log(err);
})