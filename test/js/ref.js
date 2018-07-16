function(t, e, n) {
    var i = n(27)
        , r = n(26)
        , o = n(102)
        , a = {
            getPolygonNormal: function (t) {
                var e = a.getPlaneFromPolygon(t);
                if (e)
                    return e.normal
            },
            getPlaneFromPolygon: function (t, e) {
                var n = a._getThreeQualifiedPoints(t);
                if (n) {
                    e = !1 !== e;
                    var i = n[0]
                        , r = n[1]
                        , s = n[2]
                        , l = new THREE.Plane;
                    if (l.setFromCoplanarPoints(i, r, s),
                        e) {
                        var u = o.worldToPlaneLocalMatrix(l)
                            , c = t.map(function (t) {
                                return t.clone().applyMatrix4(u)
                            });
                        a.isCounterClockwise(c) || l.negate()
                    }
                    var h = new THREE.Vector3;
                    return h.subVectors(i, r),
                        l.xRay = h.normalize(),
                        l
                }
            },
            _getThreeQualifiedPoints: function (t) {
                for (var e = t[0], n = void 0, r = void 0, o = 1; o < t.length; o++)
                    if (!i.isPointEqual(e, t[o])) {
                        n = t[o];
                        break
                    }
                if (n) {
                    for (o = 2; o < t.length; o++) {
                        var a = t[o];
                        if (!i.isPointEqual(e, a) && !i.isPointEqual(n, a)) {
                            var s = a.clone().sub(e)
                                , l = a.clone().sub(n)
                                , u = n.clone().sub(e);
                            if (!i.isParallel(s, l) || !i.isParallel(s, u)) {
                                r = a;
                                break
                            }
                        }
                    }
                    if (r)
                        return [e, n, r]
                }
            },
            getArea: function (t) {
                var e = t.length;
                if (e < 3)
                    return 0;
                for (var n = 0, i = 0, r = e - 1; i < e; ++i)
                    n += (t[r].x + t[i].x) * (t[r].y - t[i].y),
                        r = i;
                return .5 * -n
            },
            isCounterClockwise: function (t) {
                var e = a.getArea(t);
                return r.larger(e, 0)
            },
            pointInPolygon: function (t, e, n) {
                var i = 0
                    , o = e.length;
                if (o < 3)
                    return 0;
                for (var a = e[0], s = 1; s <= o; ++s) {
                    var l = s == o ? e[0] : e[s];
                    if (r.nearlyEqual(l.y, t.y, n) && (r.nearlyEqual(l.x, t.x, n) || r.nearlyEqual(a.y, t.y, n) && r.larger(l.x, t.x, n) == r.smaller(a.x, t.x, n)))
                        return -1;
                    if (r.smaller(a.y, t.y, n) != r.smaller(l.y, t.y, n))
                        if (r.largerOrEqual(a.x, t.x, n))
                            if (r.larger(l.x, t.x, n))
                                i = 1 - i;
                            else {
                                var u = (a.x - t.x) * (l.y - t.y) - (l.x - t.x) * (a.y - t.y);
                                if (r.isZero(u, n))
                                    return -1;
                                r.larger(u, 0, n) == r.larger(l.y, a.y, n) && (i = 1 - i)
                            }
                        else if (r.larger(l.x, t.x, n)) {
                            u = (a.x - t.x) * (l.y - t.y) - (l.x - t.x) * (a.y - t.y);
                            if (r.isZero(u, 0, n))
                                return -1;
                            r.larger(u, 0, n) == r.larger(l.y, a.y, n) && (i = 1 - i)
                        }
                    a = l
                }
                return i
            },
            closestPointToPolygon: function (t, e) {
                for (var n = function (t, e) {
                    var n = t.closestPointToPoint(e)
                        , i = t.closestPointToPointParameter(n);
                    return r.larger(i, 1) ? t.end : r.smaller(i, 0) ? t.start : n
                }, o = Number.MAX_VALUE, a = void 0, s = i.toTHREEVector3(t), l = 0, u = e.length; l < u; l++) {
                    var c, h = i.toTHREEVector3(e[l]), f = i.toTHREEVector3(e[(l + 1) % u]);
                    c = i.isPointEqual(h, f) ? h : n(new THREE.Line3(h, f), s);
                    var d = s.distanceToSquared(c);
                    d < o && (o = d,
                        a = c)
                }
                return a
            },
            getPolygonBoundingBox: function (t) {
                if (t && !(t.length <= 2)) {
                    for (var e = maxy = -1 / 0, n = miny = 1 / 0, i = {}, r = 0, o = t.length; r < o; r++)
                        e = Math.max(t[r].x, e),
                            n = Math.min(t[r].x, n),
                            maxy = Math.max(t[r].y, maxy),
                            miny = Math.min(t[r].y, miny);
                    return i.square = {
                        maxX: e,
                        maxY: maxy,
                        minX: n,
                        minY: miny,
                        minZ: 0,
                        maxZ: 0
                    },
                        i.center = {
                            x: (n + e) / 2,
                            y: (maxy + miny) / 2
                        },
                        i.area = (e - n) * (maxy - miny),
                        i.lefttop = {
                            x: n,
                            y: maxy
                        },
                        i.XSize = e - n,
                        i.YSize = maxy - miny,
                        i
                }
            },
            getPolygonBoundingBox3d: function (t) {
                if (t && !(t.length <= 2)) {
                    for (var e = maxy = maxz = -1 / 0, n = miny = minz = 1 / 0, i = {}, r = 0, o = t.length; r < o; r++)
                        e = Math.max(t[r].x, e),
                            n = Math.min(t[r].x, n),
                            maxy = Math.max(t[r].y, maxy),
                            miny = Math.min(t[r].y, miny),
                            maxz = Math.max(t[r].z, maxz),
                            minz = Math.min(t[r].z, minz);
                    return i.square = {
                        maxX: e,
                        maxY: maxy,
                        minX: n,
                        minY: miny,
                        minZ: minz,
                        maxZ: maxz
                    },
                        i.center = {
                            x: (n + e) / 2,
                            y: (maxy + miny) / 2,
                            z: (maxz + minz) / 2
                        },
                        i.XSize = e - n,
                        i.YSize = maxy - miny,
                        i.ZSize = maxz - minz,
                        i
                }
            }
        };
    t.exports = a
}

