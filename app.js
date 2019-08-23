
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
require('./models/User')

const authRouter = require('./routes/authRouter');
const { checkRemainsCookies, sessionChecker, notFoundRoute, errorHandler } = require('./middlewares')
const{ mongoURI,cookieKey} = require('./config/keys')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'user_sid',
  secret: cookieKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));
// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use(checkRemainsCookies);

// route for Home-Page
app.get('/', sessionChecker, (req, res, next) => {
  res.render('resource', { user: req.session.user, redirect: 'logout' });
});
// auth routes
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(notFoundRoute);

// error handler
app.use(errorHandler);

module.exports = app;
