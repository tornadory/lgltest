function Assembly() {
    this.domList = {};
    this.eventList = [];
    this.viewObj = {};
    this.data = {};
};
Assembly.prototype = {
    constructor: Assembly,
    getDomObj: function (dom) {
        throw new Error("getDomObj方法必须重写");
    },
    render: function (fn) {
        throw new Error("render方法必须重写");
    },
    removeEventListeners: function () {
        var domList = this.domList, eventList = this.eventList;

        for (var i = 0, len = eventList.length; i < len; i++) {
            var eventObj = eventList[i];
            var dom = domList[eventObj.key];
            var eventArray = eventObj.eventArray;
            for (var j = 0, length = eventArray.length; j < length; j++) {
                var methodEventObj = eventArray[j];
                var key = methodEventObj.method;
                var fnArray = methodEventObj.fnArray;
                for (var ii = 0; ii < fnArray.length; ii++) {
                    dom.removeEventListener(key, fnArray[ii].doFn, fnArray[ii].propation);
                }
            }
        }
        this.eventList.length = 0;
    },
    addEventListeners: function () {
        var domList = this.domList, eventList = this.eventList;

        for (var i = 0, len = eventList.length; i < len; i++) {
            var eventObj = eventList[i];
            var dom = domList[eventObj.key];
            var eventArray = eventObj.eventArray;
            for (var j = 0, length = eventArray.length; j < length; j++) {
                var methodEventObj = eventArray[j];
                var key = methodEventObj.method;
                var fnArray = methodEventObj.fnArray;
                for (var ii = 0; ii < fnArray.length; ii++) {
                    dom.addEventListener(key, fnArray[ii].doFn, fnArray[ii].propation);
                }
            }
        }
    },
    removeDom: function () {
        var domList = this.domList;

        for (var key in domList) {
            domList[key] = null;
        }
    },
    attachDom: function (cssQuery, key, dom) {
        dom = dom || document;
        this.domList[key] = dom.querySelector(cssQuery);
        return this;
    },
    attachEvent: function (key, eventStr, fn, propation, doFn) {
        propation = propation || false;
        var eventList = this.eventList;
        doFn = doFn || fn.bind(this);
        var eventObj = Assembly.getEvent(eventList, { key: key });
        if (eventObj) {
            var eventArray = eventObj.eventArray;
            var methodEventObj = Assembly.getEvent(eventArray, { method: eventStr });
            if (methodEventObj) {
                var fnArray = methodEventObj.fnArray;
                var obj = Assembly.getEvent(fnArray, { backFn: fn, propation: propation })
                if (!obj) {
                    fnArray.push({
                        backFn: fn, propation: propation,
                        doFn: doFn
                    });
                }
            }
            else {
                eventArray.push({
                    method: eventStr,
                    fnArray: [{ backFn: fn, propation: propation, doFn: doFn }]
                })
            }
        }
        else {
            eventList.push({
                key: key,
                eventArray: [
                    {
                        method: eventStr,
                        fnArray: [{ backFn: fn, propation: propation, doFn: doFn }]
                    }
                ]
            })
        }
        return this;
    },
    attachTap: function (key, fn, propation, hardTapFn) {
        propation = true;
        var moving = false, touched = false;
        var startTime, hardtapId = null;
        
        if ("ontouchstart" in document.body) {
            this.attachEvent(key, "touchstart", touchstart, propation);
            this.attachEvent(key, "touchmove", touchmove, propation);
            this.attachEvent(key, "touchend", touchend, propation);
            this.attachEvent(key, "tap", fn, propation);

            if (hardTapFn) {
                this.attachEvent(key, "hardtap", hardTapFn, propation);
                this.attachEvent(key, "contextmenu", function (ev) {ev.preventDefault(); ev.stopPropagation();}, true);
            }
        }
        else {
            this.attachEvent(key, "click", fn, propation);
        }

        function touchstart(ev) {
            touched = true;
            var target = ev.target;
            if (hardTapFn) {
                hardtapId = setTimeout(function () {
                    target.dispatchEvent(Assembly.hardTapEvent);
                    moving = true;
                }, 500);
             }
        }

        function touchmove(ev) {
            if (touched) {
                moving = true;
            }
        }

        function touchend(ev) {
            // 防止触发默认自带的touchend事件
            ev.preventDefault();
            var target = ev.target;
            if (!moving) {
                clearTimeout(hardtapId);
                target.dispatchEvent(Assembly.tapEvent);
                setTimeout(function () {
                    if (target.focus) {
                        target.focus();
                    }
                }, 50);
            }
            touched = false;
            moving = false;
        }
        return this;
    },
    attachSlide: function (key, nodeName, startFn,  fn, endFn, propation, slideFn) {
        slideFn = slideFn || function (x, y) { return x == 0 || Math.abs(y) / Math.abs(x) > 1}
        var that = this;
        var isScroll = undefined;
        var touched = false, slide = false;
            touchObj = {x: 0, y: 0}, startObj = {},
            target = null, yesTarget = null;

        this.attachEvent(key, "touchstart", slidestart, propation);
        this.attachEvent(key, "touchmove", slidemove, propation);
        this.attachEvent(key, "touchend", slideend, propation);

        function slidestart(ev) {
            touched = true;
            startObj = {
                x: ev.touches[0].clientX,
                y: ev.touches[0].clientY
            };
            target = Assembly.getNodeName(ev.target, nodeName);
            if (yesTarget != null && yesTarget != target) {
                startFn.call(that, yesTarget);
            }
            yesTarget = target;
        }

        function slidemove(ev) {
            var moveTarget = Assembly.getNodeName(ev.target, nodeName);
            if (touched && moveTarget == target) {
                
                touchObj = {
                    x: ev.changedTouches[0].clientX - startObj.x,
                    y: ev.changedTouches[0].clientY - startObj.y
                };

                if (isScroll === undefined) {
                    if (slideFn(touchObj.x, touchObj.y)) {
                        isScroll = true;
                    }
                    else {
                        isScroll = false;
                        ev.preventDefault();
                    }
                }
                else if (isScroll === false) {
                    ev.preventDefault();
                    fn.call(that, moveTarget, touchObj);
                }
                
                slide = true;
            }
        }
        
        function slideend(ev) {
            touched = false;
            touchObj = {
                x: ev.changedTouches[0].clientX - startObj.x,
                y: ev.changedTouches[0].clientY - startObj.y
            };
            if (slide && isScroll === false) {
                endFn.call(that, target, touchObj);
            }
            slide = false;
            isScroll = undefined;
            touchObj = {x: 0, y: 0};
        }

        return this;
    },
    initialize: function (dom) {
        this.getDomObj(dom);
        if (this.init) {
            this.init();
        }
        this.addEventListeners();
    },
    dispose: function () {
        if (this.unit) {
            this.unit();
        }
        this.removeEventListeners();
        this.removeDom();
    },
    getNeedObj: function () {
        return null;
    }
};
Assembly.create = function (name, options) {
    var assembly = new Assembly();
    assembly.name = name;
    return Page.extend(assembly, options);
};
Assembly.getEvent = function (list, obj) {
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var value = true;
        for (var k in obj) {
            var tempValue = (item[k] === obj[k]);
            value = value && tempValue;
        }
        if (value) return list[i];
    }
    return false;
};
Assembly.getNodeName = function (target, nodeName) {
    while (target.nodeName.toUpperCase() != nodeName) {
        target = target.parentNode;
        if (target == null) {
            return null;
        }
    }
    return target;
};
Assembly.tapEvent = (function () {
    var tapEvent = document.createEvent("CustomEvent");
    tapEvent.initCustomEvent("tap", true, false, "");
    return tapEvent;
})();
Assembly.hardTapEvent = (function () {
    var tapEvent = document.createEvent("CustomEvent");
    tapEvent.initCustomEvent("hardtap", true, false, "");
    return tapEvent;
})();

