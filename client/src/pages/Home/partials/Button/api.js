import axios from 'axios';

// Hàm lấy trạng thái của tất cả button từ server
export const getButtonState = async () => {
  try {
    const response = await axios.get('http://localhost:3002/api/button-state');
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái button từ server:", error);
    throw error;
  }
};

// Hàm cập nhật trạng thái button lên server
export const updateButtonState = async (buttonState) => {
  try {
    const response = await axios.post('http://localhost:3002/api/button-state', buttonState);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lưu trạng thái button:", error);
    throw error;
  }
};
