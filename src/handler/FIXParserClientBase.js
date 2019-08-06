/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import * as Messages from '../constants/ConstantsMessage';
import * as Fields from '../constants/ConstantsField';
import Field from './../fields/Field';

export default class FIXParserClientBase extends EventEmitter {
    constructor(eventEmitter, parser) {
        super();
        this.eventEmitter = eventEmitter;
        this.fixParser = parser;
        this.host = null;
        this.port = null;
        this.client = null;
        this.socket = null;
        this.sender = null;
        this.target = null;
        this.heartBeatInterval = null;
        this.heartBeatIntervalId = null;
    }

    stopHeartbeat() {
        clearInterval(this.heartBeatIntervalId);
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartBeatIntervalId = setInterval(() => {
            const heartBeat = this.fixParser.createMessage(
                new Field(8, this.fixVersion),
                new Field(Fields.MsgType, 0),
                new Field(
                    Fields.MsgSeqNum,
                    this.fixParser.getNextTargetMsgSeqNum()
                ),
                new Field(Fields.SenderCompID, this.sender),
                new Field(Fields.SendingTime, this.fixParser.getTimestamp()),
                new Field(Fields.TargetCompID, this.target)
            );
            this.send(heartBeat);
        }, this.heartBeatInterval);
    }

    processMessage(message) {
        if (message.messageType === Messages.SequenceReset) {
            const newSeqNo = (this.fixParser.getField(Fields.NewSeqNo) || {})
                .value;
            if (newSeqNo) {
                console.log(
                    `[${Date.now()}] FIXClient new sequence number ${newSeqNo}`
                );
                this.fixParser.setNextTargetMsgSeqNum(newSeqNo);
            }
        }
        console.log(
            `[${Date.now()}] FIXClient received message ${message.description}`
        );
    }
}
