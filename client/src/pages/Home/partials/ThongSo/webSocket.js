export const createWebSocket = (setData) => {
    const ws = new WebSocket('ws://localhost:3002/data'); // Tạo WebSocket
    ws.onmessage = (message) => {
        const newData = JSON.parse(message.data);
        setData(newData); // Cập nhật data khi có message từ WebSocket
    };
    return ws;
}; 