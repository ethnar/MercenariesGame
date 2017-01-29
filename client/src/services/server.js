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

        getStream (message) {
            if (!streams[message]) {
                streams[message] = new Rx.ReplaySubject(1);
                self.request(message).then(result => {
                    streams[message].onNext(result);
                });
                self.onUpdate(message, update => {
                    streams[message].onNext(update)
                });
            }
            return streams[message];
        },

        getListStream (message) {
            if (!streams[message]) {
                streams[message] = {
                    data: [],
                    stream: new Rx.ReplaySubject()
                };
                self.request(message).then(items => {
                    streams[message].data = items;
                    streams[message].stream.onNext(items);
                });
                self.onUpdate(message, item => {
                    const items = streams[message].data;
                    if (item.id)
                    {
                        const existing = items.findIndex(i => i.id === item.id);
                        if (item.delete) {
                            if (~existing) {
                                items.splice(existing, 1);
                            }
                        } else {
                            if (~existing) {
                                items[existing] = item;
                            } else {
                                items.push(item);
                            }
                        }
                    } else {
                        items.push(item);
                    }
                    streams[message].stream.onNext(items)
                });
            }
            return streams[message].stream;
        },

        onUpdate (name, handler) {
            if (updateHandlers[name]) {
                throw new Error('Adding handler to replace already existing handler');
            }
            updateHandlers[name] = handler;
        }
    };

});