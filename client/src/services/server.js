define('services/server', function () {

    let pendingRequests = {};
    let updateHandlers = {};
    let connection = new WebSocket("ws://localhost:8001/mercenaries");
    let playerId = null;

    let openPromise = new Promise(resolve => connection.onopen = resolve);

    connection.onmessage = string => {
        let json = JSON.parse(string.data);
        if (json.request) {
            if (json.data.message) {
                if (json.data.message === 'Unauthenticated') {
                    window.location = '?token=' + Math.random() + '#/login';
                }
                delete pendingRequests[json.key];
            } else {
                if (pendingRequests[json.key]) {
                    pendingRequests[json.key](json.data);
                    delete pendingRequests[json.key];
                } else {
                    throw new Error('Received response to a request that wasn\'t sent');
                }
            }
        }
        if (json.update) {
            if (updateHandlers[json.update]) {
                updateHandlers[json.update](json.data);
            } else {
                console.warn('Received update that does not have a handler: ' + json.update);
                console.warn(json.data);
            }
        }
    };

    connection.onclose = () => {
        window.location.reload();
    };

    const streams = {};
    const streamsGENERIC = {};

    return self = {
        request (name, params) {
            return openPromise.then(() => {
                return new Promise(resolve => {
                    const key = Math.random(); // TODO: improve
                    connection.send(JSON.stringify({
                        request: name,
                        params: params,
                        key: key,
                    }));
                    pendingRequests[key] = resolve;
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

        getStreamGENERIC (entityType, id) {
            return this
                .getListStreamGENERIC(entityType, {id: id})
                .map(array => (array || [])[0]);
        },

        getListStreamGENERIC (entityType, filter = {}) {
            const key = entityType + '__' + JSON.stringify(filter);
            if (!streamsGENERIC[key]) {
                streamsGENERIC[key] = {
                    data: [],
                    stream: new Rx.ReplaySubject()
                };
                self.request('subscribe', {
                    entity: entityType,
                    filter: filter,
                    key: key,
                }).then(items => {
                    streamsGENERIC[key].data = items;
                    streamsGENERIC[key].stream.onNext(items);
                });
                self.onUpdate(`update-${key}`, item => {
                    const items = streamsGENERIC[key].data;
                    const existing = items.findIndex(i => i.id === item.id);
                    if (~existing) {
                        items[existing] = item;
                    } else {
                        items.push(item);
                    }
                    streamsGENERIC[key].stream.onNext(items)
                });
                self.onUpdate(`remove-${key}`, item => {
                    const items = streamsGENERIC[key].data;
                    const existing = items.findIndex(i => i.id === item.id);
                    if (~existing) {
                        items.splice(existing, 1);
                    }
                    streamsGENERIC[key].stream.onNext(items)
                });
            }
            return streamsGENERIC[key].stream;
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
        },

        authUsingToken () {
            const token = localStorage.getItem('authToken');
            if (!token) {
                return Promise.reject();
            } else {
                return this.request('authenticate-token', {
                    token
                }).then(result => {
                    playerId = result.player;
                    return result;
                });
            }
        },

        authenticate (user, password) {
            return new Promise((resolve, reject) =>
                this.request('authenticate', {
                    user: user,
                    password: password
                }).then((result) => {
                    if (result) {
                        localStorage.setItem('authToken', result.token);
                        playerId = result.player;
                        resolve();
                    } else {
                        reject('Invalid user or password');
                    }
                }).catch(() => {
                    reject('Unable to authenticate');
                })
            );
        }
    };

});