// Hàm gọi API để lấy dòng cuối cùng từ server


export const fetchLastData = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/data-sensor/last-data'); // Gọi API để lấy dòng cuối cùng
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        throw error;
    }
};
    