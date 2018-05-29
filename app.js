var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const serialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

var index = require('./routes/index');
var users = require('./routes/users');


var http = require('http');

var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080);

var port = new serialPort("COM7");
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));


port.on('open', function(){
  console.log('Serial Port Opend');
  parser.on('data', function(data){
      //console.log("S: "+data);
      //emit
      io.emit('update', data.toString('utf8'));
  });
  port.on('error', function(err) {
    console.log('Error: ', err.message);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
