'use strict';
const SERVER = 'http://localhost:8080/';

function send(node) {

    const txt = node.value;
    node.value = '';

    const r = new XMLHttpRequest();
    r.open('POST', SERVER, true);
    r.send(txt);
}


const eventsource = new EventSource(SERVER);
eventsource.addEventListener('message', (e) => {

    const p = document.createElement('p');
    const data = JSON.parse(e.data);
    const date = new Date();
    data.date = date;
    p.innerText = (new Date()) + ' : ' + data.id  ;
    document.getElementById('chat').insertBefore(p, document.getElementById('chat').firstChild);
});

