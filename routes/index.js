const express = require('express')

const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/group', require('./group'));

module.exports = router;