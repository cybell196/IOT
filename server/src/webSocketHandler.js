const WebSocket = require('ws');
let clients = [];

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    console.log('WebSocket server đang chạy');
    wss.on('connection', ws => {
        clients.push(ws);
        console.log('Client kết nối WebSocket');

        ws.on('close', () => {
            clients = clients.filter(client => client !== ws);
            console.log('Client đóng kết nối');
        });
    });
}

function sendDataToClients(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
 
module.exports = { setupWebSocket, sendDataToClients };
