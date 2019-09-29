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
import FIXParserClientBase from './FIXParserClientBase';

export default class FIXParserClientWebsocket extends FIXParserClientBase {
    constructor(eventEmitter: EventEmitter, parser: FIXParser) {
        super(eventEmitter, parser);
    }

    public connect() {
        const connectionString =
            this.host!.indexOf('ws://') === -1 &&
            this.host!.indexOf('wss://') === -1
                ? `ws://${this.host}:${this.port}`
                : `${this.host}:${this.port}`;

        this.socketWS = new WebSocket(connectionString);

        this.socketWS!.on('open', () => {
            console.log('Connected');
            this.eventEmitter!.emit('open');
            this.startHeartbeat();
        });

        this.socketWS!.on('message', (data) => {
            const messages = this.fixParser!.parse(data.toString());
            let i = 0;
            for (i; i < messages.length; i++) {
                this.processMessage(messages[i]);
                this.eventEmitter!.emit('message', messages[i]);
            }
        });

        this.socketWS!.on('close', () => {
            this.eventEmitter!.emit('close');
            this.stopHeartbeat();
        });
    }

    public close() {
        this.socketWS!.close();
    }

    public send(message: Message) {
        if (this.socketWS!.readyState === WebSocket.OPEN) {
            this.fixParser!.setNextTargetMsgSeqNum(
                this.fixParser!.getNextTargetMsgSeqNum() + 1,
            );
            this.socketWS!.send(message.encode());
        } else {
            console.error(
                'FIXParser: could not send message, socket not open',
                message,
            );
        }
    }
}
