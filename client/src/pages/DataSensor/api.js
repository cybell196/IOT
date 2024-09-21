import axios from 'axios';

export function fetchData() {
    return axios
        .get('http://localhost:3002/api/data-sensor', {
            params: {
                // sortBy: 'nhiet_do',  // Uncomment if needed
                // order: 'DESC',      // Uncomment if needed
                // limit: 10           // Uncomment if needed
            },
        })
        .then((response) => {
            // Kiểm tra dữ liệu nhận được từ server
            console.log('Dữ liệu từ server:', response.data);
            // Đảm bảo dữ liệu là mảng trước khi trả về
            if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.error('Dữ liệu không phải là mảng:', response.data);
                return [];
            }
        })
        .catch((error) => {
            console.error('Lỗi:', error);
            return [];  // Trả về mảng rỗng khi có lỗi
        });
}
