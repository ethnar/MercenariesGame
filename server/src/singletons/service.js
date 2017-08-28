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
                    data: this.handleRequest(json, conn),
                    key: json.key,
                };

                conn.sendText(JSON.stringify(response));
            });

            conn.on('close', (code, reason) => {
                let idx = this.connections.indexOf(conn);
                this.connections.splice(idx, 1);
                this.playerMap.delete(conn);
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
            if (!this.playerMap.get(conn) && !handler.unauthenticated) {
                return errorResponse('Unauthenticated');
            }
            return handler.callback(request.params, this.playerMap.get(conn), conn);
        }
    }

    registerHandler (topic, callback, unauthenticated = false) {
        this.handlers[topic] = {
            callback,
            unauthenticated
        };
    }

    getPlayer(connection) {
        return this.playerMap.get(connection);
    }

    sendUpdate (topic, connection, data) {
        connection.sendText(JSON.stringify({
            update: topic,
            data: data
        }));
    }

    sendUpdateToAll (topic, data) {
        this.connections.forEach(connection => {
            this.sendUpdate(topic, connection, data);
        });
    }

    setPlayer (conn, player) {
        console.log(player.name + ' authenticated');
        this.playerMap.set(conn, player);
    }
}

module.exports = new Service;