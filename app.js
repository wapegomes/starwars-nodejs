var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var droids = require('./routes/droids');

var jwt = require('jwt-simple');
var secret = "m'RN}GSFS%Hg7S2o1D;6Y|1@:DnPwRkrN^m{Nc1l]9yFeQ4<}3tU[st21M(AU";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/droids', droids);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function isLoggedIn(req, res, next) {

  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  if(token) {
    try {
      var decoded = jwt.decode(token, secret);

      if(decoded.exp <= Date.now()) {
        return res.status(401).send({message:"Acesso expirado!"});
      }

      req.user = decoded.iss;
      return next();

    }catch(err) {
      return res.status(401).send({message:"Token invalido!"});
    }

  }
  else {
    return res.status(401).send({message:"Token invalido!"});
  }
}

app.listen(3004);

module.exports = app;
