const express = require('express');

const analizeImage = require('./controllers/analizeImage');
const fileMiddleware = require('./fileMiddleware');

const router = express.Router();

router.post('/image', fileMiddleware, analizeImage);

module.exports = router;