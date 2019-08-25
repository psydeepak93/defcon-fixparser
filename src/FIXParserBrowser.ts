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
import Message from './message/Message';
import { timestamp } from './util/util';

export default class FIXParserBrowser extends EventEmitter {
    public fixParserBase: FIXParserBase = new FIXParserBase();
    public host: string | null = null;
    public port: number | null = null;
    public protocol: string | null = null;
    public connectionString: string | null = null;
    public socket: WebSocket | null = null;
    public sender: string | null = null;
    public target: string | null = null;
    public messageSequence: number = 1;
    public heartBeatInterval: number | undefined;
    public heartBeatIntervalId: number | null = null;
    public fixVersion: string = 'FIX.5.0SP2';

    public stopHeartbeat() {
        clearInterval(this.heartBeatIntervalId!);
    }

    public startHeartbeat() {
        this.stopHeartbeat();
        this.heartBeatIntervalId = setInterval(() => {
            const heartBeat = this.createMessage(
                new Field(Fields.MsgType, 0),
                new Field(Fields.MsgSeqNum, this.getNextTargetMsgSeqNum()),
                new Field(Fields.SenderCompID, this.sender),
                new Field(Fields.SendingTime, this.getTimestamp()),
                new Field(Fields.TargetCompID, this.target),
            );
            this.send(heartBeat);
        }, this.heartBeatInterval);
    }

    public connect({
        host = 'localhost',
        port = 9878,
        protocol = 'websocket',
        sender = 'SENDER',
        target = 'TARGET',
        heartbeatIntervalMs = 60000,
        fixVersion = this.fixVersion,
    } = {}) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;
        this.connectionString =
            this.host.indexOf('ws://') === -1 &&
            this.host.indexOf('wss://') === -1
                ? `ws://${this.host}:${this.port}`
                : `${this.host}:${this.port}`;
        this.sender = sender;
        this.target = target;
        this.heartBeatInterval = heartbeatIntervalMs;
        this.fixVersion = fixVersion;
        this.socket = new WebSocket(this.connectionString);

        this.socket!.addEventListener('open', (event) => {
            console.log(
                `Connected: ${event}, readyState: ${this.socket!.readyState}`,
            );
            this.emit('open');
            this.startHeartbeat();
        });

        this.socket!.addEventListener('close', (event) => {
            console.log(
                `Connection closed: ${event}, readyState: ${
                    this.socket!.readyState
                }`,
            );
            this.emit('close');
            this.stopHeartbeat();
        });

        this.socket!.addEventListener('message', (event) => {
            const messages = this.fixParserBase.parse(event.data);
            let i = 0;
            for (i; i < messages.length; i++) {
                this.emit('message', messages[i]);
            }
        });
    }

    public close() {
        this.socket!.close();
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

    public parse(data: string) {
        return this.fixParserBase.parse(data);
    }

    public send(message: Message) {
        if (this.socket!.readyState === 1) {
            this.setNextTargetMsgSeqNum(this.getNextTargetMsgSeqNum() + 1);
            this.socket!.send(message.encode());
        } else {
            console.error(
                'FIXParser: could not send message, socket not open',
                message,
            );
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
