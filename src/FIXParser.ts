/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import * as EncryptMethod from './constants/ConstantsEncryptMethod';
import * as Fields from './constants/ConstantsField';
import * as HandlInst from './constants/ConstantsHandlInst';
import * as Messages from './constants/ConstantsMessage';
import * as OrderTypes from './constants/ConstantsOrderTypes';
import * as Side from './constants/ConstantsSide';
import * as TimeInForce from './constants/ConstantsTimeInForce';
import Field from './fields/Field';
import FIXParserBase from './FIXParserBase';
import FIXParserClientBase from './handler/FIXParserClientBase';
import FIXParserClientSocket from './handler/FIXParserClientSocket';
import FIXParserClientWebsocket from './handler/FIXParserClientWebsocket';
import Message from './message/Message';
import { timestamp } from './util/util';
import Timeout = NodeJS.Timeout;

type Protocol = 'tcp' | 'websocket';

export default class FIXParser extends EventEmitter {
    public fixParserBase: FIXParserBase = new FIXParserBase();
    public clientHandler:
        | FIXParserClientSocket
        | FIXParserClientWebsocket
        | null = null;
    public host: string | null = null;
    public port: number | null = null;
    public sender: string | null = null;
    public target: string | null = null;
    public messageSequence: number = 1;
    public heartBeatInterval: number | undefined;
    public heartBeatIntervalId: Timeout | null = null;
    public fixVersion: string = 'FIX.5.0SP2';

    public connect({
        string: host = 'localhost',
        number: port = 9878,
        Protocol: protocol = 'tcp',
        string: sender = 'SENDER',
        string: target = 'TARGET',
        number: heartbeatIntervalMs = 30000,
        string: fixVersion = this.fixVersion,
    } = {}) {
        if (protocol === 'tcp') {
            this.clientHandler = new FIXParserClientSocket(this, this);
        } else if (protocol === 'websocket') {
            this.clientHandler = new FIXParserClientWebsocket(this, this);
        }
        this.clientHandler!.host = host;
        this.clientHandler!.port = port;
        this.clientHandler!.sender = sender;
        this.clientHandler!.target = target;
        this.clientHandler!.heartBeatInterval = heartbeatIntervalMs;
        this.clientHandler!.fixVersion = fixVersion;
        this.clientHandler!.connect();
    }

    public getNextTargetMsgSeqNum() {
        return this.messageSequence;
    }

    public setNextTargetMsgSeqNum(nextMsgSeqNum: number) {
        this.messageSequence = nextMsgSeqNum;
        return this.messageSequence;
    }

    public getTimestamp(dateObject = new Date()) {
        return timestamp(dateObject);
    }

    public createMessage(...fields: Field[]) {
        return new Message(this.fixVersion, ...fields);
    }

    public parse(data: string): Message[] {
        return this.fixParserBase.parse(data);
    }

    public send(message: Message) {
        this.clientHandler!.send(message);
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
(global as any).FIXParser = FIXParser;
