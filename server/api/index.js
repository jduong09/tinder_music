const express = require('express');
const auth = require('./routes/auth');
const api = require('./routes/api');

const router = express.Router();

router.use('/auth', auth);
router.use('/api', api);

module.exports = router;