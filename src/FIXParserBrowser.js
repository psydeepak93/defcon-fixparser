/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2018 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import { timestamp } from './util/util';
import FIXParserBase from './FIXParserBase';
import Message from './message/Message';
import Field from './../src/fields/Field';
import * as Messages from './../src/constants/ConstantsMessage';
import * as Fields from './../src/constants/ConstantsField';
import * as Side from './../src/constants/ConstantsSide';
import * as OrderTypes from './../src/constants/ConstantsOrderTypes';
import * as HandlInst from './../src/constants/ConstantsHandlInst';
import * as TimeInForce from './../src/constants/ConstantsTimeInForce';
import * as EncryptMethod from './../src/constants/ConstantsEncryptMethod';

export default class FIXParserBrowser extends EventEmitter {

    constructor() {
        super();
        this.fixParserBase = new FIXParserBase();
        this.host = null;
        this.port = null;
        this.socket = null;
        this.sender = null;
        this.target = null;
        this.messageSequence = 1;
        this.heartBeatInterval = null;
        this.heartBeatIntervalId = null;
        this.fixVersion = 'FIX.5.0SP2';
    }

    stopHeartbeat() {
        clearInterval(this.heartBeatIntervalId);
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartBeatIntervalId = setInterval(() => {
            const heartBeat = this.createMessage(
                new Field(Fields.MsgType, 0),
                new Field(Fields.MsgSeqNum, this.getNextTargetMsgSeqNum()),
                new Field(Fields.SenderCompID, this.sender),
                new Field(Fields.SendingTime, this.getTimestamp()),
                new Field(Fields.TargetCompID, this.target)
            );
            this.send(heartBeat);

        }, this.heartBeatInterval);
    }

    connect({ host = 'localhost', port = '9878', protocol = 'websocket', sender = 'SENDER', target = 'TARGET', heartbeatIntervalMs = 60000, fixVersion = this.fixVersion } = {}) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;
        this.sender = sender;
        this.target = target;
        this.heartBeatInterval = heartbeatIntervalMs;
        this.fixVersion = fixVersion;

        this.socket = new WebSocket(`ws://${this.host}:${this.port}`);

        this.socket.addEventListener('open', (event) => {
            console.log(`Connected: ${event}, readyState: ${this.socket.readyState}`);
            this.emit('open');
            this.startHeartbeat();
        });

        this.socket.addEventListener('close', (event) => {
            console.log(`Connection closed: ${event}, readyState: ${this.socket.readyState}`);
            this.emit('close');
            this.stopHeartbeat();
        });

        this.socket.addEventListener('message', (data) => {
            const messages = this.fixParserBase.parse(data.toString());
            let i = 0;
            for (i; i < messages.length; i++) {
                this.emit('message', messages[i]);
            }
        });
    }

    getNextTargetMsgSeqNum() {
        return this.messageSequence;
    }

    setNextTargetMsgSeqNum(nextMsgSeqNum) {
        this.messageSequence = nextMsgSeqNum;
        return this.messageSequence;
    }

    getTimestamp(dateObject = new Date()) {
        return timestamp(dateObject);
    }

    createMessage(...fields) {
        return new Message(...fields);
    }

    parse(data) {
        return this.fixParserBase.parse(data);
    }

    send(message) {
        if (this.socket.readyState === 1) {
            if (message instanceof Message) {
                this.setNextTargetMsgSeqNum(this.getNextTargetMsgSeqNum() + 1);
                this.socket.send(message.encode());
            } else {
                console.error('FIXParser: could not send message, message of wrong type');
            }
        } else {
            console.error('FIXParser: could not send message, socket not open', message);
        }
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

/**
 * Export global to the window object.
 */
global.FIXParser = FIXParserBrowser;
