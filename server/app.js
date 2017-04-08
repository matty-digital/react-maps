const express     = require('express');
const path        = require('path');
const bodyParser  = require('body-parser');
const cookieParser= require('cookie-parser');
const controllers = require('./controllers');
const cors        = require('cors');
const app         = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..')));

app.post('/api/create', controllers.createDo);

app.post('/api/login', controllers.loginDo);

app.post('/api/logout', controllers.logoutDo);

module.exports = app;
