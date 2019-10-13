import { ISpecMessageContents } from '../../spec/SpecMessageContents';
import {
    BeginString,
    BodyLength,
    CheckSum,
    ContraTradeQty,
    LastPx,
    LeavesQty,
    MsgType,
    OrderQty,
    OrdType,
    Price,
    Side,
    Symbol,
    TimeInForce,
} from '../constants/ConstantsField';
import { Enums } from '../enums/Enums';
import Field from '../fields/Field';
import { pad } from '../util/util';

const TAG_CHECKSUM: string = '10=';
const TAG_MSGTYPE: string = '35=';
const MARKER_BODYLENGTH: string = '\x02';
const MARKER_CHECKSUM: string = '\x03';

export const calculateBodyLength = (value: string): number => {
    const startLength: number =
        value.indexOf(TAG_MSGTYPE) === -1 ? 0 : value.indexOf(TAG_MSGTYPE) + 1;
    const endLength: number =
        value.indexOf(TAG_CHECKSUM) === -1
            ? value.length
            : value.indexOf(TAG_CHECKSUM) + 1;

    return endLength - startLength;
};

const nonEmpty = (parts: TemplateStringsArray, ...args: string[]): string => {
    let res = parts[0];
    for (let i = 1; i < parts.length; i++) {
        if (args[i - 1] || args[i - 1] === '0') {
            res += args[i - 1];
        }
        res += parts[i];
    }
    return res;
};

export const calculateChecksum = (value: string): string => {
    let integerValues = 0;

    for (let i = 0; i < value.length; i++) {
        integerValues += value.charCodeAt(i);
    }

    return pad(integerValues & 255, 3); // eslint-disable-line no-use-before-define
};

const calculatePosition = (spec: any, tag: number): number => {
    if (spec.tagText === 'StandardHeader' && tag === 8) {
        return 0;
    } else if (spec.tagText === 'StandardHeader' && tag === 9) {
        return 1;
    } else if (spec.tagText === 'StandardHeader' && tag === 35) {
        return 2;
    } else if (spec.tagText === 'StandardTrailer') {
        return 999999999;
    } else {
        return spec.position + 100;
    }
};

interface IMessageContents {
    componentID: string;
    tagText: string;
    indent: string;
    position: string;
    reqd: string;
    description?: string;
    updated?: string;
    updatedEP?: string;
    added: string;
    addedEP?: string;
    issue?: string;
    deprecated?: string;

    // Dynamic types
    components?: IMessageContent[];
    validated?: boolean;
}
interface IMessageContent {
    field: Field;
    hasValue: boolean;
    position: number;
    reqd: string;
    spec: any;
    tagText: number;
    valid: boolean;

    // Dynamic types
    validated?: boolean;
}

export const validateMessage = (message: Message): any => {
    let result: any[] = [];

    const messageDataCloned: Field[] = JSON.parse(JSON.stringify(message.data));
    const messageContentsCloned: IMessageContents[] = JSON.parse(
        JSON.stringify(message.messageContents),
    );

    messageDataCloned.forEach((field: Field, index: number) => {
        const spec = messageContentsCloned.find((item: any) => {
            if (item.components!.length > 0) {
                return item.components!.find((subItem: any) => {
                    const found = subItem.tagText === field.tag;
                    if (found) {
                        subItem.validated = true;
                    }
                    return found;
                });
            } else {
                item.validated = true;
                return Number(item.tagText) === field.tag;
            }
        });

        if (spec) {
            result.push({
                field,
                hasValue: true,
                position: calculatePosition(spec, field.tag),
                reqd: spec.reqd,
                spec,
                valid: true,
            });
        } else {
            result.push({
                field,
                hasValue: true,
                message: 'Unknown/unsupported field',
                position: index,
                reqd: '0',
                spec: null,
                valid: true,
            });
        }
    });

    messageContentsCloned
        .filter((item: any) => !item.validated)
        .forEach((spec: any) => {
            if (spec.components.length > 0) {
                spec.components
                    .filter((subItem: IMessageContent) => !subItem.validated)
                    .forEach((subSpec: IMessageContent) => {
                        if (!subSpec.validated) {
                            result.push({
                                field: null,
                                hasValue: false,
                                position: calculatePosition(
                                    subSpec,
                                    subSpec.tagText,
                                ),
                                reqd: subSpec.reqd,
                                spec: subSpec,
                                tagText: subSpec.tagText,
                                valid: !(subSpec.reqd === '1'),
                            });
                        }
                    });
            } else if (!spec.validated) {
                result.push({
                    field: null,
                    hasValue: false,
                    position: calculatePosition(spec, spec.tagText),
                    reqd: spec.reqd,
                    spec,
                    tagText: spec.tagText,
                    valid: !(spec.reqd === '1'),
                });
            }
        });

    result = result.sort((a, b) =>
        parseInt(a.position, 10) < parseInt(b.position, 10) ? -1 : 1,
    );

    return result;
};

