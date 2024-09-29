// src/controllers/dataSensorController.js
const connection = require('../db');
/**
 * @swagger
 * components:
 *   schemas:
 *     DataSensor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của bản ghi
 *         nhiet_do:
 *           type: number
 *           description: Nhiệt độ
 *         do_am:
 *           type: number
 *           description: Độ ẩm
 *         anh_sang:
 *           type: number
 *           description: Cường độ ánh sáng
 *         thoi_gian:
 *           type: string
 *           format: date-time
 *           description: Thời gian ghi nhận
 */

/**
 * @swagger
 * /api/data-sensor:
 *   get:
 *     summary: Lấy tất cả dữ liệu cảm biến
 *     tags: [DataSensor]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: "Sắp xếp theo trường dữ liệu (vd: thoi_gian)"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Thứ tự sắp xếp (ASC/DESC)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Giới hạn số lượng bản ghi
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: "Điều kiện lọc dữ liệu (vd: nhiet_do > 25)"
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataSensor'
 */
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
/**
 * @swagger
 * /api/data-sensor/last-data:
 *   get:
 *     summary: Lấy dữ liệu cảm biến gần đây nhất
 *     tags: [DataSensor]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataSensor'
 *       404:
 *         description: Không có dữ liệu
 */
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

/**
 * @swagger
 * /api/data-sensor/data-chart:
 *   get:
 *     summary: Lấy các dữ liệu cảm biến gần đây (giới hạn 8 bản ghi)
 *     tags: [DataSensor]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Số bản ghi cần lấy (mặc định là 8)
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataSensor'
 */
exports.getData = (req, res) => {
    // Nhận tham số limit từ query, nếu không có thì mặc định là 8
    const { limit = 8 } = req.query;

    // Chuyển giá trị limit thành số nguyên
    const limitValue = parseInt(limit, 10);

    // Tạo câu truy vấn SQL để lấy 8 giá trị cuối cùng (ORDER BY id DESC)
    let query = `SELECT id, nhiet_do, do_am, anh_sang, thoi_gian FROM DataSensor ORDER BY id DESC LIMIT ?`;

    // Thực hiện truy vấn
    connection.query(query, [limitValue], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }

        // Đảo ngược thứ tự kết quả để từ cũ đến mới (ngược với DESC)
        const adjustedResults = results.reverse().map(row => {
            // Chuyển đổi thời gian sang múi giờ địa phương
            const thoi_gian_local = new Date(row.thoi_gian).toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
            return { ...row, thoi_gian: thoi_gian_local };
        });

        // Trả về kết quả cho client
        res.json(adjustedResults);
    });
};
