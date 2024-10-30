const connection = require('../db'); // Đảm bảo đường dẫn đúng tới file db.js
const moment = require('moment');

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của hành động
 *         thiet_bi:
 *           type: string
 *           description: Tên thiết bị
 *         hanh_dong:
 *           type: string
 *           description: Hành động được thực hiện
 *         thoi_gian:
 *           type: string
 *           format: date-time
 *           description: Thời gian hành động được thực hiện
 */

/**
 * @swagger
 * /api/action-history:
 *   get:
 *     summary: Lấy tất cả lịch sử hành động
 *     tags: [ActionHistory]
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
 *         description: "Thứ tự sắp xếp (ASC/DESC)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Giới hạn số lượng bản ghi
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Điều kiện lọc dữ liệu
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActionHistory'
 */
exports.getAllActions = (req, res) => {
    const { sortBy = 'thoi_gian', order = 'ASC', limit, filter } = req.query;
    
    // Câu lệnh SQL cơ bản
    let query = 'SELECT id, thiet_bi, hanh_dong, thoi_gian FROM ActionHistory';
    
    // Xử lý lọc dữ liệu nếu có filter
    if (filter) { 
        // Chuyển đổi filter thành định dạng ngày tháng MySQL có thể hiểu
        const formattedFilter = `%${filter}%`;

        query += ` WHERE DATE_FORMAT(thoi_gian, '%d/%m/%Y, %H:%i:%s') LIKE '${formattedFilter}'`;
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
        console.log(query);
        res.json(adjustedResults);
    });
};




// exports.getTodaysActionsCount = (req, res) => {
//     const today = moment().format('YYYY-MM-DD');
//     const query = `
//         SELECT 
//             SUM(CASE WHEN hanh_dong = 'Bật' THEN 1 ELSE 0 END) AS totalOn,
//             SUM(CASE WHEN hanh_dong = 'Tắt' THEN 1 ELSE 0 END) AS totalOff
//         FROM actionhistory
//         WHERE DATE(thoi_gian) = ?
//     `;

//     connection.query(query, [today], (error, results) => {
//         if (error) {
//             console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
//             return res.status(500).json({ error: 'Lỗi server' });
//         }

//         // Kiểm tra kết quả truy vấn
//         console.log('Kết quả truy vấn:', results);

//         // Nếu không có kết quả, trả về lỗi
//         if (!results || results.length === 0) {
//             return res.status(404).json({ error: 'Dữ liệu không tìm thấy' });
//         }

//         const totalOn = results[0].totalOn;
//         const totalOff = results[0].totalOff;

//         // Kiểm tra xem có giá trị không
//         if (totalOn === null && totalOff === null) {
//             return res.status(404).json({ error: 'Dữ liệu không tìm thấy' });
//         }

//         res.json({ totalOn, totalOff, today });
//     });
// };


/**
 * @swagger
 * /api/action-history/count-alert-on:
 *   get:
 *     summary: Đếm số lần thiết bị "Cảnh báo" có hành động là "Bật"
 *     tags: [ActionHistory]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Số lần thiết bị "Cảnh báo" có hành động là "Bật"
 */
exports.countAlertOn = (req, res) => {
    const query = `
  SELECT COUNT(*) as count 
  FROM ActionHistory 
  WHERE thiet_bi = "Cảnh báo" 
    AND hanh_dong = "Bật" 
    AND DATE(thoi_gian) = CURDATE()
`; 

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }

        res.json(results[0]);
    });
};