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
import FIXParserClientSocket from './handler/FIXParserClientSocket';
import FIXParserClientWebsocket from './handler/FIXParserClientWebsocket';
import Field from './../src/fields/Field';
import Message from './message/Message';
import * as Messages from './../src/constants/ConstantsMessage';
import * as Fields from './../src/constants/ConstantsField';
import * as Side from './../src/constants/ConstantsSide';
import * as OrderTypes from './../src/constants/ConstantsOrderTypes';
import * as HandlInst from './../src/constants/ConstantsHandlInst';
import * as TimeInForce from './../src/constants/ConstantsTimeInForce';
import * as EncryptMethod from './../src/constants/ConstantsEncryptMethod';

const PROTOCOL_TCP = 'tcp';
const PROTOCOL_WEBSOCKET = 'websocket';

export default class FIXParser extends EventEmitter {

    constructor() {
        super();
        this.fixParserBase = new FIXParserBase();
        this.clientHandler = null;
        this.host = null;
        this.port = null;
        this.sender = null;
        this.target = null;
        this.messageSequence = 1;
        this.heartBeatInterval = null;
        this.heartBeatIntervalId = null;
        this.fixVersion = 'FIX.5.0SP2';
    }

    connect({ host = 'localhost', port = '9878', protocol = PROTOCOL_TCP, sender = 'SENDER', target = 'TARGET', heartbeatIntervalMs = 30000, fixVersion = this.fixVersion } = {}) {
        switch(protocol) {
            case PROTOCOL_TCP:
                this.clientHandler = new FIXParserClientSocket(this, this);
                break;
            case PROTOCOL_WEBSOCKET:
                this.clientHandler = new FIXParserClientWebsocket(this, this);
                break;
            default:
                console.error('FIXParser: could not connect, no protocol specified');
        }
        this.clientHandler.host = host;
        this.clientHandler.port = port;
        this.clientHandler.sender = sender;
        this.clientHandler.target = target;
        this.clientHandler.heartBeatInterval = heartbeatIntervalMs;
        this.clientHandler.fixVersion = fixVersion;
        this.clientHandler.connect();
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
        return new Message(this.fixVersion, ...fields);
    }

    parse(data) {
        return this.fixParserBase.parse(data);
    }

    send(message) {
        this.clientHandler.send(message);
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
global.FIXParser = FIXParser;
