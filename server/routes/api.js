var express = require('express');
var router = express.Router();
var ctrlData = require('../controllers/data.controllers');

router
    .route('/processData')
    .post(ctrlData.processData)

module.exports = router;