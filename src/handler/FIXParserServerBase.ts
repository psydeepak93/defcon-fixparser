/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import { Server, Socket } from 'net';
import WebSocket from 'ws';
import * as Fields from '../constants/ConstantsField';
import * as Messages from '../constants/ConstantsMessage';
import FIXParser from '../FIXParser';
import Message from '../message/Message';

export default class FIXParserServerBase extends EventEmitter {
    public eventEmitter: EventEmitter | null = null;
    public host: string | null = null;
    public port: number | null = null;
    public serverHandler: FIXParserServerBase | null = null;
    public server: Server | null = null;
    public socketWS: WebSocket | null = null;
    public socketNet: Socket | null = null;
    public sender: string | null = null;
    public target: string | null = null;
    public heartBeatInterval: number | undefined;
    public heartBeatIntervalId: any | null = null;
    protected fixParser: FIXParser = new FIXParser();

    constructor(
        eventEmitter: EventEmitter,
        parser: FIXParser,
        host: string,
        port: number,
    ) {
        super();
        this.eventEmitter = eventEmitter;
        this.fixParser = parser;
        this.host = host;
        this.port = port;
        this.createServer();
    }

    public processMessage(message: Message) {
        if (message.messageType === Messages.SequenceReset) {
            const newSeqNo = message.getField(Fields.NewSeqNo)!.value;
            if (newSeqNo) {
                console.log(
                    `[${Date.now()}] FIXServer new sequence number ${newSeqNo}`,
                );
                this.fixParser.setNextTargetMsgSeqNum(newSeqNo);
            }
        }
        console.log(
            `[${Date.now()}] FIXServer received message ${message.description}`,
        );
    }

    public createServer() {
        console.log(`[${Date.now()}] createServer() ignored in base class.`);
    }

    public send(message: Message) {
        console.log(`[${Date.now()}] send() ignored in base class.`);
    }
}
