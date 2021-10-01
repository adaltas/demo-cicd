
'use strict';

const Hapi = require('@hapi/hapi');
const Path = require('path');
const env = process.env.ENVIRONMENT

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0',
  routes: {
    files: {
        relativeTo: Path.join(__dirname, '../db')
    }
  }
})

server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: (request, h) => {
      return `Hello World ! Welcome to Corsica ? We are running on ${env}`
    }
  } 
})

exports.init = async () => {
  await server.initialize();
  return server;
}

exports.start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
