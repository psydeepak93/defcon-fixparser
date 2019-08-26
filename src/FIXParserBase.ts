/*
 * fixparser
 * https://gitlab.com/logotype/fixparser.git
 *
 * Copyright 2019 Victor Norgren
 * Released under the MIT license
 */
import { Enums as EnumsCache } from './enums/Enums';
import Field from './fields/Field';
import { Fields as FieldsCache } from './fields/Fields';
import Message from './message/Message';
import { RE_ESCAPE, RE_FIND, SOH, STRING_EQUALS } from './util/util';

export default class FIXParserBase {
    public static version = {
        version: process.env.__PACKAGE_VERSION__,
        build: process.env.__BUILD_TIME__,
    };

    message: Message | null = null;
    messageTags: string[] = [];
    messageString: string = '';
    reBeginString: RegExp = new RegExp(/(?=8=FIX)/g);
    fields: FieldsCache = new FieldsCache();
    enums: EnumsCache = new EnumsCache();

    public processMessage() {
        const matches: RegExpExecArray | null = RE_FIND.exec(
            this.messageString,
        );
        if (matches && matches.length === 2) {
            const stringData: string = this.messageString.replace(
                new RegExp(matches[1].replace(RE_ESCAPE, '\\$&'), 'g'),
                SOH,
            );
            this.message!.setString(stringData);
            this.messageTags = stringData.split(SOH);
        } else {
            this.message = null;
            this.messageTags = [];
        }
    }

    public processFields() {
        let tag = null;
        let value = null;
        let i = 0;
        let equalsOperator: number;
        let field: Field;

        for (i; i < this.messageTags.length - 1; i++) {
            equalsOperator = this.messageTags[i].indexOf(STRING_EQUALS);

            tag = this.messageTags[i].substring(0, equalsOperator);
            value = this.messageTags[i].substring(equalsOperator + 1);

            field = new Field(parseInt(tag, 10), value);

            this.fields.processField(this.message!, field);
            this.enums.processEnum(field);

            if (field.tag === 9) {
                this.message!.validateBodyLength(value);
            } else if (field.tag === 10) {
                this.message!.validateChecksum(value);
            }

            this.message!.addField(field);
        }
    }

    public parse(data: string): Message[] {
        let i = 0;

        const messageStrings = data ? data.split(this.reBeginString) : [];
        const messages = [];

        for (i; i < messageStrings.length; i++) {
            this.message = new Message();
            this.messageString = messageStrings[i];
            if (this.messageString.indexOf(SOH) > -1) {
                // SOH separator
                this.message!.setString(this.messageString);
                this.messageTags = this.messageString.split(SOH);
            } else {
                this.processMessage();
            }

            if (this.message) {
                this.processFields();
                messages.push(this.message);
            }
        }

        return messages;
    }
}
