var express = require('express');
var router = express.Router();
var connection = require('../resources/connect');


var request = require('request');
// var j = request.jar();
// j.setCookie('a=b', 'http://httpbin.org');


router.get('/', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.render('index');
});


router.get('/node/20160801', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.render('20160801');
});



//返回接口
router.get('/json', function(req, res) {
    //mysql
    connection.query('SELECT * FROM pre_vote_award', function(err, rows, fields) {
        if (err) throw err;

        var out = "<ul>";

        for(var i=0, l=rows.length; i<l; i++) {
            out = out + "<li>" + rows[i] + "</li>";
        }

        out = out + "</ul>";
        res.locals = {
            some_value: 'foo bar',
            list: out
        };
        // console.log('The solution is: ', rows);
        console.log('********', res.locals);
        // res.render('index');
        res.send(rows[0]);
    });


});


router.get('/companyDetail', function(req, res) {

    // res.locals = {
    //     some_value: 'foo bar',
    //     list: ['cat', 'dog','test1']
    // };

    res.render('company');
});


var Urls = {

    getContinuousInvestInfo: 'http://m.iqianjin.com/act/continuous/getContinuousInvestInfo?act=',
    //设置消息提醒
    setMessageReminder: 'http://m.iqianjin.com/act/continuous/setMessageReminder?act=',
    //关闭消息提示
    closeMessageReminder: 'http://m.iqianjin.com/act/continuous/closeMessageReminder?act=',
    //获取设置消息日
    getDay: 'http://m.iqianjin.com/act/continuous/getDay?act=',

    act:'http://m.iqianjin.com/act/checked?act='
};


let pathApi = {

    getContinuousInvestInfo: '/act/continuous/getContinuousInvestInfo',
    //设置消息提醒
    setMessageReminder: '/act/continuous/setMessageReminder',
    //关闭消息提示
    closeMessageReminder: '/act/continuous/closeMessageReminder',
    //获取设置消息日
    getDay: '/act/continuous/getDay',

    act:'/act/checked'
};

/* GET home page. */
router.get('/node/act/checked', (req, res, next) =>{

    let actId = req.query.act;

    request(Urls.act+actId, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
            res.send(body);
        }
    })
});


router.get('/node'+pathApi.getContinuousInvestInfo, (req, res, next) =>{

    let actId = req.query.act;

    request(Urls.getContinuousInvestInfo+actId, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
            res.send(body);
        }
    })
});

router.get('/node'+pathApi.getDay,(req, res, next) =>{

    let actId = req.query.act;

    request(Urls.getDay+actId, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
            res.send(body);
        }
    })
});

router.get('/node'+pathApi.setMessageReminder, function(req, res, next) {

    let actId = req.query.act;

    request(Urls.setMessageReminder+actId, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
            res.send(body);
        }
    })
});

module.exports = router;