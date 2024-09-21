const express = require('express');
const http = require('http');
const cors = require('cors');
const { subDataSensor } = require('./mqttHandler'); // Import hàm subDataSensor để xử lý MQTT
const { setupWebSocket } = require('./webSocketHandler'); // Import hàm setupWebSocket để xử lý WebSocket

// Import routes
const dataSensorRoutes = require('./routes/dataSensorRoutes');
const actionHistoryRoutes = require('./routes/actionHistoryRoutes');

// Tạo ứng dụng Express và server HTTP
const app = express();
const server = http.createServer(app);

//Middleware
app.use(express.json());
app.use(cors());

// MQTT
subDataSensor();

// Routes
app.use('/api/data-sensor', dataSensorRoutes);
app.use('/api/action-history', actionHistoryRoutes);
app.use('/api/last-data', dataSensorRoutes);
server.listen(3002, () => {
    console.log('Server đang chạy tại http://localhost:3002');
});

// Khởi tạo WebSocket server
setupWebSocket(server);