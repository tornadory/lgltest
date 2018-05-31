/**
 * 简繁体模块化方案
 */
LBF.define('qd/js/component/chinese.cafe9.js', function(require, exports, module) {
    var
        Node = require('ui.Nodes.Node'),
        ZhData=require('qd/js/component/zh.8c735.js'),
        Cookie = require('util.Cookie');
    /**
     * 简体字
     */
    var S = ZhData.S;

    /**
     * 繁体字
     */
    var T = ZhData.T;

    /**
     * 转换文本
     * @param {String} str - 待转换的文本
     * @param {Boolean} toT - 是否转换成繁体
     * @returns {String} - 转换结果
     */
    function tranStr(str, toT) {
        var i;
        var letter;
        var code;
        var isChinese;
        var index;
        var src, des;
        var result = '';

        if (toT) {
            src = S;
            des = T;
        } else {
            src = T;
            des = S;
        }

        if (typeof str !== "string") {
            return str;
        }

        for (i = 0; i < str.length; i++) {
            letter = str.charAt(i);
            code = str.charCodeAt(i);
            // 根据字符的Unicode判断是否为汉字，以提高性能
            isChinese = (code > 0x3400 && code < 0x9FC3) || (code > 0xF900 && code < 0xFA6A);

            if (!isChinese) {
                result += letter;
                continue;
            }

            index = src.indexOf(letter);

            if (index !== -1) {
                result += des.charAt(index);
            } else {
                result += letter;
            }
        }

        return result;
    }

    /**
     * 转换HTML Element属性
     * @param {Element} element - 待转换的HTML Element节点
     * @param {String|Array} attr - 待转换的属性/属性列表
     * @param {Boolean} toT - 是否转换成繁体
     */
    function tranAttr(element, attr, toT) {
        // console.log(element);
        var i, attrValue;

        if (attr instanceof Array) {
            for (i = 0; i < attr.length; i++) {
                tranAttr(element, attr[i], toT);
            }
        } else {
            attrValue = element.getAttribute(attr);

            if (attrValue !== "" && attrValue !== null) {
                element.setAttribute(attr, tranStr(attrValue, toT));
            }
        }
    }

    /**
     * 转换HTML Element节点
     * @param {Element} element - 待转换的HTML Element节点
     * @param {Boolean} toT - 是否转换成繁体
     */
    function tranElement(element, toT) {
        var i;
        var childNodes;

        if (element.nodeType !== 1) {
            return;
        }

        childNodes = element.childNodes;

        for (i = 0; i < childNodes.length; i++) {
            var childNode = childNodes.item(i);

            // 若为HTML Element节点
            if (childNode.nodeType === 1) {
                // 对以下标签不做处理
                if ("|BR|HR|TEXTAREA|SCRIPT|OBJECT|EMBED|".indexOf("|" + childNode.tagName + "|") !== -1) {
                    continue;
                }

                tranAttr(childNode, ['title', 'data-original-title', 'alt', 'placeholder','value'], toT);

                // input 标签
                // 对text类型的input输入框不做处理
                if (childNode.tagName === "INPUT" && childNode.value !== "" && childNode.type !== "text" && childNode.type !== "hidden") {
                    childNode.value = tranStr(childNode.value, toT);
                }

                // 继续递归调用
                tranElement(childNode, toT);
            } else if (childNode.nodeType === 3) { // 若为文本节点
                childNode.data = tranStr(childNode.data, toT);
            }
        }
    }

    /**
     * 处理简繁体转换
     * @type {Object}
     */
    var S2TChinese = {
        switchEl: '#switchEl',
        init: function() {
            this.langSwitch();
            this.checkLangCookie();
        },
        langSwitch: function() {
            //`console.log(this.switchEl);
            $(this.switchEl).on('click', function() {
                //console.log('切换简繁体');
                /*if (!!Cookie.get('lang') && Cookie.get('lang') == 'zht') {
                    Cookie.set('lang', 'zhs', 'qidian.com', '', 86400000);
                    $('#switchEl').html('繁体');
                    S2TChinese.trans2Simple('html');

                } else {
                    Cookie.set('lang', 'zht', 'qidian.com', '', 86400000);
                    $('#switchEl').html('简体');
                    S2TChinese.trans2Tradition('html');

                }*/
            })
        },
        /**
         * 检查是否有繁体Cookie
         * @return {[type]} [description]
         */
        checkLangCookie: function() {
            /*if (!!Cookie.get('lang') && Cookie.get('lang') == 'zht') {
                $('#switchEl').html('简体');
                S2TChinese.trans2Tradition();
            }*/
        },

        //繁体转换dom
        trans2Tradition: function(el) {
            var el = !!el ? el : 'html';
            //console.log('切换到繁体');
            $(el).s2t();
        },
        //简体转换dom
        trans2Simple: function(el) {
            var el = !!el ? el : 'html';
            //console.log('切换回简体');
            $(el).t2s();
        },
        //转换字符串，并非操作dom
        s2tString:function(string){
            if(!!Cookie.get('lang') && Cookie.get('lang') == 'zht'){
                 return tranStr(string,true)
             }else{
                return string;
             }
        }
    }

    // 扩展jQuery对象方法
    $.fn.extend({
        /**
         * jQuery Objects简转繁
         * @this {jQuery Objects} 待转换的jQuery Objects
         */
        s2t: function() {
            return this.each(function() {
                tranElement(this, true);
            });
        },

        /**
         * jQuery Objects繁转简
         * @this {jQuery Objects} 待转换的jQuery Objects
         */
        t2s: function() {
            return this.each(function() {
                tranElement(this, false);
            });
        }
    });



    S2TChinese.init();

    return S2TChinese;

});
