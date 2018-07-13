platForm.createApp("abcdefg", "亲情关爱", null, {
    render: function (fn) {
        var that = this;
        this.data.wechatUserUrl = "/hdl/TB_WECHATUSER_OldMan.ashx";
        if (this.data.html) {
            fn(this.renderHTML(this.data.html, this.data));
        }
        else {
            this.get("/public/platform/appList/app1/modal/index.html", function (text) {
                fn(that.renderHTML(text, that.data));
                that.data.html = text;
            });
        }
    },
    getDomObj: function (dom) {
        this.attachDom(".indexHeader", "indexHeader", dom)
            .attachDom(".indexTab", "indexTab", dom)
            .attachDom("#login", "login", dom)
            .attachDom("#registNext", "registNext", dom)
            .attachDom("#forgetWord", "forgetWord", dom)
            .attachDom("#loginForm", "loginForm", dom)
            .attachDom("#registerForm", "registerForm", dom)
            .attachTap("indexTab", this.changeTabHandler, false)
            .attachTap("forgetWord", this.forgetWordHandler, false)
            .attachEvent("loginForm", "submit", this.loginFormHandler, false)
            .attachEvent("registerForm", "submit", this.registerFormHandler, false);
    },
    changeTabHandler: function (ev) {
        var target = ev.target;
        var method = target.dataset.method;
        if (method) {
            this.domList.indexHeader.className = "indexHeader " + method;
        }
    },
    forgetWordHandler: function (ev) {
        var app = this.app;
        app.render(resetPassword, true);
    },
    registerFormHandler: function (ev) {
        ev.preventDefault();
        this.registerTo();
    },
    registerTo: function () {
        var app = this.app;
        var form = this.domList.registerForm;
        var mobilePhone = form.indexMobile.value;
        this.sendCode(mobilePhone, "sendRegisterValidCode", function (data) {
            var registerNext = app.getPageByUrl("_bbcdefg_regist");
            registerNext.data.MobilePhone = mobilePhone;
            registerNext.data.VerificationCode = data.data.VerificationCode;
            registerNext.data.VerificationCodeID = data.data.VerificationCodeID;
            app.render(registerNext, true);
        });
    },
    sendCode: function (mobilePhone, str, fn) {
        var wechatUserUrl = this.data.wechatUserUrl;
        var that = this;
        var app = this.app;
        var sendData = {
            t: str,
            MobilePhone: mobilePhone
        };
        this.showLoader();
        this.post(wechatUserUrl, sendData, function (data) {
            that.hiddenLoader();
            if (data.error == 0) {
                fn(data);
            }
            else {
                Page.showTip(data.data);
            }
        });
    },
    loginFormHandler: function (ev) {
        ev.preventDefault();
        this.loginHandler();
    },
    loginHandler: function () {
        var form = this.domList.loginForm;
        var mobilePhone = form.indexName.value;
        var password = form.indexSecret.value;

        this.directionLogin(mobilePhone, password);
    },
    directionLogin: function (mobilePhone, password) {
        var wechatUserUrl = this.data.wechatUserUrl;
        var app = this.app;
        var that = this;
        var sendData = {
            t: "login",
            MobilePhone: mobilePhone,
            PassWord: password,
            ChannelType: App.mobileType,
            id: mobilePhone
        };
        this.showLoader();
        this.post(wechatUserUrl, sendData, function (data) {
            that.hiddenLoader();
            if (data.error == 0) {
                localStorage.setItem("mobilePhone", mobilePhone);
                localStorage.setItem("password", password);

                app.data.account = sendData.MobilePhone;
                app.render(relativeList, true);
            }
            else if (data.error == 2) {
                that.showConfirmBox("提示框", data.data, function () {
                    that.showLoader();
                    that.post(wechatUserUrl, { t: "setCurrentCity", ChannelType: App.mobileType, MobilePhone: mobilePhone, PassWord: password, }, function (data) {
                        that.hiddenLoader();
                        if (data.error == 0) {
                            localStorage.setItem("mobilePhone", mobilePhone);
                            localStorage.setItem("password", password);
                            app.data.account = sendData.MobilePhone;
                            app.render(relativeList, true);
                        }
                        else {
                            that.showTip(data.data);
                            localStorage.clear();
                            var bar = location.href.lastIndexOf("/");
                            location.href = location.href.slice(0, bar);
                        }
                    })
                })
            }
            else {
                that.showTip(data.data);
            }
        });
    }
});