function PopUp(page, option) {
    this.option = option || {};
    this.page = page;
    this.maskDiv = document.createElement("div");
    this.maskDiv.className = "popup-mask";
    var that = this;
    if (this.option.maskClickCancel) {
        Page.attachTap(this.maskDiv, function (ev) {that.hidden();}, false);
    }
    this.domElement = document.createElement("div");
    this.domElement.className = "popup";
    this.isShow = false;
};
PopUp.prototype = {
    constructor: PopUp,
    show: function () {
        var that = this;
        this.isShow = true;
        this.page.render(function (html) {
            that.domElement.innerHTML = html;
            that.domElement.appendChild(that.maskDiv);
            document.body.appendChild(that.domElement);

            that.cancelScrollEvent(that.domElement);
            
            that.page.initialize(that.domElement);
        });
    },
    hidden: function () {
        if (!this.isShow) return;
        this.isShow = false;
        var domElement = this.domElement;
        if (this.hiddenFn) {
            this.hiddenFn();
        }
        domElement.parentNode.removeChild(domElement);
        this.page.dispose();
    },
    changePage: function (page) {
        this.page = page;
    },
    cancelScrollEvent: function (dom) {
        dom.addEventListener("touchmove", this.cancelEvent, false);
        if (dom.onmousewheel !== undefined) {
            dom.addEventListener("mousewheel", this.cancelEvent, false);
        }
        else {
            dom.addEventListener("DOMMouseScroll", this.cancelEvent, false);
        }
    },
    restoreScrollEvent: function (dom) {
        dom.removeEventListener("touchmove", this.cancelEvent, false);
        if (dom.onmousewheel !== undefined) {
            dom.removeEventListener("mousewheel", this.cancelEvent, false);
        }
        else {
            dom.removeEventListener("DOMMouseScroll", this.cancelEvent, false);
        }
    },
    cancelEvent: function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }
};

