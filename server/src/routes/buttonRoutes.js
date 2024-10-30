const express = require('express');
const { getButtonState, updateButtonState } = require('../controllers/buttonController');

const router = express.Router();

router.get('/button-state', getButtonState);

router.post('/button-state', updateButtonState);

module.exports = router;
