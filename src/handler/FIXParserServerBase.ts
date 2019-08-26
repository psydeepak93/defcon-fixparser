/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { EventEmitter } from 'events';

import { Server } from 'net';
import WebSocket from 'ws';
import * as Fields from '../constants/ConstantsField';
import * as Messages from '../constants/ConstantsMessage';
import FIXParser from '../FIXParser';
import Message from '../message/Message';
import Timeout = NodeJS.Timeout;

export default class FIXParserServerBase extends EventEmitter {
    eventEmitter: EventEmitter | null = null;
    protected fixParser: FIXParser = new FIXParser();
    host: string | null = null;
    port: number | null = null;
    serverHandler: FIXParserServerBase | null = null;
    server: Server | null = null;
    socket: WebSocket | WebSocket.Server | null = null;
    sender: string | null = null;
    target: string | null = null;
    heartBeatInterval: number | undefined;
    heartBeatIntervalId: Timeout | null = null;

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
            const newSeqNo = (message.getField(Fields.NewSeqNo) || {}).value;
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
