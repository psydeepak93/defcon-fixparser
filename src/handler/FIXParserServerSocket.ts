/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { createServer } from 'net';

import Message from '../message/Message';
import FrameDecoder from '../util/FrameDecoder';
import FIXParserServerBase from './FIXParserServerBase';

export default class FIXParserServerSocket extends FIXParserServerBase {
    public createServer() {
        this.server = createServer((socket) => {
            this.socket = socket;
            this.socket!.pipe(new FrameDecoder()).on('data', (data: any) => {
                const message = this.fixParser.parse(data.toString())[0];
                this.processMessage(message);
                this.eventEmitter!.emit('message', message);
            });

            this.socket!.on('open', () => {
                this.eventEmitter!.emit('open');
            });

            this.socket!.on('close', () => {
                this.eventEmitter!.emit('close');
            });
        });

        this.server.listen(this.port, this.host);
    }

    public send(message: Message) {
        if (this.socket!.readyState === 'open') {
            this.fixParser.setNextTargetMsgSeqNum(
                this.fixParser.getNextTargetMsgSeqNum() + 1,
            );
            this.socket!.write(message.encode());
        } else {
            console.error(
                `[${Date.now()}] FIXParserServerSocket: could not send message, socket not open`,
            );
        }
    }
}