function(t, e) {
    function Tolerance() {
        this.setByUnit("m")
    }
    Tolerance.prototype.setByUnit = function (t) {
        switch (t) {
            case "m":
                this._setByMeter();
                break;
            case "cm":
                this._setByCentiMeter();
                break;
            default:
                this._setByMeter()
        }
    }
        ,
        Tolerance.prototype._setByMeter = function () {
            this.EQUAL_TOLERANCE = 1e-7,
                this.DISTANCE_TOLERENCE = 1e-7,
                this.PLANE_DISTANCE_TOLERENCE = 1e-6,
                this.DISTANCE_SQ_TOLERENCE = 1e-14,
                this.VECTOR_EQUAL_TOLERANCE = 1e-5,
                this.CLIPPER_MINI_AREA = 1e-7,
                this.CLIPPER_SCALE_FACTOR = 1e7,
                this.CLIPPER_MINI_AREA_SCALE = this.CLIPPER_MINI_AREA * this.CLIPPER_SCALE_FACTOR * this.CLIPPER_SCALE_FACTOR,
                this.KDTREE_SQ_NEAREST_TOL = 1e-10
        }
        ,
        Tolerance.prototype._setByCentiMeter = function () {
            this.EQUAL_TOLERANCE = 1e-5,
                this.DISTANCE_TOLERENCE = 1e-5,
                this.PLANE_DISTANCE_TOLERENCE = 1e-4,
                this.DISTANCE_SQ_TOLERENCE = 1e-10,
                this.VECTOR_EQUAL_TOLERANCE = 1e-5,
                this.CLIPPER_MINI_AREA = .001,
                this.CLIPPER_SCALE_FACTOR = 1e5,
                this.CLIPPER_MINI_AREA_SCALE = this.CLIPPER_MINI_AREA * this.CLIPPER_SCALE_FACTOR * this.CLIPPER_SCALE_FACTOR,
                this.KDTREE_SQ_NEAREST_TOL = 1e-6
        }
        ,
        Tolerance.global = new Tolerance,
        t.exports = Tolerance
}


