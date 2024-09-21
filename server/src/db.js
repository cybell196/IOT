const mysql = require('mysql2');

// Tạo kết nối đến MySQL
const connection = mysql.createConnection({
    host: 'localhost',  // Địa chỉ MySQL server
    user: 'root',       // Tên người dùng MySQL (thường là root)
    password: '',       // Mật khẩu của MySQL (để trống nếu không có)
    database: 'iot' // Tên database bạn muốn kết nối
});

// Kết nối MySQL
connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Kết nối MySQL thành công!');
});

module.exports = connection;
