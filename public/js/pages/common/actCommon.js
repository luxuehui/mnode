define(function (require) {
    var $ = require("$"),
        Tools = require('units').Tools;

    var hasIqjUa = Tools.hasUa('iqianjin'),
        hasWxUa = Tools.hasUa('MicroMessenger');



    (function () {
        var s = Tools.getParameterByName('utmSource');
        if (!s || !/^(\d|_){1,50}$/.test(s)) {
            return;
        }
        Tools.writeCookie('utm', s, 24 * 360, '/');
    })();

    return {
        //活动各状态回调
        status: function (opt) {
            var me = this;
            $.ajax({
                url: '/node/act/checked?act=' + opt.id,
                //url: '/act/mstatic/json/checked.json',
                cache: false,
                dataType: "json"
            }).done(function (data) {
                var code = data.code,
                    type;
                //未开始
                if (code === -30 || code === -33) {
                    opt.unstart && opt.unstart.call(me, data);
                    type = 'unstart';
                }
                //已结束
                else if (code === -31 || code === -32) {
                    opt.end && opt.end.call(me, data);
                    type = 'end';
                }
                //进行中
                else if (code === 1) {
                    opt.start && opt.start.call(me, data);
                    type = 'start';
                }

                //当前系统时间
                opt.timeCheck && opt.timeCheck.call(me, data, type);

            }).fail(function () {
                alert('网络连接失败');
            });
            return this;
        },
        //是否登录
        isLogin: function () {
            return !!Tools.readCookie('lp');
        },
        //新版或老版APP
        isApp: function () {
            return hasIqjUa || this.isOldApp();
        },
        //老版APP
        isOldApp: function () {
            return !hasIqjUa && Tools.readCookie('from') == 2;
        },

        //APP版本号 （新老版本支持的原生跳转不同）
        getAppVersion: function () {
            var appVersion = Tools.readCookie('h5app').split('|')[1];
            return appVersion ? appVersion + '' : '';
        },

        //APP中打印出href与UA
        debugApp: function (msg) {
            $('body').prepend('<p>' + location.href + '</p><p>' + navigator.userAgent + '</p><p>' + msg + '</p>');
        },
        //兼容APP的登录、投资跳转
        goTo: function (type, backUrl) {
            var url;
            switch (type) {
                case 'login':
                    url = '/user/login?referrer=' + location.href;
                    break;
                case 'reg':
                    url = '/user/register?referrer=' + location.href;
                    break;
                case 'plan':
                    url = '/plan/list';
                    break;
                case 'planDetail':
                    type = 'plan';
                    url = backUrl;
                    break;
                case 'demand':
                    url = '/demand/list';
                    break;
                case 'newList':
                    url = '/plan/list?referrer=' + location.href;
                    break;
                //实名认证
                case 'ID':
                    url = '/userInfo/bindId.jsp' + (backUrl ? '?referrer=' + backUrl : '');
                    break;
                //邮箱绑定
                case 'emailVerify':
                    url = '/userInfo/bindEmail.jsp' + (backUrl ? '?referrer=' + backUrl : '');
                    break;
                //资产
                case 'zc':
                //红包
                case 'redbag':
                    url = '/userCenter/index';
                    break;
                default :
                    break;
            }

            //APP
            if (hasIqjUa) {
                //4.8.0开始支持 邮箱绑定、红包
                if (type === 'emailVerify' || type === 'redbag') {
                    this.getAppVersion().replace(/\./g, '') >= 480 ? Tools.backApp(type) : location.href = url;
                } else {
                    Tools.backApp(type);
                }
            }
            //M站
            else {
                location.href = url;
            }
        },
        //微信分享
        share: function (shareData, timelineData) {
            if (!hasWxUa) {
                return;
            }
            require.async(location.protocol + "//www.iqianjin.com/wx.php?url=" + encodeURIComponent(location.href.split('#')[0]), function (wx) {
                try {
                    wx.ready(function () {
                        wx.onMenuShareAppMessage(shareData);
                        wx.onMenuShareTimeline(timelineData || shareData);
                        wx.onMenuShareQQ(shareData);
                        wx.onMenuShareWeibo(shareData);
                    });
                } catch (e) {
                    throw new Error('wx is not ready, error:' + e);
                }
            });
        },
        //ajax
        request: function (conf, done, fail) {
            if (typeof conf === 'string') {
                conf = {
                    url: conf
                }
            }
            var opt = $.extend({
                cache: false,
                dataType: "json"
            }, conf, {});
            $.ajax(opt).done(function (data) {
                done && done.call(this, data);
            }).fail(function () {
                fail && fail.call(this);
            });
        },
        //按钮点击监控
        postClick: function (actId, btnId) {
            this.request('/activity/recordButtonClick?act=' + actId + '&buttonId=' + btnId);
        },
        /**
         * rem布局
         * @param width 设计稿的宽度
         */
        px2rem: function (width, callback) {
            var scale = width / 100;
            document.documentElement.style.fontSize = window.innerWidth / scale + 'px';
            window.onresize = function () {
                document.documentElement.style.fontSize = window.innerWidth / scale + 'px';
            };
            callback && callback.call(this);
        }
    };

});