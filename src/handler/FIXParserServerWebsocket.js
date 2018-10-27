/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2018 Victor Norgren
 * Released under the MIT license
 */
import WebSocket from 'ws';

import FIXParserServerBase from './FIXParserServerBase';
import Message from './../message/Message';

export default class FIXParserServerWebsocket extends FIXParserServerBase {

    createServer() {
        this.socket = new WebSocket.Server({
            host: this.host,
            port: this.port
        });

        this.socket.on('connection', (ws) => {
            ws.on('message', (data) => {
                const messages = this.fixParser.parse(data.toString());
                let i = 0;
                for (i; i < messages.length; i++) {
                    this.processMessage(messages[i]);
                    this.eventEmitter.emit('message', messages[i]);
                }
            });
        });
    }

    send(message) {
        this.socket.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (message instanceof Message) {
                    this.fixParser.setNextTargetMsgSeqNum(this.fixParser.getNextTargetMsgSeqNum() + 1);
                    client.send(message.encode());
                } else {
                    console.error('FIXParserServerWebsocket: could not send message, message of wrong type');
                }
            }
        });
    }
}
