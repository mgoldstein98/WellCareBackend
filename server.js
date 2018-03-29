'use strict';
const Hapi = require('hapi');

const server = new Hapi.Server({ port: 3600, host: 'web' });

server.route({
 method: 'GET',
 path: '/',
 handler: function (request, reply) {
    return('Hello, world!');
 }
});

server.route({
 method: 'GET',
 path: '/{name}',
 handler: function (request, reply) {
    return('Hello, ' + encodeURIComponent(request.params.name) + '!');
 }
});

server.start((err) => {
if (err) {
 throw err;
 }
 console.log(`Server running at: ${server.info.uri}`);
});

process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
      // application specific logging, throwing an error, or other logic here
});