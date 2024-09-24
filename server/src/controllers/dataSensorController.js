// src/controllers/dataSensorController.js
const connection = require('../db');

exports.getAllData = (req, res) => {
    const { sortBy = 'thoi_gian', order = 'ASC', limit, filter } = req.query;

    let query = 'SELECT id, nhiet_do, do_am, anh_sang, thoi_gian FROM DataSensor';

    if (filter) {
        query += ` WHERE ${filter}`;
    }

    query += ` ORDER BY ${sortBy} ${order}`;

    if (limit) {
        query += ` LIMIT ${parseInt(limit, 10)}`;
    }

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }

        // Chuyển đổi múi giờ sang +07:00 trong server trước khi trả về client
        const adjustedResults = results.map(row => {
            const thoi_gian_local = new Date(row.thoi_gian).toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
            return { ...row, thoi_gian: thoi_gian_local };
        });
        
        res.json(adjustedResults);
    });
};

exports.getLastData = (req, res) => {
    // Lấy dòng cuối cùng từ bảng DataSensor
    connection.query('SELECT * FROM DataSensor ORDER BY id DESC LIMIT 1', (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Không có dữ liệu trong bảng' });
            return;
        }
        res.json(results[0]); // Trả về dòng cuối cùng
    });
};
