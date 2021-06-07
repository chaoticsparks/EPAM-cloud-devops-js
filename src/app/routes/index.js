const express = require('express');
const router = express.Router();

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
