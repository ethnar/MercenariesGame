
const pendingRequests = {};
const updateHandlers = {};
const connection = new WebSocket("ws://localhost:8001/mercenaries");
const openPromise = new Promise(resolve => connection.onopen = resolve);

let playerId = null;

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

export const ServerService = {
    getPlayerId() {
        return playerId;
    },

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

    getStream (entityType, id) {
        if (!id) {
            throw new Error(`Get stream of ${entityType}, but no ID provided: ${id}`);
        }
        return this
            .getListStream(entityType, {id: id})
            .map(array => (array || [])[0]);
    },

    getListStream (entityType, filter = {}) {
        const key = entityType + '__' + JSON.stringify(filter);
        if (!streams[key]) {
            streams[key] = {
                data: [],
                stream: new Rx.ReplaySubject()
            };
            ServerService.request('subscribe', {
                entity: entityType,
                filter: filter,
                key: key,
            }).then(items => {
                streams[key].data = items;
                streams[key].stream.next(items);
            });
            ServerService.onUpdate(`update-${key}`, item => {
                const items = streams[key].data;
                const existing = items.findIndex(i => i.id === item.id);
                if (~existing) {
                    items[existing] = item;
                } else {
                    items.push(item);
                }
                streams[key].stream.next(items)
            });
            ServerService.onUpdate(`remove-${key}`, itemId => {
                const items = streams[key].data;
                const existing = items.findIndex(i => i.id === itemId);
                if (~existing) {
                    items.splice(existing, 1);
                }
                streams[key].stream.next(items)
            });
        }
        return streams[key].stream;
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
