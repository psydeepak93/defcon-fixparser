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

export default class FIXParserClientSocket extends FIXParserClientBase {
    public connect() {
        this.socket = new Socket();
        this.socket!.setEncoding('ascii');
        this.socket!.pipe(new FrameDecoder()).on('data', (data: any) => {
            const messages: Message[] = this.fixParser.parse(data.toString());
            let i = 0;
            for (i; i < messages.length; i++) {
                this.processMessage(messages[i]);
                this.eventEmitter.emit('message', messages[i]);
            }
        });

        this.socket!.on('close', () => {
            this.eventEmitter.emit('close');
            this.stopHeartbeat();
        });

        this.socket!.on('error', (error) => {
            this.eventEmitter.emit('error', error);
            this.stopHeartbeat();
        });

        this.socket!.on('timeout', () => {
            this.eventEmitter.emit('timeout');
            this.socket!.end();
            this.stopHeartbeat();
        });

        this.socket!.connect(this.port!, this.host!, () => {
            console.log('Connected', this.socket!.readyState);
            if (this.socket!.readyState === 'open') {
                this.eventEmitter.emit('open');
                this.startHeartbeat();
            }
        });
    }

    public close() {
        if (this.socket && this.socket!.readyState === 'open') {
            this.socket!.close();
        } else {
            console.error(
                'FIXParserClientSocket: could not close socket, connection not open',
            );
        }
    }

    public send(message: Message) {
        if (this.socket!.readyState === 'open') {
            this.fixParser.setNextTargetMsgSeqNum(
                this.fixParser.getNextTargetMsgSeqNum() + 1,
            );
            this.socket!.write(message.encode());
        } else {
            console.error(
                'FIXParserClientSocket: could not send message, socket not open',
                message,
            );
        }
    }
}
