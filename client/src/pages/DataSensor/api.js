import axios from 'axios';

export function fetchData(params) {
    return axios
        .get('http://localhost:3002/api/data-sensor', {
            params: {
                searchField: params.searchField,  // Trường tìm kiếm (nhiet_do, do_am, anh_sang...)
                searchTerm: params.searchTerm     // Từ khóa tìm kiếm
            },
        })
        .then((response) => {
            console.log('Dữ liệu từ server:', response.data);
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
