import FIXServer from './../src/FIXServer'; // from 'fixparser/websocketserver';

const fixServer = new FIXServer();
fixServer.createServer('localhost', 9878, 'websocket');

fixServer.on('open', () => {
    console.log('Open');
});
fixServer.on('message', (message) => {
    console.log('server received message', message.description, message.string);
});
fixServer.on('close', () => {
    console.log('Disconnected');
});
