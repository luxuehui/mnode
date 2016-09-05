define(function (require) {
    var $ = require('$'),
        Dialog = require('dialog'),
        Units = require("units"),
        Tools = Units.Tools,
        ac = require('./actCommon');

    //整存宝+
    (function () {
        var _page = $('#plan-success-page');
        if (!_page.length) {
            return;
        }

        var amount = Tools.getParameterByName('amount'),
            goldCount = Tools.getParameterByName('goldCount'),
            planId = _page.data("id"),
            planSid = _page.data("sid");


        //===========20160601大转盘活动
        var dialog0601 = Dialog({
            id: "spring",
            closePhpSite: 'phptag_m_planSuccess_20160601_close',
            title: "提示",
            width: 240,
            skin: 'ui-dialog-new',
            content: '您已成功投资' + amount + '元，获得' + goldCount + '次抽奖机会。<br/>' +
            '快去参加幸运大转盘活动，赢取iPhone 6S，好礼抽不停！还能领取长达30天的零存宝3%加息券哦！',
            button: [
                {
                    value: '继续投资',
                    className: 'ui-button-ok',
                    phpSite: 'phptag_m_planSuccess_20160601_join',
                    callback: function () {
                        location.href = "/planplus/" + planId + "/" + planSid + ".html";
                    }
                },
                {
                    value: '查看活动',
                    className: 'ui-button-ok',
                    phpSite: 'phptag_m_planSuccess_20160601_look',
                    callback: function () {
                        location.href = '/act/20160601/index.jsp';
                    }
                }
            ]
        });

        ac.status({
            id: '200',
            timeCheck: function (data, type) {
                if (type === 'start') {
                    dialog0601.showModal();
                }
            }
        });
    })();


    //零存宝
    (function () {
        if (!$('#demand-success-page').length) {
            return;
        }

        var amount = $('body').data('amount');

        //dialog runs here

        //===========20160601大转盘活动
        var dialog0601 = Dialog({
            id: "spring",
            closePhpSite: 'phptag_m_demandSuccess_20160601_close',
            title: "提示",
            width: 240,
            skin: 'ui-dialog-new',
            content: '您已成功投资' + amount + '元。<br/>' +
            '6月小爱送惊喜，零存宝3%加息券等你领，超长加息30天。还有幸运大抽奖活动，100%中奖，赢取iPhone 6S等缤纷好礼。',
            button: [
                {
                    value: '继续投资',
                    className: 'ui-button-ok',
                    phpSite: 'phptag_m_demandSuccess_20160601_join',
                    callback: function () {
                        ac.goTo('demand');
                    }
                },
                {
                    value: '查看活动',
                    className: 'ui-button-ok',
                    phpSite: 'phptag_m_demandSuccess_20160601_look',
                    callback: function () {
                        location.href = '/act/20160601/index.jsp';
                    }
                }
            ]
        });

        ac.status({
            id: '200',
            timeCheck: function (data, type) {
                if (type === 'start') {
                    dialog0601.showModal();
                }
            }
        });


    })();


    //爱月投
    (function () {
        if (!$('#regular-success-page').length) {
            return;
        }

    })();

});