function(t, e, n) {
    var i = n(25)
        , r = {
            _fillUpOption: function (t) {
                var e = !0
                    , n = !0
                    , r = i.global.CLIPPER_SCALE_FACTOR
                    , o = ClipperLib.PolyFillType.pftEvenOdd
                    , a = ClipperLib.PolyFillType.pftEvenOdd;
                return t && (e = !1 !== t.strictlySimple,
                    n = !1 !== t.scaleUpDown,
                    r = t.scale ? t.scale : i.global.CLIPPER_SCALE_FACTOR,
                    o = void 0 !== t.subjectFillType ? t.subjectFillType : ClipperLib.PolyFillType.pftEvenOdd,
                    a = void 0 !== t.clipFillType ? t.clipFillType : ClipperLib.PolyFillType.pftEvenOdd),
                    {
                        strictlySimple: e,
                        scaleUpDown: n,
                        scale: r,
                        subjectFillType: o,
                        clipFillType: a
                    }
            },
            mergeFaces: function (t, e, n) {
                if (!(t && 0 !== t.length || e || 0 !== e.length))
                    return [];
                if (0 === t.length)
                    return e.map(function (t) {
                        return [t[0]]
                    });
                if (0 === e.length)
                    return t.map(function (t) {
                        return [t[0]]
                    });
                (n = r._fillUpOption(n)).scaleUpDown && (t.forEach(function (t) {
                    ClipperLib.JS.ScaleUpPaths(t, n.scale)
                }),
                    e.forEach(function (t) {
                        ClipperLib.JS.ScaleUpPaths(t, n.scale)
                    }));
                var i = t.map(function (t) {
                    return t[0]
                })
                    , o = r._getContours(i, n.strictlySimple)
                    , a = e.map(function (t) {
                        return t[0]
                    })
                    , s = r._getContours(a, n.strictlySimple)
                    , l = r._doBoolean(o, s, ClipperLib.ClipType.ctDifference, n.strictlySimple)
                    , u = ClipperLib.JS.ExPolygonsToPaths(l)
                    , c = r._doBoolean(s, o, ClipperLib.ClipType.ctDifference, n.strictlySimple)
                    , h = ClipperLib.JS.ExPolygonsToPaths(c)
                    , f = r._doBoolean(o, s, ClipperLib.ClipType.ctIntersection, n.strictlySimple)
                    , d = ClipperLib.JS.ExPolygonsToPaths(f)
                    , p = [];
                u.length > 0 && t.forEach(function (t) {
                    var e = r._flattenFacesToPaths([t])
                        , i = r._doBoolean(u, e, ClipperLib.ClipType.ctIntersection, n.strictlySimple);
                    p = p.concat(r._toQualifiedFaces(i, n.scaleUpDown, n.scale))
                }),
                    h.length > 0 && e.forEach(function (t) {
                        var e = r._flattenFacesToPaths([t])
                            , i = r._doBoolean(h, e, ClipperLib.ClipType.ctIntersection, n.strictlySimple);
                        p = p.concat(r._toQualifiedFaces(i, n.scaleUpDown, n.scale))
                    });
                var m = [];
                if (d.length > 0) {
                    var g = [];
                    e.forEach(function (t) {
                        var e = r._flattenFacesToPaths([t]);
                        r._doBoolean(d, e, ClipperLib.ClipType.ctIntersection, n.strictlySimple).forEach(function (t) {
                            g.push(t)
                        })
                    });
                    var v = g.map(function (t) {
                        return ClipperLib.JS.ExPolygonsToPaths([t])
                    })
                        , y = [];
                    t.forEach(function (t) {
                        var e = r._flattenFacesToPaths([t]);
                        r._doBoolean(d, e, ClipperLib.ClipType.ctIntersection, n.strictlySimple).forEach(function (t) {
                            y.push(t)
                        })
                    });
                    var _ = y.map(function (t) {
                        return ClipperLib.JS.ExPolygonsToPaths([t])
                    })
                        , b = [];
                    v.forEach(function (t) {
                        _.forEach(function (e) {
                            r._doBoolean(t, e, ClipperLib.ClipType.ctIntersection, n.strictlySimple).forEach(function (t) {
                                b.push(t)
                            })
                        })
                    });
                    var x = ClipperLib.JS.ExPolygonsToPaths(b)
                        , w = [];
                    v.forEach(function (t) {
                        r._doBoolean(t, x, ClipperLib.ClipType.ctDifference, n.strictlySimple).forEach(function (t) {
                            w.push(t)
                        })
                    });
                    var E = [];
                    _.forEach(function (t) {
                        r._doBoolean(t, x, ClipperLib.ClipType.ctDifference, n.strictlySimple).forEach(function (t) {
                            E.push(t)
                        })
                    }),
                        m = (m = (m = m.concat(r._toQualifiedFaces(w, n.scaleUpDown, n.scale))).concat(r._toQualifiedFaces(E, n.scaleUpDown, n.scale))).concat(r._toQualifiedFaces(b, n.scaleUpDown, n.scale))
                }
                return p = p.concat(m),
                    n.scaleUpDown && (t.forEach(function (t) {
                        ClipperLib.JS.ScaleDownPaths(t, n.scale)
                    }),
                        e.forEach(function (t) {
                            ClipperLib.JS.ScaleDownPaths(t, n.scale)
                        })),
                    p
            },
            unionFaces: function (t, e, n) {
                if (n = r._fillUpOption(n),
                    !(t && 0 !== t.length || e && 0 !== e.length))
                    return [];
                if (0 === t.length)
                    return e.map(function (t) {
                        return [t[0]]
                    });
                if (0 === e.length)
                    return t.map(function (t) {
                        return [t[0]]
                    });
                n.scaleUpDown && (t.forEach(function (t) {
                    ClipperLib.JS.ScaleUpPaths(t, n.scale)
                }),
                    e.forEach(function (t) {
                        ClipperLib.JS.ScaleUpPaths(t, n.scale)
                    }));
                for (var i = t, o = [], a = 0; a < e.length; a++) {
                    for (var s = [], l = e[a], u = 0; u < i.length; u++) {
                        var c = i[u]
                            , h = r._doIntermidiateUnion(c, l, n.strictlySimple);
                        h.subject && s.push(h.subject),
                            l = h.clip
                    }
                    i = s,
                        r._doBoolean(l, e[a], ClipperLib.ClipType.ctDifference, n.strictlySimple).length > 0 ? i.push(l) : o.push(l)
                }
                var f = [];
                return n.scaleUpDown && (i.forEach(function (t) {
                    ClipperLib.JS.ScaleDownPaths(t, n.scale)
                }),
                    o.forEach(function (t) {
                        ClipperLib.JS.ScaleDownPaths(t, n.scale)
                    })),
                    f = (f = f.concat(i)).concat(o),
                    n.scaleUpDown && (t.forEach(function (t) {
                        ClipperLib.JS.ScaleDownPaths(t, n.scale)
                    }),
                        e.forEach(function (t) {
                            ClipperLib.JS.ScaleDownPaths(t, n.scale)
                        })),
                    f
            },
            _doIntermidiateUnion: function (t, e, n) {
                var i = r._doBoolean(t, e, ClipperLib.ClipType.ctUnion, n);
                return 1 == i.length ? {
                    subject: void 0,
                    clip: ClipperLib.JS.ExPolygonsToPaths(i)
                } : {
                        subject: t.map(function (t) {
                            return t.map(function (t) {
                                return new ClipperLib.IntPoint(t.X, t.Y)
                            })
                        }),
                        clip: e.map(function (t) {
                            return t.map(function (t) {
                                return new ClipperLib.IntPoint(t.X, t.Y)
                            })
                        })
                    }
            },
            subtractFaces: function (t, e, n) {
                if (!(t && 0 !== t.length || e && 0 !== e.length))
                    return [];
                if (0 === t.length)
                    return e.map(function (t) {
                        return [t[0]]
                    });
                if (!e || e.length <= 0)
                    return t;
                (n = r._fillUpOption(n)).scaleUpDown && (t.forEach(function (t) {
                    ClipperLib.JS.ScaleUpPaths(t, n.scale)
                }),
                    e.forEach(function (t) {
                        ClipperLib.JS.ScaleUpPaths(t, n.scale)
                    }));
                for (var i = [], o = 0; o < t.length; o++) {
                    for (var a = [t[o]], s = 0; s < e.length; s++) {
                        for (var l = [], u = e[s], c = 0; c < a.length; c++) {
                            var h = a[c];
                            r._doIntermidiateSubtract(h, u, n.strictlySimple).forEach(function (t) {
                                l.push(t)
                            })
                        }
                        a = l
                    }
                    a.forEach(function (t) {
                        i.push(t)
                    })
                }
                return n.scaleUpDown && (i.forEach(function (t) {
                    ClipperLib.JS.ScaleDownPaths(t, n.scale)
                }),
                    t.forEach(function (t) {
                        ClipperLib.JS.ScaleDownPaths(t, n.scale)
                    }),
                    e.forEach(function (t) {
                        ClipperLib.JS.ScaleDownPaths(t, n.scale)
                    })),
                    i
            },
            _doIntermidiateSubtract: function (t, e, n) {
                var i = r._doBoolean(t, e, ClipperLib.ClipType.ctDifference, n);
                return r._toQualifiedFaces(i, !1)
            },
            intersectFaces: function (t, e, n) {
                if (!t || t.length <= 0 || !e || e.length <= 0)
                    return [];
                (n = r._fillUpOption(n)).scaleUpDown && (t.forEach(function (t) {
                    ClipperLib.JS.ScaleUpPaths(t, n.scale)
                }),
                    e.forEach(function (t) {
                        ClipperLib.JS.ScaleUpPaths(t, n.scale)
                    }));
                for (var i = [], o = 0; o < t.length; o++) {
                    for (var a = [t[o]], s = 0; s < e.length; s++) {
                        for (var l = [], u = e[s], c = 0; c < a.length; c++) {
                            var h = a[c];
                            r._doIntermidiateIntersection(h, u, n.strictlySimple).forEach(function (t) {
                                l.push(t)
                            })
                        }
                        a = l
                    }
                    a.forEach(function (t) {
                        i.push(t)
                    })
                }
                return n.scaleUpDown && (i.forEach(function (t) {
                    ClipperLib.JS.ScaleDownPaths(t, n.scale)
                }),
                    t.forEach(function (t) {
                        ClipperLib.JS.ScaleDownPaths(t, n.scale)
                    }),
                    e.forEach(function (t) {
                        ClipperLib.JS.ScaleDownPaths(t, n.scale)
                    })),
                    i
            },
            _doIntermidiateIntersection: function (t, e, n) {
                var i = r._doBoolean(t, e, ClipperLib.ClipType.ctIntersection, n);
                return r._toQualifiedFaces(i, !1)
            },
            unionFace: function (t, e, n) {
                (n = r._fillUpOption(n)).scaleUpDown && (ClipperLib.JS.ScaleUpPaths(t, n.scale),
                    ClipperLib.JS.ScaleUpPaths(e, n.scale));
                var i = r._doBoolean(t, e, ClipperLib.ClipType.ctUnion, n.strictlySimple)
                    , o = r._toQualifiedFaces(i, n.scaleUpDown, n.scale);
                return n.scaleUpDown && (ClipperLib.JS.ScaleDownPaths(t, n.scale),
                    ClipperLib.JS.ScaleDownPaths(e, n.scale)),
                    o
            },
            subtractFace: function (t, e, n) {
                (n = r._fillUpOption(n)).scaleUpDown && (ClipperLib.JS.ScaleUpPaths(t, n.scale),
                    ClipperLib.JS.ScaleUpPaths(e, n.scale));
                var i = r._doBoolean(t, e, ClipperLib.ClipType.ctDifference, n.strictlySimple)
                    , o = r._toQualifiedFaces(i, n.scaleUpDown, n.scale);
                return n.scaleUpDown && (ClipperLib.JS.ScaleDownPaths(t, n.scale),
                    ClipperLib.JS.ScaleDownPaths(e, n.scale)),
                    o
            },
            intersectFace: function (t, e, n) {
                (n = r._fillUpOption(n)).scaleUpDown && (ClipperLib.JS.ScaleUpPaths(t, n.scale),
                    ClipperLib.JS.ScaleUpPaths(e, n.scale));
                var i = r._doBoolean(t, e, ClipperLib.ClipType.ctIntersection, n.strictlySimple)
                    , o = r._toQualifiedFaces(i, n.scaleUpDown, n.scale);
                return n.scaleUpDown && (ClipperLib.JS.ScaleDownPaths(t, n.scale),
                    ClipperLib.JS.ScaleDownPaths(e, n.scale)),
                    o
            },
            _flattenFacesToPaths: function (t) {
                var e = [];
                return t.forEach(function (t) {
                    t.forEach(function (t) {
                        e.push(t)
                    })
                }),
                    e
            },
            doBoolean: function (t, e, n, i) {
                (i = r._fillUpOption(i)).scaleUpDown && (ClipperLib.JS.ScaleUpPaths(t, i.scale),
                    ClipperLib.JS.ScaleUpPaths(e, i.scale));
                var o = r._doBoolean(t, e, n, i.strictlySimple, i.subjectFillType, i.clipFillType)
                    , a = r._toQualifiedFaces(o, i.scaleUpDown, i.scale);
                return i.scaleUpDown && (ClipperLib.JS.ScaleDownPaths(t, i.scale),
                    ClipperLib.JS.ScaleDownPaths(e, i.scale)),
                    a
            },
            _doBoolean: function (t, e, n, i, r, o) {
                void 0 === r && (r = ClipperLib.PolyFillType.pftEvenOdd),
                    void 0 === o && (o = ClipperLib.PolyFillType.pftEvenOdd);
                var a = new ClipperLib.Clipper;
                a.StrictlySimple = !1 !== i || i;
                var s = new ClipperLib.PolyTree;
                return a.AddPaths(t, ClipperLib.PolyType.ptSubject, !0),
                    a.AddPaths(e, ClipperLib.PolyType.ptClip, !0),
                    a.Execute(n, s, r, o),
                    ClipperLib.JS.PolyTreeToExPolygons(s)
            },
            doBooleanSimple: function (t, e, n, i, o, a) {
                return r._doBooleanSimple(t, e, n, i, o, a)
            },
            _doBooleanSimple: function (t, e, n, i, r, o) {
                void 0 === r && (r = ClipperLib.PolyFillType.pftEvenOdd),
                    void 0 === o && (o = ClipperLib.PolyFillType.pftEvenOdd);
                var a = new ClipperLib.Clipper;
                a.StrictlySimple = !1 !== i || i;
                var s = new ClipperLib.Paths;
                return a.AddPaths(t, ClipperLib.PolyType.ptSubject, !0),
                    a.AddPaths(e, ClipperLib.PolyType.ptClip, !0),
                    a.Execute(n, s, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd),
                    s
            },
            _toQualifiedFaces: function (t, e, n) {
                n = n || i.global.CLIPPER_SCALE_FACTOR;
                var r = [];
                return t.forEach(function (t) {
                    var n = ClipperLib.JS.ExPolygonsToPaths([t]);
                    Math.abs(ClipperLib.JS.AreaOfPolygons(n)) >= i.global.CLIPPER_MINI_AREA_SCALE && r.push(n),
                        (e || void 0 == e) && ClipperLib.JS.ScaleDownPaths(n, i.global.CLIPPER_SCALE_FACTOR)
                }),
                    r
            },
            scaleUpPathArray: function (t, e) {
                e = e || i.global.CLIPPER_SCALE_FACTOR;
                for (var n = 0; n < t.length; n++)
                    ClipperLib.JS.ScaleUpPaths(t[n], e)
            },
            scaleDownPathArray: function (t, e) {
                e = e || i.global.CLIPPER_SCALE_FACTOR;
                for (var n = 0; n < t.length; n++)
                    ClipperLib.JS.ScaleDownPaths(t[n], e)
            },
            pathContainsPath: function (t, e, n, o) {
                (n = r._fillUpOption(n)).scaleUpDown && (ClipperLib.JS.ScaleUpPaths(t, n.scale),
                    ClipperLib.JS.ScaleUpPaths(e, n.scale));
                var a = !1
                    , s = r._doBooleanSimple([e[0]], [t[0]], ClipperLib.ClipType.ctDifference, n.strictlySimple, n.subjectFillType, n.clipFillType);
                if ((a = s.length <= 0 || Math.abs(ClipperLib.JS.AreaOfPolygons(s)) < i.global.CLIPPER_MINI_AREA_SCALE) && o) {
                    var l = r._doBooleanSimple([t[0]], [e[0]], ClipperLib.ClipType.ctDifference, n.strictlySimple, n.subjectFillType, n.clipFillType);
                    a = Math.abs(ClipperLib.JS.AreaOfPolygons(l)) >= i.global.CLIPPER_MINI_AREA_SCALE
                }
                return n.scaleUpDown && (ClipperLib.JS.ScaleDownPaths(t, n.scale),
                    ClipperLib.JS.ScaleDownPaths(e, n.scale)),
                    a
            },
            _getContours: function (t, e) {
                function doUnionImpl(t) {
                    var n = new ClipperLib.Clipper;
                    n.StrictlySimple = !1 !== e;
                    var i = new ClipperLib.PolyTree;
                    return n.AddPaths([t[0]], ClipperLib.PolyType.ptSubject, !0),
                        n.AddPaths(t.slice(1), ClipperLib.PolyType.ptClip, !0),
                        n.Execute(ClipperLib.ClipType.ctUnion, i, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd),
                        i.m_Childs.map(function (t) {
                            return t.m_polygon
                        })
                }
                var n = doUnionImpl(t);
                return n.length > 1 && (n = doUnionImpl(n)),
                    n
            },
            getContours: function (t, e) {
                void 0 !== e && t.forEach(function (t) {
                    ClipperLib.JS.ScaleUpPaths(t, e)
                });
                var n = t.map(function (t) {
                    return t[0]
                })
                    , i = r._getContours(n);
                return void 0 !== e && (t.forEach(function (t) {
                    ClipperLib.JS.ScaleDownPaths(t, e)
                }),
                    ClipperLib.JS.ScaleDownPaths(i, e)),
                    i
            },
            getFacesArea: function (t, e) {
                void 0 !== e && t.forEach(function (t) {
                    ClipperLib.JS.ScaleUpPaths(t, e)
                });
                var n = [];
                t.forEach(function (t) {
                    t.forEach(function (t) {
                        n.push(t)
                    })
                });
                var i = ClipperLib.JS.AreaOfPolygons(n, e);
                return void 0 !== e && t.forEach(function (t) {
                    ClipperLib.JS.ScaleDownPaths(t, e)
                }),
                    i
            },
            simplifyPath: function (t, e) {
                (e = r._fillUpOption(e)).scaleUpDown && r.scaleUpPathArray([t], e.scale);
                var n = ClipperLib.Clipper.SimplifyPolygons(t, ClipperLib.PolyFillType.pftEvenOdd)
                    , i = r._doBoolean(n, [], ClipperLib.ClipType.ctDifference);
                return n = r._toQualifiedFaces(i, e.scaleUpDown),
                    e.scaleUpDown && r.scaleDownPathArray([t], e.scale),
                    n
            },
            formatSubjectPath: function (t) {
                if (ClipperLib.JS.AreaOfPolygons(t) > 0)
                    for (var e = 0; e < t.length; e++)
                        t[e].reverse()
            },
            hasInterSection: function (t, e, n) {
                n = n || i.global.CLIPPER_SCALE_FACTOR,
                    ClipperLib.JS.ScaleUpPaths(t, n),
                    ClipperLib.JS.ScaleUpPaths(e, n);
                var o = r._doBoolean(t, e, ClipperLib.ClipType.ctIntersection)
                    , a = r._toQualifiedFaces(o);
                return ClipperLib.JS.ScaleDownPaths(t, n),
                    ClipperLib.JS.ScaleDownPaths(e, n),
                    a.length > 0
            },
            vertex3dTo2dForClipper: function (t, e) {
                var n = t.clone().applyMatrix4(e)
                    , r = i.global.CLIPPER_SCALE_FACTOR;
                return n.x = Math.round(n.x * r) / r,
                    n.y = Math.round(n.y * r) / r,
                    n
            }
        };
    t.exports = r
}