function ConfirmBox(title, content, option) {
    var that = this;
    this.option = option;
    this.title = title;
    this.content = content;
    this.page = Page.create("", "", {
        render: function (fn) {
            fn(Page.confirmHTML.replace("$title", that.title)
                .replace("$content", that.content));
        },
        getDomObj: function (dom) {
            this.attachDom(".confirm-primary-btn", "sure", dom)
                .attachDom(".confirm-cancel-btn", "cancel", dom)
                .attachTap("sure", this.sureHandler, false)
                .attachTap("cancel", this.cancelHandler, false);
        },
        sureHandler: function (ev) {
            that.hidden();
            if (that.fn) {
                that.fn();
            }
        },
        cancelHandler: function (ev) {
            that.hidden();
        }
    });
    this.maskDiv = document.createElement("div");
    this.maskDiv.className = "confirm-mask";
    this.domElement = document.createElement("div");
    this.domElement.className = "confirm";
}
ConfirmBox.prototype = Object.create(PopUp.prototype);
ConfirmBox.prototype.changeFn = function (fn) {
    this.fn = fn;
};
ConfirmBox.prototype.changeTitle = function (title) {
    this.title = title;
};
ConfirmBox.prototype.changeContent = function (content) {
    this.content = content;
};

function Loader(str) {
    this.str = str || "";
    var that = this;
    this.page = Page.create("", "", {
        render: function (fn) {
            fn('<div class="loader-container"><div class="roundLoader"></div>' + that.str + "</div>");
        },
        getDomObj: function (dom) {}
    });
    this.maskDiv = document.createElement("div");
    this.maskDiv.className = "loader-mask";
    this.domElement = document.createElement("div");
    this.domElement.className = "loader";
}
Loader.prototype = Object.create(PopUp.prototype);
Loader.prototype.changeStr = function (str) {
    this.str = str;
}

