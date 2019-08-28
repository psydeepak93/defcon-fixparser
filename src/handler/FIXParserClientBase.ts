/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import { Socket } from 'net';
import * as Fields from '../constants/ConstantsField';
import * as Messages from '../constants/ConstantsMessage';
import Field from '../fields/Field';
import FIXParser from '../FIXParser';
import Message from '../message/Message';
import Timeout = NodeJS.Timeout;
import WebSocket from 'ws';

export default class FIXParserClientBase extends EventEmitter {
    protected eventEmitter: EventEmitter | null;
    protected fixParser: FIXParser | null;
    host: string | null = null;
    port: number | null = null;
    client = null;
    protected socketTCP: Socket | null = null;
    protected socketWS: WebSocket | null = null;
    sender: string | null = null;
    target: string | null = null;
    heartBeatInterval: number | undefined;
    heartBeatIntervalId: Timeout | null = null;
    fixVersion: string = 'FIX.5.0SP2';

    constructor(eventEmitter: EventEmitter, parser: FIXParser) {
        super();
        this.eventEmitter = eventEmitter;
        this.fixParser = parser;
    }

    public stopHeartbeat() {
        clearInterval(this.heartBeatIntervalId!);
    }

    public startHeartbeat() {
        this.stopHeartbeat();
        this.heartBeatIntervalId = setInterval(() => {
            const heartBeat = this.fixParser!.createMessage(
                new Field(8, this.fixVersion),
                new Field(Fields.MsgType, 0),
                new Field(
                    Fields.MsgSeqNum,
                    this.fixParser!.getNextTargetMsgSeqNum(),
                ),
                new Field(Fields.SenderCompID, this.sender),
                new Field(Fields.SendingTime, this.fixParser!.getTimestamp()),
                new Field(Fields.TargetCompID, this.target),
            );
            this.send(heartBeat);
        }, this.heartBeatInterval!);
    }

    public processMessage(message: Message) {
        if (message.messageType === Messages.SequenceReset) {
            const newSeqNo = message.getField(Fields.NewSeqNo)!.value;
            if (newSeqNo) {
                console.log(
                    `[${Date.now()}] FIXClient new sequence number ${newSeqNo}`,
                );
                this.fixParser!.setNextTargetMsgSeqNum(newSeqNo);
            }
        }
        console.log(
            `[${Date.now()}] FIXClient received message ${message.description}`,
        );
    }

    public send(message: Message) {
        console.log(`[${Date.now()}] Base class ignored send()`);
    }

    public connect() {
        console.log(`[${Date.now()}] Base class ignored connect()`);
    }
}
