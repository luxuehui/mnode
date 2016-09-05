define(function (require, exports, module) {
    var $ = require("$"),
        Tools = require('units').Tools,
        Widgets = require('widgets'),
        Scroll = Widgets.Scroll,
        ac = require('./actCommon');
    require("validate");

    var actBase = {};

    /**
     * 渲染整存宝公共数据
     * @param url  接口地址
     * @return planDetail 整存宝购买页面链接
     * period  锁定期
     * base 基本收益率
     * extra 额外收益率
     * extraBlock  额外收益模块
     */
    actBase.renderPlan = function(opt){
        var _me = this;
        this.opt = {
            period: $('.period'),
            base: $('.baseInterest'),
            extra: $('.extraInterest'),
            extraBlock: $('.extraBlock'),
            joinPlan:$('#joinPlan'),
            planDetail:'',
            defaultData:{
                base:7,
                extra:2,
                period:3
            },
            url:'/act/interest/isPlanRaiseInterest',
            clickJoin: function(){
            }
        };
        this.opt = $.extend(this.opt, opt);
        this.init = function(){
            if(this.opt.type !== 1){
                //默认值
                _me.opt.period.html(_me.opt.defaultData.period);
                _me.opt.base.html(_me.opt.defaultData.base);
                _me.opt.extra.html(_me.opt.defaultData.extra);
                _me.opt.extraBlock.show();
            } else {
                ac.request(this.opt.url, function (data) {
                    if(data.bean){
                        _me.opt.period.html(data.bean.period);
                        _me.opt.base.html(data.bean.minProfileRate);

                        if(data.bean.extraReward && data.bean.extraReward>0){
                            _me.opt.extra.html(data.bean.extraReward);
                            _me.opt.extraBlock.show();
                        }
                        _me.opt.planDetail = 'http://m.iqianjin.com/planplus/'+data.bean.id+'/'+data.bean.sid+'.html?referrer='+location.href;
                        _me.opt.joinPlan.data('href',_me.opt.planDetail);
                        _me.opt.clickJoin.call(_me);
                    } else {
                        //默认值
                        _me.opt.period.html(_me.opt.defaultData.period);
                        _me.opt.base.html(_me.opt.defaultData.base);
                        _me.opt.extra.html(_me.opt.defaultData.extra);
                        _me.opt.extraBlock.show();
                    }

                }, function () {
                });
            }
        };
        this.init();


    };

    /**
     * 滚动的列表
     * @param url
     * @param opt
     * opt.ele  传过来的对象前缀
     * 例如传来的是'all'-> all-list-none:内容为空的时候文案  all-wrap:最外层滚动的父元素  all-ul:滚动的ul的样式
     */
    actBase.scrollList = function(opt){
        var _me = this;
        this.opt = {
            url:'/act/exchange/allExchanges?act=205&prizeNo=49',
            ele:'all',
            emptyText:'暂无兑换记录',
            list:'voteExchangeRecordList',
            listFun: function(){
                return '<li><p class="list-p1">' + this.nickname + '</p><p class="list-p2">' + this.createTime + '</p><p class="list-p3">' + this.awardName + '</p></li>';
            },
            scrollNum: 5
        };
        this.opt = $.extend(this.opt, opt);

        this.init = function (){
            ac.request(this.opt.url, function (data) {
                var html = '<li class="'+ _me.opt.ele +'-list-none">'+ _me.opt.emptyText +'</li>',
                    list = data.bean[_me.opt.list],
                    length = list.length,
                    el = '.'+ _me.opt.ele +'-wrap';

                if (length > 0) {
                    html = list.map(function (v) {
                        return _me.opt.listFun.call(v);
                    }).join('');
                }

                $(el).html('<ul class="'+ _me.opt.ele +'-ul">' + html + '</ul>');

                //滚动
                if (length > _me.opt.scrollNum) {
                    var tmp = new Scroll({elem: el, line: 1, speed: 800, timer: 1000});
                }
            }, function () {
            });
        };
        this.init();
    };

    /**
     * 弹窗里面的基本文案
     * @returns {*}
     */
    actBase.redbagText = function(){
        if(Tools.hasUa('iqianjin')){
            return '【资产--红包】';
        } else {
            return '【我的账户--我的奖励】';
        }
    };
    /**=====================地址=======================**/
    actBase.address = function(opt){
        $.validator.addMethod('mobile', function (value, element) {
            return this.optional(element) || (/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/).test(value);
        }, '手机号码不符合规范，请重新输入');

        opt.ele.find('.award-text').html(opt.msg);
        opt.ele.find('input[name=awardId]').val(opt.lotteryId);
        opt.ele.find('#addressForm').validate({
            rules: {
                address: {
                    required: true,
                    maxlength: 50
                },
                sendUserName: {
                    required: true,
                    maxlength: 15
                },
                mobile: {
                    required: true,
                    mobile: true
                }
            },
            messages: {
                address: {
                    required: '邮寄地址不能为空',
                    maxlength: '邮寄地址不能超过50个字符'
                },
                sendUserName: {
                    required: '收货人不能为空',
                    maxlength: '收货人不能超过15个字符'
                },
                mobile: {
                    required: '手机号码不能为空'
                }
            },
            submitHandler: function (el) {
                opt.ele.find('.input-submit').val('提交中..').attr('disable');

                ac.request({
                    //url: '/act/address/submitSendAddress?act=204',
                    url: opt.sendAddress,
                    type: 'post',
                    data: $(el).serialize()
                }, function (data) {
                    opt.success.call(data);

                }, function () {
                    opt.fail.call();
                });
            }
        });

        ac.request({
            url: '/act/address/acquireSendAddress',
            type: 'post'
        }, function (data) {
            if (data.code !== 1) {
                return;
            }
            $('input[name="address"]').val(data.bean.address);
            $('input[name="sendUserName"]').val(data.bean.name);
            $('input[name="mobile"]').val(data.bean.mobile);
        });
    };


    module.exports = actBase;
});