function Page(title, url) {
    this.title = title;
    this.url = url;
    this.assemblyList = [];
    this.xhrList = [];
    this.modalList = [];
    Assembly.call(this);
}
Page.prototype = Object.create(Assembly.prototype);
Page.prototype.constructor = Page;
Page.prototype.addEventListener = function (key, eventStr, fn, propation) {
    var dnFn = fn.bind(this);
    this.attachEvent(key, eventStr, fn, propation, dnFn);
    this.domList[key].addEventListener(eventStr, dnFn, propation);
    return this;
};
Page.prototype.initAssembly = function (env) {
    var that = this;
    env = env || Page;
    var assemblyList = this.assemblyList;
    for (var i = 0, len = assemblyList.length; i < len; i++) {
        var assembly = assemblyList[i];
        var fn = env[assembly.name];
        var prop = assembly.prop.split(/,\s*/);
        var dom = document.getElementById(assembly.id);
        var obj = assembly.obj = fn.apply(this, prop);
        obj.render(function (html) {
            var parentNode = dom.parentNode;
            dom.outerHTML = html;
            var needObj = obj.getNeedObj();
            if (needObj) {
                var fnList = needObj.fn;
                var dataList = needObj.data;
                for (var i = 0; i < fnList.length; i++) {
                    var fnName = fnList[i];
                    if (!that[fnName]) console.log("需要实例对象实现该接口" + fnName);
                }
                for (i = 0; i < dataList.length; i++) {
                    var dataName = dataList[i];
                    if (!that.data[dataName]) console.log("需要实例对象实现该数据" + dataName);
                }
            }
            
            obj.initialize(parentNode);
        })
    }
};
Page.prototype.showConfirmBox = function (title, content, fn) {
    var that = this;
    var confirmBox = Page.confirmBox;
    confirmBox.changeTitle(title);
    confirmBox.changeContent(content);
    confirmBox.changeFn(fn);
    confirmBox.show();
    confirmBox.hiddenFn = function () {
        confirmBox.hiddenFn = null;
        var index = that.modalList.indexOf(confirmBox);
        that.modalList.splice(index, 1);
    };
    this.modalList.push(confirmBox);
};
Page.prototype.unitAssembly = function () {
    var assemblyList = this.assemblyList;
    for (var i = 0, len = assemblyList.length; i < len; i++) {
        var assembly = assemblyList[i];
        obj = assembly.obj;
        obj.dispose();
    }
    this.assemblyList.length = 0;
};
Page.prototype.showPopup = function (popUp) {
    var that = this;
    popUp.show();
    popUp.hiddenFn = function () {
        popUp.hiddenFn = null;
        var index = that.modalList.indexOf(popUp);
        that.modalList.splice(index, 1);
    };
    that.modalList.push(popUp);
},
Page.prototype.hiddenPopup =  function (popUp) {
    popUp.hidden();
},
Page.prototype.initialize = function (dom) {
    this.getDomObj(dom);
    this.initAssembly();
    if (this.init) {
        this.init();
    }
    this.addEventListeners();
};
Page.prototype.dispose = function () {
    if (this.unit) {
        this.unit();
    }
    this.unitModel();
    this.abortXhr();
    this.unitAssembly();
    this.removeEventListeners();
    this.removeDom();
};
Page.prototype.getAssemblyByName = function (name) {
    var objArray = this.assemblyList;
    for (var i = 0, len = objArray.length; i < len; i++) {
        var assembly = objArray[i].obj;
        if (assembly.name == name) {
            return assembly;
        }
    }
    return null;
};
Page.prototype.unitModel = function () {
    var modalList = this.modalList;
    for (var i = 0, len = modalList.length; i < len; i++) {
        modalList[i].hidden();
    }
};
Page.prototype.post =function (url, data, fn) {
    var xhr = new XMLHttpRequest();
    var xhrList = this.xhrList;
    xhrList.push(xhr);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        var index = xhrList.indexOf(xhr);
        xhrList.splice(index, 1);
        fn(JSON.parse(xhr.responseText));
    };
    xhr.send(Page.serialize(data));
};
Page.prototype.get = function (url, fn) {
    var xhrList = this.xhrList;
    var xhr = new XMLHttpRequest();
    xhrList.push(xhr);
    xhr.open("GET", url, true);
    xhr.onload = function () {
        var index = xhrList.indexOf(xhr);
        xhrList.splice(index, 1);
        fn(xhr.responseText);
    }
    xhr.send(null);
}
Page.prototype.abortXhr = function () {
    var xhrList = this.xhrList;
    for (var i = 0, len = xhrList.length; i < len; i++) {
        xhrList[i].abort();
    }
},
Page.prototype.showLoader = function (str) {
    str = str || "正在加载中...";
    var that = this;
    var loader = Page.loader;
    loader.changeStr(str);
    loader.show(this.changeDom);
    loader.hiddenFn = function () {
        loader.hiddenFn = null;
        var index = that.modalList.indexOf(loader);
        that.modalList.splice(index, 1);
    };
    this.modalList.push(loader);
};
Page.prototype.hiddenLoader = function () {
    Page.loader.hidden();
};
Page.prototype.renderHTML = (function () {
    var compare = {
        "==": function (left, right) { return left == right; },
        ">=": function (left, right) { return left >= right; },
        "<=": function (left, right) { return left <= right; },
        "<": function (left, right) { return left < right; },
        ">": function (left, right) { return left > right; }
    };

    function attachAssembly(page, obj, str) {
        var pattern = /{{assembly\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\((.*?)\)}}/;
        var testArray = pattern.exec(str);
        var now = Date.now();

        while (testArray) {
            var id = "a" + now + parseInt(Math.random() * 1000);
            var name = testArray[1];
            var propStr = testArray[2];
            str = str.replace(testArray[0], '<div id="' + id + '"></div>');
            page.assemblyList.push({
                id: id,
                name: name,
                prop: propStr ? render(propStr, obj, false, false, false): ""
            });
            testArray = pattern.exec(str);
        }

        return str;
    }

    function attachArray(obj, str) {
        var eachArray = [];
        var eachIndex = 0;

        var eachExp = getExp(str);
        var testArray = eachExp.exec(str);
        while (testArray) {
            var testStr = testArray[0];
            str = str.replace(testStr, "$each" + eachIndex++);
            eachArray.push({
                context: obj,
                str: testStr
            });
            eachExp = getExp(str);
            testArray = eachExp.exec(str);
        }
        for (var i = 0; i < eachArray.length; i++) {
            str = str.replace("$each" + i, renderArray(eachArray[i].str, eachArray[i].context));
        }

        return str;
    }

    function getExp(str) {
        var eachExp;
        var a = /{{each\s+.*?}}(.*?({{each\s+.*?}}.*?{{\/each}})+.*?){{\/each}}/;
        var b = /{{each\s+.*?}}(.*?({{each\s+.*?}}.*?{{\/each}})*.*?){{\/each}}/;
        var testArray = a.exec(str);
        if (testArray) {
            var test = testArray[1];
            var eachIndex = test.indexOf("{{each");
            var endEachIndex = test.indexOf("{{/each}}");
            if (eachIndex < endEachIndex) {
                return a;
            }
            else {
                return b;
            }
        }
        else {
            return b;
        }
    }

    function attachIf(obj, str) {
        var ifArray = [];
        var ifIndex = 0;
        var ifExp = /{{if\s+.*?}}(.*?((?:{{elseif\s+.*?}}.*?)*)({{else}}.*?)*){{\/if}}/;
        var testArray = ifExp.exec(str);
        while (testArray) {
            var testStr = testArray[0];
            str = str.replace(testStr, "$if" + ifIndex++);
            ifArray.push({
                context: obj,
                str: testStr
            });
            testArray = ifExp.exec(str);
        }

        for (var i = 0; i < ifArray.length; i++) {
            str = str.replace("$if" + i, renderIf(ifArray[i].str, ifArray[i].context));
        }

        return str;
    }

    function render(str, obj, checkAssembly, checkArray, checkIf) {
        obj = obj || this.data;
        if (checkAssembly === undefined) checkAssembly = true;
        if (checkArray === undefined) checkArray = true;
        if (checkIf === undefined) checkIf = true;

        str = str.replace(/\s\s+/g, " ");

        if (checkAssembly) str = attachAssembly(this, obj, str);
        
        if (checkArray) str = attachArray(obj, str);

        if (checkIf) str = attachIf(obj, str);

        var newStr = str.replace(/{{[a-zA-Z_$]+[\.0-9a-zA-Z_$]*}}/g, function (match) {
            return getProperty(obj, match.slice(2, -2));
        });

        return newStr;
    }

    function renderIf(str, obj) {
        var ifExp = /{{if\s+(.*?)}}(?:(.*?)((?:{{elseif\s+.*?}}.*?)*)(?:{{else}}(.*?))?){{\/if}}/;
        var testArray = ifExp.exec(str);
        if (testArray) {
            var ifTest = testArray[1], ifContent = testArray[2];
            var elseIfStr = testArray[3];
            var elseTest = testArray[4];
            
            var elseIfArray = [];
            var elseIfContent = [];
            if (elseIfStr) {
                elseIfContent = elseIfStr.split(/{{elseif\s+.*?}}/).slice(1);
                var exp = /{{elseif\s+(.*?)}}/g;
                var testExp = exp.exec(elseIfStr);
                while (testExp) {
                    elseIfArray.push(testExp[1]);
                    testExp = exp.exec(elseIfStr);
                }
            }

            var tArray = [ifTest].concat(elseIfArray);
            var cArray = [ifContent].concat(elseIfContent);

            var result;
            for (var i = 0, len = tArray.length; i < len; i++) {
                if (compute(obj, tArray[i])) {
                    result = render(cArray[i], obj, false, false);
                    break;
                }
            }

            if (result) return result;
            else if (elseTest) return render(elseTest, obj, false, false);
        }
        return "";
    }

    function compute(obj, str) {
        var testExp = /(.*?)\s+(==|>=|<=|>|<)\s+(.*)/;
        var testArray = testExp.exec(str);
        if (testArray) {
            var left = testArray[1], operation = testArray[2], right = testArray[3];
            var computeLeft = getProperty(obj, left);
            if (operation && right) {
                return compare[operation](computeLeft, right);
            }
            else {
                return computeLeft;
            }
        }
    }

    function renderArray(str, obj) {
        var eachExp;

        if (/{{each\s+.*?}}(.*?({{each\s+.*?}}.*?{{\/each}})+.*?){{\/each}}/.test(str)) {
            eachExp = /{{each\s+([a-zA-Z_$]+[\.0-9a-zA-Z_$]*)}}(.*?({{each\s+.*?}}.*?{{\/each}})+.*?){{\/each}}/;
        }
        else {
            eachExp = /{{each\s+([a-zA-Z_$]+[\.0-9a-zA-Z_$]*)}}(.*?({{each\s+.*?}}.*?{{\/each}})*){{\/each}}/;
        }
        var testArray = eachExp.exec(str);
        if (testArray) {
            var left = getProperty(obj, testArray[1]), sub = testArray[2];
            var str = "";

            for (var i = 0; i < left.length; i++) {
                left[i].index = i + 1;
                str += render(sub, left[i], false);
            }
            return str;
        }
        return "";
    }

    function getProperty(obj, keyStr) {
        var tempArray = keyStr.split('.');
        var property = obj[tempArray[0]], i = 1, len = tempArray.length;
        while (len - i >= 1) {
            property = property[tempArray[i]];
            i++;
        }
        return property;
    }

    return render;
})();
(function () {
    var moving = false, touched = false;
    function touchstart(ev) {
        touched = true;
    }

    function touchmove(ev) {
        if (touched) {
            moving = true;
        }
    }

    function touchend(ev) {
        ev.preventDefault();
        if (!moving) {
            ev.target.dispatchEvent(Assembly.tapEvent);
        }
        touched = false;
        moving = false;
    }
    Page.attachTap = function (dom, fn, isProp) {
        if ("ontouchstart" in document.body) {
            dom.addEventListener("touchstart", touchstart, isProp);
            dom.addEventListener("touchmove", touchmove, isProp);
            dom.addEventListener("touchend", touchend, isProp);
            dom.addEventListener("tap", fn, isProp);
        }
        else {
            dom.addEventListener("click", fn, isProp);
        }
    }
    Page.removeTap = function (dom, fn, isProp) {
        if ("ontouchstart" in document.body) {
            dom.removeEventListener("touchstart", touchstart, isProp);
            dom.removeEventListener("touchmove", touchmove, isProp);
            dom.removeEventListener("touchend", touchend, isProp);
            dom.removeEventListener("tap", fn, isProp);
        }
        else {
            dom.removeEventListener("click", fn, isProp);
        }
    }
})();
Page.extend = function (obj, options) {
    for (var key in options) {
        obj[key] = options[key];
    }
    return obj;
};
Page.create = function (title, url, options) {
    var page = new Page(title, url);
    for (var key in options) {
        page[key] = options[key];
    }
    return page;
};
Page.serialize = function (obj) {
    var parts = [];

    for (var key in obj) {
        addPart(obj, key, parts);
    }

    return parts.join("&");

    function addPart(obj, key, parts, str) {
        str = str || key;
        if (Page.isObject(obj[key])) {
            for (var k in obj[key]) {
                addPart(obj[key], k, parts, key + "[" + k + "]");
            }
        }
        else if (Page.isArray(obj[key])) {
            for (var i = 0, len = obj[key].length; i < len; i++) {
                if (Page.isObject(obj[key][i])) {
                    for (var k in obj[key][i]) {
                        addPart(obj[key][i], k, parts, key + "[" + i + "]" + "[" + k + "]");
                    }
                }
                else {
                    parts.push(encodeURIComponent(str) + "[]=" + encodeURIComponent(obj[key][i]));
                }
            }
        }
        else {
            parts.push(encodeURIComponent(str) + "=" + encodeURIComponent(obj[key]));
        }
    }
};
Page.loader = new Loader();
Page.confirmHTML = 
'<div class="confirm-box">' + 
    '<div class="confirm-title">$title</div>' + 
    '<div class="confirm-content">$content</div>' + 
    '<div class="confirm-btn-group">' + 
        '<button class="confirm-primary-btn">确认</button>' + 
        '<button class="confirm-cancel-btn">取消</button>' + 
    '</div>' + 
