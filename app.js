const createError = require('http-errors');
const express = require('express');
var exphbs  = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1']});




const indexRouter = require('./routes/index');
const doctorRouter = require('./routes/doctors');
const categoriesRouter = require('./routes/categories');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

client.execute("SELECT * FROM findadoc.categories")
    .then((result => {
        app.locals.categories = result.rows;
    })
    .catch(err => {
        res.status(404).send({msg: err})
    });


app.use('/', indexRouter);
app.use('/doctors', doctorRouter);
app.use('/categories', categoriesRouter);

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
