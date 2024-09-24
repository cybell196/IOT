// src/routes/dataSensorRoutes.js
const express = require('express');
const router = express.Router();
const dataSensorController = require('../controllers/dataSensorController');

// Các route cho DataSensor
router.get('/', dataSensorController.getAllData);
router.get('/last-data', dataSensorController.getLastData);
router.get('/data-chart', dataSensorController.getData);
module.exports = router;
