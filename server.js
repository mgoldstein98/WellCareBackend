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
//
//   await server.register(require('inert'));
//
//   server.route({
//       method: 'GET',
//       path: '/picture',
//       handler: function (request, h) {
//
//           return h.file('picture.jpg');
//       }
//   });
//
//   await server.start();
//
//   console.log('Server running at:', server.info.uri);
// };
//
// start();





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
 path: '/{name}',
 handler: function (request, reply) {
    return('Hello, ' + encodeURIComponent(request.params.name) + '!');
    // return 'hey'
 }
});

server.route({
  method: 'POST',
  path: '/post',
  handler: function(request, reply) {
    // mysqlCon.connect();
    // mysqlCon.query('INSERT INTO User VALUES(2, "abc123", "It", "Worked", "jSmith@gmail.com", "Male", "123 Main st.")', function (error, results, fields) {
    //   if (error)
    //     throw error;
    //   return ('Successfully inserted');

    // return('made it here');



    const UserId = request.payload.UserId;
    const Password = request.payload.Password;
    const FirstName = request.payload.FirstName;
    const LastName = request.payload.LastName;
    const Email = request.payload.Email;
    const Gender = request.payload.Gender;
    const HomeAddress = request.payload.HomeAddress;

    // console.log(UserId, Password, FirstName, LastName, Email, Gender, HomeAddress);
    // var str = "" + UserId + ',' + Password + ',' + FirstName + ',' + LastName + ',' + Email + ',' + Gender + ',' + HomeAddress;
    // return(str);

    // return(sql);

    mysqlCon.connect(function(err) {
      if (err) throw err;
      var sql = 'INSERT INTO User (UserId, Password, FirstName, LastName, Email, Gender, HomeAddress) VALUES(' + UserId + ',' + "'" + Password + "'" + ','
      + "'" + FirstName + "'" + ',' + "'" + LastName + "'" + ',' + "'" + Email + "'" + ',' + "'" + Gender + "'" + ',' + "'" + HomeAddress + "'" + ')';
      mysqlCon.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        // console.log("1 record inserted");
      });
    });
    return('yeet');
  }
});


server
  .start()
  .catch(err => {
    console.log(err);
  })