'</div>';
Page.popupHTML = 
    '<div class="popup-box">' + 
        '<div class="popup-title">$title</div>' + 
        '<div class="popup-content">$content</div>' + 
        '<div class="popup-btn-group">' + 
            '<button class="popup-primary-btn">确认</button>' + 
            '<button class="popup-cancel-btn">取消</button>' + 
        '</div>' + 
    '</div>';
Page.confirmBox = new ConfirmBox();
Page.popUp = new PopUp();
Page.showTip = function (str, timeElapsed) {
    var tipContainer = document.createElement("div");
    tipContainer.textContent = str;
    tipContainer.className = "tip-box";
    var firDiv = document.body.firstElementChild;
    document.body.insertBefore(tipContainer, firDiv);
    setTimeout(function () {
        document.body.removeChild(tipContainer);
    }, timeElapsed ? timeElapsed : 2000);
};
Page.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
};
Page.isArray = function (array) {
    return Object.prototype.toString.call(array) === "[object Array]";
};
Page.isFunction = function (fn) {
    return Object.prototype.toString.call(fn) === "[object Function]";
};

function Platform(page) {
    this.appObj = {}
    this.page = page;
    this.page.platform = this;
    this.currentApp = null;
    this.staticDom = document.createElement("div");
    this.staticDom.className = "platform-static";
    this.backDom = document.createElement("div");
    this.backDom.innerHTML = "主页";
    this.backDom.id = "platform-btn";
    var that = this;
    this.options = [];
    this.systemObj = {};
    this.db = null;
    this.backDom.addEventListener("click", function () { that.back(); }, false);
}
Platform.prototype = {
    constructor: Platform,

    init: function (options) {
        if (options && options.length != 0) {
            this.options = this.options.concat(options);
            var that = this;
            var len = options.length, i = 0;
            options.forEach(function (option) {
                var script = document.createElement("script");
                script.id = "script" + option.appId;
                script.src = option.src;
                document.body.appendChild(script);
                script.onload = function () {
                    Platform.load(option.appId, option.scripts, function () {
                        i++;
                        var app = that.appObj[option.appId];
                        app.icon = option.icon;
                        app.name = option.name;
                        if (i == len) {
                            that.renderPage();
                        }
                    })
                }
            });
        }
        else {
            this.renderPage();
        }
    },
    isContainsKey: function (appId) {
        var appObj = this.appObj;
        if (appId in appObj) return true;
        else return false;
    },
    renderPage: function () {
        var page = this.page;
        var that = this;
        document.body.appendChild(this.staticDom);
        page.render(function (html) {
            that.staticDom.innerHTML = html;
            page.initialize(that.staticDom);
            document.title = page.title;
            var newUrl = page.url;
            history.replaceState({data: newUrl}, "", newUrl);
        });
    },
    render: function (str) {
        var app = this.systemObj[str] || this.appObj[str];
        if (app) {
            this.page.dispose();
            document.body.removeChild(this.staticDom);
            var cApp = this.currentApp;
            if (cApp !== app) {
                if (cApp) this.unitApp(cApp);
                this.initApp(app);
                this.currentApp = app;
                app.platform = this;
            }
            document.body.appendChild(this.backDom);
        }
    },
    unitApp: function (app) {
        if (!this.isSystemApp(app)) { 
            var key = this.getKeyByApp(app);
            this.removeStylesByKey(key);
        }
        app.unit();
    },
    initApp: function (app) {
        if (!this.isSystemApp(app)) {
            var key = this.getKeyByApp(app);
            this.addStylesByKey(key);
        }
        
        app.init();
    },
    isSystemApp: function (app) {
        var systemObj = this.systemObj;
        for (var key in systemObj) {
            if (systemObj[key] == app) return true;
        }
        return false;
    },
    getKeyByApp: function (app) {
        var appObj = this.appObj;
        for (var key in appObj) {
            if (app === appObj[key]) {
                return key;
            }
        }
    },
    removeStylesByKey: function (key) {
        var head = document.head;
        var links = document.querySelectorAll('link[data-key="' + key + '"]');
        for (var i = links.length - 1; i >= 0; i--) {
            head.removeChild(links[i]);
        }
    },
    addStylesByKey: function (key) {
        var head = document.head;
        var styles = this.getStylesByKey(key);
        for (var i = 0; i < styles.length; i++) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = styles[i];
            link.setAttribute("data-key", key);
            head.appendChild(link);
        }
    },
    getStylesByKey: function (key) {
        var options = this.options;
        for (var i = 0; i < options.length; i++) {
            var o = options[i];
            if (o.appId == key) {
                return o.styles;
            }
        }
    },
    back: function () {
        document.body.removeChild(this.backDom);
        if (this.currentApp) this.unitApp(this.currentApp);
        this.currentApp = null;
        this.renderPage();
    },
    getOptionByKey: function (key) {
        var options = this.options;
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.appId == key) {
                return option;
            }
        }
    },
    createApp: function (key, name, staticPageOption, indexPageOption) {
        var option = this.getOptionByKey(key);
        var app = this.createDefaultApp(key, name, staticPageOption, indexPageOption);
        this.appObj[key] = app;
        this.appObj[key].name = name;
        return app;
    },
    createSystemApp: function (key, name, staticPageOption, indexPageOption) {
        var app = this.createDefaultApp(key, name, staticPageOption, indexPageOption);
        this.systemObj[key] = app;

        return app;
    },
    createDefaultApp: function (key, name, staticPageOption, indexPageOption) {
        staticPageOption = staticPageOption || {
            render: function (fn) {fn("");},
            getDomObj: function (dom) {}
        };
        indexPageOption = indexPageOption || {
            render: function (fn) {fn("");},
            getDomObj: function (dom) {}
        };

        var page = Page.create("", "", staticPageOption);
        var app = new App(page);

        app.indexPage = app.createPage(key, "_" + key + "_index", indexPageOption);
        return app;
    },
    deleteKey: function (key, bk) {
        var options = this.options;
        if (options) {
            for (var i = 0; i < options.length; i++) {
                if (options[i].name == key) break;
            }
            options.splice(i, 1);
            delete this.appObj[key];
            Platform.deleteDom(key);
            if (bk) bk();
        }
    },
    addKey: function (option, bk) {
        var that = this;
        var script = document.createElement("script");
        script.id = "script" + option.appId;
        script.src = option.src;
        document.body.appendChild(script);
        
        script.onload = function () {
            Platform.load(option.appId, option.scripts, function () {
                that.appObj[option.appId].icon = option.icon;
                that.options.push(option);
                if (bk) bk();
            })
        }
    },
    addKeys: function (options, bk) {
        var that = this;
        var len = options.length, i = 0;
        options.forEach(function (option) {
            var script = document.createElement("script");
            script.id = "script" + option.appId;
            script.src = option.src;
            document.body.appendChild(script);
            script.onload = function () {
                Platform.load(option.appId, option.scripts, function () {
                    i++;
                    that.appObj[option.appId].icon = option.icon;
                    if (i == len) {
                        that.options = that.options.concat(options);
                        if (bk) bk();
                    }
                })
            }
        });
    },
    getAppByAppId: function (key) {
        var appObj = this.appObj;
        return appObj[key];
    },
    createPage: function (key, title, url, options) {
        var app = this.getAppByAppId(key);
        if (app) {
            app.createPage(title, url, options);
        }
    }
};

