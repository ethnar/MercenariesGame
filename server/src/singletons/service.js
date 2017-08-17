const ws = require('nodejs-websocket');
const errorResponse = require('../functions/error-response');

class Service {
    constructor () {
        this.connections = [];
        this.handlers = {};
        this.playerMap = new Map();
    }

    init () {
        ws.createServer((conn) => {
            console.log('New connection');
            this.connections.push(conn);

            conn.on('text', (str) => {
                let json = JSON.parse(str); // TODO: failsafe

                let response = {
                    request: json.request,
                    data: this.handleRequest(json, conn)
                };

                conn.sendText(JSON.stringify(response));
            });

            conn.on('close', (code, reason) => {
                let idx = this.connections.indexOf(conn);
                this.connections.splice(idx, 1);
                delete this.playerMap[conn];
                console.log('Connection closed');
            });

            conn.on('error', () => {});
        }).listen(8001);
    }

    handleRequest (request, conn) {
        if (!this.handlers[request.request]) {
            console.error('Invalid request: ' + request.request);
            return null;
        } else {
            const handler = this.handlers[request.request];
            if (!this.playerMap[conn] && !handler.unauthenticated) {
                return errorResponse('Unauthenticated');
            }
            return handler.callback(request.params, this.playerMap[conn], conn);
        }
    }

    registerHandler (topic, callback, unauthenticated = false) {
        this.handlers[topic] = {
            callback,
            unauthenticated
        };
    }

    sendUpdate (topic, players, data) { // TODO: deprecated?
        this.sendUpdateCB(topic, players, () => data);
    }

    sendUpdateCB (topic, players, callback) {
        if (!Array.isArray(players)) {
            if (!players) {
                const world = require('./world');
                players = world.getEntitiesArray('Player');
            } else {
                players = [players];
            }
        }
        players.forEach(player => {
            const data = callback(player);
            if (data) {
                this.connections.forEach(connection => {
                    if (!player || this.playerMap[connection] === player) {
                        connection.sendText(JSON.stringify({
                            update: topic,
                            data: data
                        }));
                    }
                });
            }
        });
    }

    sendDeletion (topic, players, id) {
        this.sendUpdate(topic, players, { delete: true, id: id });
    }

    setPlayer (conn, player) {
        console.log(player.name + ' authenticated');
        this.playerMap[conn] = player;
    }
}

module.exports = new Service;