/*
 * 网页宠物框架
 * ******************
 * 主要优化:
 *   1.类继承与创建
 *   2.核心功能
 */
/* jshint esversion: 6 */
console.log('%c Pet-UI %c 网页宠物UI框架\n %c作者: 小瑞猫',
    'font-family: "Helvetica Neue",Helvetica, Arial, sans-serif;font-size:64px;color:#FFB6C1;-webkit-text-fill-color:#FFB6C1;-webkit-text-stroke: 1px #FFB6C1;',
    'font-size:25px;color:#FFB6C1;', 'font-size:15px;color:#FFB6C1;');
// 扩展附加
var PetExpand = function () {
    var $ = this;
    // 打字效果
    this.Typing = function () {
        var Ty = Object(function (str, obj, callback, T) {
            var t = T ? T : 100;
            if (Ty.I <= str.length) {
                obj.innerText = str.slice(0, Ty.I++);
                var timer = window.setTimeout(function () {
                    Ty(str, obj, callback, t);
                    window.clearTimeout(timer);
                }, t); //递归调用
            } else {
                Ty.I = 0;
                if (callback == null) {
                    return;
                }
                if (typeof (callback) !== "undefined") {
                    callback();
                }
            }
        });
        Ty.I = 0;
        return Ty;
    };
    // 获得 文本/字节集 的 Src 
    this.SrcFile = function (data) {
        this.aFilePath = [];
        this.aFilePath.push(data);
        this.blob = new Blob(this.aFilePath, {
            type: 'application/octet-binary'
        });
        this.src = window.URL.createObjectURL(this.blob);
    };
    // 动态加载 File
    this.GetFile = (url, callback) => {
        var file;
        $.HTTP.Get({
            url: url,
            responseType: 'blob'
        }, (e, data) => {
            if (e == null) {
                file = new this.SrcFile(data);
                if (callback) {
                    callback(file);
                }
            } else {
                console.warn(e);
            }
        });
        return file;
    };
    // 后台处理模块
    this.DaemonJS = function (JsData, CallBack) {
        var $this = {},
            SrcFile = new $.SrcFile(`
        var $ = this,$Call = console.log; \n
            $.log = $.postMessage;
            $.onmessage = (e) => $Call(e.data,e); \n 
            $.call = (e) => $.postMessage({call:e}) \n` + JsData);
        if (typeof (Worker) !== "undefined") {
            $this = new Worker(SrcFile.src),
                $this.data = [],
                $this.CallBack = CallBack ? CallBack : (...e) => console.log(...e);
            $this.SrcFile = SrcFile;
            // 返回数据处理
            $this.onmessage = (e) => {
                var data = e.data;
                if (data.call) {
                    if (data.call == 'Destroy') {
                        $this.Destroy();
                    }
                } else {
                    $this.data.push(data);
                    ($this.CallBack) && ($this.CallBack(data));
                }
            };
            // 传递消息
            $this.Call = $this.postMessage;
            // 错误处理
            $this.onerror = (error) => {
                console.warn("脚本执行错误:", error);
                $this.Destroy();
            };
            // 设置销毁
            $this.Destroy = () => {
                $this.terminate();
                $this.data.length = 0;
            };
        } else {
            console.log("无法创建后台任务");
        }
        return $this;
    };
    // 单击转双击判定
    this.DoubleClick = function (Click, Double) {
        var $this = this;
        this.look = false;
        this.Dblclick = false;
        return function (...e) {
            if ($this.look) {
                $this.Dblclick = true;
                return;
            }
            $this.look = true;
            var timer = window.setTimeout(function () {
                if (!($this.look)) {
                    return;
                }
                if ($this.Dblclick) {
                    if (typeof (Double) == "function") {
                        Double(...e);
                    }
                } else {
                    if (typeof (Click) == "function") {
                        Click(...e);
                    }
                }
                $this.look = false;
                $this.Dblclick = false;
                window.clearTimeout(timer);
            }, 250);
        };
    };
    // 不规则矩形判定
    this.IsPointInPolygon = function (x, y, coords, width, height) {
        var wn = 0;
        width = width ? width : 1;
        height = height ? height : 1;
        for (var shiftP, shift = coords[1] * height > y, i = 3; i < coords.length; i += 2) {
            shiftP = shift;
            shift = coords[i] * height > y;
            if (shiftP != shift) {
                var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);
                // dot product for vectors (c[0]-x, c[1]-y) . (c[2]-x, c[3]-y)
                if (n * ((coords[i - 3] * width - x) * (coords[i - 0] * height - y) - (coords[i - 2] * height - y) * (coords[i - 1] * width - x)) > 0) {
                    wn += n;
                }
            }
        }
        return wn;
    };
    // 初始化
    this.Position.AddAffair = new this.SetChangeEvent(this.Position, 'Affair');
};
// 设置继承
PetExpand.prototype = (function () {
    var $ = {};
    // HTTP 通信
    //* 调用方式
    //*	option	 -> 参数对象 { url , method , data , timeout , responseType }
    //*	callback -> function(err,result)
    $.HTTP = {
        quest: (option, callback) => {
            var url = option.url;
            var method = option.method;
            var data = option.data;
            var timeout = option.timeout || 0;
            var xhr = null;
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e1) {
                    xhr = new XMLHttpRequest();
                }
            }
            // 返回数据类型
            xhr.responseType = (([
                'text',
                'arraybuffer',
                'blob',
                'document'
            ]).indexOf(option.responseType) != -1) ? option.responseType : 'text';
            if (timeout > 0) {
                xhr.timeout = timeout;
            }
            // 设置回调函数
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        var result = '';
                        switch (xhr.responseType) {
                            case 'text':
                                result = xhr.responseText;
                                try {
                                    result = JSON.parse(xhr.responseText);
                                } catch (e) {}
                                break;
                            case 'document':
                                result = xhr.responseXML;
                                break;
                            default:
                                result = xhr.response;
                        }
                        if (callback) {
                            callback(null, result);
                        }
                    } else {
                        if (callback) {
                            callback('status: ' + xhr.status);
                        }
                    }
                }
            };
            // 打开连接
            xhr.open(method, url, true);
            if (typeof data === 'object') {
                try {
                    data = JSON.stringify(data);
                } catch (e) {}
            }
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
            // 发送数据
            xhr.send(data);
            xhr.ontimeout = function () {
                if (callback) {
                    callback('timeout');
                }
                console.log('%c连%c接%c超%c时', 'color:red', 'color:orange', 'color:purple', 'color:green');
            };
        },
        // get 与 post 通信
        Get: (url, callback) => {
            var option = url.url ? url : {
                url: url
            };
            option.responseType = (([
                'text',
                'arraybuffer',
                'blob',
                'document'
            ]).indexOf(url.responseType ? url.responseType : "") != -1) ? url.responseType : 'text';
            option.method = 'get';
            $.HTTP.quest(option, callback);
        },
        Post: (option, callback) => {
            option.method = 'post';
            $.HTTP.quest(option, callback);
        }
    };
    // 获得网页窗口坐标信息
    $.Position = (function () {
        var $ = {};
        $.Affair = undefined;
        $.Scroll = {
            X: 0,
            Y: 0
        };
        $.Win = {
            Width: 0,
            Height: 0
        };
        // 坐标偏移/限制
        $.WinSkewing = {
            top: 0,
            left: 0,
            Width: 0,
            Height: 0
        };
        $.Uinc = function () {
            // 滚动条位置
            if (self.pageYOffset) {
                $.Scroll.Y = self.pageYOffset;
                $.Scroll.X = self.pageXOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) {
                $.Scroll.Y = document.documentElement.scrollTop;
                $.Scroll.X = document.documentElement.scrollLeft;
            } else if (document.body) {
                $.Scroll.Y = document.body.scrollTop;
                $.Scroll.X = document.body.scrollLeft;
            }
            // 获取窗口宽度
            if (window.innerWidth)
                $.Win.Width = window.innerWidth;
            else if ((document.body) && (document.body.clientWidth)) {
                $.Win.Width = document.body.clientWidth;
            }
            // 获取窗口高度
            if (window.innerHeight)
                $.Win.Height = window.innerHeight;
            else if ((document.body) && (document.body.clientHeight)) {
                $.Win.Height = document.body.clientHeight;
            }
            // 通过深入 Document 内部对 body 进行检测，获取窗口大小
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                $.Win.Height = document.documentElement.clientHeight;
                $.Win.Width = document.documentElement.clientWidth;
            }
            $.Win.Height = $.Win.Height + $.WinSkewing.Height;
            $.Win.Width = $.Win.Width + $.WinSkewing.Width;
            if (typeof $.Affair == "function") {
                $.Affair();
            }
        };
        // 设定更变条件
        window.addEventListener("scroll", $.Uinc);
        window.addEventListener("resize", $.Uinc);
        $.Uinc();
        return $;
    })();
    // Guid 标记获取
    $.Guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    // 平台判定 
    $.IsPC = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };
    // 对象添加事件触发功能
    $.SetChangeEvent = function (obj, event) {
        var $this = this;
        this.Proto = [];
        this.TheDefaultReturn = null;
        this.Transmit = false;
        this.Destroy = function (id) {
            for (var i in $this.Proto) {
                if ($this.Proto[i] == id) {
                    $this.Proto.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        // 保存原函数指针
        try {
            if (typeof obj[event] == "function") {
                this.Proto.push(obj[event]);
            }
            var ret = function (...name) {
                var Ret, i;
                if ($this.TheDefaultReturn != undefined) {
                    Ret = $this.Proto[$this.TheDefaultReturn].call(this, ...name);
                    return Ret;
                }
                try {
                    for (i in $this.Proto) {
                        $this.Proto[i].call(this, ...name);
                        // 传递返回
                        if ($this.Transmit) {
                            $this.Transmit = false;
                            return;
                        }
                    }
                } catch (err) {
                    console.warn(err, "\nID: " + i);
                    $this.Proto.splice(i, 1);
                }
            };
            Object.defineProperty(obj, event, {
                // 改变事件 添加到事件触发数组
                set: function (name) {
                    if (name != undefined) {
                        obj[event + "ID"] = $this.Proto.length;
                        $this.Proto.push(name);
                    }
                },
                // 调用事件 循环调用事件
                get: function () {
                    if ($this.Proto == 1) {
                        return $this.Proto[0];
                    }
                    // 返回 构建数组
                    return ret;
                }
            });
        } catch (err) {
            console.warn(err);
            return null;
        }
    };
    // 对 document 进行 Mousemove 注册
    $.document = {
        Mousemove: null
    };
    // 对 document.Mousemove 初始化
    (function () {
        var ele = document;
        AddHandler = function (type, handler, ...use) {
            if (ele.addEventListener) {
                ele.addEventListener(type, handler, use ? use : false);
            } else if (ele.attachEvent) {
                ele.attachEvent("on" + type, handler, use);
            } else {
                ele["on" + type] = handler;
            }
        };
        E = function (e) {
            e = e || window.event;
            e.buttons = 1;
            if (e.changedTouches) {
                e.clientX = e.changedTouches[0].pageX;
                e.clientY = e.changedTouches[0].pageY;
            }
            return e;
        };
        if ($.IsPC()) {
            AddHandler("mousemove", (e) => ele.Mousemove(e));
        } else {
            AddHandler("touchmove", (e) => ele.Mousemove(E(e)), {
                passive: true
            });
        }
    })();
    $.document.Mousemove = new $.SetChangeEvent(document, 'Mousemove');
    // 对象添加初始化
    $.SetOnload = function (Obj) {
        var $ = this;
        $.Proto = [];
        $.lock = false;
        // 保存之前需要初始化的函数
        if (typeof Obj.onload == "function") {
            $.Proto.push(Obj.onload);
        }
        $.onload = function (...n) {
            $.Param = n;
            $.lock = true;
            for (var i in $.Proto) {
                $.Proto[i](...n);
            }
            $.Proto.splice(0, $.Proto.length);
        };
        Obj.onload = $.onload;
        // 添加扩展
        Object.defineProperty(Obj, 'onload', {
            // 改变事件 添加到事件触发数组
            set: function (name) {
                if (typeof name != "function") {
                    return;
                }
                if ($.lock) {
                    name(...$.Param);
                } else {
                    $.Proto.push(name);
                }
            },
            get: function () {
                console.warn("函数: onload -> 错误调用 重复初始化");
            }
        });
    };
    // 框架初始化
    $.onload = new $.SetOnload(window);
    return $;
})();
// 插件模块
var PetPlugIn = function () {
    // 插件列表
    this.Queue = [];
    // 依赖设定
    this.Expand = new PetExpand();
};
// 插件模块-加载插件
PetPlugIn.prototype.Manage = function (object, JsSrc, isolation) {
    var $ = this;
    var i = $.Queue.length;
    // 通信 JS 插件数据
    this.Expand.HTTP.Get({
        url: JsSrc
    }, function (err, JsData) {
        if (err == null) {
            (function () {
                // 插件功能定义
                PligIn = function (pligIn) {
                    $.Queue[i] = {
                        Call: (function () {
                            pligIn(object);
                        }),
                        JsSrc: JsSrc
                    };
                    $.Queue[i].CallReturn = $.Queue[i].Call();
                };
                if (isolation) {
                    // 隔离执行插件.
                    this.Expand.DaemonJS(JsData, object);
                } else {
                    // 非隔离执行插件.
                    (new Function(JsData))();
                }
            })();
        } else {
            console.warn("插件加载错误: ", err, "\n插件路径:", JsData)
        }
    });
};
// PetUI 框架
var PetUI = (function () {
    var $ = {},
        Exp = new PetExpand();
    // UI - Style 事件拦截
    $.UI_Tackl_Style = function (style, call) {
        // 触发事件回调
        var Call = {
                set: () => {},
                get: () => {}
            },
            $ = this;
        if (call) {
            if (call.set) {
                Call.set = call.set;
            }
            if (call.get) {
                Call.get = call.get;
            }
        }
        var st = style;
        Object.defineProperty($.style, st, {
            set: function (name) {
                $.style = $.style.cssText + st + ":" + name;
                Call.set();
            },
            get: function () {
                var style = $.style.cssText;
                var arr = style.match(RegExp(st + ":(.*?);"));
                if (arr != null) {
                    arr = arr[0].match(/:\s(.*?);/);
                    return arr[arr.length - 1].toString();
                }
                Call.get();
                return "";
            }

        });
        return Call;
    };
    // style 设置函数
    $.CSS = function (style) {
        var typ = typeof style;
        if (typ == "object") {
            var css = "";
            if (this.style) {
                for (var x in style) {
                    css += ";" + x + ":" + style[x];
                }
            }
            if (css != "") {
                this.style.cssText += css;
            }
        } else if (typ == "string") {
            this.style = this.cssText + ";" + style;
        }
        return this;
    };
    // 删除元素函数
    $.Destroy = function () {
        // 处理元素删除
        (this.parentNode).removeChild(this);
    };
    // 添加到元素
    $.Child = function () {
        var to = this.toString();
        // 添加到父对象
        if (to != "[object Object]" || to != "[object Window]") {
            document.body.appendChild(this);
        }
        return this;
    };
    var $UI = function (...Param) {
        var Ele = null,
            MousemoveID = null,
            // 创建元素
            Create = (P) => {
                // 创建元素
                if (typeof P != "string") {
                    return null;
                }
                try {
                    Ele = document.createElement(P);
                    // 继承创建
                    Ele.$ = $UI;
                    // 保留参数
                    Ele.__PetUI__ = {};
                    // 添加ID
                    Ele.id = Exp.Guid();
                    // 注册事件
                    Ele.Element = (function () {
                        var $ = { // 保证坐标
                                GuaranteeCoords: function () {
                                    var Gua = {
                                        Offset: {
                                            Top: 0,
                                            Left: 0
                                        }
                                    };
                                    var Top = 0,
                                        Left = 0,
                                        ParentNode = null;
                                    $.GuaranteeCoords = Gua;
                                    // 开启还原
                                    Gua.EnablementUndo = false;
                                    // 设置
                                    Gua.Save = () => {
                                        if (Gua.EnablementUndo) {
                                            ParentNode = Ele.UI_Ele_Father && Ele.UI_Ele_Father != document.body ? Ele.UI_Ele_Father : {
                                                offsetHeight: Exp.Position.Win.Height, // 高度
                                                offsetWidth: Exp.Position.Win.Width // 宽度
                                            };
                                            Top = (Ele.offsetTop + parseInt(Ele.offsetHeight / 2)) / ParentNode.offsetHeight;
                                            Left = (Ele.offsetLeft + parseInt(Ele.offsetWidth / 2)) / ParentNode.offsetWidth;
                                        }
                                    };
                                    // 保证记录坐标
                                    (Ele.UI_Tackl_Style("top")).set = Gua.Save;
                                    (Ele.UI_Tackl_Style("left")).set = Gua.Save;
                                    // 还原
                                    Gua.Recovery = () => {
                                        if (Gua.EnablementUndo) {
                                            ParentNode = Ele.UI_Ele_Father && Ele.UI_Ele_Father != document.body ? Ele.UI_Ele_Father : {
                                                offsetHeight: Exp.Position.Win.Height,
                                                offsetWidth: Exp.Position.Win.Width
                                            };
                                            Ele.style = Ele.style.cssText + 'top:' + parseInt(Top * ParentNode.offsetHeight - parseInt(Ele.offsetWidth / 2) + Gua.Offset.Top) + "px;left:" + parseInt(Left * ParentNode.offsetWidth - parseInt(Ele.offsetHeight / 2) + Gua.Offset.Left) + "px;";
                                        }
                                    };
                                    // 自适应
                                    Exp.Position.Affair = Gua.Recovery;
                                    // 销毁自适应
                                    Gua.RemoveAdaptio = () => (Exp.Position.AddAffair.Destroy($.Recovery));
                                    return Gua;
                                },
                                // 开启移动
                                MobileEvent: function () {
                                    // 注册事件
                                    $.Set_Element();
                                    var Mobile = {
                                            // 移动锁
                                            MouseDown: false,
                                            // 是否可移动
                                            EnablementRemovable: false,
                                            // 移动回调
                                            TheMouseCallback: () => {},
                                        }, // 移动坐标
                                        Page = {
                                            X: 0,
                                            Y: 0
                                        };
                                    // 单击事件
                                    $[Exp.IsPC() ? 'Mousedown' : 'Click'] = (e) => {
                                        e = e || window.event;
                                        e.preventDefault && e.preventDefault();
                                        if (Mobile.MouseDown) {
                                            return;
                                        }
                                        if (Mobile.EnablementRemovable) {
                                            // 将Mouse事件锁定到指定元素上
                                            e.setCapture && e.setCapture();
                                            Mobile.MouseDown = true;
                                            // 记录坐标
                                            Page.X = e.clientX - parseInt(Ele.offsetLeft);
                                            Page.Y = e.clientY - parseInt(Ele.offsetTop);
                                            PetExpand.prototype.document.Mousemove.TheDefaultReturn = MousemoveID;
                                        }
                                    };
                                    // 释放事件
                                    $.Mouseup = (e) => {
                                        e = e || window.event;
                                        Mobile.MouseDown = false;
                                        $.GuaranteeCoords.Save && $.GuaranteeCoords.Save();
                                        e.releaseCapture && e.releaseCapture();
                                        PetExpand.prototype.document.Mousemove.TheDefaultReturn = null;
                                    };
                                    // 移动事件
                                    $.Mousemove = function (e) {
                                        e = e || window.event;
                                        Mobile.TheMouseCallback();
                                        e.preventDefault && e.preventDefault();
                                        var button = e.buttons || e.button;
                                        if (!Mobile.MouseDown) {
                                            return;
                                        }
                                        if (button == 1 || button == 3) {
                                            if (Mobile.EnablementRemovable) {
                                                $.ElementInherit.Mousemove.Transmit = true;
                                                var ParentNode = Ele.parentNode && Ele.parentNode != document.body ? Ele.parentNode : {
                                                    offsetWidth: Exp.Position.Win.Width,
                                                    offsetHeight: Exp.Position.Win.Height,
                                                    offsetTop: Exp.Position.WinSkewing.top,
                                                    offsetLeft: Exp.Position.WinSkewing.left
                                                };
                                                var X = (e.clientX - Page.X);
                                                var Y = (e.clientY - Page.Y);
                                                if (X + Ele.offsetWidth > ParentNode.offsetWidth ||
                                                    Y > ParentNode.offsetHeight - Ele.offsetHeight ||
                                                    Y < ParentNode.offsetTop ||
                                                    X < ParentNode.offsetLeft) {
                                                    return;
                                                }
                                                Ele.CSS({
                                                    top: Y + 'px',
                                                    left: X + 'px'
                                                });
                                            }
                                            return;
                                        }
                                        $.GuaranteeCoords.Save && $.GuaranteeCoords.Save();
                                        // 释放
                                        Mobile.MouseDown = false;
                                        e.releaseCapture && e.releaseCapture();
                                        PetExpand.prototype.document.Mousemove.TheDefaultReturn = null;
                                    };
                                    // 注册 移动 骚操作
                                    if (Exp.IsPC()) {
                                        document.Mousemove = $.Mousemove;
                                        MousemoveID = document.MousemoveID;
                                    }
                                    // 销毁 移动 骚操作
                                    // Exp.document.Mousemove.Destroy($.Mousemove);
                                    // 返回数据 
                                    $.MobileEvent = Mobile;
                                    return Mobile;
                                }
                            },
                            Exp = new PetExpand();
                        // 支持事件类型
                        $.Click = (e) => {}; // 单击事件
                        $.Dblclick = (e) => {}; // 双击事件
                        $.Mousedown = (e) => {}; // 右击事件(电脑端)
                        // 释放事件
                        $.Mouseup = (e) => {};
                        // 移出事件(电脑端)
                        $.Mouseout = (e) => {};
                        // 移动事件
                        $.Mousemove = (e) => {};
                        // 开启继承
                        $.ElementInherit = {
                            Click: new Exp.SetChangeEvent($, "Click"),
                            Dblclick: new Exp.SetChangeEvent($, "Dblclick"),
                            Mousedown: new Exp.SetChangeEvent($, "Mousedown"),
                            Mouseup: new Exp.SetChangeEvent($, "Mouseup"),
                            Mouseout: new Exp.SetChangeEvent($, "Mouseout"),
                            Mousemove: new Exp.SetChangeEvent($, "Mousemove"),
                        };
                        // ********************************
                        // 元素隐藏/显示
                        $.Display = function (state) {
                            if (state == undefined) {
                                return Ele.style.display != 'none';
                            }
                            if (state) {
                                Ele.style.display = 'inline';
                            } else {
                                Ele.style.display = 'none';
                            }
                            return state;
                        };
                        // 注册事件
                        $.AddHandler = function (type, handler, ...use) {
                            if (Ele.addEventListener) {
                                Ele.addEventListener(type, handler, use ? use : false);
                            } else if (Ele.attachEvent) {
                                Ele.attachEvent("on" + type, handler, use);
                            } else {
                                Ele["on" + type] = handler;
                            }
                        };
                        // 创建/销毁 默认事件
                        var click = null;
                        if (Exp.IsPC()) {
                            click = new Exp.DoubleClick(
                                (e) => $.Click(e),
                                (e) => $.Dblclick(e)
                            );
                            $.Set_Element = () => {
                                $.AddHandler("click", click);
                                $.AddHandler("mouseup", (e) => $.Mouseup(e));
                                $.AddHandler("mouseout", (e) => $.Mouseout(e));
                                $.AddHandler("mousedown", (e) => $.Mousedown(e));
                                $.AddHandler("mousemove", (e) => $.Mousemove(e));
                            };
                            $.Remove_Element = () => {
                                $.AddHandler("click", undefined);
                                $.AddHandler("mouseup", undefined);
                                $.AddHandler("mouseout", undefined);
                                $.AddHandler("mousedown", undefined);
                                $.AddHandler("mousemove", undefined);
                            };
                        } else {
                            var Mouseup = (e) => $.Mouseup(E(e)),
                                Mousemove = (e) => $.Mousemove(E(e));
                            var E = function (e) {
                                e = e || window.event;
                                e.buttons = 1;
                                if (e.changedTouches) {
                                    e.clientX = e.changedTouches[0].pageX;
                                    e.clientY = e.changedTouches[0].pageY;
                                }
                                return e;
                            };
                            // 增加处理
                            click = new Exp.DoubleClick(
                                (e) => $.Click(E(e)),
                                (e) => $.Dblclick(E(e))
                            );
                            $.Set_Element = () => {
                                // 手指触摸
                                $.AddHandler("touchstart", click, {
                                    passive: true
                                });
                                // 手指离开
                                $.AddHandler("touchend", Mouseup, {
                                    passive: true
                                });
                                // 手指移动
                                $.AddHandler("touchmove", Mousemove, {
                                    passive: true
                                });
                            };
                            $.Remove_Element = () => {
                                // 手指触摸
                                $.AddHandler("touchstart", undefined, {
                                    passive: true
                                });
                                // 手指离开
                                $.AddHandler("touchend", undefined, {
                                    passive: true
                                });
                                // 手指移动
                                $.AddHandler("touchmove", undefined, {
                                    passive: true
                                });
                            };
                        }
                        return $;
                    })();
                    // 继承类
                    for (var i in $) {
                        Ele[i] = $[i];
                    }
                    return "";
                } catch (err) {
                    return null;
                }
            };
        try {
            // UI 创建
            switch (Param.length) {
                case 1:
                    switch (typeof Param[0]) {
                        case "string":
                            if (Create(Param[0]) == null) {
                                throw "Pet-UI 无法创建元素: " + Param[0];
                            } else {
                                //-> 将 Ele 添加到 this
                                if (this.__PetUI__) {
                                    this.appendChild(Ele);
                                }
                            }
                            break;
                        case "object":
                            if (Param[0].toString() != "[object Object]") {
                                this.appendChild(Param[0]);
                            } else if (Param[0].CSS && typeof Param[0].CSS === "string") {
                                this.CSS(Param[0].CSS);
                                return this;
                            }
                            break;
                    }
                    break;
                default:
                    // 递归创建
                    var retdiv = $UI(Param.shift()),
                        div = retdiv;
                    while (Param.length != 0) {
                        if (typeof Param[0] === "object") {
                            div.$(Param.shift());
                            // div = retdiv;
                        } else {
                            div = div.$(Param.shift());
                        }
                    }
                    return retdiv;
            }
            // 添加到父对象
            if (Ele) {
                return Ele;
            }
            var to = this.toString();
            if (to == "[object Object]" && to == "[object Window]") {
                return this;
            } else {
                throw ["UI 创建元素失败", ...Param];
            }
        } catch (err) {
            console.warn("PetUI\n错误类型:", err);
            return null;
        }
    };
    return $UI;
})();