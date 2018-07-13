platForm.createSystemApp("0000001", "markert", {
    render: function (fn) {
        fn('<h1 style="padding-left: 10px;">app list</h1>');
    },
    getDomObj: function (dom) {}
}, {
    render: function (fn) {
        var p = platForm;
        var that = this;
        this.get("data/market.json", function (text) {
            var result = JSON.parse(text);
            var data = that.data;
            data.options = [];
            for (var i = 0; i < result.length; i++) {
                var r = result[i], appId = r.appId;
                r.install = "" + p.isContainsKey(appId);
                data.options.push(r);
            }

            if (data.layout) {
                fn(that.renderHTML(data.layout));
            }
            else {
                that.get("/public/platform/modal/market.html", function (text) {
                    data.layout = text;
                    fn(that.renderHTML(text));
                });
            }
        });
    },
    getDomObj: function (dom) {
        this.attachDom(".markert-list", "list", dom)
            .attachTap("list", this.installHandler, false);
    },
    installHandler: function (ev) {
        var target = ev.target;
        var action = target.dataset.action;
        var that = this;
        if (action) {
            var p = platForm;
            var key = target.parentNode.dataset.id;
            var option = this.getOptionsByKey(key);
            p.addKey(option, function () {
                target.textContent = "已装";
                target.dataset.action = "";
            })
        }
    },
    getOptionsByKey: function (key) {
        var options = this.data.options;
        for (var i = 0; i < options.length; i++) {
            var o = options[i];
            if (o.appId == key) {
                return o;
            }
        }
    }
});