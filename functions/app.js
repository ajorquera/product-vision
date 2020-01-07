const express = require('express');  
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');

const app = express();               

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: true}));

app.use(router);

module.exports = app;