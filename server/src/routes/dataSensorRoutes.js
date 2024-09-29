// src/routes/dataSensorRoutes.js
const express = require('express');
const router = express.Router();
const dataSensorController = require('../controllers/dataSensorController');

/**
 * @swagger
 * tags:
 *   name: DataSensor
 *   description: API liên quan đến dữ liệu cảm biến
 */

/**
 * @swagger
 * /api/data-sensor:
 *   get:
 *     summary: Lấy tất cả dữ liệu cảm biến
 *     tags: [DataSensor]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataSensor'
 *       500:
 *         description: Lỗi từ server
 */
router.get('/', dataSensorController.getAllData);
/**
 * @swagger
 * /api/data-sensor/last-data:
 *   get:
 *     summary: Lấy dữ liệu cảm biến gần nhất
 *     tags: [DataSensor]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataSensor'
 *       404:
 *         description: Không tìm thấy dữ liệu
 */
router.get('/last-data', dataSensorController.getLastData);
/**
 * @swagger
 * /api/data-sensor/data-chart:
 *   get:
 *     summary: Lấy dữ liệu cảm biến gần đây nhất (giới hạn số bản ghi)
 *     tags: [DataSensor]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Số lượng bản ghi cần lấy
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
router.get('/data-chart', dataSensorController.getData);
module.exports = router;
