platForm.createApp("bbcdefg", "智慧关爱", {
    render: function (fn) {
        fn("static Page2");
    },
    getDomObj: function (dom) {}
}, {
    render: function (fn) {
        fn("<button>下一页</button>");
    },
    getDomObj: function (dom){
        this.attachDom("button", "btn", dom)
            .attachTap("btn", this.nextHandler, false);
    },
    nextHandler: function (ev) {
        this.app.render("_bbcdefg_next");
    }
});

platForm.createPage("bbcdefg", "next", "_bbcdefg_next", {
    render: function (fn) {
        fn("<button>上一页</button>");
    },
    getDomObj: function (dom) {
        this.attachDom("button", "btn", dom)
            .attachTap("btn", this.indexHandler, false);
    },
    indexHandler: function (ev) {
        this.app.render("_bbcdefg_index");
    }
})