const WebSocket = require('ws');
let dataClients = [];
let controlClients = [];

// Hàm xử lý kết nối WebSocket cho các endpoint
function setupWebSocket(server) {
    const wss = new WebSocket.Server({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
        const { url } = request;

        if (url === '/data') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request, 'data');
            });
        } else if (url === '/control') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request, 'control');
            });
        } else {
            socket.destroy();
        }
    });

    wss.on('connection', (ws, request, path) => {
        if (path === 'data') {
            dataClients.push(ws);
            console.log('Client kết nối WebSocket tới /data');
        } else if (path === 'control') {
            controlClients.push(ws);
            console.log('Client kết nối WebSocket tới /control');

            // Lắng nghe message từ client để điều khiển thiết bị
            ws.on('message', message => {
                try {
                    const mes = JSON.parse(message);

                    if (mes.type === "LED_CONTROL" && mes.command) {
                        const { mqttClient } = require('./mqttHandler'); // Lấy mqttClient từ mqttHandler
                        mqttClient.publish('led/control', mes.command); // Gửi lệnh tới MQTT
                        console.log(`Đã gửi tín hiệu tới MQTT: ${mes.command}`);
                    } else {
                        console.log('Dữ liệu không hợp lệ hoặc type không phải LED_CONTROL');
                    }
                } catch (error) {
                    console.error('Lỗi khi xử lý dữ liệu từ client:', error);
                }
            });
        }

        ws.on('close', () => {
            if (path === 'data') {
              dataClients = dataClients.filter(client => client !== ws);
            } else if (path === 'control') {
              controlClients = controlClients.filter(client => client !== ws);
            }
            console.log('Client đóng kết nối');
          });
    });
}

// Hàm gửi dữ liệu cảm biến tới tất cả các client WebSocket kết nối tới /data
function sendDataToDataClients(data) {
    dataClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Hàm gửi dữ liệu điều khiển tới tất cả các client kết nối tới /control
function sendDataToControlClients(data) {
    controlClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

module.exports = { setupWebSocket, sendDataToDataClients, sendDataToControlClients };
