const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/ping', function (req, res, next) {
    res.json({
        statusCode: 200,
        message: 'OK',
        time: {
            serverTime: new Date(),
        },
    });
});

module.exports = router;
