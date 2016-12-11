'use strict';
navigator.serviceWorker.register('worker.js')
    .then(() => fetch('/api/posts'))
    .then((r) => r.json())
    .then((r) => {

        r.forEach((item) => {

            const p = document.createElement('p');
            p.innerText = JSON.stringify(item);
            document.getElementById('main').appendChild(p);
        });
    });

