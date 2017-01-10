define('services/server', function () {

    let pendingRequests = {};
    let updateHandlers = {};
    let connection = new WebSocket("ws://localhost:8001/mercenaries");

    let openPromise = new Promise(resolve => connection.onopen = resolve);


    connection.onmessage = string => {
        let json = JSON.parse(string.data);
        if (json.request) {
            if (pendingRequests[json.request]) {
                pendingRequests[json.request](json.data);
                delete pendingRequests[json.request];
            } else {
                throw new Error('Received response to a request that wasn\'t sent');
            }
        }
        if (json.update) {
            if (updateHandlers[json.update]) {
                updateHandlers[json.update](json.data);
            } else {
                console.warn('Received update that does not have a handler');
            }
        }
    };

    connection.onclose = () => {
        window.location.reload();
    };

    const streams = {};

    return self = {
        request (name, params) {
            return openPromise.then(() => {
                return new Promise(resolve => {
                    if (!pendingRequests[name]) {
                        connection.send(JSON.stringify({
                            request: name,
                            params: params
                        }));
                        pendingRequests[name] = resolve;
                    }
                });
            });
        },

        getListStream (message) {
            if (!streams[message]) {
                streams[message] = {
                    raw: new Rx.ReplaySubject()
                };
                self.request(message).then(items =>
                {
                    items.forEach(item => streams[message].raw.onNext(item));
                });
                self.onUpdate(message, item => streams[message].raw.onNext(item));
                streams[message].output = streams[message].raw.scan((acc, item) => [item].concat(acc), []);
            }
            return streams[message].output;
        },

        onUpdate (name, handler) {
            if (updateHandlers[name]) {
                throw new Error('Adding handler to replace already existing handler');
            }
            updateHandlers[name] = handler;
        }
    };

});