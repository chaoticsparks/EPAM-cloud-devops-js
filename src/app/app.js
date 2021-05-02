const express = require('express');
const bodyParser = require('body-parser');

const indexRouter = require('./routes');
const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
