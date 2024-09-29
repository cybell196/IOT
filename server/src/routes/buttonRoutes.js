const express = require('express');
const { getButtonState, updateButtonState } = require('../controllers/buttonController');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: ButtonState
 *   description: API liên quan đến trạng thái của các button
 */

/**
 * @swagger
 * /api/button-state:
 *   get:
 *     summary: Lấy trạng thái của tất cả các button
 *     tags: [ButtonState]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ButtonState'
 *       500:
 *         description: Lỗi từ server
 */

router.get('/button-state', getButtonState);

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
router.post('/button-state', updateButtonState);

module.exports = router;
