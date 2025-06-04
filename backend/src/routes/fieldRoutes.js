const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createField, getFields } = require('../controllers/fieldController');

router.post('/', auth, createField);
router.get('/', getFields);

module.exports = router;