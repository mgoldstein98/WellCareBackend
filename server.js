'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server({ host: '0.0.0.0', port: 4000 });

server.route({
 method: 'GET',
 path: '/',
 handler: function (request, reply) {
    return('Hello, world!');
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


server  
  .start()
  .catch(err => {
    console.log(err);
  })

// server.start((err) => {
// if (err) {
//  throw err;
//  }
//  console.log(`Server running at: ${server.info.uri}`);
//  //return 'hey'
// });

// process.on('unhandledRejection', (reason, p) => {
//       console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);

      // application specific logging, throwing an error, or other logic here
// });