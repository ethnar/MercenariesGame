let ws = require('nodejs-websocket');

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
        }).listen(8001);
    }

    handleRequest (request, conn) {
        if (!this.handlers[request.request]) {
            console.error('Invalid request');
            return null;
        } else {
            return this.handlers[request.request](request.params, this.playerMap[conn], conn);
        }
    }

    registerHandler (topic, callback) {
        this.handlers[topic] = callback;
    }

    sendUpdate (topic, player, data) {
        this.connections.forEach(connection => {
            if (!player || this.playerMap[connection] === player) {
                connection.sendText(JSON.stringify({
                    update: topic,
                    data: data
                }));
            }
        });
    }

    setPlayer (conn, player) {
        console.log(player.name + ' authenticated');
        this.playerMap[conn] = player;
    }
}

module.exports = new Service;