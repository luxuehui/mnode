define(function (require) {
    var $ = require("$"),
        Tools = require('units').Tools,
        Widgets = require('widgets'),
        Dialog = Widgets.Dialog,
        ac = require('../common/actCommon');
    
    var $redbagItem03=$('.redbag-item03'),
        $moneybagItem01=$('.money-bag-item01'),
        $moneybagItem02=$('.money-bag-item02'),
        $moneybagItem03=$('.money-bag-item03'),
        $onemonth=$('#onemonth'),
        $twomonth=$('#twomonth'),
        $threemonth=$('#threemonth'),
        $investAmount=$('.investAmount-wrap'),
        $redbagAmount=$('.redbagAmount-wrap'),
        $setday=$('#setday'),
        $tipBtn=$('.invset-tip-btn');

    var gameText={
        redMonth01:function(){
            $moneybagItem01.html('<i class="money5-red"></i>');
            $('.point01').addClass('point-red');
            $onemonth.removeClass('redbag-amount-box-gray').find('.redbag-item01').html('<i class="month1-red"></i>');
            $onemonth.find('.redbag-item03').html('<span class="sp02">红包已发放</span><span class="go-check">去查看</span>');
            $('.money-month-item01').addClass('font-red');

        },
        redMonth02:function(){
            $moneybagItem02.html('<i class="money10-red"></i>');
            $('.point02').addClass('point-red');
            $('.line01').addClass('line-red');
            $twomonth.removeClass('redbag-amount-box-gray').find('.redbag-item01').html('<i class="month2-red"></i>');
            $twomonth.find('.redbag-item03').html('<span class="sp02">红包已发放</span><span class="go-check">去查看</span>');
            $('.money-month-item02').addClass('font-red');
        },
        redMonth03:function(redBagmoney){
            $moneybagItem03.html('<i class="money100-red"><span>'+redBagmoney+'</span>元</i>');
            $('.point03').addClass('point-red');
            $('.line02').addClass('line-red');
            $threemonth.removeClass('redbag-amount-box-gray').find('.redbag-item01').html('<i class="month3-red"></i>');
            $threemonth.find('.redbag-item03').html('<span class="sp02">红包已发放</span><span class="go-check">去查看</span>');
            $('.money-month-item03').addClass('font-red');
        },
        redMonthlast:function(){
            $moneybagItem03.html('<i class="money100-wen"></i>');
            $('.point03').addClass('point-red');
            $('.line02').addClass('line-red');
            $threemonth.removeClass('redbag-amount-box-gray').find('.redbag-item01').html('<i class="month3-red"></i>');
            $threemonth.find('.redbag-item03').html('<span class="sp03-2">红包未发放</span>');
            $('.money-month-item03').addClass('font-red');
        },

        grayMonth01:function(){
            $moneybagItem01.html('<i class="money5"></i>');
            $onemonth.addClass('redbag-amount-box-gray').find('.redbag-item01').html('<i class="month1-gray"></i>');
            $onemonth.next('.box-line').find('.line-item').addClass('line-time-gray');
            $onemonth.find('.redbag-item03').html('<span class="sp03">未投资</span>');
        },
        grayMonth02:function(){
            $moneybagItem02.html('<i class="money10"></i>');
            $twomonth.addClass('redbag-amount-box-gray').find('.redbag-item01').html('<i class="month2-gray"></i>');
            $twomonth.next('.box-line').find('.line-item').addClass('line-time-gray');
            $twomonth.find('.redbag-item03').html('<span class="sp03">未投资</span>');
        },
        grayMonth03:function(){
            $moneybagItem03.html('<i class="money100"></i>');
            $threemonth.addClass('redbag-amount-box-gray').find('.redbag-item01').html('<i class="month3-gray"></i>');
            $threemonth.next('.box-line').find('.line-item').addClass('line-time-gray');
            $threemonth.find('.redbag-item03').html('<span class="sp03">未投资</span>');
        }
    };
    // var Urls = {
    //
    //     getContinuousInvestInfo: '/node/act/continuous/getContinuousInvestInfo?act=206',
    //     //设置消息提醒
    //     setMessageReminder: '/node/act/continuous/setMessageReminder?act=206&day=',
    //     //关闭消息提示
    //     closeMessageReminder: '/node/act/continuous/closeMessageReminder?act=206',
    //     //获取设置消息日
    //     getDay: '/node/act/continuous/getDay?act=206'
    // };

    var Urls = {

        getContinuousInvestInfo: 'http://m.iqianjin.com/act/continuous/getContinuousInvestInfo?act=206',
        //设置消息提醒
        setMessageReminder: 'http://m.iqianjin.com/act/continuous/setMessageReminder?act=206',
        //关闭消息提示
        closeMessageReminder: 'http://m.iqianjin.com/act/continuous/closeMessageReminder?act=206&day=',
        //获取设置消息日
        getDay: 'http://m.iqianjin.com/act/continuous/getDay?act=206',

        act:'http://m.iqianjin.com/act/checked?act=206'
    };


    //获取当前月份 决定显示的日期
    function addCopyTxt(){
        var html = '',tmp = 30;
        var date = new Date;
        var month = date.getMonth()+2;
        if(month === 8 || month === 10 || month === 12){
            tmp = 31;
        }
        for(var i=1; i<=tmp ; i++){
            html += '<li class="calendar-li"><span class="calendar-li-span" data-day='+i+'>'+i+'</span></li>';
        }
        $('#calendarUl').html(html);
    }

    Tools.loginApp(function(){
        if(ac.isLogin()){
            var userName= Tools.userName();
            $('.invest-amount').addClass('login-bg');
            $('.login-area').html('欢迎您 ,'+userName);
            getContinuousInvestInfo();

        }else{
            var loginHtml='<a href="javascript:void(0);" class="login-btn toLogin">登录</a>';
            $investAmount.html(loginHtml);
            $redbagAmount.html(loginHtml);
            gameText.grayMonth01();
            gameText.grayMonth02();
            gameText.grayMonth03();
            $moneybagItem01.html('<i class="money5 rubberBand"></i><span class="light-rotate"></span>');
            $('.toLogin').on('click', function(){
                ac.goTo('login');
            });
            $tipBtn.on('click', function(){
                ac.goTo('login');
            });

        }

        ac.status({
            id:'206',
            timeCheck:function(data,type){
                if(type==='end'){
                    $tipBtn.addClass('disable').unbind( "click" );
                }
            }
        });
    });


    function getContinuousInvestInfo(){
        ac.request(Urls.getContinuousInvestInfo,function(data){
                if (data.code !== 1) {
                    return;
                }

            /*
             获取用户连投信息
             firstAmount (number, optional): 第一个月累计投资金额 ,
             investAmount (number, optional): 总累计投资金额 ,
             redbagAmount (number, optional): 已获得红包金额 ,
             secondAmount (number, optional): 第二个月累计投资金额 ,
             step (integer, optional): 连投了几个月, 0到3,
             sendThridRedbag (boolean, optional):第三个月的红包是否已发放
             */

                $investAmount.html('<span id="investAmount" class="font48">'+Tools.commaInteger(data.investAmount)+'</span>');
                $redbagAmount.html('<span id="redbagAmount" class="font48">'+data.redbagAmount+'</span>');
                $('#firstAmount').html(Tools.commaInteger(data.firstAmount));
                $('#secondAmount').html(Tools.commaInteger(data.secondAmount));
                $('#thirdAmount').html(Tools.commaInteger(data.thirdAmount));
                $('.go-invest-btn').on('click',function(){
                    ac.goTo('plan');
                });
               if(data.step===0){
                   gameText.grayMonth01();
                   gameText.grayMonth02();
                   gameText.grayMonth03();
                   $moneybagItem01.html('<i class="money5 rubberBand"></i><span class="light-rotate"></span>');

               }else if(data.step===1){
                   gameText.redMonth01();
                   gameText.grayMonth02();
                   gameText.grayMonth03();
                   $moneybagItem02.html('<i class="money10 rubberBand"></i><span class="light-rotate po-left"></span>');
               }else if(data.step===2){
                   gameText.redMonth01();
                   gameText.redMonth02();
                   gameText.grayMonth03();
                   $moneybagItem03.html('<i class="money100 rubberBand"></i><span class="light-rotate02"></span>');
               }else if(data.step===3) {

                   gameText.redMonth01();
                   gameText.redMonth02();
                   if(data.sendThridRedbag){
                       gameText.redMonth03(data.redbagAmount-15);

                   }else{
                       gameText.redMonthlast();
                   }

               }
            $redbagItem03.on('click','.go-check',function(){
                ac.goTo('zc');
            });


        });
        getClickValue();
        getMessage();

    }



    //设置投资提醒按钮点击方法
    function getClickValue(){
        $tipBtn.on('click',function(){
            var clickValue= $(this).data('click');
            if(clickValue==='0'){
                setMessage();
            }else if(clickValue==='1'){
                closeMessage();
            }
        });

    }

    //设置消息提醒
    function setMessage(){
        addCopyTxt();
        Dialog({
            title: '',
            skin:'dialog-skin-base ui-day',
            content: $('.calendar').html(),
            okValue: '确认',
            cancelValue: '关闭',
            ok: function () {
                var _this=this;
                var currentDay=$('.calendar-li.current').find('.calendar-li-span').data('day');
                if(currentDay){
                    $.ajax({
                        tpye:'GET',
                        dataType:'json',
                        url:Urls.setMessageReminder+currentDay,
                        success:function(data){
                            investBtnChangeColor.call(data);
                            getMessage();
                            _this.hide();
                        }

                    })

                }else{

                    _this.hide();
                }
            },
            cancel:function () {
                this.hide();
            },
            onShow: function () {
                $('.calendar-li').on('click',function(){
                    $(this).addClass('current').siblings().removeClass('current');

                });
            }
        }).show();

        function investBtnChangeColor(){

            if(this.code === 1){
                $tipBtn.data('click','1').addClass('ison');
            }


        }

    }
    //获取消息提醒日期
    function getMessage(){
        ac.request(Urls.getDay,function(data){
            if (data.code !== 1) {
                return;
            }

            if(!data.day){
                $setday.html('');
                $tipBtn.data('click','0').removeClass('ison');

            }else{
                $setday.html('：每月'+data.day+'日');
                $tipBtn.data('click','1').addClass('ison');

            }

        })
    }
    //关闭消息提醒
    function closeMessage(){
        ac.request(Urls.closeMessageReminder,function(data){
            if (data.code !== 1) {
                return;
            }
            $setday.html('');
            $tipBtn.data('click','0').removeClass('ison');

        })

    }
    ac.share({
        title: '收益“升值记”等你来翻倍',
        desc: '连续每月投资领现金红包奖励',
        link: 'http://m.iqianjin.com/act/20160801/index.jsp',
        imgUrl: 'http://images.iqianjin.com/act/mimages/20160801/share.jpg'
    });
});