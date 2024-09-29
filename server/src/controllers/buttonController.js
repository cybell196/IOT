const connection = require('../db'); // Import kết nối MySQL từ db.js
/**
 * @swagger
 * components:
 *   schemas:
 *     ButtonState:
 *       type: object
 *       properties:
 *         button1Active:
 *           type: boolean
 *           description: Trạng thái của button 1
 *         button2Active:
 *           type: boolean
 *           description: Trạng thái của button 2
 *         button3Active:
 *           type: boolean
 *           description: Trạng thái của button 3
 */

/**
 * @swagger
 * /api/button-state:
 *   get:
 *     summary: Lấy trạng thái của tất cả các button
 *     tags: [ButtonState]
 *     responses:
 *       200:
 *         description: Trạng thái button
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ButtonState'
 *       500:
 *         description: Lỗi từ server
 */

const getButtonState = (req, res) => {
    const query = 'SELECT button1_active, button2_active, button3_active FROM button_state WHERE id = 1';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi lấy trạng thái button từ database' });
        }
        if (results.length > 0) {
            res.json({
                button1Active: results[0].button1_active,
                button2Active: results[0].button2_active,
                button3Active: results[0].button3_active,
            });
        } else {
            res.json({
                button1Active: false,
                button2Active: false,
                button3Active: false
            });
        }
    });
};

/**
 * @swagger
 * /api/button-state:
 *   post:
 *     summary: Cập nhật trạng thái của các button
 *     tags: [ButtonState]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ButtonState'
 *     responses:
 *       200:
 *         description: Trạng thái button đã được cập nhật thành công
 *       500:
 *         description: Lỗi từ server
 */
const updateButtonState = (req, res) => {
    const { button1Active, button2Active, button3Active } = req.body;
    
    let query = 'UPDATE button_state SET ';
    let params = [];
    
    if (button1Active !== undefined) {
        query += 'button1_active = ? ';
        params.push(button1Active);
    }
    if (button2Active !== undefined) {
        query += button1Active !== undefined ? ', button2_active = ? ' : 'button2_active = ? ';
        params.push(button2Active);
    }
    if (button3Active !== undefined) {
        query += (button1Active !== undefined || button2Active !== undefined) ? ', button3_active = ? ' : 'button3_active = ? ';
        params.push(button3Active);
    }
    
    query += 'WHERE id = 1';

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi lưu trạng thái button vào database' });
        }
        res.json({ message: 'Trạng thái button đã được lưu thành công!' });
    });
};

module.exports = {
    getButtonState,
    updateButtonState
};
