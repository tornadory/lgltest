(function () {
    var __extends = this && this.__extends || function () {
        var t = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (t, o) {
            t.__proto__ = o
        } || function (t, o) {
            for (var n in o) o.hasOwnProperty(n) && (t[n] = o[n])
        };
        return function (o, n) {
            function r() {
                this.constructor = o
            }
            t(o, n), o.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
        }
    }();

    var Group = (function (_super) {
        __extends(Group, _super);

        function Group(name, scene) {
            if (scene === void 0) {
                scene = null;
            }
            var _this = _super.call(this, name, scene, null, null) || this;

            scene = _this.getScene();

            _this.isGroup = true;

            return _this;
        }

        Group.prototype.add = function () {
            var parent = this;
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (arg instanceof Array) {
                    arg.forEach(function (el) {
                        el.parent = parent;
                        el.group = parent;
                    });
                } else {
                    arg.parent = parent;
                    arg.group = group;
                }
            }
            this.refreshBoundingInfo();
        };

        Group.prototype.refreshBoundingInfo = function () {
            var children = this.getChildren();
            var boundingInfo = children[0].getBoundingInfo();
            var min = boundingInfo.minimum.add(children[0].position);
            var max = boundingInfo.maximum.add(children[0].position);
            for (var i = 1; i < children.length; i++) {
                boundingInfo = children[i].getBoundingInfo();
                min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(children[i].position));
                max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(children[i].position));
            }
            this.setBoundingInfo(new BABYLON.BoundingInfo(min, max));
        };
        return Group;
    })(BABYLON.Mesh);
    BABYLON.Group = Group;
})();