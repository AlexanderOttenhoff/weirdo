'use strict';
const Http = require('http');
const uuid = require('node-uuid');
const PassThrough = require('stream').PassThrough;

String.prototype.replaceAll = function(search, replacement) {

    return this.replace(new RegExp(search, 'g'), replacement);
};

Buffer.prototype.toEscapedString = function () {

    return this.toString()
        .replaceAll('\n', '\\n')
        .replaceAll('"', '&quot;')
        .replaceAll('&', '&amp;')
        .replaceAll('\'', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
};

const MainStream = new PassThrough();

const Server = Http.createServer((req, res) => {

    if (req.method === 'GET') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, {'Content-Type':'text/event-stream', 'Cache-Control':'no-cache', 'Connection':'keep-alive'});


        MainStream.on('data', (data) => res.write('data: ' + data.toString() + '\n\n'));

        req.connection.addListener('close', () => {

            console.log('close');
        }, false);
    }
    else if (req.method === 'POST') {

        req.on('data', (data) => {

            data = data.toEscapedString();
            MainStream.write(JSON.stringify({ id: uuid.v4(), value: data }));
        });
        req.on('end', () => res.end());
    }
    else {
        return res.end();
    }

});
Server.setMaxListeners(Infinity);
Server.listen(8080);
