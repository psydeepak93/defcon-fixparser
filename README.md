# fixparser

This is the Javascript framework for working with FIX protocol messages. Compliant with FIX 5.0 SP2.

The Financial Information eXchange (FIX) protocol is an electronic communications protocol initiated in 1992 for international real-time exchange of information related to the securities transactions and markets.

FIXParser demo
--------

[FIXParser demo page](http://fixparser.sendercompid.com)


Quick start
-----------

Install with `npm install fixparser`.

Parse a FIX message:

```javascript
import FIXParser from 'fixparser';
const fixParser = new FIXParser();
console.log(fixParser.parse('8=FIX.4.2|9=51|35=0|34=703|49=ABC|52=20100130-10:53:40.830|56=XYZ|10=249|'));
```

Create a FIX message:

```javascript
import FIXParser, {
    Field,
    Fields,
    Messages,
    Side,
    OrderTypes,
    HandlInst,
    TimeInForce,
    EncryptMethod
} from 'fixparser';
const fixParser = new FIXParser();
const order = fixParser.createMessage(
    new Field(Fields.MsgType, Messages.NewOrderSingle),
    new Field(Fields.MsgSeqNum, fixParser.getNextTargetMsgSeqNum()),
    new Field(Fields.SenderCompID, 'SENDER'),
    new Field(Fields.SendingTime, fixParser.getTimestamp()),
    new Field(Fields.TargetCompID, 'TARGET'),
    new Field(Fields.ClOrdID, '11223344'),
    new Field(Fields.HandlInst, HandlInst.AutomatedExecutionNoIntervention),
    new Field(Fields.OrderQty, '123'),
    new Field(Fields.TransactTime, fixParser.getTimestamp()),
    new Field(Fields.OrdType, OrderTypes.Market),
    new Field(Fields.Side, Side.Buy),
    new Field(Fields.Symbol, '123.HK'),
    new Field(Fields.TimeInForce, TimeInForce.Day)
);
console.log(order.encode('|'));
```

Connect over TCP socket (as client):

```javascript
import FIXParser from 'fixparser';
const fixParser = new FIXParser();
fixParser.connect({ host: 'localhost', port: 9878, protocol: 'tcp', sender: 'BANZAI', target: 'EXEC', fixVersion: 'FIX.4.4' });
fixParser.on('open', () => {
    // Connection is open... 
});
fixParser.on('message', (message) => {
    // Received FIX message
});
fixParser.on('close', () => {
    // Disconnected...
});
```

FIX Server:

```javascript
import FIXServer from 'fixparser/server';
const fixServer = new FIXServer();
fixServer.createServer('localhost', 9878, 'tcp');
fixServer.on('message', (message) => {
    console.log('server received message', message.description, message.string);
});
```

Connect over Webocket in a browser (as client):

```javascript
import FIXParser from 'fixparser/browser';
const fixParser = new FIXParser();
fixParser.connect({ host: 'localhost', port: 9878, sender: 'BANZAI', target: 'EXEC', fixVersion: 'FIX.4.4' });
fixParser.on('open', () => {
    // Connection is open... 
});
fixParser.on('message', (message) => {
    // Received FIX message
});
fixParser.on('close', () => {
    // Disconnected...
});
```

Features
--------
+ Parse and create FIX messages
+ Connect over TCP/Websocket socket as client or server
+ Fast, single-digit microsecond performance
+ Modern, written in Typescript
+ Validation (checksum and message length), includes FIX specification in parsed message
+ Supports various separators/start of headers (e.g. 0x01, ^ and |)
+ Clean and lightweight code
+ Supports both node.js and browser environments (`import 'fixparser' from 'fixparser/browser';`)

Performance
-----------
```bash
┌─────────────────────────────────┬───────────────┬──────────────┬──────────────┐
│ FIX Messages                    │ Messages/sec  │ Microseconds │ Milliseconds │
│ 200,000 iterations (same msg)   │ 156,863 msg/s │ 6.3750 μs    │ 0.0064 ms    │
│ 200,000 iterations (same msg)   │ 171,233 msg/s │ 5.8400 μs    │ 0.0058 ms    │
│ 200,000 iterations (random msg) │ 92,039 msg/s  │ 10.8650 μs   │ 0.0109 ms    │
│ 200,000 iterations (same msg)   │ 168,209 msg/s │ 5.9450 μs    │ 0.0059 ms    │
│ 200,000 iterations (random msg) │ 86,133 msg/s  │ 11.6100 μs   │ 0.0116 ms    │
│ 200,000 iterations (same msg)   │ 171,821 msg/s │ 5.8200 μs    │ 0.0058 ms    │
│ 200,000 iterations (random msg) │ 86,319 msg/s  │ 11.5850 μs   │ 0.0116 ms    │
│ 200,000 iterations (same msg)   │ 172,265 msg/s │ 5.8050 μs    │ 0.0058 ms    │
│ 200,000 iterations (same msg)   │ 170,940 msg/s │ 5.8500 μs    │ 0.0059 ms    │
│ 200,000 iterations (same msg)   │ 171,233 msg/s │ 5.8400 μs    │ 0.0058 ms    │
└─────────────────────────────────┴───────────────┴──────────────┴──────────────┘
```
MacBook Air, 1.7 GHz Intel Core i7 (8 GB 1600 MHz DDR3), run with `npm run perf`.

Message format
--------------

The general format of a FIX message is a standard header followed by the message body fields and terminated with a standard trailer.

Each message is constructed of a stream of <tag>=<value> fields with a field delimiter between fields in the stream. Tags are of data type TagNum. All tags must have a value specified. Optional fields without values should simply not be specified in the FIX message. A Reject message is the appropriate response to a tag with no value.
Except where noted, fields within a message can be defined in any sequence (Relative position of a field within a message is inconsequential.) The exceptions to this rule are:

- General message format is composed of the standard header followed by the body followed by the standard trailer.
- The first three fields in the standard header are BeginString (tag #8) followed by BodyLength (tag #9) followed by MsgType (tag #35).
- The last field in the standard trailer is the CheckSum (tag #10).
- Fields within repeating data groups must be specified in the order that the fields are specified in the message definition within the FIX specification document. The NoXXX field where XXX is the field being counted specifies the number of repeating group instances that must immediately precede the repeating group contents.
- A tag number (field) should only appear in a message once. If it appears more than once in the message it should be considered an error with the specification document. The error should be pointed out to the FIX Global Technical Committee.

In addition, certain fields of the data type MultipleCharValue can contain multiple individual values separated by a space within the "value" portion of that field followed by a single "SOH" character (e.g. "18=2 9 C<SOH>" represents 3 individual values: '2', '9', and 'C'). Fields of the data type MultipleStringValue can contain multiple values that consists of string values separated by a space within the "value" portion of that field followed by a single "SOH" character (e.g. "277=AA I AJ<SOH>" represents 3 values: 'AA', 'I', 'AJ').

It is also possible for a field to be contained in both the clear text portion and the encrypted data sections of the same message. This is normally used for validation and verification. For example, sending the SenderCompID in the encrypted data section can be used as a rudimentary validation technique. In the cases where the clear text data differs from the encrypted data, the encrypted data should be considered more reliable. (A security warning should be generated).

Authors
-------

**Victor Norgren**

+ https://twitter.com/logotype
+ https://gitlab.com/logotype
+ https://logotype.se
