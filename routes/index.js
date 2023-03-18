const express = require('express')

const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/group', require('./group'));
router.use('/my', require('./my'));

module.exports = router;