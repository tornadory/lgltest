function initShaders(e, t, r) {
    var n = createProgram(e, t, r);
    return n ? (e.useProgram(n), e.program = n, !0) : (console.log("Failed to create program"), !1)
}

function createProgram(e, t, r) {
    var n = loadShader(e, e.VERTEX_SHADER, t),
        a = loadShader(e, e.FRAGMENT_SHADER, r);
    if (!n || !a) return null;
    var o = e.createProgram();
    if (!o) return null;
    e.attachShader(o, n), e.attachShader(o, a), e.linkProgram(o);
    var i = e.getProgramParameter(o, e.LINK_STATUS);
    if (!i) {
        var u = e.getProgramInfoLog(o);
        return console.log("Failed to link program: " + u), e.deleteProgram(o), e.deleteShader(a), e.deleteShader(n), null
    }
    return o
}

function loadShader(e, t, r) {
    var n = e.createShader(t);
    if (null == n) return console.log("unable to create shader"), null;
    e.shaderSource(n, r), e.compileShader(n);
    var a = e.getShaderParameter(n, e.COMPILE_STATUS);
    if (!a) {
        var o = e.getShaderInfoLog(n);
        return console.log("Failed to compile shader: " + o), e.deleteShader(n), null
    }
    return n
}

function getWebGLContext(e, t) {
    var r = WebGLUtils.setupWebGL(e);
    return r ? ((arguments.length < 2 || t) && (r = WebGLDebugUtils.makeDebugContext(r)), r) : null
}

