/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import { Server } from 'net';
import * as EncryptMethod from './constants/ConstantsEncryptMethod';
import * as Fields from './constants/ConstantsField';
import * as HandlInst from './constants/ConstantsHandlInst';
import * as Messages from './constants/ConstantsMessage';
import * as OrderTypes from './constants/ConstantsOrderTypes';
import * as Side from './constants/ConstantsSide';
import * as TimeInForce from './constants/ConstantsTimeInForce';
import Field from './fields/Field';
import FIXParser from './FIXParser';
import FIXParserServerBase from './handler/FIXParserServerBase';
import FIXParserServerSocket from './handler/FIXParserServerSocket';
import FIXParserServerWebsocket from './handler/FIXParserServerWebsocket';
import Message from './message/Message';

const PROTOCOL_TCP = 'tcp';
const PROTOCOL_WEBSOCKET = 'websocket';

export default class FIXServer extends EventEmitter {
    public fixParser: FIXParser = new FIXParser();
    public host: string | null = null;
    public port: number | null = null;
    public protocol: string | null = null;
    public serverHandler:
        | FIXParserServerSocket
        | FIXParserServerWebsocket
        | null = null;
    public server: Server | null = null;
    public socket: WebSocket | null = null;
    public sender: string | null = null;
    public target: string | null = null;
    public heartBeatInterval: number | undefined;
    public heartBeatIntervalId: any | null = null;
    public fixVersion: string = 'FIX.5.0SP2';

    public createServer(
        host = 'localhost',
        port = 9878,
        protocol = PROTOCOL_TCP,
    ) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;

        if (this.protocol === PROTOCOL_TCP) {
            this.serverHandler = new FIXParserServerSocket(
                this,
                this.fixParser,
                this.host,
                this.port,
            );
        } else if (this.protocol === PROTOCOL_WEBSOCKET) {
            this.serverHandler = new FIXParserServerWebsocket(
                this,
                this.fixParser,
                this.host,
                this.port,
            );
        } else {
            console.error(
                `[${Date.now()}] FIXServer: create server, invalid protocol`,
            );
        }
        console.log(
            `[${Date.now()}] FIXServer started at ${this.host}:${this.port}`,
        );
    }

    public getNextTargetMsgSeqNum() {
        return this.fixParser.getNextTargetMsgSeqNum();
    }

    public setNextTargetMsgSeqNum(nextMsgSeqNum: number) {
        return this.fixParser.setNextTargetMsgSeqNum(nextMsgSeqNum);
    }

    public getTimestamp(dateObject = new Date()) {
        return this.fixParser.getTimestamp(dateObject);
    }

    public createMessage(...fields: Field[]) {
        return this.fixParser.createMessage(...fields);
    }

    public parse(data: string) {
        return this.fixParser.parse(data);
    }

    public send(message: Message) {
        this.serverHandler!.send(message);
    }
}

export { Field };
export { Fields };
export { Message };
export { Messages };
export { Side };
export { OrderTypes };
export { HandlInst };
export { TimeInForce };
export { EncryptMethod };
