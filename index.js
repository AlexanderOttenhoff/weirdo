'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(Inert, () => {});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './public',
            redirectToSlash: true,
            index: true
        }
    }
});

server.route({
    method: 'GET',
    path: '/api/posts',
    handler: function (request, reply) {

        return reply([{ name: 'hello', id: 0 }, { name: 'world', id: 1 }]);
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
