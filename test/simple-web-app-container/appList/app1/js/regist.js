platForm.createPage("abcdefg", "regist", "_bbcdefg_regist", {
    render: function (fn) {
        var that = this;
        this.data.wechatUserUrl = "/hdl/TB_WECHATUSER_OldMan.ashx";
        if (this.data.html) {
            fn(this.renderHTML(this.data.html));
        }
        else {
            this.get("/public/platform/appList/app1/modal/registerNext.html", function (text) {
                fn(that.renderHTML(text));
                that.data.html = text;
            });
        }
    },
    getDomObj: function (dom) {
        this.attachDom("form", "form", dom)
            .attachEvent("form", "submit", this.formSubmit, false);
    },
    sendCode: function (fn) {
        var mobilePhone = this.data.MobilePhone;
        var button = this.domList.waiting;
        var index = this.app.getPageByUrl("_abcdefg_index");
        index.sendCode(mobilePhone, "sendRegisterValidCode", function (data) {
            fn();
        });
    },
    formSubmit: function (ev) {
        ev.preventDefault();
        var form = ev.target;
        if (form.registWord.value == form.confirmWord.value) {
            this.goRelativeList({
                MobilePhone: this.data.MobilePhone,
                PassWord: form.registWord.value,
                VerificationCode: this.data.VerificationCode,
                VerificationCodeID: this.data.VerificationCodeID,
                t: "addUser"
            });
        }
        else {
            this.showTip("两次输入的密码不一致");
        }
    },
    goRelativeList: function (sendData) {
        var wechatUserUrl = this.data.wechatUserUrl;
        var app = this.app;
        var index = this.app.getPageByUrl("_abcdefg_index");
        var that = this;
        this.showLoader();
        this.post(wechatUserUrl, sendData, function (data) {
            that.hiddenLoader();

            if (data.error == 0) {
                app.data.account = sendData.MobilePhone;
                index.directionLogin(sendData.MobilePhone, sendData.PassWord);
            }
            else {
                that.showTip(data.data);
            }
        });
    }
})