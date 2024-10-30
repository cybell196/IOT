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
router.get('/count-alert-on', actionHistoryController.countAlertOn);


module.exports = router;
