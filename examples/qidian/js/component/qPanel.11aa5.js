/**
 * @fileOverview
 * @author amoschen
 * @version 1
 * Created: 12-11-13 涓嬪崍5:35
 */
LBF.define('qd/js/component/qPanel.11aa5.js', function(require){
    var
        Node = require('ui.Nodes.Node'),
        Panel = require('ui.widget.Panel.Panel'),
        extend = require('lang.extend'),
        Cookie = require('util.Cookie');

    var qPanel = Panel.inherit({
        /**
         * 蹇嵎璁块棶锛宼his.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {
            $header: '.lbf-panel-head',
            $content: '.lbf-panel-body',
            $footer: '.lbf-panel-foot',
            $buttonBox: '.lbf-panel-foot-r',
            $footerMsg: '.lbf-panel-foot-l',
            $closeButton: '.lbf-panel-close'
        },
        render:function(){
            var that = this;
            var argumentsList = arguments;
            require.async('qd/js/component/chinese.cafe9.js', function (S2TChinese) {
                Panel.prototype.render.apply(that, argumentsList);
                //如果是繁体
                if(Cookie.get('lang') == 'zht'){
                    S2TChinese.trans2Tradition('.lbf-panel');
                }else{
                    S2TChinese.trans2Simple('.lbf-panel');
                }
            });
        },
        setContent:function(template){
            var that = this;
            var argumentsList = arguments;
            require.async('qd/js/component/chinese.cafe9.js', function (S2TChinese) {
                Panel.prototype.setContent.apply(that, argumentsList);
                //如果是繁体
                if(Cookie.get('lang') == 'zht'){
                    S2TChinese.trans2Tradition('.lbf-panel');
                }else{
                    S2TChinese.trans2Simple('.lbf-panel');
                }
            });
        }
    });

    qPanel.include({
        settings: extend(true, {}, Panel.settings)
    });

    return qPanel;
});