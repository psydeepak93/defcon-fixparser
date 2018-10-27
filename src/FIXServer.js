/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2018 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import FIXParser from './FIXParser';
import FIXParserServerSocket from './handler/FIXParserServerSocket';
import FIXParserServerWebsocket from './handler/FIXParserServerWebsocket';
import Message from './message/Message';
import Field from './../src/fields/Field';
import * as Messages from './../src/constants/ConstantsMessage';
import * as Fields from './../src/constants/ConstantsField';
import * as Side from './../src/constants/ConstantsSide';
import * as OrderTypes from './../src/constants/ConstantsOrderTypes';
import * as HandlInst from './../src/constants/ConstantsHandlInst';
import * as TimeInForce from './../src/constants/ConstantsTimeInForce';
import * as EncryptMethod from './../src/constants/ConstantsEncryptMethod';

const PROTOCOL_TCP = 'tcp';
const PROTOCOL_WEBSOCKET = 'websocket';

export default class FIXServer extends EventEmitter {

    constructor() {
        super();
        this.fixParser = new FIXParser();
        this.host = null;
        this.port = null;
        this.serverHandler = null;
        this.server = null;
        this.socket = null;
        this.sender = null;
        this.target = null;
        this.messageSequence = 1;
        this.heartBeatInterval = null;
        this.heartBeatIntervalId = null;
    }

    createServer(host = 'localhost', port = '9878', protocol = PROTOCOL_TCP) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;

        if(this.protocol === PROTOCOL_TCP) {
            this.serverHandler = new FIXParserServerSocket(this, this.fixParser, this.host, this.port);
        } else if(this.protocol === PROTOCOL_WEBSOCKET) {
            this.serverHandler = new FIXParserServerWebsocket(this, this.fixParser, this.host, this.port);
        } else {
            console.error(`[${Date.now()}] FIXServer: create server, invalid protocol`);
        }
        console.log(`[${Date.now()}] FIXServer started at ${this.host}:${this.port}`);
    }

    send(message) {
        this.serverHandler.send(message);
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