export default class Message {
    public static FIX_VERSION: string = 'FIX.5.0SP2';
    public fixVersion: string = 'FIX.5.0SP2';
    public data: Field[] = [];
    public string: string = '';
    public description: string = '';
    public messageType: string = '';
    public messageContents: ISpecMessageContents[] = [];
    public bodyLengthValid: boolean = false;
    public checksumValid: boolean = false;
    public checksumValue: string | null = null;
    public checksumExpected: string | null = null;
    public bodyLengthValue: number | null = null;
    public bodyLengthExpected: number | null = null;

    constructor(fixVersion: string = Message.FIX_VERSION, ...fields: Field[]) {
        this.fixVersion = fixVersion;
        this.reset();

        // Add other tags
        fields.forEach((field: Field) => {
            if (field.tag === MsgType) {
                this.data.splice(0, 0, field);
            } else {
                this.data.push(field);
            }
        });
    }

    public addField(field: Field) {
        this.data.push(field);
    }

    public getField(tag: number): Field | undefined {
        return this.data.find((field: Field) => field.tag === tag);
    }

    public setField(field: Field) {
        const index = this.data.findIndex(
            (item: Field) => item.tag === field.tag,
        );
        if (index > -1) {
            this.data[index] = field;
        }
    }

    public setString(fixString: string) {
        this.string = fixString;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public setMessageType(messageType: string) {
        this.messageType = messageType;
    }

    public setMessageContents(messageContents: ISpecMessageContents[]) {
        this.messageContents = messageContents;
    }

    public getEnum(tag: number, value: string) {
        if (!this.getField(MsgType) || !this.getField(MsgType)!.tag) {
            return null;
        }

        if (!this.getField(MsgType) || !this.getField(MsgType)!.value) {
            return null;
        }

        const enums = new Enums();
        return enums.getEnum(tag.toString(), value);
    }

    public getBriefDescription() {
        let returnValue: string = '';
        const sideField: any = this.getField(Side)!;
        let side: string | null = '';
        if (sideField && sideField.enumeration!) {
            side = sideField.enumeration!.symbolicName;
            side = side ? side.replace('Sell', 'SL').toUpperCase() : null;
        }

        if (this.getField(LeavesQty) !== undefined) {
            let quantity = null;

            if (this.getField(ContraTradeQty)) {
                quantity = this.getField(ContraTradeQty)!.value;
            } else {
                quantity = this.getField(OrderQty)!.value;
            }
            const leavesQuantity = this.getField(LeavesQty)!.value;
            const lastPrice = this.getField(LastPx)!.value;
            returnValue = nonEmpty`${quantity} @${
                lastPrice || lastPrice === '0' ? lastPrice.toFixed(2) : '0.00'
            } ${this.getField(LeavesQty)!.name!.replace(
                'LeavesQty',
                'LvsQty',
            )} ${parseInt(leavesQuantity, 10).toString()}`;
        } else if (this.getField(OrderQty)) {
            const orderQuantity = this.getField(OrderQty)!.value;
            const symbol = this.getField(Symbol)!.value;
            const orderType = this.getField(OrdType)!;
            let symbolicName: string | null = '';
            if (orderType && orderType.enumeration!) {
                symbolicName = orderType.enumeration!.symbolicName;
            }
            const timeInForceField = this.getField(TimeInForce)!;
            let timeInForce: any = null;
            if (timeInForceField && timeInForceField.enumeration!) {
                timeInForce = timeInForceField.enumeration!.symbolicName;
            }

            if (this.getField(Price)) {
                let price = this.getField(Price)!.value;
                if (price && price >= 1) {
                    price = price.toFixed(2);
                } else if (price !== undefined && price < 1) {
                    price = price.toString().replace('0.', '.');
                }
                returnValue = nonEmpty`${side || ''} ${orderQuantity} ${
                    symbol ? symbol.toUpperCase() : ''
                } ${
                    symbolicName
                        ? symbolicName
                              .replace('Market', 'MKT')
                              .replace('Limit', 'LMT')
                              .toUpperCase()
                        : ''
                } @${price} ${timeInForce ? timeInForce.toUpperCase() : ''}`;
            } else {
                returnValue = nonEmpty`${side || ''} ${orderQuantity} ${
                    symbol ? symbol.toUpperCase() : ''
                } ${
                    symbolicName
                        ? symbolicName
                              .replace('Market', 'MKT')
                              .replace('Limit', 'LMT')
                              .toUpperCase()
                        : ''
                } ${timeInForce ? timeInForce.toUpperCase() : ''}`;
            }
        } else {
            const messageType = this.getField(MsgType);
            if (messageType && messageType.tag && messageType.value) {
                return this.getEnum(messageType.tag, messageType.value)!
                    .SymbolicName!;
            } else {
                return null;
            }
        }

        return returnValue.trim();
    }

    public validateBodyLength(value: string): boolean {
        const startLength: number =
            this.string.indexOf(TAG_MSGTYPE) === -1
                ? 0
                : this.string.indexOf(TAG_MSGTYPE);
        const endLength: number =
            this.string.indexOf(TAG_CHECKSUM) === -1
                ? this.string.length
                : this.string.indexOf(TAG_CHECKSUM);
        const bodyLength: number = endLength - startLength;

        this.bodyLengthValue = Number(value) >> 0;
        this.bodyLengthExpected = bodyLength;
        this.bodyLengthValid = Number(value) >> 0 === bodyLength;
        return this.bodyLengthValid;
    }

    public validateChecksum(value: string): boolean {
        const length: number =
            this.string.indexOf(TAG_CHECKSUM) === -1
                ? this.string.length
                : this.string.indexOf(TAG_CHECKSUM);
        const data: string = this.string.substring(0, length);
        const calculatedChecksum: string = calculateChecksum(data);

        this.checksumValue = value;
        this.checksumExpected = calculatedChecksum;
        this.checksumValid = value === calculatedChecksum;
        return this.checksumValid;
    }

    public validate(): any {
        return validateMessage(this);
    }

    public encode(separator: string = '\x01'): string {
        const fields: any[] = this.data.map(
            (field: Field) => new Field(field.tag, field.value),
        );
        const data = [];

        let beginString = new Field(BeginString, this.fixVersion).toString();
        let bodyLength = new Field(BodyLength, MARKER_BODYLENGTH).toString();
        let checksum = new Field(CheckSum, MARKER_CHECKSUM).toString();
        let index = fields.findIndex((field) => field.tag === BeginString);

        // Check for header
        if (index > -1) {
            beginString = fields[index].toString();
            fields.splice(index, 1);
        }

        // Check for body length
        index = fields.findIndex((field) => field.tag === BodyLength);
        if (index > -1) {
            bodyLength = fields[index].toString();
            fields.splice(index, 1);
        }

        // Check for trailer
        index = fields.findIndex((field) => field.tag === CheckSum);
        if (index > -1) {
            checksum = fields[index].toString();
            fields.splice(index, 1);
        }

        data.push(beginString);
        data.push(bodyLength);

        // Add other fields
        fields.forEach((field) => {
            data.push(field.toString());
        });

        data.push(checksum);

        let fixMessage = `${data.join(separator)}${separator}`;
        fixMessage = fixMessage.replace(
            MARKER_BODYLENGTH,
            calculateBodyLength(fixMessage).toString(),
        );

        const length =
            fixMessage.indexOf(TAG_CHECKSUM) === -1
                ? fixMessage.length
                : fixMessage.indexOf(TAG_CHECKSUM);
        const calculatedChecksum = calculateChecksum(
            fixMessage.substring(0, length),
        );
        fixMessage = fixMessage.replace(MARKER_CHECKSUM, calculatedChecksum);

        return fixMessage;
    }

    private reset(): void {
        this.data = [];
        this.string = '';
        this.description = '';
        this.messageType = '';
        this.messageContents = [];
        this.bodyLengthValid = false;
        this.checksumValid = false;
        this.checksumValue = null;
        this.checksumExpected = null;
        this.bodyLengthValue = null;
        this.bodyLengthExpected = null;
    }
}
