const connection = require('../db'); // Đảm bảo đường dẫn đúng tới file db.js

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

/**
 * @swagger
 * /api/action-history/{id}:
 *   get:
 *     summary: Lấy hành động theo ID
 *     tags: [ActionHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của hành động
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActionHistory'
 *       404:
 *         description: Không tìm thấy hành động
 */
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
