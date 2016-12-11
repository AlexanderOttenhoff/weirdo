'use strict';
const Server = class {

    constructor(worker) {

        this.routes = {};
        this.worker = worker;
    }

    start() {

        const self = this;
        this.worker.addEventListener('fetch', (evt) => {

            return self.handle(evt);
        });
    }

    handle(evt) {

        const method = evt.request.method.toLowerCase();
        const path = '/' + evt.request.url.split(evt.request.referrer).pop();
        if (this.routes[path] && this.routes[path][method]) {

            return this.routes[path][method](evt.request, (res) => {

                return evt.respondWith(new Response(JSON.stringify(res)));
            });
        }
        return evt.respondWith(fetch(evt.request));
    }

    route(tentativeRoute) {

        const method = tentativeRoute.method.toLowerCase();
        const path = tentativeRoute.path;
        const handler = tentativeRoute.handler;
        this.routes[path] = this.routes[path] || {};
        this.routes[path][method] = handler;
    }
};

const Hapi = { Server };


const server = new Hapi.Server(this);

server.route({
    method: 'GET',
    path: '/api/posts',
    handler: function (request, reply) {

        return reply([{ name: 'I', id: 0 }, { name: 'believe', id: 1 }]);
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
