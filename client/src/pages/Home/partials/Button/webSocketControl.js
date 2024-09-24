let ws;
let isConnected = false;
const listeners = [];

// Khởi tạo kết nối WebSocket (chỉ khởi tạo nếu chưa có)
export const initWebSocket = () => {
  if (!ws) {
    ws = new WebSocket("ws://localhost:3002/control");

    ws.onopen = () => {
      console.log("WebSocket đã kết nối thành công.");
      isConnected = true;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data); // Giải mã JSON message từ server
      listeners.forEach((listener) => listener(data));
    };

    ws.onclose = () => {
      console.log("WebSocket đã bị đóng.");
      isConnected = false;
      ws = null; // Đặt lại ws để có thể khởi tạo lại nếu cần
    };

    ws.onerror = (error) => {
      console.error("Lỗi WebSocket:", error);
    };
  }
};

// Thêm listener để nhận dữ liệu từ WebSocket
export const addWebSocketListener = (listener) => {
  listeners.push(listener);
};

// Gửi message tới server qua WebSocket
export const sendWebSocketMessage = (message) => {
  if (isConnected && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error("WebSocket chưa sẵn sàng để gửi dữ liệu.");
  }
};
