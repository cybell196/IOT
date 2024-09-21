const connection = require('../db'); // Đảm bảo đường dẫn đúng tới file db.js

// Hàm lấy tất cả dữ liệu từ bảng ActionHistory
exports.getAllActions = (req, res) => {
    const { sortBy = 'thoi_gian', order = 'ASC', limit, filter } = req.query;
    
    // Câu lệnh SQL cơ bản
    let query = 'SELECT id, thiet_bi, hanh_dong, thoi_gian FROM ActionHistory';
    
    // Xử lý lọc dữ liệu nếu có filter
    if (filter) {
        query += ` WHERE ${filter}`;
    }
    
    // Thêm điều kiện sắp xếp
    query += ` ORDER BY ${sortBy} ${order}`;
    
    // Giới hạn kết quả nếu có limit
    if (limit) {
        query += ` LIMIT ${parseInt(limit, 10)}`;
    }
    
    // Thực hiện câu truy vấn
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }
        const adjustedResults = results.map(row => {
            const thoi_gian_local = new Date(row.thoi_gian).toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
            return { ...row, thoi_gian: thoi_gian_local };
        });
        
        res.json(adjustedResults);
    });
};

// Hàm lấy dữ liệu theo ID
exports.getActionById = (req, res) => {
    const id = req.params.id;
    
    // Câu lệnh SQL để lấy dữ liệu theo ID
    const query = 'SELECT id, thiet_bi, hanh_dong, thoi_gian FROM ActionHistory WHERE id = ?';
    
    // Thực hiện câu truy vấn
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }
        
        if (results.length === 0) {
            res.status(404).json({ error: 'Dữ liệu không tìm thấy' });
            return;
        }
        
        res.json(results[0]);
    });
};
