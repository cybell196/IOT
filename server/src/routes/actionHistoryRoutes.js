// src/routes/actionHistoryRoutes.js
const express = require('express');
const router = express.Router();
const actionHistoryController = require('../controllers/actionHistoryController');

/**
 * @swagger
 * tags:
 *   name: ActionHistory
 *   description: API liên quan đến lịch sử hành động
 */

/**
 * @swagger
 * /api/action-history:
 *   get:
 *     summary: Lấy tất cả lịch sử hành động
 *     tags: [ActionHistory]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActionHistory'
 *       500:
 *         description: Lỗi từ server
 */
router.get('/', actionHistoryController.getAllActions);
/**
 * @swagger
 * /api/action-history/{id}:
 *   get:
 *     summary: Lấy lịch sử hành động theo ID
 *     tags: [ActionHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của lịch sử hành động
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActionHistory'
 *       404:
 *         description: Không tìm thấy hành động
 *       500:
 *         description: Lỗi từ server
 */
router.get('/:id', actionHistoryController.getActionById);

module.exports = router;
