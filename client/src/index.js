var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
});

window.server.request('authenticate', {
    user: 'ethnar',
    password: 'abc'
});
