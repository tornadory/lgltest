! function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).adapter = e()
    }
}(function () {
    return function a(o, s, c) {
        function d(r, e) {
            if (!s[r]) {
                if (!o[r]) {
                    var t = "function" == typeof require && require;
                    if (!e && t) return t(r, !0);
                    if (p) return p(r, !0);
                    var n = new Error("Cannot find module '" + r + "'");
                    throw n.code = "MODULE_NOT_FOUND", n
                }
                var i = s[r] = {
                    exports: {}
                };
                o[r][0].call(i.exports, function (e) {
                    var t = o[r][1][e];
                    return d(t || e)
                }, i, i.exports, a, o, s, c)
            }
            return s[r].exports
        }
        for (var p = "function" == typeof require && require, e = 0; e < c.length; e++) d(c[e]);
        return d
    }({
        1: [function (e, t, r) {
            "use strict";
            var N = e("sdp");

            function c(e, t, r, n, i) {
                var a = N.writeRtpDescription(e.kind, t);
                if (a += N.writeIceParameters(e.iceGatherer.getLocalParameters()), a += N.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === r ? "actpass" : i || "active"), a += "a=mid:" + e.mid + "\r\n", e.rtpSender && e.rtpReceiver ? a += "a=sendrecv\r\n" : e.rtpSender ? a += "a=sendonly\r\n" : e.rtpReceiver ? a += "a=recvonly\r\n" : a += "a=inactive\r\n", e.rtpSender) {
                    var o = e.rtpSender._initialTrackId || e.rtpSender.track.id;
                    e.rtpSender._initialTrackId = o;
                    var s = "msid:" + (n ? n.id : "-") + " " + o + "\r\n";
                    a += "a=" + s, a += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + s, e.sendEncodingParameters[0].rtx && (a += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + s, a += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
                }
                return a += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + N.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (a += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + N.localCName + "\r\n"), a
            }

            function m(d, p) {
                var u = {
                        codecs: [],
                        headerExtensions: [],
                        fecMechanisms: []
                    },
                    f = function (e, t) {
                        e = parseInt(e, 10);
                        for (var r = 0; r < t.length; r++)
                            if (t[r].payloadType === e || t[r].preferredPayloadType === e) return t[r]
                    };
                return d.codecs.forEach(function (r) {
                    for (var e = 0; e < p.codecs.length; e++) {
                        var t = p.codecs[e];
                        if (r.name.toLowerCase() === t.name.toLowerCase() && r.clockRate === t.clockRate) {
                            if ("rtx" === r.name.toLowerCase() && r.parameters && t.parameters.apt && (n = r, i = t, a = d.codecs, o = p.codecs, c = s = void 0, s = f(n.parameters.apt, a), c = f(i.parameters.apt, o), !s || !c || s.name.toLowerCase() !== c.name.toLowerCase())) continue;
                            (t = JSON.parse(JSON.stringify(t))).numChannels = Math.min(r.numChannels, t.numChannels), u.codecs.push(t), t.rtcpFeedback = t.rtcpFeedback.filter(function (e) {
                                for (var t = 0; t < r.rtcpFeedback.length; t++)
                                    if (r.rtcpFeedback[t].type === e.type && r.rtcpFeedback[t].parameter === e.parameter) return !0;
                                return !1
                            });
                            break
                        }
                    }
                    var n, i, a, o, s, c
                }), d.headerExtensions.forEach(function (e) {
                    for (var t = 0; t < p.headerExtensions.length; t++) {
                        var r = p.headerExtensions[t];
                        if (e.uri === r.uri) {
                            u.headerExtensions.push(r);
                            break
                        }
                    }
                }), u
            }

            function a(e, t, r) {
                return -1 !== {
                    offer: {
                        setLocalDescription: ["stable", "have-local-offer"],
                        setRemoteDescription: ["stable", "have-remote-offer"]
                    },
                    answer: {
                        setLocalDescription: ["have-remote-offer", "have-local-pranswer"],
                        setRemoteDescription: ["have-local-offer", "have-remote-pranswer"]
                    }
                } [t][e].indexOf(r)
            }

            function A(e, t) {
                var r = e.getRemoteCandidates().find(function (e) {
                    return t.foundation === e.foundation && t.ip === e.ip && t.port === e.port && t.priority === e.priority && t.protocol === e.protocol && t.type === e.type
                });
                return r || e.addRemoteCandidate(t), !r
            }

            function v(e, t) {
                var r = new Error(t);
                return r.name = e, r.code = {
                    NotSupportedError: 9,
                    InvalidStateError: 11,
                    InvalidAccessError: 15,
                    TypeError: void 0,
                    OperationError: void 0
                } [e], r
            }
            t.exports = function (I, L) {
                function j(e, t) {
                    t.addTrack(e), t.dispatchEvent(new I.MediaStreamTrackEvent("addtrack", {
                        track: e
                    }))
                }

                function i(e, t, r, n) {
                    var i = new Event("track");
                    i.track = t, i.receiver = r, i.transceiver = {
                        receiver: r
                    }, i.streams = n, I.setTimeout(function () {
                        e._dispatchEvent("track", i)
                    })
                }
                var n = function (e) {
                    var t, n, i, r = this,
                        a = document.createDocumentFragment();
                    if (["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function (e) {
                            r[e] = a[e].bind(a)
                        }), this.canTrickleIceCandidates = null, this.needNegotiation = !1, this.localStreams = [], this.remoteStreams = [], this.localDescription = null, this.remoteDescription = null, this.signalingState = "stable", this.iceConnectionState = "new", this.connectionState = "new", this.iceGatheringState = "new", e = JSON.parse(JSON.stringify(e || {})), this.usingBundle = "max-bundle" === e.bundlePolicy, "negotiate" === e.rtcpMuxPolicy) throw v("NotSupportedError", "rtcpMuxPolicy 'negotiate' is not supported");
                    switch (e.rtcpMuxPolicy || (e.rtcpMuxPolicy = "require"), e.iceTransportPolicy) {
                        case "all":
                        case "relay":
                            break;
                        default:
                            e.iceTransportPolicy = "all"
                    }
                    switch (e.bundlePolicy) {
                        case "balanced":
                        case "max-compat":
                        case "max-bundle":
                            break;
                        default:
                            e.bundlePolicy = "balanced"
                    }
                    if (e.iceServers = (t = e.iceServers || [], n = L, i = !1, (t = JSON.parse(JSON.stringify(t))).filter(function (e) {
                            if (e && (e.urls || e.url)) {
                                var t = e.urls || e.url;
                                e.url && !e.urls && console.warn("RTCIceServer.url is deprecated! Use urls instead.");
                                var r = "string" == typeof t;
                                return r && (t = [t]), t = t.filter(function (e) {
                                    return 0 !== e.indexOf("turn:") || -1 === e.indexOf("transport=udp") || -1 !== e.indexOf("turn:[") || i ? 0 === e.indexOf("stun:") && 14393 <= n && -1 === e.indexOf("?transport=udp") : i = !0
                                }), delete e.url, e.urls = r ? t[0] : t, !!t.length
                            }
                        })), this._iceGatherers = [], e.iceCandidatePoolSize)
                        for (var o = e.iceCandidatePoolSize; 0 < o; o--) this._iceGatherers.push(new I.RTCIceGatherer({
                            iceServers: e.iceServers,
                            gatherPolicy: e.iceTransportPolicy
                        }));
                    else e.iceCandidatePoolSize = 0;
                    this._config = e, this.transceivers = [], this._sdpSessionId = N.generateSessionId(), this._sdpSessionVersion = 0, this._dtlsRole = void 0, this._isClosed = !1
                };
                n.prototype.onicecandidate = null, n.prototype.onaddstream = null, n.prototype.ontrack = null, n.prototype.onremovestream = null, n.prototype.onsignalingstatechange = null, n.prototype.oniceconnectionstatechange = null, n.prototype.onconnectionstatechange = null, n.prototype.onicegatheringstatechange = null, n.prototype.onnegotiationneeded = null, n.prototype.ondatachannel = null, n.prototype._dispatchEvent = function (e, t) {
                    this._isClosed || (this.dispatchEvent(t), "function" == typeof this["on" + e] && this["on" + e](t))
                }, n.prototype._emitGatheringStateChange = function () {
                    var e = new Event("icegatheringstatechange");
                    this._dispatchEvent("icegatheringstatechange", e)
                }, n.prototype.getConfiguration = function () {
                    return this._config
                }, n.prototype.getLocalStreams = function () {
                    return this.localStreams
                }, n.prototype.getRemoteStreams = function () {
                    return this.remoteStreams
                }, n.prototype._createTransceiver = function (e, t) {
                    var r = 0 < this.transceivers.length,
                        n = {
                            track: null,
                            iceGatherer: null,
                            iceTransport: null,
                            dtlsTransport: null,
                            localCapabilities: null,
                            remoteCapabilities: null,
                            rtpSender: null,
                            rtpReceiver: null,
                            kind: e,
                            mid: null,
                            sendEncodingParameters: null,
                            recvEncodingParameters: null,
                            stream: null,
                            associatedRemoteMediaStreams: [],
                            wantReceive: !0
                        };
                    if (this.usingBundle && r) n.iceTransport = this.transceivers[0].iceTransport, n.dtlsTransport = this.transceivers[0].dtlsTransport;
                    else {
                        var i = this._createIceAndDtlsTransports();
                        n.iceTransport = i.iceTransport, n.dtlsTransport = i.dtlsTransport
                    }
                    return t || this.transceivers.push(n), n
                }, n.prototype.addTrack = function (t, e) {
                    if (this._isClosed) throw v("InvalidStateError", "Attempted to call addTrack on a closed peerconnection.");
                    var r;
                    if (this.transceivers.find(function (e) {
                            return e.track === t
                        })) throw v("InvalidAccessError", "Track already exists.");
                    for (var n = 0; n < this.transceivers.length; n++) this.transceivers[n].track || this.transceivers[n].kind !== t.kind || (r = this.transceivers[n]);
                    return r || (r = this._createTransceiver(t.kind)), this._maybeFireNegotiationNeeded(), -1 === this.localStreams.indexOf(e) && this.localStreams.push(e), r.track = t, r.stream = e, r.rtpSender = new I.RTCRtpSender(t, r.dtlsTransport), r.rtpSender
                }, n.prototype.addStream = function (t) {
                    var r = this;
                    if (15025 <= L) t.getTracks().forEach(function (e) {
                        r.addTrack(e, t)
                    });
                    else {
                        var n = t.clone();
                        t.getTracks().forEach(function (e, t) {
                            var r = n.getTracks()[t];
                            e.addEventListener("enabled", function (e) {
                                r.enabled = e.enabled
                            })
                        }), n.getTracks().forEach(function (e) {
                            r.addTrack(e, n)
                        })
                    }
                }, n.prototype.removeTrack = function (t) {
                    if (this._isClosed) throw v("InvalidStateError", "Attempted to call removeTrack on a closed peerconnection.");
                    if (!(t instanceof I.RTCRtpSender)) throw new TypeError("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.");
                    var e = this.transceivers.find(function (e) {
                        return e.rtpSender === t
                    });
                    if (!e) throw v("InvalidAccessError", "Sender was not created by this connection.");
                    var r = e.stream;
                    e.rtpSender.stop(), e.rtpSender = null, e.track = null, e.stream = null, -1 === this.transceivers.map(function (e) {
                        return e.stream
                    }).indexOf(r) && -1 < this.localStreams.indexOf(r) && this.localStreams.splice(this.localStreams.indexOf(r), 1), this._maybeFireNegotiationNeeded()
                }, n.prototype.removeStream = function (e) {
                    var r = this;
                    e.getTracks().forEach(function (t) {
                        var e = r.getSenders().find(function (e) {
                            return e.track === t
                        });
                        e && r.removeTrack(e)
                    })
                }, n.prototype.getSenders = function () {
                    return this.transceivers.filter(function (e) {
                        return !!e.rtpSender
                    }).map(function (e) {
                        return e.rtpSender
                    })
                }, n.prototype.getReceivers = function () {
                    return this.transceivers.filter(function (e) {
                        return !!e.rtpReceiver
                    }).map(function (e) {
                        return e.rtpReceiver
                    })
                }, n.prototype._createIceGatherer = function (r, e) {
                    var n = this;
                    if (e && 0 < r) return this.transceivers[0].iceGatherer;
                    if (this._iceGatherers.length) return this._iceGatherers.shift();
                    var i = new I.RTCIceGatherer({
                        iceServers: this._config.iceServers,
                        gatherPolicy: this._config.iceTransportPolicy
                    });
                    return Object.defineProperty(i, "state", {
                        value: "new",
                        writable: !0
                    }), this.transceivers[r].bufferedCandidateEvents = [], this.transceivers[r].bufferCandidates = function (e) {
                        var t = !e.candidate || 0 === Object.keys(e.candidate).length;
                        i.state = t ? "completed" : "gathering", null !== n.transceivers[r].bufferedCandidateEvents && n.transceivers[r].bufferedCandidateEvents.push(e)
                    }, i.addEventListener("localcandidate", this.transceivers[r].bufferCandidates), i
                }, n.prototype._gather = function (s, c) {
                    var d = this,
                        p = this.transceivers[c].iceGatherer;
                    if (!p.onlocalcandidate) {
                        var e = this.transceivers[c].bufferedCandidateEvents;
                        this.transceivers[c].bufferedCandidateEvents = null, p.removeEventListener("localcandidate", this.transceivers[c].bufferCandidates), p.onlocalcandidate = function (e) {
                            if (!(d.usingBundle && 0 < c)) {
                                var t = new Event("icecandidate");
                                t.candidate = {
                                    sdpMid: s,
                                    sdpMLineIndex: c
                                };
                                var r = e.candidate,
                                    n = !r || 0 === Object.keys(r).length;
                                if (n) "new" !== p.state && "gathering" !== p.state || (p.state = "completed");
                                else {
                                    "new" === p.state && (p.state = "gathering"), r.component = 1, r.ufrag = p.getLocalParameters().usernameFragment;
                                    var i = N.writeCandidate(r);
                                    t.candidate = Object.assign(t.candidate, N.parseCandidate(i)), t.candidate.candidate = i, t.candidate.toJSON = function () {
                                        return {
                                            candidate: t.candidate.candidate,
                                            sdpMid: t.candidate.sdpMid,
                                            sdpMLineIndex: t.candidate.sdpMLineIndex,
                                            usernameFragment: t.candidate.usernameFragment
                                        }
                                    }
                                }
                                var a = N.getMediaSections(d.localDescription.sdp);
                                a[t.candidate.sdpMLineIndex] += n ? "a=end-of-candidates\r\n" : "a=" + t.candidate.candidate + "\r\n", d.localDescription.sdp = N.getDescription(d.localDescription.sdp) + a.join("");
                                var o = d.transceivers.every(function (e) {
                                    return e.iceGatherer && "completed" === e.iceGatherer.state
                                });
                                "gathering" !== d.iceGatheringState && (d.iceGatheringState = "gathering", d._emitGatheringStateChange()), n || d._dispatchEvent("icecandidate", t), o && (d._dispatchEvent("icecandidate", new Event("icecandidate")), d.iceGatheringState = "complete", d._emitGatheringStateChange())
                            }
                        }, I.setTimeout(function () {
                            e.forEach(function (e) {
                                p.onlocalcandidate(e)
                            })
                        }, 0)
                    }
                }, n.prototype._createIceAndDtlsTransports = function () {
                    var e = this,
                        t = new I.RTCIceTransport(null);
                    t.onicestatechange = function () {
                        e._updateIceConnectionState(), e._updateConnectionState()
                    };
                    var r = new I.RTCDtlsTransport(t);
                    return r.ondtlsstatechange = function () {
                        e._updateConnectionState()
                    }, r.onerror = function () {
                        Object.defineProperty(r, "state", {
                            value: "failed",
                            writable: !0
                        }), e._updateConnectionState()
                    }, {
                        iceTransport: t,
                        dtlsTransport: r
                    }
                }, n.prototype._disposeIceAndDtlsTransports = function (e) {
                    var t = this.transceivers[e].iceGatherer;
                    t && (delete t.onlocalcandidate, delete this.transceivers[e].iceGatherer);
                    var r = this.transceivers[e].iceTransport;
                    r && (delete r.onicestatechange, delete this.transceivers[e].iceTransport);
                    var n = this.transceivers[e].dtlsTransport;
                    n && (delete n.ondtlsstatechange, delete n.onerror, delete this.transceivers[e].dtlsTransport)
                }, n.prototype._transceive = function (e, t, r) {
                    var n = m(e.localCapabilities, e.remoteCapabilities);
                    t && e.rtpSender && (n.encodings = e.sendEncodingParameters, n.rtcp = {
                        cname: N.localCName,
                        compound: e.rtcpParameters.compound
                    }, e.recvEncodingParameters.length && (n.rtcp.ssrc = e.recvEncodingParameters[0].ssrc), e.rtpSender.send(n)), r && e.rtpReceiver && 0 < n.codecs.length && ("video" === e.kind && e.recvEncodingParameters && L < 15019 && e.recvEncodingParameters.forEach(function (e) {
                        delete e.rtx
                    }), e.recvEncodingParameters.length ? n.encodings = e.recvEncodingParameters : n.encodings = [{}], n.rtcp = {
                        compound: e.rtcpParameters.compound
                    }, e.rtcpParameters.cname && (n.rtcp.cname = e.rtcpParameters.cname), e.sendEncodingParameters.length && (n.rtcp.ssrc = e.sendEncodingParameters[0].ssrc), e.rtpReceiver.receive(n))
                }, n.prototype.setLocalDescription = function (e) {
                    var t, u, f = this;
                    if (-1 === ["offer", "answer"].indexOf(e.type)) return Promise.reject(v("TypeError", 'Unsupported type "' + e.type + '"'));
                    if (!a("setLocalDescription", e.type, f.signalingState) || f._isClosed) return Promise.reject(v("InvalidStateError", "Can not set local " + e.type + " in state " + f.signalingState));
                    if ("offer" === e.type) t = N.splitSections(e.sdp), u = t.shift(), t.forEach(function (e, t) {
                        var r = N.parseRtpParameters(e);
                        f.transceivers[t].localCapabilities = r
                    }), f.transceivers.forEach(function (e, t) {
                        f._gather(e.mid, t)
                    });
                    else if ("answer" === e.type) {
                        t = N.splitSections(f.remoteDescription.sdp), u = t.shift();
                        var l = 0 < N.matchPrefix(u, "a=ice-lite").length;
                        t.forEach(function (e, t) {
                            var r = f.transceivers[t],
                                n = r.iceGatherer,
                                i = r.iceTransport,
                                a = r.dtlsTransport,
                                o = r.localCapabilities,
                                s = r.remoteCapabilities;
                            if (!(N.isRejected(e) && 0 === N.matchPrefix(e, "a=bundle-only").length) && !r.rejected) {
                                var c = N.getIceParameters(e, u),
                                    d = N.getDtlsParameters(e, u);
                                l && (d.role = "server"), f.usingBundle && 0 !== t || (f._gather(r.mid, t), "new" === i.state && i.start(n, c, l ? "controlling" : "controlled"), "new" === a.state && a.start(d));
                                var p = m(o, s);
                                f._transceive(r, 0 < p.codecs.length, !1)
                            }
                        })
                    }
                    return f.localDescription = {
                        type: e.type,
                        sdp: e.sdp
                    }, "offer" === e.type ? f._updateSignalingState("have-local-offer") : f._updateSignalingState("stable"), Promise.resolve()
                }, n.prototype.setRemoteDescription = function (k) {
                    var w = this;
                    if (-1 === ["offer", "answer"].indexOf(k.type)) return Promise.reject(v("TypeError", 'Unsupported type "' + k.type + '"'));
                    if (!a("setRemoteDescription", k.type, w.signalingState) || w._isClosed) return Promise.reject(v("InvalidStateError", "Can not set remote " + k.type + " in state " + w.signalingState));
                    var _ = {};
                    w.remoteStreams.forEach(function (e) {
                        _[e.id] = e
                    });
                    var x = [],
                        e = N.splitSections(k.sdp),
                        O = e.shift(),
                        M = 0 < N.matchPrefix(O, "a=ice-lite").length,
                        D = 0 < N.matchPrefix(O, "a=group:BUNDLE ").length;
                    w.usingBundle = D;
                    var t = N.matchPrefix(O, "a=ice-options:")[0];
                    return w.canTrickleIceCandidates = !!t && 0 <= t.substr(14).split(" ").indexOf("trickle"), e.forEach(function (e, t) {
                        var r = N.splitLines(e),
                            n = N.getKind(e),
                            i = N.isRejected(e) && 0 === N.matchPrefix(e, "a=bundle-only").length,
                            a = r[0].substr(2).split(" ")[2],
                            o = N.getDirection(e, O),
                            s = N.parseMsid(e),
                            c = N.getMid(e) || N.generateIdentifier();
                        if ("application" === n && "DTLS/SCTP" === a || i) w.transceivers[t] = {
                            mid: c,
                            kind: n,
                            rejected: !0
                        };
                        else {
                            var d, p, u, f, l, m, v, h, g;
                            !i && w.transceivers[t] && w.transceivers[t].rejected && (w.transceivers[t] = w._createTransceiver(n, !0));
                            var y, C, T = N.parseRtpParameters(e);
                            i || (y = N.getIceParameters(e, O), (C = N.getDtlsParameters(e, O)).role = "client"), v = N.parseRtpEncodingParameters(e);
                            var S = N.parseRtcpParameters(e),
                                R = 0 < N.matchPrefix(e, "a=end-of-candidates", O).length,
                                P = N.matchPrefix(e, "a=candidate:").map(function (e) {
                                    return N.parseCandidate(e)
                                }).filter(function (e) {
                                    return 1 === e.component
                                });
                            if (("offer" === k.type || "answer" === k.type) && !i && D && 0 < t && w.transceivers[t] && (w._disposeIceAndDtlsTransports(t), w.transceivers[t].iceGatherer = w.transceivers[0].iceGatherer, w.transceivers[t].iceTransport = w.transceivers[0].iceTransport, w.transceivers[t].dtlsTransport = w.transceivers[0].dtlsTransport, w.transceivers[t].rtpSender && w.transceivers[t].rtpSender.setTransport(w.transceivers[0].dtlsTransport), w.transceivers[t].rtpReceiver && w.transceivers[t].rtpReceiver.setTransport(w.transceivers[0].dtlsTransport)), "offer" !== k.type || i) "answer" !== k.type || i || (p = (d = w.transceivers[t]).iceGatherer, u = d.iceTransport, f = d.dtlsTransport, l = d.rtpReceiver, m = d.sendEncodingParameters, h = d.localCapabilities, w.transceivers[t].recvEncodingParameters = v, w.transceivers[t].remoteCapabilities = T, w.transceivers[t].rtcpParameters = S, P.length && "new" === u.state && (!M && !R || D && 0 !== t ? P.forEach(function (e) {
                                A(d.iceTransport, e)
                            }) : u.setRemoteCandidates(P)), D && 0 !== t || ("new" === u.state && u.start(p, y, "controlling"), "new" === f.state && f.start(C)), w._transceive(d, "sendrecv" === o || "recvonly" === o, "sendrecv" === o || "sendonly" === o), !l || "sendrecv" !== o && "sendonly" !== o ? delete d.rtpReceiver : (g = l.track, s ? (_[s.stream] || (_[s.stream] = new I.MediaStream), j(g, _[s.stream]), x.push([g, l, _[s.stream]])) : (_.default || (_.default = new I.MediaStream), j(g, _.default), x.push([g, l, _.default]))));
                            else {
                                (d = w.transceivers[t] || w._createTransceiver(n)).mid = c, d.iceGatherer || (d.iceGatherer = w._createIceGatherer(t, D)), P.length && "new" === d.iceTransport.state && (!R || D && 0 !== t ? P.forEach(function (e) {
                                    A(d.iceTransport, e)
                                }) : d.iceTransport.setRemoteCandidates(P)), h = I.RTCRtpReceiver.getCapabilities(n), L < 15019 && (h.codecs = h.codecs.filter(function (e) {
                                    return "rtx" !== e.name
                                })), m = d.sendEncodingParameters || [{
                                    ssrc: 1001 * (2 * t + 2)
                                }];
                                var E, b = !1;
                                if ("sendrecv" === o || "sendonly" === o) {
                                    if (b = !d.rtpReceiver, l = d.rtpReceiver || new I.RTCRtpReceiver(d.dtlsTransport, n), b) g = l.track, s && "-" === s.stream || (s ? (_[s.stream] || (_[s.stream] = new I.MediaStream, Object.defineProperty(_[s.stream], "id", {
                                        get: function () {
                                            return s.stream
                                        }
                                    })), Object.defineProperty(g, "id", {
                                        get: function () {
                                            return s.track
                                        }
                                    }), E = _[s.stream]) : (_.default || (_.default = new I.MediaStream), E = _.default)), E && (j(g, E), d.associatedRemoteMediaStreams.push(E)), x.push([g, l, E])
                                } else d.rtpReceiver && d.rtpReceiver.track && (d.associatedRemoteMediaStreams.forEach(function (e) {
                                    var t, r, n = e.getTracks().find(function (e) {
                                        return e.id === d.rtpReceiver.track.id
                                    });
                                    n && (t = n, (r = e).removeTrack(t), r.dispatchEvent(new I.MediaStreamTrackEvent("removetrack", {
                                        track: t
                                    })))
                                }), d.associatedRemoteMediaStreams = []);
                                d.localCapabilities = h, d.remoteCapabilities = T, d.rtpReceiver = l, d.rtcpParameters = S, d.sendEncodingParameters = m, d.recvEncodingParameters = v, w._transceive(w.transceivers[t], !1, b)
                            }
                        }
                    }), void 0 === w._dtlsRole && (w._dtlsRole = "offer" === k.type ? "active" : "passive"), w.remoteDescription = {
                        type: k.type,
                        sdp: k.sdp
                    }, "offer" === k.type ? w._updateSignalingState("have-remote-offer") : w._updateSignalingState("stable"), Object.keys(_).forEach(function (e) {
                        var n = _[e];
                        if (n.getTracks().length) {
                            if (-1 === w.remoteStreams.indexOf(n)) {
                                w.remoteStreams.push(n);
                                var t = new Event("addstream");
                                t.stream = n, I.setTimeout(function () {
                                    w._dispatchEvent("addstream", t)
                                })
                            }
                            x.forEach(function (e) {
                                var t = e[0],
                                    r = e[1];
                                n.id === e[2].id && i(w, t, r, [n])
                            })
                        }
                    }), x.forEach(function (e) {
                        e[2] || i(w, e[0], e[1], [])
                    }), I.setTimeout(function () {
                        w && w.transceivers && w.transceivers.forEach(function (e) {
                            e.iceTransport && "new" === e.iceTransport.state && 0 < e.iceTransport.getRemoteCandidates().length && (console.warn("Timeout for addRemoteCandidate. Consider sending an end-of-candidates notification"), e.iceTransport.addRemoteCandidate({}))
                        })
                    }, 4e3), Promise.resolve()
                }, n.prototype.close = function () {
                    this.transceivers.forEach(function (e) {
                        e.iceTransport && e.iceTransport.stop(), e.dtlsTransport && e.dtlsTransport.stop(), e.rtpSender && e.rtpSender.stop(), e.rtpReceiver && e.rtpReceiver.stop()
                    }), this._isClosed = !0, this._updateSignalingState("closed")
                }, n.prototype._updateSignalingState = function (e) {
                    this.signalingState = e;
                    var t = new Event("signalingstatechange");
                    this._dispatchEvent("signalingstatechange", t)
                }, n.prototype._maybeFireNegotiationNeeded = function () {
                    var t = this;
                    "stable" === this.signalingState && !0 !== this.needNegotiation && (this.needNegotiation = !0, I.setTimeout(function () {
                        if (t.needNegotiation) {
                            t.needNegotiation = !1;
                            var e = new Event("negotiationneeded");
                            t._dispatchEvent("negotiationneeded", e)
                        }
                    }, 0))
                }, n.prototype._updateIceConnectionState = function () {
                    var e, t = {
                        new: 0,
                        closed: 0,
                        checking: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    if (this.transceivers.forEach(function (e) {
                            t[e.iceTransport.state]++
                        }), e = "new", 0 < t.failed ? e = "failed" : 0 < t.checking ? e = "checking" : 0 < t.disconnected ? e = "disconnected" : 0 < t.new ? e = "new" : 0 < t.connected ? e = "connected" : 0 < t.completed && (e = "completed"), e !== this.iceConnectionState) {
                        this.iceConnectionState = e;
                        var r = new Event("iceconnectionstatechange");
                        this._dispatchEvent("iceconnectionstatechange", r)
                    }
                }, n.prototype._updateConnectionState = function () {
                    var e, t = {
                        new: 0,
                        closed: 0,
                        connecting: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    if (this.transceivers.forEach(function (e) {
                            t[e.iceTransport.state]++, t[e.dtlsTransport.state]++
                        }), t.connected += t.completed, e = "new", 0 < t.failed ? e = "failed" : 0 < t.connecting ? e = "connecting" : 0 < t.disconnected ? e = "disconnected" : 0 < t.new ? e = "new" : 0 < t.connected && (e = "connected"), e !== this.connectionState) {
                        this.connectionState = e;
                        var r = new Event("connectionstatechange");
                        this._dispatchEvent("connectionstatechange", r)
                    }
                }, n.prototype.createOffer = function () {
                    var s = this;
                    if (s._isClosed) return Promise.reject(v("InvalidStateError", "Can not call createOffer after close"));
                    var t = s.transceivers.filter(function (e) {
                            return "audio" === e.kind
                        }).length,
                        r = s.transceivers.filter(function (e) {
                            return "video" === e.kind
                        }).length,
                        e = arguments[0];
                    if (e) {
                        if (e.mandatory || e.optional) throw new TypeError("Legacy mandatory/optional constraints not supported.");
                        void 0 !== e.offerToReceiveAudio && (t = !0 === e.offerToReceiveAudio ? 1 : !1 === e.offerToReceiveAudio ? 0 : e.offerToReceiveAudio), void 0 !== e.offerToReceiveVideo && (r = !0 === e.offerToReceiveVideo ? 1 : !1 === e.offerToReceiveVideo ? 0 : e.offerToReceiveVideo)
                    }
                    for (s.transceivers.forEach(function (e) {
                            "audio" === e.kind ? --t < 0 && (e.wantReceive = !1) : "video" === e.kind && --r < 0 && (e.wantReceive = !1)
                        }); 0 < t || 0 < r;) 0 < t && (s._createTransceiver("audio"), t--), 0 < r && (s._createTransceiver("video"), r--);
                    var n = N.writeSessionBoilerplate(s._sdpSessionId, s._sdpSessionVersion++);
                    s.transceivers.forEach(function (e, t) {
                        var r = e.track,
                            n = e.kind,
                            i = e.mid || N.generateIdentifier();
                        e.mid = i, e.iceGatherer || (e.iceGatherer = s._createIceGatherer(t, s.usingBundle));
                        var a = I.RTCRtpSender.getCapabilities(n);
                        L < 15019 && (a.codecs = a.codecs.filter(function (e) {
                            return "rtx" !== e.name
                        })), a.codecs.forEach(function (t) {
                            "H264" === t.name && void 0 === t.parameters["level-asymmetry-allowed"] && (t.parameters["level-asymmetry-allowed"] = "1"), e.remoteCapabilities && e.remoteCapabilities.codecs && e.remoteCapabilities.codecs.forEach(function (e) {
                                t.name.toLowerCase() === e.name.toLowerCase() && t.clockRate === e.clockRate && (t.preferredPayloadType = e.payloadType)
                            })
                        }), a.headerExtensions.forEach(function (t) {
                            (e.remoteCapabilities && e.remoteCapabilities.headerExtensions || []).forEach(function (e) {
                                t.uri === e.uri && (t.id = e.id)
                            })
                        });
                        var o = e.sendEncodingParameters || [{
                            ssrc: 1001 * (2 * t + 1)
                        }];
                        r && 15019 <= L && "video" === n && !o[0].rtx && (o[0].rtx = {
                            ssrc: o[0].ssrc + 1
                        }), e.wantReceive && (e.rtpReceiver = new I.RTCRtpReceiver(e.dtlsTransport, n)), e.localCapabilities = a, e.sendEncodingParameters = o
                    }), "max-compat" !== s._config.bundlePolicy && (n += "a=group:BUNDLE " + s.transceivers.map(function (e) {
                        return e.mid
                    }).join(" ") + "\r\n"), n += "a=ice-options:trickle\r\n", s.transceivers.forEach(function (e, t) {
                        n += c(e, e.localCapabilities, "offer", e.stream, s._dtlsRole), n += "a=rtcp-rsize\r\n", !e.iceGatherer || "new" === s.iceGatheringState || 0 !== t && s.usingBundle || (e.iceGatherer.getLocalCandidates().forEach(function (e) {
                            e.component = 1, n += "a=" + N.writeCandidate(e) + "\r\n"
                        }), "completed" === e.iceGatherer.state && (n += "a=end-of-candidates\r\n"))
                    });
                    var i = new I.RTCSessionDescription({
                        type: "offer",
                        sdp: n
                    });
                    return Promise.resolve(i)
                }, n.prototype.createAnswer = function () {
                    var i = this;
                    if (i._isClosed) return Promise.reject(v("InvalidStateError", "Can not call createAnswer after close"));
                    if ("have-remote-offer" !== i.signalingState && "have-local-pranswer" !== i.signalingState) return Promise.reject(v("InvalidStateError", "Can not call createAnswer in signalingState " + i.signalingState));
                    var a = N.writeSessionBoilerplate(i._sdpSessionId, i._sdpSessionVersion++);
                    i.usingBundle && (a += "a=group:BUNDLE " + i.transceivers.map(function (e) {
                        return e.mid
                    }).join(" ") + "\r\n");
                    var o = N.getMediaSections(i.remoteDescription.sdp).length;
                    i.transceivers.forEach(function (e, t) {
                        if (!(o < t + 1)) {
                            if (e.rejected) return "application" === e.kind ? a += "m=application 0 DTLS/SCTP 5000\r\n" : "audio" === e.kind ? a += "m=audio 0 UDP/TLS/RTP/SAVPF 0\r\na=rtpmap:0 PCMU/8000\r\n" : "video" === e.kind && (a += "m=video 0 UDP/TLS/RTP/SAVPF 120\r\na=rtpmap:120 VP8/90000\r\n"), void(a += "c=IN IP4 0.0.0.0\r\na=inactive\r\na=mid:" + e.mid + "\r\n");
                            var r;
                            if (e.stream) "audio" === e.kind ? r = e.stream.getAudioTracks()[0] : "video" === e.kind && (r = e.stream.getVideoTracks()[0]), r && 15019 <= L && "video" === e.kind && !e.sendEncodingParameters[0].rtx && (e.sendEncodingParameters[0].rtx = {
                                ssrc: e.sendEncodingParameters[0].ssrc + 1
                            });
                            var n = m(e.localCapabilities, e.remoteCapabilities);
                            !n.codecs.filter(function (e) {
                                return "rtx" === e.name.toLowerCase()
                            }).length && e.sendEncodingParameters[0].rtx && delete e.sendEncodingParameters[0].rtx, a += c(e, n, "answer", e.stream, i._dtlsRole), e.rtcpParameters && e.rtcpParameters.reducedSize && (a += "a=rtcp-rsize\r\n")
                        }
                    });
                    var e = new I.RTCSessionDescription({
                        type: "answer",
                        sdp: a
                    });
                    return Promise.resolve(e)
                }, n.prototype.addIceCandidate = function (c) {
                    var d, p = this;
                    return c && void 0 === c.sdpMLineIndex && !c.sdpMid ? Promise.reject(new TypeError("sdpMLineIndex or sdpMid required")) : new Promise(function (e, t) {
                        if (!p.remoteDescription) return t(v("InvalidStateError", "Can not add ICE candidate without a remote description"));
                        if (c && "" !== c.candidate) {
                            var r = c.sdpMLineIndex;
                            if (c.sdpMid)
                                for (var n = 0; n < p.transceivers.length; n++)
                                    if (p.transceivers[n].mid === c.sdpMid) {
                                        r = n;
                                        break
                                    } var i = p.transceivers[r];
                            if (!i) return t(v("OperationError", "Can not add ICE candidate"));
                            if (i.rejected) return e();
                            var a = 0 < Object.keys(c.candidate).length ? N.parseCandidate(c.candidate) : {};
                            if ("tcp" === a.protocol && (0 === a.port || 9 === a.port)) return e();
                            if (a.component && 1 !== a.component) return e();
                            if ((0 === r || 0 < r && i.iceTransport !== p.transceivers[0].iceTransport) && !A(i.iceTransport, a)) return t(v("OperationError", "Can not add ICE candidate"));
                            var o = c.candidate.trim();
                            0 === o.indexOf("a=") && (o = o.substr(2)), (d = N.getMediaSections(p.remoteDescription.sdp))[r] += "a=" + (a.type ? o : "end-of-candidates") + "\r\n", p.remoteDescription.sdp = N.getDescription(p.remoteDescription.sdp) + d.join("")
                        } else
                            for (var s = 0; s < p.transceivers.length && (p.transceivers[s].rejected || (p.transceivers[s].iceTransport.addRemoteCandidate({}), (d = N.getMediaSections(p.remoteDescription.sdp))[s] += "a=end-of-candidates\r\n", p.remoteDescription.sdp = N.getDescription(p.remoteDescription.sdp) + d.join(""), !p.usingBundle)); s++);
                        e()
                    })
                }, n.prototype.getStats = function (t) {
                    if (t && t instanceof I.MediaStreamTrack) {
                        var r = null;
                        if (this.transceivers.forEach(function (e) {
                                e.rtpSender && e.rtpSender.track === t ? r = e.rtpSender : e.rtpReceiver && e.rtpReceiver.track === t && (r = e.rtpReceiver)
                            }), !r) throw v("InvalidAccessError", "Invalid selector.");
                        return r.getStats()
                    }
                    var n = [];
                    return this.transceivers.forEach(function (t) {
                        ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function (e) {
                            t[e] && n.push(t[e].getStats())
                        })
                    }), Promise.all(n).then(function (e) {
                        var t = new Map;
                        return e.forEach(function (e) {
                            e.forEach(function (e) {
                                t.set(e.id, e)
                            })
                        }), t
                    })
                };
                ["RTCRtpSender", "RTCRtpReceiver", "RTCIceGatherer", "RTCIceTransport", "RTCDtlsTransport"].forEach(function (e) {
                    var t = I[e];
                    if (t && t.prototype && t.prototype.getStats) {
                        var r = t.prototype.getStats;
                        t.prototype.getStats = function () {
                            return r.apply(this).then(function (r) {
                                var n = new Map;
                                return Object.keys(r).forEach(function (e) {
                                    var t;
                                    r[e].type = {
                                        inboundrtp: "inbound-rtp",
                                        outboundrtp: "outbound-rtp",
                                        candidatepair: "candidate-pair",
                                        localcandidate: "local-candidate",
                                        remotecandidate: "remote-candidate"
                                    } [(t = r[e]).type] || t.type, n.set(e, r[e])
                                }), n
                            })
                        }
                    }
                });
                var e = ["createOffer", "createAnswer"];
                return e.forEach(function (e) {
                    var r = n.prototype[e];
                    n.prototype[e] = function () {
                        var t = arguments;
                        return "function" == typeof t[0] || "function" == typeof t[1] ? r.apply(this, [arguments[2]]).then(function (e) {
                            "function" == typeof t[0] && t[0].apply(null, [e])
                        }, function (e) {
                            "function" == typeof t[1] && t[1].apply(null, [e])
                        }) : r.apply(this, arguments)
                    }
                }), (e = ["setLocalDescription", "setRemoteDescription", "addIceCandidate"]).forEach(function (e) {
                    var r = n.prototype[e];
                    n.prototype[e] = function () {
                        var t = arguments;
                        return "function" == typeof t[1] || "function" == typeof t[2] ? r.apply(this, arguments).then(function () {
                            "function" == typeof t[1] && t[1].apply(null)
                        }, function (e) {
                            "function" == typeof t[2] && t[2].apply(null, [e])
                        }) : r.apply(this, arguments)
                    }
                }), ["getStats"].forEach(function (e) {
                    var t = n.prototype[e];
                    n.prototype[e] = function () {
                        var e = arguments;
                        return "function" == typeof e[1] ? t.apply(this, arguments).then(function () {
                            "function" == typeof e[1] && e[1].apply(null)
                        }) : t.apply(this, arguments)
                    }
                }), n
            }
        }, {
            sdp: 2
        }],
        2: [function (e, t, r) {
            "use strict";
            var p = {
                generateIdentifier: function () {
                    return Math.random().toString(36).substr(2, 10)
                }
            };
            p.localCName = p.generateIdentifier(), p.splitLines = function (e) {
                return e.trim().split("\n").map(function (e) {
                    return e.trim()
                })
            }, p.splitSections = function (e) {
                return e.split("\nm=").map(function (e, t) {
                    return (0 < t ? "m=" + e : e).trim() + "\r\n"
                })
            }, p.getDescription = function (e) {
                var t = p.splitSections(e);
                return t && t[0]
            }, p.getMediaSections = function (e) {
                var t = p.splitSections(e);
                return t.shift(), t
            }, p.matchPrefix = function (e, t) {
                return p.splitLines(e).filter(function (e) {
                    return 0 === e.indexOf(t)
                })
            }, p.parseCandidate = function (e) {
                for (var t, r = {
                        foundation: (t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" "))[0],
                        component: parseInt(t[1], 10),
                        protocol: t[2].toLowerCase(),
                        priority: parseInt(t[3], 10),
                        ip: t[4],
                        port: parseInt(t[5], 10),
                        type: t[7]
                    }, n = 8; n < t.length; n += 2) switch (t[n]) {
                    case "raddr":
                        r.relatedAddress = t[n + 1];
                        break;
                    case "rport":
                        r.relatedPort = parseInt(t[n + 1], 10);
                        break;
                    case "tcptype":
                        r.tcpType = t[n + 1];
                        break;
                    case "ufrag":
                        r.ufrag = t[n + 1], r.usernameFragment = t[n + 1];
                        break;
                    default:
                        r[t[n]] = t[n + 1]
                }
                return r
            }, p.writeCandidate = function (e) {
                var t = [];
                t.push(e.foundation), t.push(e.component), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.ip), t.push(e.port);
                var r = e.type;
                return t.push("typ"), t.push(r), "host" !== r && e.relatedAddress && e.relatedPort && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"), t.push(e.tcpType)), (e.usernameFragment || e.ufrag) && (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)), "candidate:" + t.join(" ")
            }, p.parseIceOptions = function (e) {
                return e.substr(14).split(" ")
            }, p.parseRtpMap = function (e) {
                var t = e.substr(9).split(" "),
                    r = {
                        payloadType: parseInt(t.shift(), 10)
                    };
                return t = t[0].split("/"), r.name = t[0], r.clockRate = parseInt(t[1], 10), r.numChannels = 3 === t.length ? parseInt(t[2], 10) : 1, r
            }, p.writeRtpMap = function (e) {
                var t = e.payloadType;
                return void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType), "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== e.numChannels ? "/" + e.numChannels : "") + "\r\n"
            }, p.parseExtmap = function (e) {
                var t = e.substr(9).split(" ");
                return {
                    id: parseInt(t[0], 10),
                    direction: 0 < t[0].indexOf("/") ? t[0].split("/")[1] : "sendrecv",
                    uri: t[1]
                }
            }, p.writeExtmap = function (e) {
                return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + "\r\n"
            }, p.parseFmtp = function (e) {
                for (var t, r = {}, n = e.substr(e.indexOf(" ") + 1).split(";"), i = 0; i < n.length; i++) r[(t = n[i].trim().split("="))[0].trim()] = t[1];
                return r
            }, p.writeFmtp = function (t) {
                var e = "",
                    r = t.payloadType;
                if (void 0 !== t.preferredPayloadType && (r = t.preferredPayloadType), t.parameters && Object.keys(t.parameters).length) {
                    var n = [];
                    Object.keys(t.parameters).forEach(function (e) {
                        n.push(e + "=" + t.parameters[e])
                    }), e += "a=fmtp:" + r + " " + n.join(";") + "\r\n"
                }
                return e
            }, p.parseRtcpFb = function (e) {
                var t = e.substr(e.indexOf(" ") + 1).split(" ");
                return {
                    type: t.shift(),
                    parameter: t.join(" ")
                }
            }, p.writeRtcpFb = function (e) {
                var t = "",
                    r = e.payloadType;
                return void 0 !== e.preferredPayloadType && (r = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach(function (e) {
                    t += "a=rtcp-fb:" + r + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n"
                }), t
            }, p.parseSsrcMedia = function (e) {
                var t = e.indexOf(" "),
                    r = {
                        ssrc: parseInt(e.substr(7, t - 7), 10)
                    },
                    n = e.indexOf(":", t);
                return -1 < n ? (r.attribute = e.substr(t + 1, n - t - 1), r.value = e.substr(n + 1)) : r.attribute = e.substr(t + 1), r
            }, p.getMid = function (e) {
                var t = p.matchPrefix(e, "a=mid:")[0];
                if (t) return t.substr(6)
            }, p.parseFingerprint = function (e) {
                var t = e.substr(14).split(" ");
                return {
                    algorithm: t[0].toLowerCase(),
                    value: t[1]
                }
            }, p.getDtlsParameters = function (e, t) {
                return {
                    role: "auto",
                    fingerprints: p.matchPrefix(e + t, "a=fingerprint:").map(p.parseFingerprint)
                }
            }, p.writeDtlsParameters = function (e, t) {
                var r = "a=setup:" + t + "\r\n";
                return e.fingerprints.forEach(function (e) {
                    r += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n"
                }), r
            }, p.getIceParameters = function (e, t) {
                var r = p.splitLines(e);
                return {
                    usernameFragment: (r = r.concat(p.splitLines(t))).filter(function (e) {
                        return 0 === e.indexOf("a=ice-ufrag:")
                    })[0].substr(12),
                    password: r.filter(function (e) {
                        return 0 === e.indexOf("a=ice-pwd:")
                    })[0].substr(10)
                }
            }, p.writeIceParameters = function (e) {
                return "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n"
            }, p.parseRtpParameters = function (e) {
                for (var t = {
                        codecs: [],
                        headerExtensions: [],
                        fecMechanisms: [],
                        rtcp: []
                    }, r = p.splitLines(e)[0].split(" "), n = 3; n < r.length; n++) {
                    var i = r[n],
                        a = p.matchPrefix(e, "a=rtpmap:" + i + " ")[0];
                    if (a) {
                        var o = p.parseRtpMap(a),
                            s = p.matchPrefix(e, "a=fmtp:" + i + " ");
                        switch (o.parameters = s.length ? p.parseFmtp(s[0]) : {}, o.rtcpFeedback = p.matchPrefix(e, "a=rtcp-fb:" + i + " ").map(p.parseRtcpFb), t.codecs.push(o), o.name.toUpperCase()) {
                            case "RED":
                            case "ULPFEC":
                                t.fecMechanisms.push(o.name.toUpperCase())
                        }
                    }
                }
                return p.matchPrefix(e, "a=extmap:").forEach(function (e) {
                    t.headerExtensions.push(p.parseExtmap(e))
                }), t
            }, p.writeRtpDescription = function (e, t) {
                var r = "";
                r += "m=" + e + " ", r += 0 < t.codecs.length ? "9" : "0", r += " UDP/TLS/RTP/SAVPF ", r += t.codecs.map(function (e) {
                    return void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType
                }).join(" ") + "\r\n", r += "c=IN IP4 0.0.0.0\r\n", r += "a=rtcp:9 IN IP4 0.0.0.0\r\n", t.codecs.forEach(function (e) {
                    r += p.writeRtpMap(e), r += p.writeFmtp(e), r += p.writeRtcpFb(e)
                });
                var n = 0;
                return t.codecs.forEach(function (e) {
                    e.maxptime > n && (n = e.maxptime)
                }), 0 < n && (r += "a=maxptime:" + n + "\r\n"), r += "a=rtcp-mux\r\n", t.headerExtensions.forEach(function (e) {
                    r += p.writeExtmap(e)
                }), r
            }, p.parseRtpEncodingParameters = function (e) {
                var r, n = [],
                    t = p.parseRtpParameters(e),
                    i = -1 !== t.fecMechanisms.indexOf("RED"),
                    a = -1 !== t.fecMechanisms.indexOf("ULPFEC"),
                    o = p.matchPrefix(e, "a=ssrc:").map(function (e) {
                        return p.parseSsrcMedia(e)
                    }).filter(function (e) {
                        return "cname" === e.attribute
                    }),
                    s = 0 < o.length && o[0].ssrc,
                    c = p.matchPrefix(e, "a=ssrc-group:FID").map(function (e) {
                        var t = e.split(" ");
                        return t.shift(), t.map(function (e) {
                            return parseInt(e, 10)
                        })
                    });
                0 < c.length && 1 < c[0].length && c[0][0] === s && (r = c[0][1]), t.codecs.forEach(function (e) {
                    if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                        var t = {
                            ssrc: s,
                            codecPayloadType: parseInt(e.parameters.apt, 10),
                            rtx: {
                                ssrc: r
                            }
                        };
                        n.push(t), i && ((t = JSON.parse(JSON.stringify(t))).fec = {
                            ssrc: r,
                            mechanism: a ? "red+ulpfec" : "red"
                        }, n.push(t))
                    }
                }), 0 === n.length && s && n.push({
                    ssrc: s
                });
                var d = p.matchPrefix(e, "b=");
                return d.length && (d = 0 === d[0].indexOf("b=TIAS:") ? parseInt(d[0].substr(7), 10) : 0 === d[0].indexOf("b=AS:") ? 1e3 * parseInt(d[0].substr(5), 10) * .95 - 16e3 : void 0, n.forEach(function (e) {
                    e.maxBitrate = d
                })), n
            }, p.parseRtcpParameters = function (e) {
                var t = {},
                    r = p.matchPrefix(e, "a=ssrc:").map(function (e) {
                        return p.parseSsrcMedia(e)
                    }).filter(function (e) {
                        return "cname" === e.attribute
                    })[0];
                r && (t.cname = r.value, t.ssrc = r.ssrc);
                var n = p.matchPrefix(e, "a=rtcp-rsize");
                t.reducedSize = 0 < n.length, t.compound = 0 === n.length;
                var i = p.matchPrefix(e, "a=rtcp-mux");
                return t.mux = 0 < i.length, t
            }, p.parseMsid = function (e) {
                var t, r = p.matchPrefix(e, "a=msid:");
                if (1 === r.length) return {
                    stream: (t = r[0].substr(7).split(" "))[0],
                    track: t[1]
                };
                var n = p.matchPrefix(e, "a=ssrc:").map(function (e) {
                    return p.parseSsrcMedia(e)
                }).filter(function (e) {
                    return "msid" === e.attribute
                });
                return 0 < n.length ? {
                    stream: (t = n[0].value.split(" "))[0],
                    track: t[1]
                } : void 0
            }, p.generateSessionId = function () {
                return Math.random().toString().substr(2, 21)
            }, p.writeSessionBoilerplate = function (e, t) {
                var r = void 0 !== t ? t : 2;
                return "v=0\r\no=thisisadapterortc " + (e || p.generateSessionId()) + " " + r + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
            }, p.writeMediaSection = function (e, t, r, n) {
                var i = p.writeRtpDescription(e.kind, t);
                if (i += p.writeIceParameters(e.iceGatherer.getLocalParameters()), i += p.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === r ? "actpass" : "active"), i += "a=mid:" + e.mid + "\r\n", e.direction ? i += "a=" + e.direction + "\r\n" : e.rtpSender && e.rtpReceiver ? i += "a=sendrecv\r\n" : e.rtpSender ? i += "a=sendonly\r\n" : e.rtpReceiver ? i += "a=recvonly\r\n" : i += "a=inactive\r\n", e.rtpSender) {
                    var a = "msid:" + n.id + " " + e.rtpSender.track.id + "\r\n";
                    i += "a=" + a, i += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + a, e.sendEncodingParameters[0].rtx && (i += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + a, i += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
                }
                return i += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + p.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (i += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + p.localCName + "\r\n"), i
            }, p.getDirection = function (e, t) {
                for (var r = p.splitLines(e), n = 0; n < r.length; n++) switch (r[n]) {
                    case "a=sendrecv":
                    case "a=sendonly":
                    case "a=recvonly":
                    case "a=inactive":
                        return r[n].substr(2)
                }
                return t ? p.getDirection(t) : "sendrecv"
            }, p.getKind = function (e) {
                return p.splitLines(e)[0].split(" ")[0].substr(2)
            }, p.isRejected = function (e) {
                return "0" === e.split(" ", 2)[1]
            }, p.parseMLine = function (e) {
                var t = p.splitLines(e)[0].substr(2).split(" ");
                return {
                    kind: t[0],
                    port: parseInt(t[1], 10),
                    protocol: t[2],
                    fmt: t.slice(3).join(" ")
                }
            }, p.parseOLine = function (e) {
                var t = p.matchPrefix(e, "o=")[0].substr(2).split(" ");
                return {
                    username: t[0],
                    sessionId: t[1],
                    sessionVersion: parseInt(t[2], 10),
                    netType: t[3],
                    addressType: t[4],
                    address: t[5]
                }
            }, "object" == typeof t && (t.exports = p)
        }, {}],
        3: [function (r, n, e) {
            (function (e) {
                "use strict";
                var t = r("./adapter_factory.js");
                n.exports = t({
                    window: e.window
                })
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./adapter_factory.js": 4
        }],
        4: [function (l, e, t) {
            "use strict";
            var m = l("./utils");
            e.exports = function (e, t) {
                var r = e && e.window,
                    n = {
                        shimChrome: !0,
                        shimFirefox: !0,
                        shimEdge: !0,
                        shimSafari: !0
                    };
                for (var i in t) hasOwnProperty.call(t, i) && (n[i] = t[i]);
                var a = m.log,
                    o = m.detectBrowser(r),
                    s = l("./chrome/chrome_shim") || null,
                    c = l("./edge/edge_shim") || null,
                    d = l("./firefox/firefox_shim") || null,
                    p = l("./safari/safari_shim") || null,
                    u = l("./common_shim") || null,
                    f = {
                        browserDetails: o,
                        commonShim: u,
                        extractVersion: m.extractVersion,
                        disableLog: m.disableLog,
                        disableWarnings: m.disableWarnings
                    };
                switch (o.browser) {
                    case "chrome":
                        if (!s || !s.shimPeerConnection || !n.shimChrome) return a("Chrome shim is not included in this adapter release."), f;
                        a("adapter.js shimming chrome."), f.browserShim = s, u.shimCreateObjectURL(r), s.shimGetUserMedia(r), s.shimMediaStream(r), s.shimSourceObject(r), s.shimPeerConnection(r), s.shimOnTrack(r), s.shimAddTrackRemoveTrack(r), s.shimGetSendersWithDtmf(r), u.shimRTCIceCandidate(r), u.shimMaxMessageSize(r), u.shimSendThrowTypeError(r);
                        break;
                    case "firefox":
                        if (!d || !d.shimPeerConnection || !n.shimFirefox) return a("Firefox shim is not included in this adapter release."), f;
                        a("adapter.js shimming firefox."), f.browserShim = d, u.shimCreateObjectURL(r), d.shimGetUserMedia(r), d.shimSourceObject(r), d.shimPeerConnection(r), d.shimOnTrack(r), d.shimRemoveStream(r), u.shimRTCIceCandidate(r), u.shimMaxMessageSize(r), u.shimSendThrowTypeError(r);
                        break;
                    case "edge":
                        if (!c || !c.shimPeerConnection || !n.shimEdge) return a("MS edge shim is not included in this adapter release."), f;
                        a("adapter.js shimming edge."), f.browserShim = c, u.shimCreateObjectURL(r), c.shimGetUserMedia(r), c.shimPeerConnection(r), c.shimReplaceTrack(r), u.shimMaxMessageSize(r), u.shimSendThrowTypeError(r);
                        break;
                    case "safari":
                        if (!p || !n.shimSafari) return a("Safari shim is not included in this adapter release."), f;
                        a("adapter.js shimming safari."), f.browserShim = p, u.shimCreateObjectURL(r), p.shimRTCIceServerUrls(r), p.shimCallbacksAPI(r), p.shimLocalStreamsAPI(r), p.shimRemoteStreamsAPI(r), p.shimTrackEventTransceiver(r), p.shimGetUserMedia(r), p.shimCreateOfferLegacy(r), u.shimRTCIceCandidate(r), u.shimMaxMessageSize(r), u.shimSendThrowTypeError(r);
                        break;
                    default:
                        a("Unsupported browser!")
                }
                return f
            }
        }, {
            "./chrome/chrome_shim": 5,
            "./common_shim": 7,
            "./edge/edge_shim": 8,
            "./firefox/firefox_shim": 10,
            "./safari/safari_shim": 12,
            "./utils": 13
        }],
        5: [function (e, t, r) {
            "use strict";
            var c = e("../utils.js"),
                n = c.log;
            t.exports = {
                shimGetUserMedia: e("./getusermedia"),
                shimMediaStream: function (e) {
                    e.MediaStream = e.MediaStream || e.webkitMediaStream
                },
                shimOnTrack: function (a) {
                    if ("object" != typeof a || !a.RTCPeerConnection || "ontrack" in a.RTCPeerConnection.prototype) "RTCRtpTransceiver" in a || c.wrapPeerConnectionEvent(a, "track", function (e) {
                        return e.transceiver || (e.transceiver = {
                            receiver: e.receiver
                        }), e
                    });
                    else {
                        Object.defineProperty(a.RTCPeerConnection.prototype, "ontrack", {
                            get: function () {
                                return this._ontrack
                            },
                            set: function (e) {
                                this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = e)
                            }
                        });
                        var e = a.RTCPeerConnection.prototype.setRemoteDescription;
                        a.RTCPeerConnection.prototype.setRemoteDescription = function () {
                            var i = this;
                            return i._ontrackpoly || (i._ontrackpoly = function (n) {
                                n.stream.addEventListener("addtrack", function (t) {
                                    var e;
                                    e = a.RTCPeerConnection.prototype.getReceivers ? i.getReceivers().find(function (e) {
                                        return e.track && e.track.id === t.track.id
                                    }) : {
                                        track: t.track
                                    };
                                    var r = new Event("track");
                                    r.track = t.track, r.receiver = e, r.transceiver = {
                                        receiver: e
                                    }, r.streams = [n.stream], i.dispatchEvent(r)
                                }), n.stream.getTracks().forEach(function (t) {
                                    var e;
                                    e = a.RTCPeerConnection.prototype.getReceivers ? i.getReceivers().find(function (e) {
                                        return e.track && e.track.id === t.id
                                    }) : {
                                        track: t
                                    };
                                    var r = new Event("track");
                                    r.track = t, r.receiver = e, r.transceiver = {
                                        receiver: e
                                    }, r.streams = [n.stream], i.dispatchEvent(r)
                                })
                            }, i.addEventListener("addstream", i._ontrackpoly)), e.apply(i, arguments)
                        }
                    }
                },
                shimGetSendersWithDtmf: function (e) {
                    if ("object" == typeof e && e.RTCPeerConnection && !("getSenders" in e.RTCPeerConnection.prototype) && "createDTMFSender" in e.RTCPeerConnection.prototype) {
                        var n = function (e, t) {
                            return {
                                track: t,
                                get dtmf() {
                                    return void 0 === this._dtmf && ("audio" === t.kind ? this._dtmf = e.createDTMFSender(t) : this._dtmf = null), this._dtmf
                                },
                                _pc: e
                            }
                        };
                        if (!e.RTCPeerConnection.prototype.getSenders) {
                            e.RTCPeerConnection.prototype.getSenders = function () {
                                return this._senders = this._senders || [], this._senders.slice()
                            };
                            var i = e.RTCPeerConnection.prototype.addTrack;
                            e.RTCPeerConnection.prototype.addTrack = function (e, t) {
                                var r = i.apply(this, arguments);
                                return r || (r = n(this, e), this._senders.push(r)), r
                            };
                            var r = e.RTCPeerConnection.prototype.removeTrack;
                            e.RTCPeerConnection.prototype.removeTrack = function (e) {
                                r.apply(this, arguments);
                                var t = this._senders.indexOf(e); - 1 !== t && this._senders.splice(t, 1)
                            }
                        }
                        var a = e.RTCPeerConnection.prototype.addStream;
                        e.RTCPeerConnection.prototype.addStream = function (e) {
                            var t = this;
                            t._senders = t._senders || [], a.apply(t, [e]), e.getTracks().forEach(function (e) {
                                t._senders.push(n(t, e))
                            })
                        };
                        var t = e.RTCPeerConnection.prototype.removeStream;
                        e.RTCPeerConnection.prototype.removeStream = function (e) {
                            var r = this;
                            r._senders = r._senders || [], t.apply(r, [e]), e.getTracks().forEach(function (t) {
                                var e = r._senders.find(function (e) {
                                    return e.track === t
                                });
                                e && r._senders.splice(r._senders.indexOf(e), 1)
                            })
                        }
                    } else if ("object" == typeof e && e.RTCPeerConnection && "getSenders" in e.RTCPeerConnection.prototype && "createDTMFSender" in e.RTCPeerConnection.prototype && e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype)) {
                        var o = e.RTCPeerConnection.prototype.getSenders;
                        e.RTCPeerConnection.prototype.getSenders = function () {
                            var t = this,
                                e = o.apply(t, []);
                            return e.forEach(function (e) {
                                e._pc = t
                            }), e
                        }, Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
                            get: function () {
                                return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf
                            }
                        })
                    }
                },
                shimSourceObject: function (e) {
                    var r = e && e.URL;
                    "object" == typeof e && (!e.HTMLMediaElement || "srcObject" in e.HTMLMediaElement.prototype || Object.defineProperty(e.HTMLMediaElement.prototype, "srcObject", {
                        get: function () {
                            return this._srcObject
                        },
                        set: function (e) {
                            var t = this;
                            this._srcObject = e, this.src && r.revokeObjectURL(this.src), e ? (this.src = r.createObjectURL(e), e.addEventListener("addtrack", function () {
                                t.src && r.revokeObjectURL(t.src), t.src = r.createObjectURL(e)
                            }), e.addEventListener("removetrack", function () {
                                t.src && r.revokeObjectURL(t.src), t.src = r.createObjectURL(e)
                            })) : this.src = ""
                        }
                    }))
                },
                shimAddTrackRemoveTrackWithNative: function (e) {
                    e.RTCPeerConnection.prototype.getLocalStreams = function () {
                        var t = this;
                        return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map(function (e) {
                            return t._shimmedLocalStreams[e][0]
                        })
                    };
                    var n = e.RTCPeerConnection.prototype.addTrack;
                    e.RTCPeerConnection.prototype.addTrack = function (e, t) {
                        if (!t) return n.apply(this, arguments);
                        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                        var r = n.apply(this, arguments);
                        return this._shimmedLocalStreams[t.id] ? -1 === this._shimmedLocalStreams[t.id].indexOf(r) && this._shimmedLocalStreams[t.id].push(r) : this._shimmedLocalStreams[t.id] = [t, r], r
                    };
                    var i = e.RTCPeerConnection.prototype.addStream;
                    e.RTCPeerConnection.prototype.addStream = function (e) {
                        var r = this;
                        this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e.getTracks().forEach(function (t) {
                            if (r.getSenders().find(function (e) {
                                    return e.track === t
                                })) throw new DOMException("Track already exists.", "InvalidAccessError")
                        });
                        var t = r.getSenders();
                        i.apply(this, arguments);
                        var n = r.getSenders().filter(function (e) {
                            return -1 === t.indexOf(e)
                        });
                        this._shimmedLocalStreams[e.id] = [e].concat(n)
                    };
                    var t = e.RTCPeerConnection.prototype.removeStream;
                    e.RTCPeerConnection.prototype.removeStream = function (e) {
                        return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[e.id], t.apply(this, arguments)
                    };
                    var a = e.RTCPeerConnection.prototype.removeTrack;
                    e.RTCPeerConnection.prototype.removeTrack = function (r) {
                        var n = this;
                        return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, r && Object.keys(this._shimmedLocalStreams).forEach(function (e) {
                            var t = n._shimmedLocalStreams[e].indexOf(r); - 1 !== t && n._shimmedLocalStreams[e].splice(t, 1), 1 === n._shimmedLocalStreams[e].length && delete n._shimmedLocalStreams[e]
                        }), a.apply(this, arguments)
                    }
                },
                shimAddTrackRemoveTrack: function (o) {
                    var e = c.detectBrowser(o);
                    if (o.RTCPeerConnection.prototype.addTrack && 65 <= e.version) return this.shimAddTrackRemoveTrackWithNative(o);
                    var r = o.RTCPeerConnection.prototype.getLocalStreams;
                    o.RTCPeerConnection.prototype.getLocalStreams = function () {
                        var t = this,
                            e = r.apply(this);
                        return t._reverseStreams = t._reverseStreams || {}, e.map(function (e) {
                            return t._reverseStreams[e.id]
                        })
                    };
                    var n = o.RTCPeerConnection.prototype.addStream;
                    o.RTCPeerConnection.prototype.addStream = function (e) {
                        var r = this;
                        if (r._streams = r._streams || {}, r._reverseStreams = r._reverseStreams || {}, e.getTracks().forEach(function (t) {
                                if (r.getSenders().find(function (e) {
                                        return e.track === t
                                    })) throw new DOMException("Track already exists.", "InvalidAccessError")
                            }), !r._reverseStreams[e.id]) {
                            var t = new o.MediaStream(e.getTracks());
                            r._streams[e.id] = t, r._reverseStreams[t.id] = e, e = t
                        }
                        n.apply(r, [e])
                    };
                    var i = o.RTCPeerConnection.prototype.removeStream;

                    function a(n, e) {
                        var i = e.sdp;
                        return Object.keys(n._reverseStreams || []).forEach(function (e) {
                            var t = n._reverseStreams[e],
                                r = n._streams[t.id];
                            i = i.replace(new RegExp(r.id, "g"), t.id)
                        }), new RTCSessionDescription({
                            type: e.type,
                            sdp: i
                        })
                    }
                    o.RTCPeerConnection.prototype.removeStream = function (e) {
                        var t = this;
                        t._streams = t._streams || {}, t._reverseStreams = t._reverseStreams || {}, i.apply(t, [t._streams[e.id] || e]), delete t._reverseStreams[t._streams[e.id] ? t._streams[e.id].id : e.id], delete t._streams[e.id]
                    }, o.RTCPeerConnection.prototype.addTrack = function (t, e) {
                        var r = this;
                        if ("closed" === r.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
                        var n = [].slice.call(arguments, 1);
                        if (1 !== n.length || !n[0].getTracks().find(function (e) {
                                return e === t
                            })) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
                        if (r.getSenders().find(function (e) {
                                return e.track === t
                            })) throw new DOMException("Track already exists.", "InvalidAccessError");
                        r._streams = r._streams || {}, r._reverseStreams = r._reverseStreams || {};
                        var i = r._streams[e.id];
                        if (i) i.addTrack(t), Promise.resolve().then(function () {
                            r.dispatchEvent(new Event("negotiationneeded"))
                        });
                        else {
                            var a = new o.MediaStream([t]);
                            r._streams[e.id] = a, r._reverseStreams[a.id] = e, r.addStream(a)
                        }
                        return r.getSenders().find(function (e) {
                            return e.track === t
                        })
                    }, ["createOffer", "createAnswer"].forEach(function (e) {
                        var t = o.RTCPeerConnection.prototype[e];
                        o.RTCPeerConnection.prototype[e] = function () {
                            var r = this,
                                n = arguments;
                            return arguments.length && "function" == typeof arguments[0] ? t.apply(r, [function (e) {
                                var t = a(r, e);
                                n[0].apply(null, [t])
                            }, function (e) {
                                n[1] && n[1].apply(null, e)
                            }, arguments[2]]) : t.apply(r, arguments).then(function (e) {
                                return a(r, e)
                            })
                        }
                    });
                    var t = o.RTCPeerConnection.prototype.setLocalDescription;
                    o.RTCPeerConnection.prototype.setLocalDescription = function () {
                        var n, e, i;
                        return arguments.length && arguments[0].type && (arguments[0] = (n = this, e = arguments[0], i = e.sdp, Object.keys(n._reverseStreams || []).forEach(function (e) {
                            var t = n._reverseStreams[e],
                                r = n._streams[t.id];
                            i = i.replace(new RegExp(t.id, "g"), r.id)
                        }), new RTCSessionDescription({
                            type: e.type,
                            sdp: i
                        }))), t.apply(this, arguments)
                    };
                    var s = Object.getOwnPropertyDescriptor(o.RTCPeerConnection.prototype, "localDescription");
                    Object.defineProperty(o.RTCPeerConnection.prototype, "localDescription", {
                        get: function () {
                            var e = s.get.apply(this);
                            return "" === e.type ? e : a(this, e)
                        }
                    }), o.RTCPeerConnection.prototype.removeTrack = function (t) {
                        var r, n = this;
                        if ("closed" === n.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
                        if (!t._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
                        if (!(t._pc === n)) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
                        n._streams = n._streams || {}, Object.keys(n._streams).forEach(function (e) {
                            n._streams[e].getTracks().find(function (e) {
                                return t.track === e
                            }) && (r = n._streams[e])
                        }), r && (1 === r.getTracks().length ? n.removeStream(n._reverseStreams[r.id]) : r.removeTrack(t.track), n.dispatchEvent(new Event("negotiationneeded")))
                    }
                },
                shimPeerConnection: function (r) {
                    var e = c.detectBrowser(r);
                    if (!r.RTCPeerConnection && r.webkitRTCPeerConnection) r.RTCPeerConnection = function (e, t) {
                        return n("PeerConnection"), e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy), new r.webkitRTCPeerConnection(e, t)
                    }, r.RTCPeerConnection.prototype = r.webkitRTCPeerConnection.prototype, r.webkitRTCPeerConnection.generateCertificate && Object.defineProperty(r.RTCPeerConnection, "generateCertificate", {
                        get: function () {
                            return r.webkitRTCPeerConnection.generateCertificate
                        }
                    });
                    else {
                        var a = r.RTCPeerConnection;
                        r.RTCPeerConnection = function (e, t) {
                            if (e && e.iceServers) {
                                for (var r = [], n = 0; n < e.iceServers.length; n++) {
                                    var i = e.iceServers[n];
                                    !i.hasOwnProperty("urls") && i.hasOwnProperty("url") ? (c.deprecated("RTCIceServer.url", "RTCIceServer.urls"), (i = JSON.parse(JSON.stringify(i))).urls = i.url, r.push(i)) : r.push(e.iceServers[n])
                                }
                                e.iceServers = r
                            }
                            return new a(e, t)
                        }, r.RTCPeerConnection.prototype = a.prototype, Object.defineProperty(r.RTCPeerConnection, "generateCertificate", {
                            get: function () {
                                return a.generateCertificate
                            }
                        })
                    }
                    var s = r.RTCPeerConnection.prototype.getStats;
                    r.RTCPeerConnection.prototype.getStats = function (e, t, r) {
                        var n = this,
                            i = arguments;
                        if (0 < arguments.length && "function" == typeof e) return s.apply(this, arguments);
                        if (0 === s.length && (0 === arguments.length || "function" != typeof e)) return s.apply(this, []);
                        var a = function (e) {
                                var n = {};
                                return e.result().forEach(function (t) {
                                    var r = {
                                        id: t.id,
                                        timestamp: t.timestamp,
                                        type: {
                                            localcandidate: "local-candidate",
                                            remotecandidate: "remote-candidate"
                                        } [t.type] || t.type
                                    };
                                    t.names().forEach(function (e) {
                                        r[e] = t.stat(e)
                                    }), n[r.id] = r
                                }), n
                            },
                            o = function (t) {
                                return new Map(Object.keys(t).map(function (e) {
                                    return [e, t[e]]
                                }))
                            };
                        if (2 <= arguments.length) {
                            return s.apply(this, [function (e) {
                                i[1](o(a(e)))
                            }, e])
                        }
                        return new Promise(function (t, e) {
                            s.apply(n, [function (e) {
                                t(o(a(e)))
                            }, e])
                        }).then(t, r)
                    }, e.version < 51 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                        var i = r.RTCPeerConnection.prototype[e];
                        r.RTCPeerConnection.prototype[e] = function () {
                            var r = arguments,
                                n = this,
                                e = new Promise(function (e, t) {
                                    i.apply(n, [r[0], e, t])
                                });
                            return r.length < 2 ? e : e.then(function () {
                                r[1].apply(null, [])
                            }, function (e) {
                                3 <= r.length && r[2].apply(null, [e])
                            })
                        }
                    }), e.version < 52 && ["createOffer", "createAnswer"].forEach(function (e) {
                        var i = r.RTCPeerConnection.prototype[e];
                        r.RTCPeerConnection.prototype[e] = function () {
                            var r = this;
                            if (arguments.length < 1 || 1 === arguments.length && "object" == typeof arguments[0]) {
                                var n = 1 === arguments.length ? arguments[0] : void 0;
                                return new Promise(function (e, t) {
                                    i.apply(r, [e, t, n])
                                })
                            }
                            return i.apply(this, arguments)
                        }
                    }), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                        var t = r.RTCPeerConnection.prototype[e];
                        r.RTCPeerConnection.prototype[e] = function () {
                            return arguments[0] = new("addIceCandidate" === e ? r.RTCIceCandidate : r.RTCSessionDescription)(arguments[0]), t.apply(this, arguments)
                        }
                    });
                    var t = r.RTCPeerConnection.prototype.addIceCandidate;
                    r.RTCPeerConnection.prototype.addIceCandidate = function () {
                        return arguments[0] ? t.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                    }
                }
            }
        }, {
            "../utils.js": 13,
            "./getusermedia": 6
        }],
        6: [function (e, t, r) {
            "use strict";
            var a = e("../utils.js"),
                d = a.log;
            t.exports = function (e) {
                var o = a.detectBrowser(e),
                    s = e && e.navigator,
                    c = function (i) {
                        if ("object" != typeof i || i.mandatory || i.optional) return i;
                        var a = {};
                        return Object.keys(i).forEach(function (t) {
                            if ("require" !== t && "advanced" !== t && "mediaSource" !== t) {
                                var r = "object" == typeof i[t] ? i[t] : {
                                    ideal: i[t]
                                };
                                void 0 !== r.exact && "number" == typeof r.exact && (r.min = r.max = r.exact);
                                var n = function (e, t) {
                                    return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                                };
                                if (void 0 !== r.ideal) {
                                    a.optional = a.optional || [];
                                    var e = {};
                                    "number" == typeof r.ideal ? (e[n("min", t)] = r.ideal, a.optional.push(e), (e = {})[n("max", t)] = r.ideal) : e[n("", t)] = r.ideal, a.optional.push(e)
                                }
                                void 0 !== r.exact && "number" != typeof r.exact ? (a.mandatory = a.mandatory || {}, a.mandatory[n("", t)] = r.exact) : ["min", "max"].forEach(function (e) {
                                    void 0 !== r[e] && (a.mandatory = a.mandatory || {}, a.mandatory[n(e, t)] = r[e])
                                })
                            }
                        }), i.advanced && (a.optional = (a.optional || []).concat(i.advanced)), a
                    },
                    n = function (r, n) {
                        if (61 <= o.version) return n(r);
                        if ((r = JSON.parse(JSON.stringify(r))) && "object" == typeof r.audio) {
                            var e = function (e, t, r) {
                                t in e && !(r in e) && (e[r] = e[t], delete e[t])
                            };
                            e((r = JSON.parse(JSON.stringify(r))).audio, "autoGainControl", "googAutoGainControl"), e(r.audio, "noiseSuppression", "googNoiseSuppression"), r.audio = c(r.audio)
                        }
                        if (r && "object" == typeof r.video) {
                            var i = r.video.facingMode;
                            i = i && ("object" == typeof i ? i : {
                                ideal: i
                            });
                            var a, t = o.version < 66;
                            if (i && ("user" === i.exact || "environment" === i.exact || "user" === i.ideal || "environment" === i.ideal) && (!s.mediaDevices.getSupportedConstraints || !s.mediaDevices.getSupportedConstraints().facingMode || t))
                                if (delete r.video.facingMode, "environment" === i.exact || "environment" === i.ideal ? a = ["back", "rear"] : "user" !== i.exact && "user" !== i.ideal || (a = ["front"]), a) return s.mediaDevices.enumerateDevices().then(function (e) {
                                    var t = (e = e.filter(function (e) {
                                        return "videoinput" === e.kind
                                    })).find(function (t) {
                                        return a.some(function (e) {
                                            return -1 !== t.label.toLowerCase().indexOf(e)
                                        })
                                    });
                                    return !t && e.length && -1 !== a.indexOf("back") && (t = e[e.length - 1]), t && (r.video.deviceId = i.exact ? {
                                        exact: t.deviceId
                                    } : {
                                        ideal: t.deviceId
                                    }), r.video = c(r.video), d("chrome: " + JSON.stringify(r)), n(r)
                                });
                            r.video = c(r.video)
                        }
                        return d("chrome: " + JSON.stringify(r)), n(r)
                    },
                    i = function (e) {
                        return {
                            name: {
                                PermissionDeniedError: "NotAllowedError",
                                PermissionDismissedError: "NotAllowedError",
                                InvalidStateError: "NotAllowedError",
                                DevicesNotFoundError: "NotFoundError",
                                ConstraintNotSatisfiedError: "OverconstrainedError",
                                TrackStartError: "NotReadableError",
                                MediaDeviceFailedDueToShutdown: "NotAllowedError",
                                MediaDeviceKillSwitchOn: "NotAllowedError",
                                TabCaptureError: "AbortError",
                                ScreenCaptureError: "AbortError",
                                DeviceCaptureError: "AbortError"
                            } [e.name] || e.name,
                            message: e.message,
                            constraint: e.constraintName,
                            toString: function () {
                                return this.name + (this.message && ": ") + this.message
                            }
                        }
                    };
                s.getUserMedia = function (e, t, r) {
                    n(e, function (e) {
                        s.webkitGetUserMedia(e, t, function (e) {
                            r && r(i(e))
                        })
                    })
                };
                var t = function (r) {
                    return new Promise(function (e, t) {
                        s.getUserMedia(r, e, t)
                    })
                };
                if (s.mediaDevices || (s.mediaDevices = {
                        getUserMedia: t,
                        enumerateDevices: function () {
                            return new Promise(function (t) {
                                var r = {
                                    audio: "audioinput",
                                    video: "videoinput"
                                };
                                return e.MediaStreamTrack.getSources(function (e) {
                                    t(e.map(function (e) {
                                        return {
                                            label: e.label,
                                            kind: r[e.kind],
                                            deviceId: e.id,
                                            groupId: ""
                                        }
                                    }))
                                })
                            })
                        },
                        getSupportedConstraints: function () {
                            return {
                                deviceId: !0,
                                echoCancellation: !0,
                                facingMode: !0,
                                frameRate: !0,
                                height: !0,
                                width: !0
                            }
                        }
                    }), s.mediaDevices.getUserMedia) {
                    var r = s.mediaDevices.getUserMedia.bind(s.mediaDevices);
                    s.mediaDevices.getUserMedia = function (e) {
                        return n(e, function (t) {
                            return r(t).then(function (e) {
                                if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach(function (e) {
                                    e.stop()
                                }), new DOMException("", "NotFoundError");
                                return e
                            }, function (e) {
                                return Promise.reject(i(e))
                            })
                        })
                    }
                } else s.mediaDevices.getUserMedia = function (e) {
                    return t(e)
                };
                void 0 === s.mediaDevices.addEventListener && (s.mediaDevices.addEventListener = function () {
                    d("Dummy mediaDevices.addEventListener called.")
                }), void 0 === s.mediaDevices.removeEventListener && (s.mediaDevices.removeEventListener = function () {
                    d("Dummy mediaDevices.removeEventListener called.")
                })
            }
        }, {
            "../utils.js": 13
        }],
        7: [function (e, t, r) {
            "use strict";
            var u = e("sdp"),
                c = e("./utils");
            t.exports = {
                shimRTCIceCandidate: function (t) {
                    if (t.RTCIceCandidate && !(t.RTCIceCandidate && "foundation" in t.RTCIceCandidate.prototype)) {
                        var i = t.RTCIceCandidate;
                        t.RTCIceCandidate = function (e) {
                            if ("object" == typeof e && e.candidate && 0 === e.candidate.indexOf("a=") && ((e = JSON.parse(JSON.stringify(e))).candidate = e.candidate.substr(2)), e.candidate && e.candidate.length) {
                                var t = new i(e),
                                    r = u.parseCandidate(e.candidate),
                                    n = Object.assign(t, r);
                                return n.toJSON = function () {
                                    return {
                                        candidate: n.candidate,
                                        sdpMid: n.sdpMid,
                                        sdpMLineIndex: n.sdpMLineIndex,
                                        usernameFragment: n.usernameFragment
                                    }
                                }, n
                            }
                            return new i(e)
                        }, t.RTCIceCandidate.prototype = i.prototype, c.wrapPeerConnectionEvent(t, "icecandidate", function (e) {
                            return e.candidate && Object.defineProperty(e, "candidate", {
                                value: new t.RTCIceCandidate(e.candidate),
                                writable: "false"
                            }), e
                        })
                    }
                },
                shimCreateObjectURL: function (e) {
                    var t = e && e.URL;
                    if ("object" == typeof e && e.HTMLMediaElement && "srcObject" in e.HTMLMediaElement.prototype && t.createObjectURL && t.revokeObjectURL) {
                        var r = t.createObjectURL.bind(t),
                            n = t.revokeObjectURL.bind(t),
                            i = new Map,
                            a = 0;
                        t.createObjectURL = function (e) {
                            if ("getTracks" in e) {
                                var t = "polyblob:" + ++a;
                                return i.set(t, e), c.deprecated("URL.createObjectURL(stream)", "elem.srcObject = stream"), t
                            }
                            return r(e)
                        }, t.revokeObjectURL = function (e) {
                            n(e), i.delete(e)
                        };
                        var o = Object.getOwnPropertyDescriptor(e.HTMLMediaElement.prototype, "src");
                        Object.defineProperty(e.HTMLMediaElement.prototype, "src", {
                            get: function () {
                                return o.get.apply(this)
                            },
                            set: function (e) {
                                return this.srcObject = i.get(e) || null, o.set.apply(this, [e])
                            }
                        });
                        var s = e.HTMLMediaElement.prototype.setAttribute;
                        e.HTMLMediaElement.prototype.setAttribute = function () {
                            return 2 === arguments.length && "src" === ("" + arguments[0]).toLowerCase() && (this.srcObject = i.get(arguments[1]) || null), s.apply(this, arguments)
                        }
                    }
                },
                shimMaxMessageSize: function (e) {
                    if (!e.RTCSctpTransport && e.RTCPeerConnection) {
                        var d = c.detectBrowser(e);
                        "sctp" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", {
                            get: function () {
                                return void 0 === this._sctp ? null : this._sctp
                            }
                        });
                        var p = e.RTCPeerConnection.prototype.setRemoteDescription;
                        e.RTCPeerConnection.prototype.setRemoteDescription = function () {
                            var e, t, r, n;
                            if (this._sctp = null, r = arguments[0], (n = u.splitSections(r.sdp)).shift(), n.some(function (e) {
                                    var t = u.parseMLine(e);
                                    return t && "application" === t.kind && -1 !== t.protocol.indexOf("SCTP")
                                })) {
                                var i, a = function (e) {
                                        var t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
                                        if (null === t || t.length < 2) return -1;
                                        var r = parseInt(t[1], 10);
                                        return r != r ? -1 : r
                                    }(arguments[0]),
                                    o = (e = a, t = 65536, "firefox" === d.browser && (t = d.version < 57 ? -1 === e ? 16384 : 2147483637 : 57 === d.version ? 65535 : 65536), t),
                                    s = function (e, t) {
                                        var r = 65536;
                                        "firefox" === d.browser && 57 === d.version && (r = 65535);
                                        var n = u.matchPrefix(e.sdp, "a=max-message-size:");
                                        return 0 < n.length ? r = parseInt(n[0].substr(19), 10) : "firefox" === d.browser && -1 !== t && (r = 2147483637), r
                                    }(arguments[0], a);
                                i = 0 === o && 0 === s ? Number.POSITIVE_INFINITY : 0 === o || 0 === s ? Math.max(o, s) : Math.min(o, s);
                                var c = {};
                                Object.defineProperty(c, "maxMessageSize", {
                                    get: function () {
                                        return i
                                    }
                                }), this._sctp = c
                            }
                            return p.apply(this, arguments)
                        }
                    }
                },
                shimSendThrowTypeError: function (e) {
                    if (e.RTCPeerConnection && "createDataChannel" in e.RTCPeerConnection.prototype) {
                        var n = e.RTCPeerConnection.prototype.createDataChannel;
                        e.RTCPeerConnection.prototype.createDataChannel = function () {
                            var t = this,
                                e = n.apply(t, arguments),
                                r = e.send;
                            return e.send = function () {
                                var e = arguments[0];
                                if ((e.length || e.size || e.byteLength) > t.sctp.maxMessageSize) throw new DOMException("Message too large (can send a maximum of " + t.sctp.maxMessageSize + " bytes)", "TypeError");
                                return r.apply(this, arguments)
                            }, e
                        }
                    }
                }
            }
        }, {
            "./utils": 13,
            sdp: 2
        }],
        8: [function (e, t, r) {
            "use strict";
            var n = e("../utils"),
                i = e("rtcpeerconnection-shim");
            t.exports = {
                shimGetUserMedia: e("./getusermedia"),
                shimPeerConnection: function (e) {
                    var t = n.detectBrowser(e);
                    if (e.RTCIceGatherer && (e.RTCIceCandidate || (e.RTCIceCandidate = function (e) {
                            return e
                        }), e.RTCSessionDescription || (e.RTCSessionDescription = function (e) {
                            return e
                        }), t.version < 15025)) {
                        var r = Object.getOwnPropertyDescriptor(e.MediaStreamTrack.prototype, "enabled");
                        Object.defineProperty(e.MediaStreamTrack.prototype, "enabled", {
                            set: function (e) {
                                r.set.call(this, e);
                                var t = new Event("enabled");
                                t.enabled = e, this.dispatchEvent(t)
                            }
                        })
                    }!e.RTCRtpSender || "dtmf" in e.RTCRtpSender.prototype || Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
                        get: function () {
                            return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = new e.RTCDtmfSender(this) : "video" === this.track.kind && (this._dtmf = null)), this._dtmf
                        }
                    }), e.RTCDtmfSender && !e.RTCDTMFSender && (e.RTCDTMFSender = e.RTCDtmfSender), e.RTCPeerConnection = i(e, t.version)
                },
                shimReplaceTrack: function (e) {
                    !e.RTCRtpSender || "replaceTrack" in e.RTCRtpSender.prototype || (e.RTCRtpSender.prototype.replaceTrack = e.RTCRtpSender.prototype.setTrack)
                }
            }
        }, {
            "../utils": 13,
            "./getusermedia": 9,
            "rtcpeerconnection-shim": 1
        }],
        9: [function (e, t, r) {
            "use strict";
            t.exports = function (e) {
                var t = e && e.navigator,
                    r = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
                t.mediaDevices.getUserMedia = function (e) {
                    return r(e).catch(function (e) {
                        return Promise.reject({
                            name: {
                                PermissionDeniedError: "NotAllowedError"
                            } [(t = e).name] || t.name,
                            message: t.message,
                            constraint: t.constraint,
                            toString: function () {
                                return this.name
                            }
                        });
                        var t
                    })
                }
            }
        }, {}],
        10: [function (e, t, r) {
            "use strict";
            var n = e("../utils");
            t.exports = {
                shimGetUserMedia: e("./getusermedia"),
                shimOnTrack: function (e) {
                    "object" != typeof e || !e.RTCPeerConnection || "ontrack" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
                        get: function () {
                            return this._ontrack
                        },
                        set: function (e) {
                            this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly)), this.addEventListener("track", this._ontrack = e), this.addEventListener("addstream", this._ontrackpoly = function (r) {
                                r.stream.getTracks().forEach(function (e) {
                                    var t = new Event("track");
                                    t.track = e, t.receiver = {
                                        track: e
                                    }, t.transceiver = {
                                        receiver: t.receiver
                                    }, t.streams = [r.stream], this.dispatchEvent(t)
                                }.bind(this))
                            }.bind(this))
                        }
                    }), "object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
                        get: function () {
                            return {
                                receiver: this.receiver
                            }
                        }
                    })
                },
                shimSourceObject: function (e) {
                    "object" == typeof e && (!e.HTMLMediaElement || "srcObject" in e.HTMLMediaElement.prototype || Object.defineProperty(e.HTMLMediaElement.prototype, "srcObject", {
                        get: function () {
                            return this.mozSrcObject
                        },
                        set: function (e) {
                            this.mozSrcObject = e
                        }
                    }))
                },
                shimPeerConnection: function (s) {
                    var c = n.detectBrowser(s);
                    if ("object" == typeof s && (s.RTCPeerConnection || s.mozRTCPeerConnection)) {
                        s.RTCPeerConnection || (s.RTCPeerConnection = function (e, t) {
                            if (c.version < 38 && e && e.iceServers) {
                                for (var r = [], n = 0; n < e.iceServers.length; n++) {
                                    var i = e.iceServers[n];
                                    if (i.hasOwnProperty("urls"))
                                        for (var a = 0; a < i.urls.length; a++) {
                                            var o = {
                                                url: i.urls[a]
                                            };
                                            0 === i.urls[a].indexOf("turn") && (o.username = i.username, o.credential = i.credential), r.push(o)
                                        } else r.push(e.iceServers[n])
                                }
                                e.iceServers = r
                            }
                            return new s.mozRTCPeerConnection(e, t)
                        }, s.RTCPeerConnection.prototype = s.mozRTCPeerConnection.prototype, s.mozRTCPeerConnection.generateCertificate && Object.defineProperty(s.RTCPeerConnection, "generateCertificate", {
                            get: function () {
                                return s.mozRTCPeerConnection.generateCertificate
                            }
                        }), s.RTCSessionDescription = s.mozRTCSessionDescription, s.RTCIceCandidate = s.mozRTCIceCandidate), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                            var t = s.RTCPeerConnection.prototype[e];
                            s.RTCPeerConnection.prototype[e] = function () {
                                return arguments[0] = new("addIceCandidate" === e ? s.RTCIceCandidate : s.RTCSessionDescription)(arguments[0]), t.apply(this, arguments)
                            }
                        });
                        var e = s.RTCPeerConnection.prototype.addIceCandidate;
                        s.RTCPeerConnection.prototype.addIceCandidate = function () {
                            return arguments[0] ? e.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                        };
                        var a = {
                                inboundrtp: "inbound-rtp",
                                outboundrtp: "outbound-rtp",
                                candidatepair: "candidate-pair",
                                localcandidate: "local-candidate",
                                remotecandidate: "remote-candidate"
                            },
                            r = s.RTCPeerConnection.prototype.getStats;
                        s.RTCPeerConnection.prototype.getStats = function (e, i, t) {
                            return r.apply(this, [e || null]).then(function (r) {
                                var t, n;
                                if (c.version < 48 && (t = r, n = new Map, Object.keys(t).forEach(function (e) {
                                        n.set(e, t[e]), n[e] = t[e]
                                    }), r = n), c.version < 53 && !i) try {
                                    r.forEach(function (e) {
                                        e.type = a[e.type] || e.type
                                    })
                                } catch (e) {
                                    if ("TypeError" !== e.name) throw e;
                                    r.forEach(function (e, t) {
                                        r.set(t, Object.assign({}, e, {
                                            type: a[e.type] || e.type
                                        }))
                                    })
                                }
                                return r
                            }).then(i, t)
                        }
                    }
                },
                shimRemoveStream: function (e) {
                    !e.RTCPeerConnection || "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (t) {
                        var r = this;
                        n.deprecated("removeStream", "removeTrack"), this.getSenders().forEach(function (e) {
                            e.track && -1 !== t.getTracks().indexOf(e.track) && r.removeTrack(e)
                        })
                    })
                }
            }
        }, {
            "../utils": 13,
            "./getusermedia": 11
        }],
        11: [function (e, t, r) {
            "use strict";
            var f = e("../utils"),
                l = f.log;
            t.exports = function (e) {
                var i = f.detectBrowser(e),
                    a = e && e.navigator,
                    t = e && e.MediaStreamTrack,
                    o = function (e) {
                        return {
                            name: {
                                InternalError: "NotReadableError",
                                NotSupportedError: "TypeError",
                                PermissionDeniedError: "NotAllowedError",
                                SecurityError: "NotAllowedError"
                            } [e.name] || e.name,
                            message: {
                                "The operation is insecure.": "The request is not allowed by the user agent or the platform in the current context."
                            } [e.message] || e.message,
                            constraint: e.constraint,
                            toString: function () {
                                return this.name + (this.message && ": ") + this.message
                            }
                        }
                    },
                    n = function (e, t, r) {
                        var n = function (n) {
                            if ("object" != typeof n || n.require) return n;
                            var i = [];
                            return Object.keys(n).forEach(function (e) {
                                if ("require" !== e && "advanced" !== e && "mediaSource" !== e) {
                                    var t = n[e] = "object" == typeof n[e] ? n[e] : {
                                        ideal: n[e]
                                    };
                                    if (void 0 === t.min && void 0 === t.max && void 0 === t.exact || i.push(e), void 0 !== t.exact && ("number" == typeof t.exact ? t.min = t.max = t.exact : n[e] = t.exact, delete t.exact), void 0 !== t.ideal) {
                                        n.advanced = n.advanced || [];
                                        var r = {};
                                        "number" == typeof t.ideal ? r[e] = {
                                            min: t.ideal,
                                            max: t.ideal
                                        } : r[e] = t.ideal, n.advanced.push(r), delete t.ideal, Object.keys(t).length || delete n[e]
                                    }
                                }
                            }), i.length && (n.require = i), n
                        };
                        return e = JSON.parse(JSON.stringify(e)), i.version < 38 && (l("spec: " + JSON.stringify(e)), e.audio && (e.audio = n(e.audio)), e.video && (e.video = n(e.video)), l("ff37: " + JSON.stringify(e))), a.mozGetUserMedia(e, t, function (e) {
                            r(o(e))
                        })
                    };
                if (a.mediaDevices || (a.mediaDevices = {
                        getUserMedia: function (r) {
                            return new Promise(function (e, t) {
                                n(r, e, t)
                            })
                        },
                        addEventListener: function () {},
                        removeEventListener: function () {}
                    }), a.mediaDevices.enumerateDevices = a.mediaDevices.enumerateDevices || function () {
                        return new Promise(function (e) {
                            e([{
                                kind: "audioinput",
                                deviceId: "default",
                                label: "",
                                groupId: ""
                            }, {
                                kind: "videoinput",
                                deviceId: "default",
                                label: "",
                                groupId: ""
                            }])
                        })
                    }, i.version < 41) {
                    var r = a.mediaDevices.enumerateDevices.bind(a.mediaDevices);
                    a.mediaDevices.enumerateDevices = function () {
                        return r().then(void 0, function (e) {
                            if ("NotFoundError" === e.name) return [];
                            throw e
                        })
                    }
                }
                if (i.version < 49) {
                    var s = a.mediaDevices.getUserMedia.bind(a.mediaDevices);
                    a.mediaDevices.getUserMedia = function (t) {
                        return s(t).then(function (e) {
                            if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach(function (e) {
                                e.stop()
                            }), new DOMException("The object can not be found here.", "NotFoundError");
                            return e
                        }, function (e) {
                            return Promise.reject(o(e))
                        })
                    }
                }
                if (!(55 < i.version && "autoGainControl" in a.mediaDevices.getSupportedConstraints())) {
                    var c = function (e, t, r) {
                            t in e && !(r in e) && (e[r] = e[t], delete e[t])
                        },
                        d = a.mediaDevices.getUserMedia.bind(a.mediaDevices);
                    if (a.mediaDevices.getUserMedia = function (e) {
                            return "object" == typeof e && "object" == typeof e.audio && (e = JSON.parse(JSON.stringify(e)), c(e.audio, "autoGainControl", "mozAutoGainControl"), c(e.audio, "noiseSuppression", "mozNoiseSuppression")), d(e)
                        }, t && t.prototype.getSettings) {
                        var p = t.prototype.getSettings;
                        t.prototype.getSettings = function () {
                            var e = p.apply(this, arguments);
                            return c(e, "mozAutoGainControl", "autoGainControl"), c(e, "mozNoiseSuppression", "noiseSuppression"), e
                        }
                    }
                    if (t && t.prototype.applyConstraints) {
                        var u = t.prototype.applyConstraints;
                        t.prototype.applyConstraints = function (e) {
                            return "audio" === this.kind && "object" == typeof e && (e = JSON.parse(JSON.stringify(e)), c(e, "autoGainControl", "mozAutoGainControl"), c(e, "noiseSuppression", "mozNoiseSuppression")), u.apply(this, [e])
                        }
                    }
                }
                a.getUserMedia = function (e, t, r) {
                    if (i.version < 44) return n(e, t, r);
                    f.deprecated("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), a.mediaDevices.getUserMedia(e).then(t, r)
                }
            }
        }, {
            "../utils": 13
        }],
        12: [function (e, t, r) {
            "use strict";
            var o = e("../utils");
            t.exports = {
                shimLocalStreamsAPI: function (e) {
                    if ("object" == typeof e && e.RTCPeerConnection) {
                        if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function () {
                                return this._localStreams || (this._localStreams = []), this._localStreams
                            }), "getStreamById" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getStreamById = function (t) {
                                var r = null;
                                return this._localStreams && this._localStreams.forEach(function (e) {
                                    e.id === t && (r = e)
                                }), this._remoteStreams && this._remoteStreams.forEach(function (e) {
                                    e.id === t && (r = e)
                                }), r
                            }), !("addStream" in e.RTCPeerConnection.prototype)) {
                            var n = e.RTCPeerConnection.prototype.addTrack;
                            e.RTCPeerConnection.prototype.addStream = function (t) {
                                this._localStreams || (this._localStreams = []), -1 === this._localStreams.indexOf(t) && this._localStreams.push(t);
                                var r = this;
                                t.getTracks().forEach(function (e) {
                                    n.call(r, e, t)
                                })
                            }, e.RTCPeerConnection.prototype.addTrack = function (e, t) {
                                return t && (this._localStreams ? -1 === this._localStreams.indexOf(t) && this._localStreams.push(t) : this._localStreams = [t]), n.call(this, e, t)
                            }
                        }
                        "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (e) {
                            this._localStreams || (this._localStreams = []);
                            var t = this._localStreams.indexOf(e);
                            if (-1 !== t) {
                                this._localStreams.splice(t, 1);
                                var r = this,
                                    n = e.getTracks();
                                this.getSenders().forEach(function (e) {
                                    -1 !== n.indexOf(e.track) && r.removeTrack(e)
                                })
                            }
                        })
                    }
                },
                shimRemoteStreamsAPI: function (e) {
                    "object" == typeof e && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function () {
                        return this._remoteStreams ? this._remoteStreams : []
                    }), "onaddstream" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
                        get: function () {
                            return this._onaddstream
                        },
                        set: function (e) {
                            var r = this;
                            this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = e), this.addEventListener("track", this._onaddstreampoly = function (e) {
                                e.streams.forEach(function (e) {
                                    if (r._remoteStreams || (r._remoteStreams = []), !(0 <= r._remoteStreams.indexOf(e))) {
                                        r._remoteStreams.push(e);
                                        var t = new Event("addstream");
                                        t.stream = e, r.dispatchEvent(t)
                                    }
                                })
                            })
                        }
                    }))
                },
                shimCallbacksAPI: function (e) {
                    if ("object" == typeof e && e.RTCPeerConnection) {
                        var t = e.RTCPeerConnection.prototype,
                            i = t.createOffer,
                            a = t.createAnswer,
                            o = t.setLocalDescription,
                            s = t.setRemoteDescription,
                            c = t.addIceCandidate;
                        t.createOffer = function (e, t) {
                            var r = 2 <= arguments.length ? arguments[2] : e,
                                n = i.apply(this, [r]);
                            return t ? (n.then(e, t), Promise.resolve()) : n
                        }, t.createAnswer = function (e, t) {
                            var r = 2 <= arguments.length ? arguments[2] : e,
                                n = a.apply(this, [r]);
                            return t ? (n.then(e, t), Promise.resolve()) : n
                        };
                        var r = function (e, t, r) {
                            var n = o.apply(this, [e]);
                            return r ? (n.then(t, r), Promise.resolve()) : n
                        };
                        t.setLocalDescription = r, r = function (e, t, r) {
                            var n = s.apply(this, [e]);
                            return r ? (n.then(t, r), Promise.resolve()) : n
                        }, t.setRemoteDescription = r, r = function (e, t, r) {
                            var n = c.apply(this, [e]);
                            return r ? (n.then(t, r), Promise.resolve()) : n
                        }, t.addIceCandidate = r
                    }
                },
                shimGetUserMedia: function (e) {
                    var n = e && e.navigator;
                    n.getUserMedia || (n.webkitGetUserMedia ? n.getUserMedia = n.webkitGetUserMedia.bind(n) : n.mediaDevices && n.mediaDevices.getUserMedia && (n.getUserMedia = function (e, t, r) {
                        n.mediaDevices.getUserMedia(e).then(t, r)
                    }.bind(n)))
                },
                shimRTCIceServerUrls: function (e) {
                    var a = e.RTCPeerConnection;
                    e.RTCPeerConnection = function (e, t) {
                        if (e && e.iceServers) {
                            for (var r = [], n = 0; n < e.iceServers.length; n++) {
                                var i = e.iceServers[n];
                                !i.hasOwnProperty("urls") && i.hasOwnProperty("url") ? (o.deprecated("RTCIceServer.url", "RTCIceServer.urls"), (i = JSON.parse(JSON.stringify(i))).urls = i.url, delete i.url, r.push(i)) : r.push(e.iceServers[n])
                            }
                            e.iceServers = r
                        }
                        return new a(e, t)
                    }, e.RTCPeerConnection.prototype = a.prototype, "generateCertificate" in e.RTCPeerConnection && Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
                        get: function () {
                            return a.generateCertificate
                        }
                    })
                },
                shimTrackEventTransceiver: function (e) {
                    "object" == typeof e && e.RTCPeerConnection && "receiver" in e.RTCTrackEvent.prototype && !e.RTCTransceiver && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
                        get: function () {
                            return {
                                receiver: this.receiver
                            }
                        }
                    })
                },
                shimCreateOfferLegacy: function (e) {
                    var i = e.RTCPeerConnection.prototype.createOffer;
                    e.RTCPeerConnection.prototype.createOffer = function (e) {
                        var t = this;
                        if (e) {
                            void 0 !== e.offerToReceiveAudio && (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
                            var r = t.getTransceivers().find(function (e) {
                                return e.sender.track && "audio" === e.sender.track.kind
                            });
                            !1 === e.offerToReceiveAudio && r ? "sendrecv" === r.direction ? r.setDirection ? r.setDirection("sendonly") : r.direction = "sendonly" : "recvonly" === r.direction && (r.setDirection ? r.setDirection("inactive") : r.direction = "inactive") : !0 !== e.offerToReceiveAudio || r || t.addTransceiver("audio"), void 0 !== e.offerToReceiveAudio && (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
                            var n = t.getTransceivers().find(function (e) {
                                return e.sender.track && "video" === e.sender.track.kind
                            });
                            !1 === e.offerToReceiveVideo && n ? "sendrecv" === n.direction ? n.setDirection("sendonly") : "recvonly" === n.direction && n.setDirection("inactive") : !0 !== e.offerToReceiveVideo || n || t.addTransceiver("video")
                        }
                        return i.apply(t, arguments)
                    }
                }
            }
        }, {
            "../utils": 13
        }],
        13: [function (e, t, r) {
            "use strict";
            var n = !0,
                i = !0;

            function a(e, t, r) {
                var n = e.match(t);
                return n && n.length >= r && parseInt(n[r], 10)
            }
            t.exports = {
                extractVersion: a,
                wrapPeerConnectionEvent: function (e, n, i) {
                    if (e.RTCPeerConnection) {
                        var t = e.RTCPeerConnection.prototype,
                            a = t.addEventListener;
                        t.addEventListener = function (e, t) {
                            if (e !== n) return a.apply(this, arguments);
                            var r = function (e) {
                                t(i(e))
                            };
                            return this._eventMap = this._eventMap || {}, this._eventMap[t] = r, a.apply(this, [e, r])
                        };
                        var o = t.removeEventListener;
                        t.removeEventListener = function (e, t) {
                            if (e !== n || !this._eventMap || !this._eventMap[t]) return o.apply(this, arguments);
                            var r = this._eventMap[t];
                            return delete this._eventMap[t], o.apply(this, [e, r])
                        }, Object.defineProperty(t, "on" + n, {
                            get: function () {
                                return this["_on" + n]
                            },
                            set: function (e) {
                                this["_on" + n] && (this.removeEventListener(n, this["_on" + n]), delete this["_on" + n]), e && this.addEventListener(n, this["_on" + n] = e)
                            }
                        })
                    }
                },
                disableLog: function (e) {
                    return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (n = e) ? "adapter.js logging disabled" : "adapter.js logging enabled"
                },
                disableWarnings: function (e) {
                    return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (i = !e, "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"))
                },
                log: function () {
                    if ("object" == typeof window) {
                        if (n) return;
                        "undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments)
                    }
                },
                deprecated: function (e, t) {
                    i && console.warn(e + " is deprecated, please use " + t + " instead.")
                },
                detectBrowser: function (e) {
                    var t = e && e.navigator,
                        r = {
                            browser: null,
                            version: null
                        };
                    if (void 0 === e || !e.navigator) return r.browser = "Not a browser.", r;
                    if (t.mozGetUserMedia) r.browser = "firefox", r.version = a(t.userAgent, /Firefox\/(\d+)\./, 1);
                    else if (t.webkitGetUserMedia) r.browser = "chrome", r.version = a(t.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
                    else if (t.mediaDevices && t.userAgent.match(/Edge\/(\d+).(\d+)$/)) r.browser = "edge", r.version = a(t.userAgent, /Edge\/(\d+).(\d+)$/, 2);
                    else {
                        if (!e.RTCPeerConnection || !t.userAgent.match(/AppleWebKit\/(\d+)\./)) return r.browser = "Not a supported browser.", r;
                        r.browser = "safari", r.version = a(t.userAgent, /AppleWebKit\/(\d+)\./, 1)
                    }
                    return r
                }
            }
        }, {}]
    }, {}, [3])(3)
});