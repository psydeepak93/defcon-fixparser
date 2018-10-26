/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2018 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import WebSocket from 'ws';

import FIXParser from './FIXParser';
import Message from './message/Message';
import Field from './../src/fields/Field';
import * as Messages from './../src/constants/ConstantsMessage';
import * as Fields from './../src/constants/ConstantsField';
import * as Side from './../src/constants/ConstantsSide';
import * as OrderTypes from './../src/constants/ConstantsOrderTypes';
import * as HandlInst from './../src/constants/ConstantsHandlInst';
import * as TimeInForce from './../src/constants/ConstantsTimeInForce';
import * as EncryptMethod from './../src/constants/ConstantsEncryptMethod';

export default class FIXWebSocketServer extends EventEmitter {

    constructor() {
        super();
        this.fixParser = new FIXParser();
        this.host = null;
        this.port = null;
        this.socket = null;
        this.sender = null;
        this.target = null;
        this.messageSequence = 1;
        this.heartBeatInterval = null;
        this.heartBeatIntervalId = null;
    }

    createServer(host = 'localhost', port = '9878') {
        this.host = host;
        this.port = port;
        this.socket = new WebSocket.Server({
            host: this.host,
            port: this.port
        });

        this.socket.on('connection', (ws) => {
            ws.on('message', (data) => {
                const messages = this.fixParser.parse(data.toString());
                let i = 0;
                for (i; i < messages.length; i++) {
                    this.emit('message', messages[i]);
                }
            });
        });

        console.log(`[${Date.now()}] FIXWebsocketServer started at ${this.host}:${this.port}`);
    }

    processMessage(message) {
        if(message.messageType === Messages.SequenceReset) {
            const newSeqNo = (this.getField(Fields.NewSeqNo) || {}).value;
            if(newSeqNo) {
                console.log(`[${Date.now()}] FIXWebsocketServer new sequence number ${newSeqNo}`);
                this.setNextTargetMsgSeqNum(newSeqNo);
            }
        }
        console.log(`[${Date.now()}] FIXWebsocketServer received message ${message.description}`);
    }

    getNextTargetMsgSeqNum() {
        return this.messageSequence;
    }

    setNextTargetMsgSeqNum(nextMsgSeqNum) {
        this.messageSequence = parseInt(nextMsgSeqNum, 10);
        return this.messageSequence;
    }

    send(message) {
        this.socket.broadcast = () => {
            this.socket.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    if (message instanceof Message) {
                        this.setNextTargetMsgSeqNum(this.getNextTargetMsgSeqNum() + 1);
                        this.socket.send(message.encode());
                    } else {
                        console.error('FIXParser: could not send message, message of wrong type');
                    }
                }
            });
        };
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
