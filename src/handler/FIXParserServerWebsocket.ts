/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import WebSocket from 'ws';

import { EventEmitter } from 'events';
import FIXParser from '../FIXParser';
import Message from '../message/Message';
import FIXParserServerBase from './FIXParserServerBase';

export default class FIXParserServerWebsocket extends FIXParserServerBase {
    public socket: WebSocket.Server | null = null;
    public host: string | null = null;
    public port: number | null = null;

    constructor(
        eventEmitter: EventEmitter,
        parser: FIXParser,
        host: string,
        port: number,
    ) {
        super(eventEmitter, parser, host, port);
    }

    public createServer() {
        this.socket = new WebSocket.Server({
            host: this.host!,
            port: this.port!,
        });

        this.socket!.on('connection', (ws) => {
            ws.on('message', (data) => {
                const messages = this.fixParser.parse(data.toString());
                let i = 0;
                for (i; i < messages.length; i++) {
                    this.processMessage(messages[i]);
                    this.eventEmitter!.emit('message', messages[i]);
                }
            });
        });
    }

    public send(message: Message) {
        this.socket!.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                this.fixParser.setNextTargetMsgSeqNum(
                    this.fixParser.getNextTargetMsgSeqNum() + 1,
                );
                client.send(message.encode());
            }
        });
    }
}
