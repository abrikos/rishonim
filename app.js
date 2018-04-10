const express = require('express'),
    path = require('path'),
	favicon = require('serve-favicon'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	app = express(),
	flash = require('connect-flash'),
	logger = require('morgan'),
	fs = require('fs'),
	fileUpload = require('express-fileupload'),
	mongoose = require('./libs/mongoose');

	app.locals.CONFIG = require('./libs/config');
	app.locals.path = path;



app.locals.session = session({
	key:'sesscookiename',
	secret: 'keyboard sadasd323',
	resave: false,
	cookie:{_expires : 60000000},
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
});


app.use(app.locals.session);
app.use(fileUpload());
app.use(flash());
app.use(logger('dev'));
app.use(function (req, res, next) {
	res.locals.alertMessages = require('express-messages')(req, res);
	res.locals.currentUrl =req.url;
	res.locals.currentSite =req.protocol + '://' + req.headers.host;
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*
app.use(csrf());
csrfProtection = csrf({ cookie: false })
app.use(function (req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	res.locals.csrftoken = req.csrfToken();
	next();
});
*/


fs.readdirSync(__dirname + '/controllers').forEach(function (file) {
	if(file.substr(-3) == '.js') {
		let route = require(__dirname + '/controllers/' + file);
		route.controller(app);
	}
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
