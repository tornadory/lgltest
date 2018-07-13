var platPage = Page.create("platform", "/platform", {
    render: function (fn) {
        this.createData();
        var strHtml = '<div id="appList">' +
            '{{each route}}' +
            '<div class="app-item" data-action="{{key}}" >' +
            '<img src="{{icon}}">' +
            '<span>{{name}}</span>' +
            '</div>' +
            '{{/each}}' +
            '</div>' +
            '<div id="systemList">' +
            '<div class="system-item" data-action="0000001">' +
            '<img src="img/logo.jpg">' +
            '<span>markert</span>' +
            '</div>' +
            '</div>';
        fn(this.renderHTML(strHtml, this.data));
    },
    getDomObj: function (dom) {
        this.attachDom("#appList", "div", dom)
            .attachDom("#systemList", "systemList", dom)
            .attachTap("systemList", this.clickSystemApp, dom)
            .attachTap("div", this.clickHandler, false, this.longTouchHandler);
    },
    createData: function () {
        var appObj = this.platform.appObj;
        this.data.route = [];
        for (var key in appObj) {
            var app = appObj[key];
            this.data.route.push({ key: key, name: app.name, icon: app.icon ? app.icon : "/public/platform/logo.jpg" });
        }
    },
    clickSystemApp: function (ev) {
        var target = ev.target;
        var parent = target.parentNode;
        var route = parent.dataset.action;
        platForm.render(route);
    },
    clickHandler: function (ev) {
        var that = this;
        var target = ev.target;
        var parent = Assembly.getNodeName(target, "DIV");
        var span = parent.children[1];
        if (target.dataset.action == "delete") {
            this.platform.deleteKey(parent.dataset.action, function () {
                that.refresh();
            });
            return;
        }
        if (parent.dataset.state == "move") {
            parent.dataset.state = "";

            span.textContent = parent.dataset.action;
            span.dataset.action = "";
        }
        else {
            var route = parent.dataset.action;
            platForm.render(route);
        }
    },
    longTouchHandler: function (ev) {
        var that = this;
        var target = ev.target;
        var parent = Assembly.getNodeName(target, "DIV");
        var span = parent.children[1];
        parent.dataset.state = "move";
        span.textContent = "delete";
        span.dataset.action = "delete";
    },
    refresh: function () {
        var tempHtml = '{{each route}}' +
            '<div class="app-item" data-action="{{key}}">' +
            '<img src="{{icon}}">' +
            '<span>{{name}}</span>' +
            '</div>' +
            '{{/each}}';
        this.createData();
        var str = this.renderHTML(tempHtml);
        this.domList.div.innerHTML = str;
    }
});
var platForm = new Platform(platPage);

var options = [];

platForm.init(options);