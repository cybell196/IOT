const express = require('express');
const http = require('http');
const cors = require('cors');
const { subDataSensor } = require('./mqttHandler'); // Import hàm subDataSensor để xử lý MQTT
const { setupWebSocket } = require('./webSocketHandler'); // Import hàm setupWebSocket để xử lý WebSocket
const buttonRoutes = require('./routes/buttonRoutes');

const setupSwagger = require('./swagger'); // Import Swagger

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

// Swagger setup
setupSwagger(app); // Tích hợp Swagger vào ứng dụng Express

// Routes
app.use('/api/data-sensor', dataSensorRoutes);
app.use('/api/action-history', actionHistoryRoutes);
// app.use('/api/last-data', dataSensorRoutes);
app.use('/api', buttonRoutes);

server.listen(3002, () => {
    console.log('Server đang chạy tại http://localhost:3002');
    console.log('API docs có sẵn tại http://localhost:3002/api-docs'); // Đường dẫn tới tài liệu API
  });

// Khởi tạo WebSocket server và lắng nghe các endpoint khác nhau
setupWebSocket(server);
