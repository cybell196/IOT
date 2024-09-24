let socket = null; // Biến lưu trữ kết nối WebSocket duy nhất
const WEBSOCKET_URL = "ws://localhost:3002/data";

export const connectWebSocket = (onMessage) => {
  // Nếu WebSocket đã được kết nối, chỉ cần gắn lại hàm xử lý message
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("WebSocket đã được kết nối trước đó");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data); // Gọi hàm xử lý khi có dữ liệu mới
    };
    return socket;
  }

  // Nếu chưa kết nối, tạo kết nối mới
  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = () => {
    console.log("Đã kết nối tới WebSocket");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data); // Gọi hàm xử lý khi có dữ liệu mới
  };

  socket.onclose = () => {
    console.log("WebSocket đã đóng");
    socket = null; // Reset lại khi kết nối đóng
  };

  socket.onerror = (error) => {
    console.error("Lỗi WebSocket:", error);
  };

  return socket;
};
