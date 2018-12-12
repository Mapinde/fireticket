const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');

mongoose.connect('mongodb://mapinde:Luc!fer1@ds139193.mlab.com:39193/fireticket', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage })

const indexRouter = require('./routes/index');
const eventsRouter = require('./routes/events');
const paymentsRouter = require('./routes/payments');
const promotersRouter = require('./routes/promoters');
const servicesRouter = require('./routes/services');

const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'Shit we did this',
    saveUninitialized: false,
    resave: false
}));
//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

// Connect-Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
    //res.locals.messages = require('express-messages')(req, res);
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', indexRouter);
app.use('/events', eventsRouter);
app.use('/payments', paymentsRouter);
app.use('/backend/promoters', promotersRouter);
app.use('/services', servicesRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
