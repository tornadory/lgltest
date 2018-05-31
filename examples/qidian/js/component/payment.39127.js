/**
 * @fileOverview
 * @author  yangye
 * Created: 2016-7-5
 */
LBF.define('qd/js/book_details/payment.39127.js', function (require, exports, module) {
    var
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('qd/js/component/ajaxSetting.84b88.js'),
        Checkbox = require('ui.Nodes.Checkbox'),
        Cookie = require('util.Cookie'),
        EJS = require('util.EJS'),
        Panel = require('qd/js/component/qPanel.11aa5.js'),
        LightTip = require('ui.widget.LightTip.LightTip'),  
        Loading = require('qd/js/component/loading.aa676.js');

    exports = module.exports = Node.inherit({
        /**
         * Default UI proxy Element
         * @protected
         */
        el: 'body',
        /**
         * Default UI events
         * @property events
         * @type Object
         * @protected
         */
        events: {
            'click .j_refresh_price':'refreshPrice',
            //'click .close':'closeAlert',
            'click .agree-rules':'clickOnAgreeRules',
            'click #payMode a':'changePayTab',
            'click .j_getCode':'getValidateCode',
            'click .j_verify':'goCheckCode',
            'keyup #code-from-user':'updateInputStyle',
            'click .lbf-icon-close':'closeAndStop',
            'click .j_goSecurcenter':'goToSecurCenter',
            'click .j_catch_trouble':'closeAndStop'
        },

        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {

        },

        /**
         * Render node
         * Most node needs overwritten this method for own logic
         * @method render
         * @chainable
         */
        render: function () {

            // 设置UI Node proxy对象，chainable method，勿删
            this.setElement(this.el);

            // 页面逻辑入口
            this.init();

            // 返回组件
            return this;

        },
        /**
         * 页面逻辑入口
         */
        init: function () {
            var that = this;
            //上报系统
            //report.send();
            this.currentUrl = location.href;

            //实例化loading.js
            this.loading = new Loading({});
        },

        /**
         * 获取订阅价格及余额
         * @method getBalance
         * @param requiredData 后端需要的数据
         * @param successCallback 成功回调
         */
        getBalance:function(requiredData,successCallback){
            var that = this;
            $.ajax({
                type:'POST',
                url:'/ajax/subscribe/getSubscribe?_csrfToken='+Cookie.get('_csrfToken') || '',
                contentType:'application/json',
                data:JSON.stringify(requiredData),
                success:function(response){
                    //获取余额成功
                    if(response.code === 0){
                        successCallback(that,response.data, requiredData);
                        //只有在确认得到了新的价格时才重置
                        that.currentDealData = {};
                        that.currentDealData._currentBalance = response.data.balance;
                        that.currentDealData._currentPrice = response.data.subPrice;
                        //判断余额是否充足【此时先用前端计算的总价，方便后边动态更新】
                    }else{
                        that.newPopup(that.subscribePopup(9,{msg:response.msg}));
                    }
                }
            });
        },

        /**
         * 判断余额是否充足
         * @method compareBalance
         * @param that 当前父函数作用域
         * @param balance 账户余额
         * @param requiredData 前端发送的数据
         * @param serverPrice 服务器端计算的总价
         */
        compareBalance:function(that,responseData,requiredData){
            if(responseData.balance >= requiredData.chapterPrice){
                //渲染弹窗所需的数据
                var obj = {
                    balan: responseData.balance,
                    totalPrice: requiredData.chapterPrice,
                    changed: responseData.subPrice != requiredData.chapterPrice
                };
                that.newPopup(that.subscribePopup(1,obj),function(){
                   if(obj.changed){
                       //当价格存在变动时显示粉色提示条
                       var warningTip = $('.warning-tip');
                       warningTip.css('top',0);
                       that.chapters = responseData.chapters;
                   }
                });

            }else{
                var obj = {
                    balan: responseData.balance,
                    totalPrice: requiredData.chapterPrice,
                    changed: responseData.subPrice != requiredData.chapterPrice
                };
                that.newPopup(that.subscribePopup(2,obj),function(){
                    if(obj.changed){
                        //当价格存在变动时显示粉色提示条
                        var warningTip = $('.warning-tip');
                        warningTip.css('top',0);
                        that.chapters = responseData.chapters;
                    }
                });
            }
        },

        /**
         * 获取指定的订阅弹窗html片段
         * @method subscribePopup
         * @param alertType 标识显示何种弹窗，编号在此函数中已经说明
         * @param otherObj 其他弹窗需要动态渲染的数据
         */
        subscribePopup: function (alertType,otherObj) {
            var that = this;
            //标识各种弹窗是否显示的对象，默认所有弹窗都不显示
            var popupSignObj = {
                //余额充足标识,编号1
                suffiBalanceAlert:false,
                //余额不足标识,编号2
                insuffiBalanceAlert:false,
                //订阅成功标识,编号3
                subSuccessAlert:false,
                //订阅失败标识,编号4
                subFailedAlert:false,
                //等待支付标识,编号5
                waitPaymentAlert:false,
                //余额充足下直接支付后等待订阅结果,编号6
                waitSubscribe:false,
                //网络异常弹窗，编号7
                networkBlock:false,
                //通用错误弹窗，编号9
                commonErrorAlert:false
            };
            switch(alertType){
                case 1:
                    popupSignObj.suffiBalanceAlert = true;
                    break;
                case 2:
                    popupSignObj.insuffiBalanceAlert = true;
                    break;
                case 3:
                    popupSignObj.subSuccessAlert = true;
                    break;
                case 4:
                    popupSignObj.subFailedAlert = true;
                    break;
                case 5:
                    popupSignObj.waitPaymentAlert = true;
                    break;
                case 6:
                    popupSignObj.waitSubscribe = true;
                    break;
                case 7:
                    popupSignObj.networkBlock = true;
                    break;
                case 9:
                    popupSignObj.commonErrorAlert = true;
                    break;
            }
            var subscribePopup = new EJS({
                //非local环境 需要这样写 url: '//' + g_data.staticDomain  + 'url'
                url:'/ejs/qd/js/book_details/subscribePopup.44242.ejs'
            }).render({
                sign:popupSignObj,
                data:otherObj
            });
            return subscribePopup;
        },

        /**
         * 初始化弹窗
         * @method newPopup
         * @param template 弹窗html片段
         */
        newPopup:function(template,afterLoad){
            var that = this;
            if($('.lbf-panel').length > 0){
                return;
            }
            this.panel = new Panel({
                drag:false,
                headerVisible: false,
                width: 520,
                footerVisible: false,
                content: template,
                events:{
                    load:function(){
                        if(afterLoad){
                            afterLoad();
                        }
                    }
                }
            });
            this.panel.confirm();
        },

        /**
         * 更新当前弹窗的内容【在弹窗已有的情况下使用】
         * @method updateCurPopup
         * @param template 弹窗html片段
         * @param template 弹窗宽度【可选参数】
         */
        updateCurPopup:function(newTemplate,width){
            if(this.panel){
                this.panel.setContent(newTemplate);
                if(width){
                    this.panel.setWidth(width);
                }else{
                    this.panel.setWidth(520);
                }
            }else{
                this.newPopup(newTemplate);
            }

        },

        /**
         * 重新拉取实际价格后进行的操作
         * @method reConfirmPrice
         * @param that 当前父函数作用域
         * @param balance 当前弹窗显示的余额
         * @param requiredData 前端发送的数据
         * @param serverPrice 后端传来的最新价格
         */
        reConfirmPrice:function(that,balance,requiredData,serverPrice){
            //渲染弹窗所需的数据
            var obj = {
                balan:balance,
                totalPrice:requiredData.chapterPrice,
                //前端计算的价格与后端计算的价格不一致时返回true
                changed:serverPrice!=requiredData.chapterPrice,
                actionType:'pay'
            };
            if(obj.changed == true){
                if(obj.totalPrice > obj.balan){
                    that.updateCurPopup(that.subscribePopup(2,obj));
                }else{
                    //二次确认后可以发请求去支付，因此在这里设置actionType为pay，标识着执行此刷新操作后可以进行支付了，其他情况下默认会二次确认价格，因此不需要设置此标识
                    that.updateCurPopup(that.subscribePopup(1,obj));
                }
                //当价格存在变动时显示粉色提示条
                var warningTip = $('.warning-tip');
                warningTip.animate({'top':0},'fast');
            }else{
                if(obj.totalPrice >= obj.balan){
                    that.showQuickPayAlert('支付并订阅',that.currentDealData._currentBalance,that.currentDealData._currentPrice);
                }else{
                    that.goSubscribe(requiredData,that.subscribeCallback);
                }
            }
        },

        /**
         * 在价格不同的情况下，刷新当前价格到最新价格
         * @method refreshPrice
         */
        refreshPrice:function(){
            //将价格变动的标识置为false，表示未变动过, 此时的价格是最新价格
            var obj = {
                changed:false,
                balan: this.currentDealData._currentBalance,
                totalPrice:this.currentDealData._currentPrice,
                //刷新价格后可以发请求去支付，因此在这里设置actionType为pay，标识着执行此刷新操作后可以进行支付了，其他情况下默认会二次确认价格，因此不需要设置此标识
                actionType:'pay'
            };
            //如果当前更新的价格小于等于余额，则说明用户可以订阅，因此变换当前价格就OK
            if(obj.balan >= obj.totalPrice){
                this.updateCurPopup(this.subscribePopup(1,obj));
            }else{
                //如果当前价格小于余额，则用户不能够订阅，需要调出含有快捷支付按钮的弹窗
                this.updateCurPopup(this.subscribePopup(2,obj));
            }
        },

        /**
         * 余额充足情况下立即支付
         * @method goSubscribe
         * @param requiredData 订阅请求所需要的参数
         * @param isReadPage 是否是阅读页
         */
        goSubscribe:function(requiredData,successCallback){
            //处理作用域问题
            var that = this;

            //再次判断是否价格大于余额（最新的价格小于等于余额时无需提示，直接付款即可）
            if(this.currentDealData._currentBalance < this.currentDealData._currentPrice){
                var obj = {
                    changed:false,
                    balan: this.currentDealData._currentBalance,
                    totalPrice:this.currentDealData._currentPrice,
                    //刷新价格后可以发请求去支付，因此在这里设置actionType为pay，标识着执行此刷新操作后可以进行支付了，其他情况下默认会二次确认价格，因此不需要设置此标识
                    actionType:'pay'
                };
                this.updateCurPopup(this.subscribePopup(2,obj));
                return;
            }
            //弹窗显示等待订阅的状态
            this.updateCurPopup(this.subscribePopup(6,{}));
            //将价格更新至最新
            requiredData.chapterPrice = this.currentDealData._currentPrice;
            if(this.chapters && this.chapters.length > 0){
                requiredData.chapters = this.chapters
            }
            $.ajax({
                type:'POST',
                url:'/ajax/subscribe/subscribe?_csrfToken='+Cookie.get('_csrfToken') || '',
                dataType:'json',
                contentType:'application/json',
                data:JSON.stringify(requiredData),
                success:function(response){
                    switch(response.code){
                        //订阅成功
                        case 0:
                            successCallback(that,response);
                            break;

                        //价格变动
                        case 2000:
                            //此弹窗不需要数据，因此第二个参数传递空对象即可
                            //当前弹窗还是显示旧的价格和余额
                            that.reConfirmPrice(that,that.currentDealData._currentBalance,requiredData,response.data.chapterPrice);
                            //点击刷新后需要显示新的信息，目前只刷新价格，所以只需最新价格
                            that.currentDealData._currentPrice = response.data.chapterPrice;
                            break;

                        //订阅失败
                        case 2003:
                            //此弹窗不需要数据，因此第二个参数传递空对象即可
                            that.updateCurPopup(that.subscribePopup(4,{}));
                            break;

                        //余额不足,余额发生变化导致不足
                        case 2006:
                            that.currentDealData._currentBalance = response.data.balance;
                            that.currentDealData._currentPrice = response.data.subPrice;
                            var obj = {
                                changed:false,
                                balan: that.currentDealData._currentBalance,
                                totalPrice:that.currentDealData._currentPrice
                            };
                            that.updateCurPopup(that.subscribePopup(2,obj));
                            break;

                        case 1000:
                            that.panel.close();
                            Login && Login.showLoginPopup && Login.showLoginPopup();
                            break;

                        //以上code都不符合的时候，再次判断是否消费异常
                        default:
                            that.checkBadPayment(response,requiredData,1);
                            break;

                    }
                }
            });
        },



        /*
         *点击快捷弹窗中订阅并支付按钮【快捷支付】
         * @method clickOnAgreeRules
         */
        clickOnAgreeRules:function(e){
            var targetCheckbox = $(e.currentTarget);
            var quickBtn = $('.j_payByQuick');
            if(targetCheckbox.disabled){
                return;
            }
            if(targetCheckbox.is(':checked')){
                quickBtn.removeClass('disabled');
                var env = g_data.envType == 'pro'?'':g_data.envType;
                //如果此时选择的是微信支付，则不会添加跳转链接，否则更新链接
                if(quickBtn.attr('method') != 1){
                    quickBtn.attr('href', '//'+ env +'book.qidian.com/charge/redirect');
                }
                //quickBtn.attr('href','javascript:');
                targetCheckbox.next().addClass('ui-checkbox-checked');
            }else{
                quickBtn.addClass('disabled');
                quickBtn.attr('href','javascript:');
                targetCheckbox.next().removeClass('ui-checkbox-checked');
            }

        },

        /*
         **展示快捷支付弹窗【方便其他js调用】【快捷支付】
         * @method showQuickPayAlert
         * @param btnMsg 按钮文案
         * @param currentBalance 当前余额
         * @param currentPrice 当前价格
         */
        showQuickPayAlert:function(btnMsg,currentBalance,currentPrice,title){
            if(currentBalance == undefined){
                currentBalance = this.currentDealData._currentBalance;
            }
            if(currentPrice == undefined){
                currentPrice = this.currentDealData._currentPrice;
            }
            var that = this;
            //准备快捷支付弹窗需要的数据
            var obj = {
                balance:currentBalance,
                totalPrice:currentPrice,
                msg: btnMsg||'支付并订阅',
                title:title||'订阅',
                env:g_data.envType == 'pro'?'':g_data.envType
            };
            //获取快捷支付弹窗的模板
            var quickPayTemplate = new EJS({
                //非local环境 需要这样写 url: '//' + g_data.staticDomain  + 'url'
                url: '/ejs/qd/js/book_details/quickPay.78c4b.ejs'
            }).render({
                data:obj
            });
            //将当前弹窗更新为快捷支付弹窗
            this.updateCurPopup(quickPayTemplate,640);
            this.agreeRulesCheckbox = $('#clause');
            if(!this.agreeRulesCheckbox.get(0).disabled){
                this.agreeRulesCheckbox.prop('checked',true);
                this.agreeRulesCheckbox.next().addClass('ui-checkbox-checked');
            }
            $('.lbf-icon-close').on('click',function(){
                that.closeAndStop();
            });
        },

        /*
         **切换快捷支付tab【快捷支付】
         * @method changePayTab
         * @param e 事件元素
         */
        changePayTab:function(e){
            var targetPayTab = $(e.currentTarget);
            if(targetPayTab.hasClass('disabled')){
                return;
            }
            var payType = targetPayTab.attr('pay-type');

            //获取立即支付按钮并添加样式
            var payBtn = $('.j_payByQuick');
            targetPayTab.addClass('act').siblings().removeClass('act');

            //将选择的tab类型传给立即支付按钮的pay-type属性，方便之后判断支付类型
            payBtn.attr('method',payType);
            var env = g_data.envType == 'pro'?'':g_data.envType;

            //除微信支付以外，都跳转到中间页
            if(payType != 1 && payType != 4 && $(this.agreeRulesCheckbox).is(':checked')){
                //payBtn.attr('href','javascript:');
                payBtn.attr('href', '//'+ env +'book.qidian.com/charge/redirect');
            }else{
                payBtn.attr('href','javascript:');
            }
            payBtn.attr('target','_blank');
        },

        /*
         **选择支付方式并进行支付【快捷支付】
         * @method payByTargetMethod
         * @param payMethod 绑定在 支付并订阅 按钮上的method属性值，是具体支付方式的代号
         * @param requiredData 请求所需的数据
         * @param getOrderNum 获取订单号的函数
         * @param startLoop 轮询的函数
         */
        payByTargetMethod:function(payMethod,requiredData,getOrderNum,startLoop,that , loopCallBack ){
            //如果其他页面传递了作用域，将与本js作用域进行合并，方便同时调用两边的方法
            if(that){
                that = $.extend(this,that);
            }else{
                that = this;
            }
            switch(payMethod){
                case '1':
                    //微信支付的代号是100001
                    getOrderNum(that,requiredData,'100001',that.payByWeixin,startLoop,loopCallBack);
                    break;
                case '2':
                    //支付宝的代号是100002
                    getOrderNum(that,requiredData,'100002',that.payByAli,startLoop,loopCallBack);
                    //将跳转链接添加的按钮href属性
                    break;
                case '3':
                    //财付通的代号是100003
                    getOrderNum(that,requiredData,'100003',that.payByOtherMethod,startLoop,loopCallBack);
                    break;
                case '4':
                    //qq钱包的代号是100004
                    getOrderNum(that,requiredData,'100004',that.payByWeixin,startLoop,loopCallBack);
                    break;
                case '5':
                    //银联的代号是100005
                    getOrderNum(that,requiredData,'100005',that.payByAli,startLoop,loopCallBack);
                    break;
            }
        },

        /*
         **获取订单号等信息【快捷支付】
         * @method getOrderInfo
         * @param that 全局作用域
         * @param requiredData 请求所需数据
         * @param _payMethod 请求所需数据之-支付类型
         * @param callBack 请求发送成功后的回调函数名称，对应paybyweixin,paybyAli,paybyothermethod等
         * @param startLoop 轮询函数，将在paybyweixin,paybyAli,paybyothermethod中被调用
         */
        getOrderInfo:function(that,requiredData,_payMethod,callBack,startLoop,loopCallBack){
            var getOrderSucceed;
            var targetBtn = $('.j_payByQuick');
            var targetForm = $('#ckey');
            var targetInput = $('#redirect_form');
            //当用户未勾选 '同意服务条款'时，默认操作不能进行下去
            if($(that.agreeRulesCheckbox).is(':checked') == false){
                $(that.agreeRulesCheckbox).next().removeClass('ui-checkbox-checked');
                return;
            }
            //在按钮loading的时候再次点击则不执行逻辑
            if(targetBtn.hasClass('btn-loading')){
                return;
            }
            //显示按钮loading样式
            that.loading.startLoading(targetBtn,function(){
                return getOrderSucceed;
            },200);


            //设置支付类型并将余额添加到请求数据中
            requiredData.payMethod = parseInt(_payMethod);
            requiredData.balance = that.currentDealData._currentBalance;
            requiredData.chapterPrice = that.currentDealData._currentPrice;
            //如果chapters数组存在且不为空，则说明价格变动过，此时需要更新给后端传递的chapters
            if(that.chapters && that.chapters.length > 0){
                requiredData.chapters = that.chapters;
            }
            //需支付金额等于总价减去账户余额
            var diff = that.currentDealData._currentPrice-that.currentDealData._currentBalance;
            $.ajax({
                type:'POST',
                url:'/ajax/subscribe/quickPay?_csrfToken='+Cookie.get('_csrfToken') || '',
                dataType:'json',
                contentType:'application/json',
                data:JSON.stringify(requiredData),
                success:function(response){
                    //设置loading结束标识
                    getOrderSucceed = true;
                    that.loading.clearLoading(targetBtn);
                    switch(response.code){
                        //返回成功
                        case 0:
                            //获取价格和余额的差值，这个值就是需要快捷支付充值的金额
                            //对应paybyweixin,paybyAli,paybyothermethod等
                            callBack(that, response.data, requiredData,startLoop,diff,loopCallBack);
                            break;

                        //价格变动
                        case 2000:
                            that.reConfirmPrice(that,that.currentDealData._currentBalance,requiredData,response.data.chapterPrice);
                            //将价格更新至最新
                            that.currentDealData._currentPrice = response.data.chapterPrice;
                            break;

                        //返回订单失败
                        case 2001:
                            that.updateCurPopup(that.subscribePopup(4,{}));
                            break;

                        case 1000:
                            that.panel.close();
                            Login && Login.showLoginPopup && Login.showLoginPopup();
                            break;

                        //以上code都不符合的时候，再次判断是否存在消费异常
                        default:
                            //快捷支付弹窗在点击重试或完成绑定时不再出现，因此method属性有可能获取不到，但thirdpartymethod为全局变量，因此它还保留着原来method的值
                            that.checkBadPayment(response,requiredData,2,that.thirdPartyMethod||$('.j_payByQuick').attr('method'));
                            break;
                    }
                }
            });
        },

        /*
         **微信支付逻辑【快捷支付】
         * @method payByWeixin
         * @param that 当前父函数作用域
         * @param responseData 快捷支付拉取微信二维码返回的数据
         * @param requiredData 轮询时向后端发送的数据
         * @param startLoop 轮询的函数
         */
        payByWeixin:function(that,responseData,requiredData,startLoop,price,loopCallBack){
            //如果返回了二维码地址，则弹窗中展示该二维码图片
            if(responseData.qrCode){
                var wxCodeTemplate = new EJS({
                    //非local环境 需要这样写 url: '//' + g_data.staticDomain  + 'url'
                    url: '/ejs/qd/js/book_details/WeChatPay.0c965.ejs'
                }).render({
                    data:{
                        totalRMBPrice:price/100,
                        payMethod: responseData.payMethod
                    }
                });
                //创建一个image对象，设置其地址为二维码地址，提前加载此二维码图片
                var qrImg = new Image();
                qrImg.src = responseData.qrCode;
                //二维码图片加载完成后再将此地址设置为弹窗上的图片地址（防止弹窗出来后二维码还未加载的情况）
                qrImg.onload = function(){
                    //更新当前弹窗内容为微信弹窗
                    that.updateCurPopup(wxCodeTemplate);
                    //将二维码地址赋给弹窗图片节点
                    $('.pay-qr-code').find('img').attr('src',this.src);
                    //弹窗显示时立即开始轮询
                    requiredData.payMethod = responseData.payMethod;
                    requiredData.orderId = responseData.orderId;
                    //每隔1秒向后端发一次请求
                    startLoop(that,requiredData,loopCallBack);
                }
            }
        },

        /*
         **支付宝支付逻辑【快捷支付】
         * @method payByAli
         * @param that 当前父函数作用域
         * @param responseData 快捷支付拉取微信二维码返回的数据
         * @param requiredData 轮询时向后端发送的数据
         * @param startLoop 轮询的函数
         */
        payByAli:function(that,responseData,requiredData,startLoop,price,loopCallBack){
            //如果成功返回跳转地址，则新开页面打开，同时继续进行流程
            if(responseData.postData || responseData.jumpUrl){
                var title = undefined ;
                if( typeof loopCallBack == 'string') title = loopCallBack ;
                //显示是否完成或遇到问题弹窗,title为第6个参数，没有则为Undefined
                that.updateCurPopup(that.subscribePopup(5,{ title : title }));

                //将loading弹窗的关闭按钮隐藏，防止用户重复提交订单
                $('.lbf-panel .lbf-icon-close').hide();
                requiredData.payMethod = responseData.payMethod;
                requiredData.orderId = responseData.orderId;
                startLoop(that,requiredData,loopCallBack);
            }
        },

        /*
         **支付宝、微信以外，其他支付途径的逻辑【快捷支付】
         * @method payByOtherMethod
         * @param that 当前父函数作用域
         * @param responseData 快捷支付拉取微信二维码返回的数据
         * @param requiredData 轮询时向后端发送的数据
         * @param startLoop 轮询的函数
         */
        payByOtherMethod:function(that,responseData,requiredData,startLoop,price,loopCallBack){
            //如果成功返回跳转地址，则新开页面打开，同时继续进行流程
            if(responseData.jumpUrl){
                //显示是否完成或遇到问题弹窗
                var title = undefined ;
                if( typeof loopCallBack == 'string') title = loopCallBack ;
                that.updateCurPopup(that.subscribePopup(5,{ title : title }));

                //将loading弹窗的关闭按钮隐藏，防止用户重复提交订单
                $('.lbf-panel .lbf-icon-close').hide();
                requiredData.payMethod = responseData.payMethod;
                requiredData.orderId = responseData.orderId;
                startLoop(that,requiredData,loopCallBack);
            }
        },

        /*
         **支付过程中轮询逻辑
         * @method paySubLoop
         * @param that 全局作用域
         * @param requiredData 发请求需要的数据
         */
        paySubLoop:function(that,requiredData,loopCallBack){
            //初始化时间
            var time = 0;
            //设置轮询请求code=0的标识
            that.hasSucceed = false;
            var timer = setInterval(function(){
                //之后需更改为15[分钟]
                if(time > 15*30){
                    clearInterval(timer);

                    //此处需要补弹窗，网络异常
                    that.updateCurPopup(that.subscribePopup(7,{}));

                    //当点击重新尝试时，继续轮询【click事件写在这里是为了更方便将数据传进paySubLoop方法中】
                    $('.j_retry_polling').on('click',function(){
                        that.paySubLoop(that,requiredData,loopCallBack);
                    });
                    return;
                }
                //轮询请求查看当前订单状态
                $.ajax({
                    type:'POST',
                    url:'/ajax/subscribe/checkStatus?_csrfToken='+Cookie.get('_csrfToken') || '',
                    dataType:'json',
                    contentType:'application/json',
                    data:JSON.stringify(requiredData),
                    success:function(response){
                        //hasSucceed为true的时候，说明已经订阅成功，此时无需响应后端延迟返回的数据，因此跳出成功回调函数
                    if(that.hasSucceed){
                        return;
                    }
                      switch(response.code){
                          //充值、订阅成功
                          case 0:
                              if(loopCallBack && Object.prototype.toString.call(loopCallBack) == '[object Function]' ){
                                  loopCallBack(that);
                              }else{
                                  that.updateCurPopup(that.subscribePopup(3,{}));
                                  //订阅成功的时候，设置hasSucceed为true
                                  that.hasSucceed = true;
                                  //为立即阅读按钮添加阅读页链接【订阅页逻辑，其他页面无需处理】
                                  $('.j_read_now').attr('href',response.data.readUrl);
                                  //将支付宝等第三方支付过程中隐藏的关闭按钮显示出来，因为此时用户可以关闭弹窗
                                  $('.lbf-panel .lbf-icon-close').show();
                                  //点击关闭X图标需刷新本页面
                                  $('.lbf-icon-close').on('click',function(){
                                      that.closeAndRefresh();
                                  });
                              }
                              clearInterval(timer);
                              break;

                          case 2009:
                              break;

                          //价格变动
                          case 2000:
                              that.reConfirmPrice(that,that.currentDealData._currentBalance,requiredData,response.data.subPrice);

                              //如果余额充足，则显示充足时的弹窗，并将价格更新至最新
                              that.currentDealData._currentPrice = response.data.subPrice;

                              //将支付宝等第三方支付过程中隐藏的关闭按钮显示出来，因为此时用户可以关闭弹窗
                              $('.lbf-panel .lbf-icon-close').show();
                              clearInterval(timer);
                              break;

                          //充值失败
                          case 2002:
                              that.updateCurPopup(that.subscribePopup(9,{msg:'充值失败'}));

                              //将支付宝等第三方支付过程中隐藏的关闭按钮显示出来，因为此时用户可以关闭弹窗
                              $('.lbf-panel .lbf-icon-close').show();
                              clearInterval(timer);
                              break;

                          //充值成功但订阅失败
                          case 2003:
                              that.updateCurPopup(that.subscribePopup(9,{msg:'订阅失败'}));

                              //将支付宝等第三方支付过程中隐藏的关闭按钮显示出来，因为此时用户可以关闭弹窗
                              $('.lbf-panel .lbf-icon-close').show();
                              clearInterval(timer);
                              break;

                          //充值未到账
                          case 2004:
                              that.updateCurPopup(that.subscribePopup(6,{}));

                              //将支付宝等第三方支付过程中隐藏的关闭按钮显示出来，因为此时用户可以关闭弹窗
                              $('.lbf-panel .lbf-icon-close').show();

                              //关闭loading弹窗后续终止发送请求
                              $('.lbf-icon-close').on('click',function(){
                                  clearInterval(timer);
                              });
                              break;

                          //余额不足
                          case 2006:
                              that.updateCurPopup(that.subscribePopup(4,{}));

                              //将支付宝等第三方支付过程中隐藏的关闭按钮显示出来，因为此时用户可以关闭弹窗
                              $('.lbf-panel .lbf-icon-close').show();
                              clearInterval(timer);
                              break;

                          case 1000:
                              that.panel.close();
                              Login && Login.showLoginPopup && Login.showLoginPopup();
                              clearInterval(timer);
                              break;

                          default:
                              that.checkBadPayment(response,requiredData,3);

                              //将支付宝等第三方支付过程中隐藏的关闭按钮显示出来，因为此时用户可以关闭弹窗
                              $('.lbf-panel .lbf-icon-close').show();
                              clearInterval(timer);
                              break;
                      }
                    }
                });
                time++;
            },2000);
            that.payAndSubTimer = timer;
        },

        /*
         **点击支付成功按钮需关闭当前弹窗，同时停止轮询【快捷支付】
         * @method closeAndStop
         */
        closeAndStop:function(){
            this.panel.close();
            if(this.payAndSubTimer){
                clearInterval(this.payAndSubTimer);
            }
        },

        /*
         **支付成功后点击关闭按钮刷新本页面
         * @method closeAndRefresh
         */
        closeAndRefresh:function(callback){
            if(typeof callback === 'function'){
                callback();
                return;
            }
            this.panel.close();
            location.href = this.currentUrl;
        },

        /*
         **检测是否有消费异常【风控相关】
         * @method checkBadPayment
         * @param response 上一步请求中返回的数据
         * @param requiredData 请求所需数据
         * @param currentState 原本正在进行的方法代号
         * @param payMethod 用来标识快捷支付时所选方式的代号【可选参数】
         * @param title 弹窗标题【可选参数】
         * @param defaultCase 在未匹配所有code的情况下，需要执行的函数【可选参数】
         */
        checkBadPayment:function(response, requiredData, currentState,payMethod,title,defaultCase){
            var that = this;
            switch(response.code){
                //手机绑定情况下，消费异常,此情况下需要把手机号及其他信息传递给模板
                case 1070:
                    //将点击完成绑定按钮所需的参数暴露
                    that.dataForPayment = requiredData;
                    that.mobileNum = response.data.mobile;
                    that.thirdPartyMethod = payMethod;
                    that.fkLogId = response.data.logId;
                    that.updateCurPopup(that.exceptionPopup(1,{mobile:that.mobileNum,hasError:false,currState:currentState}));
                    break;

                //手机未绑定情况下，消费异常
                case 1074:
                    //将点击完成绑定按钮所需的参数暴露
                    that.dataForPayment = requiredData;
                    that.thirdPartyMethod = payMethod;
                    that.updateCurPopup(that.exceptionPopup(2,{currState:currentState}));
                    break;

                //手机绑定情况下，手机号获取失败
                case 1076:
                    //将重试按钮所需的参数暴露
                    that.dataForPayment = requiredData;
                    that.thirdPartyMethod = payMethod;
                    that.updateCurPopup(that.exceptionPopup(4,{currState:currentState}));
                    break;

                //以上code都不符合的情况，直接输出后端返回的错误信息
                default:
                    if(defaultCase){
                        defaultCase();
                    }else{
                        that.updateCurPopup(that.subscribePopup(9,{msg:response.msg,title:title}));
                    }
                    break;
            }
        },

        /*
         **在点击快捷支付的时候，提前检查是否有消费异常
         * @method checkBeforeQuick
         * @param requiredData 请求所需数据
         */
        checkBeforeQuick:function(price,balance,title,currState){
            var that = this;
            $.ajax({
                type:'GET',
                url:'/ajax/safe/check',
                dataType:'json',
                data:{
                    totalPrice:price,
                    balance:balance,
                    bookId : $('#bookImg').data('bid')
                },
                success:function(response){
                    //第二个参数在此处不需要
                    if(response.code === 0){
                        that.showQuickPayAlert('支付并'+title||'订阅',balance,price,title);
                    }else{
                        that.checkBadPaymentNoCode(response,{},currState,title||'订阅',function(){
                            that.updateCurPopup(that.subscribePopup(9,{msg:response.msg,title:title}));
                        });
                    }
                }
            });
        },

        /*
         **没有paymethod这个参数时可用此方法来代替checkBadPayment方法【方便其他js调用】
         * @method checkBadPaymentNoCode
         * @param response 上一步请求中返回的数据
         * @param requiredData 请求所需数据
         * @param currentState 原本正在进行的方法代号
         * @param title 弹窗标题【可选参数】
         * @param defaultCase 未匹配到code时执行的默认函数【可选参数】
         */
        checkBadPaymentNoCode:function(response, requiredData, currentState,title,defaultCase){
            this.checkBadPayment(response, requiredData, currentState,undefined,title,defaultCase);
        },

        /*
         **账号异常弹窗模板【风控相关】
         * @method exceptionPopup
         * @param type 弹窗类型【值为各弹窗html代号】
         * @param otherInfo 弹窗模板所需数据
         */
        exceptionPopup:function(type,otherInfo){
            var signObj = {
                hasPhoneNum:false,
                noPhoneNum:false,
                bindPhoneConfirm:false,
                notGetPhoneNum:false,
                verifySuccessed:false
            };
            switch(type){
                //有绑定手机
                case 1:
                    signObj.hasPhoneNum = true;
                    break;

                //无绑定手机
                case 2:
                    signObj.noPhoneNum = true;
                    break;

                //手机绑定确认框
                case 3:
                    signObj.bindPhoneConfirm = true;
                    break;

                //获取不到手机号
                case 4:
                    signObj.notGetPhoneNum = true;
                    break;

                //验证成功
                case 5:
                    signObj.verifySuccessed = true;
                    break;
            }
            var verifyTemplate = new EJS({
                url:'/ejs/qd/js/book_details/exceptionPopup.1c518.ejs'
            }).render({
                sign:signObj,
                data:otherInfo
            });
            return verifyTemplate;
        },

        /*
         **获取手机验证码【风控相关】
         * @method getValidateCode
         * @param e 事件元素
         */
        getValidateCode:function(e){
            var that = this;
            //当前获取验证码的按钮
            var targetBtn = $(e.currentTarget);

            //按钮倒计时
            this.setCodeTimer(e);

            $.ajax({
                url:'/ajax/account/GetValidCode',
                type:'GET',
                dataType:'json',
                data:{
                    logId : that.fkLogId
                },
                success:function(response){
                    //发送请求成功后，用户将收到验证码
                    switch(response.code){
                        //超过每日发送短信次数上限
                        case 1073:
                            $('.code-input-wrap .tip').html('发送验证码过频，请稍后再试');
                            clearTimeout(that.timer);
                            break;

                        //获取验证码失败，此时用户重新获取即可，无需提示
                        case 1077:case 1078:
                            targetBtn.html("重新获取");
                            //将当前按钮的class重新添加，以便用户可继续点击
                            targetBtn.removeClass('disabled').addClass('j_getCode');
                            clearTimeout(that.timer);
                            break;
                    }

                    if (response.code == 0) {
                        that.sessionKey = response.data.sessionKey;
                    }
                }
            });

        },

        /*
         **设置获取验证码后的定时器【风控相关】
         * @method setCodeTimer
         * @param e 事件元素
         */
        setCodeTimer:function(e){
            var that = this;
            var targetBtn = $(e.currentTarget);
            //var targetBtn = $('.j_getCode');
            //倒计时初始值，目前定位60,若存在初始值，则继续从初始值开始倒计时，用户则不用再次获取一次
            this.time = 60 - 1;
            if(this.timer){
                clearInterval(this.timer);
            }
            this.timer = setInterval(function(){
                if(that.time > 0){
                    targetBtn.html(that.time+"s重新获取");
                    targetBtn.removeClass('j_getCode').addClass('disabled');
                    that.time--;
                }else{
                    //此时用户可以重新获取验证码
                    targetBtn.removeClass('disabled').addClass('j_getCode');
                    targetBtn.html("重新获取");
                    clearInterval(that.timer);
                }
            },1000);
        },

        /*
         **验证手机号是否输入正确【风控相关】
         * @method goCheckCode
         * @param e 事件元素
         */
        goCheckCode:function(e){
            var that = this;
            //点击验证时，无需清除计时器，倒计时继续
            //判断输入框是否为空
            var codeFromUser = $('#code-from-user');
            //用户什么都不输入直接点击验证时，提示错误，添加错误样式,同时终止请求
            if(codeFromUser.val() == ''){
                $('.code-input-wrap .tip').html('验证码不能为空');
                codeFromUser.addClass('error');
                return;
            }
            $.ajax({
                url:'/ajax/account/CheckValidCode',
                type:'GET',
                data:{
                    validCode:codeFromUser.val(),
                    logId :  that.fkLogId,
                    sessionKey: that.sessionKey
                },
                dataType:'json',
                success:function(response){
                    switch(response.code){
                        //验证成功
                        case 0:
                            //显示成功弹窗
                            that.checkCodeSuccessed($(e.currentTarget).attr('data-curstate'));
                            break;

                        //验证码错误，无需停止倒计时
                        case 1071:
                            $('.code-input-wrap .tip').html('验证码输入错误');
                            $('#code-from-user').addClass('error');
                            break;

                        //验证码过期，无需停止倒计时
                        case 1072:
                            $('.code-input-wrap .tip').html('验证码已过期');
                            $('#code-from-user').addClass('error');
                            break;

                        //验证失败，无需停止倒计时
                        case 1075:
                            $('.code-input-wrap .tip').html('验证失败');
                            $('#code-from-user').addClass('error');
                            break;

                        default:
                            $('.code-input-wrap .tip').html(response.msg);
                            $('#code-from-user').addClass('error');
                            break;
                    }
                }
            });
        },

        /*
         **在用户输入过程中，更新输入框的样式【风控相关】
         * @method updateInputStyle
         * @param e 事件元素
         */
        updateInputStyle:function(e){
            var codeFromUser = $(e.currentTarget);
            //在用户输入时，若不为空，则去除错误样式，否则添加错误样式
            if($(e.currentTarget).val()!=''){
                $('.code-input-wrap .tip').html('');
                codeFromUser.removeClass('error');
            }else{
                $('.code-input-wrap .tip').html('验证码不能为空');
                codeFromUser.addClass('error');
            }
        },

        /*
         **跳转安全中心【风控相关】
         * @method goToSecurCenter
         * @param e 事件元素
         * @param panel 当前页面弹窗实例【可选参数】
         */
        goToSecurCenter:function(e,panel){
            var targetLink = $(e.currentTarget);
            //跳转到安全中心后，该页面显示确认窗口
            this.updateCurPopup(this.exceptionPopup(3,{currState:targetLink.attr('data-curstate')}));
        },

        /*
         **继续当前正在进行的操作【风控相关】【风控中任何重试、完成绑定事件】
         * @method continueProcess
         * @param e 事件元素
         */
        continueProcess:function(e){
            var that = this;
            var requiredData = this.dataForPayment;
            var currentState = $(e.currentTarget).attr('data-curstate');
            switch(parseInt(currentState)){
                //消费异常出现在goSubscribe中
                case 1:
                    that.goSubscribe(requiredData,that.subscribeCallback);
                    break;

                //消费异常出现在快捷支付quickPay中
                case 2:
                    that.payByTargetMethod(that.thirdPartyMethod,that.dataForPayment,that.getOrderInfo,that.paySubLoop);
                    break;

                //消费异常出现在快捷支付的轮询中
                case 3:
                    that.paySubLoop(that,that.dataForPayment);
                    break;

                //消费异常出现在快捷支付之前，点击完成绑定、重试，则重新进行检查，若成功则进入快捷支付弹窗，若不成功则继续触发风控。
                case 5:
                    that.checkBeforeQuick(that.currentDealData._currentPrice,that.currentDealData._currentBalance,'订阅',5);
                    break;
            }
        },

        /*
         **验证码验证成功后，弹窗上按钮文案显示逻辑【风控相关】
         * @method checkCodeSuccessed
         * @param curstate 绑定在元素上的标识
         */
        checkCodeSuccessed:function(curstate){
            var that = this;
            //显示成功对话框
            switch(parseInt(curstate)){
                //消费异常出现在goSubscribe中
                case 1:
                    that.updateCurPopup(that.exceptionPopup(5,{msg:'继续支付'}));
                    break;

                //消费异常出现在快捷支付quickPay中
                case 2:
                    that.updateCurPopup(that.exceptionPopup(5,{msg:'继续订阅'}));
                    break;

                //消费异常出现在快捷支付的轮询中
                case 3:
                    that.updateCurPopup(that.exceptionPopup(5,{msg:'继续订阅'}));
                    break;

                //消费异常出现在打赏中
                case 4:
                    that.updateCurPopup(that.exceptionPopup(5,{msg:'继续打赏'}));
                    break;

                //消费异常出现在快捷支付之前
                case 5:
                    that.showQuickPayAlert('支付并订阅',that.currentDealData._currentBalance,that.currentDealData._currentPrice);
                    break;

                //红包
                case 6:
                    $('#j_editRedPacket').show();
                    $('.red-overlay').show();
                    this.panel.close();
                    break;
            }
            $('.j_continue').attr('data-curstate',curstate);
        },

        /*
         **将参数中的panel传递为全局变量【方便外部js调用此js中任何需要panel的方法】
         * @method getPanel
         * @param panel 需要传递到此js中的panel
         */
        getPanel:function(panel){
            this.panel = panel;
        },

        /*
         **关闭当前弹窗
         */
        closeAlert:function(){
            this.panel.close();
        },

        /*
         **goSubscribe执行成功后的回调函数
         */
        subscribeCallback:function(that,response){
            that.updateCurPopup(that.subscribePopup(3,{}));
            //点击关闭X图标需刷新本页面
            $('.lbf-icon-close').on('click',function(){
                that.closeAndRefresh();
            });
            $('.j_read_now').attr('href',response.data.readUrl);
        }
    })
});
