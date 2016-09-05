var fs = require('fs');
var express = require('express');
var hbs = require('hbs');
var logger = require('morgan');
var app = express();

var cookieParser = require('cookie-parser');  //这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
var bodyParser = require('body-parser'); // node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set the view engine to use handlebars
app.set('view engine', 'html');// 指定模板文件的后缀名为html
app.engine('html', hbs.__express);// 运行hbs模块
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));//指定一个存放静态文件的目录。
// app.use(express.static('public'));



//添加common模板
hbs.registerPartial('common', fs.readFileSync(__dirname + '/views/common.html', 'utf8'));
hbs.registerPartials(__dirname + '/views/');



//应用路由
var routes = require('./router/router');
app.use('/', routes);



app.listen(80);

