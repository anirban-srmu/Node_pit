const WebSocket = require('ws');

const ws = new WebSocket.Server({port:8080});

ws.on('connection', ws=>{
    console.log('New client connected');
    ws.on('message',message=>{
        console.log('Received:',message);
        ws.send('Hello from the server!');
    });
    ws.on('close',()=>{
        console.log('client disconnected');
    });
});

console.log('websocket server running at ws://localhost:8080');