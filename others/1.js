// from http://taotajima.jp/works/stripe-intl/?tdsourcetag=s_pcqq_aiomsg
! function (e) {
    function t(n) {
        if (o[n])
            return o[n].exports;
        var i = o[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(i.exports, i, i.exports, t),
            i.l = !0,
            i.exports
    }
    var o = {};
    t.m = e,
        t.c = o,
        t.i = function (e) {
            return e
        },
        t.d = function (e, o, n) {
            t.o(e, o) || Object.defineProperty(e, o, {
                configurable: !1,
                enumerable: !0,
                get: n
            })
        },
        t.n = function (e) {
            var o = e && e.__esModule ? function () {
                    return e.default
                } :
                function () {
                    return e
                };
            return t.d(o, "a", o),
                o
        },
        t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        },
        t.p = "",
        t(t.s = 8)
}([function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.slideDir = 1,
                    t
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        isList: !0,
                        isSlide: !1,
                        zoomTarget: "",
                        isZoom: !1,
                        isZoomIn: !1,
                        isZoomOut: !1,
                        isZoomMiddle: !1,
                        isSliding: !1,
                        isSlideText: !1,
                        isSlideNavi: !1,
                        isSlideInfo: !1,
                        isSlideInfoStart: !1,
                        isSlideInfoEnd: !1,
                        isSlideVimeo: !1,
                        isSlideVimeoCancel: !1,
                        isSlideVimeoStart: !1,
                        isSlideVimeoEnd: !1,
                        slideIndex: 0
                    }
                },
                t
        }(i.Model);
    t.ModelState = r,
        t.modelState = new r
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(117),
        i = document;
    i._q = i.querySelector,
        i._qa = i.querySelectorAll;
    var r = function () {
        function e() {}
        return e.init = function () {
                e.header = i._q("header"),
                    e.main = i._q("main"),
                    e.main || (n.Template.initSlideMain(),
                        e.main = i._q("main")),
                    e.footer = i._q("footer"),
                    e.canvas = i._q("#three"),
                    e.loading = i._q("#loading"),
                    e.headerHome = i._q("#header_home"),
                    e.headerAbout = i._q("#header_about"),
                    e.headerAboutSVG = e.headerAbout.querySelector(".header_about_arrow svg"),
                    e.headerAboutPolyline = e.headerAboutSVG.querySelector("polyline"),
                    e.menuTriggerOpen = i._q("#menuTrigger_open"),
                    e.menuTriggerClose = i._q("#menuTrigger_close"),
                    e.slideHome = i._q("#slideHome"),
                    e.slideHome || (n.Template.initSlideHome(),
                        e.slideHome = i._q("#slideHome")),
                    e.slideHomeContainer = e.slideHome.querySelector(".slideHome_container"),
                    e.slideHomePosition = e.slideHome.querySelector(".slideHome_position"),
                    e.slideHomeName = e.slideHome.querySelector(".slideHome_name"),
                    e.slideHomeFrom = e.slideHome.querySelector(".slideHome_from"),
                    e.slideWorks = i._q("#slideWorks"),
                    e.slideWorks || (n.Template.initSlideWorks(),
                        e.slideWorks = i._q("#slideWorks")),
                    e.slideWorksContainer = e.slideWorks.querySelector(".slideWorks_container"),
                    e.slideWorksHeader = e.slideWorks.querySelector(".slideWorks_header"),
                    e.slideWorksNum = e.slideWorks.querySelector(".slideWorks_num"),
                    e.slideWorksCategory = e.slideWorks.querySelector(".slideWorks_category"),
                    e.slideWorksTitle = e.slideWorks.querySelector(".slideWorks_title"),
                    e.slideWorksDescription = e.slideWorks.querySelector(".slideWorks_description"),
                    e.slideWorksInfo = e.slideWorks.querySelector(".slideWorks_info"),
                    e.slideWorksPlay = e.slideWorks.querySelector(".slideWorks_play"),
                    e.slideWorksShare = e.slideWorks.querySelector(".slideWorks_share"),
                    e.slideWorksShareLabel = e.slideWorks.querySelector(".slideWorks_share_label"),
                    e.slideWorksShareFacebook = e.slideWorks.querySelector(".slideWorks_share_facebook"),
                    e.slideWorksShareTwitter = e.slideWorks.querySelector(".slideWorks_share_twitter"),
                    e.slideNavi = i._q("#slideNavi"),
                    e.slideNavi || (n.Template.initSlideNavi(),
                        e.slideNavi = i._q("#slideNavi")),
                    e.slideNaviPrev = i._q("#slideNavi_prev"),
                    e.slideNaviPrevNum = e.slideNaviPrev.querySelector(".slideNavi_num > span"),
                    e.slideNaviPrevTitle = e.slideNaviPrev.querySelector(".slideNavi_title > span"),
                    e.slideNaviPrevSVG = e.slideNaviPrev.querySelector(".slideNavi_arrow svg"),
                    e.slideNaviPrevPolyline = e.slideNaviPrevSVG.querySelector("polyline"),
                    e.slideNaviNext = i._q("#slideNavi_next"),
                    e.slideNaviNextNum = e.slideNaviNext.querySelector(".slideNavi_num > span"),
                    e.slideNaviNextTitle = e.slideNaviNext.querySelector(".slideNavi_title > span"),
                    e.slideNaviNextSVG = e.slideNaviNext.querySelector(".slideNavi_arrow svg"),
                    e.slideNaviNextPolyline = e.slideNaviNextSVG.querySelector("polyline"),
                    n.Template.initSlideNaviCount(),
                    e.slideNaviCount = i._q("#slideNavi_count"),
                    e.slideNaviCountPrev = e.slideNaviCount.querySelector(".slideNavi_count_prev"),
                    e.slideNaviCountNext = e.slideNaviCount.querySelector(".slideNavi_count_next"),
                    e.slideNaviCountTotal = e.slideNaviCount.querySelector(".slideNavi_count_total"),
                    e.slideInfo = i._q("#slideInfo"),
                    e.slideInfo || (n.Template.initSlideInfo(),
                        e.slideInfo = i._q("#slideInfo")),
                    e.slideInfoScroll = e.slideInfo.querySelector(".slideInfo_scroll"),
                    e.slideInfoBack = e.slideInfo.querySelector(".slideInfo_back"),
                    e.slideInfoNum = e.slideInfo.querySelector(".slideInfo_num"),
                    e.slideInfoCategory = e.slideInfo.querySelector(".slideInfo_category"),
                    e.slideInfoTitle = e.slideInfo.querySelector(".slideInfo_title"),
                    e.slideInfoDescription = e.slideInfo.querySelector(".slideInfo_description"),
                    e.slideInfoShareFacebook = e.slideInfo.querySelector(".slideInfo_share_facebook"),
                    e.slideInfoShareTwitter = e.slideInfo.querySelector(".slideInfo_share_twitter"),
                    n.Template.initSlideVimeo(),
                    e.slideVimeo = i._q("#slideVimeo"),
                    e.slideVimeoClose = e.slideVimeo.querySelector(".slideVimeo_close"),
                    e.list = i._q("#list"),
                    e.listHome = e.list.querySelector(".list_home"),
                    e.listItems = e.list.querySelectorAll(".list_item"),
                    e.listButtons = e.list.querySelectorAll(".list_item > a"),
                    e.listImages = e.list.querySelectorAll(".list_thumb > img"),
                    e.about = i._q("#about"),
                    e.about || (n.Template.initSlideAbout(),
                        e.about = i._q("#about")),
                    e.backToTop = i._q("#backToTop"),
                    e.buttonHover = i._qa(".hover"),
                    e.debugVideoState = i._q("#devVideoState")
            },
            e
    }();
    t.SC = r
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r, s = o(78),
        a = o(19),
        l = o(10),
        u = o(0),
        c = o(82),
        d = o(9),
        h = 0,
        p = 0,
        f = function (e) {
            function o() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onChangePath = function () {
                        var e, o = t.get("path"),
                            n = l.C.siteTitle;
                        "/about/" == o ? n = "About | " + n : "/works/" == o ? n = "Works | " + n : -1 != (e = t.getWorksIndexByPath(o)) && (n = d.ConstWork.list[e].title + " | " + n),
                            document.title = n
                    },
                    t
            }
            return n(o, e),
                o.prototype.init = function () {
                    c.scrollRestoration.init(),
                        i = a.ConstConfig.pathList,
                        r = a.ConstConfig.pathWorksList,
                        p = r.length,
                        h = p + 1,
                        e.prototype.init.call(this, l.C.path),
                        this.on(":path", this._onChangePath),
                        this._onChangePath()
                },
                o.prototype.validate = function (e, t) {
                    return -1 != i.indexOf(e)
                },
                o.prototype.initModel = function () {
                    var e = this.get("path");
                    this.isList(e) ? u.modelState.set({
                        isList: !0,
                        isSlide: !1
                    }) : u.modelState.set({
                        isList: !1,
                        isSlide: !0,
                        zoomTarget: e,
                        slideIndex: this.getSlideIndexByPath(e)
                    })
                },
                o.prototype.gotoSlide = function (e, o) {
                    t.routeManagerPlus.goto(this.getPathBySlideIndex(e), null, o)
                },
                o.prototype.siblingSlide = function (e, t) {
                    var o = this.get("path"),
                        n = this.getSlideIndexByPath(o);
                    null != n && this.gotoSlide((n + e + h) % h, t)
                },
                o.prototype.nextSlide = function (e) {
                    this.siblingSlide(1, e)
                },
                o.prototype.prevSlide = function (e) {
                    this.siblingSlide(-1, e)
                },
                o.prototype.isList = function (e) {
                    return "/works/" == e || "/about/" == e
                },
                o.prototype.isSlide = function (e) {
                    return !this.isList(e)
                },
                o.prototype.getWorksIndexByPath = function (e) {
                    return r.indexOf(e)
                },
                o.prototype.getSlideIndexByPath = function (e) {
                    return this.isList(e) ? -1 : "/" == e ? 0 : this.getWorksIndexByPath(e) + 1
                },
                o.prototype.getPathByWorksIndex = function (e) {
                    return r[e]
                },
                o.prototype.getPathBySlideIndex = function (e) {
                    return 0 == e ? "/" : this.getPathByWorksIndex(e - 1)
                },
                o
        }(s.RouteManager);
    t.RouteManagerPlus = f,
        t.routeManagerPlus = new f
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(6),
        s = 2,
        a = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onResize = function () {
                        t.resize()
                    },
                    t
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        clientWidth: 0,
                        clientHeight: 0,
                        innerWidth: 0,
                        innerHeight: 0,
                        ratio: 1
                    }
                },
                t.prototype.resize = function () {
                    this.set({
                        clientWidth: document.documentElement.clientWidth,
                        clientHeight: document.documentElement.clientHeight,
                        innerWidth: window.innerWidth,
                        innerHeight: window.innerHeight
                    })
                },
                t.prototype.start = function () {
                    return i = 0,
                        this._onResize(),
                        this._setRatio(),
                        TweenMax.ticker.addEventListener("tick", this._onTick, this),
                        window.addEventListener("resize", this._onResize),
                        this
                },
                t.prototype.stop = function () {
                    return TweenMax.ticker.removeEventListener("tick", this._onTick, this),
                        window.removeEventListener("resize", this._onResize),
                        this
                },
                t.prototype.setMaxRatio = function (e) {
                    return s = e,
                        this._setRatio(),
                        this
                },
                t.prototype._setRatio = function () {
                    this.set({
                        ratio: Math.min(s, window.devicePixelRatio) || 1
                    })
                },
                t.prototype._onTick = function () {
                    var e = TweenMax.ticker.time;
                    e - i > .5 && (i = e,
                        this._setRatio())
                },
                t
        }(r.Model);
    t.resize = new a
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(8),
        r = o(18),
        s = o(1),
        a = o(3),
        l = o(5),
        u = o(99),
        c = o(13),
        d = o(39),
        h = o(27),
        p = 1 / Math.tan(30 * Math.PI / 180) * .5,
        f = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onResize = function () {
                        var e, o, n;
                        e = a.resize.get("clientWidth"),
                            o = a.resize.get("innerHeight"),
                            n = a.resize.get("ratio"),
                            t.renderer.setPixelRatio(n),
                            t.renderer.setSize(e, o),
                            t.camera.aspect = e / o,
                            t.camera.position.z = p * o,
                            t.camera.updateProjectionMatrix(),
                            d.uniformSize.update(e, o),
                            h.uniformPixels.update(e * n, o * n),
                            t.trigger("resize")
                    },
                    t._onRAF = function (e, o) {
                        c.uniformTime.update(o),
                            t.trigger("draw:1", [e, o]),
                            t.trigger("draw", [e, o]),
                            t._render()
                    },
                    t
            }
            return n(t, e),
                t.prototype.init = function () {
                    c.uniformTime.init(),
                        d.uniformSize.init(),
                        h.uniformPixels.init(),
                        this._initThree(),
                        u.controllerThreeRayCaster.init(),
                        i.index.on("resize", this._onResize),
                        this._onResize(),
                        r.raf.on("raf", this._onRAF)
                },
                t.prototype._initThree = function () {
                    this.renderer = new THREE.WebGLRenderer({
                            antialias: !1,
                            alpha: !0,
                            canvas: s.SC.canvas
                        }),
                        this.scene = new THREE.Scene,
                        this.container = new THREE.Object3D,
                        this.scene.add(this.container),
                        this.camera = new THREE.PerspectiveCamera(60, 1, 1, 1e4),
                        this.rayCaster = new THREE.Raycaster(this.camera.position)
                },
                t.prototype._render = function () {
                    this.renderer.render(this.scene, this.camera)
                },
                t
        }(l.Event);
    t.ThreeManager = f,
        t.threeManager = new f
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e() {}
        return e.prototype.on = function (e, t, o) {
                return this._on(e, t, o, !1)
            },
            e.prototype.once = function (e, t, o) {
                return this._on(e, t, o, !0)
            },
            e.prototype._on = function (e, t, o, n) {
                void 0 === n && (n = !1);
                var i, r;
                return r = {
                        listener: t,
                        context: o,
                        once: n
                    },
                    this.typeList = this.typeList || {},
                    i = this.typeList[e],
                    i && this.off(e, t),
                    this.typeList = this.typeList || {},
                    i = this.typeList[e],
                    i ? i.push(r) : this.typeList[e] = [r],
                    this
            },
            e.prototype.off = function (e, t) {
                var o, n, i, r;
                if (e || t)
                    if (t) {
                        if (!(i = this.typeList))
                            return this;
                        if (!(r = i[e]))
                            return this;
                        for (n = r.length,
                            o = 0; o < n; o++)
                            if (r[o].listener == t) {
                                1 == n ? (delete i[e],
                                    0 == Object.keys(i).length && delete this.typeList) : r.splice(o, 1);
                                break
                            }
                    } else {
                        if (!(i = this.typeList))
                            return this;
                        delete i[e],
                            0 == Object.keys(i).length && delete this.typeList
                    }
                else
                    delete this.typeList;
                return this
            },
            e.prototype.trigger = function (e, t) {
                var o, n, i, r, s, a;
                if (!(i = this.typeList))
                    return this;
                if (!(r = i[e]))
                    return this;
                for (r = r.concat(),
                    n = r.length,
                    o = 0; o < n; o++)
                    s = r[o],
                    a = s.listener,
                    a.apply(s.context, t),
                    s.once && this.off(e, s.listener);
                return this
            },
            e.prototype.triggers = function (e, t) {
                var o, n;
                if (!e || 0 == e.length || !this.typeList)
                    return this;
                for (n = e.length,
                    o = 0; o < n; o++)
                    this.trigger(e[o], t);
                return this
            },
            e
    }();
    t.Event = n
}, function (e, t, o) {
    "use strict";

    function n(e, t) {
        var o, n, i, r, s;
        for (n = e.length,
            r = t.length,
            o = 0; o < n; o++)
            for (s = e[o],
                i = 0; i < r; i++)
                if (t[i] == s)
                    return !0;
        return !1
    }

    function i(e, t, o) {
        var n, i, r, s, a, l, u;
        for (s = Object.keys(t),
            i = s.length,
            r = [],
            n = 0; n < i; n++)
            (a = s[n]) in e && (l = e[a],
                u = t[a],
                o[a] = l,
                l !== u && (r.push(":" + a),
                    e[a] = u));
        return r
    }
    var r = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var s = o(5),
        a = function (e) {
            function t() {
                var t = e.call(this) || this;
                return t.attrs = t.defaults(),
                    t._prev = {},
                    t
            }
            return r(t, e),
                t.prototype.defaults = function () {
                    return {}
                },
                t.prototype.get = function (e) {
                    return this.attrs[e]
                },
                t.prototype.set = function (e, t) {
                    e && (t || (t = {}),
                        this._changedKeys = i(this.attrs, e, this._prev),
                        0 != this._changedKeys.length && (t.silent || (this.triggers(this._findTypes(this._changedKeys)),
                            this.trigger(":"))))
                },
                t.prototype.prev = function (e) {
                    return this._prev ? this._prev[e] : null
                },
                t.prototype.changed = function (e) {
                    return -1 != this._changedKeys.indexOf(":" + e)
                },
                t.prototype.changedAny = function (e) {
                    var t, o, n;
                    for (o = e.length,
                        t = 0; t < o; t++)
                        if (n = e[t],
                            -1 != this._changedKeys.indexOf(":" + n))
                            return !0;
                    return !1
                },
                t.prototype.changedEvery = function (e) {
                    var t, o, n;
                    for (o = e.length,
                        t = 0; t < o; t++)
                        if (n = e[t],
                            -1 == this._changedKeys.indexOf(":" + n))
                            return !1;
                    return !1
                },
                t.prototype._findTypes = function (e) {
                    var t, o, i, r, s, a;
                    if (this.typeList && e && 0 != e.length) {
                        for (t = Object.keys(this.typeList),
                            a = [],
                            s = t.length,
                            r = 0; r < s; r++)
                            o = t[r],
                            i = o.split(" "),
                            n(i, e) && a.push(o);
                        return a
                    }
                },
                t
        }(s.Event);
    t.Model = a
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        device: null,
                        mobile: null,
                        computer: null,
                        listCols: null,
                        canvasTextSize: null,
                        portrait: null,
                        landscape: null,
                        breakpoint: ""
                    }
                },
                t
        }(i.Model);
    t.ModelMQ = r,
        t.modelMQ = new r
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(3),
        s = o(18),
        a = o(1),
        l = o(40),
        u = o(41),
        c = o(4),
        d = o(6),
        h = o(2),
        p = o(19),
        f = o(53),
        m = o(46),
        v = o(57),
        _ = o(48),
        g = o(49),
        y = o(12),
        S = o(52),
        T = o(61),
        w = o(32),
        x = o(16),
        C = o(14),
        b = o(28),
        M = o(29),
        P = o(47),
        E = o(50),
        O = o(56),
        k = o(51),
        R = o(54),
        H = o(43),
        L = o(15),
        I = o(30),
        A = o(23),
        z = o(60),
        V = o(22),
        j = o(7),
        W = o(45),
        N = o(10),
        F = o(31),
        U = o(0),
        D = o(17),
        Y = o(44),
        B = o(55),
        q = o(58),
        Q = o(59),
        Z = o(42),
        X = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onPreloadFont = function () {
                        Q.preloadJSON.once("complete", t._onPreloadJSON),
                            Q.preloadJSON.load(),
                            a.SC.loading.classList.add("isShow")
                    },
                    t._onPreloadJSON = function () {
                        p.ConstConfig.init(Q.preloadJSON.json),
                            i = new imagesLoaded(document, {
                                background: !1
                            }),
                            i.on("always", t._onPreloadImages1)
                    },
                    t._onPreloadImages1 = function () {
                        Useragnt.pc && !Useragnt.mac && (M.smoothScroll.init().start(),
                                M.smoothScroll.on("scroll", function (e) {
                                    window.scrollBy(0, e)
                                })),
                            q.preloadImageList.once("complete", t._onPreloadImages2),
                            q.preloadImageList.load()
                    },
                    t._onPreloadImages2 = function () {
                        Useragnt.ios && j.modelMQ.on(":", t._onMQ),
                            r.resize.setMaxRatio(2).start().on(":", t._onResize),
                            t._onResize(),
                            W.controllerMQ.init(),
                            s.raf.setFPS(60).start(),
                            y.scrollerY.start(),
                            b.pointer.start(),
                            N.C.canvasTextUsing ? (U.modelState.once("canvasDraw", t._onDrawCanvas),
                                I.CanvasText.draw()) : t._onDrawCanvas()
                    },
                    t._onDrawCanvas = function () {
                        L.VideoPlayer.init(),
                            h.routeManagerPlus.init(),
                            N.C.videoUsing ? (f.controllerPreloadVideo.on("ready", t._ready),
                                f.controllerPreloadVideo.init()) : t._ready()
                    },
                    t._ready = function () {
                        D.modelSlide.init(),
                            x.modelList.init(),
                            V.modelHome.init(),
                            c.threeManager.init(),
                            T.threeList.init(),
                            z.threeHome.init(),
                            w.threeSlide.init(),
                            F.threeBlack.init(),
                            N.C.canvasTextUsing && A.threeText.init(),
                            a.SC.loading.classList.add("isFinish"),
                            TimelinePlus.call(t._opening).delay(1.1)
                    },
                    t._opening = function () {
                        h.routeManagerPlus.initModel(),
                            h.routeManagerPlus.pause(),
                            P.controllerState.init(),
                            Useragnt.pc && H.controllerHover.init(),
                            E.controllerHeader.init(),
                            m.controllerMenuTrigger.init(),
                            k.controllerHome.init(),
                            B.controllerSlideSliding.init(),
                            S.controllerList.init(),
                            g.controllerBackToTop.init(),
                            _.controllerAbout.init(),
                            O.controllerWorks.init(),
                            R.controllerSlide.init(),
                            a.SC.loading.classList.remove("isShow"),
                            C.Q.html.classList.remove("isLoading"),
                            C.Q.html.classList.add("isOpening"),
                            U.modelState.trigger("opening"),
                            TimelinePlus.call(t._start).delay(U.modelState.get("isSlide") ? 1 : .3)
                    },
                    t._start = function () {
                        Y.controllerLoop.init(),
                            a.SC.loading.parentNode.removeChild(a.SC.loading),
                            C.Q.html.classList.remove("isOpening"),
                            C.Q.html.classList.add("isStart"),
                            U.modelState.trigger("start"),
                            h.routeManagerPlus.resume()
                    },
                    t._onResize = function () {
                        var e, o;
                        e = r.resize.get("clientWidth"),
                            o = r.resize.get("clientHeight"),
                            u.Style.size(a.SC.canvas, e, o);
                        var n = window.getComputedStyle(C.Q.head, "").fontFamily.replace(/["']/g, "");
                        j.modelMQ.set({
                                breakpoint: n
                            }),
                            t.trigger("resize:1"),
                            t.trigger("resize")
                    },
                    t._onMQ = function () {
                        setTimeout(function () {
                            r.resize.resize()
                        }, 500)
                    },
                    t
            }
            return n(t, e),
                t.prototype.init = function () {
                    var e = document.querySelector("#notSupported");
                    e.parentNode.removeChild(e),
                        a.SC.init(),
                        TweenMax.set([a.SC.list, a.SC.about], {
                            autoAlpha: 0
                        }),
                        C.Q.html.classList.add("isLoading"),
                        C.Q.html.classList.add("isReady"),
                        v.preloadFont.on("complete", this._onPreloadFont),
                        v.preloadFont.load(),
                        Useragnt.ios && Z.disabledZoom.start()
                },
                t
        }(d.Model);
    l.ready(function () {
            console.log("made by http://homunculus.jp/"),
                Allocatr.primary && (t.index = new X,
                    t.index.init())
        }),
        window.onunload = function () {},
        window.onbeforeunload = function () {
            window.scrollTo(0, 0)
        }
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(11),
        r = o(10),
        s = o(79),
        a = function (e) {
            function t(o, n) {
                var i = e.call(this, t.num - o, n) || this;
                i.indexSlide = o + 1,
                    i.indexWorks = o,
                    i.slug = n.slug,
                    i.path = "/works/" + n.slug + "/",
                    i.title = n.title,
                    i.pageTitle = i.title + " - " + r.C.siteTitle,
                    i.category = n.category,
                    i.description = n.description,
                    i.vimeoID = n.vimeo_id,
                    i.vimeoURL = "https://vimeo.com/" + i.vimeoID,
                    i.vimeoWidth = n.vimeo_width,
                    i.vimeoHeight = n.vimeo_height,
                    i.videoLocal = r.C.path + "/video/" + i.slug + ".mp4",
                    i.videoVimeo = r.C.videoLocal ? i.videoLocal : n.vimeo_digest,
                    r.C.videoUsing ? i.urlThumb = r.C.path + "/images/shot/" + i.slug + ".jpg" : i.urlThumb = r.C.path + "/images/still/" + i.slug + ".jpg";
                var a = r.C.origin + i.path;
                return i.shareFacebook = s.Share.generateFacebook(a),
                    i.shareTwitter = s.Share.generateTwitter(a, i.pageTitle),
                    i
            }
            return n(t, e),
                t
        }(i.ConstSlide);
    t.ConstWork = a
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e() {}
        return e.videoMaxConnection = 2,
            e.videoLocal = Useragnt.safari || Useragnt.ie || Useragnt.edge,
            e.videoUsing = Useragnt.pc && !Useragnt.safari,
            e.canvasTextUsing = Useragnt.pc,
            e.path = location.pathname.replace(/\/$/g, "").replace(/\/(works|about)(.*)$/g, ""),
            e.origin = location.origin,
            e.siteTitle = "TAO TAJIMA | Filmmaker",
            e.listHoverScale = 1.25,
            e
    }();
    t.C = n
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e(e, t) {
            this.id = e,
                this.idFixed = ("000" + e).slice(-3),
                this.idString = "#" + this.idFixed,
                this.width = 960,
                this.height = 540,
                this.rate = this.width / this.height
        }
        return e
    }();
    t.ConstSlide = n
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r, s = o(6),
        a = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onScroll = function () {
                        i = window.scrollY,
                            r = requestAnimationFrame(t._onRAF)
                    },
                    t._onRAF = function () {
                        t.set({
                            y: i
                        })
                    },
                    t
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        y: 0
                    }
                },
                t.prototype.start = function () {
                    return window.addEventListener("scroll", this._onScroll),
                        i = window.scrollY,
                        this._onRAF(),
                        this
                },
                t.prototype.stop = function () {
                    return window.removeEventListener("scroll", this._onScroll),
                        cancelAnimationFrame(r),
                        this
                },
                t
        }(s.Model);
    t.scrollerY = new a
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = 2 * Math.PI,
        r = function () {
            function e() {}
            return e.prototype.init = function () {
                    n = this.value = new THREE.Vector4(0, 0, 0, 0)
                },
                e.prototype.update = function (e) {
                    var t = e * i;
                    n.x += e,
                        n.y += t,
                        n.z += Math.sin(t),
                        n.w += Math.cos(t)
                },
                e
        }();
    t.UniformTime = r,
        t.uniformTime = new r
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.Q = {
            html: document.querySelector("html"),
            head: document.querySelector("head"),
            body: document.querySelector("body")
        }
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(5),
        r = o(115),
        s = o(1),
        a = o(11),
        l = function (e) {
            function t(t, o, n) {
                var i = e.call(this) || this;
                return i.willPlay = !1,
                    i.isPlaying = !1,
                    i.isPause = !0,
                    i._play = function (e) {
                        void 0 === e && (e = !1),
                            i.willPlay = !0,
                            i.video && i.video.paused && !i.isPlaying && (e || (i.video.currentTime = 0),
                                i.video.play())
                    },
                    i._onLoaded = function () {
                        i.video = i.preloadVideo.video,
                            i.video.addEventListener("playing", i._onPlaying),
                            i.video.addEventListener("pause", i._onPause),
                            i.willPlay && i._play(),
                            i.trigger("ready")
                    },
                    i._onPlaying = function () {
                        i.isPlaying = !0,
                            i.isPause = !1,
                            i.trigger("play")
                    },
                    i._onPause = function () {
                        i.isPlaying = !1,
                            i.isPause = !0,
                            i.trigger("pause")
                    },
                    i.image = n,
                    i.src1 = t,
                    i.src2 = o,
                    i
            }
            return n(t, e),
                t.init = function () {
                    var e, o, n;
                    for (this.list = [],
                        o = a.ConstSlide.num,
                        e = 0; e < o; e++)
                        n = a.ConstSlide.list[e],
                        this.list[e] = new t(n.videoVimeo, n.videoLocal, n.imgThumb)
                },
                t.prototype.load = function () {
                    this.preloadVideo = new r.PreloadVideo,
                        this.preloadVideo.once("ready", this._onLoaded),
                        this.preloadVideo.load(this.src1, this.src2)
                },
                t.prototype.resume = function (e) {
                    void 0 === e && (e = 0),
                        this.play(e, !0)
                },
                t.prototype.play = function (e, t) {
                    void 0 === e && (e = 0),
                        void 0 === t && (t = !1),
                        this._tween && this._tween.kill(),
                        e ? this._tween = TimelinePlus.call(this._play, [t], this).delay(e) : this._play(t)
                },
                t.prototype.pause = function () {
                    this._tween && this._tween.kill(),
                        this.willPlay = !1,
                        !this.video || this.video.paused || this.isPause || this.video.pause()
                },
                t.prototype._debug = function () {
                    var e = document.createElement("div");
                    e.innerHTML = '<li class="debugVideoState_item"></li>',
                        this._debugElement = e.firstElementChild,
                        s.SC.debugVideoState.appendChild(this._debugElement)
                },
                t
        }(i.Event);
    t.VideoPlayer = l
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = o(1),
        s = o(112),
        a = o(0),
        l = o(15),
        u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onChangeSlide = function () {
                        a.modelState.get("isSlide") ? t._stop() : t._start()
                    },
                    t._onScroll = function () {
                        t.offsetY = 120 - window.scrollY,
                            t.trigger("scroll")
                    },
                    t
            }
            return n(t, e),
                t.prototype.init = function () {
                    var e, t;
                    for (t = r.SC.listItems.length,
                        this.items = [],
                        e = 0; e < t; e++)
                        this.items[e] = new s.ModelListItem(e, r.SC.listItems[e], r.SC.listButtons[e], r.SC.listImages[e], l.VideoPlayer.list[e + 1]);
                    a.modelState.on(":isSlide", this._onChangeSlide),
                        this._onChangeSlide()
                },
                t.prototype._start = function () {
                    window.addEventListener("scroll", this._onScroll)
                },
                t.prototype._stop = function () {
                    window.removeEventListener("scroll", this._onScroll)
                },
                t
        }(i.Model);
    t.ModelList = u,
        t.modelList = new u
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = o(11),
        s = o(8),
        a = o(3),
        l = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onResize = function () {
                        var e, o, n, i, s, l, u, c, d;
                        for (e = a.resize.get("clientWidth"),
                            o = a.resize.get("innerHeight"),
                            n = e / o,
                            s = r.ConstSlide.num,
                            i = 0; i < s; i++)
                            u = r.ConstSlide.list[i],
                            c = t.uvList[i],
                            l = u.rate,
                            d = 1 / l,
                            l < n ? (c.u = 1,
                                c.v = l / n) : (c.u = n / l,
                                c.v = 1),
                            d < n ? (c.s = 1,
                                c.t = d / n) : (c.s = n / d,
                                c.t = 1)
                    },
                    t
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        visible: !1,
                        texture1: -1,
                        texture2: -1
                    }
                },
                t.prototype.init = function () {
                    var e, t;
                    for (t = r.ConstSlide.num,
                        this.uvList = [],
                        e = 0; e < t; e++)
                        this.uvList[e] = {
                            u: 1,
                            v: 1,
                            s: 1,
                            t: 1
                        };
                    s.index.on("resize:1", this._onResize),
                        this._onResize()
                },
                t
        }(i.Model);
    t.ModelSlide = l,
        t.modelSlide = new l
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(6),
        s = .05,
        a = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.start = function () {
                    return i = 0,
                        TweenMax.ticker.addEventListener("tick", this._onTick, this),
                        this
                },
                t.prototype.stop = function () {
                    return TweenMax.ticker.removeEventListener("tick", this._onTick, this),
                        this
                },
                t.prototype.setFPS = function (e) {
                    return TweenMax.ticker.fps(e),
                        this
                },
                t.prototype.setMaxDelta = function (e) {
                    return s = e,
                        this
                },
                t.prototype._onTick = function () {
                    var e = TweenMax.ticker.time,
                        t = e - i;
                    t > s && (t = s),
                        i = e,
                        this.trigger("raf", [e, t])
                },
                t
        }(r.Model);
    t.RAF = a,
        t.raf = new a
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(84),
        i = o(9),
        r = o(11),
        s = function () {
            function e() {}
            return e.init = function (t) {
                    var o, s, a, l;
                    for (e.json = t,
                        e.pathList = ["/", "/about/", "/works/"],
                        e.pathWorksList = [],
                        e.pathSlideList = ["/"],
                        n.ConstHome.item = new n.ConstHome(t.home),
                        s = t.works.length,
                        i.ConstWork.list = [],
                        i.ConstWork.num = s,
                        r.ConstSlide.list = [n.ConstHome.item],
                        r.ConstSlide.num = s + 1,
                        o = 0; o < s; o++)
                        a = new i.ConstWork(o, t.works[o]),
                        l = a.path,
                        i.ConstWork.list.push(a),
                        r.ConstSlide.list.push(a),
                        e.pathList.push(l),
                        e.pathWorksList.push(l),
                        e.pathSlideList.push(l)
                },
                e
        }();
    t.ConstConfig = s
}, function (e, t, o) {
    "use strict";

    function n(e, t, o) {
        var n = Math.max(0, Math.min(1, (o - e) / (t - e)));
        return n * n * (3 - 2 * n)
    }

    function i(e, t, o) {
        var n = Math.max(0, Math.min(1, (o - e) / t));
        return n * n * (3 - 2 * n)
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.smoothStep = n,
        t.smoothStep2 = i
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e(e) {
            this.three = e,
                this.model = e.model,
                this.video = this.model.video,
                this.mesh = e.mesh,
                this.material = e.material,
                this.uniforms = e.uniforms,
                this.texture1 = e.texture1,
                this.texture2 = e.texture2
        }
        return e
    }();
    t.ControllerThreeListItemBase = n
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = o(15),
        s = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        zoomCancel: !1,
                        zoom: !1,
                        visible: !1,
                        play: !1
                    }
                },
                t.prototype.init = function () {
                    this.video = r.VideoPlayer.list[0]
                },
                t
        }(i.Model);
    t.ModelHome = s,
        t.modelHome = new s
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(4),
        r = o(5),
        s = o(111),
        a = o(110),
        l = o(13),
        u = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.init = function () {
                    return this._initThree(),
                        s.controllerThreeTextTexture.init(),
                        a.controllerThreeTextOpacity.init(),
                        this
                },
                t.prototype._initThree = function () {
                    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1),
                        this.textureCurrent = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter),
                        this.textureNext = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
                    var e = {
                            time: {
                                value: l.uniformTime.value
                            },
                            texture: {
                                value: this.textureCurrent
                            },
                            opacity: {
                                value: 1
                            },
                            progress: {
                                value: 0
                            },
                            offset: {
                                value: new THREE.Vector3(0, 0, 10)
                            }
                        },
                        t = {
                            time: {
                                value: l.uniformTime.value
                            },
                            texture: {
                                value: this.textureNext
                            },
                            opacity: {
                                value: 1
                            },
                            progress: {
                                value: 0
                            },
                            offset: {
                                value: new THREE.Vector3(0, 0, 10)
                            }
                        },
                        n = new THREE.RawShaderMaterial({
                            depthTest: !1,
                            transparent: !0,
                            vertexShader: o(34),
                            fragmentShader: o(33),
                            uniforms: e
                        }),
                        r = new THREE.RawShaderMaterial({
                            depthTest: !1,
                            transparent: !0,
                            vertexShader: o(34),
                            fragmentShader: o(33),
                            uniforms: t
                        }),
                        s = new THREE.Mesh(this.geometry, n);
                    i.threeManager.container.add(s),
                        this.meshCurrent = s,
                        this.materialCurrent = this.meshCurrent.material,
                        this.uniformsCurrent = this.materialCurrent.uniforms;
                    var a = new THREE.Mesh(this.geometry, r);
                    i.threeManager.container.add(a),
                        this.meshNext = a,
                        this.materialNext = this.meshNext.material,
                        this.uniformsNext = this.materialNext.uniforms
                },
                t
        }(r.Event);
    t.ThreeText = u,
        t.threeText = new u
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(5),
        r = function (e) {
            function t(t) {
                var o = e.call(this) || this;
                return o._onMouseOver = function (e) {
                        var t = e.relatedTarget;
                        t && (t === o.element || o.element.contains(t)) || o.trigger("mouseenter", [e])
                    },
                    o._onMouseOut = function (e) {
                        var t = e.relatedTarget;
                        t && (t === o.element || o.element.contains(t)) || o.trigger("mouseleave", [e])
                    },
                    o.element = t,
                    o
            }
            return n(t, e),
                t.prototype.start = function () {
                    return this.element.addEventListener("mouseover", this._onMouseOver),
                        this.element.addEventListener("mouseout", this._onMouseOut),
                        this
                },
                t.prototype.stop = function () {
                    return this.element.removeEventListener("mouseover", this._onMouseOver),
                        this.element.removeEventListener("mouseout", this._onMouseOut),
                        this
                },
                t
        }(i.Event);
    t.ElementEvent = r
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e(e) {
            this.model = e,
                this.element = e.element,
                this.button = e.button
        }
        return e
    }();
    t.ControllerListItemBase = n
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e(e) {
            this.three = e,
                this.model = e.model,
                this.video = this.model.video,
                this.mesh = e.mesh,
                this.material = e.material,
                this.uniforms = e.uniforms,
                this.texture = e.texture
        }
        return e
    }();
    t.ControllerThreeHomeBase = n
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = function () {
        function e() {}
        return e.prototype.init = function () {
                n = this.value = new THREE.Vector4(0, 0, 0, 0)
            },
            e.prototype.update = function (e, t) {
                n.set(e, t, e / t, e > t ? e : t)
            },
            e
    }();
    t.UniformPixels = i,
        t.uniformPixels = new i
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = 0,
        s = 0,
        a = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onMouseMove = function (e) {
                        r = e.clientX,
                            s = e.clientY,
                            requestAnimationFrame(t._onRAF)
                    },
                    t._onRAF = function () {
                        t.set({
                            x: r,
                            y: s
                        })
                    },
                    t
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        x: 0,
                        y: 0
                    }
                },
                t.prototype.start = function () {
                    return window.addEventListener("mousemove", this._onMouseMove),
                        this
                },
                t.prototype.stop = function () {
                    return window.removeEventListener("mousemove", this._onMouseMove),
                        cancelAnimationFrame(void 0),
                        this
                },
                t
        }(i.Model);
    t.pointer = new a
}, function (e, t, o) {
    "use strict";

    function n(e) {
        e = e > 0 ? 1 : -1,
            S !== e && (S = e,
                _ = [],
                y = 0)
    }

    function i(e) {
        if (n(e),
            1 != h) {
            var o = Date.now(),
                i = o - y;
            if (i < d) {
                var r = (1 + 50 / i) / 2;
                r > 1 && (r = Math.min(r, h),
                    e *= r)
            }
            y = Date.now()
        }
        if (_.push({
                y: e,
                lastY: e < 0 ? .99 : -.99,
                start: Date.now()
            }),
            !g) {
            var s = function () {
                for (var o = Date.now(), n = 0, i = 0; i < _.length; i++) {
                    var r = _[i],
                        a = o - r.start,
                        l = a >= w,
                        u = l ? 1 : a / w,
                        c = Math.pow(1 - u, T),
                        d = r.y * u - r.lastY >> 0;
                    n += d * c,
                        r.lastY += d,
                        l && (_.splice(i, 1),
                            i--)
                }
                t.smoothScroll.trigger("scroll", [n]),
                    e || (_ = []),
                    _.length ? requestAnimationFrame(s) : g = !1
            };
            requestAnimationFrame(s),
                g = !0
        }
    }
    var r = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var s, a, l = o(5),
        u = 300,
        c = 250,
        d = 50,
        h = 3,
        p = 100,
        f = 4,
        m = 1,
        v = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            spacebar: 32,
            pageup: 33,
            pagedown: 34,
            end: 35,
            home: 36
        },
        _ = [],
        g = !1,
        y = Date.now(),
        S = 0,
        T = 4,
        w = 1e3,
        x = 0,
        C = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.wheelTime = 1e3,
                    t.disabledKey = !1,
                    t._onWheel = function (e) {
                        if (a)
                            return e.preventDefault(),
                                !1;
                        if (e.defaultPrevented || e.ctrlKey)
                            return !0;
                        var o = e.deltaY || 0;
                        1 === e.deltaMode && (o *= 50),
                            Math.abs(o) > 1.2 && (o *= c / 120),
                            w = t.wheelTime,
                            T = f,
                            i(o),
                            e.preventDefault()
                    },
                    t._onKeydown = function (e) {
                        if (a || t.disabledKey)
                            return e.preventDefault(),
                                !1;
                        var o = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== v.spacebar;
                        if (!e.defaultPrevented && !o) {
                            var n, r = 0,
                                s = window.innerHeight;
                            switch (e.keyCode) {
                                case v.up:
                                    r = -p;
                                    break;
                                case v.down:
                                    r = p;
                                    break;
                                case v.spacebar:
                                    n = e.shiftKey ? 1 : -1,
                                        r = -n * s * 1.8;
                                    break;
                                case v.pageup:
                                    r = 1.8 * -s;
                                    break;
                                case v.pagedown:
                                    r = 1.8 * s;
                                    break;
                                case v.home:
                                    r = -document.body.scrollTop;
                                    break;
                                case v.end:
                                    var l = document.body.scrollHeight - document.body.scrollTop,
                                        c = l - s;
                                    r = c > 0 ? c + 10 : 0;
                                    break;
                                default:
                                    return !0
                            }
                            w = u,
                                T = m,
                                i(r),
                                e.preventDefault()
                        }
                    },
                    t
            }
            return r(t, e),
                t.prototype.init = function () {
                    return this
                },
                Object.defineProperty(t.prototype, "isStart", {
                    get: function () {
                        return s
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                t.prototype.start = function () {
                    return s = !0,
                        window.addEventListener("wheel", this._onWheel),
                        window.addEventListener("keydown", this._onKeydown),
                        this
                },
                t.prototype.stop = function () {
                    return s = !1,
                        window.removeEventListener("wheel", this._onWheel),
                        window.removeEventListener("keydown", this._onKeydown),
                        this
                },
                t.prototype.toggle = function () {
                    s ? this.stop() : this.start()
                },
                t.prototype.disable = function () {
                    x = document.body.scrollTop,
                        a = !0
                },
                t.prototype.reset = function () {
                    document.body.scrollTop = x
                },
                t.prototype.enable = function () {
                    a = !1
                },
                t
        }(l.Event);
    t.SmoothScroll = C,
        t.smoothScroll = new C
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r, s, a = o(5),
        l = o(11),
        u = o(83),
        c = o(9),
        d = o(3),
        h = o(14),
        p = o(0),
        f = 1,
        m = 0,
        v = 0,
        _ = 0,
        g = 0,
        y = function (e) {
            function t(t) {
                var o = e.call(this) || this;
                return o.indexSlide = t,
                    o.canvas = document.createElement("canvas"),
                    o.context = o.canvas.getContext("2d"),
                    o
            }
            return n(t, e),
                t.draw = function () {
                    h.Q.html.classList.add("isDrawingL");
                    var e, o;
                    for (t.large = {
                            list: []
                        },
                        t.short = {
                            list: []
                        },
                        t.list = [],
                        o = l.ConstSlide.num,
                        e = 0; e < o; e++)
                        t.list[e] = new t(e);
                    m = 0,
                        v = 0,
                        _ = 0,
                        g = 0,
                        i = TimelinePlus.call(t._draw).delay(.1)
                },
                t._draw = function () {
                    var e;
                    if (v < l.ConstSlide.num)
                        e = t.list[v],
                        e.drawCapture(),
                        _ < e.originalHeight && (_ = e.originalHeight,
                            g = v),
                        i && i.kill(),
                        i = TimelinePlus.call(t._draw).delay(.1);
                    else {
                        if (t._copy(),
                            0 == m)
                            return h.Q.html.classList.remove("isDrawingL"),
                                h.Q.html.classList.add("isDrawingS"),
                                v = 0,
                                _ = 0,
                                g = 0,
                                m = 1,
                                i && i.kill(),
                                void(i = TimelinePlus.call(t._draw).delay(.1));
                        t._destroy(),
                            p.modelState.trigger("canvasDraw"),
                            h.Q.html.classList.remove("isDrawingS"),
                            ++m
                    }
                    ++v
                },
                t._copy = function () {
                    var e, o, n, i;
                    for (o = l.ConstSlide.num,
                        n = t.list[g],
                        i = 0 == m ? t.large : t.short,
                        r = i.width = n.originalWidth,
                        s = i.height = n.originalHeight,
                        i.offsetY = n.offsetY,
                        f = d.resize.get("ratio"),
                        e = 0; e < o; e++)
                        n = t.list[e],
                        n.drawTexture(),
                        i.list[e] = n.canvasTexture
                },
                t._destroy = function () {
                    var e, o, n;
                    for (o = l.ConstSlide.num,
                        e = 0; e < o; e++)
                        n = t.list[e],
                        n.destroy(),
                        t.list[e] = null;
                    t.list = null
                },
                t.prototype.destroy = function () {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height),
                        this.indexSlide = null,
                        this.canvas = null,
                        this.canvasTexture = null,
                        this.context = null,
                        this.contextTexture = null,
                        this.offsetY = null,
                        this.originalWidth = null,
                        this.originalHeight = null,
                        this.originalCanvasWidth = null,
                        this.originalCanvasHeight = null
                },
                t.prototype.drawCapture = function () {
                    0 == this.indexSlide ? u.captureHome(this) : u.captureWork(this, c.ConstWork.list[this.indexSlide - 1])
                },
                t.prototype.drawTexture = function () {
                    var e = r,
                        t = s,
                        o = e * f,
                        n = t * f;
                    this.canvasTexture = document.createElement("canvas"),
                        this.contextTexture = this.canvasTexture.getContext("2d"),
                        this.canvasTexture.width = o,
                        this.canvasTexture.height = n,
                        this.contextTexture.clearRect(0, 0, o, n),
                        this.contextTexture.drawImage(this.canvas, 0, (t * f - this.originalCanvasHeight) / 2, this.originalCanvasWidth, this.originalCanvasHeight)
                },
                t
        }(a.Event);
    t.CanvasText = y
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(4),
        r = o(5),
        s = o(100),
        a = o(13),
        l = o(39),
        u = 2 * Math.PI,
        c = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.init = function () {
                    return this._initGeometry(),
                        this._initMesh(),
                        s.controllerThreeBlack.init(),
                        this
                },
                t.prototype._initGeometry = function () {
                    var e, t, o, n, i, r = new THREE.BufferGeometry,
                        s = new Float32Array(780);
                    for (s[0] = s[1] = s[2] = 0,
                        s[3] = s[4] = s[5] = 0,
                        e = 0; e < 129; e++) {
                        switch (t = 6 * (e + 1),
                            o = (e / 128 - .125) * u,
                            n = Math.floor(e / 32) % 4,
                            i = e % 32 / 32 - .5,
                            s[t + 0] = .5 * Math.cos(o),
                            s[t + 1] = .5 * Math.sin(o),
                            s[t + 2] = 0,
                            n) {
                            case 0:
                                s[t + 3] = .5,
                                    s[t + 4] = i;
                                break;
                            case 1:
                                s[t + 3] = -i,
                                    s[t + 4] = .5;
                                break;
                            case 2:
                                s[t + 3] = -.5,
                                    s[t + 4] = -i;
                                break;
                            case 3:
                                s[t + 3] = i,
                                    s[t + 4] = -.5
                        }
                        s[t + 5] = 0
                    }
                    var a = new Uint16Array(384);
                    for (e = 0; e < 128; e++)
                        t = 3 * e,
                        a[t + 0] = 0,
                        a[t + 1] = e + 1,
                        a[t + 2] = e + 2;
                    r.setIndex(new THREE.BufferAttribute(a, 1));
                    var l = new THREE.InterleavedBuffer(s, 6);
                    r.addAttribute("position", new THREE.InterleavedBufferAttribute(l, 3, 0, !1)),
                        r.addAttribute("position2", new THREE.InterleavedBufferAttribute(l, 3, 3, !1)),
                        this.geometry = r
                },
                t.prototype._initMesh = function () {
                    var e = {
                            time: {
                                value: a.uniformTime.value
                            },
                            size: {
                                value: l.uniformSize.value
                            },
                            center: {
                                value: new THREE.Vector2
                            },
                            progress: {
                                value: new THREE.Vector4(0, 0, 0, 0)
                            },
                            corners: {
                                value: new THREE.Vector4(1, 1, 1, 1)
                            },
                            opacity: {
                                value: 1
                            }
                        },
                        t = new THREE.RawShaderMaterial({
                            depthTest: !1,
                            blending: THREE.NormalBlending,
                            side: THREE.FrontSide,
                            transparent: !0,
                            vertexShader: o(70),
                            fragmentShader: o(69),
                            uniforms: e
                        }),
                        n = new THREE.Mesh(this.geometry, t);
                    i.threeManager.container.add(n),
                        this.mesh = n,
                        this.material = this.mesh.material,
                        this.uniforms = this.material.uniforms
                },
                t
        }(r.Event);
    t.ThreeBlack = c,
        t.threeBlack = new c
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(4),
        r = o(5),
        s = o(109),
        a = o(17),
        l = o(13),
        u = o(27),
        c = o(108),
        d = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.init = function () {
                    return this.model = a.modelSlide,
                        this._initThree(),
                        this.controller = new c.ControllerThreeSlide(this),
                        this.controllerTexture = new s.ControllerThreeSlideTexture(this),
                        this
                },
                t.prototype._initThree = function () {
                    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
                    var e = {
                            time: {
                                value: l.uniformTime.value
                            },
                            pixels: {
                                value: u.uniformPixels.value
                            },
                            texture1: {
                                value: new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter)
                            },
                            texture2: {
                                value: new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter)
                            },
                            uvRate1: {
                                value: new THREE.Vector4(1, 1, 1, 1)
                            },
                            uvRate2: {
                                value: new THREE.Vector4(1, 1, 1, 1)
                            },
                            progress: {
                                value: 0
                            },
                            mask: {
                                value: new THREE.Vector3(1, 1, 0)
                            },
                            translateDelay: {
                                value: new THREE.Vector4(-.5, 1, 1, 2)
                            },
                            accel: {
                                value: new THREE.Vector2(.5, 2)
                            },
                            waveAmpFreq: {
                                value: new THREE.Vector4(0, .5, 0, 4)
                            },
                            waveSpeedBlend: {
                                value: new THREE.Vector4(0, .3, .5, .5)
                            }
                        },
                        t = new THREE.RawShaderMaterial({
                            blending: THREE.NormalBlending,
                            side: THREE.FrontSide,
                            transparent: !0,
                            vertexShader: o(76),
                            fragmentShader: o(75),
                            uniforms: e
                        }),
                        n = new THREE.Mesh(this.geometry, t);
                    i.threeManager.container.add(n),
                        this.mesh = n,
                        this.material = this.mesh.material,
                        this.uniforms = this.material.uniforms
                },
                t
        }(r.Event);
    t.ThreeSlide = d,
        t.threeSlide = new d
}, function (e, t) {
    e.exports = "precision highp float;\nvarying vec2 vUv;\nvarying float vAlpha;\nuniform sampler2D texture;\nvoid main(void) {\n vec4 rgba = texture2D(texture, vUv);\n rgba.a *= vAlpha;\n gl_FragColor = rgba;\n}\n"
}, function (e, t) {
    e.exports = "precision highp float;\n#define PI_2 6.283185307179586\nfloat exponentialOut(float t) {\n return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\nattribute vec3 position;\nattribute vec2 uv;\nvarying vec2 vUv;\nvarying float vAlpha;\nuniform float opacity;\nuniform float progress;\nuniform vec3 offset;\nuniform vec4 time;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nvoid main(void) {\n vUv = uv;\n vec3 posSway = position;\n vec3 wave = offset;\n wave.y += sin(time.y * 0.2 + uv.x * 2.0 * PI_2 + uv.y * 4.0 * PI_2) * 15.0;\n posSway += wave;\n vec2 d = sin(vUv * vec2(1.0, 2.0) * PI_2) * 0.25 + 0.25;\n float s = smoothstep(0.0, 1.0, progress - d.x - d.y);\n vec3 pos = mix(position, posSway, s);\n vAlpha = exponentialOut(1.0 - s) * opacity;\n gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}"
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.Random = {
            range: function (e, t, o) {
                void 0 === e && (e = 0),
                    void 0 === t && (t = 1),
                    void 0 === o && (o = 1),
                    0 == o && (o = 1 / Number.MAX_VALUE);
                var n = Math.random() * (t - e) + e;
                return Math.round(n / o) * o
            },
            ranges: function (e, t, o) {
                void 0 === e && (e = 0),
                    void 0 === t && (t = 1),
                    void 0 === o && (o = 1),
                    0 == o && (o = 1 / Number.MAX_VALUE);
                var n = Math.random() * (t - e) + e;
                return Math.round(n / o) * o * (Math.random() < .5 ? 1 : -1)
            }
        }
}, function (e, t, o) {
    "use strict";

    function n(e, t) {
        void 0 === t && (t = 0);
        var o, n;
        for (n = [],
            o = 0; o < e; o++)
            n.push(o + t);
        return n
    }

    function i(e, t) {
        void 0 === t && (t = 0);
        var o, i, r, s;
        for (r = n(e, t),
            s = []; o = r.length;)
            i = Math.random() * o | 0,
            s.push(r.splice(i, 1)[0]);
        return s
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.createAscendArray = n,
        t.createRandomArray = i;
    var r = function () {
        function e(e) {
            this._list = e,
                this._length = this._list ? this._list.length : 0
        }
        return e.prototype.getCurrent = function () {
                return this._indexList ? this._list[this._index] : null
            },
            e.prototype.getNext = function () {
                return this._random(),
                    this._index = this._indexList.shift(),
                    this._list[this._index]
            },
            e.prototype._random = function () {
                this._indexList && this._indexList.length > 0 || (this._indexList = i(this._length),
                    this._index === this._indexList[0] && (this._indexList = this._indexList.reverse()))
            },
            e
    }();
    t.RandomArray = r
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e(e) {
            this.three = e,
                this.model = e.model,
                this.mesh = e.mesh,
                this.material = e.material,
                this.uniforms = e.uniforms,
                this.texture1 = e.texture1,
                this.texture2 = e.texture2
        }
        return e
    }();
    t.ControllerThreeSlideBase = n
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = 0,
        s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.x = 0,
                    t.y = 0,
                    t
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        running: !1
                    }
                },
                t.prototype.add = function () {
                    this.trigger("update"),
                        ++r > 1 || this.set({
                            running: !0
                        })
                },
                t.prototype.remove = function () {
                    r > 0 && --r,
                        r > 0 || this.set({
                            running: !1
                        })
                },
                t
        }(i.Model);
    t.ModelThreeRayCaster = s,
        t.modelThreeRayCaster = new s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = function () {
        function e() {}
        return e.prototype.init = function () {
                n = this.value = new THREE.Vector4(0, 0, 0, 0)
            },
            e.prototype.update = function (e, t) {
                n.set(e, t, e / t, e > t ? e : t)
            },
            e
    }();
    t.UniformSize = i,
        t.uniformSize = new i
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.ready = function (e) {
            function t() {
                o.removeEventListener("DOMContentLoaded", t),
                    n.removeEventListener("load", t),
                    e()
            }
            var o = document,
                n = window;
            "complete" === o.readyState || "loading" !== document.readyState && !document.documentElement.doScroll ? setTimeout(e, 0) : (o.addEventListener("DOMContentLoaded", t),
                n.addEventListener("load", t))
        }
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.Style = {
            size: function (e, t, o) {
                var n, i, r;
                if (e)
                    for (void 0 === e.length && (e = [e]),
                        i = e.length,
                        n = 0; n < i; n++)
                        r = e[n],
                        r.style.width = t + "px",
                        r.style.height = o + "px"
            },
            positionLT: function (e, t, o) {
                var n, i, r;
                if (e)
                    for (void 0 === e.length && (e = [e]),
                        i = e.length,
                        n = 0; n < i; n++)
                        r = e[n],
                        r.style.left = t + "px",
                        r.style.top = o + "px"
            },
            positionRT: function (e, t, o) {
                var n, i, r;
                if (e)
                    for (void 0 === e.length && (e = [e]),
                        i = e.length,
                        n = 0; n < i; n++)
                        r = e[n],
                        r.style.right = t + "px",
                        r.style.top = o + "px"
            },
            display: function (e, t) {
                var o, n, i;
                if (e)
                    for (void 0 === e.length && (e = [e]),
                        n = e.length,
                        o = 0; o < n; o++)
                        i = e[o],
                        i.style.display = t
            }
        }
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = 0,
        i = function () {
            function e() {
                this._onTouchEnd = function (e) {
                        var t = (new Date).getTime();
                        t - n <= 500 && e.preventDefault(),
                            n = t
                    },
                    this._onTouchStart = function (e) {
                        e.touches.length > 1 && e.preventDefault()
                    }
            }
            return e.prototype.start = function () {
                    document.addEventListener("touchstart", this._onTouchStart, !1),
                        document.addEventListener("touchend", this._onTouchEnd, !1)
                },
                e.prototype.stop = function () {
                    document.removeEventListener("touchstart", this._onTouchStart, !1),
                        document.removeEventListener("touchend", this._onTouchEnd, !1)
                },
                e
        }();
    t.disabledZoom = new i
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = o(1),
        r = o(24),
        s = o(2),
        a = function () {
            function e() {
                this._onMouseEnter = function (e) {
                    var t, o, i, r, a = e.currentTarget;
                    for (s.routeManagerPlus.trigger("loop"),
                        a.classList.remove("isHover"),
                        o = n.length,
                        t = 0; t < o; t++)
                        if (i = n[t],
                            i.element == a) {
                            r = i.tween,
                                r && r.kill();
                            break
                        }
                    r = TimelinePlus.seri(TimelinePlus.call(a.classList.add, ["isHover"], a.classList), TimelinePlus.wait(1), TimelinePlus.call(a.classList.remove, ["isHover"], a.classList)).delay(2 / 60),
                        i.tween = r
                }
            }
            return e.prototype.init = function () {
                    var e, t, o;
                    for (n = [],
                        t = i.SC.buttonHover.length,
                        e = 0; e < t; e++)
                        o = new r.ElementEvent(i.SC.buttonHover[e]),
                        o.start().on("mouseenter", this._onMouseEnter),
                        n[e] = o
                },
                e
        }();
    t.ControllerHover = a,
        t.controllerHover = new a
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = o(2),
        r = o(14),
        s = function () {
            function e() {
                var e = this;
                this._onLoop = function () {
                        n && n.kill(),
                            n = TimelinePlus.seri(TimelinePlus.wait(6), TimelinePlus.call(e._loop)).repeat(-1)
                    },
                    this._loop = function () {
                        r.Q.html.classList.remove("isLoop"),
                            TimelinePlus.seri(TimelinePlus.call(r.Q.html.classList.add, ["isLoop"], r.Q.html.classList), TimelinePlus.wait(.8), TimelinePlus.call(r.Q.html.classList.remove, ["isLoop"], r.Q.html.classList)).delay(2 / 60)
                    }
            }
            return e.prototype.init = function () {
                    i.routeManagerPlus.on(":path", this._onLoop),
                        i.routeManagerPlus.on("loop", this._onLoop),
                        this._onLoop()
                },
                e
        }();
    t.ControllerLoop = s,
        t.controllerLoop = new s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(7),
        i = function () {
            function e() {
                this._onBreakpooint = function () {
                    var e = n.modelMQ.get("breakpoint"),
                        t = "large" == e || "medium" == e || "short" == e,
                        o = "mobile",
                        i = "";
                    t ? (o = "computer",
                        i = "large" == e || "medium" == e ? "large" : "short") : "tablet_l" != e && "tablet_p" != e || (o = "tablet");
                    var r = 0;
                    "large" == e ? r = 3 : "medium" != e && "short" != e || (r = 2),
                        n.modelMQ.set({
                            device: o,
                            mobile: "mobile" == o,
                            computer: t,
                            listCols: r,
                            portrait: "tablet_p" == e || "mobile_p" == e,
                            landscape: "tablet_l" == e || "mobile_l" == e,
                            canvasTextSize: i
                        })
                }
            }
            return e.prototype.init = function () {
                    n.modelMQ.on(":breakpoint", this._onBreakpooint),
                        this._onBreakpooint()
                },
                e
        }();
    t.ControllerMQ = i,
        t.controllerMQ = new i
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(1),
        i = o(2),
        r = o(0),
        s = function () {
            function e() {
                this._onChangeSlide = function () {
                        r.modelState.get("isSlide") || n.SC.menuTriggerClose.setAttribute("href", r.modelState.get("zoomTarget") || "/")
                    },
                    this._onClickOpen = function (e) {
                        e.preventDefault(),
                            i.routeManagerPlus.goto("/works/", null, !0)
                    },
                    this._onClickClose = function (e) {
                        e.preventDefault(),
                            i.routeManagerPlus.goto(r.modelState.get("zoomTarget") || "/", null, !0)
                    }
            }
            return e.prototype.init = function () {
                    n.SC.menuTriggerOpen.addEventListener("click", this._onClickOpen),
                        n.SC.menuTriggerClose.addEventListener("click", this._onClickClose),
                        r.modelState.on(":isSlide", this._onChangeSlide),
                        this._onChangeSlide()
                },
                e
        }();
    t.ControllerMenuTrigger = s,
        t.controllerMenuTrigger = new s
}, function (e, t, o) {
    "use strict";

    function n(e, t) {
        t ? r.Q.html.classList.add(e) : r.Q.html.classList.remove(e)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(0),
        r = o(14),
        s = function () {
            function e() {
                var e = this;
                this._onStart = function () {
                        i.modelState.on(":isList", e._onChangeList),
                            i.modelState.on(":isSlide", e._onChangeSlide),
                            i.modelState.on(":isSlideText", e._onChangeSlideText),
                            i.modelState.on(":isSlideNavi", e._onChangeSlideNavi),
                            i.modelState.on(":slideIndex", e._onChangeSlideIndex),
                            i.modelState.on(":isZoomIn", e._onChangeZoomIn),
                            i.modelState.on(":isZoomOut", e._onChangeZoomOut),
                            i.modelState.on(":isSlideInfoStart", e._onChangeSlideInfoStart),
                            i.modelState.on(":isSlideInfoEnd", e._onChangeSlideInfoEnd),
                            i.modelState.on(":isSlideVimeoStart", e._onChangeSlideVimeoStart),
                            i.modelState.on(":isSlideVimeoEnd", e._onChangeSlideVimeoEnd)
                    },
                    this._onChangeList = function () {
                        var e = i.modelState.get("isList");
                        n("isList", e),
                            e || i.modelState.trigger("scrollTo")
                    },
                    this._onChangeSlide = function () {
                        n("isSlide", i.modelState.get("isSlide"))
                    },
                    this._onChangeZoomIn = function () {
                        n("isZoomIn", i.modelState.get("isZoomIn"))
                    },
                    this._onChangeZoomOut = function () {
                        n("isZoomOut", i.modelState.get("isZoomOut"))
                    },
                    this._onChangeSlideText = function () {
                        n("isSlideText", i.modelState.get("isSlideText"))
                    },
                    this._onChangeSlideNavi = function () {
                        n("isSlideNavi", i.modelState.get("isSlideNavi"))
                    },
                    this._onChangeSlideIndex = function () {
                        var e = 0 == i.modelState.get("slideIndex");
                        n("isSlideHome", e),
                            n("isSlideWorks", !e)
                    },
                    this._onChangeSlideInfoStart = function () {
                        n("isSlideInfoStart", i.modelState.get("isSlideInfoStart"))
                    },
                    this._onChangeSlideInfoEnd = function () {
                        n("isSlideInfoEnd", i.modelState.get("isSlideInfoEnd"))
                    },
                    this._onChangeSlideVimeoStart = function () {
                        n("isSlideVimeoStart", i.modelState.get("isSlideVimeoStart"))
                    },
                    this._onChangeSlideVimeoEnd = function () {
                        n("isSlideVimeoEnd", i.modelState.get("isSlideVimeoEnd"))
                    }
            }
            return e.prototype.init = function () {
                    return this._onStart(),
                        this._onChangeList(),
                        this._onChangeSlide(),
                        this._onChangeSlideIndex(),
                        this
                },
                e
        }();
    t.ControllerState = s,
        t.controllerState = new s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(85),
        i = o(2),
        r = o(0),
        s = o(1),
        a = o(3),
        l = function () {
            function e() {
                var e = this;
                this._onStart = function () {
                        i.routeManagerPlus.on(":path", e._onRoute),
                            i.routeManagerPlus.on("about", e._onAbout),
                            r.modelState.on(":isList", e._onRoute),
                            n.controllerAboutScroll.init(),
                            "/about/" == i.routeManagerPlus.get("path") && e._scroll(.5)
                    },
                    this._onRoute = function () {
                        if (r.modelState.get("isList")) {
                            "/about/" == i.routeManagerPlus.get("path") && e._scroll()
                        }
                    },
                    this._onAbout = function () {
                        r.modelState.get("isList") && e._scroll()
                    }
            }
            return e.prototype.init = function () {
                    return r.modelState.once("start", this._onStart),
                        this
                },
                e.prototype._scroll = function (e) {
                    void 0 === e && (e = 0);
                    var t = s.SC.about.offsetTop,
                        o = t - a.resize.get("innerHeight") / 2 + s.SC.about.clientHeight / 2;
                    TweenMax.to(window, .6, {
                        scrollTo: {
                            y: Math.min(t, o),
                            autoKill: !1
                        },
                        ease: Ease._4_QuartInOut,
                        autoKill: !1
                    }).delay(e)
                },
                e
        }();
    t.ControllerAbout = l,
        t.controllerAbout = new l
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(88),
        i = o(87),
        r = function () {
            function e() {}
            return e.prototype.init = function () {
                    n.controllerBackToTopScroll.init(),
                        i.controllerBackToTopButton.init()
                },
                e
        }();
    t.ControllerBackToTop = r,
        t.controllerBackToTop = new r
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(1),
        i = o(2),
        r = o(7),
        s = function () {
            function e() {
                this._onClickHome = function (e) {
                        e.preventDefault(),
                            i.routeManagerPlus.goto("/", null, !0)
                    },
                    this._onClickAbout = function (e) {
                        e.preventDefault(),
                            "/about/" == i.routeManagerPlus.get("path") ? i.routeManagerPlus.trigger("about") : i.routeManagerPlus.goto("/about/", null, !0)
                    },
                    this._onChangeDevice = function () {
                        var e, t;
                        r.modelMQ.get("mobile") ? (e = "0 0 23 5",
                                t = "0,5 23,5 8,0 8,4 0,4") : (e = "0 0 45 7",
                                t = "0,7 45,7 24,0 24,6 0,6"),
                            n.SC.headerAboutSVG.setAttribute("viewBox", e),
                            n.SC.headerAboutPolyline.setAttribute("points", t)
                    }
            }
            return e.prototype.init = function () {
                    Useragnt.safari && n.SC.headerAbout.removeAttribute("href"),
                        n.SC.headerHome.addEventListener("click", this._onClickHome),
                        n.SC.headerAbout.addEventListener("click", this._onClickAbout),
                        r.modelMQ.on(":mobile", this._onChangeDevice),
                        this._onChangeDevice()
                },
                e
        }();
    t.ControllerHeader = s,
        t.controllerHeader = new s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(89),
        i = function () {
            function e() {}
            return e.prototype.init = function () {
                    n.controllerHomeRoute.init()
                },
                e
        }();
    t.ControllerHome = i,
        t.controllerHome = new i
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r, s = o(1),
        a = o(16),
        l = o(93),
        u = o(91),
        c = o(92),
        d = o(94),
        h = o(90),
        p = o(0),
        f = function () {
            function e() {
                this._onStart = function () {
                    p.modelState.get("isList") && TweenMax.to([s.SC.list, s.SC.about], .5, {
                        autoAlpha: 1,
                        ease: Ease._1_SineOut
                    })
                }
            }
            return e.prototype.init = function () {
                    var e, t, o;
                    for (t = s.SC.listItems.length,
                        n = [],
                        i = [],
                        r = [],
                        e = 0; e < t; e++)
                        o = a.modelList.items[e],
                        n[e] = new l.ControllerListItemScroll(o),
                        i[e] = new u.ControllerListItemButton(o),
                        r[e] = new c.ControllerListItemRoute(o);
                    h.controllerListHomeScroll.init(),
                        d.controllerListLayout.init(),
                        p.modelState.once("start", this._onStart)
                },
                e
        }();
    t.ControllerList = f,
        t.controllerList = new f
}, function (e, t, o) {
    "use strict";

    function n(e, t) {
        var o, n, i = [e];
        for (o = 1; o < t; o++)
            n = e + o,
            n < t - 1 && i.push(n),
            (n = e - o) >= -1 && i.push(n);
        return i
    }
    var i = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = o(5),
        s = o(116),
        a = o(2),
        l = o(15),
        u = o(9),
        c = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onReady = function () {
                        t.trigger("ready")
                    },
                    t
            }
            return i(t, e),
                t.prototype.init = function () {
                    var e, t, o, i, r, c = a.routeManagerPlus.get("path");
                    if ("/" == c || "/works/" == c)
                        e = l.VideoPlayer.list.concat();
                    else if ("/about/" == c)
                        e = l.VideoPlayer.list.concat().reverse();
                    else
                        for (t = a.routeManagerPlus.getWorksIndexByPath(c),
                            r = u.ConstWork.num + 1,
                            o = n(t, r),
                            e = [],
                            i = 0; i < r; i++)
                            e[i] = l.VideoPlayer.list[o[i] + 1];
                    s.preloadVideoList.on("ready", this._onReady),
                        s.preloadVideoList.load(e)
                },
                t
        }(r.Event);
    t.ControllerPreloadVideo = c,
        t.controllerPreloadVideo = new c
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = o(97),
        r = o(95),
        s = o(96),
        a = o(98),
        l = o(0),
        u = o(1),
        c = o(7),
        d = o(8),
        h = function () {
            function e() {
                var e = this;
                this._onStart = function () {
                        l.modelState.on(":isSlide", e._onChangeSlide),
                            e._onChangeSlide(),
                            Useragnt.pc || l.modelState.on(":isSlideInfo", e._onChangeSlideInfo)
                    },
                    this._onChangeSlide = function () {
                        l.modelState.get("isSlide") ? (Useragnt.pc || (window.removeEventListener("touchmove", e._onTouchMove),
                                window.addEventListener("touchmove", e._onTouchMove, {
                                    passive: !1
                                })),
                            Useragnt.ios && Useragnt.mobile && (n = TimelinePlus.seri(TimelinePlus.wait(.2), TimelinePlus.call(e._onResize)),
                                d.index.on("resize", e._onResize),
                                e._onResize())) : (window.scrollTo(0, 0),
                            l.modelState.trigger("scrollTo"),
                            Useragnt.pc || window.removeEventListener("touchmove", e._onTouchMove),
                            Useragnt.ios && Useragnt.mobile && (n && n.kill(),
                                d.index.off("resize", e._onResize)))
                    },
                    this._onChangeSlideInfo = function () {
                        l.modelState.get("isSlideInfo") ? window.removeEventListener("touchmove", e._onTouchMove) : (window.removeEventListener("touchmove", e._onTouchMove),
                            window.addEventListener("touchmove", e._onTouchMove, {
                                passive: !1
                            }))
                    },
                    this._onTouchMove = function (e) {
                        e.preventDefault()
                    },
                    this._onResize = function () {
                        c.modelMQ.get("landscape") ? (window.scrollTo(0, 0),
                            u.SC.main.style.height = window.innerHeight + "px") : u.SC.main.style.height = null
                    }
            }
            return e.prototype.init = function () {
                    i.controllerSlideNavi.init(),
                        r.controllerSlideDetails.init(),
                        s.controllerSlideInfo.init(),
                        a.controllerSlideVimeo.init(),
                        l.modelState.once("start", this._onStart)
                },
                e
        }();
    t.ControllerSlide = h,
        t.controllerSlide = new h
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r, s = o(32),
        a = o(2),
        l = o(4),
        u = o(0),
        c = o(29),
        d = o(1),
        h = o(17),
        p = o(81),
        f = o(9),
        m = o(11),
        v = o(3),
        _ = .002,
        g = .9,
        y = .02,
        S = 2e-4,
        T = 5e-4,
        w = .85,
        x = .05,
        C = .8,
        b = .25 * x,
        M = .035,
        P = 0,
        E = 0,
        O = 0,
        k = 0,
        R = 0,
        H = 0,
        L = 0,
        I = 0,
        A = 0,
        z = 0,
        V = 1,
        j = 0,
        W = !1,
        N = !1,
        F = !1,
        U = 0,
        D = 0,
        Y = function () {
            function e() {
                var e = this;
                this.positionTarget = 0,
                    this._onStart = function () {
                        a.routeManagerPlus.on(":path", e._onChangeRoute),
                            u.modelState.on(":slideIndex", e._onChangeSlideIndex),
                            u.modelState.on(":isSlide", e._onChangeStateSlide),
                            u.modelState.on(":isSliding", e._onChangeStateSliding),
                            u.modelState.on(":isSlideNavi", e._onChangeSlideNavi),
                            u.modelState.on(":isSlideInfo", e._onChangeSlideInfo),
                            u.modelState.on(":isSlideVimeo", e._onChangeSlideVimeo),
                            e._onChangeSlideNavi(),
                            u.modelState.get("isSlide") ? (e.enable(.5),
                                e.start()) : (e.disable(),
                                e.stop())
                    },
                    this._onChangeSlideIndex = function () {
                        j = 0,
                            i && i.kill(),
                            i = TimelinePlus.call(e._onChangeSlideComplete).delay(.7),
                            W || u.modelState.set({
                                isSlideNavi: !1,
                                isSlideText: !1
                            })
                    },
                    this._onChangeSlideComplete = function () {
                        var t = u.modelState.get("slideIndex");
                        a.routeManagerPlus.gotoSlide(t, !1),
                            u.modelState.set({
                                isSlideText: !0
                            }),
                            i && i.kill(),
                            i = TimelinePlus.call(e._onChangeSlideComplete2).delay(.4)
                    },
                    this._onChangeSlideComplete2 = function () {
                        u.modelState.set({
                            isSlideNavi: !0
                        })
                    },
                    this._onChangeStateSlide = function () {
                        var t = u.modelState.get("isSlide"),
                            o = a.routeManagerPlus.get("path"),
                            n = u.modelState.get("zoomTarget");
                        t ? (e.start(),
                            o != n ? (V = .075,
                                "/" == o ? e._targetTween(0) : e._targetTween(a.routeManagerPlus.getWorksIndexByPath(o) + 1)) : e.enable()) : (e.disable(),
                            e.stop())
                    },
                    this._onChangeStateSliding = function () {
                        if (!u.modelState.get("isSliding")) {
                            var e = a.routeManagerPlus.get("path"),
                                t = a.routeManagerPlus.get("pop"),
                                o = u.modelState.get("isSlide");
                            if (!t || !o)
                                return;
                            a.routeManagerPlus.isList(e) && u.modelState.set({
                                isSlide: !1,
                                zoomTarget: a.routeManagerPlus.getPathBySlideIndex(u.modelState.get("slideIndex"))
                            })
                        }
                    },
                    this._onChangeRoute = function () {
                        var t = a.routeManagerPlus.get("path"),
                            o = a.routeManagerPlus.get("pop"),
                            n = u.modelState.get("isSlide"),
                            i = u.modelState.get("isSliding");
                        o && n && (a.routeManagerPlus.isSlide(t) ? (V = .15,
                            "/" == t ? e._targetTween(0) : e._targetTween(a.routeManagerPlus.getWorksIndexByPath(t) + 1)) : (u.modelState.slideDir = 1,
                            i ? (V = .5,
                                e._currentTween()) : u.modelState.set({
                                isSlide: !1,
                                zoomTarget: a.routeManagerPlus.getPathBySlideIndex(u.modelState.get("slideIndex"))
                            })))
                    },
                    this._onSmoothScroll = function (e) {
                        e = e > 0 ? 1 : -1,
                            O += e * _
                    },
                    this._onWheel = function (e) {
                        k += e.deltaY * S
                    },
                    this._onTouchStart = function (e) {
                        U = e.clientX,
                            D = e.clientY
                    },
                    this._onTouchEnd = function (e) {
                        U = 0,
                            D = 0
                    },
                    this._onTouchMove = function (e) {
                        var t = e.clientX,
                            o = e.clientY;
                        E -= (t - U + (o - D)) * T,
                            U = t,
                            D = o
                    },
                    this._onRAF = function (t, o) {
                        var n = 60 * o;
                        if (W)
                            R += (e.positionTarget - R) * V * n;
                        else if (O = O < 0 ? Math.max(O, -y) : Math.min(O, y),
                            k += O * n,
                            k += E * n,
                            k = k < 0 ? Math.max(k, -x) : Math.min(k, x),
                            R += k,
                            E *= w,
                            O *= g,
                            k *= C,
                            Math.abs(k) < b) {
                            var i = Math.round(R),
                                r = Ease._1_SineOut.getRatio(i - R);
                            R += r * M * n
                        }
                        var i = Math.round(R);
                        Math.abs(i - R) < .001 ? (R = i,
                                u.modelState.set({
                                    isSliding: !1
                                })) : u.modelState.set({
                                isSliding: !0
                            }),
                            e._calc(),
                            h.modelSlide.set({
                                texture1: I - 1,
                                texture2: A - 1
                            }),
                            s.threeSlide.uniforms.progress.value = L,
                            W || (u.modelState.slideDir = k < 0 ? -1 : 1,
                                u.modelState.set({
                                    slideIndex: L < .5 ? I : A
                                }))
                    },
                    this._onChangeSlideInfo = function () {
                        u.modelState.get("isSlideInfo") ? e.pause() : e.resume()
                    },
                    this._onChangeSlideVimeo = function () {
                        u.modelState.get("isSlideVimeo") ? e.pause() : e.resume()
                    },
                    this._onChangeSlideNavi = function () {
                        u.modelState.get("isSlideNavi") ? l.threeManager.off("draw", e._onRAFCount) : l.threeManager.on("draw", e._onRAFCount)
                    },
                    this._onRAFCount = function () {
                        var e, t;
                        d.SC.slideNaviCountPrev.textContent = m.ConstSlide.list[I].idString,
                            d.SC.slideNaviCountNext.textContent = m.ConstSlide.list[A].idString,
                            e = L,
                            t = Ease._1_SineInOut.getRatio(1 - L),
                            TweenMax.set(d.SC.slideNaviCountPrev, {
                                y: -25 * e,
                                autoAlpha: t
                            }),
                            e = L - 1,
                            t = Ease._1_SineInOut.getRatio(L),
                            TweenMax.set(d.SC.slideNaviCountNext, {
                                y: -25 * e,
                                autoAlpha: t
                            })
                    }
            }
            return e.prototype.init = function () {
                    P = m.ConstSlide.num,
                        r = new p.Touch1(window, !1),
                        d.SC.slideNaviCountTotal.textContent = ("000" + f.ConstWork.num).slice(-3),
                        u.modelState.get("isSlide") ? h.modelSlide.set({
                            visible: !0
                        }) : h.modelSlide.set({
                            visible: !1
                        }),
                        u.modelState.once("start", this._onStart)
                },
                e.prototype.start = function () {
                    N = !1,
                        l.threeManager.on("draw", this._onRAF),
                        R = a.routeManagerPlus.getSlideIndexByPath(u.modelState.get("zoomTarget")),
                        this._calc(),
                        u.modelState.set({
                            slideIndex: R
                        }),
                        h.modelSlide.set({
                            texture1: R - 1,
                            texture2: R - 1
                        }, {
                            silent: !0
                        }),
                        h.modelSlide.set({
                            visible: !0
                        })
                },
                e.prototype.stop = function () {
                    N = !0,
                        l.threeManager.off("draw", this._onRAF),
                        h.modelSlide.set({
                            texture1: null,
                            texture2: null
                        }, {
                            silent: !0
                        }),
                        h.modelSlide.set({
                            visible: !1
                        }),
                        i && i.kill(),
                        n && n.kill()
                },
                e.prototype.enable = function (e) {
                    void 0 === e && (e = 0),
                        W = !1,
                        F || (e > 0 ? TimelinePlus.call(this._resume, null, this).delay(e) : this._resume()),
                        u.modelState.set({
                            isSlideText: !0
                        }),
                        i && i.kill(),
                        i = TimelinePlus.call(this._onChangeSlideComplete2).delay(.4),
                        Useragnt.ios && TimelinePlus.call(v.resize.resize, null, v.resize).delay(1)
                },
                e.prototype.disable = function () {
                    W = !0,
                        k = 0,
                        this._pause(),
                        u.modelState.set({
                            isSlideText: !1,
                            isSlideNavi: !1
                        }),
                        i && i.kill(),
                        n && n.kill()
                },
                e.prototype.resume = function () {
                    F = !1,
                        W || this._resume()
                },
                e.prototype.pause = function () {
                    F = !0,
                        this._pause()
                },
                e.prototype._resume = function () {
                    j = 0,
                        c.smoothScroll.isStart ? (c.smoothScroll.wheelTime = 150,
                            c.smoothScroll.on("scroll", this._onSmoothScroll)) : window.addEventListener("wheel", this._onWheel, {
                            passive: !0
                        }),
                        r.on("touchstart", this._onTouchStart),
                        r.on("touchend", this._onTouchEnd),
                        r.on("touchmove", this._onTouchMove),
                        r.start()
                },
                e.prototype._pause = function () {
                    c.smoothScroll.isStart ? (c.smoothScroll.wheelTime = 1e3,
                            c.smoothScroll.off("scroll", this._onSmoothScroll)) : window.removeEventListener("wheel", this._onWheel, {
                            passive: !0
                        }),
                        r.off("touchstart", this._onTouchStart),
                        r.off("touchend", this._onTouchEnd),
                        r.off("touchmove", this._onTouchMove),
                        r.stop()
                },
                e.prototype._targetTween = function (e) {
                    var t, o = Math.round(R),
                        i = o % P,
                        r = e - i;
                    r > 0 ? (t = r - P,
                        r = r > -t ? t : r) : (t = r + P,
                        r = -r > t ? t : r);
                    var s = o + r;
                    u.modelState.slideDir = r > 0 ? 1 : -1,
                        u.modelState.set({
                            slideIndex: e
                        }),
                        this.disable(),
                        this.positionTarget = R,
                        n = TimelinePlus.seri(TweenMax.to(this, .5, {
                            positionTarget: s,
                            ease: Ease._1_SineOut
                        }), TimelinePlus.wait(.2), TimelinePlus.call(this.enable, null, this))
                },
                e.prototype._currentTween = function () {
                    var e = Math.round(R),
                        t = (e % P + P) % P;
                    u.modelState.set({
                            slideIndex: t
                        }),
                        this.disable(),
                        this.positionTarget = R,
                        n = TimelinePlus.seri(TweenMax.to(this, .2, {
                            positionTarget: e,
                            ease: Ease._1_SineOut
                        }))
                },
                e.prototype._calc = function () {
                    H = R % P + P,
                        L = H % 1,
                        I = Math.floor(H) % P,
                        z = Math.round(H) % P,
                        A = Math.ceil(H) % P
                },
                e
        }();
    t.ControllerSlideSliding = Y,
        t.controllerSlideSliding = new Y
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(2),
        i = o(0),
        r = function () {
            function e() {
                var e = this;
                this._onRoute = function () {
                    if (i.modelState.get("isList")) {
                        "/works/" == n.routeManagerPlus.get("path") && e._scroll()
                    }
                }
            }
            return e.prototype.init = function () {
                    n.routeManagerPlus.on(":path", this._onRoute)
                },
                e.prototype._scroll = function () {
                    TweenMax.to(window, .6, {
                        scrollTo: {
                            y: 0,
                            autoKill: !1
                        },
                        ease: Ease._4_QuartInOut
                    })
                },
                e
        }();
    t.ControllerWorks = r,
        t.controllerWorks = new r
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(5),
        r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onActive = function () {
                        setTimeout(t._onReady, 250)
                    },
                    t._onReady = function () {
                        t.trigger("complete")
                    },
                    t
            }
            return n(t, e),
                t.prototype.load = function () {
                    WebFont.load({
                        typekit: {
                            id: "crs6kth"
                        },
                        active: this._onActive
                    })
                },
                t
        }(i.Event);
    t.preloadFont = new r
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(5),
        s = o(11),
        a = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onAlways = function () {
                        t.trigger("complete")
                    },
                    t
            }
            return n(t, e),
                t.prototype.load = function () {
                    var e, t, o, n, r = s.ConstSlide.num;
                    for (n = [],
                        e = 0; e < r; e++)
                        o = s.ConstSlide.list[e],
                        t = document.createElement("img"),
                        t.src = o.urlThumb,
                        o.imgThumb = t,
                        n.push(t);
                    i = new imagesLoaded(n, {
                            background: !1
                        }),
                        i.on("always", this._onAlways)
                },
                t
        }(r.Event);
    t.PreloadImageList = a,
        t.preloadImageList = new a
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r, s = o(5),
        a = "/json/config.json",
        l = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onErrorXHR = function () {
                        t._cleanXHR(),
                            ++r < 5 && t._loadXHR(a)
                    },
                    t._onReadyXHR = function () {
                        200 !== i.status && t._onErrorXHR(),
                            t._cleanXHR(),
                            t.json = i.response,
                            t.trigger("complete")
                    },
                    t
            }
            return n(t, e),
                t.prototype.load = function () {
                    r = 0,
                        this._loadXHR(a)
                },
                t.prototype._loadXHR = function (e) {
                    i = new XMLHttpRequest,
                        1 == ("string" == typeof i.responseType ? 2 : 1) && i.setRequestHeader("Origin", location.origin),
                        i.responseType = "json",
                        i.addEventListener("load", this._onReadyXHR),
                        i.addEventListener("error", this._onErrorXHR),
                        i.open("GET", e, !0),
                        i.send()
                },
                t.prototype._cleanXHR = function () {
                    i.removeEventListener("load", this._onReadyXHR),
                        i.removeEventListener("error", this._onErrorXHR)
                },
                t
        }(s.Event);
    t.preloadJSON = new l
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(4),
        r = o(5),
        s = o(101),
        a = o(102),
        l = o(22),
        u = o(103),
        c = o(13),
        d = o(27),
        h = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.init = function () {
                    return this.model = l.modelHome,
                        this._initThree(),
                        this.controllerVisible = new a.ControllerThreeHomeVisible(this),
                        this.controllerTexture = new s.ControllerThreeHomeTexture(this),
                        this.controllerZoom = new u.ControllerThreeHomeZoom(this),
                        this
                },
                t.prototype._initThree = function () {
                    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1),
                        this.texture = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
                    var e = {
                            time: {
                                value: c.uniformTime.value
                            },
                            pixels: {
                                value: d.uniformPixels.value
                            },
                            texture: {
                                value: this.texture
                            },
                            uvRate: {
                                value: new THREE.Vector4(1, 1, 1, 1)
                            },
                            progress: {
                                value: 0
                            },
                            translateDelay: {
                                value: new THREE.Vector4(.05, .5, 0, .5)
                            },
                            accel: {
                                value: new THREE.Vector2(.5, 4)
                            },
                            waveAmpFreq: {
                                value: new THREE.Vector4(.1, .4, 4, 4)
                            },
                            waveSpeedBlend: {
                                value: new THREE.Vector4(0, .3, .1, 1)
                            }
                        },
                        t = new THREE.RawShaderMaterial({
                            blending: THREE.NormalBlending,
                            side: THREE.FrontSide,
                            transparent: !0,
                            vertexShader: o(72),
                            fragmentShader: o(71),
                            uniforms: e
                        }),
                        n = new THREE.Mesh(this.geometry, t);
                    i.threeManager.container.add(n),
                        this.mesh = n,
                        this.material = this.mesh.material,
                        this.uniforms = this.material.uniforms
                },
                t
        }(r.Event);
    t.ThreeHome = h,
        t.threeHome = new h
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = o(118),
        r = o(16),
        s = o(1),
        a = o(9),
        l = function () {
            function e() {}
            return e.prototype.init = function () {
                    var e, t;
                    for (t = s.SC.listItems.length,
                        n = [],
                        e = 0; e < t; e++)
                        n[e] = new i.ThreeListItem(r.modelList.items[e], a.ConstWork.list[e]);
                    return this.list = n,
                        this
                },
                e
        }();
    t.ThreeList = l,
        t.threeList = new l
}, function (e, t) {
    e.exports = '<div id="about" class="about">\r<<%= hLevel %>>\r<span class="about_position">Filmmaker</span>\r<span class="about_name">TAO TAJIMA</span>\r</<%= hLevel %>>\r<div class="about_from">\r<p>from TANGRAM co.ltd.</p>\r<a class="underline" target="_blank" href="http://tangram.to/">http://tangram.to<span class="termination">/</span></a>\r</div>\r<p class="about_description">\rA director and film maker with the Tokyo visual design studio Tangram.<br>\rCharacterized by a worldview that completely transforms casual everyday landscapes, expressed through the skillful use of light.\r</p>\r<div class="about_sns">\r<a class="about_sns_facebook" href="https://www.facebook.com/tao.tajima" target="_blank">\r<div class="about_sns_text">facebook</div>\r<div class="about_sns_arrow"><svg viewBox="0 0 23 5"><polyline points="0,5 23,5 8,0 8,4 0,4"></polyline></svg></div>\r</a>\r<a class="about_sns_twitter" href="https://vimeo.com/user5856788" target="_blank">\r<div class="about_sns_text">vimeo</div>\r<div class="about_sns_arrow"><svg viewBox="0 0 23 5"><polyline points="0,5 23,5 8,0 8,4 0,4"></polyline></svg></div>\r</a>\r</div>\r<div class="about_contact">\r<p>Contact</p>\r<a class="underline" href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#105;&#110;&#102;&#111;&#64;&#116;&#97;&#110;&#103;&#114;&#97;&#109;&#46;&#116;&#111;">&#105;&#110;&#102;&#111;&#64;&#116;&#97;&#110;&#103;&#114;&#97;&#109;&#46;&#116;&#111;</a>\r</div>\r</div>'
}, function (e, t) {
    e.exports = '<div id="slideHome" class="slideHome">\r<h1 class="slideHome_container">\r<span class="slideHome_position">Filmmaker</span>\r<span class="slideHome_name">TA<span class="slideHome_termination">O</span><br> TAJIM<span class="termination">A</span></span>\r<span class="slideHome_from">from<br> TANGRAM co.ltd.</span>\r</h1>\r</div>'
}, function (e, t) {
    e.exports = '<div id="slideInfo" class="slideInfo">\r<div class="slideInfo_scroll">\r<div class="slideInfo_container">\r<div class="slideInfo_back">\r<svg class="slideInfo_back_arrow" viewBox="0 0 23 5"><polyline points="0,5 23,5 23,4 15,4 15,0"></polyline></svg>\r<span class="slideInfo_back_text">Back</span>\r</div>\r\r<div class="slideInfo_header">\r<div class="slideInfo_num"><%= num %></div>\r<div class="slideInfo_category"><%= category %></div>\r</div>\r\r<div class="slideInfo_title"><%= title %></div>\r<div class="slideInfo_description"><%- description %></div>\r<div class="slideInfo_share">\r<span class="slideInfo_share_label">Share:</span>\r<a class="slideInfo_share_facebook" href="<%= facebook %>" target="_blank">\r<svg viewBox="0 0 256 256"><path d="M170,70.5h-15.8c-12.7,0-14.8,6-14.8,14.9v19.4h29.8l-3.9,30.6h-25.9v79.1h-31.6v-79.1H81.4v-30.6h26.4V82.5c0-26.2,15.6-40.4,39-40.4c11.2,0,21.1,0.8,23.2,1.2V70.5z"></path></svg>\r</a>\r<a class="slideInfo_share_twitter" href="<%= twitter %>" target="_blank">\r<svg viewBox="0 0 256 256"><path d="M209.9,102.3c0.1,1.6,0.1,3.2,0.1,4.8c0,49.5-37.6,106.5-106.5,106.5c-21.1,0-40.8-6.2-57.4-16.8c2.9,0.4,5.9,0.5,8.9,0.5c17.6,0,33.6-6,46.5-16.1c-16.4-0.4-30.2-11.1-34.9-26c2.3,0.5,4.7,0.7,7,0.7c3.4,0,6.7-0.5,9.8-1.3c-17.1-3.4-30-18.5-30-36.7c0-0.1,0-0.4,0-0.5c5,2.8,10.8,4.5,17,4.7c-10-6.6-16.6-18-16.6-31.1c0-6.9,1.9-13.2,5-18.9c18.5,22.6,46.1,37.5,77.1,39.1c-0.6-2.7-0.9-5.6-0.9-8.6c0-20.6,16.8-37.4,37.4-37.4c10.8,0,20.5,4.6,27.3,11.8c8.6-1.6,16.5-4.8,23.8-9.1c-2.8,8.8-8.7,16.1-16.4,20.7c7.6-0.9,14.8-2.9,21.4-5.9C223.5,90.5,217.2,97,209.9,102.3z"></path></svg>\r</a>\r</div>\r</div>\r</div>\r</div>'
}, function (e, t) {
    e.exports = '<div id="slideNavi" class="slideNavi">\r<a id="slideNavi_prev" class="slideNavi_prev hover" href="<%= prevPath %>">\r<div class="slideNavi_num"><span><%= prevNum %></span></div>\r<div class="slideNavi_title"><span><%= prevTitle %></span></div>\r<div class="slideNavi_arrow">\r<span><svg viewBox="0 0 360 7"><polyline points="360,7 0,7 21,0 21,6 360,6"></polyline></svg></span>\r</div>\r</a>\r<a id="slideNavi_next" class="slideNavi_next hover" href="<%= nextPath %>">\r<div class="slideNavi_num"><span><%= nextNum %></span></div>\r<div class="slideNavi_title"><span><%= nextTitle %></span></div>\r<div class="slideNavi_arrow">\r<span><svg viewBox="0 0 360 7"><polyline points="0,7 360,7 339,0 339,6 0,6"></polyline></svg></span>\r</div>\r</a>\r</div>'
}, function (e, t) {
    e.exports = '<div id="slideNavi_count" class="slideNavi_count">\r<span class="slideNavi_count_prev"></span>\r<span class="slideNavi_count_next"></span>\r<span class="slideNavi_count_total"></span>\r</div>'
}, function (e, t) {
    e.exports = '<div id="slideVimeo" class="slideVimeo"><div class="slideVimeo_close hover"><span></span><span></span></div></div>'
}, function (e, t) {
    e.exports = '<div id="slideWorks" class="slideWorks">\r<div class="slideWorks_container">\r<div class="slideWorks_header">\r<div class="slideWorks_num"><%= num %></div>\r<div class="slideWorks_category"><%= category %></div>\r</div>\r<<%= hLevel %> class="slideWorks_title"><%= title %></<%= hLevel %>>\r<div class="slideWorks_description"><%- description %></div>\r<div class="slideWorks_share">\r<span class="slideWorks_share_label">Share:</span>\r<a class="slideWorks_share_facebook hover" href="<%= facebook %>" target="_blank">\r<svg viewBox="0 0 256 256"><path d="M170,70.5h-15.8c-12.7,0-14.8,6-14.8,14.9v19.4h29.8l-3.9,30.6h-25.9v79.1h-31.6v-79.1H81.4v-30.6h26.4V82.5c0-26.2,15.6-40.4,39-40.4c11.2,0,21.1,0.8,23.2,1.2V70.5z"></path></svg>\r</a>\r<a class="slideWorks_share_twitter hover" href="<%= twitter %>" target="_blank">\r<svg viewBox="0 0 256 256"><path d="M209.9,102.3c0.1,1.6,0.1,3.2,0.1,4.8c0,49.5-37.6,106.5-106.5,106.5c-21.1,0-40.8-6.2-57.4-16.8c2.9,0.4,5.9,0.5,8.9,0.5c17.6,0,33.6-6,46.5-16.1c-16.4-0.4-30.2-11.1-34.9-26c2.3,0.5,4.7,0.7,7,0.7c3.4,0,6.7-0.5,9.8-1.3c-17.1-3.4-30-18.5-30-36.7c0-0.1,0-0.4,0-0.5c5,2.8,10.8,4.5,17,4.7c-10-6.6-16.6-18-16.6-31.1c0-6.9,1.9-13.2,5-18.9c18.5,22.6,46.1,37.5,77.1,39.1c-0.6-2.7-0.9-5.6-0.9-8.6c0-20.6,16.8-37.4,37.4-37.4c10.8,0,20.5,4.6,27.3,11.8c8.6-1.6,16.5-4.8,23.8-9.1c-2.8,8.8-8.7,16.1-16.4,20.7c7.6-0.9,14.8-2.9,21.4-5.9C223.5,90.5,217.2,97,209.9,102.3z"></path></svg>\r</a>\r</div>\r<div class="slideWorks_info"><div>informatio<span class="termination">n</span></div></div>\r<a href="" target="_blank" class="slideWorks_play hover"><span>PLAY</span></a>\r</div>\r</div>'
}, function (e, t) {
    e.exports = "precision highp float;\nuniform float opacity;\nvoid main(void) {\n gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);\n}\n"
}, function (e, t) {
    e.exports = "precision highp float;\n#define PRECISION 0.000001\nattribute vec3 position;\nattribute vec3 position2;\nuniform vec4 size;\nuniform vec4 time;\nuniform vec2 center;\nuniform vec4 progress;\nuniform vec4 corners;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nvoid main(void) {\n vec2 _uv = position2.xy + 0.5;\n vec2 _corners = (mix(mix(corners.z, corners.w, _uv.x), mix(corners.x, corners.y, _uv.x), _uv.y) * 0.5 + 0.5) * size.xy;\n vec2 _center = mix(center, vec2(0.0), progress.x);\n vec2 _circle = position.xy * mix(vec2(158.0), _corners, progress.z);\n vec2 _rect = position2.xy * mix(vec2(158.0) * vec2(size.z, 1.0), _corners, progress.z);\n vec2 _shape = mix(_circle, _rect, progress.y);\n float _nonzero = float(position.x != 0.0);\n vec2 _pos = mix(vec2(PRECISION), position.xy, _nonzero);\n float rad = atan(_pos.y, _pos.x);\n float s = time.x * 20.0 + rad * 3.0;\n float v = sin(s) * 0.5 + 0.5;\n _shape *= 1.0 + v * 0.2 * progress.w;\n _shape += _center;\n gl_Position = projectionMatrix * viewMatrix * vec4(_shape, 0.0, 1.0);\n}"
}, function (e, t) {
    e.exports = "precision highp float;\nfloat mirrored(float v) {\n float m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec2 mirrored(vec2 v) {\n vec2 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec3 mirrored(vec3 v) {\n vec3 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec4 mirrored(vec4 v) {\n vec4 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nfloat tri(float v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec2 tri(vec2 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec3 tri(vec3 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec4 tri(vec4 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\n#define PI_2 6.283185307179586\nfloat exponentialOut(float t) {\n return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\nvarying vec4 vUv;\nuniform vec4 time;\nuniform float progress;\nuniform vec4 translateDelay;\nuniform vec2 accel;\nuniform vec4 waveAmpFreq;\nuniform vec4 waveSpeedBlend;\nuniform vec3 pixels;\nuniform sampler2D texture;\nvoid main(void) {\n vec2 uv = gl_FragCoord.xy / pixels.xy;\n float delayY = translateDelay.w + sin(time.y * 2.0 + uv.x * PI_2) * 0.2;\n float progressValue = 1.0 - progress;\n \n float delayValue = progressValue * (1.0 + translateDelay.z + delayY) - uv.y * delayY - (1.0 - uv.x) * translateDelay.z;\n delayValue = clamp(delayValue, 0.0, 1.0);\n \n vec2 translateValue = progressValue + delayValue * accel;\n vec2 translateValue1 = translateDelay.xy * translateValue;\n vec2 w = sin(time.y * waveSpeedBlend.xy + vUv.wz * waveAmpFreq.zw) * waveAmpFreq.xy;\n vec2 xy = (tri(progressValue) * waveSpeedBlend.z + tri(delayValue) * waveSpeedBlend.w) * w;\n vec2 uv1 = vUv.xy + translateValue1 + xy;\n vec4 rgba1 = texture2D(texture, mirrored(uv1));\n vec4 rgba2 = vec4(vec3(1.0), exponentialOut(1.0 - delayValue));\n vec4 rgba = mix(rgba1, rgba2, delayValue);\n rgba.rgb *= 0.7;\n gl_FragColor = rgba;\n \n}\n"
}, function (e, t) {
    e.exports = "precision highp float;\nmat2 rotate(float rad) {\n float c = cos(rad);\n float s = sin(rad);\n return mat2(\n c, s,\n -s, c\n );\n}\n#define PI_H 1.5707963267948966\nattribute vec3 position;\nattribute vec2 uv;\nvarying vec4 vUv;\nuniform vec4 uvRate;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float rotation;\nvoid main(void) {\n vec2 _uv = uv - 0.5;\n vec2 _uv1 = _uv;\n _uv1 *= uvRate.xy;\n _uv1 += 0.5;\n vec2 _uv2 = _uv;\n _uv2 *= uvRate.zw;\n _uv2 = rotate(PI_H) * _uv2;\n _uv2 += 0.5;\n vUv.xy = mix(_uv1, _uv2, rotation);\n _uv = rotate(PI_H * rotation) * _uv;\n _uv += 0.5;\n vUv.zw = _uv;\n vec4 posWorld = modelMatrix * vec4(position, 1.0);\n gl_Position = projectionMatrix * viewMatrix * posWorld;\n}"
}, function (e, t) {
    e.exports = "precision highp float;\nfloat mirrored(float v) {\n float m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec2 mirrored(vec2 v) {\n vec2 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec3 mirrored(vec3 v) {\n vec3 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec4 mirrored(vec4 v) {\n vec4 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nfloat linear(float t) {\n return t;\n}\nfloat tri(float v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec2 tri(vec2 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec3 tri(vec3 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec4 tri(vec4 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvarying vec2 vUv;\nvarying float vDark;\nuniform vec4 time;\nuniform float progress;\nuniform vec2 translate;\nuniform vec2 delay;\nuniform vec2 accel;\nuniform float edge;\nuniform vec4 waveAmpFreq;\nuniform vec4 waveSpeedPhase;\nuniform vec2 waveBlend;\nuniform float opacity;\nuniform sampler2D texture1;\nuniform sampler2D texture2;\nvoid main(void) {\n vec2 uv = vUv;\n \n float delayValue = progress * (1.0 + delay.x + delay.y) - uv.y * delay.y - (1.0 - uv.x) * delay.x;\n delayValue = linear(clamp(delayValue, 0.0, 1.0));\n \n float progressValue = linear(progress);\n vec2 translateValue = progressValue + delayValue * accel.xy;\n vec2 translateValue1 = translate * translateValue;\n vec2 translateValue2 = translate * (translateValue - 1.0 - accel.xy);\n vec2 w = sin(time.y * waveSpeedPhase.xy + uv.yx * waveAmpFreq.zw + waveSpeedPhase.zw) * waveAmpFreq.xy;\n vec2 xy = (tri(progress) * waveBlend.x + tri(delayValue) * waveBlend.y) * w;\n vec2 uv1 = vUv + translateValue1 + xy;\n vec2 uv2 = vUv + translateValue2 + xy;\n vec4 rgba1 = texture2D(texture1, mirrored(uv1));\n vec4 rgba2 = texture2D(texture2, mirrored(uv2));\n float threshold = step(1.0 - uv.x, delayValue);\n vec4 rgba = mix(rgba1, rgba2, mix(delayValue, threshold, edge));\n rgba *= vec4(vec3(vDark), opacity);\n gl_FragColor = rgba;\n}"
}, function (e, t) {
    e.exports = "precision highp float;\n#define PI_H 1.5707963267948966\nattribute vec3 position;\nattribute vec2 uv;\nvarying float vDark;\nvarying vec2 vUv;\nuniform vec3 textureSize;\nuniform vec3 hover;\nuniform vec4 corners;\nuniform float sway;\nuniform float zoomScale;\nuniform vec4 time;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nconst float AREA1 = 300.0;\nconst float AREA2 = 700.0;\nvoid main(void) {\n vUv = uv;\n float _corners = mix(mix(corners.z, corners.w, uv.x), mix(corners.x, corners.y, uv.x), uv.y);\n \n vec3 _position = position;\n vec4 _slide = vec4(_position, 1.0);\n _slide.z += zoomScale;\n \n vec4 _list = modelMatrix * vec4(position, 1.0);\n \n float _len1 = length((uv - hover.xy) * textureSize.xy);\n float _str1 = max(0.0, (1.0 - _len1 / AREA1));\n float _len2 = length(_list.xy);\n float _str2 = clamp(1.0 - _len2 / AREA2, 0.25, 1.0);\n float _sway1 = (\n sin(time.y * 1.0 + _len2 / 256.0) * 128.0 +\n sin(time.y * 2.0 + _len2 / 32.0) * 64.0\n ) * sway;\n float _sway2 = sin(time.y * 1.0 + _len1 / 32.0) * 24.0 * _str1 * _str2 * hover.z;\n _list.z += _sway1 + _sway2;\n _slide.z += _sway1;\n vDark = mix(1.0, 0.7, _corners);\n gl_Position = projectionMatrix * viewMatrix * mix(_list, _slide, _corners);\n}"
}, function (e, t) {
    e.exports = "precision highp float;\nfloat mirrored(float v) {\n float m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec2 mirrored(vec2 v) {\n vec2 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec3 mirrored(vec3 v) {\n vec3 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec4 mirrored(vec4 v) {\n vec4 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nfloat tri(float v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec2 tri(vec2 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec3 tri(vec3 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec4 tri(vec4 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\n#define PI_2 6.283185307179586\n#define PI_H 1.5707963267948966\nvarying vec2 vUv;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nuniform vec4 time;\nuniform float progress;\nuniform vec3 mask;\nuniform float rotation;\nuniform vec4 translateDelay;\nuniform vec2 accel;\nuniform vec4 waveAmpFreq;\nuniform vec4 waveSpeedBlend;\nuniform vec4 pixels;\nuniform sampler2D texture1;\nuniform sampler2D texture2;\nvoid main(void) {\n vec2 uv = gl_FragCoord.xy / pixels.xy;\n float p = fract(progress + mask.z);\n \n float delayValue = p * (1.0 + translateDelay.z + translateDelay.w) - uv.y * translateDelay.w - (1.0 - uv.x) * translateDelay.z;\n delayValue = clamp(delayValue, 0.0, 1.0);\n \n vec2 translateValue = p + delayValue * accel;\n vec2 translateValue1 = translateDelay.xy * translateValue;\n vec2 translateValue2 = translateDelay.xy * (translateValue - 1.0 - accel);\n vec2 w = sin(time.y * waveSpeedBlend.xy + vUv.yx * waveAmpFreq.zw) * waveAmpFreq.xy;\n vec2 xy = (tri(p) * waveSpeedBlend.z + tri(delayValue) * waveSpeedBlend.w) * w;\n vec2 uv1 = vUv1 + translateValue1 + xy;\n vec2 uv2 = vUv2 + translateValue2 + xy;\n vec4 rgba1 = texture2D(texture1, mirrored(uv1));\n vec4 rgba2 = texture2D(texture2, mirrored(uv2));\n vec4 rgba = mix(rgba1, rgba2, delayValue);\n rgba = mix(vec4(0.0, 0.0, 0.0, 1.0), rgba, mask.y);\n rgba = mix(vec4(0.0), rgba, float(abs(uv.y * 2.0 - 1.0) <= mask.x));\n rgba.rgb *= 0.7;\n gl_FragColor = rgba;\n \n}"
}, function (e, t) {
    e.exports = "precision highp float;\nattribute vec3 position;\nattribute vec2 uv;\nvarying vec2 vUv;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nuniform vec4 uvRate1;\nuniform vec4 uvRate2;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nvoid main(void) {\n vec2 _uv = uv - 0.5;\n vUv1 = _uv;\n vUv1 *= uvRate1.xy;\n vUv1 += 0.5;\n vUv2 = _uv;\n vUv2 *= uvRate2.xy;\n vUv2 += 0.5;\n _uv += 0.5;\n vUv = _uv;\n gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}"
}, function (e, t, o) {
    "use strict";

    function n(e, t, o, n) {
        var i, r, s, a, l, u, c, d, h, p, f, m, v;
        for (p = e.split("<br>"),
            f = [],
            d = p.length,
            i = "<" + t,
            void 0 != o && (i += ' class="' + o + '"'),
            i += ">",
            r = "<" + t,
            void 0 != o && void 0 != n ? r += ' class="' + o + " " + n + '"' : void 0 != o ? r += ' class="' + o + '"' : void 0 != n && (r += ' class="' + n + '"'),
            r += ">",
            s = "</" + t + ">",
            u = 0; u < d; u++) {
            for (a = p[u],
                h = a.length,
                v = !0,
                m = "",
                c = 0; c < h; c++)
                l = a.substr(c, 1),
                m += v ? r + l + s : i + l + s,
                v = " " == l;
            f[u] = m
        }
        return f.join("<br>")
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.splitTextElement = n
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r, s, a, l, u, c = o(6),
        d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onPopState = function (e) {
                        return e.preventDefault(),
                            t._route(!0),
                            !1
                    },
                    t
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        hash: "/",
                        path: "",
                        pop: !1
                    }
                },
                t.prototype.init = function (e) {
                    r = e;
                    var t = location.pathname.replace(r, ""),
                        o = location.hash;
                    window.addEventListener("popstate", this._onPopState),
                        this.validate(t, o) || (t = "/",
                            o = "",
                            history.replaceState({}, "", r + t)),
                        i = t + o,
                        o = o.replace(/#/, ""),
                        this.attrs.path = t,
                        this.attrs.hash = o
                },
                t.prototype.goto = function (e, t, o) {
                    if (void 0 === t && (t = null),
                        void 0 === o && (o = !1),
                        this.validate(e, t)) {
                        var n = t ? e + "#" + t : e;
                        i != n ? (history.pushState({}, "", r + n),
                            this._route(o)) : t && this._hash()
                    }
                },
                t.prototype.pause = function () {
                    s || (s = !0,
                        a = null,
                        l = null,
                        u = null)
                },
                t.prototype.resume = function () {
                    if (s) {
                        s = !1;
                        var e;
                        null != l ? (e = {
                                path: l,
                                pop: a
                            },
                            null != u && (e._hash = u),
                            this.set(e)) : null != u && (this.set({
                                hash: u
                            }),
                            this.trigger("hash"))
                    }
                },
                t.prototype.validate = function (e, t) {
                    return !0
                },
                t.prototype._route = function (e) {
                    var t = location.pathname.replace(r, ""),
                        o = location.hash;
                    i = t + o,
                        o = o.replace(/#/, ""),
                        s ? (a = e,
                            l = t,
                            u = o) : this.set({
                            pop: e,
                            path: t,
                            hash: o
                        })
                },
                t.prototype._hash = function () {
                    var e = location.hash.replace(/#/, "");
                    s ? u = e : (this.set({
                            hash: e
                        }),
                        this.trigger("hash"))
                },
                t
        }(c.Model);
    t.RouteManager = d
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.Share = {
            generateFacebook: function (e) {
                return "http://www.facebook.com/share.php?u=" + encodeURIComponent(e)
            },
            generateTwitter: function (e, t, o) {
                var n = "https://twitter.com/share?url=" + encodeURIComponent(e);
                return t && (n += "&text=" + encodeURIComponent(t)),
                    o && (n += "&hashtags=" + encodeURIComponent(o)),
                    n
            },
            generateLineWeb: function (e) {
                return "http://line.me/R/msg/text/?" + encodeURIComponent(e)
            },
            generateLineApp: function (e) {
                return "line://msg/text/" + encodeURIComponent(e)
            },
            generateLineIntent: function (e) {
                return "https://lineit.line.me/share/ui?url=" + encodeURIComponent(e)
            }
        }
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function () {
        function e(e) {
            var t = this;
            this._onTouchStart = function (e) {
                    t._touchY = e.changedTouches[0].clientY
                },
                this._onTouchMove = function (e) {
                    var o = t.target.scrollHeight - t.target.clientHeight,
                        n = t.target.scrollTop,
                        i = e.changedTouches[0].clientY,
                        r = i - t._touchY > 0;
                    (r && n <= 0 || !r && n >= o) && e.preventDefault(),
                        t._touchY = i
                },
                this.target = e
        }
        return e.prototype.start = function () {
                window.addEventListener("touchstart", this._onTouchStart),
                    window.addEventListener("touchmove", this._onTouchMove)
            },
            e.prototype.stop = function () {
                window.removeEventListener("touchstart", this._onTouchStart),
                    window.removeEventListener("touchmove", this._onTouchMove)
            },
            e
    }();
    t.ScrollModal = n
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(5),
        r = function (e) {
            function t(t, o) {
                void 0 === o && (o = !0);
                var n = e.call(this) || this;
                return n._passive = !0,
                    n._start = function () {
                        window.addEventListener("touchend", n._onTouchEnd),
                            n._passive ? window.addEventListener("touchmove", n._onTouchMove) : window.addEventListener("touchmove", n._onTouchMove, {
                                passive: !1
                            }),
                            window.addEventListener("touchcancel", n._onTouchCancel)
                    },
                    n._stop = function () {
                        window.removeEventListener("touchend", n._onTouchEnd),
                            window.removeEventListener("touchmove", n._onTouchMove),
                            window.removeEventListener("touchcancel", n._onTouchCancel)
                    },
                    n._onTouchStart = function (e) {
                        var t = e.changedTouches.length,
                            o = e.changedTouches;
                        1 == t ? (n._start(),
                            n._touch = o[0],
                            n.trigger("touchstart", [n._touch])) : (n._touch && n.trigger("touchend", [n._touch]),
                            n._stop(),
                            n._touch = null)
                    },
                    n._onTouchEnd = function (e) {
                        var t = e.changedTouches;
                        n.trigger("touchend", [t[0]]),
                            n._stop(),
                            n._touch = null
                    },
                    n._onTouchMove = function (e) {
                        e.preventDefault();
                        var t = e.changedTouches;
                        n._touch = t[0],
                            n.trigger("touchmove", [n._touch])
                    },
                    n._onTouchCancel = function () {
                        n._stop(),
                            n._touch = null
                    },
                    n._target = t,
                    n._passive = o,
                    n
            }
            return n(t, e),
                t.prototype.start = function () {
                    return this._target.addEventListener("touchstart", this._onTouchStart),
                        this
                },
                t.prototype.stop = function () {
                    return this._target.removeEventListener("touchstart", this._onTouchStart),
                        this
                },
                t
        }(i.Event);
    t.Touch1 = r
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = function () {
        function e() {
            var e = this;
            this._onPopState = function () {
                    n = window.scrollY,
                        window.addEventListener("scroll", e._onScroll)
                },
                this._onScroll = function () {
                    window.removeEventListener("scroll", e._onScroll),
                        window.scrollTo(0, n)
                }
        }
        return e.prototype.init = function () {
                "scrollRestoration" in history ? history.scrollRestoration = "manual" : window.addEventListener("popstate", this._onPopState)
            },
            e
    }();
    t.scrollRestoration = new i
}, function (e, t, o) {
    "use strict";

    function n(e, t, o) {
        var n = t + m,
            i = o + m,
            r = n * l,
            s = i * l;
        u.style.width = n + "px",
            u.style.height = i + "px",
            u.width = r,
            u.height = s,
            c.clearRect(0, 0, r, s),
            e.originalWidth = n,
            e.originalHeight = i,
            e.originalCanvasWidth = r,
            e.originalCanvasHeight = s
    }

    function i() {
        c.strokeStyle = "#fff",
            c.lineWidth = l,
            c.beginPath(),
            c.moveTo((72 + f) * l, (-2 + f) * l),
            c.lineTo((60 + f) * l, (28 + f) * l),
            c.stroke()
    }

    function r(e, t, o, n, i) {
        void 0 === n && (n = 0),
            void 0 === i && (i = 0),
            c.fillStyle = "#fff",
            c.textAlign = "left",
            c.font = o + " " + t * l + 'px "garamond-premier-pro"',
            c.textBaseline = "alphabetic";
        for (var r = e.querySelectorAll("span"), s = r.length, a = 0; a < s; a++) {
            var d = r[a],
                h = d.textContent;
            if ("" != h) {
                var p = d.offsetLeft,
                    f = d.offsetTop,
                    m = d.getBoundingClientRect().height;
                c.fillText(h, (p + n) * l, (f + i + .72 * m) * l, u.width)
            }
        }
    }

    function s(e, t) {
        l = p.resize.get("ratio"),
            u = e.canvas,
            c = e.context;
        var o = p.resize.get("innerHeight"),
            s = t.idString,
            a = t.category,
            m = t.title,
            v = t.description;
        d.SC.slideWorksNum.innerHTML = h.splitTextElement(s, "span"),
            d.SC.slideWorksCategory.innerHTML = h.splitTextElement(a, "span"),
            d.SC.slideWorksTitle.innerHTML = h.splitTextElement(m, "span"),
            d.SC.slideWorksDescription.innerHTML = h.splitTextElement(v, "span");
        var _ = d.SC.slideWorksContainer.getBoundingClientRect();
        n(e, _.width, _.height),
            e.offsetY = Math.floor(o / 2 - (_.top - f) - e.originalHeight / 2),
            i(),
            r(d.SC.slideWorksNum, 22, 600, f, f),
            r(d.SC.slideWorksCategory, 22, 600, f + 80, f),
            r(d.SC.slideWorksTitle, 45, "normal", f, f),
            r(d.SC.slideWorksDescription, 15, 600, f, f),
            d.SC.slideWorksNum.innerHTML = "",
            d.SC.slideWorksCategory.innerHTML = "",
            d.SC.slideWorksTitle.innerHTML = "",
            d.SC.slideWorksDescription.innerHTML = ""
    }

    function a(e) {
        l = p.resize.get("ratio"),
            u = e.canvas,
            c = e.context;
        var t = p.resize.get("innerHeight");
        v = d.SC.slideHomePosition.innerHTML,
            _ = d.SC.slideHomeName.innerHTML,
            g = d.SC.slideHomeFrom.innerHTML,
            d.SC.slideHomePosition.innerHTML = h.splitTextElement("Filmmaker", "span"),
            d.SC.slideHomeName.innerHTML = h.splitTextElement("TAO TAJIMA", "span"),
            d.SC.slideHomeFrom.innerHTML = h.splitTextElement("from TANGRAM co.ltd.", "span");
        var o = d.SC.slideHomeContainer.getBoundingClientRect();
        n(e, o.width, o.height),
            e.offsetY = Math.floor(t / 2 - (o.top - f) - e.originalHeight / 2),
            r(d.SC.slideHomePosition, 24, 600, f, f),
            r(d.SC.slideHomeName, 50, "normal", f, f),
            r(d.SC.slideHomeFrom, 15, "normal", f, f),
            d.SC.slideHomePosition.innerHTML = v,
            d.SC.slideHomeName.innerHTML = _,
            d.SC.slideHomeFrom.innerHTML = g
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var l, u, c, d = o(1),
        h = o(77),
        p = o(3),
        f = 10,
        m = 2 * f;
    t.captureWork = s;
    var v, _, g;
    t.captureHome = a
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(11),
        r = o(10),
        s = function (e) {
            function t(t) {
                var o = e.call(this, 0, t) || this;
                return o.indexSlide = 0,
                    o.path = "/",
                    o.videoNum = Math.floor(Math.random() * t.vimeo_digest.length) + 1,
                    o.videoLocal = r.C.path + "/video/home_" + o.videoNum + ".mp4",
                    o.videoVimeo = r.C.videoLocal ? o.videoLocal : t.vimeo_digest[o.videoNum - 1],
                    o.stillNum = Math.floor(Math.random() * t.still_num) + 1,
                    r.C.videoUsing ? o.urlThumb = r.C.path + "/images/shot/home_" + o.videoNum + ".jpg" : o.urlThumb = r.C.path + "/images/still/home_" + o.stillNum + ".jpg",
                    o
            }
            return n(t, e),
                t
        }(i.ConstSlide);
    t.ConstHome = s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = o(1),
        r = o(86),
        s = function () {
            function e() {}
            return e.prototype.init = function () {
                    n = [new r.ControllerAboutScrollItem(i.SC.about.querySelector(".about_position"), 0), new r.ControllerAboutScrollItem(i.SC.about.querySelector(".about_name"), 1), new r.ControllerAboutScrollItem(i.SC.about.querySelector(".about_from"), 2), new r.ControllerAboutScrollItem(i.SC.about.querySelector(".about_description"), 3), new r.ControllerAboutScrollItem(i.SC.about.querySelector(".about_sns"), 3.5), new r.ControllerAboutScrollItem(i.SC.about.querySelector(".about_contact"), 4)]
                },
                e
        }();
    t.ControllerAboutScroll = s,
        t.controllerAboutScroll = new s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(8),
        i = o(3),
        r = o(12),
        s = o(18),
        a = o(0),
        l = o(7),
        u = .25,
        c = .1,
        d = function () {
            function e(e, t) {
                var o = this;
                this._onDevice = function () {
                        switch (l.modelMQ.get("device")) {
                            case "computer":
                                o.offsetRate = 1;
                                break;
                            case "tablet":
                                o.offsetRate = .75;
                                break;
                            case "mobile":
                                o.offsetRate = .5
                        }
                    },
                    this._onChangeSlide = function () {
                        a.modelState.get("isSlide") ? o._stop() : o._start()
                    },
                    this._onResize = function () {
                        o._updateLayout(),
                            o._onScroll(),
                            i.resize.changed("clientWidth") && (o.currentY = o.targetY,
                                TweenMax.set(o.element, {
                                    y: o.currentY
                                }))
                    },
                    this._onScroll = function () {
                        var e, t;
                        if (e = r.scrollerY.attrs.y,
                            t = o.position - e,
                            e > o.max || e < o.min) {
                            if (o.hidden)
                                return;
                            return o.hidden = !0,
                                o.element.style.visibility = "hidden",
                                void s.raf.off("raf", o._onRAF)
                        }
                        o.hidden && (o.hidden = !1,
                                o.element.style.visibility = "visible",
                                o.currentY = t > 0 ? o.height + o.offsetMax * o.offsetRate : -o.height + o.offsetMin * o.offsetRate,
                                TweenMax.set(o.element, {
                                    y: o.currentY
                                })),
                            t > 0 ? t < o.area ? t = 0 : t -= o.area : t < 0 && (t > -o.area ? t = 0 : t += o.area),
                            o.targetY = t * u,
                            s.raf.on("raf", o._onRAF)
                    },
                    this._onRAF = function () {
                        var e, t;
                        e = o.targetY - o.currentY,
                            t = Math.abs(e),
                            t < .2 ? (o.currentY = o.targetY,
                                s.raf.off("raf", o._onRAF)) : o.currentY += e * c,
                            TweenMax.set(o.element, {
                                y: o.currentY
                            })
                    },
                    this.element = e,
                    this.offsetMin = -50 * (4 - t) - 100,
                    this.offsetMax = 50 * t + 100,
                    a.modelState.on(":isSlide", this._onChangeSlide),
                    this._onChangeSlide()
            }
            return e.prototype._start = function () {
                    r.scrollerY.on(":y", this._onScroll),
                        n.index.on("resize", this._onResize),
                        l.modelMQ.on(":device", this._onDevice),
                        this.hidden = !0,
                        this.element.style.visibility = "hidden",
                        this._onDevice(),
                        this._onResize()
                },
                e.prototype._stop = function () {
                    r.scrollerY.off(":y", this._onScroll),
                        n.index.off("resize", this._onResize),
                        l.modelMQ.on(":device", this._onDevice),
                        this.element.removeAttribute("style")
                },
                e.prototype._updateLayout = function () {
                    var e, t, o, n;
                    e = this.element,
                        t = i.resize.attrs.innerHeight,
                        o = e.clientHeight,
                        n = e.offsetTop,
                        this.position = n - t / 2 + o / 2,
                        this.min = n - t,
                        this.max = n + o,
                        this.area = Math.max(t / 4, 100),
                        this.height = t / 3 * u
                },
                e
        }();
    t.ControllerAboutScrollItem = d
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r = o(1),
        s = o(24),
        a = o(2),
        l = function () {
            function e() {
                this._onMouseEnter = function () {
                        a.routeManagerPlus.trigger("loop"),
                            r.SC.backToTop.classList.remove("isHover"),
                            n && n.kill(),
                            n = TimelinePlus.seri(TimelinePlus.call(r.SC.backToTop.classList.add, ["isHover"], r.SC.backToTop.classList), TimelinePlus.wait(.5), TimelinePlus.call(r.SC.backToTop.classList.remove, ["isHover"], r.SC.backToTop.classList)).delay(2 / 60)
                    },
                    this._onClick = function () {
                        TweenMax.to(window, .6, {
                            scrollTo: {
                                y: 0,
                                autoKill: !1
                            },
                            ease: Ease._4_QuartInOut
                        })
                    }
            }
            return e.prototype.init = function () {
                    Useragnt.pc && (i = new s.ElementEvent(r.SC.backToTop),
                            i.start().on("mouseenter", this._onMouseEnter)),
                        r.SC.backToTop.addEventListener("click", this._onClick)
                },
                e
        }();
    t.ControllerBackToTopButton = l,
        t.controllerBackToTopButton = new l
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r = o(8),
        s = o(3),
        a = o(12),
        l = o(1),
        u = o(0),
        c = function () {
            function e() {
                var e = this;
                this._onChangeSlide = function () {
                        u.modelState.get("isSlide") ? e._stop() : e._start()
                    },
                    this._onResize = function () {
                        e._updateLayout(),
                            e._onScroll()
                    },
                    this._onScroll = function () {
                        var e, t;
                        e = a.scrollerY.attrs.y,
                            t = e < n,
                            t != i && (t ? l.SC.backToTop.classList.remove("isShow") : l.SC.backToTop.classList.add("isShow")),
                            i = t
                    }
            }
            return e.prototype.init = function () {
                    u.modelState.on(":isSlide", this._onChangeSlide),
                        this._onChangeSlide()
                },
                e.prototype._start = function () {
                    a.scrollerY.on(":y", this._onScroll),
                        r.index.on("resize", this._onResize),
                        l.SC.backToTop.classList.remove("isShow"),
                        i = !0,
                        this._onResize()
                },
                e.prototype._stop = function () {
                    a.scrollerY.off(":y", this._onScroll),
                        r.index.off("resize", this._onResize)
                },
                e.prototype._updateLayout = function () {
                    var e, t, o;
                    e = l.SC.backToTop,
                        t = s.resize.attrs.innerHeight,
                        o = e.offsetTop + 10,
                        n = o - t
                },
                e
        }();
    t.ControllerBackToTopScroll = c,
        t.controllerBackToTopScroll = new c
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(2),
        i = o(0),
        r = o(22),
        s = function () {
            function e() {
                var e = this;
                this._onStart = function () {
                        i.modelState.on(":isSlide", e._onChangeStateSlide),
                            n.routeManagerPlus.on(":path", e._onChangeRoute)
                    },
                    this._onChangeRoute = function () {
                        var t = n.routeManagerPlus.get("path"),
                            o = i.modelState.get("isList"),
                            r = (i.modelState.get("isSlide"),
                                i.modelState.get("isZoomIn")),
                            s = i.modelState.get("isZoomOut"),
                            a = i.modelState.get("zoomTarget");
                        o && "/" == t ? (i.modelState.set({
                                isList: !1,
                                isZoom: !0,
                                isZoomIn: !0,
                                zoomTarget: "/"
                            }),
                            e.model.trigger("zoomOut"),
                            e.model.set({
                                zoom: !0,
                                zoomCancel: !1
                            })) : r && "/" == a && n.routeManagerPlus.isList(t) ? (i.modelState.set({
                                isZoomIn: !1,
                                isZoomOut: !0
                            }),
                            e.model.set({
                                zoom: !1,
                                zoomCancel: !0
                            })) : s && "/" == a && n.routeManagerPlus.isSlide(t) && (i.modelState.set({
                                isZoomIn: !0,
                                isZoomOut: !1
                            }),
                            e.model.set({
                                zoom: !0,
                                zoomCancel: !0
                            }))
                    },
                    this._onChangeStateSlide = function () {
                        var t = n.routeManagerPlus.get("path"),
                            o = i.modelState.get("isSlide"),
                            r = i.modelState.get("zoomTarget");
                        o ? e.model.get("zoom") && e.model.trigger("zoomOut") : n.routeManagerPlus.isList(t) && "/" == r && (i.modelState.set({
                                isZoom: !0,
                                isZoomOut: !0
                            }),
                            e.model.trigger("zoomIn"),
                            e.model.set({
                                zoom: !1,
                                zoomCancel: !1
                            }))
                    }
            }
            return e.prototype.init = function () {
                    return this.model = r.modelHome,
                        i.modelState.once("start", this._onStart),
                        this
                },
                e
        }();
    t.ControllerHomeRoute = s,
        t.controllerHomeRoute = new s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r = o(8),
        s = o(12),
        a = o(0),
        l = o(1),
        u = function () {
            function e() {
                var e = this;
                this._onChangeSlide = function () {
                        a.modelState.get("isSlide") ? e._stop() : e._start()
                    },
                    this._onResize = function () {
                        e._updateLayout(),
                            e._onScroll()
                    },
                    this._onScroll = function () {
                        var e, t;
                        e = s.scrollerY.attrs.y,
                            t = e > n,
                            t != i && (t ? l.SC.listHome.classList.remove("isShow") : l.SC.listHome.classList.add("isShow")),
                            i = t
                    }
            }
            return e.prototype.init = function () {
                    a.modelState.on(":isSlide", this._onChangeSlide),
                        this._onChangeSlide()
                },
                e.prototype._start = function () {
                    s.scrollerY.on(":y", this._onScroll),
                        r.index.on("resize", this._onResize),
                        l.SC.listHome.classList.remove("isShow"),
                        i = !0,
                        this._onResize()
                },
                e.prototype._stop = function () {
                    s.scrollerY.off(":y", this._onScroll),
                        r.index.off("resize", this._onResize)
                },
                e.prototype._updateLayout = function () {
                    var e, t;
                    e = l.SC.listHome,
                        t = e.offsetTop + 100,
                        n = t
                },
                e
        }();
    t.ControllerListHomeScroll = u,
        t.controllerListHomeScroll = new u
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(24),
        r = o(4),
        s = o(2),
        a = o(25),
        l = o(0),
        u = o(7),
        c = o(1),
        d = .1,
        h = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._targetX = 0,
                    o._targetY = 0,
                    o._currentX = 0,
                    o._currentY = 0,
                    o._onClickHome = function (e) {
                        e.preventDefault(),
                            s.routeManagerPlus.goto("/", null, !0)
                    },
                    o._onJudgeEnabled = function () {
                        l.modelState.get("isList") && u.modelMQ.get("computer") ? o._start() : o._stop()
                    },
                    o._onClick = function (e) {
                        e.preventDefault(),
                            s.routeManagerPlus.goto(o.model.path, null, !0)
                    },
                    o._onMouseEnter = function (e) {
                        d = .1,
                            o._onMouseMove(e),
                            o.model.set({
                                hover: !0
                            })
                    },
                    o._onMouseLeave = function () {
                        d = .3,
                            o._targetX = 0,
                            o._targetY = 0,
                            r.threeManager.on("draw", o._onRAF),
                            o.model.set({
                                hover: !1
                            })
                    },
                    o._onMouseMove = function (e) {
                        r.threeManager.on("draw", o._onRAF);
                        var t = o.element.getBoundingClientRect();
                        o._targetX = (e.clientX - t.left) / t.width * 2 - 1,
                            o._targetY = (e.clientY - t.top) / t.height * 2 - 1,
                            o.model.set({
                                hover: !0
                            })
                    },
                    o._onRAF = function (e, t) {
                        var n, i, s, a;
                        t *= 60,
                            n = o._targetX - o._currentX,
                            i = o._targetY - o._currentY,
                            s = Math.abs(n),
                            a = Math.abs(i),
                            s < .001 && a < .001 ? (o._currentX = o._targetX,
                                o._currentY = o._targetY,
                                r.threeManager.off("draw", o._onRAF)) : (o._currentX += n * t * d,
                                o._currentY += i * t * d),
                            o.model.hoverX = o._currentX,
                            o.model.hoverY = o._currentY,
                            o.model.trigger("hover")
                    },
                    Useragnt.pc && (u.modelMQ.on(":computer", o._onJudgeEnabled),
                        l.modelState.on(":isList", o._onJudgeEnabled),
                        o.elementEvent = new i.ElementEvent(o.button),
                        o.elementEvent.on("mouseenter", o._onMouseEnter).on("mouseleave", o._onMouseLeave),
                        o._onJudgeEnabled()),
                    o.button.addEventListener("click", o._onClick),
                    c.SC.listHome.addEventListener("click", o._onClickHome),
                    o
            }
            return n(t, e),
                t.prototype._start = function () {
                    this.button.addEventListener("mousemove", this._onMouseMove),
                        this.elementEvent.start()
                },
                t.prototype._stop = function () {
                    this._onMouseLeave(),
                        this.button.removeEventListener("mousemove", this._onMouseMove),
                        this.elementEvent.stop()
                },
                t
        }(a.ControllerListItemBase);
    t.ControllerListItemButton = h
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(25),
        r = o(2),
        s = o(0),
        a = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onChangeRoute = function () {
                        var e = r.routeManagerPlus.get("path"),
                            t = s.modelState.get("isList"),
                            n = (s.modelState.get("isSlide"),
                                s.modelState.get("isZoomIn")),
                            i = s.modelState.get("isZoomOut"),
                            a = s.modelState.get("zoomTarget");
                        t && e == o.model.path ? (s.modelState.set({
                                isList: !1,
                                isZoom: !0,
                                isZoomIn: !0,
                                zoomTarget: o.model.path
                            }),
                            o.model.set({
                                zoom: !0
                            })) : n && a == o.model.path && r.routeManagerPlus.isList(e) ? (s.modelState.set({
                                isZoomIn: !1,
                                isZoomOut: !0
                            }),
                            o.model.set({
                                zoom: !1
                            })) : i && a == o.model.path && r.routeManagerPlus.isSlide(e) && (s.modelState.set({
                                isZoomIn: !0,
                                isZoomOut: !1
                            }),
                            o.model.set({
                                zoom: !0
                            }))
                    },
                    o._onChangeStateSlide = function () {
                        var e = r.routeManagerPlus.get("path"),
                            t = s.modelState.get("isSlide"),
                            n = s.modelState.get("zoomTarget");
                        t ? o.model.get("zoom") && o.model.trigger("zoomOut") : r.routeManagerPlus.isList(e) && n == o.model.path && (s.modelState.set({
                                isZoom: !0,
                                isZoomOut: !0
                            }),
                            o.model.trigger("zoomIn"),
                            o.model.set({
                                zoom: !1
                            }))
                    },
                    o._onChangeActive = function () {
                        o.element.classList.toggle("isActive", o.model.get("active"))
                    },
                    s.modelState.on(":isSlide", o._onChangeStateSlide),
                    r.routeManagerPlus.on(":path", o._onChangeRoute),
                    o._onChangeRoute(),
                    o.model.on(":active", o._onChangeActive),
                    o
            }
            return n(t, e),
                t
        }(i.ControllerListItemBase);
    t.ControllerListItemRoute = a
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(3),
        r = o(12),
        s = o(18),
        a = o(25),
        l = o(0),
        u = o(7),
        c = o(16),
        d = o(35),
        h = .25,
        p = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o.targetY = 0,
                    o.currentY = 0,
                    o.addY = 0,
                    o._onStart = function () {
                        l.modelState.get("isList") && (o.tweenAdd && o.tweenAdd.kill(),
                            o.addY = 300,
                            o.tweenAdd = TweenMax.to(o, .8 + d.Random.range(0, .4, .1), {
                                addY: 0,
                                ease: Ease._4_QuartOut
                            }).eventCallback("onUpdate", o._onUpdate))
                    },
                    o._onDevice = function () {
                        switch (u.modelMQ.get("device")) {
                            case "computer":
                                o.offsetMin = -500,
                                    o.offsetMax = 500;
                                break;
                            case "tablet":
                                o.offsetMin = -250,
                                    o.offsetMax = 250;
                                break;
                            case "mobile":
                                o.offsetMin = -200,
                                    o.offsetMax = 200
                        }
                        o.offsetMin *= o.scale,
                            o.offsetMax *= o.scale
                    },
                    o._onJudgeScroll = function () {
                        l.modelState.get("isSlide") ? o.model.set({
                            scroll: !1
                        }) : o.model.set({
                            scroll: !0
                        })
                    },
                    o._onChangeScroll = function () {
                        o.model.get("scroll") ? o._start() : o._stop()
                    },
                    o._onScrollTo = function () {
                        var e, t;
                        l.modelState.get("zoomTarget") == o.model.path && (e = i.resize.attrs.innerHeight,
                            t = o.model.imgY - e / 2,
                            TweenMax.to(window, .6, {
                                scrollTo: {
                                    y: t,
                                    autoKill: !1
                                },
                                ease: Ease._2_QuadInOut
                            }).delay(.3))
                    },
                    o._onScrollReady = function () {
                        o.tweenAdd && o.tweenAdd.kill(),
                            o.addY = 400,
                            o.tweenAdd = TweenMax.to(o, .8 + d.Random.range(0, .4, .1), {
                                addY: 0,
                                ease: Ease._6_ExpoOut
                            }).eventCallback("onUpdate", o._onUpdate)
                    },
                    o._onResize = function () {
                        o._updateLayout(),
                            o._onScroll(),
                            i.resize.changed("clientWidth") && (o.currentY = o.targetY,
                                TweenMax.set(o.element, {
                                    y: o.currentY + o.addY
                                }))
                    },
                    o._onScroll = function () {
                        var e, t;
                        if (e = r.scrollerY.attrs.y,
                            t = o.position - e,
                            e > o.max || e < o.min) {
                            if (o.hidden)
                                return;
                            return o.hidden = !0,
                                o.element.classList.add("isHide"),
                                e < o.min ? o.currentY = o.height + o.offsetMax : o.currentY = o.height + o.offsetMin,
                                TweenMax.set(o.element, {
                                    y: o.currentY + o.addY
                                }),
                                o.model.updatePosition(o.currentY),
                                void s.raf.off("raf", o._onRAF)
                        }
                        o.hidden && (o.hidden = !1,
                                o.element.classList.remove("isHide"),
                                o.currentY = t > 0 ? o.height + o.offsetMax : o.height + o.offsetMin,
                                TweenMax.set(o.element, {
                                    y: o.currentY + o.addY
                                }),
                                o.model.updatePosition(o.currentY)),
                            t > 0 ? t < o.area ? t = 0 : t -= o.area : t < 0 && (t > -o.area ? t = 0 : t += o.area),
                            o.targetY = t * h,
                            s.raf.on("raf", o._onRAF)
                    },
                    o._onRAF = function () {
                        var e, t;
                        e = o.targetY - o.currentY,
                            t = Math.abs(e),
                            t < .2 ? (o.currentY = o.targetY,
                                s.raf.off("raf", o._onRAF)) : o.currentY += e * o.zeno,
                            TweenMax.set(o.element, {
                                y: o.currentY + o.addY
                            }),
                            o.model.updatePosition(o.currentY)
                    },
                    o._onUpdate = function () {
                        TweenMax.set(o.element, {
                            y: o.currentY + o.addY
                        })
                    },
                    o.scale = 1 + d.Random.ranges(0, .2, .1),
                    o.zeno = d.Random.range(.1, .15, .01),
                    o.model.on(":scroll", o._onChangeScroll),
                    l.modelState.on(":isSlide", o._onJudgeScroll),
                    u.modelMQ.on(":device", o._onDevice),
                    l.modelState.on("scrollTo", o._onScrollTo),
                    l.modelState.on("scrollReady", o._onScrollReady),
                    o._onJudgeScroll(),
                    o._onDevice(),
                    l.modelState.once("start", o._onStart),
                    o
            }
            return n(t, e),
                t.prototype._start = function () {
                    r.scrollerY.on(":y", this._onScroll),
                        this.model.on("resize", this._onResize),
                        this._onResize()
                },
                t.prototype._stop = function () {
                    r.scrollerY.off(":y", this._onScroll),
                        this.model.off("resize", this._onResize),
                        TweenMax.set(this.element, {
                            y: 0
                        }),
                        this.element.classList.remove("isHide")
                },
                t.prototype._updateLayout = function () {
                    var e, t, o;
                    e = i.resize.attrs.innerHeight,
                        t = this.model.height,
                        o = this.model.y + c.modelList.offsetY,
                        this.position = o - e / 2 + t / 2,
                        this.min = o - e,
                        this.max = o + t,
                        this.area = Math.max(e / 4, 100),
                        this.height = e / 3 * h
                },
                t
        }(a.ControllerListItemBase);
    t.ControllerListItemScroll = p
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = o(7),
        r = o(1),
        s = o(16),
        a = o(35),
        l = o(0),
        u = o(3),
        c = o(8),
        d = o(9),
        h = function () {
            function e() {
                var e = this;
                this._setSize = function () {
                        var e, t, o, i, r, a, l, c, h;
                        for (c = u.resize.attrs.clientWidth,
                            h = u.resize.attrs.innerHeight,
                            e = 0; e < n; e++)
                            t = s.modelList.items[e],
                            o = d.ConstWork.list[e],
                            i = t.element,
                            r = t.img,
                            t.width = i.clientWidth,
                            t.height = i.clientHeight,
                            t.imgWidth = r.width,
                            t.imgHeight = r.height,
                            a = c / o.width,
                            l = h / o.height,
                            t.zoomScaleIn = a > l ? a : l,
                            a = c / o.height,
                            l = h / o.width,
                            t.zoomScaleInR = a > l ? a : l,
                            a = t.imgWidth / o.width,
                            l = t.imgHeight / o.height,
                            t.zoomScaleOut = a > l ? a : l
                    },
                    this._setPosition = function () {
                        var e, t, o, i, a, l;
                        for (s.modelList.offsetX = r.SC.list.offsetLeft,
                            s.modelList.offsetY = r.SC.list.offsetTop,
                            a = u.resize.attrs.clientWidth,
                            l = u.resize.attrs.innerHeight,
                            e = 0; e < n; e++)
                            t = s.modelList.items[e],
                            o = s.modelList.offsetX + t.x + t.imgWidth / 2,
                            i = s.modelList.offsetY + t.y + t.imgHeight / 2 + t.img.offsetTop,
                            t.imgY = i,
                            t.glX = o - a / 2,
                            t.glY = -(i - l / 2),
                            t.trigger("resize"),
                            t.trigger("position")
                    },
                    this._setLayout = function () {
                        var t = i.modelMQ.get("listCols");
                        t > 0 ? e._layout(t) : e._flat()
                    },
                    this._onChangeSlide = function () {
                        l.modelState.get("isSlide") ? e._stop() : e._start()
                    },
                    this._onResize = function () {
                        var t;
                        t = i.modelMQ.changed("listCols"),
                            e._setSize(),
                            (t || 0 == i.modelMQ.attrs.listCols) && e._setLayout(),
                            e._setPosition()
                    }
            }
            return e.prototype.init = function () {
                    n = r.SC.listItems.length,
                        l.modelState.on(":isSlide", this._onChangeSlide),
                        this._onChangeSlide()
                },
                e.prototype._start = function () {
                    c.index.on("resize:1", this._onResize),
                        this._setSize(),
                        this._setLayout(),
                        this._setPosition()
                },
                e.prototype._stop = function () {
                    c.index.off("resize:1", this._onResize),
                        this._flat()
                },
                e.prototype._layout = function (e) {
                    var t, o, i, l, u, c, d, h, p, f;
                    for (3 == e ? (t = 3,
                            p = 60,
                            h = [50, 0, 100]) : (t = 2,
                            p = 100,
                            h = [50, 0]),
                        o = 0; o < n; o++)
                        i = o % t,
                        l = Math.floor(o / t),
                        d = s.modelList.items[o],
                        u = d.element.clientHeight,
                        d.x = i * (325 + p),
                        d.y = h[i],
                        d.i = i,
                        d.j = l,
                        c = d.element.style,
                        c.left = d.x + "px",
                        c.top = d.y + "px",
                        f = a.Random.range(80, 130, 10),
                        h[i] += u + f;
                    r.SC.list.style.height = Math.max.apply(Math, h) + "px"
                },
                e.prototype._flat = function () {
                    var e, t;
                    for (e = 0; e < n; e++)
                        t = s.modelList.items[e],
                        t.x = t.element.offsetLeft,
                        t.y = t.element.offsetTop,
                        t.i = 0,
                        t.j = e,
                        t.glYPosition = 0,
                        t.element.style.top = "auto",
                        t.element.style.left = "auto";
                    r.SC.list.style.height = "auto"
                },
                e
        }();
    t.ControllerListLayout = h,
        t.controllerListLayout = new h
}, function (e, t, o) {
    "use strict";

    function n(e, t, o, n) {
        var i = n ? [.1, .05, 0] : [0, .05, .1];
        return TweenMax.set([c.SC.slideHomePosition, c.SC.slideHomeName, c.SC.slideHomeFrom], {
                x: e,
                y: t
            }),
            TimelinePlus.seri(TimelinePlus.para(TimelinePlus.para(TweenMax.to(c.SC.slideHomePosition, o, {
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Ease._4_QuartOut
            }), TweenMax.to(c.SC.slideHomePosition, o, {
                autoAlpha: 1,
                ease: Ease._1_SineOut
            })).delay(i[0]), TimelinePlus.para(TweenMax.to(c.SC.slideHomeName, o, {
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Ease._4_QuartOut
            }), TweenMax.to(c.SC.slideHomeName, o, {
                autoAlpha: 1,
                ease: Ease._1_SineOut
            })).delay(i[1]), TimelinePlus.para(TweenMax.to(c.SC.slideHomeFrom, o, {
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Ease._4_QuartOut
            }), TweenMax.to(c.SC.slideHomeFrom, o, {
                autoAlpha: 1,
                ease: Ease._1_SineOut
            })).delay(i[2])))
    }

    function i(e, t, o, n) {
        var i = n ? [.15, .1, .05, 0] : [0, .05, .1, .15];
        return TweenMax.set([c.SC.slideWorksHeader, c.SC.slideWorksTitle, c.SC.slideWorksDescription, c.SC.slideWorksInfo], {
                x: e,
                y: t
            }),
            TimelinePlus.seri(TimelinePlus.para(TimelinePlus.para(TweenMax.to(c.SC.slideWorksHeader, o, {
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Ease._4_QuartOut
            }), TweenMax.to(c.SC.slideWorksHeader, o, {
                autoAlpha: 1,
                ease: Ease._1_SineOut
            })).delay(i[0]), TimelinePlus.para(TweenMax.to(c.SC.slideWorksTitle, o, {
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Ease._4_QuartOut
            }), TweenMax.to(c.SC.slideWorksTitle, o, {
                autoAlpha: 1,
                ease: Ease._1_SineOut
            })).delay(i[1]), TimelinePlus.para(TweenMax.to(c.SC.slideWorksDescription, o, {
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Ease._4_QuartOut
            }), TweenMax.to(c.SC.slideWorksDescription, o, {
                autoAlpha: 1,
                ease: Ease._1_SineOut
            })).delay(i[2]), TimelinePlus.para(TweenMax.to(c.SC.slideWorksInfo, o, {
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Ease._4_QuartOut
            }), TweenMax.to(c.SC.slideWorksInfo, o, {
                autoAlpha: 1,
                ease: Ease._1_SineOut
            })).delay(i[3])))
    }

    function r(e, t, o, n) {
        var i = n ? [.1, .05, 0] : [0, .05, .1];
        return TimelinePlus.seri(TimelinePlus.para(TimelinePlus.para(TweenMax.to(c.SC.slideHomePosition, o, {
            x: e,
            y: t,
            scaleY: .5,
            ease: Ease._4_QuartIn
        }), TweenMax.to(c.SC.slideHomePosition, o, {
            autoAlpha: 0,
            ease: Ease._1_SineIn
        })).delay(i[0]), TimelinePlus.para(TweenMax.to(c.SC.slideHomeName, o, {
            x: e,
            y: t,
            scaleY: .666,
            ease: Ease._4_QuartIn
        }), TweenMax.to(c.SC.slideHomeName, o, {
            autoAlpha: 0,
            ease: Ease._1_SineIn
        })).delay(i[1]), TimelinePlus.para(TweenMax.to(c.SC.slideHomeFrom, o, {
            x: e,
            y: t,
            scaleY: .5,
            ease: Ease._4_QuartIn
        }), TweenMax.to(c.SC.slideHomeFrom, o, {
            autoAlpha: 0,
            ease: Ease._1_SineIn
        })).delay(i[2])))
    }

    function s(e, t, o, n) {
        var i = n ? [.15, .1, .05, 0] : [0, .05, .1, .15];
        return TimelinePlus.seri(TimelinePlus.para(TimelinePlus.para(TweenMax.to(c.SC.slideWorksHeader, o, {
            x: e,
            y: t,
            scaleY: .5,
            ease: Ease._4_QuartIn
        }), TweenMax.to(c.SC.slideWorksHeader, o, {
            autoAlpha: 0,
            ease: Ease._1_SineIn
        })).delay(i[0]), TimelinePlus.para(TweenMax.to(c.SC.slideWorksTitle, o, {
            x: e,
            y: t,
            scaleY: .666,
            ease: Ease._4_QuartIn
        }), TweenMax.to(c.SC.slideWorksTitle, o, {
            autoAlpha: 0,
            ease: Ease._1_SineIn
        })).delay(i[1]), TimelinePlus.para(TweenMax.to(c.SC.slideWorksDescription, o, {
            x: t,
            y: t,
            scaleY: .75,
            ease: Ease._4_QuartIn
        }), TweenMax.to(c.SC.slideWorksDescription, o, {
            autoAlpha: 0,
            ease: Ease._1_SineIn
        })).delay(i[2]), TimelinePlus.para(TweenMax.to(c.SC.slideWorksInfo, o, {
            x: e,
            y: t,
            scaleY: .75,
            ease: Ease._4_QuartIn
        }), TweenMax.to(c.SC.slideWorksInfo, o, {
            autoAlpha: 0,
            ease: Ease._1_SineIn
        })).delay(i[3])))
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var a, l, u = o(0),
        c = o(1),
        d = o(9),
        h = o(7),
        p = o(3),
        f = function () {
            function e() {
                var e = this;
                this._onStart = function () {
                        u.modelState.on(":isSlideText", e._onChangeSlideText),
                            e._onChangeSlideText()
                    },
                    this._onChangeSlideText = function () {
                        var e, t, o, f = u.modelState.get("isSlideText"),
                            m = u.modelState.get("slideIndex"),
                            v = u.modelState.slideDir,
                            _ = h.modelMQ.get("computer") && Useragnt.pc,
                            g = p.resize.get("clientWidth") / p.resize.get("innerHeight");
                        t = o = 30,
                            g > 1 ? t *= g : o *= 1 / g;
                        var y = v < 0;
                        f ? 0 != m ? (e = d.ConstWork.list[m - 1],
                            c.SC.slideWorksNum.textContent = e.idString,
                            c.SC.slideWorksCategory.textContent = e.category,
                            c.SC.slideWorksTitle.innerHTML = e.title,
                            c.SC.slideWorksDescription.innerHTML = e.description,
                            c.SC.slideWorksPlay.setAttribute("href", e.vimeoURL),
                            c.SC.slideWorksShareFacebook.setAttribute("href", e.shareFacebook),
                            c.SC.slideWorksShareTwitter.setAttribute("href", e.shareTwitter),
                            _ ? TweenMax.set([c.SC.slideWorksHeader, c.SC.slideWorksTitle, c.SC.slideWorksDescription, c.SC.slideWorksInfo], {
                                autoAlpha: 1,
                                x: 1,
                                y: 1,
                                scaleY: 1
                            }) : (l && l.kill(),
                                l = i(v * t, v * o, .8, y))) : _ ? TweenMax.set([c.SC.slideHomePosition, c.SC.slideHomeName, c.SC.slideHomeFrom], {
                            autoAlpha: 1,
                            x: 1,
                            y: 1,
                            scaleY: 1
                        }) : (a && a.kill(),
                            a = n(v * t, v * o, .8, y)) : (a && a.kill(),
                            l && l.kill(),
                            _ ? TweenMax.set([c.SC.slideHomePosition, c.SC.slideHomeName, c.SC.slideHomeFrom, c.SC.slideWorksHeader, c.SC.slideWorksTitle, c.SC.slideWorksDescription, c.SC.slideWorksInfo], {
                                autoAlpha: 0
                            }) : (a = r(-v * t, -v * o, .5, y),
                                l = s(-v * t, -v * o, .5, y)))
                    }
            }
            return e.prototype.init = function () {
                    return u.modelState.once("start", this._onStart),
                        TweenMax.set([c.SC.slideHomePosition, c.SC.slideHomeName, c.SC.slideHomeFrom, c.SC.slideWorksHeader, c.SC.slideWorksTitle, c.SC.slideWorksDescription, c.SC.slideWorksInfo], {
                            autoAlpha: 0
                        }),
                        this
                },
                e
        }();
    t.ControllerSlideDetails = f,
        t.controllerSlideDetails = new f
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r = o(80),
        s = o(0),
        a = o(1),
        l = o(7),
        u = o(2),
        c = o(9),
        d = function () {
            function e() {
                this._onChangeDevice = function () {
                        "mobile" != l.modelMQ.get("device") && s.modelState.set({
                            isSlideInfo: !1
                        })
                    },
                    this._open = function () {
                        s.modelState.set({
                            isSlideInfo: !0
                        })
                    },
                    this._close = function () {
                        s.modelState.set({
                            isSlideInfo: !1
                        })
                    },
                    this._onChangeSlideInfo = function () {
                        n && n.kill(),
                            s.modelState.get("isSlideInfo") ? (s.modelState.set({
                                    isSlideInfoStart: !0
                                }),
                                n = TimelinePlus.call(s.modelState.set, [{
                                    isSlideInfoEnd: !0
                                }], s.modelState).delay(.1),
                                a.SC.slideInfoScroll.scrollTop = 0) : (s.modelState.set({
                                    isSlideInfoEnd: !1
                                }),
                                n = TimelinePlus.call(s.modelState.set, [{
                                    isSlideInfoStart: !1
                                }], s.modelState).delay(.85))
                    },
                    this._onChangeSlideInfoStart = function () {
                        var e;
                        s.modelState.get("isSlideInfoStart") && (e = c.ConstWork.list[s.modelState.get("slideIndex") - 1],
                            a.SC.slideInfoNum.textContent = e.idString,
                            a.SC.slideInfoCategory.textContent = e.category,
                            a.SC.slideInfoTitle.innerHTML = e.title,
                            a.SC.slideInfoDescription.innerHTML = e.description,
                            a.SC.slideInfoShareFacebook.setAttribute("href", e.shareFacebook),
                            a.SC.slideInfoShareTwitter.setAttribute("href", e.shareTwitter),
                            i.start())
                    },
                    this._onChangeSlideInfoEnd = function () {
                        s.modelState.get("isSlideInfoEnd") || i.stop()
                    }
            }
            return e.prototype.init = function () {
                    i = new r.ScrollModal(a.SC.slideInfoScroll),
                        u.routeManagerPlus.on(":path", this._close),
                        l.modelMQ.on(":device", this._onChangeDevice),
                        s.modelState.on(":isSlideInfo", this._onChangeSlideInfo),
                        s.modelState.on(":isSlideInfoStart", this._onChangeSlideInfoStart),
                        s.modelState.on(":isSlideInfoEnd", this._onChangeSlideInfoEnd),
                        a.SC.slideWorksInfo.addEventListener("click", this._open),
                        a.SC.slideInfoBack.addEventListener("click", this._close)
                },
                e
        }();
    t.ControllerSlideInfo = d,
        t.controllerSlideInfo = new d
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i = o(1),
        r = o(2),
        s = o(19),
        a = o(0),
        l = o(11),
        u = o(7),
        c = o(113),
        d = o(9),
        h = function () {
            function e() {
                this._onMQ = function () {
                        var e, t = u.modelMQ.get("breakpoint");
                        switch (t) {
                            case "large":
                            case "medium":
                                e = 0;
                                break;
                            case "short":
                                e = 1;
                                break;
                            case "tablet_l":
                            case "tablet_p":
                                e = 2;
                                break;
                            case "mobile_l":
                                e = 3;
                                break;
                            case "mobile_p":
                                e = Useragnt.ios ? 4 : 3
                        }
                        c.modelNavi.set({
                            arrowSize: e
                        })
                    },
                    this._onArrowSize = function () {
                        var e, t, o, n = c.modelNavi.get("arrowSize");
                        switch (n) {
                            case 0:
                                e = "0 0 360 7",
                                    t = "360,7 0,7 21,0 21,6 360,6",
                                    o = "0,7 360,7 339,0 339,6 0,6";
                                break;
                            case 1:
                                e = "0 0 320 7",
                                    t = "320,7 0,7 21,0 21,6 320,6",
                                    o = "0,7 320,7 299,0 299,6 0,6";
                                break;
                            case 2:
                                e = "0 0 240 7",
                                    t = "240,7 0,7 21,0 21,6 240,6",
                                    o = "0,7 240,7 219,0 219,6 0,6";
                                break;
                            case 3:
                                e = "0 0 100 5",
                                    t = "100,5 0,5 15,0 15,4 100,4",
                                    o = "0,5 100,5 85,0 85,4 0,4";
                                break;
                            case 4:
                                e = "0 0 5 43",
                                    t = "0,0 1,15 1,15 1,43 0,43",
                                    o = "0,0 1,0 1,28 5,28 0,43"
                        }
                        i.SC.slideNaviPrevSVG.setAttribute("viewBox", e),
                            i.SC.slideNaviPrevPolyline.setAttribute("points", t),
                            i.SC.slideNaviNextSVG.setAttribute("viewBox", e),
                            i.SC.slideNaviNextPolyline.setAttribute("points", o)
                    },
                    this._onKeyUp = function (e) {
                        var t = e.keyCode,
                            o = r.routeManagerPlus.get("path");
                        e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || (39 == t || 40 == t ? r.routeManagerPlus.isSlide(o) && r.routeManagerPlus.nextSlide(!0) : 37 != t && 38 != t || r.routeManagerPlus.isSlide(o) && r.routeManagerPlus.prevSlide(!0))
                    },
                    this._onClick = function (e) {
                        var t = e.currentTarget;
                        e.preventDefault(),
                            r.routeManagerPlus.goto(t.getAttribute("href"), null, !0)
                    },
                    this._onChangeSlideText = function () {
                        var e = a.modelState.get("slideIndex");
                        if (a.modelState.get("isSlideText")) {
                            var t = (e + 1) % n,
                                o = (e - 1 + n) % n;
                            i.SC.slideNaviNextNum.textContent = l.ConstSlide.list[t].idString,
                                i.SC.slideNaviPrevNum.textContent = l.ConstSlide.list[o].idString,
                                i.SC.slideNaviNext.setAttribute("href", r.routeManagerPlus.getPathBySlideIndex(t)),
                                i.SC.slideNaviPrev.setAttribute("href", r.routeManagerPlus.getPathBySlideIndex(o)),
                                i.SC.slideNaviNextTitle.textContent = 0 == t ? "TAO TAJIMA" : d.ConstWork.list[t - 1].title,
                                i.SC.slideNaviPrevTitle.textContent = 0 == o ? "TAO TAJIMA" : d.ConstWork.list[o - 1].title
                        }
                    }
            }
            return e.prototype.init = function () {
                    n = s.ConstConfig.pathWorksList.length + 1,
                        i.SC.slideNaviPrev.addEventListener("click", this._onClick),
                        i.SC.slideNaviNext.addEventListener("click", this._onClick),
                        window.addEventListener("keyup", this._onKeyUp),
                        a.modelState.on(":isSlideText", this._onChangeSlideText),
                        this._onChangeSlideText(),
                        u.modelMQ.on(":breakpoint", this._onMQ),
                        this._onMQ(),
                        c.modelNavi.on(":arrowSize", this._onArrowSize),
                        this._onArrowSize()
                },
                e
        }();
    t.ControllerSlideNavi = h,
        t.controllerSlideNavi = new h
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r, s, a, l, u = o(0),
        c = o(1),
        d = o(7),
        h = o(2),
        p = o(9),
        f = o(8),
        m = o(3),
        v = function () {
            function e() {
                var e = this;
                this._onChangePath = function (e) {
                        u.modelState.set({
                            isSlideVimeo: !1,
                            isSlideVimeoCancel: !0
                        })
                    },
                    this._onClick = function (t) {
                        "computer" == d.modelMQ.get("device") && (t.preventDefault(),
                            e._open())
                    },
                    this._onChangeDevice = function () {
                        "computer" != d.modelMQ.get("device") && u.modelState.set({
                            isSlideVimeo: !1,
                            isSlideVimeoCancel: !1,
                            isSlideVimeoStart: !1,
                            isSlideVimeoEnd: !1
                        })
                    },
                    this._open = function () {
                        u.modelState.set({
                            isSlideVimeoCancel: !1,
                            isSlideVimeo: !0
                        })
                    },
                    this._close = function () {
                        u.modelState.set({
                            isSlideVimeoCancel: !1,
                            isSlideVimeo: !1
                        })
                    },
                    this._onChangeSlideVimeoStart = function () {
                        var t;
                        n && n.kill(),
                            u.modelState.get("isSlideVimeoStart") ? (t = p.ConstWork.list[u.modelState.get("slideIndex") - 1],
                                s = document.createElement("iframe"),
                                s.setAttribute("src", "https://player.vimeo.com/video/" + t.vimeoID + "?autoplay=1&title=0&byline=0&portrait=0"),
                                c.SC.slideVimeo.appendChild(s),
                                a = t.vimeoWidth,
                                l = t.vimeoHeight,
                                r = new Vimeo.Player(s),
                                r.ready().then(e._onResize)) : (c.SC.slideVimeo.removeChild(s),
                                f.index.off("resize", e._onResize))
                    },
                    this._onChangeSlideVimeoEnd = function () {
                        i && i.kill(),
                            u.modelState.get("isSlideVimeoEnd") ? (e._onResize(),
                                f.index.on("resize", e._onResize)) : (h.routeManagerPlus.trigger("loop"),
                                r.pause())
                    },
                    this._onResize = function () {
                        var e, t, o, n, i;
                        e = m.resize.get("clientWidth"),
                            t = m.resize.get("innerHeight"),
                            o = e / a,
                            n = t / l,
                            i = o < n ? .9 * o : .9 * n,
                            r.element.width = Math.ceil(i * a),
                            r.element.height = Math.ceil(i * l)
                    }
            }
            return e.prototype.init = function () {
                    Useragnt.pc && (h.routeManagerPlus.on(":path", this._onChangePath),
                        d.modelMQ.on(":device", this._onChangeDevice),
                        u.modelState.on(":isSlideVimeoStart", this._onChangeSlideVimeoStart),
                        u.modelState.on(":isSlideVimeoEnd", this._onChangeSlideVimeoEnd),
                        c.SC.slideWorksPlay.addEventListener("click", this._onClick),
                        c.SC.slideVimeoClose.addEventListener("click", this._close))
                },
                e
        }();
    t.ControllerSlideVimeo = v,
        t.controllerSlideVimeo = new v
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(38),
        i = o(4),
        r = o(3),
        s = o(28),
        a = 0,
        l = 0,
        u = 0,
        c = 0,
        d = .15,
        h = function () {
            function e() {
                var e = this;
                this._onMouseMove = function () {
                        var e = r.resize.attrs.clientWidth,
                            t = r.resize.attrs.innerHeight;
                        a = s.pointer.attrs.x / e * 2 - 1,
                            l = -(s.pointer.attrs.y / t * 2 - 1)
                    },
                    this._just = function () {
                        e._onMouseMove(),
                            u = a,
                            c = l,
                            e._setRay()
                    },
                    this._onRAF = function (t, o) {
                        o *= 60,
                            u += (a - u) * o * d,
                            c += (l - c) * o * d,
                            e._setRay()
                    },
                    this._onChange = function () {
                        n.modelThreeRayCaster.get("running") ? e._start() : e._stop()
                    }
            }
            return e.prototype.init = function () {
                    n.modelThreeRayCaster.on(":running", this._onChange),
                        n.modelThreeRayCaster.on("update", this._just),
                        this._onChange()
                },
                e.prototype._start = function () {
                    s.pointer.on(":", this._onMouseMove),
                        i.threeManager.on("draw:1", this._onRAF),
                        this._onMouseMove()
                },
                e.prototype._stop = function () {
                    s.pointer.off(":", this._onMouseMove),
                        i.threeManager.off("draw:1", this._onRAF)
                },
                e.prototype._setRay = function () {
                    i.threeManager.rayCaster.ray.direction.set(u, c, 1).unproject(i.threeManager.camera).sub(i.threeManager.camera.position).normalize()
                },
                e
        }();
    t.ControllerThreeRayCaster = h,
        t.controllerThreeRayCaster = new h
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r, s, a, l = o(31),
        u = o(0),
        c = o(1),
        d = o(3),
        h = o(8),
        p = o(7),
        f = o(20),
        m = o(36),
        v = o(4),
        _ = [.2, .3, .5, .6],
        g = .4,
        y = function () {
            function e() {
                var e = this;
                this._progress1 = 0,
                    this._progress2 = 0,
                    this._onRAF = function (t, o) {
                        ++a > 1 && (l.threeBlack.mesh.visible = !1,
                            v.threeManager.off("draw", e._onRAF))
                    },
                    this._onChangeDevice = function () {
                        "computer" != p.modelMQ.get("device") ? (u.modelState.off(":isSlideVimeoCancel", e._onChangeSlideVimeoCancel),
                            u.modelState.off(":isSlideVimeo", e._onChangeSlideVimeo),
                            h.index.off("resize", e._onResize),
                            e._progress1 = e._progress2 = 0,
                            e._onUpdate()) : (u.modelState.on(":isSlideVimeoCancel", e._onChangeSlideVimeoCancel),
                            u.modelState.on(":isSlideVimeo", e._onChangeSlideVimeo),
                            h.index.on("resize", e._onResize),
                            e._onResize())
                    },
                    this._onChangeSlideVimeoCancel = function () {
                        var e = u.modelState.get("isSlideVimeoCancel"),
                            t = u.modelState.get("isSlideVimeoEnd");
                        e && !t && (i && i.kill(),
                            i = TweenMax.to(r.opacity, .2, {
                                value: 0,
                                ease: Ease._1_SineOut
                            }))
                    },
                    this._onChangeSlideVimeo = function () {
                        "computer" == p.modelMQ.get("device") && (n && n.kill(),
                            i && i.kill(),
                            u.modelState.get("isSlideVimeo") ? (r.opacity.value = 1,
                                l.threeBlack.mesh.visible = !0,
                                e._onResize(),
                                c.SC.slideWorksPlay.classList.remove("isDelay"),
                                u.modelState.set({
                                    isSlideVimeoStart: !0
                                }),
                                n = TimelinePlus.seri(TimelinePlus.para(TweenMax.to(e, 1.2, {
                                    _progress1: .2,
                                    ease: Ease._3_CubicOut
                                }), TweenMax.to(e, 1.2, {
                                    _progress2: .8,
                                    ease: Ease._3_CubicInOut
                                }).delay(.5)), TimelinePlus.call(u.modelState.set, [{
                                    isSlideVimeoEnd: !0
                                }], u.modelState), TimelinePlus.wait(.05), TimelinePlus.call(e._startComplete)).eventCallback("onUpdate", e._onUpdate)) : (l.threeBlack.mesh.visible = !0,
                                c.SC.slideWorksPlay.classList.add("isDelay"),
                                u.modelState.set({
                                    isSlideVimeoEnd: !1
                                }),
                                n = TimelinePlus.seri(TimelinePlus.para(TweenMax.to(e, 1, {
                                    _progress1: 0,
                                    ease: Ease._3_CubicInOut
                                }), TweenMax.to(e, 1, {
                                    _progress2: 0,
                                    ease: Ease._3_CubicInOut
                                }), TimelinePlus.call(u.modelState.set, [{
                                    isSlideVimeoStart: !1
                                }], u.modelState).delay(.6)), TimelinePlus.wait(.05), TimelinePlus.call(e._endComplete)).eventCallback("onUpdate", e._onUpdate),
                                u.modelState.get("isSlideVimeoCancel") && (i = TweenMax.to(r.opacity, .5, {
                                    value: 0,
                                    ease: Ease._1_SineOut
                                }).delay(.3))))
                    },
                    this._startComplete = function () {
                        s = m.createRandomArray(4),
                            l.threeBlack.mesh.visible = !1
                    },
                    this._endComplete = function () {
                        s = m.createRandomArray(4),
                            c.SC.slideWorksPlay.classList.remove("isDelay"),
                            l.threeBlack.mesh.visible = !1
                    },
                    this._onUpdate = function () {
                        var t = e._progress1 + e._progress2;
                        r.progress.value.x = f.smoothStep(.2, .9, t),
                            r.progress.value.y = f.smoothStep(.1, .8, t),
                            r.progress.value.z = t;
                        var o = f.smoothStep(0, .9, t);
                        r.progress.value.w = o < .5 ? 2 * o : 2 * (1 - o),
                            r.corners.value.x = f.smoothStep2(_[s[0]], g, t),
                            r.corners.value.y = f.smoothStep2(_[s[1]], g, t),
                            r.corners.value.z = f.smoothStep2(_[s[2]], g, t),
                            r.corners.value.w = f.smoothStep2(_[s[3]], g, t)
                    },
                    this._onResize = function () {
                        var e, t, o;
                        e = d.resize.get("clientWidth"),
                            t = d.resize.get("innerHeight"),
                            o = c.SC.slideWorksPlay.getBoundingClientRect(),
                            r.center.value.set(o.left + 80 - e / 2, t - (o.top + 80) - t / 2)
                    }
            }
            return e.prototype.init = function () {
                    return r = l.threeBlack.uniforms,
                        s = m.createRandomArray(4),
                        p.modelMQ.on(":device", this._onChangeDevice),
                        this._onChangeDevice(),
                        a = 0,
                        v.threeManager.on("draw", this._onRAF),
                        this
                },
                e
        }();
    t.ControllerThreeBlack = y,
        t.controllerThreeBlack = new y
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(3),
        s = o(8),
        a = o(26),
        l = o(17),
        u = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onResize = function () {
                        var e = r.resize.get("clientWidth"),
                            t = r.resize.get("innerHeight");
                        o.mesh.scale.set(e, t, 1);
                        var n = o.uniforms.uvRate.value;
                        n.x = i.u,
                            n.y = i.v,
                            n.z = i.s,
                            n.w = i.t
                    },
                    i = l.modelSlide.uvList[0],
                    s.index.on("resize", o._onResize),
                    o._onResize(),
                    o
            }
            return n(t, e),
                t
        }(a.ControllerThreeHomeBase);
    t.ControllerThreeHomeTexture = u
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(4),
        s = o(26),
        a = o(10),
        l = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onRAF = function (e, t) {
                        ++i > 1 && (o.mesh.visible = !1,
                            r.threeManager.off("draw", o._onRAF))
                    },
                    o._onVisibleIn = function () {
                        o._setTexture(),
                            o.mesh.visible = !0
                    },
                    o._onChangeVisible = function () {
                        o.model.get("visible") ? (o._setTexture(),
                            o.mesh.visible = !0) : (o._unsetTexture(),
                            o.mesh.visible = !1)
                    },
                    o._onVideoPlayDelay = function () {
                        o._tweenDelay && o._tweenDelay.kill(),
                            o._tweenDelay = TimelinePlus.call(o._onVideoPlay).delay(.1)
                    },
                    o._onVideoPlay = function () {
                        r.threeManager.on("draw", o._onRAFVideoPlaying),
                            o.texture.image = o.video.video
                    },
                    o._onRAFVideoPlaying = function () {
                        var e = o.video.video;
                        e && e.readyState > e.HAVE_CURRENT_DATA && (o.texture.needsUpdate = !0)
                    },
                    o.model.on("visibleIn", o._onVisibleIn).on(":visible", o._onChangeVisible),
                    i = 0,
                    r.threeManager.on("draw", o._onRAF),
                    o
            }
            return n(t, e),
                t.prototype._setTexture = function () {
                    this.texture.image = this.video.image,
                        this.texture.needsUpdate = !0,
                        a.C.videoUsing && (this.video.isPlaying ? this._onVideoPlay() : (this.video.once("play", this._onVideoPlayDelay),
                            this.video.resume(.25)))
                },
                t.prototype._unsetTexture = function () {
                    a.C.videoUsing && (this.model.get("play") || this.video.pause(),
                        r.threeManager.off("draw", this._onRAFVideoPlaying))
                },
                t
        }(s.ControllerThreeHomeBase);
    t.ControllerThreeHomeVisible = l
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(26),
        r = o(0),
        s = o(20),
        a = o(1),
        l = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onZoomIn = function () {
                        o.model.set({
                                zoom: !0,
                                visible: !0
                            }, {
                                silent: !0
                            }),
                            o.model.trigger("visibleIn"),
                            o.uniforms.progress.value = 1
                    },
                    o._onZoomOut = function () {
                        o.model.set({
                                zoom: !1,
                                visible: !1
                            }, {
                                silent: !0
                            }),
                            o.model.trigger("visibleOut"),
                            o.uniforms.progress.value = 0
                    },
                    o._onChangeZoom = function () {
                        o._tween && o._tween.kill();
                        var e, t, n = o.model.get("zoomCancel"),
                            i = n ? .75 : 1.5;
                        o.model.get("zoom") ? o._tween = TimelinePlus.seri(TweenMax.to(o.uniforms.progress, i, {
                                value: 1,
                                ease: Ease._3_CubicInOut
                            }), TimelinePlus.call(o._onZoomInComplete)).eventCallback("onUpdate", o._onUpdate) : (e = new TimelineMax,
                                t = TweenMax.to(o.uniforms.progress, i, {
                                    value: 0,
                                    ease: Ease._3_CubicIn
                                }),
                                n ? e.add([t]) : e.add([t, TimelinePlus.call(r.modelState.trigger, ["scrollReady"], r.modelState).delay(1.2)]),
                                o._tween = TimelinePlus.seri(e, TimelinePlus.call(o._onZoomOutComplete)).eventCallback("onUpdate", o._onUpdate)),
                            o.model.set({
                                visible: !0
                            })
                    },
                    o._onUpdate = function () {
                        var e = 1 - s.smoothStep(0, .4, o.uniforms.progress.value);
                        TweenMax.set([a.SC.list, a.SC.about], {
                            autoAlpha: e
                        })
                    },
                    o._onZoomInComplete = function () {
                        o.model.set({
                                visible: !1,
                                play: !0
                            }),
                            r.modelState.set({
                                isZoomIn: !1,
                                isZoom: !1,
                                isSlide: !0
                            })
                    },
                    o._onZoomOutComplete = function () {
                        o.model.set({
                                visible: !1,
                                play: !1
                            }),
                            r.modelState.set({
                                isZoomOut: !1,
                                isZoom: !1,
                                isList: !0
                            })
                    },
                    o.model.on("zoomIn", o._onZoomIn).on("zoomOut", o._onZoomOut).on(":zoom", o._onChangeZoom),
                    o
            }
            return n(t, e),
                t
        }(i.ControllerThreeHomeBase);
    t.ControllerThreeHomeZoom = l
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(21),
        r = o(10),
        s = o(4),
        a = o(38),
        l = o(0),
        u = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onChangeList = function () {
                        !l.modelState.get("isList") && o.model.get("hover") ? o._stop() : o._start()
                    },
                    o._onChangeHover = function () {
                        o._tween && o._tween.kill(),
                            o.model.get("hover") ? (o.model.set({
                                    visible: !0,
                                    play: !0,
                                    progress: !0
                                }),
                                a.modelThreeRayCaster.add(),
                                s.threeManager.on("draw", o._onRAF),
                                o._tween = TimelinePlus.para(TweenMax.to(o.three, .6, {
                                    scale: r.C.listHoverScale,
                                    ease: Ease._BackOut
                                }), TweenMax.to(o.hover, .6, {
                                    z: 1,
                                    ease: Ease._3_CubicOut
                                }))) : (l.modelState.get("isList") && o.model.set({
                                    progress: !1
                                }),
                                o._tween = TimelinePlus.seri(TimelinePlus.para(TweenMax.to(o.three, .7, {
                                    scale: 1,
                                    ease: Ease._4_QuartOut
                                }), TweenMax.to(o.hover, .7, {
                                    z: 0,
                                    ease: Ease._3_CubicOut
                                })), TimelinePlus.call(o._hoverOut)),
                                a.modelThreeRayCaster.remove())
                    },
                    o._hoverOut = function () {
                        s.threeManager.off("draw", o._onRAF),
                            (l.modelState.get("isList") || o.model.path != l.modelState.get("zoomTarget")) && o.model.set({
                                visible: !1,
                                play: !1
                            })
                    },
                    o._onRAF = function () {
                        var e, t = s.threeManager.rayCaster.intersectObject(o.mesh);
                        t.length > 0 && (e = t[0].point,
                            o.mesh.worldToLocal(e),
                            o.hover.x = e.x / o.three.constWork.width + .5,
                            o.hover.y = e.y / o.three.constWork.height + .5)
                    },
                    o._onHover = function () {
                        var e = o.model,
                            t = (e.imgWidth * r.C.listHoverScale - e.width) / 2,
                            n = (e.imgHeight * r.C.listHoverScale - e.height) / 2;
                        (!t || t < 0) && (t = 0),
                        (!n || n < 0) && (n = 0),
                        o.three.positionHover.x = -o.model.hoverX * t,
                            o.three.positionHover.y = o.model.hoverY * n
                    },
                    o.hover = o.uniforms.hover.value,
                    l.modelState.on(":isList", o._onChangeList),
                    o.model.on(":hover", o._onChangeHover).on("hover", o._onHover),
                    o
            }
            return n(t, e),
                t.prototype._start = function () {},
                t.prototype._stop = function () {
                    this._tween && this._tween.kill(),
                        a.modelThreeRayCaster.remove(),
                        s.threeManager.off("draw", this._onRAF),
                        this._tween = TimelinePlus.seri(TimelinePlus.para(TweenMax.to(this.three, 1, {
                            scale: 1,
                            ease: Ease._4_QuartOut
                        }), TweenMax.to(this.hover, 1, {
                            z: 0,
                            ease: Ease._3_CubicOut
                        })))
                },
                t
        }(i.ControllerThreeListItemBase);
    t.ControllerThreeListItemHover = u
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(21),
        r = o(12),
        s = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onPosition = function () {
                        var e, t, n;
                        e = o.model,
                            t = Math.ceil(e.glX),
                            n = e.glY + e.glYPosition + r.scrollerY.attrs.y,
                            o.three.position.x = t,
                            o.three.position.y = n
                    },
                    o.model.on("position", o._onPosition),
                    o._onPosition(),
                    o
            }
            return n(t, e),
                t
        }(i.ControllerThreeListItemBase);
    t.ControllerThreeListItemPosition = s
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(21),
        s = o(4),
        a = o(10),
        l = o(0),
        u = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onRAF = function (e, t) {
                        ++i > 1 && (o.mesh.visible = !1,
                            s.threeManager.off("draw", o._onRAF))
                    },
                    o._onStart = function () {
                        o.model.on("visibleIn", o._onVisibleIn).on("visibleOut", o._onVisibleOut).on(":visible", o._onChangeVisible).on("progressIn", o._onProgressIn).on("progressOut", o._onProgressOut).on(":progress", o._onChangeProgress)
                    },
                    o._onProgressIn = function () {
                        o.uniforms.progress.value = 1
                    },
                    o._onProgressOut = function () {
                        o.uniforms.progress.value = 0
                    },
                    o._onChangeProgress = function () {
                        o._tweenUniforms && o._tweenUniforms.kill(),
                            o.model.get("progress") ? o._tweenUniforms = TimelinePlus.seri(TweenMax.to(o.uniforms.progress, 1, {
                                value: 1,
                                ease: Ease._3_CubicOut
                            })) : o._tweenUniforms = TimelinePlus.seri(TweenMax.to(o.uniforms.progress, .7, {
                                value: 0,
                                ease: Ease._2_QuadInOut
                            }))
                    },
                    o._onVisibleIn = function () {
                        o.mesh.visible = !0,
                            o._setTexture()
                    },
                    o._onVisibleOut = function () {
                        o.mesh.visible = !1,
                            o._unsetTexture()
                    },
                    o._onChangeVisible = function () {
                        o.model.get("visible") ? (o.mesh.visible = !0,
                            o._setTexture()) : (o.mesh.visible = !1,
                            o._unsetTexture())
                    },
                    o._onVideoPlayDelay = function () {
                        o._tweenDelay && o._tweenDelay.kill(),
                            o._tweenDelay = TimelinePlus.call(o._onVideoPlay).delay(.1)
                    },
                    o._onVideoPlay = function () {
                        s.threeManager.on("draw", o._onRAFVideoPlaying),
                            o.texture2.image = o.video.video
                    },
                    o._onRAFVideoPlaying = function () {
                        var e = o.video.video;
                        e && e.readyState > e.HAVE_CURRENT_DATA && (o.texture2.needsUpdate = !0)
                    },
                    l.modelState.once("start", o._onStart),
                    i = 0,
                    s.threeManager.on("draw", o._onRAF),
                    o
            }
            return n(t, e),
                t.prototype._setTexture = function () {
                    this.texture1.image = this.model.img,
                        this.texture1.needsUpdate = !0,
                        this.texture2.image = this.video.image,
                        this.texture2.needsUpdate = !0,
                        a.C.videoUsing && (this.video.isPlaying ? this._onVideoPlay() : (this.video.once("play", this._onVideoPlayDelay),
                            this.video.resume()))
                },
                t.prototype._unsetTexture = function () {
                    a.C.videoUsing && (this.model.get("play") || this.video.pause(),
                        s.threeManager.off("draw", this._onRAFVideoPlaying))
                },
                t
        }(r.ControllerThreeListItemBase);
    t.ControllerThreeListItemVisible = u
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(21),
        r = o(0),
        s = o(36),
        a = o(20),
        l = o(4),
        u = o(1),
        c = [0, .1, .2, .3],
        d = .7,
        h = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._progress1 = 0,
                    o._progress2 = 0,
                    o._onChangeZoom = function () {
                        var e, t = o.model.get("zoom");
                        r.modelState.get("isZoom");
                        o._onResize(),
                            t ? (o.model.set({
                                    active: !0,
                                    visible: !0,
                                    progress: !0
                                }),
                                o._tween ? (o._tween.kill(),
                                    e = TimelinePlus.para(TweenMax.to(o, .6, {
                                        _progress1: .5,
                                        ease: Ease._3_CubicOut
                                    }), TweenMax.to(o, .75, {
                                        _progress2: .5,
                                        ease: Ease._3_CubicOut
                                    }), TimelinePlus.call(o._zoomInComplete).delay(.7))) : e = TimelinePlus.para(TweenMax.to(o, 1.2, {
                                    _progress1: .5,
                                    ease: Ease._3_CubicInOut
                                }), TweenMax.to(o, 1.5, {
                                    _progress2: .5,
                                    ease: Ease._2_QuadInOut
                                }), TimelinePlus.call(o._zoomInComplete).delay(1.4)),
                                o._tween = TimelinePlus.seri(e).eventCallback("onUpdate", o._onUpdate)) : (o.model.set({
                                    active: !0,
                                    visible: !0
                                }),
                                o._tween ? (o._tween.kill(),
                                    e = TimelinePlus.para(TweenMax.to(o, .8, {
                                        _progress1: 0,
                                        ease: Ease._3_CubicOut
                                    }), TweenMax.to(o, .8, {
                                        _progress2: 0,
                                        ease: Ease._3_CubicOut
                                    }), TimelinePlus.call(o.model.set, [{
                                        progress: !1
                                    }], o.model), TimelinePlus.call(o.model.set, [{
                                        active: !1
                                    }], o.model).delay(.55))) : e = TimelinePlus.para(TweenMax.to(o, 1.6, {
                                    _progress1: 0,
                                    ease: Ease._3_CubicInOut
                                }), TweenMax.to(o, 1.6, {
                                    _progress2: 0,
                                    ease: Ease._3_CubicInOut
                                }), TimelinePlus.call(o.model.set, [{
                                    progress: !1
                                }], o.model).delay(.8), TimelinePlus.call(r.modelState.trigger, ["scrollReady"], r.modelState).delay(.6), TimelinePlus.call(o.model.set, [{
                                    active: !1
                                }], o.model).delay(1.35)),
                                o._tween = TimelinePlus.seri(e, TimelinePlus.call(o._zoomOutComplete)).eventCallback("onUpdate", o._onUpdate))
                    },
                    o._zoomInComplete = function () {
                        o._tween.kill(),
                            o._tween = null,
                            o._progress1 = o._progress2 = .5,
                            o.model.set({
                                active: !1,
                                visible: !1,
                                play: !0
                            }),
                            r.modelState.set({
                                isZoomIn: !1,
                                isZoom: !1,
                                isSlide: !0
                            }),
                            o._random = s.createRandomArray(4)
                    },
                    o._zoomOutComplete = function () {
                        o.model.set({
                                visible: !1,
                                play: !1
                            }),
                            r.modelState.set({
                                isZoomOut: !1,
                                isZoom: !1,
                                isList: !0
                            }),
                            o._tween = null,
                            o._random = s.createRandomArray(4)
                    },
                    o._onZoomIn = function () {
                        o._progress1 = o._progress2 = .5,
                            o._onUpdate(),
                            o.model.set({
                                zoom: !0,
                                progress: !0,
                                visible: !0
                            }, {
                                silent: !0
                            }),
                            o.model.trigger("progressIn").trigger("visibleIn")
                    },
                    o._onZoomOut = function () {
                        o._progress1 = o._progress2 = 0,
                            o._onUpdate(),
                            o.model.set({
                                zoom: !1,
                                progress: !1,
                                visible: !1
                            }, {
                                silent: !0
                            }),
                            o.model.trigger("progressOut").trigger("visibleOut")
                    },
                    o._onResize = function () {
                        var e = -l.threeManager.camera.position.z;
                        o.uniforms.zoomScale.value = -(e - e / o.model.zoomScaleIn),
                            o.mesh.scale.set(o.model.zoomScaleOut, o.model.zoomScaleOut, 1)
                    },
                    o._onUpdate = function () {
                        var e = o._progress1 + o._progress2,
                            t = a.smoothStep(0, .9, e);
                        o.uniforms.sway.value = t < .5 ? 2 * t : 2 * (1 - t),
                            o.uniforms.corners.value.x = a.smoothStep2(c[o._random[0]], d, e),
                            o.uniforms.corners.value.y = a.smoothStep2(c[o._random[1]], d, e),
                            o.uniforms.corners.value.z = a.smoothStep2(c[o._random[2]], d, e),
                            o.uniforms.corners.value.w = a.smoothStep2(c[o._random[3]], d, e);
                        var n = 1 - a.smoothStep(.1, .6, e);
                        TweenMax.set([u.SC.list, u.SC.about], {
                            autoAlpha: n
                        })
                    },
                    o.model.on(":zoom", o._onChangeZoom).on("zoomIn", o._onZoomIn).on("zoomOut", o._onZoomOut).on("resize", o._onResize),
                    o._onResize(),
                    o._random = s.createRandomArray(4),
                    o
            }
            return n(t, e),
                t
        }(i.ControllerThreeListItemBase);
    t.ControllerThreeListItemZoom = h
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r = o(37),
        s = o(0),
        a = o(20),
        l = o(4),
        u = o(7),
        c = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o.mask1 = 0,
                    o.mask2 = 0,
                    o._onMQ = function () {
                        var e = u.modelMQ.get("portrait");
                        o.uniforms.waveAmpFreq.value.w = e ? 2 : 4
                    },
                    o._onRAF = function (e, t) {
                        ++i > 1 && (o.mesh.visible = !1,
                            l.threeManager.off("draw", o._onRAF))
                    },
                    o._onOpening = function () {
                        o.model.on(":visible", o._onChangeVisible),
                            o._onChangeVisible(),
                            o._opening()
                    },
                    o._opening = function () {
                        s.modelState.get("isSlide") && (o.uniforms.mask.value.x = 0,
                            o.uniforms.mask.value.y = 0,
                            o.uniforms.mask.value.z = 0,
                            TimelinePlus.seri(TimelinePlus.para(TweenMax.to(o, 1.2, {
                                mask1: 1,
                                ease: Ease._4_QuartInOut
                            }), TweenMax.to(o, 1.3, {
                                mask2: 1,
                                ease: Ease._3_CubicInOut
                            }).delay(.2)), TimelinePlus.set(o, {
                                mask2: 0
                            })).eventCallback("onUpdate", o._openingComplete))
                    },
                    o._openingComplete = function () {
                        o.uniforms.mask.value.x = o.mask1,
                            o.uniforms.mask.value.y = a.smoothStep(0, .4, o.mask1),
                            o.uniforms.mask.value.z = o.mask2
                    },
                    o._onChangeVisible = function () {
                        o.mesh.visible = o.model.get("visible")
                    },
                    i = 0,
                    l.threeManager.on("draw", o._onRAF),
                    s.modelState.once("opening", o._onOpening),
                    u.modelMQ.on(":portrait", o._onMQ),
                    o._onMQ(),
                    o
            }
            return n(t, e),
                t
        }(r.ControllerThreeSlideBase);
    t.ControllerThreeSlide = c
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r, s, a, l, u, c, d, h, p, f, m, v, _, g, y = o(3),
        S = o(8),
        T = o(4),
        w = o(19),
        x = o(37),
        C = o(10),
        b = o(17),
        M = o(15),
        P = o(0),
        E = o(2),
        O = function (e) {
            function t(t) {
                var o = e.call(this, t) || this;
                return o._onOpening = function () {
                        var e = P.modelState.get("slideIndex");
                        o.model.set({
                                texture1: e - 1,
                                texture2: e - 1
                            }),
                            o.model.on(":visible", o._onChangeVisible),
                            P.modelState.on(":isSlideVimeoEnd", o._onChangeVimeoEnd),
                            P.modelState.on(":isSlide", o._onChangeSlide),
                            o._onChangeVisible()
                    },
                    o._onChangeVimeoEnd = function () {
                        P.modelState.get("isSlideVimeoEnd") ? (u.pause(),
                            c.pause()) : (u.resume(),
                            c.resume())
                    },
                    o._onChangeSlide = function () {
                        var e;
                        P.modelState.get("isSlide") || (e = E.routeManagerPlus.getSlideIndexByPath(P.modelState.get("zoomTarget")) - 1,
                            o._unsetTextures(e, e))
                    },
                    o._onChangeVisible = function () {
                        o.model.get("visible") ? (o.model.on(":", o._onChangeModel),
                            S.index.on("resize", o._onResize),
                            o._onResize(),
                            o._updateTexture()) : (o.model.off(":", o._onChangeModel),
                            S.index.off("resize", o._onResize))
                    },
                    o._onChangeModel = function () {
                        o.model.changedAny(["texture1", "texture2"]) && o._updateTexture()
                    },
                    o._updateTexture = function () {
                        var e = o.model.get("texture1"),
                            t = o.model.get("texture2");
                        a = b.modelSlide.uvList[e + 1],
                            l = b.modelSlide.uvList[t + 1],
                            u = M.VideoPlayer.list[e + 1],
                            c = M.VideoPlayer.list[t + 1],
                            C.C.videoUsing && (o._unsetTextures(e, t),
                                T.threeManager.off("draw", o._onRAFVideoPlaying1),
                                T.threeManager.off("draw", o._onRAFVideoPlaying2)),
                            o._setTexture1(),
                            o._setTexture2(),
                            o._updateUV()
                    },
                    o._onVideoPlayDelay1 = function () {
                        p && p.kill(),
                            p = TimelinePlus.call(o._onVideoPlay1).delay(.2)
                    },
                    o._onVideoPlayDelay2 = function () {
                        f && f.kill(),
                            f = TimelinePlus.call(o._onVideoPlay2).delay(.2)
                    },
                    o._onVideoPlay1 = function () {
                        T.threeManager.on("draw", o._onRAFVideoPlaying1),
                            d = u.video,
                            m.image = d
                    },
                    o._onVideoPlay2 = function () {
                        T.threeManager.on("draw", o._onRAFVideoPlaying2),
                            h = c.video,
                            v.image = h
                    },
                    o._onRAFVideoPlaying1 = function () {
                        d && d.readyState > d.HAVE_CURRENT_DATA && (m.needsUpdate = !0)
                    },
                    o._onRAFVideoPlaying2 = function () {
                        h && h.readyState > h.HAVE_CURRENT_DATA && (v.needsUpdate = !0)
                    },
                    o._updateUV = function () {
                        o.mesh.scale.set(r, s, 1),
                            null != a && (_.x = a.u,
                                _.y = a.v,
                                _.z = a.s,
                                _.w = a.t,
                                g.x = l.u,
                                g.y = l.v,
                                g.z = l.s,
                                g.w = l.t)
                    },
                    o._onResize = function () {
                        r = y.resize.get("clientWidth"),
                            s = y.resize.get("innerHeight"),
                            o._updateUV()
                    },
                    i = w.ConstConfig.pathWorksList.length + 1,
                    m = o.uniforms.texture1.value,
                    v = o.uniforms.texture2.value,
                    _ = o.uniforms.uvRate1.value,
                    g = o.uniforms.uvRate2.value,
                    P.modelState.once("opening", o._onOpening),
                    o
            }
            return n(t, e),
                t.prototype._unsetTextures = function (e, t) {
                    var o, n, r;
                    for (o = 0; o < i; o++)
                        (n = o - 1) != e && n != t && (r = M.VideoPlayer.list[n + 1],
                            r.off("play", this._onVideoPlayDelay1),
                            r.off("play", this._onVideoPlayDelay2),
                            r.pause())
                },
                t.prototype._setTexture1 = function () {
                    m.image = u.image,
                        m.needsUpdate = !0,
                        C.C.videoUsing && (u.isPlaying ? this._onVideoPlay1() : (u.once("play", this._onVideoPlayDelay1),
                            u.resume(.25)))
                },
                t.prototype._setTexture2 = function () {
                    v.image = c.image,
                        v.needsUpdate = !0,
                        C.C.videoUsing && (c.isPlaying ? this._onVideoPlay2() : (c.once("play", this._onVideoPlayDelay2),
                            c.resume(.25)))
                },
                t
        }(x.ControllerThreeSlideBase);
    t.ControllerThreeSlideTexture = O
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n, i, r, s = o(114),
        a = o(23),
        l = o(0),
        u = function () {
            function e() {
                var e = this;
                this.opacity = 1,
                    this._onChangeOpacity = function () {
                        n && n.kill(),
                            n = TweenMax.to(e, .25, {
                                opacity: s.modelText.get("opacity") ? 0 : 1,
                                ease: Ease._Linear
                            }).eventCallback("onUpdate", e._onUpdate)
                    },
                    this._onUpdate = function () {
                        i.value = e.opacity,
                            r.value = e.opacity
                    },
                    this._onChangeSlideVimeoStart = function () {
                        s.modelText.set({
                            opacity: l.modelState.get("isSlideVimeoStart")
                        })
                    }
            }
            return e.prototype.init = function () {
                    return i = a.threeText.uniformsCurrent.opacity,
                        r = a.threeText.uniformsNext.opacity,
                        l.modelState.on(":isSlideVimeoStart", this._onChangeSlideVimeoStart),
                        s.modelText.on(":opacity", this._onChangeOpacity),
                        this
                },
                e
        }();
    t.ControllerThreeTextOpacity = u,
        t.controllerThreeTextOpacity = new u
}, function (e, t, o) {
    "use strict";

    function n() {
        var e = a;
        a = l,
            l = e;
        var t = u;
        u = c,
            c = t;
        var o = d;
        d = h,
            h = o
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i, r, s, a, l, u, c, d, h, p, f, m = o(0),
        v = o(23),
        _ = o(30),
        g = o(7),
        y = o(4),
        S = function () {
            function e() {
                var e = this;
                this._onRAF = function (t, o) {
                        ++f > 1 && (d.visible = !1,
                            h.visible = !1,
                            y.threeManager.off("draw", e._onRAF))
                    },
                    this._onStart = function () {
                        m.modelState.on(":isSlideText", e._onChangeSlideText),
                            g.modelMQ.on(":computer", e._onChangeComputer),
                            g.modelMQ.on(":canvasTextSize", e._onChangeCanvasText)
                    },
                    this._onChangeSlideText = function () {
                        i = m.modelState.get("slideIndex");
                        var t = m.modelState.get("isSlideText"),
                            o = m.modelState.slideDir,
                            l = g.modelMQ.get("canvasTextSize");
                        if ("" != l) {
                            var c = "large" == l ? _.CanvasText.large : _.CanvasText.short;
                            t ? (n(),
                                e._onChangeCanvasText(),
                                d.visible = !0,
                                u.image = c.list[i],
                                u.needsUpdate = !0,
                                a.progress.value = 2,
                                a.offset.value.x = 80 * o,
                                a.offset.value.y = -40 * o,
                                r && r.kill(),
                                r = TimelinePlus.seri(TweenMax.to(a.progress, 1.6, {
                                    value: 0,
                                    ease: Ease._3_CubicOut
                                }), TimelinePlus.call(e._onCompleteIn))) : (d.visible = !0,
                                a.progress.value = 0,
                                a.offset.value.x = -80 * o,
                                a.offset.value.y = 40 * o,
                                p = d,
                                s && s.kill(),
                                s = TimelinePlus.seri(TweenMax.to(a.progress, 1.2, {
                                    value: 2,
                                    ease: Ease._3_CubicOut
                                }), TimelinePlus.call(e._onCompleteOut)))
                        }
                    },
                    this._onCompleteIn = function () {},
                    this._onCompleteOut = function () {
                        p.visible = !1
                    },
                    this._onChangeComputer = function () {
                        var t = g.modelMQ.get("computer"),
                            o = m.modelState.get("isSlideText");
                        r && r.kill(),
                            s && s.kill(),
                            t && o ? (d.visible = !0,
                                a.progress.value = 0,
                                l.progress.value = 0,
                                e._onChangeCanvasText()) : (d.visible = !1,
                                h.visible = !1)
                    },
                    this._onChangeCanvasText = function () {
                        var e = g.modelMQ.get("canvasTextSize");
                        if (m.modelState.get("isSlideText") && "" != e) {
                            var t = "large" == e ? _.CanvasText.large : _.CanvasText.short,
                                o = new THREE.PlaneBufferGeometry(t.width, t.height, Math.round(t.width / 5), Math.round(t.height / 5));
                            d.geometry = o,
                                d.position.set(0, t.offsetY, 0),
                                u.image = t.list[i],
                                u.needsUpdate = !0
                        }
                    }
            }
            return e.prototype.init = function () {
                    return a = v.threeText.uniformsCurrent,
                        l = v.threeText.uniformsNext,
                        u = v.threeText.textureCurrent,
                        c = v.threeText.textureNext,
                        d = v.threeText.meshCurrent,
                        h = v.threeText.meshNext,
                        m.modelState.once("start", this._onStart),
                        f = 0,
                        y.threeManager.on("draw", this._onRAF),
                        this
                },
                e
        }();
    t.ControllerThreeTextTexture = S,
        t.controllerThreeTextTexture = new S
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = o(2),
        s = function (e) {
            function t(t, o, n, i, s) {
                var a = e.call(this) || this;
                return a.imgY = 0,
                    a.glX = 0,
                    a.glY = 0,
                    a.glYPosition = 0,
                    a.hoverX = 0,
                    a.hoverY = 0,
                    a.zoomScaleIn = 1,
                    a.zoomScaleInR = 1,
                    a.zoomScaleOut = 1,
                    a.index = t,
                    a.path = r.routeManagerPlus.getPathByWorksIndex(t),
                    a.element = o,
                    a.button = n,
                    a.img = i,
                    a.video = s,
                    a
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        zoom: !1,
                        hover: !1,
                        visible: !1,
                        progress: !1,
                        play: !1,
                        scroll: null,
                        layout: !1,
                        active: !1
                    }
                },
                t.prototype.updatePosition = function (e) {
                    this.glYPosition = -e,
                        this.trigger("position")
                },
                t
        }(i.Model);
    t.ModelListItem = s
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        arrowSize: 0
                    }
                },
                t
        }(i.Model);
    t.ModelNavi = r,
        t.modelNavi = new r
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(6),
        r = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return n(t, e),
                t.prototype.defaults = function () {
                    return {
                        opacity: !1
                    }
                },
                t
        }(i.Model);
    t.ModelText = r,
        t.modelText = new r
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(5),
        r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._onErrorXHR = function () {
                        t._cleanXHR(),
                            ++t.retry < 5 && (t.retry % 2 == 0 ? t._loadXHR(t.src1) : t._loadXHR(t.src2))
                    },
                    t._onReadyXHR = function () {
                        clearTimeout(t.timeout),
                            200 !== t.xhr.status && t._onErrorXHR(),
                            t._cleanXHR();
                        var e = window.URL || window.webkitURL;
                        t.video = document.createElement("video"),
                            t.video.src = e.createObjectURL(t.xhr.response),
                            t.video.muted = !0,
                            t.video.loop = !0,
                            setTimeout(t._onReady, 250)
                    },
                    t._onReady = function () {
                        t.trigger("ready")
                    },
                    t
            }
            return n(t, e),
                t.prototype.load = function (e, t) {
                    this.retry = 0,
                        this.src1 = e,
                        this.src2 = t,
                        this._loadXHR(e)
                },
                t.prototype._loadXHR = function (e) {
                    this.xhr = new XMLHttpRequest,
                        1 == ("string" == typeof this.xhr.responseType ? 2 : 1) && this.xhr.setRequestHeader("Origin", location.origin),
                        this.xhr.responseType = "blob",
                        this.xhr.addEventListener("load", this._onReadyXHR),
                        this.xhr.addEventListener("error", this._onErrorXHR),
                        this.xhr.open("GET", e, !0),
                        this.xhr.send(),
                        clearTimeout(this.timeout),
                        this.timeout = setTimeout(this._onErrorXHR, 12e3)
                },
                t.prototype._cleanXHR = function () {
                    this.xhr.removeEventListener("load", this._onReadyXHR),
                        this.xhr.removeEventListener("error", this._onErrorXHR)
                },
                t
        }(i.Event);
    t.PreloadVideo = r
}, function (e, t, o) {
    "use strict";
    var n = this && this.__extends || function () {
        var e = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (e, t) {
                e.__proto__ = t
            } ||
            function (e, t) {
                for (var o in t)
                    t.hasOwnProperty(o) && (e[o] = t[o])
            };
        return function (t, o) {
            function n() {
                this.constructor = t
            }
            e(t, o),
                t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                    new n)
        }
    }();
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = o(5),
        r = o(10),
        s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._load = function () {
                        var e = t.items[t._loading];
                        e.once("ready", t._onReady),
                            e.load(),
                            ++t._connection,
                            ++t._loading < t._total && t._connection < r.C.videoMaxConnection && t._load()
                    },
                    t._onReady = function () {
                        --t._connection,
                            ++t._loaded,
                            t._loaded == t._ready && t.trigger("ready"),
                            t._loaded == t._total && t.trigger("complete"),
                            t._loading < t._total && t._load()
                    },
                    t
            }
            return n(t, e),
                t.prototype.load = function (e) {
                    this.items = e,
                        this._total = e.length,
                        this._ready = Math.min(this._total, 2),
                        this._loading = 0,
                        this._loaded = 0,
                        this._connection = 0,
                        this._load()
                },
                t
        }(i.Event);
    t.PreloadVideoList = s,
        t.preloadVideoList = new s
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(1),
        i = o(14),
        r = o(63),
        s = o(68),
        a = o(65),
        l = o(66),
        u = o(64),
        c = o(67),
        d = o(62),
        h = document.createElement("div"),
        p = function () {
            function e() {}
            return e.initSlideMain = function () {
                    var e = document.createElement("main"),
                        t = document.createElement("canvas");
                    t.id = "three",
                        t.classList.add("three"),
                        e.appendChild(t),
                        i.Q.body.insertBefore(e, n.SC.header.nextSibling)
                },
                e.initSlideHome = function () {
                    h.innerHTML = r,
                        n.SC.main.appendChild(h.firstChild),
                        h.innerHTML = ""
                },
                e.initSlideWorks = function () {
                    h.innerHTML = s.replace(/<%= hLevel %>/g, "h2").replace(/<%(.*?)%>/g, ""),
                        n.SC.main.appendChild(h.firstChild),
                        h.innerHTML = ""
                },
                e.initSlideNavi = function () {
                    h.innerHTML = a.replace(/<%(.*?)%>/g, ""),
                        n.SC.main.appendChild(h.firstChild),
                        h.innerHTML = ""
                },
                e.initSlideNaviCount = function () {
                    h.innerHTML = l,
                        n.SC.slideNavi.appendChild(h.firstChild),
                        h.innerHTML = ""
                },
                e.initSlideInfo = function () {
                    h.innerHTML = u.replace(/<%(.*?)%>/g, ""),
                        i.Q.body.insertBefore(h.firstChild, n.SC.list),
                        h.innerHTML = ""
                },
                e.initSlideVimeo = function () {
                    h.innerHTML = c,
                        i.Q.body.insertBefore(h.firstChild, n.SC.list),
                        h.innerHTML = ""
                },
                e.initSlideAbout = function () {
                    h.innerHTML = d.replace(/<%= hLevel %>/g, "h2"),
                        i.Q.body.insertBefore(h.firstChild, n.SC.footer),
                        h.innerHTML = ""
                },
                e
        }();
    t.Template = p
}, function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = o(4),
        i = o(105),
        r = o(104),
        s = o(106),
        a = o(107),
        l = o(13),
        u = function () {
            function e(e, t) {
                var o = this;
                return this.positionHover = new THREE.Vector2,
                    this.position = new THREE.Vector2,
                    this.scale = 1,
                    this._onRAF = function (e, t) {
                        if (o.mesh.visible) {
                            var i = -n.threeManager.camera.position.z;
                            o.mesh.position.set((o.position.x + o.positionHover.x) / o.scale, (o.position.y + o.positionHover.y) / o.scale, -(i - i / o.scale))
                        }
                    },
                    this.model = e,
                    this.constWork = t,
                    this._initThree(),
                    this.controllerVisible = new s.ControllerThreeListItemVisible(this),
                    this.controllerPosition = new i.ControllerThreeListItemPosition(this),
                    Useragnt.pc && (this.controllerHover = new r.ControllerThreeListItemHover(this)),
                    this.controllerZoom = new a.ControllerThreeListItemZoom(this),
                    n.threeManager.on("draw", this._onRAF),
                    this
            }
            return e.prototype._initThree = function () {
                    this.geometry = new THREE.PlaneBufferGeometry(this.constWork.width, this.constWork.height, Math.round(this.constWork.width / 10), Math.round(this.constWork.height / 10)),
                        this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3, 1e6),
                        this.texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter),
                        this.texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
                    var e = {
                            time: {
                                value: l.uniformTime.value
                            },
                            texture1: {
                                value: this.texture1
                            },
                            texture2: {
                                value: this.texture2
                            },
                            textureSize: {
                                value: new THREE.Vector4(this.constWork.width, this.constWork.height, this.constWork.width / this.constWork.height)
                            },
                            opacity: {
                                value: 1
                            },
                            hover: {
                                value: new THREE.Vector3(.5, .5, 0)
                            },
                            corners: {
                                value: new THREE.Vector4(0, 0, 0, 0)
                            },
                            sway: {
                                value: 0
                            },
                            zoomScale: {
                                value: 0
                            },
                            rotation: {
                                value: 0
                            },
                            progress: {
                                value: 0
                            },
                            translate: {
                                value: new THREE.Vector2(-.2, .4)
                            },
                            delay: {
                                value: new THREE.Vector2(1, 1)
                            },
                            edge: {
                                value: 0
                            },
                            accel: {
                                value: new THREE.Vector2(2, 2)
                            },
                            waveAmpFreq: {
                                value: new THREE.Vector4(0, .5, 0, 4)
                            },
                            waveSpeedPhase: {
                                value: new THREE.Vector4(0, .3, 0, 0)
                            },
                            waveBlend: {
                                value: new THREE.Vector2(.2, .8)
                            }
                        },
                        t = new THREE.RawShaderMaterial({
                            blending: THREE.NormalBlending,
                            side: THREE.FrontSide,
                            transparent: !0,
                            vertexShader: o(74),
                            fragmentShader: o(73),
                            uniforms: e
                        }),
                        i = new THREE.Mesh(this.geometry, t);
                    this.mesh = i,
                        this.container = new THREE.Object3D,
                        this.container.add(i),
                        this.material = i.material,
                        this.uniforms = this.material.uniforms,
                        n.threeManager.container.add(this.container)
                },
                e
        }();
    t.ThreeListItem = u
}]);