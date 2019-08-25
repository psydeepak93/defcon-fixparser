import FIXParser, {
    EncryptMethod,
    Field,
    Fields,
    Messages,
} from '../src/FIXParser';

const fixParser = new FIXParser();

const SENDER = 'ctrader.xxxxxxx';
const TARGET = 'CSERVER';
const CTRADER_PASSWORD = 'xxxxxxxxxxxx';
const CTRADER_SERVER = 'xxxxxxxxxxxx'; // e.g. h47.p.ctrader.com
const CTRADER_PORT = 5201; // 5211 SSL, 5201 Plain Text

let countReq = 0;

function sendLogon() {
    const logon = fixParser.createMessage(
        new Field(Fields.MsgType, Messages.Logon),
        new Field(Fields.BeginString, 'FIX.4.4'),
        new Field(Fields.MsgSeqNum, fixParser.getNextTargetMsgSeqNum()),
        new Field(Fields.SenderCompID, SENDER),
        new Field(Fields.SendingTime, fixParser.getTimestamp()),
        new Field(Fields.TargetCompID, TARGET),
        new Field(Fields.SenderSubID, 'QUOTE'),
        new Field(Fields.ResetSeqNumFlag, 'Y'),
        new Field(Fields.RawData, CTRADER_PASSWORD),
        new Field(Fields.EncryptMethod, EncryptMethod.None),
        new Field(Fields.HeartBtInt, 10),
    );
    const messages = fixParser.parse(logon.encode());
    console.log('sending message', messages[0].description, messages[0].string);
    fixParser.send(logon);
}

// for sending market data request to cTrader's FIX API server
function sendMarketDataRequest() {
    const quote = fixParser.createMessage(
        new Field(Fields.MsgType, Messages.MarketDataRequest),
        new Field(Fields.BeginString, 'FIX.4.4'),
        new Field(Fields.SenderCompID, SENDER),
        new Field(Fields.MsgSeqNum, fixParser.getNextTargetMsgSeqNum()),
        new Field(Fields.TargetCompID, TARGET),
        new Field(Fields.SendingTime, fixParser.getTimestamp()),
        new Field(Fields.MarketDepth, 0),
        new Field(Fields.MDUpdateType, 0),
        new Field(Fields.NoRelatedSym, 2),
        new Field(Fields.Symbol, 1), // for cTrader's own symbol system, 1 for EURUSD
        new Field(Fields.Symbol, 2), // 2 for GBPUSD
        new Field(Fields.MDReqID, ++countReq),
        new Field(Fields.SubscriptionRequestType, 1),
        new Field(Fields.NoMDEntryTypes, 2),
        new Field(Fields.MDEntryType, 0),
        new Field(Fields.MDEntryType, 1),
    );
    const messages = fixParser.parse(quote.encode());
    console.log(
        'sending message',
        messages[0].description,
        messages[0].string.replace(/\x01/g, '|'),
    );
    fixParser.send(quote);
}

fixParser.connect({
    host: CTRADER_SERVER,
    port: CTRADER_PORT,
    protocol: 'tcp',
    sender: SENDER,
    target: TARGET,
    fixVersion: 'FIX.4.4',
});

fixParser.on('open', () => {
    console.log('Open');
    sendLogon();
    sendMarketDataRequest();
});
fixParser.on('message', (message) => {
    console.log('received message', message.description, message.string);
});
fixParser.on('error', (error) => {
    console.log('error', error);
});
fixParser.on('close', () => {
    console.log('Disconnected');
});