function loadShaderFromFile(e, t, r, n) {
    var a = new XMLHttpRequest;
    a.onreadystatechange = function () {
        4 === a.readyState && 404 !== a.status && n(e, a.responseText, r)
    }, a.open("GET", t, !0), a.send()
}
WebGLDebugUtils = function () {
    function e(e) {
        if (null == l) {
            l = {};
            for (var t in e) "number" == typeof e[t] && (l[e[t]] = t)
        }
    }

    function t() {
        if (null == l) throw "WebGLDebugUtils.init(ctx) not called"
    }

    function r(e) {
        return t(), void 0 !== l[e]
    }

    function n(e) {
        t();
        var r = l[e];
        return void 0 !== r ? r : "*UNKNOWN WebGL ENUM (0x" + e.toString(16) + ")"
    }

    function a(e, t, r) {
        var a = c[e];
        return void 0 !== a && a[t] ? n(r) : r.toString()
    }

    function o(t, r) {
        function o(e, t) {
            return function () {
                var n = e[t].apply(e, arguments),
                    a = e.getError();
                return 0 != a && (i[a] = !0, r(a, t, arguments)), n
            }
        }
        e(t), r = r || function (e, t, r) {
            for (var o = "", i = 0; i < r.length; ++i) o += (0 == i ? "" : ", ") + a(t, i, r[i]);
            f("WebGL error " + n(e) + " in " + t + "(" + o + ")")
        };
        var i = {},
            u = {};
        for (var c in t) "function" == typeof t[c] ? u[c] = o(t, c) : u[c] = t[c];
        return u.getError = function () {
            for (var e in i)
                if (i[e]) return i[e] = !1, e;
            return t.NO_ERROR
        }, u
    }

    function i(e) {
        var t = e.getParameter(e.MAX_VERTEX_ATTRIBS),
            r = e.createBuffer();
        e.bindBuffer(e.ARRAY_BUFFER, r);
        for (var n = 0; n < t; ++n) e.disableVertexAttribArray(n), e.vertexAttribPointer(n, 4, e.FLOAT, !1, 0, 0), e.vertexAttrib1f(n, 0);
        e.deleteBuffer(r);
        for (var a = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), n = 0; n < a; ++n) e.activeTexture(e.TEXTURE0 + n), e.bindTexture(e.TEXTURE_CUBE_MAP, null), e.bindTexture(e.TEXTURE_2D, null);
        for (e.activeTexture(e.TEXTURE0), e.useProgram(null), e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindRenderbuffer(e.RENDERBUFFER, null), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.DITHER), e.disable(e.SCISSOR_TEST), e.blendColor(0, 0, 0, 0), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ONE, e.ZERO), e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(-1), e.colorMask(!0, !0, !0, !0), e.cullFace(e.BACK), e.depthFunc(e.LESS), e.depthMask(!0), e.depthRange(0, 1), e.frontFace(e.CCW), e.hint(e.GENERATE_MIPMAP_HINT, e.DONT_CARE), e.lineWidth(1), e.pixelStorei(e.PACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.UNPACK_COLORSPACE_CONVERSION_WEBGL && e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.polygonOffset(0, 0), e.sampleCoverage(1, !1), e.scissor(0, 0, e.canvas.width, e.canvas.height), e.stencilFunc(e.ALWAYS, 0, 4294967295), e.stencilMask(4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP), e.viewport(0, 0, e.canvas.clientWidth, e.canvas.clientHeight), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT | e.STENCIL_BUFFER_BIT); e.getError(););
    }

    function u(e) {
        function t(e) {
            return e instanceof WebGLBuffer || e instanceof WebGLFramebuffer || e instanceof WebGLProgram || e instanceof WebGLRenderbuffer || e instanceof WebGLShader || e instanceof WebGLTexture
        }

        function r(e) {
            for (var r = 0; r < e.length; ++r) {
                var n = e[r];
                if (t(n)) return n.__webglDebugContextLostId__ == l
            }
            return !0
        }

        function n() {
            for (var e = Object.keys(E), t = 0; t < e.length; ++t) delete glErrorShdow_[e]
        }

        function a(e, t) {
            var n = e[t];
            return function () {
                if (!d) {
                    if (!r(arguments)) return void(E[e.INVALID_OPERATION] = !0);
                    var t = n.apply(e, arguments);
                    return t
                }
            }
        }

        function o(e) {
            return {
                statusMessage: e
            }
        }

        function u() {
            for (var t = 0; t < s.length; ++t) {
                var r = s[t];
                r instanceof WebGLBuffer ? e.deleteBuffer(r) : r instanceof WebctxFramebuffer ? e.deleteFramebuffer(r) : r instanceof WebctxProgram ? e.deleteProgram(r) : r instanceof WebctxRenderbuffer ? e.deleteRenderbuffer(r) : r instanceof WebctxShader ? e.deleteShader(r) : r instanceof WebctxTexture && e.deleteTexture(r)
            }
        }

        function f(e) {
            return "function" == typeof e ? e : function (t) {
                e.handleEvent(t)
            }
        }
        var c = {},
            l = 1,
            d = !1,
            s = [],
            g = void 0,
            m = void 0,
            b = void 0,
            E = {};
        for (var A in e) "function" == typeof e[A] ? c[A] = a(e, A) : c[A] = e[A];
        c.loseContext = function () {
            if (!d) {
                for (d = !0, ++l; e.getError(););
                n(), E[e.CONTEXT_LOST_WEBGL] = !0, setTimeout(function () {
                    g && g(o("context lost"))
                }, 0)
            }
        }, c.restoreContext = function () {
            if (d) {
                if (!m) throw "You can not restore the context without a listener";
                setTimeout(function () {
                    if (u(), i(e), d = !1, m) {
                        var t = m;
                        m = b, b = void 0, t(o("context restored"))
                    }
                }, 0)
            }
        }, c.getError = function () {
            if (!d)
                for (var t; t = e.getError();) E[t] = !0;
            for (var t in E)
                if (E[t]) return delete E[t], t;
            return e.NO_ERROR
        };
        for (var S = ["createBuffer", "createFramebuffer", "createProgram", "createRenderbuffer", "createShader", "createTexture"], h = 0; h < S.length; ++h) {
            var R = S[h];
            c[R] = function (t) {
                return function () {
                    if (d) return null;
                    var r = t.apply(e, arguments);
                    return r.__webglDebugContextLostId__ = l, s.push(r), r
                }
            }(e[R])
        }
        for (var w = ["getActiveAttrib", "getActiveUniform", "getBufferParameter", "getContextAttributes", "getAttachedShaders", "getFramebufferAttachmentParameter", "getParameter", "getProgramParameter", "getProgramInfoLog", "getRenderbufferParameter", "getShaderParameter", "getShaderInfoLog", "getShaderSource", "getTexParameter", "getUniform", "getUniformLocation", "getVertexAttrib"], h = 0; h < w.length; ++h) {
            var R = w[h];
            c[R] = function (t) {
                return function () {
                    return d ? null : t.apply(e, arguments)
                }
            }(c[R])
        }
        for (var F = ["isBuffer", "isEnabled", "isFramebuffer", "isProgram", "isRenderbuffer", "isShader", "isTexture"], h = 0; h < F.length; ++h) {
            var R = F[h];
            c[R] = function (t) {
                return function () {
                    return !d && t.apply(e, arguments)
                }
            }(c[R])
        }
        return c.checkFramebufferStatus = function (t) {
            return function () {
                return d ? e.FRAMEBUFFER_UNSUPPORTED : t.apply(e, arguments)
            }
        }(c.checkFramebufferStatus), c.getAttribLocation = function (t) {
            return function () {
                return d ? -1 : t.apply(e, arguments)
            }
        }(c.getAttribLocation), c.getVertexAttribOffset = function (t) {
            return function () {
                return d ? 0 : t.apply(e, arguments)
            }
        }(c.getVertexAttribOffset), c.isContextLost = function () {
            return d
        }, c.registerOnContextLostListener = function (e) {
            g = f(e)
        }, c.registerOnContextRestoredListener = function (e) {
            d ? b = f(e) : m = f(e)
        }, c
    }
    var f = function (e) {
            window.console && window.console.log && window.console.log(e)
        },
        c = {
            enable: {
                0: !0
            },
            disable: {
                0: !0
            },
            getParameter: {
                0: !0
            },
            drawArrays: {
                0: !0
            },
            drawElements: {
                0: !0,
                2: !0
            },
            createShader: {
                0: !0
            },
            getShaderParameter: {
                1: !0
            },
            getProgramParameter: {
                1: !0
            },
            getVertexAttrib: {
                1: !0
            },
            vertexAttribPointer: {
                2: !0
            },
            bindTexture: {
                0: !0
            },
            activeTexture: {
                0: !0
            },
            getTexParameter: {
                0: !0,
                1: !0
            },
            texParameterf: {
                0: !0,
                1: !0
            },
            texParameteri: {
                0: !0,
                1: !0,
                2: !0
            },
            texImage2D: {
                0: !0,
                2: !0,
                6: !0,
                7: !0
            },
            texSubImage2D: {
                0: !0,
                6: !0,
                7: !0
            },
            copyTexImage2D: {
                0: !0,
                2: !0
            },
            copyTexSubImage2D: {
                0: !0
            },
            generateMipmap: {
                0: !0
            },
            bindBuffer: {
                0: !0
            },
            bufferData: {
                0: !0,
                2: !0
            },
            bufferSubData: {
                0: !0
            },
            getBufferParameter: {
                0: !0,
                1: !0
            },
            pixelStorei: {
                0: !0,
                1: !0
            },
            readPixels: {
                4: !0,
                5: !0
            },
            bindRenderbuffer: {
                0: !0
            },
            bindFramebuffer: {
                0: !0
            },
            checkFramebufferStatus: {
                0: !0
            },
            framebufferRenderbuffer: {
                0: !0,
                1: !0,
                2: !0
            },
            framebufferTexture2D: {
                0: !0,
                1: !0,
                2: !0
            },
            getFramebufferAttachmentParameter: {
                0: !0,
                1: !0,
                2: !0
            },
            getRenderbufferParameter: {
                0: !0,
                1: !0
            },
            renderbufferStorage: {
                0: !0,
                1: !0
            },
            clear: {
                0: !0
            },
            depthFunc: {
                0: !0
            },
            blendFunc: {
                0: !0,
                1: !0
            },
            blendFuncSeparate: {
                0: !0,
                1: !0,
                2: !0,
                3: !0
            },
            blendEquation: {
                0: !0
            },
            blendEquationSeparate: {
                0: !0,
                1: !0
            },
            stencilFunc: {
                0: !0
            },
            stencilFuncSeparate: {
                0: !0,
                1: !0
            },
            stencilMaskSeparate: {
                0: !0
            },
            stencilOp: {
                0: !0,
                1: !0,
                2: !0
            },
            stencilOpSeparate: {
                0: !0,
                1: !0,
                2: !0,
                3: !0
            },
            cullFace: {
                0: !0
            },
            frontFace: {
                0: !0
            }
        },
        l = null;
    return {
        init: e,
        mightBeEnum: r,
        glEnumToString: n,
        glFunctionArgToString: a,
        makeDebugContext: o,
        makeLostContextSimulatingContext: u,
        resetToInitialState: i
    }
}(), WebGLUtils = function () {
    var e = function (e) {
            return '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + e + "</div>"
        },
        t = 'This page requires a browser that supports WebGL.<br/><a href="http://get.webgl.org">Click here to upgrade your browser.</a>',
        r = 'It doesn\'t appear your computer can support WebGL.<br/><a href="http://get.webgl.org">Click here for more information.</a>',
        n = function (n, o, i) {
            function u(n) {
                var a = document.getElementsByTagName("body")[0];
                if (a) {
                    var o = window.WebGLRenderingContext ? r : t;
                    n && (o += "<br/><br/>Status: " + n), a.innerHTML = e(o)
                }
            }
            i = i || u, n.addEventListener && n.addEventListener("webglcontextcreationerror", function (e) {
                i(e.statusMessage)
            }, !1);
            var f = a(n, o);
            return f || i(window.WebGLRenderingContext ? "" : ""), f
        },
        a = function (e, t) {
            for (var r = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], n = null, a = 0; a < r.length; ++a) {
                try {
                    n = e.getContext(r[a], t)
                } catch (e) {}
                if (n) break
            }
            return n
        };
    return {
        create3DContext: a,
        setupWebGL: n
    }
}(), window.requestAnimationFrame || (window.requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e, t) {
        window.setTimeout(e, 1e3 / 60)
    }
}()), window.cancelAnimationFrame || (window.cancelAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.clearTimeout);