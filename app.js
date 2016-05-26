var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

//var settings = require('./settings');

var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

var flash = require('connect-flash');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('view options', {
  layout: false
});

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'hxy',
    name: 'hxy',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1*60*60*1000 },  //设置maxAge是1小时，即1h后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

routes(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});