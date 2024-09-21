const mqtt = require('mqtt');
const mqttBrokerUrl = 'mqtt://localhost:1883'; // Thay bằng URL của MQTT broker của bạn
const mqttClient = mqtt.connect(mqttBrokerUrl);
const connection = require('./db'); // Để lưu dữ liệu vào MySQL
const { sendDataToClients } = require('./webSocketHandler'); // Import hàm gửi dữ liệu qua WebSocket

// Hàm để bắt đầu subscribe
exports.subDataSensor = () => {
    // Kết nối tới MQTT broker
    mqttClient.on('connect', () => {
        console.log('Đã kết nối tới MQTT broker');
        mqttClient.subscribe('iot/data', (err) => { // Thay bằng topic của bạn
            if (!err) {
                console.log('Đã subscribe topic iot/data');
            }
        });
    });

    // Nhận tin nhắn từ MQTT và xử lý
    mqttClient.on('message', (topic, message) => {
        console.log(`Nhận tin nhắn từ ${topic}: ${message.toString()}`);
    
        try {
            const data = JSON.parse(message.toString().trim());
            
            const query = 'INSERT INTO DataSensor (nhiet_do, do_am, anh_sang, thoi_gian) VALUES (?, ?, ?, ?)';
            const values = [data.nhietdo, data.doam, data.anhsang, new Date()];
    
            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Lỗi khi lưu dữ liệu vào MySQL:', err);
                } else {
                    console.log('Dữ liệu đã được lưu vào MySQL:', result);
                    sendDataToClients({
                        nhietdo: data.nhietdo,
                        doam: data.doam,
                        anhsang: data.anhsang
                    });
                }
            });
        } catch (error) {
            console.error('Lỗi khi phân tích JSON:', error);
        }
    });
}
