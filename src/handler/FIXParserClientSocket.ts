/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { Socket } from 'net';

import Message from '../message/Message';
import FrameDecoder from '../util/FrameDecoder';
import FIXParserClientBase from './FIXParserClientBase';
import { EventEmitter } from 'events';
import FIXParser from '../FIXParser';

export default class FIXParserClientSocket extends FIXParserClientBase {
    private connected: boolean = false;

    constructor(eventEmitter: EventEmitter, parser: FIXParser) {
        super(eventEmitter, parser);
    }

    public connect() {
        this.socketTCP = new Socket();
        this.socketTCP!.setEncoding('ascii');
        this.socketTCP!.pipe(new FrameDecoder()).on('data', (data: any) => {
            const messages: Message[] = this.fixParser!.parse(data.toString());
            let i = 0;
            for (i; i < messages.length; i++) {
                this.processMessage(messages[i]);
                this.eventEmitter!.emit('message', messages[i]);
            }
        });

        this.socketTCP!.on('close', () => {
            this.connected = false;
            this.eventEmitter!.emit('close');
            this.stopHeartbeat();
        });

        this.socketTCP!.on('error', (error) => {
            this.connected = false;
            this.eventEmitter!.emit('error', error);
            this.stopHeartbeat();
        });

        this.socketTCP!.on('timeout', () => {
            this.connected = false;
            this.eventEmitter!.emit('timeout');
            this.socketTCP!.end();
            this.stopHeartbeat();
        });

        this.socketTCP!.connect(this.port!, this.host!, () => {
            this.connected = true;
            console.log('Connected');
            this.eventEmitter!.emit('open');
            this.startHeartbeat();
        });
    }

    public close() {
        if (this.socketTCP) {
            this.socketTCP!.destroy();
        } else {
            console.error(
                'FIXParserClientSocket: could not close socket, connection not open',
            );
        }
    }

    public send(message: Message) {
        if (this.connected) {
            this.fixParser!.setNextTargetMsgSeqNum(
                this.fixParser!.getNextTargetMsgSeqNum() + 1,
            );
            this.socketTCP!.write(message.encode());
        } else {
            console.error(
                'FIXParserClientSocket: could not send message, socket not open',
                message,
            );
        }
    }
}
