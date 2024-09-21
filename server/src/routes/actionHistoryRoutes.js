// src/routes/actionHistoryRoutes.js
const express = require('express');
const router = express.Router();
const actionHistoryController = require('../controllers/actionHistoryController');

// Các route cho ActionHistory
router.get('/', actionHistoryController.getAllActions);
router.get('/:id', actionHistoryController.getActionById);

module.exports = router;
