/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { createServer, Socket } from 'net';

import Message from '../message/Message';
import FrameDecoder from '../util/FrameDecoder';
import FIXParserServerBase from './FIXParserServerBase';

export default class FIXParserServerSocket extends FIXParserServerBase {
    private connected: boolean = false;
    public createServer() {
        this.server = createServer((socket: Socket) => {
            this.socketNet = socket;
            this.socketNet!.pipe(new FrameDecoder()).on('data', (data: any) => {
                const message = this.fixParser.parse(data.toString())[0];
                this.processMessage(message);
                this.eventEmitter!.emit('message', message);
            });

            this.socketNet!.on('open', () => {
                this.connected = true;
                this.eventEmitter!.emit('open');
            });

            this.socketNet!.on('close', () => {
                this.connected = false;
                this.eventEmitter!.emit('close');
            });
        });

        this.server.listen(this.port!, this.host!, () => {
            console.log(
                `[${Date.now()}] FIXParserServerSocket: listening for connections...`,
            );
        });
    }

    public send(message: Message) {
        if (this.connected) {
            this.fixParser.setNextTargetMsgSeqNum(
                this.fixParser.getNextTargetMsgSeqNum() + 1,
            );
            this.socketNet!.write(message.encode());
        } else {
            console.error(
                `[${Date.now()}] FIXParserServerSocket: could not send message, socket not open`,
            );
        }
    }
}
