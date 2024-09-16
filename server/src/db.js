const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',      // Địa chỉ máy chủ MySQL (XAMPP thường là 'localhost')
  user: 'root',           // Tài khoản MySQL (thường mặc định là 'root')
  password: '',           // Mật khẩu MySQL (thường mặc định là rỗng trong XAMPP)
  database: 'iot' // Tên cơ sở dữ liệu bạn muốn kết nối
});

connection.connect((err) => {
  if (err) {
    console.error('Kết nối MySQL thất bại: ', err);
    return;
  }
  console.log('Kết nối MySQL thành công!');
});

module.exports = connection;
