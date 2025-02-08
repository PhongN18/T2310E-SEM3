const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8080');

socket.on('open', () => {
    console.log('🔗 Đã kết nối với WebSocket Server');
    socket.send('Hello từ Node.js Client!');
});

socket.on('message', message => {
    console.log('📩 Tin nhắn từ server:', message);
});
