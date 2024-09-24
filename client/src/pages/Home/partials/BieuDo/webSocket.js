const WEBSOCKET_URL = "ws://localhost:3002/data"; // Đặt URL WebSocket của bạn
 
let socket;

export const connectWebSocket = (onMessage) => {
  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = () => {
    console.log("Đã kết nối tới WebSocket");
  };
 
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data); // Gọi hàm để xử lý dữ liệu khi nhận được từ WebSocket
  };

  socket.onclose = () => {
    console.log("WebSocket đã đóng");
  };

  socket.onerror = (error) => {
    console.error("WebSocket gặp lỗi:", error);
  };
};