Platform.deleteDom = function (key) {
    var domList = document.querySelectorAll("[data-name='" + key + "']");
    for (var i = 0; i < domList.length; i++) {
        var d = domList[i];
        d.parentNode.removeChild(d);
    }
    var script = document.getElementById("script" + key);
    script.parentNode.removeChild(script);
}

Platform.load = function (name, scripts, bk) {
    var len = scripts.length;
    var i = 0;
    var body = document.body;
    scripts.forEach(function (script) {
        var s = document.createElement("script");
        s.setAttribute("data-name", name);
        s.src = script;
        body.appendChild(s);
        s.onload = function () {
            i++;
            if (i == len) {
                bk();
            }
        }
    });

    if (len == 0) {
        bk();
    }
}
function App(staticPage) {
    this.staticContainer = document.createElement("div");
    this.staticContainer.className = "static-container";
    this.changeContainer = document.createElement("div");
    this.changeContainer.className = "change-container";
    this.currentPage = null;
    this.staticPage = staticPage;
    this.indexPage = null;
    this.data = {};
    
    this.xhrList = [];
    this.routeObj = {};
}
App.prototype = {
    constructor: App,
    init: function () {
        var staticPage = this.staticPage;
        var that = this;
        var body = document.body;
        body.appendChild(this.staticContainer);
        body.appendChild(this.changeContainer);

        staticPage.render(function (html) {
            that.staticContainer.innerHTML = html;
            staticPage.initialize(that.staticContainer);

            that.popStateHandler = that.popStateHandler || that.popHandler.bind(that);
            window.addEventListener("popstate", that.popStateHandler, false);
        });

        if (this.indexPage) {
            this.render(this.indexPage);
        }
    },
    popHandler: function (ev) {
        if (ev.state && ev.state.data) {
            var pageObj = this.routeObj[ev.state.data.replace(/\//g, "_")];
            if (pageObj) {
                this.renderPage(pageObj);
            }
            else {
                this.backTo(this.platform);
            }
        }
        else {
            this.backTo(this.platform);
        }
    },
    backTo: function (platform) {
        platform.back();
    },
    attachHistory: function (pageObj, isBack) {
        this.routeObj[pageObj.url] = pageObj;
        var newUrl =  pageObj.url.replace(/_/g, "/");
        
        if (isBack) {
            history.replaceState({data: newUrl}, "", newUrl);
        }
        else {
            history.pushState({data: newUrl}, "", newUrl);
        }
    },

    renderPage: function (pageObj) {
        var that = this;

        if (this.currentPage) {
            this.currentPage.dispose();
        }
        this.currentPage = pageObj;

        document.title = pageObj.title;

        this.insertChangeDom(pageObj, function () {
            pageObj.initialize(that.changeDom);
        });
    },

    render: function (pageObj, isBack) {
        if (typeof pageObj === "string") pageObj = this.routeObj[pageObj];
        if (pageObj === this.currentPage) return;

        this.attachHistory(pageObj, isBack);
        this.renderPage(pageObj);
    },
    unit: function () {
        window.removeEventListener("popstate", this.popStateHandler, false);
        if (this.currentPage) this.currentPage.dispose();
        this.currentPage = null;
        this.staticPage.dispose();
        var body = document.body;
        this.staticContainer.innerHTML = "";
        this.changeContainer.innerHTML = "";
        body.removeChild(this.staticContainer);
        body.removeChild(this.changeContainer);
    },
    insertChangeDom: function (pageObj, fn) {
        var that = this;
        var changeContainer = this.changeContainer;
        pageObj.render(function (html) {
            changeContainer.innerHTML = html;
            fn();
        });
    },
    createPage: function (title, url, options) {
        var page = this.routeObj[url] = Page.create(title, url, options);
        page.app = this;
        return page;
    },
    getPageByUrl: function (url) {
        var routeObj = this.routeObj;
        return routeObj[url];
    }
};