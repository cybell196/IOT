import axios from "axios";

const API_BASE_URL = "http://localhost:3002"; // Đặt URL API của bạn

// Hàm lấy tất cả dữ liệu từ MySQL
export const fetchAllData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/data-sensor`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy dữ liệu:", error);
    return [];
  }
};
