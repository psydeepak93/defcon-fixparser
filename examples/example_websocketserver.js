import FIXWebSocketServer from './../src/FIXWebSocketServer'; // from 'fixparser/websocketserver';

const fixServer = new FIXWebSocketServer();
fixServer.createServer('localhost', 9878);

fixServer.on('open', () => {
    console.log('Open');
});
fixServer.on('message', (message) => {
    console.log('server received message', message.description, message.string);
});
fixServer.on('close', () => {
    console.log('Disconnected');
});
