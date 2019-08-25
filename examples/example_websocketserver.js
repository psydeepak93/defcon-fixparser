import FIXServer from '../src/FIXServer';
import Field from '../src/fields/Field';
import * as Fields from '../src/constants/ConstantsField';
import * as Messages from '../src/constants/ConstantsMessage';
import * as HandlInst from '../src/constants/ConstantsHandlInst';
import * as OrderTypes from '../src/constants/ConstantsOrderTypes';
import * as Side from '../src/constants/ConstantsSide';
import * as TimeInForce from '../src/constants/ConstantsTimeInForce'; // from 'fixparser/websocketserver';

const SENDER = 'EXEC';
const TARGET = 'BANZAI';
const fixServer = new FIXServer();
fixServer.createServer('localhost', 9878, 'websocket');

setInterval(() => {
    const order = fixServer.createMessage(
        new Field(Fields.MsgType, Messages.NewOrderSingle),
        new Field(
            Fields.MsgSeqNum,
            fixServer.setNextTargetMsgSeqNum(
                fixServer.getNextTargetMsgSeqNum() + 1,
            ),
        ),
        new Field(Fields.SenderCompID, SENDER),
        new Field(Fields.SendingTime, fixServer.getTimestamp()),
        new Field(Fields.TargetCompID, TARGET),
        new Field(Fields.ClOrdID, '11223344'),
        new Field(Fields.HandlInst, HandlInst.AutomatedExecutionNoIntervention),
        new Field(Fields.OrderQty, '123'),
        new Field(Fields.TransactTime, fixServer.getTimestamp()),
        new Field(Fields.OrdType, OrderTypes.Market),
        new Field(Fields.Side, Side.Buy),
        new Field(Fields.Symbol, '700.HK'),
        new Field(Fields.TimeInForce, TimeInForce.Day),
    );
    const messages = fixServer.parse(order.encode());
    console.log(
        'sending message',
        messages[0].description,
        messages[0].string.replace(/\x01/g, '|'),
    );
    fixServer.send(order);
}, 100);

fixServer.on('open', () => {
    console.log('Open');
});
fixServer.on('message', (message) => {
    console.log('server received message', message.description, message.string);
});
fixServer.on('close', () => {
    console.log('Disconnected');
});
