(function () {
    angular.module("aquestCampoLeComete", ["ngAnimate", "ngCookies", "ngTouch", "ngResize", "ngSanitize", "monospaced.mousewheel", "ui.router", "angulartics.google.analytics", "swipe"])
}).call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("webglDetector", function () {
            "ngInject";
            var e, t;
            return e = ["$scope", "Detector", function (e, t) {
                    this.supportsWebGL = t.webgl
                }],
                t = {
                    restrict: "E",
                    templateUrl: "app/components/webgl-detector/webgl-detector.html",
                    controller: e,
                    controllerAs: "webgldetector",
                    replace: !0,
                    transclude: !0
                }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("versionInfo", function () {
            "ngInject";
            var e, t;
            return e = ["$scope", function (e) {}],
                t = {
                    restrict: "E",
                    templateUrl: "app/components/version-info/version-info.html",
                    controller: e,
                    controllerAs: "versioninfo",
                    scope: {
                        info: "="
                    },
                    replace: !0
                }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").filter("wordseparation", ["$sce", "$sanitize", function (e, t) {
            "ngInject";
            return function (n, i, o, a) {
                var s, r, l, c, u, d, p;
                for (null == o && (o = 0),
                    null == a && (a = .1),
                    n = t(n),
                    s = n.split(" "),
                    u = "",
                    r = l = 0,
                    c = s.length; c > l; r = ++l)
                    p = s[r],
                    u += '<span class="',
                    -1 !== p.indexOf("[w]") && (p = p.split("[w]").join(""),
                        u += "white"),
                    i ? (d = o + r * a,
                        u += ' word" style="transition-delay: ' + d + "s; animation-delay: " + d + 's;">' + p + " </span>") : u += ' word" >' + p + " </span>";
                return e.trustAsHtml(u)
            }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").factory("wavingShader", function () {
            "ngInject";
            var e;
            return e = function () {
                function e() {}
                return e.uniforms = {
                        map: {
                            type: "t",
                            value: null
                        },
                        offsetRepeat: {
                            type: "v4",
                            value: new THREE.Vector4(0, 0, 1, 1)
                        },
                        fresnelIntensity: {
                            type: "f",
                            value: 5
                        },
                        fresnelColor: {
                            type: "c",
                            value: new THREE.Color(16777215)
                        },
                        fresnelPow: {
                            type: "f",
                            value: 1
                        },
                        wavingFactor: {
                            type: "f",
                            value: 0
                        },
                        wavingAmplitude: {
                            type: "f",
                            value: 1
                        },
                        wavingMax: {
                            type: "f",
                            value: 1
                        },
                        wavingMin: {
                            type: "f",
                            value: 1
                        }
                    },
                    e.vertexShader = "uniform vec4 offsetRepeat; uniform float fresnelPow; uniform float fresnelIntensity; uniform float wavingFactor; uniform float wavingAmplitude; uniform float wavingMax; uniform float wavingMin; varying vec2 vUv; void main() { vec3 transformed = vec3( position ); float yNormalized = (position.y - wavingMin) / wavingMax; transformed.x = position.x + (yNormalized * (wavingFactor * wavingAmplitude)); vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 ); vUv = uv * offsetRepeat.zw + offsetRepeat.xy; gl_Position = projectionMatrix * mvPosition; }",
                    e.fragmentShader = "uniform vec3 fresnelColor; uniform sampler2D map; varying vec2 vUv; void main() { gl_FragColor = texture2D( map, vUv ); }",
                    e
            }()
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").filter("truncate", function () {
            "ngInject";
            return function (e, t) {
                var n;
                return isNaN(t) ? e : 0 >= t ? "" : (e && (n = e.split(/\s+/),
                        n.length > t && (e = n.slice(0, t).join(" ") + "…")),
                    e)
            }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("scrollController", ["$parse", "$timeout", "TweenMax", function (e, t, n) {
            "ngInject";
            var i, o;
            return i = ["$scope", function (e) {
                    this.selectedChapter = -1,
                        this.pauseChapterDetection = !1,
                        this.headerHeight = 360,
                        this.hasScrolled = !1,
                        this.gotoTop = function (t) {
                            return function () {
                                t.selectedChapter = -1,
                                    n.to(e.element[0], .5, {
                                        scrollTop: 0
                                    })
                            }
                        }(this),
                        this.gotoParagraph = function (i) {
                            return function (o) {
                                var a, s, r;
                                s = e.element[0].scrollHeight - i.headerHeight,
                                    a = s - e.element[0].clientHeight,
                                    r = a / e.product.locale.paragraphs.length,
                                    i.hasScrolled = !0,
                                    i.selectedChapter = o,
                                    i.pauseChapterDetection = !0,
                                    t.cancel(i.cancelPause),
                                    n.to(e.element[0], .5, {
                                        scrollTop: i.headerHeight + r * o,
                                        onComplete: function () {
                                            return i.cancelPause = t(function () {
                                                return i.pauseChapterDetection = !1
                                            }, 500)
                                        }
                                    })
                            }
                        }(this),
                        this.onScroll = _.throttle(function (n) {
                            return function (i) {
                                var o, a, s;
                                n.pauseChapterDetection || (n.hasScrolled = e.element[0].scrollTop > 50,
                                    s = e.element[0].scrollTop - n.headerHeight,
                                    a = e.element[0].scrollHeight - n.headerHeight,
                                    o = s / (a - e.element[0].clientHeight),
                                    n.selectedChapter = Math.round((e.product.locale.paragraphs.length - 1) * o),
                                    n.selectedChapter = Math.max(0, Math.min(e.product.locale.paragraphs.length - 1, n.selectedChapter)),
                                    n.hasScrolled || (n.selectedChapter = -1),
                                    t(function () {
                                        return e.$apply()
                                    }, 0))
                            }
                        }(this), 500)
                }],
                o = {
                    restrict: "A",
                    controller: i,
                    controllerAs: "scrollcontroller",
                    link: function (e, t, n) {
                        e.element = t
                    }
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("preloadLogo", ["$parse", "$timeout", "TweenMax", function (e, t, n) {
            "ngInject";
            var i, o;
            return i = ["$scope", function (e) {
                    this.removeOnDestroyListener = e.$on("$destroy", function () {}),
                        this.init = function () {
                            n.to(e.element[0], 2, {
                                opacity: 0,
                                scale: 1.4,
                                onComplete: function () {
                                    return e.element[0].parentNode.removeChild(e.element[0])
                                }
                            })
                        },
                        e.$watch("element", function (e) {
                            return function () {
                                _.defer(e.init)
                            }
                        }(this))
                }],
                o = {
                    restrict: "A",
                    controller: i,
                    controllerAs: "autoscroller",
                    link: function (e, t, n) {
                        e.element = t
                    }
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").factory("particleShader", function () {
            "ngInject";
            var e;
            return e = function () {
                function e() {}
                return e.uniforms = {
                        map: {
                            type: "t",
                            value: null
                        },
                        offsetRepeat: {
                            type: "v4",
                            value: new THREE.Vector4(0, 0, 1, 1)
                        },
                        time: {
                            type: "f",
                            value: 0
                        },
                        color: {
                            type: "c",
                            value: new THREE.Color(16777215)
                        },
                        size: {
                            type: "f",
                            value: .5
                        },
                        scale: {
                            type: "f",
                            value: 500
                        }
                    },
                    e.vertexShader = "uniform float time; uniform float size; uniform float scale; attribute float pulseSpeed; attribute float orbitSpeed; attribute float orbitSize; void main() { vec3 animatedPosition = position; animatedPosition.x += sin(time * orbitSpeed) * orbitSize; animatedPosition.y += cos(time * orbitSpeed) * orbitSize; animatedPosition.z += cos(time * orbitSpeed) * orbitSize; vec3 transformed = vec3( animatedPosition ); vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 ); gl_Position =  projectionMatrix * mvPosition; float animatedSize = size * ( scale / - mvPosition.z ); animatedSize *= 1.0 + sin(time * pulseSpeed); gl_PointSize = animatedSize; }",
                    e.fragmentShader = "uniform sampler2D map; uniform vec4 offsetRepeat; uniform vec3 color; void main() { gl_FragColor = texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy ); gl_FragColor.rgb *= color.rgb; }",
                    e
            }()
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("ngTouchstart", function () {
            return {
                controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                    var onDestroy, onTouchStart;
                    onTouchStart = function ($event) {
                            var method;
                            method = "$scope." + $element.attr("ng-touchstart"),
                                $scope.$apply(function () {
                                    eval(method)
                                })
                        },
                        $element.bind("touchstart", onTouchStart),
                        onDestroy = $scope.$on("$destroy", function () {
                            return $element.unbind("touchstart", onTouchStart),
                                onDestroy()
                        })
                }]
            }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("ngTouchmove", function () {
            return {
                controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                    var onDestroy, onTouchEnd, onTouchMove, onTouchStart;
                    onTouchStart = function (e) {
                            $element.bind("touchmove", onTouchMove),
                                $element.bind("touchend", onTouchEnd)
                        },
                        onTouchMove = function ($event) {
                            var method;
                            method = "$scope." + $element.attr("ng-touchmove"),
                                $scope.$apply(function () {
                                    eval(method)
                                })
                        },
                        onTouchEnd = function (e) {
                            e.preventDefault(),
                                $element.unbind("touchmove", onTouchMove),
                                $element.unbind("touchend", onTouchEnd)
                        },
                        $element.bind("touchstart", onTouchStart),
                        onDestroy = $scope.$on("$destroy", function () {
                            return $element.unbind("touchmove", onTouchMove),
                                $element.unbind("touchend", onTouchEnd),
                                onDestroy()
                        })
                }]
            }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("ngTouchend", function () {
            return {
                controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                    var onDestroy, onTouchEnd;
                    onTouchEnd = function ($event) {
                            var method;
                            method = "$scope." + $element.attr("ng-touchend"),
                                $scope.$apply(function () {
                                    eval(method)
                                })
                        },
                        $element.bind("touchend", onTouchEnd),
                        onDestroy = $scope.$on("$destroy", function () {
                            return $element.unbind("touchend", onTouchEnd),
                                onDestroy()
                        })
                }]
            }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("ngScroll", ["$parse", function (e) {
            "ngInject";
            return {
                restrict: "A",
                link: function (t, n, i) {
                    var o;
                    o = e(i.ngScroll),
                        n.bind("scroll", function (e) {
                            return t.$apply(function () {
                                return o(t, {
                                    $event: e
                                })
                            })
                        })
                }
            }
        }])
    }
    .call(this),
    function () {
        var e = function (e, t) {
            return function () {
                return e.apply(t, arguments)
            }
        };
        angular.module("aquestCampoLeComete").factory("elasticVector2", function () {
            "ngInject";
            var t;
            return t = function () {
                function t(t) {
                    this.value = t,
                        this.update = e(this.update, this),
                        this.x = this.value.x,
                        this.y = this.value.y
                }
                return t.prototype.value = null,
                    t.prototype.x = 0,
                    t.prototype.y = 0,
                    t.prototype.speed = 3,
                    t.prototype.update = function (e) {
                        var t, n;
                        return e = Math.min(e, .1),
                            t = this.x - this.value.x,
                            n = this.y - this.value.y,
                            this.value.x += t * (this.speed * e),
                            this.value.y += n * (this.speed * e),
                            !0
                    },
                    t
            }()
        })
    }
    .call(this),
    function () {
        var e = function (e, t) {
            return function () {
                return e.apply(t, arguments)
            }
        };
        angular.module("aquestCampoLeComete").factory("elasticNumber", function () {
            "ngInject";
            var t;
            return t = function () {
                function t(t) {
                    this.value = t,
                        this.update = e(this.update, this),
                        this.target = this.value
                }
                return t.prototype.value = null,
                    t.prototype.target = 0,
                    t.prototype.speed = 3,
                    t.prototype.update = function (e) {
                        var t;
                        return t = this.target - this.value,
                            this.value += t * (this.speed * Math.min(e, .1)),
                            !0
                    },
                    t
            }()
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("css3dRotationEffect", ["$parse", "$window", "elasticNumber", function (e, t, n) {
            "ngInject";
            return {
                restrict: "A",
                link: function (e, i, o) {
                    var a, s, r, l, c, u, d;
                    e.main.platform.mobile || e.main.platform.safari || (e.translateZ = e.$eval(o.translateZ),
                        a = !1,
                        c = {
                            x: 0,
                            y: 0
                        },
                        l = new n(0),
                        l.speed = 1,
                        s = new n(0),
                        s.speed = 1,
                        r = new n(0),
                        r.speed = 1,
                        u = function (n) {
                            var i, o, a;
                            c.x = n.clientX / t.innerWidth * 2 - 1,
                                c.y = 2 * -(n.clientY / t.innerHeight) + 1,
                                a = e.main.css3dSettings.tx,
                                i = e.main.css3dSettings.rx,
                                o = e.main.css3dSettings.ry,
                                l.target = -c.x * a,
                                s.target = -c.y * i,
                                r.target = -c.x * o
                        },
                        t.addEventListener("mousemove", u),
                        d = e.$on("$destroy", function () {
                            d(),
                                t.removeEventListener("mousemove", u),
                                a = !0
                        }),
                        e.main.addSubRoutine("css3d-rotation-effect-" + Math.random(), function (t) {
                            var n;
                            return l.update(t),
                                s.update(t),
                                r.update(t),
                                n = null != e.translateZ ? e.translateZ + "px" : 10,
                                i[0].style.transform = i[0].style.MozTransform = i[0].style.MsTransform = i[0].style.WebkitTransform = "translate3d(" + l.value + "px,0," + n + ") rotateX(" + s.value + "deg) rotateY(" + r.value + "deg)",
                                !a
                        }))
                }
            }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").factory("axisHelper", function () {
            "ngInject";
            var e;
            return e = function () {
                function e() {}
                return e.get = function (t, n) {
                        var i;
                        return null == t && (t = 10),
                            null == n && (n = !1),
                            i = new THREE.Object3D,
                            i.add(e.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(t, 0, 0), 16711680, n)),
                            i.add(e.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, t, 0), 65280, n)),
                            i.add(e.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, t), 255, n)),
                            i
                    },
                    e.buildAxis = function (e, t, n, i) {
                        var o, a;
                        return o = new THREE.Geometry,
                            a = i ? new THREE.LineDashedMaterial({
                                linewidth: 3,
                                color: n,
                                dashSize: 3,
                                gapSize: 3
                            }) : new THREE.LineBasicMaterial({
                                linewidth: 3,
                                color: n
                            }),
                            o.vertices.push(e.clone()),
                            o.vertices.push(t.clone()),
                            o.computeLineDistances(),
                            new THREE.Line(o, a, THREE.LineSegments)
                    },
                    e
            }()
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("autoScroller", ["$parse", "$timeout", "TweenMax", function (e, t, n) {
            "ngInject";
            var i, o;
            return i = ["$scope", function (e) {
                    this.autoScrolling = !1,
                        this.removeOnDestroyListener = e.$on("$destroy", function (t) {
                            return function () {
                                n.killTweensOf(e.element[0]),
                                    t.removeOnDestroyListener()
                            }
                        }(this)),
                        this.initscroll = function (t) {
                            return function () {
                                var i;
                                return n.killTweensOf(e.element[0]),
                                    i = 1 - e.element[0].scrollTop / (e.element[0].scrollHeight - e.element[0].clientHeight),
                                    n.to(e.element[0], 120 * i, {
                                        ease: Power0.easeNone,
                                        scrollTo: {
                                            y: "#end",
                                            onAutoKill: t.initscroll
                                        },
                                        delay: 1
                                    })
                            }
                        }(this),
                        e.$watch("element", function (e) {
                            return function () {
                                _.defer(e.initscroll)
                            }
                        }(this)),
                        this.onMouseWheel = _.throttle(this.initscroll, 250)
                }],
                o = {
                    restrict: "A",
                    controller: i,
                    controllerAs: "autoscroller",
                    link: function (e, t, n) {
                        e.element = t
                    }
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("siteMenu", ["$timeout", "$window", "Modernizr", "md", "$state", function (e, t, n, i, o) {
            "ngInject";
            var a, s;
            return a = ["$scope", "$rootScope", function (i, a) {
                    this.selected = 0,
                        this.destroyed = !1,
                        this.getParticlesColor = function (e) {
                            return function () {
                                var t, n;
                                return t = null != (n = i.main.config.products[e.selected]) ? n.id : void 0,
                                    null == t ? 11449662 : i.main.locale[t].particles_color
                            }
                        }(this),
                        this.scrollUp = function (e) {
                            return function () {
                                e.selected > 0 && (e.selected--,
                                    e.playSound())
                            }
                        }(this),
                        this.scrollDown = function (e) {
                            return function () {
                                e.selected < i.main.config.products.length && (e.selected++,
                                    e.playSound())
                            }
                        }(this),
                        this.onImageHover = function (e) {
                            return function (t, n) {
                                n === e.selected && i.main.playSound("hover_menu")
                            }
                        }(this),
                        this.onItemClick = function (e) {
                            return function (t, n, i) {
                                var a;
                                return t === e.selected ? (a = null != i ? {
                                        producturl: i.url
                                    } : null,
                                    void o.go(n, a)) : (e.selected = t,
                                    void e.playSound())
                            }
                        }(this),
                        this.playSound = function (e) {
                            return function () {
                                null != i.main.config.products[e.selected] ? i.main.playSound(i.main.config.products[e.selected].sound) : e.selected === i.main.config.products.length && i.main.playSound("pin_rollover_6")
                            }
                        }(this),
                        this.getLabelStyle = function (e) {
                            return function (t) {
                                var i, o, a;
                                return i = e.selected - t,
                                    a = Math.max(.8, 1.7 / (Math.abs(.5 * i) + 1)),
                                    0 !== i ? (0 > i && (o = 15 * (i + 1)),
                                        i > 0 && (o = 15 * (i - 1))) : o = 0,
                                    n.cssanimations ? {
                                        transform: "translateY(" + o + "px) scale(" + a + ")",
                                        WebkitTransform: "translateY(" + o + "px) scale(" + a + ")",
                                        MozTransform: "translateY(" + o + "px) scale(" + a + ")",
                                        MsTransform: "translateY(" + o + "px) scale(" + a + ")"
                                    } : {
                                        top: o + "px",
                                        fontSize: 20 * a + "px"
                                    }
                            }
                        }(this),
                        this.getLabelsTop = function () {
                            var e, o;
                            return o = i.main.platform.phone ? 42 : 48,
                                e = t.innerHeight / 2 - o * this.selected,
                                e -= i.main.desktop ? 32 : 45,
                                n.cssanimations ? {
                                    transform: "translateY(" + e + "px)",
                                    WebkitTransform: "translateY(" + e + "px)",
                                    MozTransform: "translateY(" + e + "px)",
                                    MsTransform: "translateY(" + e + "px)"
                                } : {
                                    top: e + "px"
                                }
                        },
                        this.blockSmoothScrolling = !0,
                        this.lastDeltaMagnitude = 0,
                        this.onMouseWheel = _.throttle(function (t) {
                            return function (n, o, a, s) {
                                var r;
                                if (t.blockSmoothScrolling) {
                                    if (r = Math.abs(n.deltaY),
                                        r + .001 <= t.lastDeltaMagnitude || .1 > r)
                                        return void(t.lastDeltaMagnitude = r);
                                    t.lastDeltaMagnitude = r
                                }
                                0 > s ? t.scrollDown() : s > 0 && t.scrollUp(),
                                    e(function () {
                                        return i.$apply()
                                    }, 0)
                            }
                        }(this), 250),
                        this.removeStateChangeListener = a.$on("$stateChangeSuccess", function (e, t, n, o, a) {
                            "home" !== t.name && (i.main.menuOpen = !1)
                        }),
                        this.removeDestroyListener = i.$on("$destroy", function (e) {
                            return function () {
                                e.destroyed = !0,
                                    e.removeDestroyListener(),
                                    e.removeStateChangeListener()
                            }
                        }(this)),
                        this.preventDefault = function (e) {
                            return i.main.platform.ios ? e.preventDefault() : void 0
                        }
                }],
                s = {
                    restrict: "E",
                    templateUrl: "app/components/site-menu/site-menu.html",
                    controller: a,
                    controllerAs: "sitemenu",
                    replace: !0
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("shareVolumeMenu", ["$state", "$stateParams", function (e, t) {
            "ngInject";
            var n, i;
            return n = ["$scope", function (e) {
                    this.locale = t.language
                }],
                i = {
                    restrict: "E",
                    templateUrl: "app/components/share-volume-menu/share-volume-menu.html",
                    controller: n,
                    controllerAs: "sharevolume",
                    replace: !0
                }
        }])
    }
    .call(this),
    function () {
        var e = function (e, t) {
            return function () {
                return e.apply(t, arguments)
            }
        };
        angular.module("aquestCampoLeComete").factory("threeJsScene", ["$log", "$window", "$rootScope", "$state", "$timeout", "$q", "$interval", "$urlRouter", "TweenMax", "elasticNumber", "elasticVector2", "axisHelper", "wavingShader", "particleShader", "pulseCircleStandalone", function (t, n, i, o, a, s, r, l, c, u, d, p, h, m, g) {
            "ngInject";
            var f;
            return f = function () {
                function t(t) {
                    this.$scope = t,
                        this.onTouchEnd = e(this.onTouchEnd, this),
                        this.onTouchMove = e(this.onTouchMove, this),
                        this.onTouchStart = e(this.onTouchStart, this),
                        this.onMouseUp = e(this.onMouseUp, this),
                        this.onMouseWheel = e(this.onMouseWheel, this),
                        this.onMouseMove = e(this.onMouseMove, this),
                        this.onMouseDown = e(this.onMouseDown, this),
                        this.moveCamera = e(this.moveCamera, this),
                        this.render = e(this.render, this),
                        this.onResize = e(this.onResize, this),
                        this.flapBack = e(this.flapBack, this),
                        this.flap = e(this.flap, this),
                        this.intro = e(this.intro, this),
                        this.preRenderScene = e(this.preRenderScene, this),
                        this.onLoadFinished = e(this.onLoadFinished, this),
                        this.onLoadProgress = e(this.onLoadProgress, this),
                        this.findCamera = e(this.findCamera, this),
                        this.findObjectByName = e(this.findObjectByName, this),
                        this.zoomIn = e(this.zoomIn, this),
                        this.rotateToObj = e(this.rotateToObj, this),
                        this.zoomOut = e(this.zoomOut, this),
                        this.getCameraForURL = e(this.getCameraForURL, this),
                        this.getIdleSpherical = e(this.getIdleSpherical, this),
                        this.gotoIdleState = e(this.gotoIdleState, this),
                        this.removeTransitionSubRoutines = e(this.removeTransitionSubRoutines, this),
                        this.onStateChange = e(this.onStateChange, this),
                        this.initPointsCloud = e(this.initPointsCloud, this),
                        this.init3DPins = e(this.init3DPins, this),
                        this.createPinTexture = e(this.createPinTexture, this),
                        this.init2DPins = e(this.init2DPins, this),
                        this.onMenuOpen = e(this.onMenuOpen, this),
                        this.destroy = e(this.destroy, this),
                        this.onSkyboxLoaded = e(this.onSkyboxLoaded, this),
                        this.init = e(this.init, this),
                        this.removeOnInitListener = this.$scope.$watch("element", this.init),
                        this.removeDestroyListener = this.$scope.$on("$destroy", this.destroy),
                        this.removeStateChangeListener = i.$on("$stateChangeStart", this.onStateChange),
                        this.removeMenuOpenListener = this.$scope.$watch("main.menuOpen", this.onMenuOpen)
                }
                return t.STATE_IDLE = "idle",
                    t.STATE_TRANSITION = "transition",
                    t.STATE_FOCUSING = "focusing",
                    t.prototype.camera = null,
                    t.prototype.scene = null,
                    t.prototype.camerasScene = null,
                    t.prototype.renderer = null,
                    t.prototype.clock = null,
                    t.prototype.composer = null,
                    t.prototype.state = t.STATE_IDLE,
                    t.prototype.focusingObject = null,
                    t.prototype.idleRadius = 37,
                    t.prototype.idleRadiusIntro = 57,
                    t.prototype.idleFOV = 64,
                    t.prototype.minRadius = 30,
                    t.prototype.maxRadius = 60,
                    t.prototype.cameraRadius = null,
                    t.prototype.sceneMouseRotation = null,
                    t.prototype.mouseWheelSensitivity = 2,
                    t.prototype.pinSize = .07,
                    t.prototype.loadingSceneY = 60,
                    t.prototype.finalSceneY = -20,
                    t.prototype.skyboxLoaded = !1,
                    t.prototype.introDone = !1,
                    t.prototype.idleCameraZoomSpeed = .9,
                    t.prototype.idleCameraMovementSpeed = .9,
                    t.prototype.zoomOutCameraZoomSpeed = 2,
                    t.prototype.zoomOutCameraMovementSpeed = .5,
                    t.prototype.rotateCameraZoomSpeed = .1,
                    t.prototype.rotateCameraMovementSpeed = 2,
                    t.prototype.zoomInCameraZoomSpeed = 2,
                    t.prototype.zoomInCameraMovementSpeed = 2,
                    t.prototype.isMouseDown = !1,
                    t.prototype.mousePosition = new THREE.Vector2,
                    t.prototype.mousePickingPosition = new THREE.Vector2,
                    t.prototype.mouseDownPosition = new THREE.Vector2,
                    t.prototype.phiThetaDownPosition = new THREE.Vector2,
                    t.prototype.phiTheta = null,
                    t.prototype.initialPhiTheta = null,
                    t.prototype.cameraLookAt = new THREE.Vector3,
                    t.prototype.mouseSensitivity = 10,
                    t.prototype.gui = null,
                    t.prototype.destroyed = !1,
                    t.prototype.raycaster = null,
                    t.prototype.pinOpacity = null,
                    t.prototype.pinMaterial = null,
                    t.prototype.postponeFirstDrag = !1,
                    t.prototype.tempVec3_1 = new THREE.Vector3,
                    t.prototype.tempVec3_2 = new THREE.Vector3,
                    t.prototype.tempVec2_1 = new THREE.Vector2,
                    t.prototype.tempVec2_2 = new THREE.Vector2,
                    t.prototype.idleCameraName = "camera0",
                    t.prototype.productsToCameras = {
                        stupore: "camera1",
                        vermentino: "camera2",
                        rosato: "camera3",
                        "cabernet-sauvignon": "camera4",
                        "podere-277-syrah": "camera5",
                        "campo-alle-comete-bolgheri-superiore": "camera6"
                    },
                    t.prototype.productsToPins = {
                        stupore: "locator1",
                        vermentino: "locator2",
                        rosato: "locator3",
                        "cabernet-sauvignon": "locator4",
                        "podere-277-syrah": "locator5",
                        "campo-alle-comete-bolgheri-superiore": "locator6"
                    },
                    t.prototype.flappingStuff = [{
                        parent: "cavalluccio",
                        sx: "ala_sx4",
                        dx: "ala_dx4",
                        axis: "y",
                        extension: .1,
                        speed: .09
                    }, {
                        parent: "cavalluccio_alato",
                        sx: "ala_dx3",
                        dx: "ala_sx3",
                        axis: "x",
                        extension: .1,
                        speed: .2
                    }, {
                        parent: "farfalla",
                        sx: "ala_sx5",
                        dx: "ala_dx5",
                        axis: "y",
                        extension: .09,
                        speed: .2
                    }, {
                        parent: "pesce",
                        sx: "ala_sx6",
                        dx: "ala_dx6",
                        axis: "x",
                        extension: .05,
                        speed: .1
                    }, {
                        parent: "cavalluccio_rosso",
                        sx: "ala_sx2",
                        dx: "ala_dx2",
                        axis: "x",
                        extension: .04,
                        speed: .1
                    }, {
                        parent: "pesce2",
                        sx: "ala_dx2.001",
                        dx: "ala_dx7",
                        axis: "x",
                        extension: .05,
                        speed: .1
                    }],
                    t.prototype.floatingStuff = ["cavalluccio", "pesce", "cavalluccio_rosso", "pesce2", "cavalluccio_alato", "farfalla", "pavone", "tipa"],
                    t.prototype.wavingStuff = ["fiore1", "fiore2", "fiore3", "fiore4", "fiore5", "fiore6", "fiore7", "fiore9", "fiore10"],
                    t.prototype.doubleFacedObjects = ["tipa"],
                    t.prototype.init = function (e) {
                        var t, i, o;
                        null != e && (this.removeLoadingListener = this.$scope.$watch("main.loading", function (e) {
                                return function (t) {
                                    t || (e.removeLoadingListener(),
                                        e.intro())
                                }
                            }(this)),
                            this.removeOnInitListener(),
                            this.raycaster = new THREE.Raycaster,
                            this.phiTheta = new d(new THREE.Vector2(0, 0)),
                            this.phiTheta.speed = .1,
                            this.cameraRadius = new u(this.idleRadius),
                            this.cameraRadius.speed = this.idleCameraZoomSpeed,
                            this.pinOpacity = new u(1),
                            this.sceneMouseRotation = new u(Math.PI),
                            this.sceneMouseRotation.speed = 1,
                            this.$scope.main.addSubRoutine("sceneUpdate-3dMainScene", this.render),
                            this.$scope.main.addSubRoutine("sceneUpdate-moveCamera", this.moveCamera),
                            this.$scope.main.addSubRoutine("sceneUpdate-updatePhiTheta", this.phiTheta.update),
                            this.$scope.main.addSubRoutine("sceneUpdate-updateCameraRadius", this.cameraRadius.update),
                            this.$scope.main.addSubRoutine("sceneUpdate-updatePinOpacity", this.pinOpacity.update),
                            this.$scope.main.addSubRoutine("sceneUpdate-updatesceneMouseRotation", function (e) {
                                return function (t) {
                                    var n, i;
                                    return e.sceneMouseRotation.update(t),
                                        null != (n = e.scene) && (n.rotation.y = e.sceneMouseRotation.value),
                                        null != (i = e.camerasScene) ? i.rotation.y = e.sceneMouseRotation.value : void 0
                                }
                            }(this)),
                            this.camera = new THREE.PerspectiveCamera(.7 * this.idleFOV, 800 / 600, .1, 1500),
                            this.cameraLookAt.set(0, 5, 0),
                            this.scene = new THREE.Scene,
                            this.scene.position.y = this.loadingSceneY,
                            this.scene.rotation.y = Math.PI,
                            this.camerasScene = new THREE.Scene,
                            this.camerasScene.position.y = this.finalSceneY,
                            this.camerasScene.rotation.y = Math.PI,
                            this.camerasScene.updateMatrix(),
                            this.camerasScene.updateMatrixWorld(!0),
                            this.renderer = new THREE.WebGLRenderer({
                                antialias: !0,
                                alpha: !0,
                                canvas: this.$scope.element
                            }),
                            this.renderer.sortObjects = !1,
                            this.clock = new THREE.Clock(!0),
                            this.renderer.setClearColor(16777215),
                            this.renderer.setPixelRatio(n.devicePixelRatio),
                            this.renderer.setSize(800, 600),
                            this.composer = new THREE.EffectComposer(this.renderer),
                            this.renderPass = new THREE.RenderPass(this.scene, this.camera),
                            this.composer.addPass(this.renderPass),
                            this.colorCorrection = new THREE.ShaderPass(THREE.ColorCorrectionShader),
                            this.colorCorrection.uniforms.powRGB.value.x = 1,
                            this.colorCorrection.uniforms.powRGB.value.y = 1,
                            this.colorCorrection.uniforms.powRGB.value.z = 1,
                            this.composer.addPass(this.colorCorrection),
                            this.brightnessContrast = new THREE.ShaderPass(THREE.BrightnessContrastShader),
                            this.composer.addPass(this.brightnessContrast),
                            this.fxaa = new THREE.ShaderPass(THREE.FXAAShader),
                            this.fxaa.renderToScreen = !0,
                            this.composer.addPass(this.fxaa),
                            THREE.Cache.enabled = !1,
                            this.$scope.element.addEventListener("mousedown", this.onMouseDown),
                            n.addEventListener("mousemove", this.onMouseMove),
                            n.addEventListener("mouseup", this.onMouseUp),
                            this.$scope.element.addEventListener("touchstart", this.onTouchStart),
                            this.$scope.element.addEventListener("touchmove", this.onTouchMove),
                            n.addEventListener("touchend", this.onTouchEnd),
                            i = "assets/models/skybox_v2/",
                            t = ".jpg",
                            o = [i + "px" + t, i + "nx" + t, i + "py" + t, i + "ny" + t, i + "pz" + t, i + "nz" + t],
                            this.reflectionCube = (new THREE.CubeTextureLoader).load(o, this.onSkyboxLoaded),
                            this.reflectionCube.format = THREE.RGBFormat,
                            this.scene.background = this.reflectionCube,
                            this.onResize({
                                width: n.innerWidth,
                                height: n.innerHeight
                            }))
                    },
                    t.prototype.onSkyboxLoaded = function () {
                        var e;
                        return this.skyboxLoaded = !0,
                            this.initPointsCloud(),
                            e = new THREE.ObjectLoader,
                            !this.$scope.main.platform.desktop && this.$scope.main.platform.safari ? e.load("assets/models/v4-mobile/scene.json", this.onLoadFinished, this.onLoadProgress) : e.load("assets/models/v4/scene.json", this.onLoadFinished, this.onLoadProgress)
                    },
                    t.prototype.destroy = function () {
                        var e;
                        console.log("destroy"),
                            this.destroyed = !0,
                            this.removeDestroyListener(),
                            this.removeOnInitListener(),
                            this.removeStateChangeListener(),
                            this.removeTransitionSubRoutines(),
                            this.removeMenuOpenListener(),
                            null != (e = this.gui) && e.destroy(),
                            this.$scope.element.removeEventListener("mousedown", this.onMouseDown),
                            n.removeEventListener("mousemove", this.onMouseMove),
                            n.removeEventListener("mouseup", this.onMouseUp),
                            this.$scope.element.removeEventListener("touchstart", this.onTouchStart),
                            this.$scope.element.removeEventListener("touchmove", this.onTouchMove),
                            n.removeEventListener("touchend", this.onTouchEnd),
                            this.renderer.dispose(),
                            this.scene.traverse(function (e) {
                                var t, n, i, o, a, s, r, l, c;
                                null != (t = e.material) && null != (n = t.program) && n.destroy(),
                                    null != (i = e.geometry) && i.dispose(),
                                    null != (o = e.material) && null != (a = o.uniforms) && null != (s = a.map) && null != (r = s.value) && r.dispose(),
                                    null != (l = e.material) && null != (c = l.map) && c.dispose()
                            }),
                            this.scene.background.dispose()
                    },
                    t.prototype.onMenuOpen = function (e) {
                        e ? this.state === t.STATE_IDLE && (this.cameraRadius.target = this.idleRadiusIntro) : this.$scope.main.firstDragged && this.state === t.STATE_IDLE && (this.cameraRadius.target = this.idleRadius),
                            a.cancel(this.sceneUpdateDeactivateTimeout),
                            e ? this.sceneUpdateDeactivateTimeout = a(function (e) {
                                return function () {
                                    return e.$scope.main.sceneUpdate = !1
                                }
                            }(this), 1e3) : this.$scope.main.sceneUpdate = !0
                    },
                    t.prototype.setupDebugGUI = function () {
                        var e;
                        this.gui = new dat.GUI,
                            this.gui.add(this.$scope.main.css3dSettings, "tx", 0, 50).step(1).name("CSS3D TX"),
                            this.gui.add(this.$scope.main.css3dSettings, "rx", 0, 50).step(1).name("CSS3D RX"),
                            this.gui.add(this.$scope.main.css3dSettings, "ry", 0, 50).step(1).name("CSS3D RY"),
                            this.gui.add(this, "pinSize", 0, .2).step(.01).name("Pin Size"),
                            e = this.gui.addFolder("Camera"),
                            e.add(this, "idleFOV", 0, 100).step(1).name("Idle FOV").onChange(function (e) {
                                return function () {
                                    return e.state === t.STATE_IDLE ? (e.camera.fov = e.idleFOV,
                                        e.camera.updateProjectionMatrix()) : void 0
                                }
                            }(this)),
                            e.add(this, "idleCameraZoomSpeed", 0, 3).step(.1).name("Idle Zoom Spd"),
                            e.add(this, "idleCameraMovementSpeed", 0, 3).step(.1).name("Idle Mv Spd"),
                            e.add(this, "zoomOutCameraZoomSpeed", 0, 3).step(.1).name("Out Zoom Spd"),
                            e.add(this, "zoomOutCameraMovementSpeed", 0, 3).step(.1).name("Out Mv Spd"),
                            e.add(this, "zoomInCameraZoomSpeed", 0, 3).step(.1).name("In Zoom Spd"),
                            e.add(this, "zoomInCameraMovementSpeed", 0, 3).step(.1).name("In Mv Spd")
                    },
                    t.prototype.init2DPins = function () {
                        this.$scope.main.addSubRoutine("sceneUpdate-pinPositionUpdate", function (e) {
                            return function (t) {
                                var n, i, o, a, s;
                                n = 0;
                                for (s in e.productsToPins)
                                    o = e.productsToPins[s],
                                    i = e.findObjectByName(o),
                                    null != i && (i.getWorldPosition(e.tempVec3_1),
                                        a = e.getScreenPos(e.tempVec3_1),
                                        a.id = s,
                                        a.visible = !0,
                                        null == e.$scope.main.uiPins[n] ? e.$scope.main.uiPins[n] = a : (e.$scope.main.uiPins[n].x = Math.round(a.x),
                                            e.$scope.main.uiPins[n].y = Math.round(a.y),
                                            e.$scope.main.uiPins[n].id = a.id,
                                            e.$scope.main.uiPins[n].visible = !0),
                                        n++);
                                return !e.destroyed
                            }
                        }(this))
                    },
                    t.prototype.checkPinVisibility = function (e) {
                        var t, n, i, o;
                        return e.getWorldPosition(this.tempVec3_1),
                            o = this.tempVec3_1.length(),
                            i = this.cameraLookAt.clone().sub(this.camera.position),
                            t = Math.sqrt(Math.pow(i.length(), 2) - Math.pow(o, 2)),
                            n = this.tempVec3_1.sub(this.camera.position),
                            n.length() <= t + 5
                    },
                    t.prototype.createPinTexture = function (e) {
                        var t, n;
                        return t = new g({
                                size: 64
                            }),
                            n = new THREE.Texture(t.domElement),
                            n.generateMipmaps = !1,
                            n.minFilter = THREE.LinearFilter,
                            n.magFilter = THREE.LinearFilter,
                            this.$scope.main.addSubRoutine("sceneUpdate-pinTextureUpdate-" + e, function (e) {
                                return t.render(e),
                                    n.needsUpdate = !0,
                                    !0
                            }),
                            n
                    },
                    t.prototype.init3DPins = function () {
                        var e, n, i, o, a, s, r;
                        r = this.createPinTexture("all"),
                            e = new THREE.PlaneBufferGeometry(5, 5, 1, 1);
                        for (s in this.productsToPins)
                            o = this.productsToPins[s],
                            n = this.findObjectByName(o),
                            null != n && (i = new THREE.SpriteMaterial({
                                    map: r,
                                    transparent: !1,
                                    depthTest: !0,
                                    depthWrite: !0
                                }),
                                a = new THREE.Sprite(i),
                                a.elasticScale = new u(1),
                                a.scale.set(1.5, 1.5, 1.5),
                                a.productid = s,
                                a.name = "pin-" + s,
                                a.parentPosition = n,
                                this.scene.add(a));
                        this.$scope.main.addSubRoutine("sceneUpdate-pinManagement", function (e) {
                            return function (n) {
                                var i, o, a, r, l, c, u;
                                e.overPins = [];
                                for (s in e.productsToPins)
                                    l = e.findObjectByName("pin-" + s),
                                    l.elasticScale.update(n),
                                    l.parentPosition.getWorldPosition(e.tempVec3_1),
                                    r = e.scene.worldToLocal(e.tempVec3_1),
                                    l.position.copy(r),
                                    l.getWorldPosition(e.tempVec3_1),
                                    e.camera.getWorldPosition(e.tempVec3_2),
                                    o = e.scene.worldToLocal(e.tempVec3_1).sub(e.scene.worldToLocal(e.tempVec3_2)).length(),
                                    c = o * e.pinSize * l.elasticScale.value,
                                    l.scale.set(c, c, c),
                                    e.state === t.STATE_IDLE && (a = e.raycaster.intersectObject(l),
                                        a.length > 0 ? (l.elasticScale.target = 1.5,
                                            e.overPins.push({
                                                distance: a[0].distance,
                                                pin: l
                                            })) : l.elasticScale.target = 1),
                                    l.material.opacity = e.pinOpacity.value;
                                return e.state === t.STATE_IDLE ? e.pinOpacity.target = 1 : e.pinOpacity.target = 0,
                                    e.overPins.sort(function (e, t) {
                                        return e.distance < t.distance
                                    }),
                                    i = e.$scope.main.overPin.over,
                                    e.overPins.length > 0 ? (e.$scope.main.overPin.over = !0,
                                        e.$scope.main.overPin.productid = e.overPins[0].pin.productid,
                                        i || e.$scope.$apply()) : (e.$scope.main.overPin.over = !1,
                                        i && e.$scope.$apply()),
                                    u = e.findObjectByName("pin-" + e.$scope.main.overPin.productid),
                                    null != u && (u.getWorldPosition(e.tempVec3_1),
                                        e.$scope.main.overPin.position = e.getScreenPos(e.tempVec3_1)),
                                    !0
                            }
                        }(this))
                    },
                    t.prototype.getScreenPos = function (e) {
                        var t, i, o, a, s;
                        return s = n.innerWidth / 2,
                            t = n.innerHeight / 2,
                            a = e.project(this.camera),
                            i = Math.round(10 * (a.x * s + s)) / 10,
                            o = Math.round(10 * (-a.y * t + t)) / 10, {
                                x: i,
                                y: o
                            }
                    },
                    t.prototype.initPointsCloud = function () {
                        var e, t, n, i, o, a, s, r, l, c, u, d, p, h;
                        for (h = new THREE.TextureLoader,
                            p = h.load("assets/models/particle1.jpg"),
                            o = 1e3,
                            e = new THREE.BufferGeometry,
                            c = new Float32Array(3 * o),
                            u = new Float32Array(o),
                            a = new Float32Array(o),
                            s = new Float32Array(o),
                            t = n = 0,
                            d = o; d >= 0 ? d > n : n > d; t = d >= 0 ? ++n : --n)
                            l = 3 * t,
                            c[l] = 200 * Math.random() - 100,
                            c[l + 1] = 200 * Math.random() - 100,
                            c[l + 2] = 200 * Math.random() - 100,
                            u[t] = 1 + 2 * Math.random(),
                            a[t] = 1 + 2 * Math.random(),
                            s[t] = -2 + 4 * Math.random();
                        e.addAttribute("position", new THREE.BufferAttribute(c, 3)),
                            e.addAttribute("pulseSpeed", new THREE.BufferAttribute(u, 1)),
                            e.addAttribute("orbitSize", new THREE.BufferAttribute(a, 1)),
                            e.addAttribute("orbitSpeed", new THREE.BufferAttribute(s, 1)),
                            i = new THREE.ShaderMaterial({
                                uniforms: THREE.UniformsUtils.clone(m.uniforms),
                                vertexShader: m.vertexShader,
                                fragmentShader: m.fragmentShader,
                                blending: THREE.AdditiveBlending,
                                transparent: !0
                            }),
                            i.uniforms.map.value = p,
                            i.uniforms.size.value = .4,
                            r = new THREE.Points(e, i),
                            this.scene.add(r),
                            this.scene.children.pop(),
                            this.scene.children.unshift(r),
                            this.$scope.main.addSubRoutine("sceneUpdate-animateParticles", function (e) {
                                return i.uniforms.time.value += e,
                                    !this.destroyed
                            })
                    },
                    t.prototype.onStateChange = function (e, n, i, s, r) {
                        var l;
                        if (console.log("threejsScene received", n.name),
                            !this.$scope.main.loading)
                            switch (n.name) {
                                case "home.transition":
                                    this.state = t.STATE_TRANSITION;
                                    break;
                                case "home.product":
                                    l = this.getCameraForURL(i.producturl),
                                        this.focusingObject !== l && null != l && (null != e && e.preventDefault(),
                                            a.cancel(this.sceneUpdateDeactivateTimeout),
                                            this.$scope.main.sceneUpdate = !0,
                                            o.go("home.transition", i),
                                            this.gotoFocusingState(i.producturl).then(function (e) {
                                                return function () {
                                                    o.go(n, i),
                                                        a.cancel(e.sceneUpdateDeactivateTimeout),
                                                        e.sceneUpdateDeactivateTimeout = a(function () {
                                                            return e.$scope.main.sceneUpdate = !1
                                                        }, 3e3)
                                                }
                                            }(this)));
                                    break;
                                case "home":
                                    a.cancel(this.sceneUpdateDeactivateTimeout),
                                        this.$scope.main.sceneUpdate = !0,
                                        this.postponeFirstDrag && (this.$scope.main.firstDragged = !1),
                                        this.gotoIdleState(),
                                        this.postponeFirstDrag && (this.initialPhiTheta = new THREE.Vector2(this.phiTheta.x, this.phiTheta.y),
                                            this.$scope.main.firstDragged = !0,
                                            this.postponeFirstDrag = !1,
                                            a(function (e) {
                                                return function () {
                                                    return e.$scope.main.firstDragged = !1,
                                                        e.$scope.$apply()
                                                }
                                            }(this), 10));
                                    break;
                                default:
                                    a.cancel(this.sceneUpdateDeactivateTimeout),
                                        this.sceneUpdateDeactivateTimeout = a(function (e) {
                                            return function () {
                                                return e.$scope.main.sceneUpdate = !1
                                            }
                                        }(this), 3e3),
                                        this.gotoIdleState()
                            }
                    },
                    t.prototype.removeTransitionSubRoutines = function () {
                        this.$scope.main.removeSubRoutine("transitionIdleState"),
                            this.$scope.main.removeSubRoutine("transitionZoomOut"),
                            this.$scope.main.removeSubRoutine("transitionRotate"),
                            this.$scope.main.removeSubRoutine("transitionZoomIn"),
                            c.killTweensOf(this.cameraRadius),
                            c.killTweensOf(this.phiTheta)
                    },
                    t.prototype.gotoIdleState = function () {
                        var e, n, i;
                        return e = s.defer(),
                            console.log("gotoIdleState"),
                            this.removeTransitionSubRoutines(),
                            this.focusingObject = null,
                            n = this.$scope.main.firstDragged && this.introDone ? this.idleRadius : this.idleRadiusIntro,
                            this.$scope.main.addSubRoutine("sceneUpdate-transitionIdleState", function (t) {
                                return function () {
                                    return n = t.$scope.main.firstDragged ? t.idleRadius : t.idleRadiusIntro,
                                        t.cameraRadius.value >= n - .001 * n ? (e.resolve(),
                                            !1) : !0
                                }
                            }(this)),
                            this.state = t.STATE_IDLE,
                            i = this.getIdleSpherical(),
                            c.to(this.cameraRadius, 2, {
                                speed: this.idleCameraZoomSpeed,
                                target: n
                            }),
                            this.phiTheta.x = i.phi,
                            this.phiTheta.y = i.theta,
                            c.to(this.phiTheta, 2, {
                                speed: this.idleCameraMovementSpeed
                            }),
                            c.to(this.cameraLookAt, 2, {
                                x: 0,
                                y: 0,
                                z: 0
                            }),
                            c.to(this.camera, 5, {
                                fov: this.idleFOV,
                                ease: Power2.easeInOut,
                                onUpdate: function (e) {
                                    return function () {
                                        return e.camera.updateProjectionMatrix()
                                    }
                                }(this)
                            }),
                            e.promise
                    },
                    t.prototype.getIdleSpherical = function () {
                        var e;
                        return e = this.findCamera(this.idleCameraName),
                            e.getWorldPosition(this.tempVec3_1),
                            this.getSphericalCoordinates(this.tempVec3_1)
                    },
                    t.prototype.gotoFocusingState = function (e) {
                        var n, i;
                        if (n = s.defer(),
                            i = this.getCameraForURL(e),
                            null == i)
                            return n.resolve(),
                                n.promise;
                        switch (this.focusingObject = null,
                            this.state) {
                            case t.STATE_FOCUSING:
                            case t.STATE_TRANSITION:
                                this.zoomIn(i).then(function (e) {
                                    return function () {
                                        return e.state = t.STATE_FOCUSING,
                                            e.focusingObject = i,
                                            n.resolve()
                                    }
                                }(this));
                                break;
                            case t.STATE_IDLE:
                                this.cameraRadius.target = this.idleRadius,
                                    this.cameraRadius.speed = this.idleCameraZoomSpeed,
                                    this.zoomIn(i).then(function (e) {
                                        return function () {
                                            return e.state = t.STATE_FOCUSING,
                                                e.focusingObject = i,
                                                n.resolve()
                                        }
                                    }(this))
                        }
                        return n.promise
                    },
                    t.prototype.getCameraForURL = function (e) {
                        var t, n, i;
                        return i = _.find(this.$scope.main.config.products, {
                                url: e
                            }).id,
                            i && (n = this.productsToCameras[i],
                                n && (t = this.findCamera(n),
                                    null != t)) ? t : null
                    },
                    t.prototype.zoomOut = function (e) {
                        var t, n;
                        return t = s.defer(),
                            this.removeTransitionSubRoutines(),
                            this.$scope.main.addSubRoutine("sceneUpdate-transitionZoomOut", function (e) {
                                return function () {
                                    return e.cameraRadius.value >= e.idleRadius - .001 * e.idleRadius && e.cameraRadius.value <= e.idleRadius + .001 * e.idleRadius ? (t.resolve(),
                                        !1) : !0
                                }
                            }(this)),
                            console.log("zoomOut"),
                            e.getWorldPosition(this.tempVec3_1),
                            n = this.getSphericalCoordinates(this.tempVec3_1),
                            c.to(this.phiTheta, 2, {
                                x: n.phi,
                                y: n.theta,
                                speed: this.zoomOutCameraMovementSpeed,
                                ease: Power2.easeInOut
                            }),
                            c.to(this.cameraRadius, 2, {
                                speed: this.zoomOutCameraZoomSpeed,
                                target: this.idleRadius,
                                ease: Power2.easeInOut
                            }),
                            c.to(this.cameraLookAt, 1, {
                                x: 0,
                                y: 0,
                                z: 0,
                                ease: Power2.easeInOut
                            }),
                            t.promise
                    },
                    t.prototype.rotateToObj = function (e) {
                        var t, n;
                        return t = s.defer(),
                            console.log("rotateToObj"),
                            this.removeTransitionSubRoutines(),
                            this.$scope.main.addSubRoutine("sceneUpdate-transitionRotate", function (e) {
                                return function () {
                                    return e.phiTheta.value.x >= n.phi - 1 && e.phiTheta.value.x <= n.phi + 1 ? (t.resolve(),
                                        !1) : !0
                                }
                            }(this)),
                            e.getWorldPosition(this.tempVec3_1),
                            n = this.getSphericalCoordinates(this.tempVec3_1),
                            c.to(this.phiTheta, 2, {
                                x: n.phi,
                                y: n.theta,
                                speed: this.rotateCameraMovementSpeed,
                                ease: Power2.easeInOut
                            }),
                            c.to(this.cameraRadius, 2, {
                                speed: this.rotateCameraZoomSpeed,
                                target: this.idleRadius,
                                ease: Power2.easeInOut
                            }),
                            c.to(this.cameraLookAt, 1, {
                                x: 0,
                                y: 0,
                                z: 0,
                                ease: Power2.easeInOut
                            }),
                            t.promise
                    },
                    t.prototype.zoomIn = function (e) {
                        var t, n, i;
                        return t = s.defer(),
                            console.log("zoomIn"),
                            this.removeTransitionSubRoutines(),
                            e.getWorldPosition(this.tempVec3_1),
                            i = this.getSphericalCoordinates(this.tempVec3_1),
                            this.$scope.main.addSubRoutine("sceneUpdate-transitionZoomIn", function (e) {
                                return function () {
                                    return e.cameraRadius.value <= i.radius + .001 * e.idleRadius && e.cameraRadius.value >= i.radius - .001 * e.idleRadius ? (t.resolve(),
                                        !1) : !0
                                }
                            }(this)),
                            e instanceof THREE.PerspectiveCamera && (c.killTweensOf(this.camera),
                                c.to(this.camera, 5, {
                                    fov: e.fov,
                                    onUpdate: function (e) {
                                        return function () {
                                            return e.camera.updateProjectionMatrix()
                                        }
                                    }(this),
                                    ease: Power2.easeInOut
                                })),
                            c.to(this.phiTheta, 2, {
                                x: i.phi,
                                y: i.theta,
                                speed: this.zoomInCameraMovementSpeed,
                                ease: Power2.easeInOut
                            }),
                            c.to(this.cameraRadius, 2, {
                                speed: this.zoomInCameraZoomSpeed,
                                target: i.radius,
                                ease: Power2.easeInOut
                            }),
                            n = e.getWorldDirection(),
                            n.multiplyScalar(-i.radius),
                            e.getWorldPosition(this.tempVec3_1),
                            n.add(this.tempVec3_1),
                            c.to(this.cameraLookAt, 4, {
                                x: n.x,
                                y: n.y,
                                z: n.z,
                                ease: Power2.easeInOut
                            }),
                            t.promise
                    },
                    t.prototype.getCartesianCoordinates = function (e, t, n, i) {
                        e.z = t * Math.sin(i + Math.PI / 2) * Math.cos(n),
                            e.x = t * Math.sin(i + Math.PI / 2) * Math.sin(n),
                            e.y = t * Math.cos(i + Math.PI / 2)
                    },
                    t.prototype.getSphericalCoordinates = function (e) {
                        var t, n, i, o, a, s, r;
                        return o = e.length(),
                            i = Math.atan2(e.x, e.z),
                            s = Math.acos(e.y / o) - Math.PI / 2,
                            r = 2 * Math.PI,
                            n = Math.floor(this.phiTheta.value.x / r) * r,
                            a = n + i,
                            t = this.shortestAngle(a, this.phiTheta.value.x),
                            i = this.phiTheta.value.x + t, {
                                radius: o,
                                theta: s,
                                phi: i
                            }
                    },
                    t.prototype.shortestAngle = function (e, t) {
                        var n;
                        return n = e - t,
                            this.absmod(n + Math.PI, 2 * Math.PI) - Math.PI
                    },
                    t.prototype.findObjectByName = function (e) {
                        var t;
                        return t = null,
                            this.scene.traverse(function (n) {
                                return n.name === e ? t = n : void 0
                            }),
                            t
                    },
                    t.prototype.findCamera = function (e) {
                        var t, n, i, o;
                        if (null != this.cameras) {
                            for (o = this.cameras,
                                n = 0,
                                i = o.length; i > n; n++)
                                if (t = o[n],
                                    t.name === e)
                                    return t;
                            return null
                        }
                    },
                    t.prototype.onLoadProgress = function (e) {
                        var t;
                        t = (0 !== e.loaded ? e.loaded : 1) / (0 !== e.total ? e.total : 1),
                            t = Math.max(0, Math.min(1, t)),
                            this.$scope.main.loadingProgress = t,
                            this.phiTheta.x = 2 * Math.PI * t
                    },
                    t.prototype.onLoadFinished = function (e) {
                        for (var t, n, i, o; e.children.length > 0;)
                            this.scene.add(e.children[0]);
                        for (this.init3DPins(),
                            this.init2DPins(),
                            this.cameras = [],
                            this.scene.traverse(function (e) {
                                return function (t) {
                                    var n, i, o, a, s;
                                    t instanceof THREE.PerspectiveCamera && e.cameras.push(t),
                                        t instanceof THREE.Mesh && (n = null,
                                            o = t.material.transparent,
                                            null != t.material.lightMap && (n = t.material.lightMap),
                                            t.material = new THREE.ShaderMaterial({
                                                uniforms: THREE.UniformsUtils.clone(h.uniforms),
                                                vertexShader: h.vertexShader,
                                                fragmentShader: h.fragmentShader
                                            }),
                                            t.material.uniforms.fresnelColor.value = new THREE.Color(16777215),
                                            t.material.uniforms.fresnelIntensity.value = 0,
                                            t.material.uniforms.fresnelPow.value = 5,
                                            t.material.transparent = o,
                                            i = t.scale.x < 0 || t.scale.y < 0 || t.scale.z < 0,
                                            i && (t.material.side = THREE.BackSide),
                                            -1 !== e.doubleFacedObjects.indexOf(t.name) && (t.material.side = THREE.DoubleSide),
                                            null != n && (t.material.uniforms.map.value = n),
                                            -1 !== e.wavingStuff.indexOf(t.name) && (t.geometry.computeBoundingBox(),
                                                s = t.geometry.boundingBox.min.y,
                                                a = t.geometry.boundingBox.max.y,
                                                t.material.uniforms.wavingMax.value = a,
                                                t.material.uniforms.wavingMin.value = s,
                                                t.material.uniforms.wavingFactor.value = -5 + 10 * Math.random(),
                                                t.material.uniforms.wavingAmplitude.value = .033 * Math.abs(a - s),
                                                e.wave(t, 10 * Math.random())))
                                }
                            }(this)),
                            o = this.cameras,
                            n = 0,
                            i = o.length; i > n; n++)
                            t = o[n],
                            this.camerasScene.add(t),
                            t.updateMatrix(),
                            t.updateMatrixWorld(!0);
                        this.$scope.$apply(),
                            this.setupFlappingStuff(),
                            this.setupFloatingStuff(),
                            this.$scope.main.platform.development && this.setupDebugGUI(),
                            this.$scope.main.platform.ios || this.preRenderScene(),
                            a(function (e) {
                                return function () {
                                    return e.$scope.main.loadingProgress = 2
                                }
                            }(this), 100)
                    },
                    t.prototype.preRenderScene = function () {
                        var e, t, n;
                        n = this.scene.position.clone(),
                            e = this.camera.fov,
                            t = this.cameraLookAt.clone(),
                            this.camera.fov = 100,
                            this.cameraLookAt.set(0, 0, 0),
                            this.camera.updateProjectionMatrix(),
                            this.scene.position.y = this.finalSceneY,
                            this.scene.updateMatrix(),
                            this.scene.updateMatrixWorld(!0),
                            this.renderer.render(this.scene, this.camera),
                            this.camera.fov = e,
                            this.cameraLookAt.copy(t),
                            this.camera.updateProjectionMatrix(),
                            this.scene.position.copy(n),
                            this.scene.updateMatrix(),
                            this.scene.updateMatrixWorld(!0),
                            this.renderer.render(this.scene, this.camera)
                    },
                    t.prototype.intro = function () {
                        var e;
                        this.onStateChange(null, o.current, o.params),
                            e = this.getIdleSpherical(),
                            this.initialPhiTheta = new THREE.Vector2(e.phi, e.theta),
                            this.state === t.STATE_IDLE ? (this.$scope.main.firstDragged = !1,
                                c.to(this.camera, 5, {
                                    fov: this.idleFOV,
                                    onUpdate: function (e) {
                                        return function () {
                                            return e.camera.updateProjectionMatrix()
                                        }
                                    }(this)
                                }),
                                c.to(this.cameraLookAt, 5, {
                                    x: 0,
                                    y: 0,
                                    z: 0
                                })) : (this.$scope.main.firstDragged = !0,
                                this.postponeFirstDrag = !0),
                            c.to(this.scene.position, 5, {
                                y: this.finalSceneY
                            }),
                            this.introDone = !0
                    },
                    t.prototype.wave = function (e, t) {
                        null == t && (t = 0),
                            c.to(e.material.uniforms.wavingFactor, 5 + 5 * Math.random(), {
                                value: 2,
                                ease: Power2.easeInOut,
                                delay: t,
                                onComplete: function (t) {
                                    return function () {
                                        return t.destroyed ? void 0 : t.waveBack(e)
                                    }
                                }(this)
                            })
                    },
                    t.prototype.waveBack = function (e) {
                        c.to(e.material.uniforms.wavingFactor, 5 + 5 * Math.random(), {
                            value: -2,
                            ease: Power2.easeInOut,
                            onComplete: function (t) {
                                return function () {
                                    return t.destroyed ? void 0 : t.wave(e)
                                }
                            }(this)
                        })
                    },
                    t.prototype.setupFloatingStuff = function () {
                        var e, t, n, i;
                        for (i = this.floatingStuff,
                            e = 0,
                            t = i.length; t > e; e++)
                            n = i[e],
                            n = this.findObjectByName(n),
                            null != n && (n.floated = n.position.y + 1,
                                n.unfloated = n.position.y,
                                this["float"](n, 10 * Math.random()))
                    },
                    t.prototype["float"] = function (e, t) {
                        null == t && (t = 0),
                            c.to(e.position, 5, {
                                y: e.floated,
                                ease: Power2.easeInOut,
                                delay: t,
                                onComplete: function (t) {
                                    return function () {
                                        return t.destroyed ? void 0 : t.floatBack(e)
                                    }
                                }(this)
                            })
                    },
                    t.prototype.floatBack = function (e) {
                        c.to(e.position, 5, {
                            y: e.unfloated,
                            ease: Power2.easeInOut,
                            onComplete: function (t) {
                                return function () {
                                    return t.destroyed ? void 0 : t["float"](e)
                                }
                            }(this)
                        })
                    },
                    t.prototype.setupFlappingStuff = function () {
                        var e, t, n, i, o, a, s;
                        for (a = this.flappingStuff,
                            t = 0,
                            n = a.length; n > t; t++)
                            i = a[t],
                            o = this.findObjectByName(i.parent),
                            s = _.find(o.children, {
                                name: i.sx
                            }),
                            e = _.find(o.children, {
                                name: i.dx
                            }),
                            null != s && null != e ? (s.flapped = s.rotation[i.axis] - i.extension,
                                s.unflapped = s.rotation[i.axis],
                                e.flapped = e.rotation[i.axis] + i.extension,
                                e.unflapped = e.rotation[i.axis],
                                this.flap(s, i.axis, i.speed),
                                this.flap(e, i.axis, i.speed)) : console.log("BO")
                    },
                    t.prototype.flap = function (e, t, n) {
                        switch (null == t && (t = "y"),
                            null == n && (n = .1),
                            t) {
                            case "x":
                                c.to(e.rotation, n, {
                                    x: e.flapped,
                                    onComplete: function (i) {
                                        return function () {
                                            return i.destroyed ? void 0 : i.flapBack(e, t, n)
                                        }
                                    }(this)
                                });
                                break;
                            case "y":
                                c.to(e.rotation, n, {
                                    y: e.flapped,
                                    onComplete: function (i) {
                                        return function () {
                                            return i.destroyed ? void 0 : i.flapBack(e, t, n)
                                        }
                                    }(this)
                                });
                                break;
                            case "z":
                                c.to(e.rotation, n, {
                                    z: e.flapped,
                                    onComplete: function (i) {
                                        return function () {
                                            return i.destroyed ? void 0 : i.flapBack(e, t, n)
                                        }
                                    }(this)
                                })
                        }
                    },
                    t.prototype.flapBack = function (e, t, n) {
                        switch (null == t && (t = "y"),
                            null == n && (n = .1),
                            t) {
                            case "x":
                                c.to(e.rotation, n, {
                                    x: e.unflapped,
                                    onComplete: function (i) {
                                        return function () {
                                            return i.destroyed ? void 0 : i.flap(e, t, n)
                                        }
                                    }(this)
                                });
                                break;
                            case "y":
                                c.to(e.rotation, n, {
                                    y: e.unflapped,
                                    onComplete: function (i) {
                                        return function () {
                                            return i.destroyed ? void 0 : i.flap(e, t, n)
                                        }
                                    }(this)
                                });
                                break;
                            case "z":
                                c.to(e.rotation, n, {
                                    z: e.unflapped,
                                    onComplete: function (i) {
                                        return function () {
                                            return i.destroyed ? void 0 : i.flap(e, t, n)
                                        }
                                    }(this)
                                })
                        }
                    },
                    t.prototype.onResize = function (e) {
                        var t, i, o, a;
                        this.camera.aspect = e.width / e.height,
                            this.camera.updateProjectionMatrix(),
                            null != (t = this.fxaa) && null != (i = t.uniforms.resolution) && (i.value.x = 1 / (e.width * n.devicePixelRatio)),
                            null != (o = this.fxaa) && null != (a = o.uniforms.resolution) && (a.value.y = 1 / (e.height * n.devicePixelRatio)),
                            this.renderer.setSize(e.width, e.height),
                            this.composer.setSize(e.width, e.height)
                    },
                    t.prototype.render = function (e) {
                        return this.skyboxLoaded ? (this.destroyed || (this.raycaster.setFromCamera(this.mousePickingPosition, this.camera),
                                this.camera.lookAt(this.cameraLookAt),
                                this.renderer.render(this.scene, this.camera)),
                            !this.destroyed) : !this.destroyed
                    },
                    t.prototype.moveCamera = function () {
                        var e;
                        return this.state === t.STATE_IDLE && this.isMouseDown && (this.phiTheta.x = this.phiThetaDownPosition.x + (this.mouseDownPosition.x - this.mousePosition.x) / (n.innerWidth / this.mouseSensitivity),
                                this.phiTheta.y = this.phiThetaDownPosition.y + (this.mouseDownPosition.y - this.mousePosition.y) / (n.innerHeight / this.mouseSensitivity),
                                this.phiTheta.y = Math.max(-.8, Math.min(.8, this.phiTheta.y))),
                            isNaN(this.phiTheta.x) && (this.phiTheta.x = 0),
                            isNaN(this.phiTheta.y) && (this.phiTheta.y = 0),
                            this.phiTheta.y = this.clamp(this.phiTheta.y, -Math.PI / 2 + .001, Math.PI / 2 - .001),
                            Math.abs(null != (e = this.initialPhiTheta) ? e.distanceTo(this.phiTheta) : void 0) > .2 && !this.$scope.main.firstDragged && (this.$scope.main.firstDragged = !0,
                                this.$scope.$apply(),
                                console.log("first dragged"),
                                this.$scope.main.playSound("generic_transition"),
                                this.state === t.STATE_IDLE && this.gotoIdleState()),
                            this.getCartesianCoordinates(this.camera.position, this.cameraRadius.value, this.phiTheta.value.x, this.phiTheta.value.y),
                            !this.destroyed
                    },
                    t.prototype.clamp = function (e, t, n) {
                        return Math.max(t, Math.min(n, e))
                    },
                    t.prototype.absmod = function (e, t) {
                        return (e % t + t) % t
                    },
                    t.prototype.onMouseDown = function (e) {
                        this.isMouseDown = !0,
                            this.mousePosition.x = e.clientX,
                            this.mousePosition.y = e.clientY,
                            this.mouseDownPosition.copy(this.mousePosition),
                            this.phiThetaDownPosition.copy(this.phiTheta),
                            this.mousePickingPosition.x = e.clientX / n.innerWidth * 2 - 1,
                            this.mousePickingPosition.y = 2 * -(e.clientY / n.innerHeight) + 1
                    },
                    t.prototype.onMouseMove = function (e) {
                        this.mousePosition.x = e.clientX,
                            this.mousePosition.y = e.clientY,
                            this.mousePickingPosition.x = e.clientX / n.innerWidth * 2 - 1,
                            this.mousePickingPosition.y = 2 * -(e.clientY / n.innerHeight) + 1,
                            this.sceneMouseRotation.target = Math.PI + .05 * this.mousePickingPosition.x
                    },
                    t.prototype.onMouseWheel = function (e, n, i, o) {
                        this.state === t.STATE_IDLE && (this.cameraRadius.target += Math.min(1, Math.max(-1, e.originalEvent.deltaY)) * this.mouseWheelSensitivity,
                            this.cameraRadius.target = Math.min(this.maxRadius, Math.max(this.minRadius, this.cameraRadius.target)))
                    },
                    t.prototype.onMouseUp = function (e) {
                        this.isMouseDown = !1,
                            this.mousePickingPosition.x = e.clientX / n.innerWidth * 2 - 1,
                            this.mousePickingPosition.y = 2 * -(e.clientY / n.innerHeight) + 1
                    },
                    t.prototype.onTouchStart = function (e) {
                        null != e.touches[0] && (this.isMouseDown = !0,
                            this.mousePosition.x = e.touches[0].clientX,
                            this.mousePosition.y = e.touches[0].clientY,
                            this.mouseDownPosition.copy(this.mousePosition),
                            this.phiThetaDownPosition.copy(this.phiTheta),
                            this.mousePickingPosition.x = e.touches[0].clientX / n.innerWidth * 2 - 1,
                            this.mousePickingPosition.y = 2 * -(e.touches[0].clientY / n.innerHeight) + 1)
                    },
                    t.prototype.onTouchMove = function (e) {
                        null != e.touches[0] && (this.mousePosition.x = e.touches[0].clientX,
                            this.mousePosition.y = e.touches[0].clientY,
                            this.hasParentClass(e.target, "allow-scroll") || e.preventDefault(),
                            this.mousePickingPosition.x = e.touches[0].clientX / n.innerWidth * 2 - 1,
                            this.mousePickingPosition.y = 2 * -(e.touches[0].clientY / n.innerHeight) + 1)
                    },
                    t.prototype.hasParentClass = function (e, t) {
                        return -1 !== e.className.indexOf(t) ? !0 : null != e.parentElement ? this.hasParentClass(e.parentElement, t) : !1
                    },
                    t.prototype.onTouchEnd = function (e) {
                        null != e.touches[0] && (this.isMouseDown = !1,
                            this.mousePickingPosition.x = e.touches[0].clientX / n.innerWidth * 2 - 1,
                            this.mousePickingPosition.y = 2 * -(e.touches[0].clientY / n.innerHeight) + 1)
                    },
                    t
            }()
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("scene3d", function () {
            "ngInject";
            var e, t;
            return e = ["threeJsScene", "$scope", function (e, t) {
                    this.scene = new e(t)
                }],
                t = {
                    restrict: "E",
                    templateUrl: "app/components/scene-3d/scene-3d.html",
                    controller: e,
                    controllerAs: "scene3d",
                    replace: !0,
                    link: function (e, t) {
                        return e.element = t[0]
                    }
                }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("scene2d", ["$window", "$timeout", "$state", function (e, t, n) {
            "ngInject";
            var i, o;
            return i = ["$scope", "$rootScope", function (i, o) {
                    var a, s, r, l;
                    for (i.main.loadingProgress = 2,
                        i.main.uiPins = [],
                        this.focusingObject = null,
                        this.onStateChange = function (e) {
                            return function (i, o, a, s, r) {
                                switch (console.log("threejsScene received", o.name),
                                    o.name) {
                                    case "home.product":
                                        e.focusingObject !== a.producturl && (null != i && i.preventDefault(),
                                            n.go("home.transition", a),
                                            t(function () {
                                                return e.focusingObject = a.producturl,
                                                    n.go(o, a)
                                            }, 5e3));
                                        break;
                                    default:
                                        e.focusingObject = null
                                }
                            }
                        }(this),
                        this.removeStateChangeListener = o.$on("$stateChangeStart", this.onStateChange),
                        l = i.main.config.products,
                        a = 0,
                        s = l.length; s > a; a++)
                        r = l[a],
                        i.main.uiPins.push({
                            id: r.id,
                            visible: !0,
                            x: e.innerWidth * r.fallback_position[0],
                            y: e.innerHeight * r.fallback_position[1]
                        });
                    this.onResize = function (t, n) {
                            var o, a, s, r, l, c, u, d, p, h, m, g;
                            for (t = 2280,
                                n = 2880,
                                o = t / n,
                                r = n / t,
                                h = e.innerWidth / e.innerHeight,
                                s = Math.min(e.innerWidth, e.innerHeight * o),
                                a = Math.min(e.innerHeight, e.innerWidth * r),
                                m = (e.innerWidth - s) / 2,
                                g = (e.innerHeight - a) / 2,
                                p = i.main.uiPins,
                                l = 0,
                                c = p.length; c > l; l++)
                                u = p[l],
                                d = _.find(i.main.config.products, {
                                    id: u.id
                                }),
                                u.x = m + s * d.fallback_position[0],
                                u.y = g + a * d.fallback_position[1]
                        },
                        this.removeLoadingListener = i.$watch("main.loading", function (e) {
                            return function (t) {
                                return t ? void 0 : e.removeLoadingListener()
                            }
                        }(this))
                }],
                o = {
                    restrict: "E",
                    templateUrl: "app/components/scene-2d/scene-2d.html",
                    controller: i,
                    controllerAs: "scene2d",
                    replace: !0
                }
        }])
    }
    .call(this),
    function () {
        var e = function (e, t) {
            return function () {
                return e.apply(t, arguments)
            }
        };
        angular.module("aquestCampoLeComete").factory("pulseCircleStandalone", function () {
            "ngInject";
            var t;
            return t = function () {
                function t(t) {
                    var n, i, o, a, s;
                    for (this.params = t,
                        this.render = e(this.render, this),
                        this.tweenLoop = e(this.tweenLoop, this),
                        this.size = this.params.size || 64,
                        this.domElement = this.params.canvas || document.createElement("canvas"),
                        this.speed = this.params.speed || 12,
                        this.colors = this.params.colors || ["rgba(1, 255, 156, 1)", "rgba(0, 147, 88, 0.0)"],
                        this.ctx = this.domElement.getContext("2d"),
                        a = 10,
                        this.circles = [],
                        i = o = 0,
                        s = a; s > o; i = o += 1)
                        n = {
                            radius: 0,
                            alpha: 1,
                            color: this.colors[0]
                        },
                        this.circles.push(n),
                        this.tweenLoop(n, this.speed * i * .1)
                }
                return t.prototype.size = 64,
                    t.prototype.domElement = null,
                    t.prototype.circles = null,
                    t.prototype.colors = null,
                    t.prototype.ctx = null,
                    t.prototype.speed = 1,
                    t.prototype.destroyed = !1,
                    t.prototype.tweenLoop = function (e, t) {
                        this.destroyed || TweenMax.to(e, this.speed, {
                            radius: 1,
                            delay: t,
                            alpha: 0,
                            ease: Power4.easeOut,
                            colorProps: {
                                color: this.colors[1]
                            },
                            onComplete: function (t) {
                                return function () {
                                    return e.radius = 0,
                                        e.alpha = 1,
                                        e.color = t.colors[0],
                                        t.tweenLoop(e, 0)
                                }
                            }(this)
                        })
                    },
                    t.prototype.render = function (e) {
                        var t, n, i, o, a, s, r, l;
                        for (l = this.size,
                            this.domElement.width !== l && (this.domElement.width = l,
                                this.domElement.height = l),
                            this.ctx.clearRect(0, 0, l, l),
                            t = l / 2,
                            s = .5 * l,
                            this.circles.sort(function (e, t) {
                                return e.alpha > t.alpha
                            }),
                            r = this.circles,
                            i = o = 0,
                            a = r.length; a > o; i = ++o)
                            n = r[i],
                            n.radius > 0 && n.alpha > .01 && (this.ctx.fillStyle = n.color,
                                this.ctx.beginPath(),
                                this.ctx.arc(t, t, s * n.radius, 0, 2 * Math.PI, !1),
                                this.ctx.fill(),
                                this.ctx.closePath());
                        return !this.destroyed
                    },
                    t
            }()
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("pulseCircle", ["pulseCircleStandalone", function (e) {
            "ngInject";
            var t, n;
            return t = ["$scope", function (t) {
                    this.destroyed = !1,
                        t.$watch("element", function (n) {
                            return function () {
                                var i;
                                n.circle = new e({
                                        canvas: t.element,
                                        size: t.size,
                                        colors: t.colors,
                                        speed: t.speed
                                    }),
                                    i = "pulseCircleUpdate-" + t.id,
                                    t.sceneUpdate && (i = "sceneUpdate-" + i),
                                    t.main.addSubRoutine(i, function (e) {
                                        return t.active && n.circle.render(e),
                                            !n.destroyed
                                    })
                            }
                        }(this)),
                        t.$watch("size", function (e) {
                            return function (t) {
                                null != t && (e.circle.size = t)
                            }
                        }(this)),
                        t.$watch("speed", function (e) {
                            return function (t) {
                                null != t && (e.circle.speed = t)
                            }
                        }(this)),
                        t.$watch("colors", function (e) {
                            return function (t) {
                                null != t && (e.circle.colors = t)
                            }
                        }(this)),
                        t.$on("$destroy", function (e) {
                            return function (t) {
                                var n;
                                e.destroyed = !0,
                                    null != (n = e.circle) && (n.destroyed = !0)
                            }
                        }(this))
                }],
                n = {
                    restrict: "E",
                    templateUrl: "app/components/pulse-circle/pulse-circle.html",
                    controller: t,
                    controllerAs: "pulsecircle",
                    replace: !0,
                    scope: {
                        size: "=",
                        speed: "=",
                        colors: "=",
                        id: "=",
                        main: "=",
                        active: "=",
                        sceneUpdate: "="
                    },
                    link: function (e, t) {
                        return e.element = t[0]
                    }
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("pulseCircleCss", ["TweenMax", function (e) {
            "ngInject";
            var t, n;
            return t = ["$scope", function (e) {}],
                n = {
                    restrict: "E",
                    templateUrl: "app/components/pulse-circle/pulse-circle-css.html",
                    controller: t,
                    controllerAs: "pulsecircle",
                    replace: !0,
                    link: function (e, t) {
                        return e.element = t[0]
                    }
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("productCircle", function () {
            "ngInject";
            var e, t;
            return e = ["$scope", function (e) {
                    this.open = !1,
                        this.close = !1,
                        this.id = "",
                        e.$watch("isOpen", function (e) {
                            return function (t) {
                                return e.open = t
                            }
                        }(this)),
                        e.$watch("isClose", function (e) {
                            return function (t) {
                                return e.close = t
                            }
                        }(this)),
                        e.$watch("id", function (e) {
                            return function (t) {
                                return e.id = "product-circle-pulse-" + t
                            }
                        }(this))
                }],
                t = {
                    restrict: "E",
                    templateUrl: "app/components/product-circle/product-circle.html",
                    controller: e,
                    controllerAs: "productcircle",
                    replace: !0,
                    scope: {
                        locale: "=",
                        isOpen: "=",
                        isClose: "=",
                        main: "=",
                        id: "="
                    }
                }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("pinLabel", function () {
            "ngInject";
            var e, t;
            return e = ["$scope", function (e) {
                    e.$watch("main.overPin.position", function (t) {
                            return function () {
                                return t.style = {
                                    transform: "translate(" + e.main.overPin.position.x + "px," + (e.main.overPin.position.y - 120) + "px)"
                                }
                            }
                        }(this)),
                        e.$watch("main.overPin.productid", function (t) {
                            return function () {
                                var n;
                                return t.label = null != (n = e.main.locale[e.main.overPin.productid]) ? n.label : void 0
                            }
                        }(this))
                }],
                t = {
                    restrict: "E",
                    templateUrl: "app/components/pin-label/pin-label.html",
                    controller: e,
                    controllerAs: "pinlabel",
                    replace: !0
                }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("pin2d", ["TweenMax", "$window", "Modernizr", "$timeout", "$state", function (e, t, n, i, o) {
            "ngInject";
            var a, s;
            return a = ["$scope", "$rootScope", function (a, s) {
                    this.zoomX = 0,
                        this.zoomY = 0,
                        this.style = {},
                        this.info = {},
                        this.pinSize = 64,
                        this.pinSpeed = 9,
                        this.state = "idle",
                        this.labelopened = !1,
                        this.visible = !0,
                        this.destroyed = !1,
                        this.loadingImageURL = a.main.locale[a.id].loading_image,
                        this.loadingInfo = a.main.locale[a.id].loading_info,
                        this.productURL = _.find(a.main.config.products, {
                            id: a.id
                        }).url,
                        this.soundID = _.find(a.main.config.products, {
                            id: a.id
                        }).sound,
                        this.onMouseOver = function (t) {
                            return function (n) {
                                "idle" === t.state && (a.main.playSound(t.soundID),
                                    e.to(t, .5, {
                                        pinSize: 100
                                    }))
                            }
                        }(this),
                        this.onMouseOut = function (t) {
                            return function (n) {
                                "idle" === t.state && e.to(t, .5, {
                                    pinSize: 64
                                })
                            }
                        }(this),
                        this.getLink = function () {
                            var e;
                            return e = _.find(a.main.config.products, {
                                    id: a.id
                                }).url,
                                "home.product({producturl:'" + e + "'})"
                        },
                        this.updateInfo = function (e) {
                            return function (t) {
                                e.info = a.main.locale[t]
                            }
                        }(this),
                        this.updateStyle = function (e) {
                            return function () {
                                switch (e.state) {
                                    case "idle":
                                        a.alwaysVisible ? a.main.loading ? e.visible = !1 : "home" === o.current.name ? e.visible = !0 : e.visible = "zoom" === e.state || "showinfo" === e.state : e.visible = a.main.overPin.over && a.main.overPin.productid === a.id,
                                            e.applyTransform(a.x, a.y);
                                        break;
                                    case "zoom":
                                        e.visible = !0,
                                            e.applyTransform(e.zoomX, e.zoomY)
                                }
                            }
                        }(this),
                        this.applyTransform = function (e) {
                            return function (t, i) {
                                n.cssanimations ? e.style.transform = e.style.MsTransform = e.style.MozTransform = e.style.WebkitTransform = "translate3d(" + t + "px," + i + "px,0)" : (e.style.left = t + "px",
                                    e.style.top = i + "px")
                            }
                        }(this),
                        this.removeListener5 = a.$watch("id", this.updateInfo),
                        this.removeListener6 = a.$on("$destroy", function (e) {
                            return function () {
                                e.destroyed = !0,
                                    e.removeStateChangeListener(),
                                    e.removeListener5(),
                                    e.removeListener6()
                            }
                        }(this)),
                        a.main.addSubRoutine("sceneUpdate-pinScopeApply-" + a.id, function (e) {
                            return function (t) {
                                var n;
                                return n = e.visible,
                                    e.updateStyle(),
                                    (n || e.visible) && a.$apply(),
                                    !e.destroyed
                            }
                        }(this)),
                        this.removeStateChangeListener = s.$on("$stateChangeSuccess", function (n) {
                            return function (o, s, r, l, c) {
                                var u, d;
                                if (u = _.find(a.main.config.products, {
                                        id: a.id
                                    }),
                                    d = u.url,
                                    r.producturl === d)
                                    switch (s.name) {
                                        case "home.transition":
                                            a.main.playSound("click"),
                                                n.state = "zoom",
                                                i(function () {
                                                    var i, o;
                                                    if (n.labelopened = !0,
                                                        n.zoomX = a.x,
                                                        n.zoomY = a.y,
                                                        a.alwaysVisible,
                                                        o = 5,
                                                        i = 0,
                                                        a.main.platform.desktop)
                                                        switch (u.focus_position) {
                                                            case "left":
                                                                i = t.innerWidth / 3;
                                                                break;
                                                            case "center":
                                                                i = t.innerWidth / 2;
                                                                break;
                                                            case "right":
                                                                i = t.innerWidth / 1.5
                                                        }
                                                    else
                                                        i = t.innerWidth / 2;
                                                    return e.to(n, o, {
                                                        zoomX: i,
                                                        zoomY: t.innerHeight / 2,
                                                        pinSize: 402,
                                                        delay: 0,
                                                        ease: Power4.easeInOut
                                                    })
                                                }, 0);
                                            break;
                                        case "home.product":
                                            n.state = "showinfo",
                                                e.to(n, .5, {
                                                    zoomX: t.innerWidth / 3,
                                                    zoomY: t.innerHeight / 2,
                                                    ease: Power4.easeInOut
                                                })
                                    }
                                else
                                    e.killTweensOf(n),
                                    n.state = "idle",
                                    n.labelopened = !1,
                                    e.to(n, .5, {
                                        pinSize: 64
                                    })
                            }
                        }(this))
                }],
                s = {
                    restrict: "E",
                    templateUrl: "app/components/pin-2d/pin-2d.html",
                    controller: a,
                    controllerAs: "pin2d",
                    replace: !0,
                    scope: {
                        x: "=",
                        y: "=",
                        id: "=",
                        isVisible: "=",
                        main: "=",
                        alwaysVisible: "="
                    }
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("pageParticles", ["$state", "$window", "Detector", "particleShader", "elasticNumber", function (e, t, n, i, o) {
            "ngInject";
            var a, s;
            return a = ["$scope", function (e) {
                    var a;
                    a = 250,
                        this.initialScale = 10,
                        this.concentricsParticles = [],
                        this.webgl = n.webgl,
                        this.cameraX = new o(0),
                        this.cameraX.speed = 1,
                        this.cameraAmplitude = 200,
                        this.particleProgram = function (e) {
                            e.beginPath(),
                                e.arc(0, 0, .2, 0, 2 * Math.PI),
                                e.fill()
                        },
                        e.onMouseMove = function (e) {
                            return function (n) {
                                var i, o;
                                i = n.clientX / t.innerWidth * 2 - 1,
                                    o = 2 * -(n.clientY / t.innerHeight) + 1,
                                    e.cameraX.target = i * e.cameraAmplitude
                            }
                        }(this),
                        this.render = function (t) {
                            return function (n) {
                                var i, o, a, s, r;
                                if (t.webgl)
                                    t.material.uniforms.time.value += n;
                                else
                                    for (r = t.concentricsParticles,
                                        o = a = 0,
                                        s = r.length; s > a; o = ++a)
                                        i = r[o],
                                        i.particle.position.x = i.originX + Math.sin(o + i.angle) * i.orbit,
                                        i.particle.position.y = i.originY + Math.cos(o + i.angle) * i.orbit,
                                        i.particle.scale.x = i.particle.scale.y = 1 + Math.sin(.5 * i.angle) * t.initialScale,
                                        i.angle += i.speed * n;
                                return e.main.platform.desktop || (t.cameraX.target = Math.max(-1, Math.min(1, e.main.orientationY / 10)) * t.cameraAmplitude),
                                    t.cameraX.update(n),
                                    t.camera.position.x = t.cameraX.value,
                                    t.renderer.render(t.scene, t.camera),
                                    !t.destroyed
                            }
                        }(this),
                        this.setBackgroundColor = function (e) {},
                        this.onResize = function (e) {
                            return function (t) {
                                e.camera.aspect = t.width / t.height,
                                    e.camera.updateProjectionMatrix(),
                                    e.renderer.setSize(t.width, t.height)
                            }
                        }(this),
                        this.setParticlesColor = function (e) {
                            return function (t) {
                                e.webgl ? e.material.uniforms.color.value.set(t) : e.material.color.set(t)
                            }
                        }(this),
                        this.destroy = function (e) {
                            return function (t) {
                                e.destroyed = !0,
                                    e.removeBackgroundColorListener(),
                                    e.removeColorListener(),
                                    e.removeDestroyListener(),
                                    e.removeOnInitListener(),
                                    e.webgl && (e.renderer.dispose(),
                                        e.material.program.destroy(),
                                        e.material.uniforms.map.value.dispose(),
                                        e.geometry.dispose())
                            }
                        }(this),
                        this.init = function (n) {
                            return function () {
                                var o, s, r, l, c, u, d, p, h, m, g, f, v;
                                if (n.removeOnInitListener(),
                                    n.camera = new THREE.PerspectiveCamera(50, t.innerWidth / t.innerHeight, 1, 5e3),
                                    n.scene = new THREE.Scene,
                                    n.scene.add(n.camera),
                                    n.webgl ? n.renderer = new THREE.WebGLRenderer({
                                        canvas: e.element,
                                        alpha: !0
                                    }) : n.renderer = new THREE.CanvasRenderer({
                                        canvas: e.element,
                                        alpha: !0
                                    }),
                                    n.renderer.setClearColor(0, 0),
                                    n.renderer.setPixelRatio(t.devicePixelRatio),
                                    n.renderer.setSize(t.innerWidth, t.innerHeight),
                                    n.container = new THREE.Object3D,
                                    n.scene.add(n.container),
                                    n.webgl) {
                                    for (v = new THREE.TextureLoader,
                                        f = v.load("assets/models/particle1.png"),
                                        n.material = new THREE.ShaderMaterial({
                                            uniforms: THREE.UniformsUtils.clone(i.uniforms),
                                            vertexShader: i.vertexShader,
                                            fragmentShader: i.fragmentShader,
                                            transparent: !0
                                        }),
                                        n.material.uniforms.map.value = f,
                                        n.material.uniforms.size.value = n.initialScale,
                                        n.geometry = new THREE.BufferGeometry,
                                        p = new Float32Array(3 * a),
                                        h = new Float32Array(a),
                                        l = new Float32Array(a),
                                        c = new Float32Array(a),
                                        o = s = 0,
                                        m = a; m >= 0 ? m > s : s > m; o = m >= 0 ? ++s : --s)
                                        d = 3 * o,
                                        p[d] = 4e3 * Math.random() - 2e3,
                                        p[d + 1] = 4e3 * Math.random() - 2e3,
                                        p[d + 2] = -1e3 - 3e3 * Math.random(),
                                        h[o] = 2 + 2 * Math.random(),
                                        l[o] = 15 + 25 * Math.random(),
                                        c[o] = -4 + 8 * Math.random();
                                    n.geometry.addAttribute("position", new THREE.BufferAttribute(p, 3)),
                                        n.geometry.addAttribute("pulseSpeed", new THREE.BufferAttribute(h, 1)),
                                        n.geometry.addAttribute("orbitSize", new THREE.BufferAttribute(l, 1)),
                                        n.geometry.addAttribute("orbitSpeed", new THREE.BufferAttribute(c, 1)),
                                        a = new THREE.Points(n.geometry, n.material),
                                        n.container.add(a)
                                } else
                                    for (n.material = new THREE.SpriteCanvasMaterial({
                                            color: 11538125,
                                            program: n.particleProgram
                                        }),
                                        o = r = 0,
                                        g = a; g > r; o = r += 1)
                                        u = new THREE.Sprite(n.material),
                                        u.position.x = 4e3 * Math.random() - 2e3,
                                        u.position.y = 4e3 * Math.random() - 2e3,
                                        u.position.z = -1e3 - 3e3 * Math.random(),
                                        u.scale.x = u.scale.y = n.initialScale,
                                        n.concentricsParticles.push({
                                            originX: u.position.x,
                                            originY: u.position.y,
                                            angle: 0,
                                            speed: 2 + 2 * Math.random(),
                                            particle: u,
                                            orbit: 15 + 25 * Math.random()
                                        }),
                                        n.container.add(u);
                                e.main.addSubRoutine("pageParticlesUpdate", n.render)
                            }
                        }(this),
                        this.removeOnInitListener = e.$watch("element", this.init),
                        this.removeBackgroundColorListener = e.$watch("backgroundColor", this.setBackgroundColor),
                        this.removeColorListener = e.$watch("color", this.setParticlesColor),
                        this.removeDestroyListener = e.$on("$destroy", this.destroy)
                }],
                s = {
                    restrict: "E",
                    templateUrl: "app/components/page-particles/page-particles.html",
                    controller: a,
                    controllerAs: "pageparticles",
                    replace: !0,
                    scope: {
                        color: "=",
                        backgroundColor: "=",
                        main: "=",
                        onMouseMove: "="
                    },
                    link: function (e, t) {
                        return e.element = t[0]
                    }
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("loadingIndicator", ["$timeout", "$interval", function (e, t) {
            "ngInject";
            var n, i;
            return n = ["$scope", "$state", function (n, i) {
                    var o;
                    this.totalSteps = 3,
                        this.step = -1,
                        this.internalStep = 0,
                        this.loadingStep = 0,
                        this.stepTime = (new Date).getTime(),
                        this.minSecondsPerStep = 4e3,
                        e(function (e) {
                            return function () {
                                return e.stepTime = (new Date).getTime(),
                                    e.step = e.internalStep,
                                    n.main.loadingStarted = !0
                            }
                        }(this), 2e3),
                        n.$watch("main.loadingProgress", function (e) {
                            return function () {
                                return e.loadingStep = Math.floor(n.main.loadingProgress * e.totalSteps)
                            }
                        }(this)),
                        o = t(function (a) {
                            return function () {
                                var s;
                                return s = (new Date).getTime(),
                                    a.loadingStep > a.internalStep && s - a.stepTime > a.minSecondsPerStep && a.internalStep < a.totalSteps - 1 && (a.stepTime = s,
                                        a.internalStep++,
                                        a.step = -1,
                                        e(function () {
                                            return a.step = a.internalStep
                                        }, 500)),
                                    2 === n.main.loadingProgress && a.internalStep === a.totalSteps - 1 && s - a.stepTime > a.minSecondsPerStep ? (t.cancel(o),
                                        n.main.loading = !1,
                                        e(function () {
                                            n.main.checkViewVisibility(i.current)
                                        }, 1e3)) : void 0
                            }
                        }(this), 100)
                }],
                i = {
                    restrict: "E",
                    templateUrl: "app/components/loading-indicator/loading-indicator.html",
                    controller: n,
                    controllerAs: "loadingindicator",
                    replace: !0
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("languageSelector", ["$state", function (e) {
            "ngInject";
            var t, n;
            return t = ["$scope", function (t) {
                    this.currentState = e.current
                }],
                n = {
                    restrict: "E",
                    templateUrl: "app/components/language-selector/language-selector.html",
                    controller: t,
                    controllerAs: "languageselector",
                    replace: !0
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("hamburgerMenu", ["$state", function (e) {
            "ngInject";
            var t, n;
            return t = ["$scope", "$state", "$rootScope", function (e, t, n) {
                    this.button_label = e.main.locale.menu,
                        this.open = !1,
                        this.clicked = !1,
                        e.$watch("main.menuOpen", function (n) {
                            return function (i) {
                                e.main.loading || (console.log(t.current.name),
                                    ("home" === t.current.name || "home.transition" === t.current.name) && (n.button_label = i ? e.main.locale.close : e.main.locale.menu,
                                        n.open = i,
                                        n.clicked = i))
                            }
                        }(this)),
                        this.onStateChange = function (t) {
                            return function (n, i, o, a, s) {
                                "home" !== i.name && "home.transition" !== i.name ? (t.open = !0,
                                    t.clicked = !1,
                                    t.button_label = e.main.locale.close) : (t.open = !1,
                                    t.clicked = !1,
                                    t.button_label = e.main.locale.menu)
                            }
                        }(this),
                        n.$on("$stateChangeSuccess", this.onStateChange),
                        this.onStateChange(null, t.current),
                        this.toggleOpen = function (n) {
                            return function () {
                                "home" === t.current.name || "home.transition" === t.current.name ? (e.main.menuOpen = !e.main.menuOpen,
                                    e.main.menuOpen ? e.main.playSound("generic_transition") : e.main.playSound("click")) : (e.main.playSound("click"),
                                    n.open = !1,
                                    n.clicked = !1,
                                    n.button_label = e.main.locale.menu,
                                    t.go("home"))
                            }
                        }(this)
                }],
                n = {
                    restrict: "E",
                    templateUrl: "app/components/hamburger-menu/hamburger-menu.html",
                    controller: t,
                    controllerAs: "hamburgermenu",
                    replace: !0
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("footer", function () {
            "ngInject";
            var e, t;
            return e = ["$scope", "$document", "$window", function (e, t, n) {
                    this.open = !1,
                        this.button_label = e.main.locale.info,
                        this.onElementClick = function (t) {
                            return function () {
                                t.toggleFooter(),
                                    e.main.menuOpen = !1
                            }
                        }(this),
                        this.toggleFooter = function (t) {
                            return function () {
                                t.open = !t.open,
                                    t.button_label = t.open ? e.main.locale.close : e.main.locale.info,
                                    e.main.playSound("click")
                            }
                        }(this),
                        this.isFooter = function (e) {
                            return function (t) {
                                return null != t.className && -1 !== t.className.split(" ").indexOf("footer") ? !0 : null != t.parentNode ? e.isFooter(t.parentNode) : !1
                            }
                        }(this),
                        this.closeFooter = function (t) {
                            return function (n) {
                                return t.isFooter(n.target) ? void 0 : (t.open = !1,
                                    t.button_label = e.main.locale.info,
                                    e.$apply())
                            }
                        }(this),
                        n.addEventListener("mouseup", this.closeFooter),
                        n.addEventListener("touchend", this.closeFooter)
                }],
                t = {
                    restrict: "E",
                    templateUrl: "app/components/footer/footer.html",
                    controller: e,
                    controllerAs: "footer",
                    replace: !0
                }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").directive("dragToDiscover", function () {
            "ngInject";
            var e, t;
            return e = ["$scope", function (e) {}],
                t = {
                    restrict: "E",
                    templateUrl: "app/components/drag-to-discover/drag-to-discover.html",
                    controller: e,
                    controllerAs: "dragtodiscover",
                    replace: !0
                }
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("WineExperienceController", ["$scope", "$timeout", "md", function (e, t, n) {
            "ngInject";
            e.main.playSound("generic_transition")
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("ShareController", ["$location", "$window", "$scope", "$stateParams", function (e, t, n, i) {
            "ngInject";
            n.main.playSound("generic_transition"),
                this.locale = i.language,
                this.url = encodeURIComponent(e.protocol() + "://" + e.host() + "/share." + this.locale + ".html"),
                this.twitterText = n.main.locale.share_page.twitter_text,
                this.getFBLink = function (e) {
                    return function () {
                        return "https://facebook.com/sharer.php?u=" + e.url
                    }
                }(this),
                this.getTWLink = function (e) {
                    return function () {
                        return "https://twitter.com/intent/tweet?url=" + e.url + "&text=" + e.twitterText
                    }
                }(this),
                this.getGLink = function (e) {
                    return function () {
                        return "https://plus.google.com/share?url=" + e.url
                    }
                }(this),
                this.openWindow = function (e) {
                    t.open(e, "_blank", "width=640,height=400,status=no,toolbar=no,titlebar=no")
                }
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").provider("language", function () {
            "ngInject";
            this.path = "/assets/locale/",
                this.userLanguage = "en",
                this.$get = function (e) {
                    return ["$http", "$state", "$log", "$cookies", function (t, n, i, o) {
                        return function (a, s) {
                            var r, l, c;
                            return l = _.find(s.locales, {
                                    code: a
                                }),
                                null == l ? (r = _.find(s.locales, {
                                        code: o["campo-le-comete-language"]
                                    }),
                                    null != r ? a = r.code : (c = _.find(s.locales, {
                                            code: e.userLanguage
                                        }),
                                        a = null != c ? c.code : _.find(s.locales, {
                                            "default": !0
                                        }).code),
                                    void n.go("home", {
                                        language: a
                                    })) : t({
                                    method: "GET",
                                    url: e.path + a + ".json"
                                }).then(function (e) {
                                    return e.data
                                }, function (e) {
                                    return i.error("Language Load Error")
                                })
                        }
                    }]
                }(this)
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").provider("config", function () {
            "ngInject";
            this.path = "/assets/config.json",
                this.$get = function (e) {
                    return ["$http", "$state", function (t, n) {
                        return t({
                            method: "GET",
                            url: e.path
                        }).then(function (e) {
                            return e.data
                        })
                    }]
                }(this)
        })
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("ProductController", ["$timeout", "$scope", "$stateParams", "md", "language", "config", function (e, t, n, i, o, a) {
            "ngInject";
            var s;
            s = _.find(a.products, {
                    url: n.producturl
                }),
                this.locale = o[s.id],
                this.state = "loading",
                this.destroyed = !1,
                this.page_style = {},
                this.removeDestroyListener = t.$on("$destroy", function (e) {
                    return function () {
                        e.destroyed = !0,
                            e.removeDestroyListener()
                    }
                }(this)),
                e(function (n) {
                    return function () {
                        return n.destroyed ? void 0 : (n.state = "loaded",
                            n.page_style = {
                                "background-color": n.locale.page_color
                            },
                            e(function () {
                                return t.main.playSound("generic_transition")
                            }, 800))
                    }
                }(this), 2e3)
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("PrivacyController", ["$scope", "$timeout", "md", function (e, t, n) {
            "ngInject";
            e.main.playSound("generic_transition")
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("MainController", ["$log", "$timeout", "md", "$stateParams", "$state", "language", "config", "$rootScope", "$location", "$scope", "$document", "Modernizr", "$window", "FULLTILT", function (e, t, n, i, o, a, s, r, l, c, u, d, p, h) {
            "ngInject";
            var m, g, f;
            this.locale = a,
                this.config = s,
                this.loading = !0,
                this.showSubPage = !1,
                this.viewVisible = !1,
                this.loadingProgress = 0,
                this.menuOpen = !1,
                this.uiPins = [],
                this.sceneUpdate = !0,
                this.orientationX = 0,
                this.orientationY = 0,
                this.firstDragged = !0,
                this.css3dSettings = {
                    tx: 25,
                    rx: 5,
                    ry: 10
                },
                this.overPin = {
                    position: {
                        x: 0,
                        y: 0
                    },
                    productid: !1,
                    over: !1
                },
                r.site_title = this.locale.site_title,
                r.site_description = this.locale.site_description,
                r.site_keywords = this.locale.site_keywords,
                r.site_share_image = this.locale.site_share_image,
                this.info = {
                    version: "1.0.2",
                    date: moment(1529415613866).fromNow(),
                    ci_build: !0,
                    ci_commit: "01f92b22ae4d3395b27e51d98ff54590c5fc6a55",
                    ci_author: "neri@mono-grid.com",
                    ci_branch: "production"
                },
                this.platform = {
                    development: !1,
                    desktop: !n.mobile() && !n.phone() && !n.tablet(),
                    mobile: null != n.mobile(),
                    phone: null != n.phone(),
                    tablet: null != n.tablet(),
                    edge: !!/Edge\/\d+/i.test(navigator.userAgent),
                    safari: n.is("Safari"),
                    osx: (null != (g = navigator.platform) ? g.toUpperCase().indexOf("MAC") : void 0) >= 0,
                    ios: "iOS" === n.os()
                },
                this.muted = this.platform.desktop ? !1 : !0,
                this.subRoutines = [],
                this.subRoutinesNames = [],
                this.lastTime = (new Date).getTime(),
                this.sounds = {},
                this.onAllSoundsLoaded = function (e) {
                    this.playSound("theme", -1, .06)
                },
                this.playSound = function (e) {
                    return function (t, n, i) {
                        null == n && (n = 0),
                            null == i && (i = 1),
                            null != e.sounds[t] && (e.sounds[t].stop(),
                                delete e.sounds[t]),
                            e.sounds[t] = createjs.Sound.play(t, null, 0, 0, n, e.muted ? 0 : i),
                            e.sounds[t].soundID = t,
                            e.sounds[t].defaultVolume = i,
                            e.sounds[t].on("complete", e.onSoundfinished, e)
                    }
                }(this),
                this.onSoundfinished = function (e) {
                    return function (t) {
                        var n;
                        n = t.target.soundID,
                            null != e.sounds[n] && (e.sounds[n].stop(),
                                delete e.sounds[n])
                    }
                }(this),
                c.$watch("main.muted", function (e) {
                    return function (t) {
                        var n;
                        if (t)
                            for (n in e.sounds)
                                TweenMax.to(e.sounds[n], 1, {
                                    volume: 0
                                });
                        else
                            for (n in e.sounds)
                                TweenMax.to(e.sounds[n], 1, {
                                    volume: e.sounds[n].defaultVolume
                                })
                    }
                }(this)),
                createjs.Sound.alternateExtensions = ["mp3"],
                createjs.Sound.on("fileload", this.onAllSoundsLoaded, this),
                createjs.Sound.registerSound("assets/sounds/theme.ogg", "theme"),
                createjs.Sound.registerSound("assets/sounds/click.ogg", "click"),
                createjs.Sound.registerSound("assets/sounds/generic_transition.ogg", "generic_transition"),
                createjs.Sound.registerSound("assets/sounds/hover_menu.ogg", "hover_menu"),
                createjs.Sound.registerSound("assets/sounds/pin_rollover_1.ogg", "pin_rollover_1"),
                createjs.Sound.registerSound("assets/sounds/pin_rollover_2.ogg", "pin_rollover_2"),
                createjs.Sound.registerSound("assets/sounds/pin_rollover_3.ogg", "pin_rollover_3"),
                createjs.Sound.registerSound("assets/sounds/pin_rollover_4.ogg", "pin_rollover_4"),
                createjs.Sound.registerSound("assets/sounds/pin_rollover_5.ogg", "pin_rollover_5"),
                createjs.Sound.registerSound("assets/sounds/pin_rollover_6.ogg", "pin_rollover_6"),
                createjs.Sound.registerSound("assets/sounds/sfx_syrah.mp3", "sfx_syrah"),
                createjs.Sound.registerSound("assets/sounds/sfx_bolgheri.mp3", "sfx_bolgheri"),
                this.platform.development && d.cssanimations && (this.stats = new Stats,
                    u[0].body.appendChild(this.stats.dom)),
                this.addSubRoutine = function (e) {
                    return function (t, n) {
                        e.removeSubRoutine(t),
                            e.subRoutines.push(n),
                            e.subRoutinesNames.push(t)
                    }
                }(this),
                this.removeSubRoutine = function (e) {
                    return function (t) {
                        var n;
                        n = e.subRoutinesNames.indexOf(t),
                            -1 !== n && (e.subRoutines.splice(n, 1),
                                e.subRoutinesNames.splice(n, 1))
                    }
                }(this),
                this.render = function (e) {
                    return function () {
                        var t, n, i, o, a, s, r, l, c, u, d, p;
                        for (s = (new Date).getTime(),
                            e.deltaTime = (s - e.lastTime) / 1e3,
                            p = [],
                            l = e.subRoutines,
                            t = n = 0,
                            o = l.length; o > n; t = ++n)
                            d = l[t],
                            (-1 === e.subRoutinesNames[t].indexOf("sceneUpdate") || e.sceneUpdate) && (d(e.deltaTime) || p.push(d));
                        for (i = 0,
                            a = p.length; a > i; i++)
                            u = p[i],
                            e.removeSubRoutine(e.subRoutinesNames[e.subRoutines.indexOf(u)]);
                        e.platform.desktop || (r = new h.getDeviceOrientation({
                                    type: "game"
                                }),
                                r.then(function (t) {
                                    var n;
                                    n = t.getScreenAdjustedEuler(),
                                        e.orientationX = n.beta,
                                        e.orientationY = n.gamma
                                })["catch"](function (e) {})),
                            e.lastTime = s,
                            null != (c = e.stats) && c.update(),
                            requestAnimationFrame(e.render)
                    }
                }(this),
                this.render(),
                this.checkViewVisibility = function (e) {
                    return function (t) {
                        e.viewVisible = "home" !== t.name && "home.transition" !== t.name && !e.loading
                    }
                }(this),
                r.$on("$stateChangeSuccess", function (e) {
                    return function (t, n, i, o, a) {
                        e.checkViewVisibility(n)
                    }
                }(this)),
                "undefined" != typeof u[0].hidden ? (m = "hidden",
                    f = "visibilitychange") : "undefined" != typeof u[0].msHidden ? (m = "msHidden",
                    f = "msvisibilitychange") : "undefined" != typeof u[0].webkitHidden && (m = "webkitHidden",
                    f = "webkitvisibilitychange"),
                this.handleVisibilityChange = function (e) {
                    return function () {
                        var n;
                        if (document[m]) {
                            for (n in e.sounds)
                                e.sounds[n].stop();
                            console.log("mute")
                        } else
                            console.log("un-mute"),
                            e.onAllSoundsLoaded();
                        return t(function () {
                            return c.$apply()
                        }, 0)
                    }
                }(this),
                "undefined" == typeof u[0].addEventListener || "undefined" == typeof document[m] ? console.log("This feature requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.") : u[0].addEventListener(f, this.handleVisibilityChange, !1)
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("GalleryController", ["$window", "$scope", "$timeout", "md", "$document", function (e, t, n, i, o) {
            "ngInject";
            t.main.playSound("generic_transition"),
                this.images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                this.split = Math.round(this.images.length / 2),
                this.currentimage = 1,
                this.currentimageW = 0,
                this.imageW = 1200,
                this.imageH = 800,
                this.animated = !1,
                this.scrolling = !1,
                this.isMouseDown = !1,
                this.mouseX = -1,
                this.posX = 0,
                this.containerstyle = {
                    transform: "translate3D(50%,0,0)",
                    WebkitTransform: "translate3D(50%,0,0)",
                    MozTransform: "translate3D(50%,0,0)",
                    MsTransform: "translate3D(50%,0,0)"
                },
                n(function (e) {
                    return function () {
                        return e.animated = !0
                    }
                }(this), 10),
                this.holdTimeout = null,
                this.onMouseMove = function (e) {
                    return function (t) {
                        var n, i;
                        return "function" == typeof t.stopPropagation && t.stopPropagation(),
                            "function" == typeof t.preventDefault && t.preventDefault(),
                            e.isMouseDown && -1 !== e.mouseX ? (i = t.clientX || event.touches[0].clientX,
                                n = (i - e.mouseX) / 2,
                                n > e.currentimageW && (n = e.currentimageW),
                                n < -e.currentimageW && (n = -e.currentimageW),
                                e.posX = n) : void 0
                    }
                }(this),
                this.onScroll = function (e) {
                    return function (e) {
                        return console.log("scroll", e)
                    }
                }(this),
                this.onMouseDown = function (e) {
                    return function (t) {
                        return e.holdTimeout = n(function () {
                            return e.isMouseDown || e.scrolling ? void 0 : (e.isMouseDown = !0,
                                e.mouseX = t.clientX || t.touches[0].clientX,
                                console.log(t))
                        }, 1)
                    }
                }(this),
                this.onMouseUp = function (e) {
                    return function (t) {
                        return n.cancel(e.holdTimeout),
                            e.isMouseDown ? (n(function () {
                                    return e.posX > 0 ? e.previousImage(!0) : e.posX < 0 && e.nextImage(!0),
                                        e.posX = 0
                                }, 1),
                                e.isMouseDown = !1) : void 0
                    }
                }(this),
                e.addEventListener("mouseup", function (e) {
                    return function () {
                        return e.onMouseUp()
                    }
                }(this)),
                this.onMouseWheel = function (e) {
                    return function (t) {
                        var n;
                        return n = t.deltaY || t.originalEvent.deltaY,
                            n && 0 > n ? e.previousImage() : n && n > 0 ? e.nextImage() : void 0
                    }
                }(this),
                this.nextImage = function (e) {
                    return function (t) {
                        return e.currentimage < e.images[e.images.length - 1] ? e.imageClick(e.currentimage + 1, t) : e.currentimage === e.images[e.images.length - 1] ? e.imageClick(e.images[0], t) : void 0
                    }
                }(this),
                this.previousImage = function (e) {
                    return function (t) {
                        return e.currentimage > e.images[0] ? e.imageClick(e.currentimage - 1, t) : 1 === e.currentimage ? e.imageClick(e.images[e.images.length - 1], t) : void 0
                    }
                }(this),
                this.imageClick = function (e) {
                    return function (t, i) {
                        var o;
                        return t === e.currentimage || e.scrolling ? void 0 : (e.currentimage = t,
                            e.scrolling = !0,
                            o = 1100,
                            i && (o = 500),
                            n(function () {
                                return e.scrolling = !1
                            }, o))
                    }
                }(this),
                this.getItemPosition = function (e) {
                    return function (e) {}
                }(this),
                this.getSize = function (t) {
                    return function (n) {
                        var i, o, a, s, r, l, c, u, d, p, h, m;
                        return m = {
                                w: 0,
                                h: 0
                            },
                            r = 2 * -e.innerWidth,
                            c = 1,
                            i = 1,
                            e.innerWidth < 600 ? (p = .87 * e.innerWidth,
                                d = .87 * e.innerHeight,
                                e.innerWidth < e.innerHeight && (p = .78 * e.innerWidth,
                                    d = .78 * e.innerHeight)) : (p = .8 * e.innerWidth,
                                d = .8 * e.innerHeight),
                            h = Math.min(p / t.imageW, d / t.imageH),
                            m.w = t.imageW * h,
                            m.h = t.imageH * h,
                            t.currentimageW = m.w,
                            u = "auto",
                            a = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
                            o = navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
                            (a || o) && (u = "none"),
                            n === t.currentimage ? (u = "none",
                                r = (e.innerWidth - m.w) / 2) : (i = .8,
                                n < t.currentimage ? (l = t.currentimage - n,
                                    r = .15 * e.innerWidth - m.w * l,
                                    l >= t.split && (s = t.images.length - t.currentimage,
                                        l = s + n,
                                        r = .85 * e.innerWidth + m.w * (l - 1))) : n > t.currentimage && (l = n - t.currentimage,
                                    r = .85 * e.innerWidth + m.w * (l - 1),
                                    l >= t.split && (s = t.currentimage,
                                        l = s + (t.images.length - l - 1),
                                        r = .15 * e.innerWidth - m.w * l)),
                                l > 3 && (c = 0)),
                            r += t.posX,
                            r = Math.round(r), {
                                pointerEvents: u,
                                width: m.w + "px",
                                height: m.h + "px",
                                opacity: c,
                                transform: "translate3D(" + r + "px,-50%,0) scale(" + i + ")",
                                WebkitTransform: "translate3D(" + r + "px,-50%,0) scale(" + i + ")",
                                MozTransform: "translate3D(" + r + "px,-50%,0) scale(" + i + ")",
                                MsTransform: "translate3D(" + r + "px,-50%,0) scale(" + i + ")"
                            }
                    }
                }(this)
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("ContactsController", ["$scope", "$timeout", "md", function (e, t, n) {
            "ngInject";
            e.main.playSound("generic_transition")
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").controller("AboutController", ["$scope", "$timeout", "$window", "Modernizr", function (e, t, n, i) {
            "ngInject";
            this.selectedChapter = 0,
                this.slideshowImageWidth = 320,
                e.main.playSound("generic_transition"),
                this.onScroll = _.throttle(function (e) {
                    return function (t) {
                        var i, o, a, s, r, l;
                        for (a = t.target.getElementsByClassName("chapter"),
                            r = s = 0,
                            l = a.length; l > s; r = ++s)
                            o = a[r],
                            i = o.getBoundingClientRect(),
                            i.top < n.innerHeight / 2 && (e.selectedChapter = r)
                    }
                }(this), 250),
                this.getImageStyle = function (e) {
                    return function (t) {
                        var o;
                        return o = n.innerWidth / 2 - e.slideshowImageWidth / 2,
                            o -= e.slideshowImageWidth * (e.selectedChapter - t),
                            i.cssanimations ? {
                                transform: "translateX(" + o + "px)",
                                WebkitTransform: "translateX(" + o + "px)",
                                MozTransform: "translateX(" + o + "px)",
                                MsTransform: "translateX(" + o + "px)",
                                opacity: t === e.selectedChapter ? .6 : .1
                            } : {
                                left: o + "px",
                                opacity: t === e.selectedChapter ? .6 : .1
                            }
                    }
                }(this)
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").run(["$log", "Modernizr", "md", "$rootScope", "$state", "$location", "$cookies", function (e, t, n, i, o, a, s) {
            "ngInject";
            t.addTest({
                    mobile: !!n.mobile(),
                    phone: !!n.phone(),
                    tablet: !!n.tablet(),
                    android: !!n.is("AndroidOS"),
                    ios: !!n.is("iOS"),
                    ipad: !!n.is("iPad"),
                    iphone: !!n.is("iPhone"),
                    wphone: !!n.is("WindowsPhoneOS"),
                    mobilegradea: "A" === n.mobileGrade(),
                    edge: !!/Edge\/\d+/i.test(navigator.userAgent),
                    firefox: n.version("Gecko") > 1,
                    ie: n.version("IE") > 1
                }),
                t.addTest("volume", function () {
                    var e;
                    return e = document.createElement("audio"),
                        e.volume = .5,
                        t.audio && .5 === e.volume
                }),
                i.$on("$stateChangeSuccess", function (e, t, n, o, r) {
                    return i.site_url = a.absUrl(),
                        s["campo-le-comete-language"] = n.language
                })
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").config(["$stateProvider", "$urlRouterProvider", function (e, t) {
            "ngInject";
            return e.state("home", {
                    url: "/{language}",
                    templateUrl: "app/main/main.html",
                    controller: "MainController",
                    controllerAs: "main",
                    resolve: {
                        config: ["$stateParams", "config", function (e, t) {
                            return t
                        }],
                        language: ["$state", "$stateParams", "language", "config", function (e, t, n, i) {
                            return n(t.language, i)
                        }]
                    }
                }).state("home.about", {
                    url: "/about",
                    templateUrl: "app/about/about.html",
                    controller: "AboutController",
                    controllerAs: "about"
                }).state("home.privacy", {
                    url: "/privacy-policy",
                    templateUrl: "app/privacy/privacy.html",
                    controller: "PrivacyController",
                    controllerAs: "privacy"
                }).state("home.contacts", {
                    url: "/contacts",
                    templateUrl: "app/contacts/contacts.html",
                    controller: "ContactsController",
                    controllerAs: "contacts"
                }).state("home.gallery", {
                    url: "/gallery",
                    templateUrl: "app/gallery/gallery.html",
                    controller: "GalleryController",
                    controllerAs: "gallery"
                }).state("home.wine", {
                    url: "/wine-experience",
                    templateUrl: "app/wine/wine.html",
                    controller: "WineExperienceController",
                    controllerAs: "wine"
                }).state("home.share", {
                    templateUrl: "app/share/share.html",
                    controller: "ShareController",
                    controllerAs: "share"
                }).state("home.product", {
                    url: "/{producturl}",
                    templateUrl: "app/product/product.html",
                    controller: "ProductController",
                    controllerAs: "product",
                    resolve: {
                        config: ["$stateParams", "config", "$state", function (e, t, n) {
                            var i;
                            return i = _.find(t.products, {
                                    url: e.producturl
                                }),
                                null == i && _.defer(n.go("home", {
                                    language: e.language
                                })),
                                t
                        }]
                    }
                }).state("home.transition", {
                    url: "/{producturl}"
                }),
                t.otherwise("/")
        }])
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").constant("moment", moment).constant("Modernizr", Modernizr).constant("Detector", Detector).constant("md", new MobileDetect(navigator.userAgent)).constant("TweenLite", TweenLite).constant("TweenMax", TweenMax).constant("FULLTILT", FULLTILT)
    }
    .call(this),
    function () {
        angular.module("aquestCampoLeComete").config(["$logProvider", "$locationProvider", "$animateProvider", "$cookiesProvider", "languageProvider", "configProvider", "Modernizr", function (e, t, n, i, o, a, s) {
            "ngInject";
            var r;
            e.debugEnabled(!0),
                t.hashPrefix("!"),
                t.html5Mode(!1),
                r = navigator.language || navigator.userLanguage,
                -1 !== r.indexOf("-") && (r = r.split("-")[0]),
                o.userLanguage = r,
                n.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/)
        }])
    }
    .call(this),
    angular.module("aquestCampoLeComete").run(["$templateCache", function (e) {
        e.put("app/about/about.html", '<div class=about-page ng-mousemove=about.pageParticleMouseMove($event)><page-particles on-mouse-move=about.pageParticleMouseMove color="\'#aeb53e\'" background-color="\'#2a323e\'" main=main></page-particles><div class=slideshow><img class=image ng-repeat="chapter in main.locale.about_page.chapters" ng-style=about.getImageStyle($index) ng-src={{chapter.image}}></div><div class=page-content ng-scroll=about.onScroll($event) msd-wheel=autoscroller.onMouseWheel($event) auto-scroller><h1 css3d-rotation-effect class=title>{{main.locale.about_page.title}}</h1><div class=chapter ng-repeat="chapter in main.locale.about_page.chapters"><h2 class=chapter-title ng-bind-html="chapter.title | wordseparation"></h2><p class=chapter-subtitle ng-bind-html="chapter.subtitle | wordseparation"></p><p class=chapter-text ng-bind-html="chapter.text | wordseparation"></p></div><p id=end></p></div><div class="fader top"></div><div class="fader bottom"></div></div>'),
            e.put("app/contacts/contacts.html", '<div class=contacts-page ng-mousemove=contacts.pageParticleMouseMove($event)><page-particles on-mouse-move=contacts.pageParticleMouseMove color="\'#aeb53e\'" background-color="\'#2a323e\'" main=main></page-particles><div class=page-content><h1 css3d-rotation-effect class=title>{{main.locale.contacts_page.title}}</h1><h2 class=subtitle>{{main.locale.contacts_page.subtitle}}</h2><a ng-href="{{\'mailto:\'+main.locale.contacts_page.email}}" class=email>{{main.locale.contacts_page.email}}</a><p class=address>{{main.locale.contacts_page.address}}</p><div class=numbers><span>{{main.locale.contacts_page.number1}}</span> <span>{{main.locale.contacts_page.number2}}</span></div><a href="https://www.google.it/maps/place/Campo+alle+Comete+-+Feudi+Toscana+Soc.+Agricola+a+r.+l./@43.173044,10.604627,15z/data=!4m5!3m4!1s0x0:0x21d5f0e2cbd38300!8m2!3d43.173044!4d10.604627" target=_blank class=maps-button>{{main.locale.contacts_page.maps_label}}</a><p class=gps>GPS. N 43.173044 &nbsp; &nbsp; &nbsp; &nbsp; E 10.604627</p></div></div>'),
            e.put("app/gallery/gallery.html", "<div class=gallery-page ng-mousemove=gallery.pageParticleMouseMove($event);gallery.onMouseMove($event) ng-mousedown=gallery.onMouseDown($event) ng-touchstart=gallery.onMouseDown($event) ng-touchend=gallery.onMouseUp($event) ng-touchmove=gallery.onMouseMove($event) ng-scroll=gallery.onScroll($event) msd-wheel=\"gallery.onMouseWheel($event, $delta, $deltaX, $deltaY)\"><page-particles on-mouse-move=gallery.pageParticleMouseMove color=\"'#aeb53e'\" background-color=\"'#2a323e'\" main=main></page-particles><div class=\"page-content ng-animate-disabled\" ng-class=\"{'animated':gallery.animated, 'scrolling':gallery.isMouseDown}\"><div class=gallery-background></div><div ng-repeat=\"i in gallery.images track by $index\" ng-class=\"{'selected': (i) == gallery.currentimage,\n          'next': (i) == gallery.currentimage + 1,\n          'next-next': (i) == gallery.currentimage + 2,\n          'previous': (i) == gallery.currentimage - 1,\n          'previous-previous': (i) == gallery.currentimage - 2 }\" class=\"gallery-item ng-animate-disabled\" id=gallery-image-{{i}} ng-style=gallery.getSize(i) ng-click=gallery.imageClick(i)><img draggable=false ng-src=assets/images/gallery/{{i}}.jpg></div></div></div>"),
            e.put("app/main/main.html", '<div class=main-container ng-class={cursorpointer:main.overPin.over}><webgl-detector><scene-2d ng-if=!webgldetector.supportsWebGL></scene-2d><div ng-if=webgldetector.supportsWebGL><scene-3d></scene-3d></div><drag-to-discover css3d-rotation-effect ng-if="webgldetector.supportsWebGL && !main.loading && !main.firstDragged"></drag-to-discover><pin-2d always-visible=!webgldetector.supportsWebGL ng-repeat="item in main.uiPins" is-visible=item.visible x=item.x y=item.y id=item.id main=main></pin-2d></webgl-detector><a class=logo ng-if=main.loadingStarted></a><div ui-view class=view-container ng-if=main.viewVisible ng-animate-children></div><site-menu></site-menu><hamburger-menu></hamburger-menu><footer ng-if=!main.loading></footer><share-volume-menu ng-if=!main.loading></share-volume-menu><loading-indicator ng-if=main.loading></loading-indicator><version-info ng-if=main.platform.development info=main.info></version-info></div>'),
            e.put("app/privacy/privacy.html", '<div class=privacy-policy-page ng-mousemove=privacy.pageParticleMouseMove($event)><page-particles on-mouse-move=privacy.pageParticleMouseMove color="\'#aeb53e\'" background-color="\'#2a323e\'" main=main></page-particles><div class=page-content><h1 css3d-rotation-effect class=title>{{main.locale.privacy_page.title}}</h1><div class=chapter ng-repeat="chapter in main.locale.privacy_page.chapters"><h2 class=chapter-title ng-bind-html=chapter.title></h2><p class=chapter-text ng-bind-html=chapter.text></p></div></div><div class="fader top"></div><div class="fader bottom"></div></div>'),
            e.put("app/product/product.html", '<div class=product-page ng-mousemove=product.onParticlesMouseMove($event) ng-style=product.page_style><page-particles ng-show="product.state == \'loaded\'" color=product.locale.particles_color background-color=product.locale.page_color on-mouse-move=product.onParticlesMouseMove main=main></page-particles><div class=product-description ng-show="product.state == \'loaded\'" scroll-controller ng-scroll=scrollcontroller.onScroll($event)><div class=right-side><h1 css3d-rotation-effect class=ng-animate-disabled ng-class="{\'intro\': !scrollcontroller.hasScrolled}">{{product.locale.label}}</h1><p class=description ng-show=!scrollcontroller.hasScrolled ng-bind-html="product.locale.description | truncate:15 | wordseparation:true:1.5:.06"></p><p class=description ng-show=scrollcontroller.hasScrolled ng-bind-html="product.locale.description | wordseparation"></p><div class=scroll-to-discover ng-click=scrollcontroller.gotoParagraph(0) ng-show=!scrollcontroller.hasScrolled><span>{{main.locale.scroll_to_discover}}</span><div class="curved-line curved-line1"></div><div class="curved-line curved-line2"></div><div class="curved-line curved-line3"></div></div><div class=scroll-placeholder ng-show=!scrollcontroller.hasScrolled></div><div ng-show=scrollcontroller.hasScrolled ng-repeat="paragraph in product.locale.paragraphs" class=paragraph><h2>{{paragraph.title}}</h2><p>{{paragraph.text}}</p></div><div class="download download-mobile"><a target=_blank ng-href={{product.locale.filedownload}}>{{main.locale.download}}</a></div><div class=scroll-up ng-click=scrollcontroller.gotoTop()><span>{{main.locale.scroll_up}}</span><div class="curved-line curved-line1"></div><div class="curved-line curved-line2"></div><div class="curved-line curved-line3"></div></div></div><div class=left-side><img class="wine-big ng-animate-disabled" ng-class="{\'intro\': !scrollcontroller.hasScrolled}" ng-src={{product.locale.image}}><div class=download ng-mouseenter="main.playSound(\'hover_menu\')"><a ng-href={{product.locale.filedownload}} target=_blank>{{main.locale.download}}</a></div><ul class=chapter-selector><li ng-class="{selected: $index == scrollcontroller.selectedChapter, first: $index == 0, last: $index == (product.locale.paragraphs.length - 1)}" ng-repeat="paragraph in product.locale.paragraphs" ng-click=scrollcontroller.gotoParagraph($index) class=chapter-selector-item><span>{{paragraph.title}}</span></li></ul></div></div></div>'),
            e.put("app/share/share.html", '<div class=share-page ng-mousemove=share.pageParticleMouseMove($event)><page-particles on-mouse-move=share.pageParticleMouseMove color="\'#aeb53e\'" background-color="\'#2a323e\'" main=main></page-particles><div class=page-content><h1 class=title>{{main.locale.share_page.title}}</h1><div class=buttons><div class="button facebook" ng-mouseenter="main.playSound(\'hover_menu\')" ng-click=share.openWindow(share.getFBLink())>{{main.locale.share_page.facebook}}</div><div class="button twitter" ng-mouseenter="main.playSound(\'hover_menu\')" ng-click=share.openWindow(share.getTWLink())>{{main.locale.share_page.twitter}}</div><div class="button google" ng-mouseenter="main.playSound(\'hover_menu\')" ng-click=share.openWindow(share.getGLink())>{{main.locale.share_page.google}}</div></div></div></div>'),
            e.put("app/wine/wine.html", '<div class=wine-experience-page ng-mousemove=wine.pageParticleMouseMove($event)><page-particles on-mouse-move=wine.pageParticleMouseMove color="\'#aeb53e\'" background-color="\'#2a323e\'" main=main></page-particles><div class=page-content><h1 css3d-rotation-effect class=title ng-bind-html=main.locale.wine_page.title></h1><p css3d-rotation-effect class=chapter-text ng-bind-html=main.locale.wine_page.intro></p><br><br><div class=chapter ng-repeat="chapter in main.locale.wine_page.chapters"><h2 class=chapter-title ng-bind-html=chapter.title></h2><p class=chapter-text ng-bind-html=chapter.text></p></div><p css3d-rotation-effect class=chapter-text ng-bind-html=main.locale.wine_page.ending></p></div><div class="fader top"></div><div class="fader bottom"></div></div>'),
            e.put("app/components/drag-to-discover/drag-to-discover.html", "<div class=drag-to-discover><div class=arrowleft></div><div class=points><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div></div><div class=arrowright></div><div class=cursor></div><div class=label>{{main.locale.drag_to_discover}}</div></div>"),
            e.put("app/components/footer/footer.html", '<div class=footer><div ng-show=footer.open class=footer-content ng-animate-children><ul class=footer-menu ng-if=footer.open><li><a ui-sref=home.gallery ng-click=footer.onElementClick()>{{main.locale.footer_gallery}}</a></li><li><a ui-sref=home.contacts ng-click=footer.onElementClick()>{{main.locale.footer_contatti}}</a></li><li><a href="https://www.google.it/maps/place/Campo+alle+Comete+-+Feudi+Toscana+Soc.+Agricola+a+r.+l./@43.173044,10.604627,15z/data=!4m5!3m4!1s0x0:0x21d5f0e2cbd38300!8m2!3d43.173044!4d10.604627" target=_blank>{{main.locale.footer_where}}</a></li><li><a ui-sref=home.privacy ng-click=footer.onElementClick()>{{main.locale.footer_privacy}}</a></li><li><a ui-sref=home.wine ng-click=footer.onElementClick()>{{main.locale.footer_wine}}</a></li><li><a href=https://www.aquest.it/ target=_blank>{{main.locale.footer_credits}}</a></li></ul><div class=bottom ng-if=footer.open><p class=footer-piva>{{main.locale.footer_piva}}</p><p class=footer-copyright>{{main.locale.footer_copyright}}</p></div></div><div class=open-close-button ng-click=footer.toggleFooter($event) ng-mouseenter="main.playSound(\'hover_menu\')"><div class=plusbutton><div class=plus-horizontal></div><div class=plus-vertical ng-if=!footer.open></div></div><span class=button-label ng-class="{\'close\': footer.open}">{{footer.button_label}}</span></div></div>'),
            e.put("app/components/hamburger-menu/hamburger-menu.html", "<div class=hamburger-menu ng-if=!main.loading ng-click=hamburgermenu.toggleOpen($event) ng-class=\"{'open': hamburgermenu.open}\" ng-mouseenter=\"main.playSound('hover_menu')\"><div class=hamburger ng-class=\"{'clicked': hamburgermenu.clicked}\"><div class=lines-container ng-if=!hamburgermenu.open><div class=hamburger-line></div><div class=hamburger-line></div><div class=hamburger-line></div></div><div class=x-container ng-if=hamburgermenu.open><div class=hamburger-x>&#10005;</div></div></div><span class=button-label ng-class=\"{'open': hamburgermenu.open}\">{{hamburgermenu.button_label}}</span></div>"),
            e.put("app/components/language-selector/language-selector.html", '<ul class=language-selector><li ng-repeat="item in main.config.locales"><a ui-sref-active=active ui-sref={language:item.code}>{{item.label}}</a></li></ul>'),
            e.put("app/components/loading-indicator/loading-indicator.html", '<div class=loading-indicator><div class=centered-container ng-switch=loadingindicator.step><div class=text-container ng-switch-when=0><p ng-bind-html="main.locale.loading_line1 | wordseparation:true:.5:.1"></p></div><div class=text-container ng-switch-when=1><p ng-bind-html="main.locale.loading_line2 | wordseparation:true:.5:.1"></p></div><div class=text-container ng-switch-when=2><p ng-bind-html="main.locale.loading_line3 | wordseparation:true:.5:.1"></p></div></div></div>'),
            e.put("app/components/page-particles/page-particles.html", "<canvas class=page-particles ng-resize=pageparticles.onResize($event)></canvas>"),
            e.put("app/components/pin-2d/pin-2d.html", "<div class=pin-2d ng-style=pin2d.style ng-if=pin2d.visible ng-animate-children><a ui-sref={{pin2d.getLink()}} ng-mouseover=pin2d.onMouseOver($event) ng-mouseout=pin2d.onMouseOut($event) ng-style=\"{'margin-left': -pin2d.pinSize/2+'px', 'margin-top': -pin2d.pinSize/2+'px', 'width': pin2d.pinSize+'px', 'height': pin2d.pinSize+'px'}\"><!-- <pulse-circle-css ng-class=\"{'closed':pin2d.state == 'idle', 'opened':pin2d.state == 'zoom', 'expanded': pin2d.state == 'showinfo'}\"></pulse-circle-css> --><pulse-circle main=main id=id size=pin2d.pinSize speed=pin2d.pinSpeed active=\"alwaysVisible || pin2d.state == 'zoom' || pin2d.state == 'showinfo'\" ng-if=\"alwaysVisible || pin2d.state == 'zoom' || pin2d.state == 'showinfo'\" scene-update=true></pulse-circle><div class=product-info ng-if=\"pin2d.state == 'showinfo'\"><div class=\"circle circle2\"></div><div class=\"circle circle1\"></div><img ng-src={{pin2d.loadingImageURL}}><p class=loading-info>{{pin2d.loadingInfo}}</p><p class=loading-copy>{{main.locale.loading}}</p></div></a><span class=label ng-class=\"{'opened':pin2d.labelopened}\">{{pin2d.info.label}}</span></div>"),
            e.put("app/components/pin-label/pin-label.html", "<div class=pin-label ng-style=pinlabel.style><span class=label>{{pinlabel.label}}</span><div class=white-dots><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div></div></div>"),
            e.put("app/components/product-circle/product-circle.html", '<div class=product-circle ng-class={open:productcircle.open,close:productcircle.close}><pulse-circle main=main ng-show=!productcircle.close size=402 speed=12 active=!productcircle.close id=productcircle.id></pulse-circle><div class="circle circle2"></div><div class="circle circle1"></div><div class=product-image><img ng-if=main.platform.desktop ng-src={{locale.loading_image}}><img ng-if=!main.platform.desktop ng-src={{locale.loading_image_mobile}}></div></div>'),
            e.put("app/components/pulse-circle/pulse-circle-css.html", "<div class=pulse-circle-css><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div></div>"),
            e.put("app/components/pulse-circle/pulse-circle.html", "<canvas class=pulse-circle ng-style=\"{'width': size+'px', 'height': size+'px'}\"></canvas>"),
            e.put("app/components/scene-2d/scene-2d.html", '<div class="scene-2d scene" ng-resize=scene2d.onResize()><div class=loading-screen ng-if=main.loading></div><div class=main-screen ng-if=!main.loading><div class=main-screen-world></div></div></div>'),
            e.put("app/components/scene-3d/scene-3d.html", '<canvas ng-show=scene3d.scene.skyboxLoaded class="scene-3d scene" msd-wheel=scene3d.scene.onMouseWheel($event) ng-resize=scene3d.scene.onResize($event)></canvas>'),
            e.put("app/components/share-volume-menu/share-volume-menu.html", "<div class=share-volume-menu><object ng-if=\"sharevolume.locale == 'en' || sharevolume.locale == 'de'\" class=logo-ce data=assets/images/logo-comunita-europea.svg type=image/svg+xml></object><a class=share ui-sref=home.share ng-mouseenter=\"main.playSound('hover_menu')\"></a> <button class=volume ng-mouseenter=\"main.playSound('hover_menu')\" ng-class=\"{'disabled': main.muted}\" ng-click=\"main.muted = !main.muted\"><div class=line></div><div class=line></div><div class=line></div><div class=line></div></button></div>"),
            e.put("app/components/site-menu/site-menu.html", '<div class=site-menu ng-if=main.menuOpen msd-wheel="sitemenu.onMouseWheel($event, $delta, $deltaX, $deltaY)" ng-style="{\'background-color\': main.locale[main.config.products[sitemenu.selected].id].page_color}" ng-swipe-up=sitemenu.scrollDown() ng-swipe-down=sitemenu.scrollUp() ng-mousemove=sitemenu.onParticlesMouseMove($event) ng-animate-children><page-particles color=sitemenu.getParticlesColor() background-color=main.locale[main.config.products[sitemenu.selected].id].page_color on-mouse-move=sitemenu.onParticlesMouseMove main=main></page-particles><ul class=labels ng-style=sitemenu.getLabelsTop() ng-if=main.menuOpen><li class=element ng-repeat="product in main.config.products" ng-style=sitemenu.getLabelStyle($index) ng-class="{selected: $index == sitemenu.selected, upper: $index == sitemenu.selected - 1, lower: $index == sitemenu.selected + 1, \'upper-hidden\': $index < sitemenu.selected - 1, \'lower-hidden\': $index > sitemenu.selected + 1}"><a ng-click="sitemenu.onItemClick($index,\'home.product\',product)" class="label noPreventDefault" ng-touchmove=sitemenu.preventDefault($event)>{{main.locale[product.id].label}}</a></li><!-- about item --><li class=element ng-style=sitemenu.getLabelStyle(main.config.products.length) ng-class="{selected: sitemenu.selected == main.config.products.length, lower: sitemenu.selected == main.config.products.length - 1, \'lower-hidden\': sitemenu.selected < main.config.products.length - 1}"><a ng-click="sitemenu.onItemClick(main.config.products.length,\'home.about\')" class="label noPreventDefault" ng-touchmove=sitemenu.preventDefault($event)>{{main.locale.about}}</a></li></ul><ul class=images ng-if=main.menuOpen><li class=element ng-repeat="product in main.config.products" ng-class="{selected: $index == sitemenu.selected, upper: $index == sitemenu.selected - 1, lower: $index == sitemenu.selected + 1, \'upper-hidden\': $index < sitemenu.selected - 1, \'lower-hidden\': $index > sitemenu.selected + 1}"><a class=noPreventDefault ng-touchmove=sitemenu.preventDefault($event) ng-click="sitemenu.onItemClick($index,\'home.product\',product)" ng-mouseenter=sitemenu.onImageHover($event,$index)><product-circle id=product.id main=main locale=main.locale[product.id] is-close="$index != sitemenu.selected"></product-circle><div class=enter-label><p>{{main.locale.enter}}</p><div class="curved-line curved-line1"></div><div class="curved-line curved-line2"></div><div class="curved-line curved-line3"></div></div></a></li><!-- about item --><li class=element ng-class="{selected: sitemenu.selected == main.config.products.length, lower: sitemenu.selected == main.config.products.length - 1, \'lower-hidden\': sitemenu.selected < main.config.products.length - 1}"><a class=noPreventDefault ng-touchmove=sitemenu.preventDefault($event) ng-click="sitemenu.onItemClick(main.config.products.length,\'home.about\')" ng-mouseenter=sitemenu.onImageHover($event,main.config.products.length)><product-circle id=product.id main=main locale="{\'loading_image\':\'assets/images/product_about.png\',\'loading_image_mobile\':\'assets/images/product_about-low.png\'}" is-close="sitemenu.selected != main.config.products.length"></product-circle><div class=enter-label><p>{{main.locale.enter}}</p><div class="curved-line curved-line1"></div><div class="curved-line curved-line2"></div><div class="curved-line curved-line3"></div></div></a></li></ul><language-selector class=noPreventDefault></language-selector></div>'),
            e.put("app/components/version-info/version-info.html", "<div class=version-info><span ng-if=!info.ci_build>v{{info.version}}+local built {{info.date}}</span> <span ng-if=info.ci_build>v{{info.version}}+git{{info.ci_commit}} built {{info.date}} by {{info.ci_author}} on {{info.ci_branch}}</span></div>"),
            e.put("app/components/webgl-detector/webgl-detector.html", "<div class=webgl-detector ng-transclude></div>")
    }]);
//# sourceMappingURL=../maps/scripts/app-e215c2a89b.js.map