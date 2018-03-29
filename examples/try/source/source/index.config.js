(function() {
  angular.module('aquestCampoLeComete', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngResize', 'ngSanitize', 'monospaced.mousewheel', 'ui.router', 'angulartics.google.analytics', 'swipe']);

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('webglDetector', function() {
    'ngInject';
    var WebGLDetectorController, directive;
    WebGLDetectorController = function($scope, Detector) {
      'ngInject';
      this.supportsWebGL = Detector.webgl;
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/webgl-detector/webgl-detector.html',
      controller: WebGLDetectorController,
      controllerAs: "webgldetector",
      replace: true,
      transclude: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('versionInfo', function() {
    'ngInject';
    var VersionInfoController, directive;
    VersionInfoController = function($scope) {
      'ngInject';
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/version-info/version-info.html',
      controller: VersionInfoController,
      controllerAs: "versioninfo",
      scope: {
        info: "="
      },
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').filter('wordseparation', function($sce, $sanitize) {
    'ngInject';
    return function(input, staggerWords, delay, stagger) {
      var arr, i, j, len, ret, totalDelay, word;
      if (delay == null) {
        delay = 0;
      }
      if (stagger == null) {
        stagger = .1;
      }
      input = $sanitize(input);
      arr = input.split(" ");
      ret = "";
      for (i = j = 0, len = arr.length; j < len; i = ++j) {
        word = arr[i];
        ret += "<span class=\"";
        if (word.indexOf("[w]") !== -1) {
          word = word.split("[w]").join("");
          ret += "white";
        }
        if (staggerWords) {
          totalDelay = delay + (i * stagger);
          ret += " word\" style=\"transition-delay: " + totalDelay + "s; animation-delay: " + totalDelay + "s;\">" + word + " </span>";
        } else {
          ret += " word\" >" + word + " </span>";
        }
      }
      return $sce.trustAsHtml(ret);
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').factory('wavingShader', function() {
    'ngInject';
    var WavingShader;
    return WavingShader = (function() {
      function WavingShader() {}

      WavingShader.uniforms = {
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
          value: new THREE.Color(0xffffff)
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
      };

      WavingShader.vertexShader = "uniform vec4 offsetRepeat; uniform float fresnelPow; uniform float fresnelIntensity; uniform float wavingFactor; uniform float wavingAmplitude; uniform float wavingMax; uniform float wavingMin; varying vec2 vUv; void main() { vec3 transformed = vec3( position ); float yNormalized = (position.y - wavingMin) / wavingMax; transformed.x = position.x + (yNormalized * (wavingFactor * wavingAmplitude)); vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 ); vUv = uv * offsetRepeat.zw + offsetRepeat.xy; gl_Position = projectionMatrix * mvPosition; }";

      WavingShader.fragmentShader = "uniform vec3 fresnelColor; uniform sampler2D map; varying vec2 vUv; void main() { gl_FragColor = texture2D( map, vUv ); }";

      return WavingShader;

    })();
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').filter('truncate', function() {
    'ngInject';
    return function(input, words) {
      var inputWords;
      if (isNaN(words)) {
        return input;
      }
      if (words <= 0) {
        return '';
      }
      if (input) {
        inputWords = input.split(/\s+/);
        if (inputWords.length > words) {
          input = inputWords.slice(0, words).join(' ') + '…';
        }
      }
      return input;
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('scrollController', function($parse, $timeout, TweenMax) {
    'ngInject';
    var ScrollController, directive;
    ScrollController = function($scope) {
      'ngInject';
      this.selectedChapter = -1;
      this.pauseChapterDetection = false;
      this.headerHeight = 360;
      this.hasScrolled = false;
      this.gotoTop = (function(_this) {
        return function() {
          _this.selectedChapter = -1;
          TweenMax.to($scope.element[0], .5, {
            scrollTop: 0
          });
        };
      })(this);
      this.gotoParagraph = (function(_this) {
        return function(index) {
          var h, trueScrollHeight, v;
          trueScrollHeight = $scope.element[0].scrollHeight - _this.headerHeight;
          h = trueScrollHeight - $scope.element[0].clientHeight;
          v = h / $scope.product.locale.paragraphs.length;
          _this.hasScrolled = true;
          _this.selectedChapter = index;
          _this.pauseChapterDetection = true;
          $timeout.cancel(_this.cancelPause);
          TweenMax.to($scope.element[0], .5, {
            scrollTop: _this.headerHeight + (v * index),
            onComplete: function() {
              return _this.cancelPause = $timeout(function() {
                return _this.pauseChapterDetection = false;
              }, 500);
            }
          });
        };
      })(this);
      this.onScroll = _.throttle((function(_this) {
        return function(event) {
          var scrollFactor, trueScrollHeight, trueScrollTop;
          if (_this.pauseChapterDetection) {
            return;
          }
          _this.hasScrolled = $scope.element[0].scrollTop > 50;
          trueScrollTop = $scope.element[0].scrollTop - _this.headerHeight;
          trueScrollHeight = $scope.element[0].scrollHeight - _this.headerHeight;
          scrollFactor = trueScrollTop / (trueScrollHeight - $scope.element[0].clientHeight);
          _this.selectedChapter = Math.round(($scope.product.locale.paragraphs.length - 1) * scrollFactor);
          _this.selectedChapter = Math.max(0, Math.min($scope.product.locale.paragraphs.length - 1, _this.selectedChapter));
          if (!_this.hasScrolled) {
            _this.selectedChapter = -1;
          }
          $timeout(function() {
            return $scope.$apply();
          }, 0);
        };
      })(this), 500);
    };
    return directive = {
      restrict: 'A',
      controller: ScrollController,
      controllerAs: "scrollcontroller",
      link: function(scope, element, attrs) {
        scope.element = element;
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('preloadLogo', function($parse, $timeout, TweenMax) {
    'ngInject';
    var PreloadLogoController, directive;
    PreloadLogoController = function($scope) {
      'ngInject';
      this.removeOnDestroyListener = $scope.$on("$destroy", function() {});
      this.init = function() {
        TweenMax.to($scope.element[0], 2, {
          opacity: 0,
          scale: 1.4,
          onComplete: function() {
            return $scope.element[0].parentNode.removeChild($scope.element[0]);
          }
        });
      };
      $scope.$watch("element", (function(_this) {
        return function() {
          _.defer(_this.init);
        };
      })(this));
    };
    return directive = {
      restrict: 'A',
      controller: PreloadLogoController,
      controllerAs: "autoscroller",
      link: function(scope, element, attrs) {
        scope.element = element;
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').factory('particleShader', function() {
    'ngInject';
    var ParticleShader;
    return ParticleShader = (function() {
      function ParticleShader() {}

      ParticleShader.uniforms = {
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
          value: new THREE.Color(0xffffff)
        },
        size: {
          type: "f",
          value: .5
        },
        scale: {
          type: "f",
          value: 500
        }
      };

      ParticleShader.vertexShader = "uniform float time; uniform float size; uniform float scale; attribute float pulseSpeed; attribute float orbitSpeed; attribute float orbitSize; void main() { vec3 animatedPosition = position; animatedPosition.x += sin(time * orbitSpeed) * orbitSize; animatedPosition.y += cos(time * orbitSpeed) * orbitSize; animatedPosition.z += cos(time * orbitSpeed) * orbitSize; vec3 transformed = vec3( animatedPosition ); vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 ); gl_Position =  projectionMatrix * mvPosition; float animatedSize = size * ( scale / - mvPosition.z ); animatedSize *= 1.0 + sin(time * pulseSpeed); gl_PointSize = animatedSize; }";

      ParticleShader.fragmentShader = "uniform sampler2D map; uniform vec4 offsetRepeat; uniform vec3 color; void main() { gl_FragColor = texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy ); gl_FragColor.rgb *= color.rgb; }";

      return ParticleShader;

    })();
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('ngTouchstart', function() {
    return {
      controller: function($scope, $element, $attrs) {
        var onDestroy, onTouchStart;
        onTouchStart = function($event) {
          var method;
          method = '$scope.' + $element.attr('ng-touchstart');
          $scope.$apply(function() {
            eval(method);
          });
        };
        $element.bind('touchstart', onTouchStart);
        onDestroy = $scope.$on('$destroy', function() {
          $element.unbind('touchstart', onTouchStart);
          return onDestroy();
        });
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('ngTouchmove', function() {
    return {
      controller: function($scope, $element, $attrs) {
        var onDestroy, onTouchEnd, onTouchMove, onTouchStart;
        onTouchStart = function($event) {
          $element.bind('touchmove', onTouchMove);
          $element.bind('touchend', onTouchEnd);
        };
        onTouchMove = function($event) {
          var method;
          method = '$scope.' + $element.attr('ng-touchmove');
          $scope.$apply(function() {
            eval(method);
          });
        };
        onTouchEnd = function($event) {
          $event.preventDefault();
          $element.unbind('touchmove', onTouchMove);
          $element.unbind('touchend', onTouchEnd);
        };
        $element.bind('touchstart', onTouchStart);
        onDestroy = $scope.$on('$destroy', function() {
          $element.unbind('touchmove', onTouchMove);
          $element.unbind('touchend', onTouchEnd);
          return onDestroy();
        });
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('ngTouchend', function() {
    return {
      controller: function($scope, $element, $attrs) {
        var onDestroy, onTouchEnd;
        onTouchEnd = function($event) {
          var method;
          method = '$scope.' + $element.attr('ng-touchend');
          $scope.$apply(function() {
            eval(method);
          });
        };
        $element.bind('touchend', onTouchEnd);
        onDestroy = $scope.$on('$destroy', function() {
          $element.unbind('touchend', onTouchEnd);
          return onDestroy();
        });
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('ngScroll', function($parse) {
    'ngInject';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var fn;
        fn = $parse(attrs.ngScroll);
        element.bind('scroll', function(data) {
          return scope.$apply(function() {
            return fn(scope, {
              $event: data
            });
          });
        });
      }
    };
  });

}).call(this);



(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('aquestCampoLeComete').factory('elasticVector2', function() {
    'ngInject';
    var ElasticVector2;
    return ElasticVector2 = (function() {
      ElasticVector2.prototype.value = null;

      ElasticVector2.prototype.x = 0;

      ElasticVector2.prototype.y = 0;

      ElasticVector2.prototype.speed = 3;

      function ElasticVector2(value) {
        this.value = value;
        this.update = bind(this.update, this);
        this.x = this.value.x;
        this.y = this.value.y;
        return;
      }

      ElasticVector2.prototype.update = function(delta) {
        var distx, disty;
        delta = Math.min(delta, .1);
        distx = this.x - this.value.x;
        disty = this.y - this.value.y;
        this.value.x += distx * (this.speed * delta);
        this.value.y += disty * (this.speed * delta);
        return true;
      };

      return ElasticVector2;

    })();
  });

}).call(this);



(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('aquestCampoLeComete').factory('elasticNumber', function() {
    'ngInject';
    var ElasticNumber;
    return ElasticNumber = (function() {
      ElasticNumber.prototype.value = null;

      ElasticNumber.prototype.target = 0;

      ElasticNumber.prototype.speed = 3;

      function ElasticNumber(value) {
        this.value = value;
        this.update = bind(this.update, this);
        this.target = this.value;
        return;
      }

      ElasticNumber.prototype.update = function(delta) {
        var dist;
        dist = this.target - this.value;
        this.value += dist * (this.speed * Math.min(delta, .1));
        return true;
      };

      return ElasticNumber;

    })();
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('css3dRotationEffect', function($parse, $window, elasticNumber) {
    'ngInject';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var destroyed, elasticRotateX, elasticRotateY, elasticTranslateX, mousePosition, onMouseMove, removeOnDestroy;
        if (scope.main.platform.mobile || scope.main.platform.safari) {
          return;
        }
        scope.translateZ = scope.$eval(attrs.translateZ);
        destroyed = false;
        mousePosition = {
          x: 0,
          y: 0
        };
        elasticTranslateX = new elasticNumber(0);
        elasticTranslateX.speed = 1;
        elasticRotateX = new elasticNumber(0);
        elasticRotateX.speed = 1;
        elasticRotateY = new elasticNumber(0);
        elasticRotateY.speed = 1;
        onMouseMove = function(event) {
          var rotateXAmplitude, rotateYAmplitude, translateXAmplitude;
          mousePosition.x = (event.clientX / $window.innerWidth) * 2 - 1;
          mousePosition.y = -(event.clientY / $window.innerHeight) * 2 + 1;
          translateXAmplitude = scope.main.css3dSettings.tx;
          rotateXAmplitude = scope.main.css3dSettings.rx;
          rotateYAmplitude = scope.main.css3dSettings.ry;
          elasticTranslateX.target = -mousePosition.x * translateXAmplitude;
          elasticRotateX.target = -mousePosition.y * rotateXAmplitude;
          elasticRotateY.target = -mousePosition.x * rotateYAmplitude;
        };
        $window.addEventListener('mousemove', onMouseMove);
        removeOnDestroy = scope.$on("$destroy", function() {
          removeOnDestroy();
          $window.removeEventListener('mousemove', onMouseMove);
          destroyed = true;
        });
        scope.main.addSubRoutine("css3d-rotation-effect-" + (Math.random()), function(delta) {
          var z;
          elasticTranslateX.update(delta);
          elasticRotateX.update(delta);
          elasticRotateY.update(delta);
          z = scope.translateZ != null ? scope.translateZ + "px" : 10;
          element[0].style.transform = element[0].style.MozTransform = element[0].style.MsTransform = element[0].style.WebkitTransform = "translate3d(" + elasticTranslateX.value + "px,0," + z + ") rotateX(" + elasticRotateX.value + "deg) rotateY(" + elasticRotateY.value + "deg)";
          return !destroyed;
        });
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').factory('axisHelper', function() {
    'ngInject';
    var AxisHelper;
    return AxisHelper = (function() {
      function AxisHelper() {}

      AxisHelper.get = function(length, dashed) {
        var axes;
        if (length == null) {
          length = 10;
        }
        if (dashed == null) {
          dashed = false;
        }
        axes = new THREE.Object3D();
        axes.add(AxisHelper.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, dashed));
        axes.add(AxisHelper.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, dashed));
        axes.add(AxisHelper.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, dashed));
        return axes;
      };

      AxisHelper.buildAxis = function(src, dst, colorHex, dashed) {
        var geom, mat;
        geom = new THREE.Geometry();
        if (dashed) {
          mat = new THREE.LineDashedMaterial({
            linewidth: 3,
            color: colorHex,
            dashSize: 3,
            gapSize: 3
          });
        } else {
          mat = new THREE.LineBasicMaterial({
            linewidth: 3,
            color: colorHex
          });
        }
        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances();
        return new THREE.Line(geom, mat, THREE.LineSegments);
      };

      return AxisHelper;

    })();
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('autoScroller', function($parse, $timeout, TweenMax) {
    'ngInject';
    var AutoScrollerController, directive;
    AutoScrollerController = function($scope) {
      'ngInject';
      this.autoScrolling = false;
      this.removeOnDestroyListener = $scope.$on("$destroy", (function(_this) {
        return function() {
          TweenMax.killTweensOf($scope.element[0]);
          _this.removeOnDestroyListener();
        };
      })(this));
      this.initscroll = (function(_this) {
        return function() {
          var scrollFactor;
          TweenMax.killTweensOf($scope.element[0]);
          scrollFactor = 1 - ($scope.element[0].scrollTop / ($scope.element[0].scrollHeight - $scope.element[0].clientHeight));
          return TweenMax.to($scope.element[0], 120 * scrollFactor, {
            ease: Power0.easeNone,
            scrollTo: {
              y: "#end",
              onAutoKill: _this.initscroll
            },
            delay: 1
          });
        };
      })(this);
      $scope.$watch("element", (function(_this) {
        return function() {
          _.defer(_this.initscroll);
        };
      })(this));
      this.onMouseWheel = _.throttle(this.initscroll, 250);
    };
    return directive = {
      restrict: 'A',
      controller: AutoScrollerController,
      controllerAs: "autoscroller",
      link: function(scope, element, attrs) {
        scope.element = element;
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('siteMenu', function($timeout, $window, Modernizr, md, $state) {
    'ngInject';
    var SiteMenuController, directive;
    SiteMenuController = function($scope, $rootScope) {
      'ngInject';
      this.selected = 0;
      this.destroyed = false;
      this.getParticlesColor = (function(_this) {
        return function() {
          var pid, ref;
          pid = (ref = $scope.main.config.products[_this.selected]) != null ? ref.id : void 0;
          if (pid == null) {
            return 0xaeb53e;
          }
          return $scope.main.locale[pid].particles_color;
        };
      })(this);
      this.scrollUp = (function(_this) {
        return function() {
          if (_this.selected > 0) {
            _this.selected--;
            _this.playSound();
          }
        };
      })(this);
      this.scrollDown = (function(_this) {
        return function() {
          if (_this.selected < $scope.main.config.products.length) {
            _this.selected++;
            _this.playSound();
          }
        };
      })(this);
      this.onImageHover = (function(_this) {
        return function(event, index) {
          if (index === _this.selected) {
            $scope.main.playSound('hover_menu');
          }
        };
      })(this);
      this.onItemClick = (function(_this) {
        return function(index, dest, product) {
          var params;
          if (index === _this.selected) {
            params = product != null ? {
              producturl: product.url
            } : null;
            $state.go(dest, params);
            return;
          }
          _this.selected = index;
          _this.playSound();
        };
      })(this);
      this.playSound = (function(_this) {
        return function() {
          if ($scope.main.config.products[_this.selected] != null) {
            $scope.main.playSound($scope.main.config.products[_this.selected].sound);
          } else if (_this.selected === $scope.main.config.products.length) {
            $scope.main.playSound("pin_rollover_6");
          }
        };
      })(this);
      this.getLabelStyle = (function(_this) {
        return function(index) {
          var diff, h, scale;
          diff = _this.selected - index;
          scale = Math.max(0.8, 1.7 / (Math.abs(diff * .5) + 1));
          if (diff !== 0) {
            if (diff < 0) {
              h = 15 * (diff + 1);
            }
            if (diff > 0) {
              h = 15 * (diff - 1);
            }
          } else {
            h = 0;
          }
          if (Modernizr.cssanimations) {
            return {
              transform: "translateY(" + h + "px) scale(" + scale + ")",
              WebkitTransform: "translateY(" + h + "px) scale(" + scale + ")",
              MozTransform: "translateY(" + h + "px) scale(" + scale + ")",
              MsTransform: "translateY(" + h + "px) scale(" + scale + ")"
            };
          }
          return {
            top: h + "px",
            fontSize: (20 * scale) + "px"
          };
        };
      })(this);
      this.getLabelsTop = function() {
        var h, multiplier;
        multiplier = $scope.main.platform.phone ? 42 : 48;
        h = ($window.innerHeight / 2) - (multiplier * this.selected);
        h -= $scope.main.desktop ? 32 : 45;
        if (Modernizr.cssanimations) {
          return {
            transform: "translateY(" + h + "px)",
            WebkitTransform: "translateY(" + h + "px)",
            MozTransform: "translateY(" + h + "px)",
            MsTransform: "translateY(" + h + "px)"
          };
        }
        return {
          top: h + "px"
        };
      };
      this.blockSmoothScrolling = true;
      this.lastDeltaMagnitude = 0;
      this.onMouseWheel = _.throttle((function(_this) {
        return function(event, delta, deltaX, deltaY) {
          var deltaMagnitude;
          if (_this.blockSmoothScrolling) {
            deltaMagnitude = Math.abs(event.deltaY);
            if (deltaMagnitude + .001 <= _this.lastDeltaMagnitude || deltaMagnitude < .1) {
              _this.lastDeltaMagnitude = deltaMagnitude;
              return;
            }
            _this.lastDeltaMagnitude = deltaMagnitude;
          }
          if (deltaY < 0) {
            _this.scrollDown();
          } else if (deltaY > 0) {
            _this.scrollUp();
          }
          $timeout(function() {
            return $scope.$apply();
          }, 0);
        };
      })(this), 250);
      this.removeStateChangeListener = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name !== "home") {
          $scope.main.menuOpen = false;
        }
      });
      this.removeDestroyListener = $scope.$on('$destroy', (function(_this) {
        return function() {
          _this.destroyed = true;
          _this.removeDestroyListener();
          _this.removeStateChangeListener();
        };
      })(this));
      this.preventDefault = function(e) {
        if ($scope.main.platform.ios) {
          return e.preventDefault();
        }
      };
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/site-menu/site-menu.html',
      controller: SiteMenuController,
      controllerAs: "sitemenu",
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('shareVolumeMenu', function($state, $stateParams) {
    'ngInject';
    var ShareVolumeMenuController, directive;
    ShareVolumeMenuController = function($scope) {
      'ngInject';
      this.locale = $stateParams.language;
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/share-volume-menu/share-volume-menu.html',
      controller: ShareVolumeMenuController,
      controllerAs: "sharevolume",
      replace: true
    };
  });

}).call(this);



(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('aquestCampoLeComete').factory('threeJsScene', function($log, $window, $rootScope, $state, $timeout, $q, $interval, $urlRouter, TweenMax, elasticNumber, elasticVector2, axisHelper, wavingShader, particleShader, pulseCircleStandalone) {
    'ngInject';
    var Scene3d;
    return Scene3d = (function() {
      Scene3d.STATE_IDLE = "idle";

      Scene3d.STATE_TRANSITION = "transition";

      Scene3d.STATE_FOCUSING = "focusing";

      Scene3d.prototype.camera = null;

      Scene3d.prototype.scene = null;

      Scene3d.prototype.camerasScene = null;

      Scene3d.prototype.renderer = null;

      Scene3d.prototype.clock = null;

      Scene3d.prototype.composer = null;

      Scene3d.prototype.state = Scene3d.STATE_IDLE;

      Scene3d.prototype.focusingObject = null;

      Scene3d.prototype.idleRadius = 37;

      Scene3d.prototype.idleRadiusIntro = 57;

      Scene3d.prototype.idleFOV = 64;

      Scene3d.prototype.minRadius = 30;

      Scene3d.prototype.maxRadius = 60;

      Scene3d.prototype.cameraRadius = null;

      Scene3d.prototype.sceneMouseRotation = null;

      Scene3d.prototype.mouseWheelSensitivity = 2;

      Scene3d.prototype.pinSize = .07;

      Scene3d.prototype.loadingSceneY = 60;

      Scene3d.prototype.finalSceneY = -20;

      Scene3d.prototype.skyboxLoaded = false;

      Scene3d.prototype.introDone = false;

      Scene3d.prototype.idleCameraZoomSpeed = .9;

      Scene3d.prototype.idleCameraMovementSpeed = .9;

      Scene3d.prototype.zoomOutCameraZoomSpeed = 2;

      Scene3d.prototype.zoomOutCameraMovementSpeed = .5;

      Scene3d.prototype.rotateCameraZoomSpeed = .1;

      Scene3d.prototype.rotateCameraMovementSpeed = 2;

      Scene3d.prototype.zoomInCameraZoomSpeed = 2;

      Scene3d.prototype.zoomInCameraMovementSpeed = 2;

      Scene3d.prototype.isMouseDown = false;

      Scene3d.prototype.mousePosition = new THREE.Vector2();

      Scene3d.prototype.mousePickingPosition = new THREE.Vector2();

      Scene3d.prototype.mouseDownPosition = new THREE.Vector2();

      Scene3d.prototype.phiThetaDownPosition = new THREE.Vector2();

      Scene3d.prototype.phiTheta = null;

      Scene3d.prototype.initialPhiTheta = null;

      Scene3d.prototype.cameraLookAt = new THREE.Vector3();

      Scene3d.prototype.mouseSensitivity = 10;

      Scene3d.prototype.gui = null;

      Scene3d.prototype.destroyed = false;

      Scene3d.prototype.raycaster = null;

      Scene3d.prototype.pinOpacity = null;

      Scene3d.prototype.pinMaterial = null;

      Scene3d.prototype.postponeFirstDrag = false;

      Scene3d.prototype.tempVec3_1 = new THREE.Vector3();

      Scene3d.prototype.tempVec3_2 = new THREE.Vector3();

      Scene3d.prototype.tempVec2_1 = new THREE.Vector2();

      Scene3d.prototype.tempVec2_2 = new THREE.Vector2();

      Scene3d.prototype.idleCameraName = 'camera0';

      Scene3d.prototype.productsToCameras = {
        stupore: 'camera1',
        vermentino: 'camera2',
        "rosato": 'camera3',
        "cabernet-sauvignon": 'camera4'
      };

      Scene3d.prototype.productsToPins = {
        stupore: 'locator1',
        vermentino: 'locator2',
        "rosato": 'locator3',
        "cabernet-sauvignon": 'locator4'
      };

      Scene3d.prototype.flappingStuff = [
        {
          parent: "cavalluccio",
          sx: 'ala_sx4',
          dx: 'ala_dx4',
          axis: 'y',
          extension: .1,
          speed: .09
        }, {
          parent: "cavalluccio_alato",
          sx: 'ala_dx3',
          dx: 'ala_sx3',
          axis: 'x',
          extension: .1,
          speed: .2
        }, {
          parent: "farfalla",
          sx: 'ala_sx5',
          dx: 'ala_dx5',
          axis: 'y',
          extension: .09,
          speed: .2
        }, {
          parent: "pesce",
          sx: 'ala_sx6',
          dx: 'ala_dx6',
          axis: 'x',
          extension: .05,
          speed: .1
        }, {
          parent: "cavalluccio_rosso",
          sx: 'ala_sx2',
          dx: 'ala_dx2',
          axis: 'x',
          extension: .04,
          speed: .1
        }, {
          parent: "pesce2",
          sx: 'ala_dx2.001',
          dx: 'ala_dx7',
          axis: 'x',
          extension: .05,
          speed: .1
        }
      ];

      Scene3d.prototype.floatingStuff = ['cavalluccio', 'pesce', 'cavalluccio_rosso', 'pesce2', 'cavalluccio_alato', 'farfalla', 'pavone', 'tipa'];

      Scene3d.prototype.wavingStuff = ['fiore1', 'fiore2', 'fiore3', 'fiore4', 'fiore5', 'fiore6', 'fiore7', 'fiore9', 'fiore10'];

      Scene3d.prototype.doubleFacedObjects = ['tipa'];

      function Scene3d($scope) {
        this.$scope = $scope;
        this.onTouchEnd = bind(this.onTouchEnd, this);
        this.onTouchMove = bind(this.onTouchMove, this);
        this.onTouchStart = bind(this.onTouchStart, this);
        this.onMouseUp = bind(this.onMouseUp, this);
        this.onMouseWheel = bind(this.onMouseWheel, this);
        this.onMouseMove = bind(this.onMouseMove, this);
        this.onMouseDown = bind(this.onMouseDown, this);
        this.moveCamera = bind(this.moveCamera, this);
        this.render = bind(this.render, this);
        this.onResize = bind(this.onResize, this);
        this.flapBack = bind(this.flapBack, this);
        this.flap = bind(this.flap, this);
        this.intro = bind(this.intro, this);
        this.preRenderScene = bind(this.preRenderScene, this);
        this.onLoadFinished = bind(this.onLoadFinished, this);
        this.onLoadProgress = bind(this.onLoadProgress, this);
        this.findCamera = bind(this.findCamera, this);
        this.findObjectByName = bind(this.findObjectByName, this);
        this.zoomIn = bind(this.zoomIn, this);
        this.rotateToObj = bind(this.rotateToObj, this);
        this.zoomOut = bind(this.zoomOut, this);
        this.getCameraForURL = bind(this.getCameraForURL, this);
        this.getIdleSpherical = bind(this.getIdleSpherical, this);
        this.gotoIdleState = bind(this.gotoIdleState, this);
        this.removeTransitionSubRoutines = bind(this.removeTransitionSubRoutines, this);
        this.onStateChange = bind(this.onStateChange, this);
        this.initPointsCloud = bind(this.initPointsCloud, this);
        this.init3DPins = bind(this.init3DPins, this);
        this.createPinTexture = bind(this.createPinTexture, this);
        this.init2DPins = bind(this.init2DPins, this);
        this.onMenuOpen = bind(this.onMenuOpen, this);
        this.destroy = bind(this.destroy, this);
        this.onSkyboxLoaded = bind(this.onSkyboxLoaded, this);
        this.init = bind(this.init, this);
        this.removeOnInitListener = this.$scope.$watch('element', this.init);
        this.removeDestroyListener = this.$scope.$on('$destroy', this.destroy);
        this.removeStateChangeListener = $rootScope.$on('$stateChangeStart', this.onStateChange);
        this.removeMenuOpenListener = this.$scope.$watch('main.menuOpen', this.onMenuOpen);
        return;
      }

      Scene3d.prototype.init = function(element) {
        var format, path, urls;
        if (element == null) {
          return;
        }
        this.removeLoadingListener = this.$scope.$watch('main.loading', (function(_this) {
          return function(value) {
            if (!value) {
              _this.removeLoadingListener();
              _this.intro();
            }
          };
        })(this));
        this.removeOnInitListener();
        this.raycaster = new THREE.Raycaster();
        this.phiTheta = new elasticVector2(new THREE.Vector2(0, 0));
        this.phiTheta.speed = .1;
        this.cameraRadius = new elasticNumber(this.idleRadius);
        this.cameraRadius.speed = this.idleCameraZoomSpeed;
        this.pinOpacity = new elasticNumber(1);
        this.sceneMouseRotation = new elasticNumber(Math.PI);
        this.sceneMouseRotation.speed = 1;
        this.$scope.main.addSubRoutine("sceneUpdate-3dMainScene", this.render);
        this.$scope.main.addSubRoutine("sceneUpdate-moveCamera", this.moveCamera);
        this.$scope.main.addSubRoutine('sceneUpdate-updatePhiTheta', this.phiTheta.update);
        this.$scope.main.addSubRoutine('sceneUpdate-updateCameraRadius', this.cameraRadius.update);
        this.$scope.main.addSubRoutine('sceneUpdate-updatePinOpacity', this.pinOpacity.update);
        this.$scope.main.addSubRoutine('sceneUpdate-updatesceneMouseRotation', (function(_this) {
          return function(delta) {
            var ref, ref1;
            _this.sceneMouseRotation.update(delta);
            if ((ref = _this.scene) != null) {
              ref.rotation.y = _this.sceneMouseRotation.value;
            }
            return (ref1 = _this.camerasScene) != null ? ref1.rotation.y = _this.sceneMouseRotation.value : void 0;
          };
        })(this));
        this.camera = new THREE.PerspectiveCamera(this.idleFOV * 0.7, 800 / 600, .1, 1500);
        this.cameraLookAt.set(0, 5, 0);
        this.scene = new THREE.Scene();
        this.scene.position.y = this.loadingSceneY;
        this.scene.rotation.y = Math.PI;
        this.camerasScene = new THREE.Scene();
        this.camerasScene.position.y = this.finalSceneY;
        this.camerasScene.rotation.y = Math.PI;
        this.camerasScene.updateMatrix();
        this.camerasScene.updateMatrixWorld(true);
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          canvas: this.$scope.element
        });
        this.renderer.sortObjects = false;
        this.clock = new THREE.Clock(true);
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio($window.devicePixelRatio);
        this.renderer.setSize(800, 600);
        this.composer = new THREE.EffectComposer(this.renderer);
        this.renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);
        this.colorCorrection = new THREE.ShaderPass(THREE.ColorCorrectionShader);
        this.colorCorrection.uniforms.powRGB.value.x = 1;
        this.colorCorrection.uniforms.powRGB.value.y = 1;
        this.colorCorrection.uniforms.powRGB.value.z = 1;
        this.composer.addPass(this.colorCorrection);
        this.brightnessContrast = new THREE.ShaderPass(THREE.BrightnessContrastShader);
        this.composer.addPass(this.brightnessContrast);
        this.fxaa = new THREE.ShaderPass(THREE.FXAAShader);
        this.fxaa.renderToScreen = true;
        this.composer.addPass(this.fxaa);
        THREE.Cache.enabled = false;
        this.$scope.element.addEventListener('mousedown', this.onMouseDown);
        $window.addEventListener('mousemove', this.onMouseMove);
        $window.addEventListener('mouseup', this.onMouseUp);
        this.$scope.element.addEventListener('touchstart', this.onTouchStart);
        this.$scope.element.addEventListener('touchmove', this.onTouchMove);
        $window.addEventListener('touchend', this.onTouchEnd);
        path = "assets/models/skybox_v2/";
        format = '.jpg';
        urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];
        this.reflectionCube = new THREE.CubeTextureLoader().load(urls, this.onSkyboxLoaded);
        this.reflectionCube.format = THREE.RGBFormat;
        this.scene.background = this.reflectionCube;
        this.onResize({
          width: $window.innerWidth,
          height: $window.innerHeight
        });
      };

      Scene3d.prototype.onSkyboxLoaded = function() {
        var loader;
        this.skyboxLoaded = true;
        this.initPointsCloud();
        loader = new THREE.ObjectLoader();
        if (!this.$scope.main.platform.desktop && this.$scope.main.platform.safari) {
          return loader.load("assets/models/v4-mobile/scene.json", this.onLoadFinished, this.onLoadProgress);
        } else {
          return loader.load("assets/models/v4/scene.json", this.onLoadFinished, this.onLoadProgress);
        }
      };

      Scene3d.prototype.destroy = function() {
        var ref;
        console.log('destroy');
        this.destroyed = true;
        this.removeDestroyListener();
        this.removeOnInitListener();
        this.removeStateChangeListener();
        this.removeTransitionSubRoutines();
        this.removeMenuOpenListener();
        if ((ref = this.gui) != null) {
          ref.destroy();
        }
        this.$scope.element.removeEventListener('mousedown', this.onMouseDown);
        $window.removeEventListener('mousemove', this.onMouseMove);
        $window.removeEventListener('mouseup', this.onMouseUp);
        this.$scope.element.removeEventListener('touchstart', this.onTouchStart);
        this.$scope.element.removeEventListener('touchmove', this.onTouchMove);
        $window.removeEventListener('touchend', this.onTouchEnd);
        this.renderer.dispose();
        this.scene.traverse(function(object) {
          var ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
          if ((ref1 = object.material) != null) {
            if ((ref2 = ref1.program) != null) {
              ref2.destroy();
            }
          }
          if ((ref3 = object.geometry) != null) {
            ref3.dispose();
          }
          if ((ref4 = object.material) != null) {
            if ((ref5 = ref4.uniforms) != null) {
              if ((ref6 = ref5.map) != null) {
                if ((ref7 = ref6.value) != null) {
                  ref7.dispose();
                }
              }
            }
          }
          if ((ref8 = object.material) != null) {
            if ((ref9 = ref8.map) != null) {
              ref9.dispose();
            }
          }
        });
        this.scene.background.dispose();
      };

      Scene3d.prototype.onMenuOpen = function(value) {
        if (value) {
          if (this.state === Scene3d.STATE_IDLE) {
            this.cameraRadius.target = this.idleRadiusIntro;
          }
        } else {
          if (this.$scope.main.firstDragged) {
            if (this.state === Scene3d.STATE_IDLE) {
              this.cameraRadius.target = this.idleRadius;
            }
          }
        }
        $timeout.cancel(this.sceneUpdateDeactivateTimeout);
        if (value) {
          this.sceneUpdateDeactivateTimeout = $timeout((function(_this) {
            return function() {
              return _this.$scope.main.sceneUpdate = false;
            };
          })(this), 1000);
        } else {
          this.$scope.main.sceneUpdate = true;
        }
      };

      Scene3d.prototype.setupDebugGUI = function() {
        var camera;
        this.gui = new dat.GUI();
        this.gui.add(this.$scope.main.css3dSettings, 'tx', 0, 50).step(1).name("CSS3D TX");
        this.gui.add(this.$scope.main.css3dSettings, 'rx', 0, 50).step(1).name("CSS3D RX");
        this.gui.add(this.$scope.main.css3dSettings, 'ry', 0, 50).step(1).name("CSS3D RY");
        this.gui.add(this, 'pinSize', 0, .2).step(.01).name("Pin Size");
        camera = this.gui.addFolder("Camera");
        camera.add(this, 'idleFOV', 0, 100).step(1).name("Idle FOV").onChange((function(_this) {
          return function() {
            if (_this.state === Scene3d.STATE_IDLE) {
              _this.camera.fov = _this.idleFOV;
              return _this.camera.updateProjectionMatrix();
            }
          };
        })(this));
        camera.add(this, 'idleCameraZoomSpeed', 0, 3).step(.1).name("Idle Zoom Spd");
        camera.add(this, 'idleCameraMovementSpeed', 0, 3).step(.1).name("Idle Mv Spd");
        camera.add(this, 'zoomOutCameraZoomSpeed', 0, 3).step(.1).name("Out Zoom Spd");
        camera.add(this, 'zoomOutCameraMovementSpeed', 0, 3).step(.1).name("Out Mv Spd");
        camera.add(this, 'zoomInCameraZoomSpeed', 0, 3).step(.1).name("In Zoom Spd");
        camera.add(this, 'zoomInCameraMovementSpeed', 0, 3).step(.1).name("In Mv Spd");
      };

      Scene3d.prototype.init2DPins = function() {
        this.$scope.main.addSubRoutine("sceneUpdate-pinPositionUpdate", (function(_this) {
          return function(deltaTime) {
            var index, locator, pinName, pos, prod;
            index = 0;
            for (prod in _this.productsToPins) {
              pinName = _this.productsToPins[prod];
              locator = _this.findObjectByName(pinName);
              if (locator != null) {
                locator.getWorldPosition(_this.tempVec3_1);
                pos = _this.getScreenPos(_this.tempVec3_1);
                pos.id = prod;
                pos.visible = true;
                if (_this.$scope.main.uiPins[index] == null) {
                  _this.$scope.main.uiPins[index] = pos;
                } else {
                  _this.$scope.main.uiPins[index].x = Math.round(pos.x);
                  _this.$scope.main.uiPins[index].y = Math.round(pos.y);
                  _this.$scope.main.uiPins[index].id = pos.id;
                  _this.$scope.main.uiPins[index].visible = true;
                }
                index++;
              }
            }
            return !_this.destroyed;
          };
        })(this));
      };

      Scene3d.prototype.checkPinVisibility = function(marker) {
        var L, cameraToMarker, cameraToScene, geometryRadius;
        marker.getWorldPosition(this.tempVec3_1);
        geometryRadius = this.tempVec3_1.length();
        cameraToScene = this.cameraLookAt.clone().sub(this.camera.position);
        L = Math.sqrt(Math.pow(cameraToScene.length(), 2) - Math.pow(geometryRadius, 2));
        cameraToMarker = this.tempVec3_1.sub(this.camera.position);
        return cameraToMarker.length() <= L + 5;
      };

      Scene3d.prototype.createPinTexture = function(id) {
        var pin, sprite1;
        pin = new pulseCircleStandalone({
          size: 64
        });
        sprite1 = new THREE.Texture(pin.domElement);
        sprite1.generateMipmaps = false;
        sprite1.minFilter = THREE.LinearFilter;
        sprite1.magFilter = THREE.LinearFilter;
        this.$scope.main.addSubRoutine("sceneUpdate-pinTextureUpdate-" + id, function(deltaTime) {
          pin.render(deltaTime);
          sprite1.needsUpdate = true;
          return true;
        });
        return sprite1;
      };

      Scene3d.prototype.init3DPins = function() {
        var geometry, parent, pinMaterial, pinName, plane, prod, texture;
        texture = this.createPinTexture("all");
        geometry = new THREE.PlaneBufferGeometry(5, 5, 1, 1);
        for (prod in this.productsToPins) {
          pinName = this.productsToPins[prod];
          parent = this.findObjectByName(pinName);
          if (parent != null) {
            pinMaterial = new THREE.SpriteMaterial({
              map: texture,
              transparent: false,
              depthTest: true,
              depthWrite: true
            });
            plane = new THREE.Sprite(pinMaterial);
            plane.elasticScale = new elasticNumber(1);
            plane.scale.set(1.5, 1.5, 1.5);
            plane.productid = prod;
            plane.name = "pin-" + prod;
            plane.parentPosition = parent;
            this.scene.add(plane);
          }
        }
        this.$scope.main.addSubRoutine("sceneUpdate-pinManagement", (function(_this) {
          return function(deltaTime) {
            var beforeOverPin, dist, intersections, loc, p, scale, threeDeePin;
            _this.overPins = [];
            for (prod in _this.productsToPins) {
              p = _this.findObjectByName("pin-" + prod);
              p.elasticScale.update(deltaTime);
              p.parentPosition.getWorldPosition(_this.tempVec3_1);
              loc = _this.scene.worldToLocal(_this.tempVec3_1);
              p.position.copy(loc);
              p.getWorldPosition(_this.tempVec3_1);
              _this.camera.getWorldPosition(_this.tempVec3_2);
              dist = _this.scene.worldToLocal(_this.tempVec3_1).sub(_this.scene.worldToLocal(_this.tempVec3_2)).length();
              scale = dist * _this.pinSize * p.elasticScale.value;
              p.scale.set(scale, scale, scale);
              if (_this.state === Scene3d.STATE_IDLE) {
                intersections = _this.raycaster.intersectObject(p);
                if (intersections.length > 0) {
                  p.elasticScale.target = 1.5;
                  _this.overPins.push({
                    distance: intersections[0].distance,
                    pin: p
                  });
                } else {
                  p.elasticScale.target = 1;
                }
              }
              p.material.opacity = _this.pinOpacity.value;
            }
            if (_this.state === Scene3d.STATE_IDLE) {
              _this.pinOpacity.target = 1;
            } else {
              _this.pinOpacity.target = 0;
            }
            _this.overPins.sort(function(a, b) {
              return a.distance < b.distance;
            });
            beforeOverPin = _this.$scope.main.overPin.over;
            if (_this.overPins.length > 0) {
              _this.$scope.main.overPin.over = true;
              _this.$scope.main.overPin.productid = _this.overPins[0].pin.productid;
              if (!beforeOverPin) {
                _this.$scope.$apply();
              }
            } else {
              _this.$scope.main.overPin.over = false;
              if (beforeOverPin) {
                _this.$scope.$apply();
              }
            }
            threeDeePin = _this.findObjectByName("pin-" + _this.$scope.main.overPin.productid);
            if (threeDeePin != null) {
              threeDeePin.getWorldPosition(_this.tempVec3_1);
              _this.$scope.main.overPin.position = _this.getScreenPos(_this.tempVec3_1);
            }
            return true;
          };
        })(this));
      };

      Scene3d.prototype.getScreenPos = function(position) {
        var h, mx, my, vector, w;
        w = $window.innerWidth / 2;
        h = $window.innerHeight / 2;
        vector = position.project(this.camera);
        mx = Math.round(((vector.x * w) + w) * 10) / 10;
        my = Math.round(((-vector.y * h) + h) * 10) / 10;
        return {
          x: mx,
          y: my
        };
      };

      Scene3d.prototype.initPointsCloud = function() {
        var geometry, i, j, material, numParticles, orbitSizes, orbitSpeeds, particles, posIndex, positions, pulseSpeeds, ref, sprite1, textureLoader;
        textureLoader = new THREE.TextureLoader();
        sprite1 = textureLoader.load("assets/models/particle1.jpg");
        numParticles = 1000;
        geometry = new THREE.BufferGeometry();
        positions = new Float32Array(numParticles * 3);
        pulseSpeeds = new Float32Array(numParticles);
        orbitSizes = new Float32Array(numParticles);
        orbitSpeeds = new Float32Array(numParticles);
        for (i = j = 0, ref = numParticles; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          posIndex = i * 3;
          positions[posIndex] = Math.random() * 200 - 100;
          positions[posIndex + 1] = Math.random() * 200 - 100;
          positions[posIndex + 2] = Math.random() * 200 - 100;
          pulseSpeeds[i] = 1 + (Math.random() * 2);
          orbitSizes[i] = 1 + (Math.random() * 2);
          orbitSpeeds[i] = -2 + (Math.random() * 4);
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('pulseSpeed', new THREE.BufferAttribute(pulseSpeeds, 1));
        geometry.addAttribute('orbitSize', new THREE.BufferAttribute(orbitSizes, 1));
        geometry.addAttribute('orbitSpeed', new THREE.BufferAttribute(orbitSpeeds, 1));
        material = new THREE.ShaderMaterial({
          uniforms: THREE.UniformsUtils.clone(particleShader.uniforms),
          vertexShader: particleShader.vertexShader,
          fragmentShader: particleShader.fragmentShader,
          blending: THREE.AdditiveBlending,
          transparent: true
        });
        material.uniforms.map.value = sprite1;
        material.uniforms.size.value = 0.4;
        particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.scene.children.pop();
        this.scene.children.unshift(particles);
        this.$scope.main.addSubRoutine("sceneUpdate-animateParticles", function(delta) {
          material.uniforms.time.value += delta;
          return !this.destroyed;
        });
      };

      Scene3d.prototype.onStateChange = function(event, toState, toParams, fromState, fromParams) {
        var cam;
        console.log("threejsScene received", toState.name);
        if (this.$scope.main.loading) {
          return;
        }
        switch (toState.name) {
          case 'home.transition':
            this.state = Scene3d.STATE_TRANSITION;
            break;
          case 'home.product':
            cam = this.getCameraForURL(toParams.producturl);
            if (this.focusingObject !== cam && (cam != null)) {
              if (event != null) {
                event.preventDefault();
              }
              $timeout.cancel(this.sceneUpdateDeactivateTimeout);
              this.$scope.main.sceneUpdate = true;
              $state.go('home.transition', toParams);
              this.gotoFocusingState(toParams.producturl).then((function(_this) {
                return function() {
                  $state.go(toState, toParams);
                  $timeout.cancel(_this.sceneUpdateDeactivateTimeout);
                  _this.sceneUpdateDeactivateTimeout = $timeout(function() {
                    return _this.$scope.main.sceneUpdate = false;
                  }, 3000);
                };
              })(this));
            }
            break;
          case 'home':
            $timeout.cancel(this.sceneUpdateDeactivateTimeout);
            this.$scope.main.sceneUpdate = true;
            if (this.postponeFirstDrag) {
              this.$scope.main.firstDragged = false;
            }
            this.gotoIdleState();
            if (this.postponeFirstDrag) {
              this.initialPhiTheta = new THREE.Vector2(this.phiTheta.x, this.phiTheta.y);
              this.$scope.main.firstDragged = true;
              this.postponeFirstDrag = false;
              $timeout((function(_this) {
                return function() {
                  _this.$scope.main.firstDragged = false;
                  return _this.$scope.$apply();
                };
              })(this), 10);
            }
            break;
          default:
            $timeout.cancel(this.sceneUpdateDeactivateTimeout);
            this.sceneUpdateDeactivateTimeout = $timeout((function(_this) {
              return function() {
                return _this.$scope.main.sceneUpdate = false;
              };
            })(this), 3000);
            this.gotoIdleState();
            break;
        }
      };

      Scene3d.prototype.removeTransitionSubRoutines = function() {
        this.$scope.main.removeSubRoutine('transitionIdleState');
        this.$scope.main.removeSubRoutine('transitionZoomOut');
        this.$scope.main.removeSubRoutine('transitionRotate');
        this.$scope.main.removeSubRoutine('transitionZoomIn');
        TweenMax.killTweensOf(this.cameraRadius);
        TweenMax.killTweensOf(this.phiTheta);
      };

      Scene3d.prototype.gotoIdleState = function() {
        var defer, idleRadius, idleSpherical;
        defer = $q.defer();
        console.log('gotoIdleState');
        this.removeTransitionSubRoutines();
        this.focusingObject = null;
        idleRadius = this.$scope.main.firstDragged && this.introDone ? this.idleRadius : this.idleRadiusIntro;
        this.$scope.main.addSubRoutine('sceneUpdate-transitionIdleState', (function(_this) {
          return function() {
            idleRadius = _this.$scope.main.firstDragged ? _this.idleRadius : _this.idleRadiusIntro;
            if (_this.cameraRadius.value >= idleRadius - (idleRadius * .001)) {
              defer.resolve();
              return false;
            }
            return true;
          };
        })(this));
        this.state = Scene3d.STATE_IDLE;
        idleSpherical = this.getIdleSpherical();
        TweenMax.to(this.cameraRadius, 2, {
          speed: this.idleCameraZoomSpeed,
          target: idleRadius
        });
        this.phiTheta.x = idleSpherical.phi;
        this.phiTheta.y = idleSpherical.theta;
        TweenMax.to(this.phiTheta, 2, {
          speed: this.idleCameraMovementSpeed
        });
        TweenMax.to(this.cameraLookAt, 2, {
          x: 0,
          y: 0,
          z: 0
        });
        TweenMax.to(this.camera, 5, {
          fov: this.idleFOV,
          ease: Power2.easeInOut,
          onUpdate: (function(_this) {
            return function() {
              return _this.camera.updateProjectionMatrix();
            };
          })(this)
        });
        return defer.promise;
      };

      Scene3d.prototype.getIdleSpherical = function() {
        var cam;
        cam = this.findCamera(this.idleCameraName);
        cam.getWorldPosition(this.tempVec3_1);
        return this.getSphericalCoordinates(this.tempVec3_1);
      };

      Scene3d.prototype.gotoFocusingState = function(productURL) {
        var defer, obj;
        defer = $q.defer();
        obj = this.getCameraForURL(productURL);
        if (obj == null) {
          defer.resolve();
          return defer.promise;
        }
        this.focusingObject = null;
        switch (this.state) {
          case Scene3d.STATE_FOCUSING:
          case Scene3d.STATE_TRANSITION:
            this.zoomIn(obj).then((function(_this) {
              return function() {
                _this.state = Scene3d.STATE_FOCUSING;
                _this.focusingObject = obj;
                return defer.resolve();
              };
            })(this));
            break;
          case Scene3d.STATE_IDLE:
            this.cameraRadius.target = this.idleRadius;
            this.cameraRadius.speed = this.idleCameraZoomSpeed;
            this.zoomIn(obj).then((function(_this) {
              return function() {
                _this.state = Scene3d.STATE_FOCUSING;
                _this.focusingObject = obj;
                return defer.resolve();
              };
            })(this));
            break;
        }
        return defer.promise;
      };

      Scene3d.prototype.getCameraForURL = function(productURL) {
        var obj, objectName, pId;
        pId = _.find(this.$scope.main.config.products, {
          url: productURL
        }).id;
        if (pId) {
          objectName = this.productsToCameras[pId];
          if (objectName) {
            obj = this.findCamera(objectName);
            if (obj != null) {
              return obj;
            }
          }
        }
        return null;
      };

      Scene3d.prototype.zoomOut = function(obj) {
        var defer, sp;
        defer = $q.defer();
        this.removeTransitionSubRoutines();
        this.$scope.main.addSubRoutine('sceneUpdate-transitionZoomOut', (function(_this) {
          return function() {
            if (_this.cameraRadius.value >= _this.idleRadius - (_this.idleRadius * .001) && _this.cameraRadius.value <= _this.idleRadius + (_this.idleRadius * .001)) {
              defer.resolve();
              return false;
            }
            return true;
          };
        })(this));
        console.log('zoomOut');
        obj.getWorldPosition(this.tempVec3_1);
        sp = this.getSphericalCoordinates(this.tempVec3_1);
        TweenMax.to(this.phiTheta, 2, {
          x: sp.phi,
          y: sp.theta,
          speed: this.zoomOutCameraMovementSpeed,
          ease: Power2.easeInOut
        });
        TweenMax.to(this.cameraRadius, 2, {
          speed: this.zoomOutCameraZoomSpeed,
          target: this.idleRadius,
          ease: Power2.easeInOut
        });
        TweenMax.to(this.cameraLookAt, 1, {
          x: 0,
          y: 0,
          z: 0,
          ease: Power2.easeInOut
        });
        return defer.promise;
      };

      Scene3d.prototype.rotateToObj = function(obj) {
        var defer, sp;
        defer = $q.defer();
        console.log('rotateToObj');
        this.removeTransitionSubRoutines();
        this.$scope.main.addSubRoutine('sceneUpdate-transitionRotate', (function(_this) {
          return function() {
            if (_this.phiTheta.value.x >= sp.phi - 1 && _this.phiTheta.value.x <= sp.phi + 1) {
              defer.resolve();
              return false;
            }
            return true;
          };
        })(this));
        obj.getWorldPosition(this.tempVec3_1);
        sp = this.getSphericalCoordinates(this.tempVec3_1);
        TweenMax.to(this.phiTheta, 2, {
          x: sp.phi,
          y: sp.theta,
          speed: this.rotateCameraMovementSpeed,
          ease: Power2.easeInOut
        });
        TweenMax.to(this.cameraRadius, 2, {
          speed: this.rotateCameraZoomSpeed,
          target: this.idleRadius,
          ease: Power2.easeInOut
        });
        TweenMax.to(this.cameraLookAt, 1, {
          x: 0,
          y: 0,
          z: 0,
          ease: Power2.easeInOut
        });
        return defer.promise;
      };

      Scene3d.prototype.zoomIn = function(obj) {
        var defer, lookat, sp;
        defer = $q.defer();
        console.log('zoomIn');
        this.removeTransitionSubRoutines();
        obj.getWorldPosition(this.tempVec3_1);
        sp = this.getSphericalCoordinates(this.tempVec3_1);
        this.$scope.main.addSubRoutine('sceneUpdate-transitionZoomIn', (function(_this) {
          return function() {
            if (_this.cameraRadius.value <= sp.radius + (_this.idleRadius * .001) && _this.cameraRadius.value >= sp.radius - (_this.idleRadius * .001)) {
              defer.resolve();
              return false;
            }
            return true;
          };
        })(this));
        if (obj instanceof THREE.PerspectiveCamera) {
          TweenMax.killTweensOf(this.camera);
          TweenMax.to(this.camera, 5, {
            fov: obj.fov,
            onUpdate: (function(_this) {
              return function() {
                return _this.camera.updateProjectionMatrix();
              };
            })(this),
            ease: Power2.easeInOut
          });
        }
        TweenMax.to(this.phiTheta, 2, {
          x: sp.phi,
          y: sp.theta,
          speed: this.zoomInCameraMovementSpeed,
          ease: Power2.easeInOut
        });
        TweenMax.to(this.cameraRadius, 2, {
          speed: this.zoomInCameraZoomSpeed,
          target: sp.radius,
          ease: Power2.easeInOut
        });
        lookat = obj.getWorldDirection();
        lookat.multiplyScalar(-sp.radius);
        obj.getWorldPosition(this.tempVec3_1);
        lookat.add(this.tempVec3_1);
        TweenMax.to(this.cameraLookAt, 4, {
          x: lookat.x,
          y: lookat.y,
          z: lookat.z,
          ease: Power2.easeInOut
        });
        return defer.promise;
      };

      Scene3d.prototype.getCartesianCoordinates = function(vector, radius, phi, theta) {
        vector.z = radius * Math.sin(theta + (Math.PI / 2)) * Math.cos(phi);
        vector.x = radius * Math.sin(theta + (Math.PI / 2)) * Math.sin(phi);
        vector.y = radius * Math.cos(theta + (Math.PI / 2));
      };

      Scene3d.prototype.getSphericalCoordinates = function(vector) {
        var ang, cp1, phi, r, ta, theta, threesixty;
        r = vector.length();
        phi = Math.atan2(vector.x, vector.z);
        theta = Math.acos(vector.y / r) - (Math.PI / 2);
        threesixty = Math.PI * 2;
        cp1 = Math.floor(this.phiTheta.value.x / threesixty) * threesixty;
        ta = cp1 + phi;
        ang = this.shortestAngle(ta, this.phiTheta.value.x);
        phi = this.phiTheta.value.x + ang;
        return {
          radius: r,
          theta: theta,
          phi: phi
        };
      };

      Scene3d.prototype.shortestAngle = function(targetA, sourceA) {
        var a;
        a = targetA - sourceA;
        return this.absmod(a + Math.PI, Math.PI * 2) - Math.PI;
      };

      Scene3d.prototype.findObjectByName = function(name) {
        var result;
        result = null;
        this.scene.traverse(function(object) {
          if (object.name === name) {
            return result = object;
          }
        });
        return result;
      };

      Scene3d.prototype.findCamera = function(name) {
        var cam, j, len, ref;
        if (this.cameras == null) {
          return;
        }
        ref = this.cameras;
        for (j = 0, len = ref.length; j < len; j++) {
          cam = ref[j];
          if (cam.name === name) {
            return cam;
          }
        }
        return null;
      };

      Scene3d.prototype.onLoadProgress = function(request) {
        var progressNormal;
        progressNormal = (request.loaded !== 0 ? request.loaded : 1) / (request.total !== 0 ? request.total : 1);
        progressNormal = Math.max(0, Math.min(1, progressNormal));
        this.$scope.main.loadingProgress = progressNormal;
        this.phiTheta.x = (Math.PI * 2) * progressNormal;
      };

      Scene3d.prototype.onLoadFinished = function(result) {
        var cam, j, len, ref;
        while (result.children.length > 0) {
          this.scene.add(result.children[0]);
        }
        this.init3DPins();
        this.init2DPins();
        this.cameras = [];
        this.scene.traverse((function(_this) {
          return function(object) {
            var map, scaleNegative, transparent, wMax, wMin;
            if (object instanceof THREE.PerspectiveCamera) {
              _this.cameras.push(object);
            }
            if (object instanceof THREE.Mesh) {
              map = null;
              transparent = object.material.transparent;
              if (object.material.lightMap != null) {
                map = object.material.lightMap;
              }
              object.material = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(wavingShader.uniforms),
                vertexShader: wavingShader.vertexShader,
                fragmentShader: wavingShader.fragmentShader
              });
              object.material.uniforms.fresnelColor.value = new THREE.Color(0xFFFFFF);
              object.material.uniforms.fresnelIntensity.value = 0;
              object.material.uniforms.fresnelPow.value = 5;
              object.material.transparent = transparent;
              scaleNegative = object.scale.x < 0 || object.scale.y < 0 || object.scale.z < 0;
              if (scaleNegative) {
                object.material.side = THREE.BackSide;
              }
              if (_this.doubleFacedObjects.indexOf(object.name) !== -1) {
                object.material.side = THREE.DoubleSide;
              }
              if (map != null) {
                object.material.uniforms.map.value = map;
              }
              if (_this.wavingStuff.indexOf(object.name) !== -1) {
                object.geometry.computeBoundingBox();
                wMin = object.geometry.boundingBox.min.y;
                wMax = object.geometry.boundingBox.max.y;
                object.material.uniforms.wavingMax.value = wMax;
                object.material.uniforms.wavingMin.value = wMin;
                object.material.uniforms.wavingFactor.value = -5 + (Math.random() * 10);
                object.material.uniforms.wavingAmplitude.value = Math.abs(wMax - wMin) * .033;
                _this.wave(object, Math.random() * 10);
              }
            }
          };
        })(this));
        ref = this.cameras;
        for (j = 0, len = ref.length; j < len; j++) {
          cam = ref[j];
          this.camerasScene.add(cam);
          cam.updateMatrix();
          cam.updateMatrixWorld(true);
        }
        this.$scope.$apply();
        this.setupFlappingStuff();
        this.setupFloatingStuff();
        if (this.$scope.main.platform.development) {
          this.setupDebugGUI();
        }
        if (!this.$scope.main.platform.ios) {
          this.preRenderScene();
        }
        $timeout((function(_this) {
          return function() {
            return _this.$scope.main.loadingProgress = 2;
          };
        })(this), 100);
      };

      Scene3d.prototype.preRenderScene = function() {
        var startFOV, startLookAt, startPosition;
        startPosition = this.scene.position.clone();
        startFOV = this.camera.fov;
        startLookAt = this.cameraLookAt.clone();
        this.camera.fov = 100;
        this.cameraLookAt.set(0, 0, 0);
        this.camera.updateProjectionMatrix();
        this.scene.position.y = this.finalSceneY;
        this.scene.updateMatrix();
        this.scene.updateMatrixWorld(true);
        this.renderer.render(this.scene, this.camera);
        this.camera.fov = startFOV;
        this.cameraLookAt.copy(startLookAt);
        this.camera.updateProjectionMatrix();
        this.scene.position.copy(startPosition);
        this.scene.updateMatrix();
        this.scene.updateMatrixWorld(true);
        this.renderer.render(this.scene, this.camera);
      };

      Scene3d.prototype.intro = function() {
        var idleSpherical;
        this.onStateChange(null, $state.current, $state.params);
        idleSpherical = this.getIdleSpherical();
        this.initialPhiTheta = new THREE.Vector2(idleSpherical.phi, idleSpherical.theta);
        if (this.state === Scene3d.STATE_IDLE) {
          this.$scope.main.firstDragged = false;
          TweenMax.to(this.camera, 5, {
            fov: this.idleFOV,
            onUpdate: (function(_this) {
              return function() {
                return _this.camera.updateProjectionMatrix();
              };
            })(this)
          });
          TweenMax.to(this.cameraLookAt, 5, {
            x: 0,
            y: 0,
            z: 0
          });
        } else {
          this.$scope.main.firstDragged = true;
          this.postponeFirstDrag = true;
        }
        TweenMax.to(this.scene.position, 5, {
          y: this.finalSceneY
        });
        this.introDone = true;
      };

      Scene3d.prototype.wave = function(object, delay) {
        if (delay == null) {
          delay = 0;
        }
        TweenMax.to(object.material.uniforms.wavingFactor, 5 + Math.random() * 5, {
          value: 2,
          ease: Power2.easeInOut,
          delay: delay,
          onComplete: (function(_this) {
            return function() {
              if (!_this.destroyed) {
                return _this.waveBack(object);
              }
            };
          })(this)
        });
      };

      Scene3d.prototype.waveBack = function(object) {
        TweenMax.to(object.material.uniforms.wavingFactor, 5 + Math.random() * 5, {
          value: -2,
          ease: Power2.easeInOut,
          onComplete: (function(_this) {
            return function() {
              if (!_this.destroyed) {
                return _this.wave(object);
              }
            };
          })(this)
        });
      };

      Scene3d.prototype.setupFloatingStuff = function() {
        var j, len, obj, ref;
        ref = this.floatingStuff;
        for (j = 0, len = ref.length; j < len; j++) {
          obj = ref[j];
          obj = this.findObjectByName(obj);
          if (obj != null) {
            obj.floated = obj.position.y + 1;
            obj.unfloated = obj.position.y;
            this.float(obj, Math.random() * 10);
          }
        }
      };

      Scene3d.prototype.float = function(obj, delay) {
        if (delay == null) {
          delay = 0;
        }
        TweenMax.to(obj.position, 5, {
          y: obj.floated,
          ease: Power2.easeInOut,
          delay: delay,
          onComplete: (function(_this) {
            return function() {
              if (!_this.destroyed) {
                return _this.floatBack(obj);
              }
            };
          })(this)
        });
      };

      Scene3d.prototype.floatBack = function(obj) {
        TweenMax.to(obj.position, 5, {
          y: obj.unfloated,
          ease: Power2.easeInOut,
          onComplete: (function(_this) {
            return function() {
              if (!_this.destroyed) {
                return _this.float(obj);
              }
            };
          })(this)
        });
      };

      Scene3d.prototype.setupFlappingStuff = function() {
        var dx, j, len, obj, parent, ref, sx;
        ref = this.flappingStuff;
        for (j = 0, len = ref.length; j < len; j++) {
          obj = ref[j];
          parent = this.findObjectByName(obj.parent);
          sx = _.find(parent.children, {
            name: obj.sx
          });
          dx = _.find(parent.children, {
            name: obj.dx
          });
          if ((sx != null) && (dx != null)) {
            sx.flapped = sx.rotation[obj.axis] - obj.extension;
            sx.unflapped = sx.rotation[obj.axis];
            dx.flapped = dx.rotation[obj.axis] + obj.extension;
            dx.unflapped = dx.rotation[obj.axis];
            this.flap(sx, obj.axis, obj.speed);
            this.flap(dx, obj.axis, obj.speed);
          } else {
            console.log("BO");
          }
        }
      };

      Scene3d.prototype.flap = function(obj, flappingAxis, duration) {
        if (flappingAxis == null) {
          flappingAxis = 'y';
        }
        if (duration == null) {
          duration = .1;
        }
        switch (flappingAxis) {
          case 'x':
            TweenMax.to(obj.rotation, duration, {
              x: obj.flapped,
              onComplete: (function(_this) {
                return function() {
                  if (!_this.destroyed) {
                    return _this.flapBack(obj, flappingAxis, duration);
                  }
                };
              })(this)
            });
            break;
          case 'y':
            TweenMax.to(obj.rotation, duration, {
              y: obj.flapped,
              onComplete: (function(_this) {
                return function() {
                  if (!_this.destroyed) {
                    return _this.flapBack(obj, flappingAxis, duration);
                  }
                };
              })(this)
            });
            break;
          case 'z':
            TweenMax.to(obj.rotation, duration, {
              z: obj.flapped,
              onComplete: (function(_this) {
                return function() {
                  if (!_this.destroyed) {
                    return _this.flapBack(obj, flappingAxis, duration);
                  }
                };
              })(this)
            });
            break;
        }
      };

      Scene3d.prototype.flapBack = function(obj, flappingAxis, duration) {
        if (flappingAxis == null) {
          flappingAxis = 'y';
        }
        if (duration == null) {
          duration = .1;
        }
        switch (flappingAxis) {
          case 'x':
            TweenMax.to(obj.rotation, duration, {
              x: obj.unflapped,
              onComplete: (function(_this) {
                return function() {
                  if (!_this.destroyed) {
                    return _this.flap(obj, flappingAxis, duration);
                  }
                };
              })(this)
            });
            break;
          case 'y':
            TweenMax.to(obj.rotation, duration, {
              y: obj.unflapped,
              onComplete: (function(_this) {
                return function() {
                  if (!_this.destroyed) {
                    return _this.flap(obj, flappingAxis, duration);
                  }
                };
              })(this)
            });
            break;
          case 'z':
            TweenMax.to(obj.rotation, duration, {
              z: obj.unflapped,
              onComplete: (function(_this) {
                return function() {
                  if (!_this.destroyed) {
                    return _this.flap(obj, flappingAxis, duration);
                  }
                };
              })(this)
            });
            break;
        }
      };

      Scene3d.prototype.onResize = function(event) {
        var ref, ref1, ref2, ref3;
        this.camera.aspect = event.width / event.height;
        this.camera.updateProjectionMatrix();
        if ((ref = this.fxaa) != null) {
          if ((ref1 = ref.uniforms.resolution) != null) {
            ref1.value.x = 1 / (event.width * $window.devicePixelRatio);
          }
        }
        if ((ref2 = this.fxaa) != null) {
          if ((ref3 = ref2.uniforms.resolution) != null) {
            ref3.value.y = 1 / (event.height * $window.devicePixelRatio);
          }
        }
        this.renderer.setSize(event.width, event.height);
        this.composer.setSize(event.width, event.height);
      };

      Scene3d.prototype.render = function(deltaTime) {
        if (!this.skyboxLoaded) {
          return !this.destroyed;
        }
        if (!this.destroyed) {
          this.raycaster.setFromCamera(this.mousePickingPosition, this.camera);
          this.camera.lookAt(this.cameraLookAt);
          this.renderer.render(this.scene, this.camera);
        }
        return !this.destroyed;
      };

      Scene3d.prototype.moveCamera = function() {
        var ref;
        if (this.state === Scene3d.STATE_IDLE && this.isMouseDown) {
          this.phiTheta.x = this.phiThetaDownPosition.x + (this.mouseDownPosition.x - this.mousePosition.x) / ($window.innerWidth / this.mouseSensitivity);
          this.phiTheta.y = this.phiThetaDownPosition.y + (this.mouseDownPosition.y - this.mousePosition.y) / ($window.innerHeight / this.mouseSensitivity);
          this.phiTheta.y = Math.max(-.8, Math.min(.8, this.phiTheta.y));
        }
        if (isNaN(this.phiTheta.x)) {
          this.phiTheta.x = 0;
        }
        if (isNaN(this.phiTheta.y)) {
          this.phiTheta.y = 0;
        }
        this.phiTheta.y = this.clamp(this.phiTheta.y, -Math.PI / 2 + 0.001, Math.PI / 2 - 0.001);
        if (Math.abs((ref = this.initialPhiTheta) != null ? ref.distanceTo(this.phiTheta) : void 0) > .2 && !this.$scope.main.firstDragged) {
          this.$scope.main.firstDragged = true;
          this.$scope.$apply();
          console.log("first dragged");
          this.$scope.main.playSound('generic_transition');
          if (this.state === Scene3d.STATE_IDLE) {
            this.gotoIdleState();
          }
        }
        this.getCartesianCoordinates(this.camera.position, this.cameraRadius.value, this.phiTheta.value.x, this.phiTheta.value.y);
        return !this.destroyed;
      };

      Scene3d.prototype.clamp = function(number, min, max) {
        return Math.max(min, Math.min(max, number));
      };

      Scene3d.prototype.absmod = function(number, max) {
        return ((number % max) + max) % max;
      };

      Scene3d.prototype.onMouseDown = function(event) {
        this.isMouseDown = true;
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
        this.mouseDownPosition.copy(this.mousePosition);
        this.phiThetaDownPosition.copy(this.phiTheta);
        this.mousePickingPosition.x = (event.clientX / $window.innerWidth) * 2 - 1;
        this.mousePickingPosition.y = -(event.clientY / $window.innerHeight) * 2 + 1;
      };

      Scene3d.prototype.onMouseMove = function(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
        this.mousePickingPosition.x = (event.clientX / $window.innerWidth) * 2 - 1;
        this.mousePickingPosition.y = -(event.clientY / $window.innerHeight) * 2 + 1;
        this.sceneMouseRotation.target = Math.PI + (this.mousePickingPosition.x * .05);
      };

      Scene3d.prototype.onMouseWheel = function(event, delta, deltaX, deltaY) {
        if (this.state === Scene3d.STATE_IDLE) {
          this.cameraRadius.target += Math.min(1, Math.max(-1, event.originalEvent.deltaY)) * this.mouseWheelSensitivity;
          this.cameraRadius.target = Math.min(this.maxRadius, Math.max(this.minRadius, this.cameraRadius.target));
        }
      };

      Scene3d.prototype.onMouseUp = function(event) {
        this.isMouseDown = false;
        this.mousePickingPosition.x = (event.clientX / $window.innerWidth) * 2 - 1;
        this.mousePickingPosition.y = -(event.clientY / $window.innerHeight) * 2 + 1;
      };

      Scene3d.prototype.onTouchStart = function(event) {
        if (event.touches[0] == null) {
          return;
        }
        this.isMouseDown = true;
        this.mousePosition.x = event.touches[0].clientX;
        this.mousePosition.y = event.touches[0].clientY;
        this.mouseDownPosition.copy(this.mousePosition);
        this.phiThetaDownPosition.copy(this.phiTheta);
        this.mousePickingPosition.x = (event.touches[0].clientX / $window.innerWidth) * 2 - 1;
        this.mousePickingPosition.y = -(event.touches[0].clientY / $window.innerHeight) * 2 + 1;
      };

      Scene3d.prototype.onTouchMove = function(event) {
        if (event.touches[0] == null) {
          return;
        }
        this.mousePosition.x = event.touches[0].clientX;
        this.mousePosition.y = event.touches[0].clientY;
        if (!this.hasParentClass(event.target, "allow-scroll")) {
          event.preventDefault();
        }
        this.mousePickingPosition.x = (event.touches[0].clientX / $window.innerWidth) * 2 - 1;
        this.mousePickingPosition.y = -(event.touches[0].clientY / $window.innerHeight) * 2 + 1;
      };

      Scene3d.prototype.hasParentClass = function(element, className) {
        if (element.className.indexOf(className) !== -1) {
          return true;
        }
        if (element.parentElement != null) {
          return this.hasParentClass(element.parentElement, className);
        }
        return false;
      };

      Scene3d.prototype.onTouchEnd = function(event) {
        if (event.touches[0] == null) {
          return;
        }
        this.isMouseDown = false;
        this.mousePickingPosition.x = (event.touches[0].clientX / $window.innerWidth) * 2 - 1;
        this.mousePickingPosition.y = -(event.touches[0].clientY / $window.innerHeight) * 2 + 1;
      };

      return Scene3d;

    })();
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('scene3d', function() {
    'ngInject';
    var Scene3dController, directive;
    Scene3dController = function(threeJsScene, $scope) {
      'ngInject';
      this.scene = new threeJsScene($scope);
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/scene-3d/scene-3d.html',
      controller: Scene3dController,
      controllerAs: "scene3d",
      replace: true,
      link: function(scope, element) {
        return scope.element = element[0];
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('scene2d', function($window, $timeout, $state) {
    'ngInject';
    var Scene2dController, directive;
    Scene2dController = function($scope, $rootScope) {
      'ngInject';
      var i, len, product, ref;
      $scope.main.loadingProgress = 2;
      $scope.main.uiPins = [];
      this.focusingObject = null;
      this.onStateChange = (function(_this) {
        return function(event, toState, toParams, fromState, fromParams) {
          console.log("threejsScene received", toState.name);
          switch (toState.name) {
            case 'home.product':
              if (_this.focusingObject !== toParams.producturl) {
                if (event != null) {
                  event.preventDefault();
                }
                $state.go('home.transition', toParams);
                $timeout(function() {
                  _this.focusingObject = toParams.producturl;
                  return $state.go(toState, toParams);
                }, 5000);
              }
              break;
            default:
              _this.focusingObject = null;
              break;
          }
        };
      })(this);
      this.removeStateChangeListener = $rootScope.$on('$stateChangeStart', this.onStateChange);
      ref = $scope.main.config.products;
      for (i = 0, len = ref.length; i < len; i++) {
        product = ref[i];
        $scope.main.uiPins.push({
          id: product.id,
          visible: true,
          x: $window.innerWidth * product.fallback_position[0],
          y: $window.innerHeight * product.fallback_position[1]
        });
      }
      this.onResize = function(w, h) {
        var aspect, canvasHeight, canvasWidth, invAspect, j, len1, pin, prod, ref1, waspect, xOffset, yOffset;
        w = 2280;
        h = 2880;
        aspect = w / h;
        invAspect = h / w;
        waspect = $window.innerWidth / $window.innerHeight;
        canvasWidth = Math.min($window.innerWidth, $window.innerHeight * aspect);
        canvasHeight = Math.min($window.innerHeight, $window.innerWidth * invAspect);
        xOffset = ($window.innerWidth - canvasWidth) / 2;
        yOffset = ($window.innerHeight - canvasHeight) / 2;
        ref1 = $scope.main.uiPins;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          pin = ref1[j];
          prod = _.find($scope.main.config.products, {
            id: pin.id
          });
          pin.x = xOffset + (canvasWidth * prod.fallback_position[0]);
          pin.y = yOffset + (canvasHeight * prod.fallback_position[1]);
        }
      };
      this.removeLoadingListener = $scope.$watch('main.loading', (function(_this) {
        return function(value) {
          if (!value) {
            return _this.removeLoadingListener();
          }
        };
      })(this));
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/scene-2d/scene-2d.html',
      controller: Scene2dController,
      controllerAs: "scene2d",
      replace: true
    };
  });

}).call(this);



(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('aquestCampoLeComete').factory('pulseCircleStandalone', function() {
    'ngInject';
    var PulseCircle;
    return PulseCircle = (function() {
      PulseCircle.prototype.size = 64;

      PulseCircle.prototype.domElement = null;

      PulseCircle.prototype.circles = null;

      PulseCircle.prototype.colors = null;

      PulseCircle.prototype.ctx = null;

      PulseCircle.prototype.speed = 1;

      PulseCircle.prototype.destroyed = false;

      function PulseCircle(params) {
        var circle, i, j, numCircles, ref;
        this.params = params;
        this.render = bind(this.render, this);
        this.tweenLoop = bind(this.tweenLoop, this);
        this.size = this.params.size || 64;
        this.domElement = this.params.canvas || document.createElement('canvas');
        this.speed = this.params.speed || 12;
        this.colors = this.params.colors || ["rgba(1, 255, 156, 1)", "rgba(0, 147, 88, 0.0)"];
        this.ctx = this.domElement.getContext('2d');
        numCircles = 10;
        this.circles = [];
        for (i = j = 0, ref = numCircles; j < ref; i = j += 1) {
          circle = {
            radius: 0,
            alpha: 1,
            color: this.colors[0]
          };
          this.circles.push(circle);
          this.tweenLoop(circle, this.speed * i * .1);
        }
        return;
      }

      PulseCircle.prototype.tweenLoop = function(circle, delay) {
        if (this.destroyed) {
          return;
        }
        TweenMax.to(circle, this.speed, {
          radius: 1,
          delay: delay,
          alpha: 0,
          ease: Power4.easeOut,
          colorProps: {
            color: this.colors[1]
          },
          onComplete: (function(_this) {
            return function() {
              circle.radius = 0;
              circle.alpha = 1;
              circle.color = _this.colors[0];
              return _this.tweenLoop(circle, 0);
            };
          })(this)
        });
      };

      PulseCircle.prototype.render = function(delta) {
        var center, circle, i, j, len, radius, ref, sizeScaled;
        sizeScaled = this.size;
        if (this.domElement.width !== sizeScaled) {
          this.domElement.width = sizeScaled;
          this.domElement.height = sizeScaled;
        }
        this.ctx.clearRect(0, 0, sizeScaled, sizeScaled);
        center = sizeScaled / 2;
        radius = sizeScaled * 0.5;
        this.circles.sort(function(a, b) {
          return a.alpha > b.alpha;
        });
        ref = this.circles;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          circle = ref[i];
          if (circle.radius > 0 && circle.alpha > 0.01) {
            this.ctx.fillStyle = circle.color;
            this.ctx.beginPath();
            this.ctx.arc(center, center, radius * circle.radius, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
        return !this.destroyed;
      };

      return PulseCircle;

    })();
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('pulseCircle', function(pulseCircleStandalone) {
    'ngInject';
    var PulseCircleController, directive;
    PulseCircleController = function($scope) {
      'ngInject';
      this.destroyed = false;
      $scope.$watch('element', (function(_this) {
        return function() {
          var name;
          _this.circle = new pulseCircleStandalone({
            canvas: $scope.element,
            size: $scope.size,
            colors: $scope.colors,
            speed: $scope.speed
          });
          name = "pulseCircleUpdate-" + $scope.id;
          if ($scope.sceneUpdate) {
            name = "sceneUpdate-" + name;
          }
          $scope.main.addSubRoutine(name, function(delta) {
            if ($scope.active) {
              _this.circle.render(delta);
            }
            return !_this.destroyed;
          });
        };
      })(this));
      $scope.$watch('size', (function(_this) {
        return function(value) {
          if (value != null) {
            _this.circle.size = value;
          }
        };
      })(this));
      $scope.$watch('speed', (function(_this) {
        return function(value) {
          if (value != null) {
            _this.circle.speed = value;
          }
        };
      })(this));
      $scope.$watch('colors', (function(_this) {
        return function(value) {
          if (value != null) {
            _this.circle.colors = value;
          }
        };
      })(this));
      $scope.$on('$destroy', (function(_this) {
        return function(value) {
          var ref;
          _this.destroyed = true;
          if ((ref = _this.circle) != null) {
            ref.destroyed = true;
          }
        };
      })(this));
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/pulse-circle/pulse-circle.html',
      controller: PulseCircleController,
      controllerAs: "pulsecircle",
      replace: true,
      scope: {
        size: "=",
        speed: "=",
        colors: "=",
        id: "=",
        main: "=",
        active: "=",
        sceneUpdate: "="
      },
      link: function(scope, element) {
        return scope.element = element[0];
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('pulseCircleCss', function(TweenMax) {
    'ngInject';
    var PulseCircleCssController, directive;
    PulseCircleCssController = function($scope) {
      'ngInject';
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/pulse-circle/pulse-circle-css.html',
      controller: PulseCircleCssController,
      controllerAs: "pulsecircle",
      replace: true,
      link: function(scope, element) {
        return scope.element = element[0];
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('productCircle', function() {
    'ngInject';
    var ProductCircleController, directive;
    ProductCircleController = function($scope) {
      'ngInject';
      this.open = false;
      this.close = false;
      this.id = "";
      $scope.$watch('isOpen', (function(_this) {
        return function(value) {
          return _this.open = value;
        };
      })(this));
      $scope.$watch('isClose', (function(_this) {
        return function(value) {
          return _this.close = value;
        };
      })(this));
      $scope.$watch('id', (function(_this) {
        return function(value) {
          return _this.id = "product-circle-pulse-" + value;
        };
      })(this));
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/product-circle/product-circle.html',
      controller: ProductCircleController,
      controllerAs: "productcircle",
      replace: true,
      scope: {
        locale: "=",
        isOpen: "=",
        isClose: "=",
        main: "=",
        id: "="
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('pinLabel', function() {
    'ngInject';
    var PinLabelController, directive;
    PinLabelController = function($scope) {
      'ngInject';
      $scope.$watch("main.overPin.position", (function(_this) {
        return function() {
          return _this.style = {
            transform: "translate(" + $scope.main.overPin.position.x + "px," + ($scope.main.overPin.position.y - 120) + "px)"
          };
        };
      })(this));
      $scope.$watch("main.overPin.productid", (function(_this) {
        return function() {
          var ref;
          return _this.label = (ref = $scope.main.locale[$scope.main.overPin.productid]) != null ? ref.label : void 0;
        };
      })(this));
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/pin-label/pin-label.html',
      controller: PinLabelController,
      controllerAs: "pinlabel",
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('pin2d', function(TweenMax, $window, Modernizr, $timeout, $state) {
    'ngInject';
    var Pin2DController, directive;
    Pin2DController = function($scope, $rootScope) {
      'ngInject';
      this.zoomX = 0;
      this.zoomY = 0;
      this.style = {};
      this.info = {};
      this.pinSize = 64;
      this.pinSpeed = 9;
      this.state = "idle";
      this.labelopened = false;
      this.visible = true;
      this.destroyed = false;
      this.loadingImageURL = $scope.main.locale[$scope.id].loading_image;
      this.loadingInfo = $scope.main.locale[$scope.id].loading_info;
      this.productURL = _.find($scope.main.config.products, {
        id: $scope.id
      }).url;
      this.soundID = _.find($scope.main.config.products, {
        id: $scope.id
      }).sound;
      this.onMouseOver = (function(_this) {
        return function(event) {
          if (_this.state === "idle") {
            $scope.main.playSound(_this.soundID);
            TweenMax.to(_this, .5, {
              pinSize: 100
            });
          }
        };
      })(this);
      this.onMouseOut = (function(_this) {
        return function(event) {
          if (_this.state === "idle") {
            TweenMax.to(_this, .5, {
              pinSize: 64
            });
          }
        };
      })(this);
      this.getLink = function() {
        var url;
        url = _.find($scope.main.config.products, {
          id: $scope.id
        }).url;
        return "home.product({producturl:'" + url + "'})";
      };
      this.updateInfo = (function(_this) {
        return function(id) {
          _this.info = $scope.main.locale[id];
        };
      })(this);
      this.updateStyle = (function(_this) {
        return function() {
          switch (_this.state) {
            case "idle":
              if ($scope.alwaysVisible) {
                if ($scope.main.loading) {
                  _this.visible = false;
                } else {
                  if ($state.current.name === "home") {
                    _this.visible = true;
                  } else {
                    _this.visible = _this.state === "zoom" || _this.state === "showinfo";
                  }
                }
              } else {
                _this.visible = $scope.main.overPin.over && $scope.main.overPin.productid === $scope.id;
              }
              _this.applyTransform($scope.x, $scope.y);
              break;
            case "zoom":
              _this.visible = true;
              _this.applyTransform(_this.zoomX, _this.zoomY);
              break;
          }
        };
      })(this);
      this.applyTransform = (function(_this) {
        return function(x, y) {
          if (Modernizr.cssanimations) {
            _this.style.transform = _this.style.MsTransform = _this.style.MozTransform = _this.style.WebkitTransform = "translate3d(" + x + "px," + y + "px,0)";
          } else {
            _this.style.left = x + "px";
            _this.style.top = y + "px";
          }
        };
      })(this);
      this.removeListener5 = $scope.$watch("id", this.updateInfo);
      this.removeListener6 = $scope.$on('$destroy', (function(_this) {
        return function() {
          _this.destroyed = true;
          _this.removeStateChangeListener();
          _this.removeListener5();
          _this.removeListener6();
        };
      })(this));
      $scope.main.addSubRoutine("sceneUpdate-pinScopeApply-" + $scope.id, (function(_this) {
        return function(delta) {
          var wasvisible;
          wasvisible = _this.visible;
          _this.updateStyle();
          if (wasvisible || _this.visible) {
            $scope.$apply();
          }
          return !_this.destroyed;
        };
      })(this));
      this.removeStateChangeListener = $rootScope.$on('$stateChangeSuccess', (function(_this) {
        return function(event, toState, toParams, fromState, fromParams) {
          var thisProduct, thisURL;
          thisProduct = _.find($scope.main.config.products, {
            id: $scope.id
          });
          thisURL = thisProduct.url;
          if (toParams.producturl === thisURL) {
            switch (toState.name) {
              case "home.transition":
                $scope.main.playSound("click");
                _this.state = "zoom";
                $timeout(function() {
                  var horizontalPosition, transitionLength;
                  _this.labelopened = true;
                  _this.zoomX = $scope.x;
                  _this.zoomY = $scope.y;
                  transitionLength = $scope.alwaysVisible ? 5 : 5;
                  horizontalPosition = 0;
                  if (!$scope.main.platform.desktop) {
                    horizontalPosition = $window.innerWidth / 2;
                  } else {
                    switch (thisProduct.focus_position) {
                      case "left":
                        horizontalPosition = $window.innerWidth / 3;
                        break;
                      case "center":
                        horizontalPosition = $window.innerWidth / 2;
                        break;
                      case "right":
                        horizontalPosition = $window.innerWidth / 1.5;
                        break;
                    }
                  }
                  return TweenMax.to(_this, transitionLength, {
                    zoomX: horizontalPosition,
                    zoomY: $window.innerHeight / 2,
                    pinSize: 402,
                    delay: 0,
                    ease: Power4.easeInOut
                  });
                }, 0);
                break;
              case "home.product":
                _this.state = "showinfo";
                TweenMax.to(_this, .5, {
                  zoomX: $window.innerWidth / 3,
                  zoomY: $window.innerHeight / 2,
                  ease: Power4.easeInOut
                });
                break;
            }
          } else {
            TweenMax.killTweensOf(_this);
            _this.state = "idle";
            _this.labelopened = false;
            TweenMax.to(_this, .5, {
              pinSize: 64
            });
          }
        };
      })(this));
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/pin-2d/pin-2d.html',
      controller: Pin2DController,
      controllerAs: "pin2d",
      replace: true,
      scope: {
        x: "=",
        y: "=",
        id: "=",
        isVisible: "=",
        main: "=",
        alwaysVisible: "="
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('pageParticles', function($state, $window, Detector, particleShader, elasticNumber) {
    'ngInject';
    var PageParticlesController, directive;
    PageParticlesController = function($scope) {
      'ngInject';
      var particles;
      particles = 250;
      this.initialScale = 10;
      this.concentricsParticles = [];
      this.webgl = Detector.webgl;
      this.cameraX = new elasticNumber(0);
      this.cameraX.speed = 1;
      this.cameraAmplitude = 200;
      this.particleProgram = function(context) {
        context.beginPath();
        context.arc(0, 0, 0.2, 0, Math.PI * 2);
        context.fill();
      };
      $scope.onMouseMove = (function(_this) {
        return function(event) {
          var x, y;
          x = (event.clientX / $window.innerWidth) * 2 - 1;
          y = -(event.clientY / $window.innerHeight) * 2 + 1;
          _this.cameraX.target = x * _this.cameraAmplitude;
        };
      })(this);
      this.render = (function(_this) {
        return function(deltaTime) {
          var concentrics, index, j, len, ref;
          if (_this.webgl) {
            _this.material.uniforms.time.value += deltaTime;
          } else {
            ref = _this.concentricsParticles;
            for (index = j = 0, len = ref.length; j < len; index = ++j) {
              concentrics = ref[index];
              concentrics.particle.position.x = concentrics.originX + Math.sin(index + concentrics.angle) * concentrics.orbit;
              concentrics.particle.position.y = concentrics.originY + Math.cos(index + concentrics.angle) * concentrics.orbit;
              concentrics.particle.scale.x = concentrics.particle.scale.y = 1 + Math.sin(concentrics.angle * .5) * _this.initialScale;
              concentrics.angle += concentrics.speed * deltaTime;
            }
          }
          if (!$scope.main.platform.desktop) {
            _this.cameraX.target = Math.max(-1, Math.min(1, $scope.main.orientationY / 10)) * _this.cameraAmplitude;
          }
          _this.cameraX.update(deltaTime);
          _this.camera.position.x = _this.cameraX.value;
          _this.renderer.render(_this.scene, _this.camera);
          return !_this.destroyed;
        };
      })(this);
      this.setBackgroundColor = function(value) {};
      this.onResize = (function(_this) {
        return function(event) {
          _this.camera.aspect = event.width / event.height;
          _this.camera.updateProjectionMatrix();
          _this.renderer.setSize(event.width, event.height);
        };
      })(this);
      this.setParticlesColor = (function(_this) {
        return function(value) {
          if (_this.webgl) {
            _this.material.uniforms.color.value.set(value);
          } else {
            _this.material.color.set(value);
          }
        };
      })(this);
      this.destroy = (function(_this) {
        return function(value) {
          _this.destroyed = true;
          _this.removeBackgroundColorListener();
          _this.removeColorListener();
          _this.removeDestroyListener();
          _this.removeOnInitListener();
          if (_this.webgl) {
            _this.renderer.dispose();
            _this.material.program.destroy();
            _this.material.uniforms.map.value.dispose();
            _this.geometry.dispose();
          }
        };
      })(this);
      this.init = (function(_this) {
        return function() {
          var i, j, k, orbitSizes, orbitSpeeds, particle, posIndex, positions, pulseSpeeds, ref, ref1, sprite1, textureLoader;
          _this.removeOnInitListener();
          _this.camera = new THREE.PerspectiveCamera(50, $window.innerWidth / $window.innerHeight, 1, 5000);
          _this.scene = new THREE.Scene();
          _this.scene.add(_this.camera);
          if (_this.webgl) {
            _this.renderer = new THREE.WebGLRenderer({
              canvas: $scope.element,
              alpha: true
            });
          } else {
            _this.renderer = new THREE.CanvasRenderer({
              canvas: $scope.element,
              alpha: true
            });
          }
          _this.renderer.setClearColor(0x000000, 0);
          _this.renderer.setPixelRatio($window.devicePixelRatio);
          _this.renderer.setSize($window.innerWidth, $window.innerHeight);
          _this.container = new THREE.Object3D();
          _this.scene.add(_this.container);
          if (_this.webgl) {
            textureLoader = new THREE.TextureLoader();
            sprite1 = textureLoader.load("assets/models/particle1.png");
            _this.material = new THREE.ShaderMaterial({
              uniforms: THREE.UniformsUtils.clone(particleShader.uniforms),
              vertexShader: particleShader.vertexShader,
              fragmentShader: particleShader.fragmentShader,
              transparent: true
            });
            _this.material.uniforms.map.value = sprite1;
            _this.material.uniforms.size.value = _this.initialScale;
            _this.geometry = new THREE.BufferGeometry();
            positions = new Float32Array(particles * 3);
            pulseSpeeds = new Float32Array(particles);
            orbitSizes = new Float32Array(particles);
            orbitSpeeds = new Float32Array(particles);
            for (i = j = 0, ref = particles; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
              posIndex = i * 3;
              positions[posIndex] = Math.random() * 4000 - 2000;
              positions[posIndex + 1] = Math.random() * 4000 - 2000;
              positions[posIndex + 2] = -1000 - (Math.random() * 3000);
              pulseSpeeds[i] = 2 + Math.random() * 2;
              orbitSizes[i] = 15 + (Math.random() * 25);
              orbitSpeeds[i] = -4 + (Math.random() * 8);
            }
            _this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            _this.geometry.addAttribute('pulseSpeed', new THREE.BufferAttribute(pulseSpeeds, 1));
            _this.geometry.addAttribute('orbitSize', new THREE.BufferAttribute(orbitSizes, 1));
            _this.geometry.addAttribute('orbitSpeed', new THREE.BufferAttribute(orbitSpeeds, 1));
            particles = new THREE.Points(_this.geometry, _this.material);
            _this.container.add(particles);
          } else {
            _this.material = new THREE.SpriteCanvasMaterial({
              color: 0xb00ecd,
              program: _this.particleProgram
            });
            for (i = k = 0, ref1 = particles; k < ref1; i = k += 1) {
              particle = new THREE.Sprite(_this.material);
              particle.position.x = Math.random() * 4000 - 2000;
              particle.position.y = Math.random() * 4000 - 2000;
              particle.position.z = -1000 - (Math.random() * 3000);
              particle.scale.x = particle.scale.y = _this.initialScale;
              _this.concentricsParticles.push({
                originX: particle.position.x,
                originY: particle.position.y,
                angle: 0,
                speed: 2 + Math.random() * 2,
                particle: particle,
                orbit: 15 + (Math.random() * 25)
              });
              _this.container.add(particle);
            }
          }
          $scope.main.addSubRoutine("pageParticlesUpdate", _this.render);
        };
      })(this);
      this.removeOnInitListener = $scope.$watch('element', this.init);
      this.removeBackgroundColorListener = $scope.$watch('backgroundColor', this.setBackgroundColor);
      this.removeColorListener = $scope.$watch('color', this.setParticlesColor);
      this.removeDestroyListener = $scope.$on('$destroy', this.destroy);
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/page-particles/page-particles.html',
      controller: PageParticlesController,
      controllerAs: "pageparticles",
      replace: true,
      scope: {
        color: "=",
        backgroundColor: "=",
        main: "=",
        onMouseMove: "="
      },
      link: function(scope, element) {
        return scope.element = element[0];
      }
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('loadingIndicator', function($timeout, $interval) {
    'ngInject';
    var LoadingIndicatorController, directive;
    LoadingIndicatorController = function($scope, $state) {
      'ngInject';
      var cancelCheck;
      this.totalSteps = 3;
      this.step = -1;
      this.internalStep = 0;
      this.loadingStep = 0;
      this.stepTime = new Date().getTime();
      this.minSecondsPerStep = 4000;
      $timeout((function(_this) {
        return function() {
          _this.stepTime = new Date().getTime();
          _this.step = _this.internalStep;
          return $scope.main.loadingStarted = true;
        };
      })(this), 2000);
      $scope.$watch("main.loadingProgress", (function(_this) {
        return function() {
          return _this.loadingStep = Math.floor($scope.main.loadingProgress * _this.totalSteps);
        };
      })(this));
      cancelCheck = $interval((function(_this) {
        return function() {
          var now;
          now = new Date().getTime();
          if (_this.loadingStep > _this.internalStep && now - _this.stepTime > _this.minSecondsPerStep && _this.internalStep < _this.totalSteps - 1) {
            _this.stepTime = now;
            _this.internalStep++;
            _this.step = -1;
            $timeout(function() {
              return _this.step = _this.internalStep;
            }, 500);
          }
          if (($scope.main.loadingProgress === 2) && (_this.internalStep === _this.totalSteps - 1) && (now - _this.stepTime > _this.minSecondsPerStep)) {
            $interval.cancel(cancelCheck);
            $scope.main.loading = false;
            return $timeout(function() {
              $scope.main.checkViewVisibility($state.current);
            }, 1000);
          }
        };
      })(this), 100);
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/loading-indicator/loading-indicator.html',
      controller: LoadingIndicatorController,
      controllerAs: "loadingindicator",
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('languageSelector', function($state) {
    'ngInject';
    var LanguageSelectorController, directive;
    LanguageSelectorController = function($scope) {
      'ngInject';
      this.currentState = $state.current;
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/language-selector/language-selector.html',
      controller: LanguageSelectorController,
      controllerAs: "languageselector",
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('hamburgerMenu', function($state) {
    'ngInject';
    var HamburgerMenuController, directive;
    HamburgerMenuController = function($scope, $state, $rootScope) {
      'ngInject';
      this.button_label = $scope.main.locale.menu;
      this.open = false;
      this.clicked = false;
      $scope.$watch("main.menuOpen", (function(_this) {
        return function(value) {
          if ($scope.main.loading) {
            return;
          }
          console.log($state.current.name);
          if ($state.current.name === "home" || $state.current.name === "home.transition") {
            _this.button_label = value ? $scope.main.locale.close : $scope.main.locale.menu;
            _this.open = value;
            _this.clicked = value;
          }
        };
      })(this));
      this.onStateChange = (function(_this) {
        return function(event, toState, toParams, fromState, fromParams) {
          if (toState.name !== "home" && toState.name !== "home.transition") {
            _this.open = true;
            _this.clicked = false;
            _this.button_label = $scope.main.locale.close;
          } else {
            _this.open = false;
            _this.clicked = false;
            _this.button_label = $scope.main.locale.menu;
          }
        };
      })(this);
      $rootScope.$on('$stateChangeSuccess', this.onStateChange);
      this.onStateChange(null, $state.current);
      this.toggleOpen = (function(_this) {
        return function() {
          if ($state.current.name === "home" || $state.current.name === "home.transition") {
            $scope.main.menuOpen = !$scope.main.menuOpen;
            if ($scope.main.menuOpen) {
              $scope.main.playSound('generic_transition');
            } else {
              $scope.main.playSound('click');
            }
          } else {
            $scope.main.playSound('click');
            _this.open = false;
            _this.clicked = false;
            _this.button_label = $scope.main.locale.menu;
            $state.go('home');
          }
        };
      })(this);
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/hamburger-menu/hamburger-menu.html',
      controller: HamburgerMenuController,
      controllerAs: "hamburgermenu",
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('footer', function() {
    'ngInject';
    var FooterController, directive;
    FooterController = function($scope, $document, $window) {
      'ngInject';
      this.open = false;
      this.button_label = $scope.main.locale.info;
      this.onElementClick = (function(_this) {
        return function() {
          _this.toggleFooter();
          $scope.main.menuOpen = false;
        };
      })(this);
      this.toggleFooter = (function(_this) {
        return function() {
          _this.open = !_this.open;
          _this.button_label = _this.open ? $scope.main.locale.close : $scope.main.locale.info;
          $scope.main.playSound("click");
        };
      })(this);
      this.isFooter = (function(_this) {
        return function(element) {
          if ((element.className != null) && element.className.split(" ").indexOf("footer") !== -1) {
            return true;
          } else if (element.parentNode != null) {
            return _this.isFooter(element.parentNode);
          }
          return false;
        };
      })(this);
      this.closeFooter = (function(_this) {
        return function(event) {
          if (!_this.isFooter(event.target)) {
            _this.open = false;
            _this.button_label = $scope.main.locale.info;
            return $scope.$apply();
          }
        };
      })(this);
      $window.addEventListener("mouseup", this.closeFooter);
      $window.addEventListener("touchend", this.closeFooter);
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/footer/footer.html',
      controller: FooterController,
      controllerAs: "footer",
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').directive('dragToDiscover', function() {
    'ngInject';
    var DragToDiscoverController, directive;
    DragToDiscoverController = function($scope) {
      'ngInject';
    };
    return directive = {
      restrict: 'E',
      templateUrl: 'app/components/drag-to-discover/drag-to-discover.html',
      controller: DragToDiscoverController,
      controllerAs: "dragtodiscover",
      replace: true
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').controller('ShareController', function($location, $window, $scope, $stateParams) {
    'ngInject';
    $scope.main.playSound("generic_transition");
    this.locale = $stateParams.language;
    this.url = encodeURIComponent(($location.protocol()) + "://" + ($location.host()) + "/share." + this.locale + ".html");
    this.twitterText = $scope.main.locale.share_page.twitter_text;
    this.getFBLink = (function(_this) {
      return function() {
        return "https://facebook.com/sharer.php?u=" + _this.url;
      };
    })(this);
    this.getTWLink = (function(_this) {
      return function() {
        return "https://twitter.com/intent/tweet?url=" + _this.url + "&text=" + _this.twitterText;
      };
    })(this);
    this.getGLink = (function(_this) {
      return function() {
        return "https://plus.google.com/share?url=" + _this.url;
      };
    })(this);
    this.openWindow = function(url) {
      $window.open(url, "_blank", "width=640,height=400,status=no,toolbar=no,titlebar=no");
    };
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').provider('language', function() {
    'ngInject';
    this.path = '/assets/locale/';
    this.userLanguage = "en";
    this.$get = (function(_this) {
      return function($http, $state, $log, $cookies) {
        'ngInject';
        return function(code, config) {
          var cookiesLanguage, requestedLanguage, userLanguage;
          requestedLanguage = _.find(config.locales, {
            code: code
          });
          if (requestedLanguage == null) {
            cookiesLanguage = _.find(config.locales, {
              code: $cookies['campo-le-comete-language']
            });
            if (cookiesLanguage != null) {
              code = cookiesLanguage.code;
            } else {
              userLanguage = _.find(config.locales, {
                code: _this.userLanguage
              });
              if (userLanguage != null) {
                code = userLanguage.code;
              } else {
                code = _.find(config.locales, {
                  "default": true
                }).code;
              }
            }
            $state.go('home', {
              language: code
            });
            return;
          }
          return $http({
            method: 'GET',
            url: _this.path + code + '.json'
          }).then(function(response) {
            return response.data;
          }, function(response) {
            return $log.error("Language Load Error");
          });
        };
      };
    })(this);
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').provider('config', function() {
    'ngInject';
    this.path = 'assets/config.json';
    this.$get = (function(_this) {
      return function($http, $state) {
        'ngInject';
        return $http({
          method: 'GET',
          url: _this.path
        }).then(function(response) {
          return response.data;
        });
      };
    })(this);
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').controller('ProductController', function($timeout, $scope, $stateParams, md, language, config) {
    'ngInject';
    var product;
    product = _.find(config.products, {
      url: $stateParams.producturl
    });
    this.locale = language[product.id];
    this.state = "loading";
    this.destroyed = false;
    this.page_style = {};
    this.removeDestroyListener = $scope.$on('$destroy', (function(_this) {
      return function() {
        _this.destroyed = true;
        _this.removeDestroyListener();
      };
    })(this));
    $timeout((function(_this) {
      return function() {
        if (!_this.destroyed) {
          _this.state = "loaded";
          _this.page_style = {
            "background-color": _this.locale.page_color
          };
          return $timeout(function() {
            return $scope.main.playSound('generic_transition');
          }, 800);
        }
      };
    })(this), 2000);
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').controller('PrivacyController', function($scope, $timeout, md) {
    'ngInject';
    $scope.main.playSound("generic_transition");
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').controller('MainController', function($log, $timeout, md, $stateParams, $state, language, config, $rootScope, $location, $scope, $document, Modernizr, $window, FULLTILT) {
    'ngInject';
    var hidden, ref, visibilityChange;
    this.locale = language;
    this.config = config;
    this.loading = true;
    this.showSubPage = false;
    this.viewVisible = false;
    this.loadingProgress = 0;
    this.menuOpen = false;
    this.uiPins = [];
    this.sceneUpdate = true;
    this.orientationX = 0;
    this.orientationY = 0;
    this.firstDragged = true;
    this.css3dSettings = {
      tx: 25,
      rx: 5,
      ry: 10
    };
    this.overPin = {
      position: {
        x: 0,
        y: 0
      },
      productid: false,
      over: false
    };
    $rootScope.site_title = this.locale.site_title;
    $rootScope.site_description = this.locale.site_description;
    $rootScope.site_keywords = this.locale.site_keywords;
    $rootScope.site_share_image = this.locale.site_share_image;
    this.info = {
      version: "1.0.1",
      date: moment(1497445916784).fromNow(),
      ci_build: true,
      ci_commit: 'fa97fc353174abbaba8b7fbbfb3a8462c8064dc1',
      ci_author: '',
      ci_branch: 'production'
    };
    this.platform = {
      development: false,
      desktop: !md.mobile() && !md.phone() && !md.tablet(),
      mobile: md.mobile() != null,
      phone: md.phone() != null,
      tablet: md.tablet() != null,
      edge: !!/Edge\/\d+/i.test(navigator.userAgent),
      safari: md.is("Safari"),
      osx: ((ref = navigator.platform) != null ? ref.toUpperCase().indexOf('MAC') : void 0) >= 0,
      ios: md.os() === "iOS"
    };
    this.muted = this.platform.desktop ? false : true;
    this.subRoutines = [];
    this.subRoutinesNames = [];
    this.lastTime = new Date().getTime();
    this.sounds = {};
    this.onAllSoundsLoaded = function(event) {
      this.playSound("theme", -1, .06);
    };
    this.playSound = (function(_this) {
      return function(id, numLoops, volume) {
        if (numLoops == null) {
          numLoops = 0;
        }
        if (volume == null) {
          volume = 1;
        }
        if (_this.sounds[id] != null) {
          _this.sounds[id].stop();
          delete _this.sounds[id];
        }
        _this.sounds[id] = createjs.Sound.play(id, null, 0, 0, numLoops, _this.muted ? 0 : volume);
        _this.sounds[id].soundID = id;
        _this.sounds[id].defaultVolume = volume;
        _this.sounds[id].on("complete", _this.onSoundfinished, _this);
      };
    })(this);
    this.onSoundfinished = (function(_this) {
      return function(event) {
        var id;
        id = event.target.soundID;
        if (_this.sounds[id] != null) {
          _this.sounds[id].stop();
          delete _this.sounds[id];
        }
      };
    })(this);
    $scope.$watch("main.muted", (function(_this) {
      return function(value) {
        var soundID;
        if (value) {
          for (soundID in _this.sounds) {
            TweenMax.to(_this.sounds[soundID], 1, {
              volume: 0
            });
          }
        } else {
          for (soundID in _this.sounds) {
            TweenMax.to(_this.sounds[soundID], 1, {
              volume: _this.sounds[soundID].defaultVolume
            });
          }
        }
      };
    })(this));
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.on("fileload", this.onAllSoundsLoaded, this);
    createjs.Sound.registerSound("assets/sounds/theme.ogg", "theme");
    createjs.Sound.registerSound("assets/sounds/click.ogg", "click");
    createjs.Sound.registerSound("assets/sounds/generic_transition.ogg", "generic_transition");
    createjs.Sound.registerSound("assets/sounds/hover_menu.ogg", "hover_menu");
    createjs.Sound.registerSound("assets/sounds/pin_rollover_1.ogg", "pin_rollover_1");
    createjs.Sound.registerSound("assets/sounds/pin_rollover_2.ogg", "pin_rollover_2");
    createjs.Sound.registerSound("assets/sounds/pin_rollover_3.ogg", "pin_rollover_3");
    createjs.Sound.registerSound("assets/sounds/pin_rollover_4.ogg", "pin_rollover_4");
    createjs.Sound.registerSound("assets/sounds/pin_rollover_5.ogg", "pin_rollover_5");
    createjs.Sound.registerSound("assets/sounds/pin_rollover_6.ogg", "pin_rollover_6");
    if (this.platform.development && Modernizr.cssanimations) {
      this.stats = new Stats();
      $document[0].body.appendChild(this.stats.dom);
    }
    this.addSubRoutine = (function(_this) {
      return function(name, func) {
        _this.removeSubRoutine(name);
        _this.subRoutines.push(func);
        _this.subRoutinesNames.push(name);
      };
    })(this);
    this.removeSubRoutine = (function(_this) {
      return function(name) {
        var index;
        index = _this.subRoutinesNames.indexOf(name);
        if (index !== -1) {
          _this.subRoutines.splice(index, 1);
          _this.subRoutinesNames.splice(index, 1);
        }
      };
    })(this);
    this.render = (function(_this) {
      return function() {
        var i, j, k, len, len1, now, promise, ref1, ref2, rm, subRoutine, toremove;
        now = new Date().getTime();
        _this.deltaTime = (now - _this.lastTime) / 1000;
        toremove = [];
        ref1 = _this.subRoutines;
        for (i = j = 0, len = ref1.length; j < len; i = ++j) {
          subRoutine = ref1[i];
          if (_this.subRoutinesNames[i].indexOf("sceneUpdate") !== -1 && !_this.sceneUpdate) {
            continue;
          }
          if (!subRoutine(_this.deltaTime)) {
            toremove.push(subRoutine);
          }
        }
        for (k = 0, len1 = toremove.length; k < len1; k++) {
          rm = toremove[k];
          _this.removeSubRoutine(_this.subRoutinesNames[_this.subRoutines.indexOf(rm)]);
        }
        if (!_this.platform.desktop) {
          promise = new FULLTILT.getDeviceOrientation({
            'type': 'game'
          });
          promise.then(function(deviceOrientation) {
            var euler;
            euler = deviceOrientation.getScreenAdjustedEuler();
            _this.orientationX = euler.beta;
            _this.orientationY = euler.gamma;
          })["catch"](function(message) {});
        }
        _this.lastTime = now;
        if ((ref2 = _this.stats) != null) {
          ref2.update();
        }
        requestAnimationFrame(_this.render);
      };
    })(this);
    this.render();
    this.checkViewVisibility = (function(_this) {
      return function(toState) {
        _this.viewVisible = toState.name !== "home" && toState.name !== "home.transition" && !_this.loading;
      };
    })(this);
    $rootScope.$on('$stateChangeSuccess', (function(_this) {
      return function(event, toState, toParams, fromState, fromParams) {
        _this.checkViewVisibility(toState);
      };
    })(this));
    if (typeof $document[0].hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof $document[0].msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof $document[0].webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    this.handleVisibilityChange = (function(_this) {
      return function() {
        var id;
        if (document[hidden]) {
          for (id in _this.sounds) {
            _this.sounds[id].stop();
          }
          console.log("mute");
        } else {
          console.log("un-mute");
          _this.onAllSoundsLoaded();
        }
        return $timeout(function() {
          return $scope.$apply();
        }, 0);
      };
    })(this);
    if (typeof $document[0].addEventListener === "undefined" || typeof document[hidden] === "undefined") {
      console.log("This feature requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } else {
      $document[0].addEventListener(visibilityChange, this.handleVisibilityChange, false);
    }
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').controller('GalleryController', function($window, $scope, $timeout, md, $document) {
    'ngInject';
    $scope.main.playSound("generic_transition");
    this.images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    this.split = Math.round(this.images.length / 2);
    this.currentimage = 1;
    this.currentimageW = 0;
    this.imageW = 1200;
    this.imageH = 800;
    this.animated = false;
    this.scrolling = false;
    this.isMouseDown = false;
    this.mouseX = -1;
    this.posX = 0;
    this.containerstyle = {
      transform: "translate3D(50%,0,0)",
      WebkitTransform: "translate3D(50%,0,0)",
      MozTransform: "translate3D(50%,0,0)",
      MsTransform: "translate3D(50%,0,0)"
    };
    $timeout((function(_this) {
      return function() {
        return _this.animated = true;
      };
    })(this), 10);
    this.holdTimeout = null;
    this.onMouseMove = (function(_this) {
      return function($event) {
        var offsetX, px;
        if (typeof $event.stopPropagation === "function") {
          $event.stopPropagation();
        }
        if (typeof $event.preventDefault === "function") {
          $event.preventDefault();
        }
        if (_this.isMouseDown && _this.mouseX !== -1) {
          px = $event.clientX || event.touches[0].clientX;
          offsetX = (px - _this.mouseX) / 2;
          if (offsetX > _this.currentimageW) {
            offsetX = _this.currentimageW;
          }
          if (offsetX < -_this.currentimageW) {
            offsetX = -_this.currentimageW;
          }
          return _this.posX = offsetX;
        }
      };
    })(this);
    this.onScroll = (function(_this) {
      return function(event) {
        return console.log('scroll', event);
      };
    })(this);
    this.onMouseDown = (function(_this) {
      return function(event) {
        return _this.holdTimeout = $timeout(function() {
          if (!_this.isMouseDown && !_this.scrolling) {
            _this.isMouseDown = true;
            _this.mouseX = event.clientX || event.touches[0].clientX;
            return console.log(event);
          }
        }, 1);
      };
    })(this);
    this.onMouseUp = (function(_this) {
      return function(event) {
        $timeout.cancel(_this.holdTimeout);
        if (_this.isMouseDown) {
          $timeout(function() {
            if (_this.posX > 0) {
              _this.previousImage(true);
            } else if (_this.posX < 0) {
              _this.nextImage(true);
            }
            return _this.posX = 0;
          }, 1);
          return _this.isMouseDown = false;
        }
      };
    })(this);
    $window.addEventListener('mouseup', (function(_this) {
      return function() {
        return _this.onMouseUp();
      };
    })(this));
    this.onMouseWheel = (function(_this) {
      return function(event) {
        var evdeltaY;
        evdeltaY = event.deltaY || event.originalEvent.deltaY;
        if (evdeltaY && evdeltaY < 0) {
          return _this.previousImage();
        } else if (evdeltaY && evdeltaY > 0) {
          return _this.nextImage();
        }
      };
    })(this);
    this.nextImage = (function(_this) {
      return function(shortdelay) {
        if (_this.currentimage < _this.images[_this.images.length - 1]) {
          return _this.imageClick(_this.currentimage + 1, shortdelay);
        } else if (_this.currentimage === _this.images[_this.images.length - 1]) {
          return _this.imageClick(_this.images[0], shortdelay);
        }
      };
    })(this);
    this.previousImage = (function(_this) {
      return function(shortdelay) {
        if (_this.currentimage > _this.images[0]) {
          return _this.imageClick(_this.currentimage - 1, shortdelay);
        } else if (_this.currentimage === 1) {
          return _this.imageClick(_this.images[_this.images.length - 1], shortdelay);
        }
      };
    })(this);
    this.imageClick = (function(_this) {
      return function(id, shortdelay) {
        var delay;
        if (id !== _this.currentimage && !_this.scrolling) {
          _this.currentimage = id;
          _this.scrolling = true;
          delay = 1100;
          if (shortdelay) {
            delay = 500;
          }
          return $timeout(function() {
            return _this.scrolling = false;
          }, delay);
        }
      };
    })(this);
    this.getItemPosition = (function(_this) {
      return function(id) {};
    })(this);
    this.getSize = (function(_this) {
      return function(id) {
        var elscale, isFirefox, isSafari, latestPost, left, num, opac, pevent, reducedh, reducedw, scale, size;
        size = {
          w: 0,
          h: 0
        };
        left = -$window.innerWidth * 2;
        opac = 1;
        elscale = 1;
        if ($window.innerWidth < 600) {
          reducedw = $window.innerWidth * 0.87;
          reducedh = $window.innerHeight * 0.87;
          if ($window.innerWidth < $window.innerHeight) {
            reducedw = $window.innerWidth * 0.78;
            reducedh = $window.innerHeight * 0.78;
          }
        } else {
          reducedw = $window.innerWidth * 0.8;
          reducedh = $window.innerHeight * 0.8;
        }
        scale = Math.min(reducedw / _this.imageW, reducedh / _this.imageH);
        size.w = _this.imageW * scale;
        size.h = _this.imageH * scale;
        _this.currentimageW = size.w;
        pevent = 'auto';
        isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
        isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
          pevent = 'none';
        }
        if (id === _this.currentimage) {
          pevent = 'none';
          left = ($window.innerWidth - size.w) / 2;
        } else {
          elscale = 0.8;
          if (id < _this.currentimage) {
            num = _this.currentimage - id;
            left = ($window.innerWidth * 0.15) - (size.w * num);
            if (num >= _this.split) {
              latestPost = _this.images.length - _this.currentimage;
              num = latestPost + id;
              left = ($window.innerWidth * 0.85) + (size.w * (num - 1));
            }
          } else if (id > _this.currentimage) {
            num = id - _this.currentimage;
            left = ($window.innerWidth * 0.85) + (size.w * (num - 1));
            if (num >= _this.split) {
              latestPost = _this.currentimage;
              num = latestPost + ((_this.images.length - num) - 1);
              left = ($window.innerWidth * 0.15) - (size.w * num);
            }
          }
          if (num > 3) {
            opac = 0;
          }
        }
        left += _this.posX;
        left = Math.round(left);
        return {
          pointerEvents: pevent,
          width: size.w + 'px',
          height: size.h + 'px',
          opacity: opac,
          transform: "translate3D(" + left + "px,-50%,0) scale(" + elscale + ")",
          WebkitTransform: "translate3D(" + left + "px,-50%,0) scale(" + elscale + ")",
          MozTransform: "translate3D(" + left + "px,-50%,0) scale(" + elscale + ")",
          MsTransform: "translate3D(" + left + "px,-50%,0) scale(" + elscale + ")"
        };
      };
    })(this);
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').controller('ContactsController', function($scope, $timeout, md) {
    'ngInject';
    $scope.main.playSound("generic_transition");
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').controller('AboutController', function($scope, $timeout, $window, Modernizr) {
    'ngInject';
    this.selectedChapter = 0;
    this.slideshowImageWidth = 320;
    $scope.main.playSound("generic_transition");
    this.onScroll = _.throttle((function(_this) {
      return function(event) {
        var bounds, chapter, chapters, i, index, len;
        chapters = event.target.getElementsByClassName("chapter");
        for (index = i = 0, len = chapters.length; i < len; index = ++i) {
          chapter = chapters[index];
          bounds = chapter.getBoundingClientRect();
          if (bounds.top < $window.innerHeight / 2) {
            _this.selectedChapter = index;
          }
        }
      };
    })(this), 250);
    this.getImageStyle = (function(_this) {
      return function(imageIndex) {
        var left;
        left = ($window.innerWidth / 2) - (_this.slideshowImageWidth / 2);
        left -= _this.slideshowImageWidth * (_this.selectedChapter - imageIndex);
        if (Modernizr.cssanimations) {
          return {
            transform: "translateX(" + left + "px)",
            WebkitTransform: "translateX(" + left + "px)",
            MozTransform: "translateX(" + left + "px)",
            MsTransform: "translateX(" + left + "px)",
            opacity: imageIndex === _this.selectedChapter ? .6 : .1
          };
        }
        return {
          left: left + "px",
          opacity: imageIndex === _this.selectedChapter ? .6 : .1
        };
      };
    })(this);
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').run(function($log, Modernizr, md, $rootScope, $state, $location, $cookies) {
    'ngInject';
    Modernizr.addTest({
      mobile: !!md.mobile(),
      phone: !!md.phone(),
      tablet: !!md.tablet(),
      android: !!md.is('AndroidOS'),
      ios: !!md.is('iOS'),
      ipad: !!md.is('iPad'),
      iphone: !!md.is('iPhone'),
      wphone: !!md.is('WindowsPhoneOS'),
      mobilegradea: md.mobileGrade() === 'A',
      edge: !!/Edge\/\d+/i.test(navigator.userAgent),
      firefox: md.version('Gecko') > 1,
      ie: md.version("IE") > 1
    });
    Modernizr.addTest('volume', function() {
      var test;
      test = document.createElement('audio');
      test.volume = 0.5;
      return Modernizr.audio && test.volume === 0.5;
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.site_url = $location.absUrl();
      return $cookies['campo-le-comete-language'] = toParams.language;
    });
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').config(function($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider.state('home', {
      url: '/{language}',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      resolve: {
        config: function($stateParams, config) {
          return config;
        },
        language: function($state, $stateParams, language, config) {
          'ngInject';
          return language($stateParams.language, config);
        }
      }
    }).state('home.about', {
      url: '/about',
      templateUrl: 'app/about/about.html',
      controller: 'AboutController',
      controllerAs: 'about'
    }).state('home.privacy', {
      url: '/privacy-policy',
      templateUrl: 'app/privacy/privacy.html',
      controller: 'PrivacyController',
      controllerAs: 'privacy'
    }).state('home.contacts', {
      url: '/contacts',
      templateUrl: 'app/contacts/contacts.html',
      controller: 'ContactsController',
      controllerAs: 'contacts'
    }).state('home.gallery', {
      url: '/gallery',
      templateUrl: 'app/gallery/gallery.html',
      controller: 'GalleryController',
      controllerAs: 'gallery'
    }).state('home.share', {
      templateUrl: 'app/share/share.html',
      controller: 'ShareController',
      controllerAs: 'share'
    }).state('home.product', {
      url: '/{producturl}',
      templateUrl: 'app/product/product.html',
      controller: 'ProductController',
      controllerAs: 'product',
      resolve: {
        config: function($stateParams, config, $state) {
          var product;
          product = _.find(config.products, {
            url: $stateParams.producturl
          });
          if (product == null) {
            _.defer($state.go('home', {
              language: $stateParams.language
            }));
          }
          return config;
        }
      }
    }).state('home.transition', {
      url: '/{producturl}'
    });
    return $urlRouterProvider.otherwise('/');
  });

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').constant('moment', moment).constant('Modernizr', Modernizr).constant('Detector', Detector).constant('md', new MobileDetect(navigator.userAgent)).constant('TweenLite', TweenLite).constant('TweenMax', TweenMax).constant('FULLTILT', FULLTILT);

}).call(this);



(function() {
  angular.module('aquestCampoLeComete').config(function($logProvider, $locationProvider, $animateProvider, $cookiesProvider, languageProvider, configProvider, Modernizr) {
    'ngInject';
    var userLang;
    $logProvider.debugEnabled(true);
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(false);
    userLang = navigator.language || navigator.userLanguage;
    if (userLang.indexOf("-") !== -1) {
      userLang = userLang.split("-")[0];
    }
    languageProvider.userLanguage = userLang;
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
  });

}).call(this);



angular.module("aquestCampoLeComete").run(["$templateCache", function($templateCache) {$templateCache.put("app/about/about.html","<div class=about-page ng-mousemove=about.pageParticleMouseMove($event)><page-particles on-mouse-move=about.pageParticleMouseMove color=\"\'#aeb53e\'\" background-color=\"\'#2a323e\'\" main=main></page-particles><div class=slideshow><img class=image ng-repeat=\"chapter in main.locale.about_page.chapters\" ng-style=about.getImageStyle($index) ng-src={{chapter.image}}></div><div class=page-content ng-scroll=about.onScroll($event) msd-wheel=autoscroller.onMouseWheel($event) auto-scroller><h1 css3d-rotation-effect class=title>{{main.locale.about_page.title}}</h1><div class=chapter ng-repeat=\"chapter in main.locale.about_page.chapters\"><h2 class=chapter-title ng-bind-html=\"chapter.title | wordseparation\"></h2><p class=chapter-subtitle ng-bind-html=\"chapter.subtitle | wordseparation\"></p><p class=chapter-text ng-bind-html=\"chapter.text | wordseparation\"></p></div><p id=end></p></div><div class=\"fader top\"></div><div class=\"fader bottom\"></div></div>");
$templateCache.put("app/contacts/contacts.html","<div class=contacts-page ng-mousemove=contacts.pageParticleMouseMove($event)><page-particles on-mouse-move=contacts.pageParticleMouseMove color=\"\'#aeb53e\'\" background-color=\"\'#2a323e\'\" main=main></page-particles><div class=page-content><h1 css3d-rotation-effect class=title>{{main.locale.contacts_page.title}}</h1><h2 class=subtitle>{{main.locale.contacts_page.subtitle}}</h2><a ng-href=\"{{\'mailto:\'+main.locale.contacts_page.email}}\" class=email>{{main.locale.contacts_page.email}}</a><p class=address>{{main.locale.contacts_page.address}}</p><div class=numbers><span>{{main.locale.contacts_page.number1}}</span> <span>{{main.locale.contacts_page.number2}}</span></div><a href=\"https://www.google.it/maps/place/Campo+alle+Comete+-+Feudi+Toscana+Soc.+Agricola+a+r.+l./@43.173044,10.604627,15z/data=!4m5!3m4!1s0x0:0x21d5f0e2cbd38300!8m2!3d43.173044!4d10.604627\" target=_blank class=maps-button>{{main.locale.contacts_page.maps_label}}</a><p class=gps>GPS. N 43.173044 &nbsp; &nbsp; &nbsp; E 10.604627</p></div></div>");
$templateCache.put("app/gallery/gallery.html","<div class=gallery-page ng-mousemove=gallery.pageParticleMouseMove($event);gallery.onMouseMove($event) ng-mousedown=gallery.onMouseDown($event) ng-touchstart=gallery.onMouseDown($event) ng-touchend=gallery.onMouseUp($event) ng-touchmove=gallery.onMouseMove($event) ng-scroll=gallery.onScroll($event) msd-wheel=\"gallery.onMouseWheel($event, $delta, $deltaX, $deltaY)\"><page-particles on-mouse-move=gallery.pageParticleMouseMove color=\"\'#aeb53e\'\" background-color=\"\'#2a323e\'\" main=main></page-particles><div class=\"page-content ng-animate-disabled\" ng-class=\"{\'animated\':gallery.animated, \'scrolling\':gallery.isMouseDown}\"><div class=gallery-background></div><div ng-repeat=\"i in gallery.images track by $index\" ng-class=\"{\'selected\': (i) == gallery.currentimage,\n          \'next\': (i) == gallery.currentimage + 1,\n          \'next-next\': (i) == gallery.currentimage + 2,\n          \'previous\': (i) == gallery.currentimage - 1,\n          \'previous-previous\': (i) == gallery.currentimage - 2 }\" class=\"gallery-item ng-animate-disabled\" id=gallery-image-{{i}} ng-style=gallery.getSize(i) ng-click=gallery.imageClick(i)><img draggable=false ng-src=assets/images/gallery/{{i}}.jpg></div></div></div>");
$templateCache.put("app/main/main.html","<div class=main-container ng-class={cursorpointer:main.overPin.over}><webgl-detector><scene-2d ng-if=!webgldetector.supportsWebGL></scene-2d><div ng-if=webgldetector.supportsWebGL><scene-3d></scene-3d></div><drag-to-discover css3d-rotation-effect ng-if=\"webgldetector.supportsWebGL && !main.loading && !main.firstDragged\"></drag-to-discover><pin-2d always-visible=!webgldetector.supportsWebGL ng-repeat=\"item in main.uiPins\" is-visible=item.visible x=item.x y=item.y id=item.id main=main></pin-2d></webgl-detector><a class=logo ng-if=main.loadingStarted></a><div ui-view class=view-container ng-if=main.viewVisible ng-animate-children></div><site-menu></site-menu><hamburger-menu></hamburger-menu><footer ng-if=!main.loading></footer><share-volume-menu ng-if=!main.loading></share-volume-menu><loading-indicator ng-if=main.loading></loading-indicator><version-info ng-if=main.platform.development info=main.info></version-info></div>");
$templateCache.put("app/product/product.html","<div class=product-page ng-mousemove=product.onParticlesMouseMove($event) ng-style=product.page_style><page-particles ng-show=\"product.state == \'loaded\'\" color=product.locale.particles_color background-color=product.locale.page_color on-mouse-move=product.onParticlesMouseMove main=main></page-particles><div class=product-description ng-show=\"product.state == \'loaded\'\" scroll-controller ng-scroll=scrollcontroller.onScroll($event)><div class=right-side><h1 css3d-rotation-effect class=ng-animate-disabled ng-class=\"{\'intro\': !scrollcontroller.hasScrolled}\">{{product.locale.label}}</h1><p class=description ng-show=!scrollcontroller.hasScrolled ng-bind-html=\"product.locale.description | truncate:15 | wordseparation:true:1.5:.06\"></p><p class=description ng-show=scrollcontroller.hasScrolled ng-bind-html=\"product.locale.description | wordseparation\"></p><div class=scroll-to-discover ng-click=scrollcontroller.gotoParagraph(0) ng-show=!scrollcontroller.hasScrolled><span>{{main.locale.scroll_to_discover}}</span><div class=\"curved-line curved-line1\"></div><div class=\"curved-line curved-line2\"></div><div class=\"curved-line curved-line3\"></div></div><div class=scroll-placeholder ng-show=!scrollcontroller.hasScrolled></div><div ng-show=scrollcontroller.hasScrolled ng-repeat=\"paragraph in product.locale.paragraphs\" class=paragraph><h2>{{paragraph.title}}</h2><p>{{paragraph.text}}</p></div><div class=\"download download-mobile\"><a target=_blank ng-href={{product.locale.filedownload}}>{{main.locale.download}}</a></div><div class=scroll-up ng-click=scrollcontroller.gotoTop()><span>{{main.locale.scroll_up}}</span><div class=\"curved-line curved-line1\"></div><div class=\"curved-line curved-line2\"></div><div class=\"curved-line curved-line3\"></div></div></div><div class=left-side><img class=\"wine-big ng-animate-disabled\" ng-class=\"{\'intro\': !scrollcontroller.hasScrolled}\" ng-src={{product.locale.image}}><div class=download ng-mouseenter=\"main.playSound(\'hover_menu\')\"><a ng-href={{product.locale.filedownload}} target=_blank>{{main.locale.download}}</a></div><ul class=chapter-selector><li ng-class=\"{selected: $index == scrollcontroller.selectedChapter, first: $index == 0, last: $index == (product.locale.paragraphs.length - 1)}\" ng-repeat=\"paragraph in product.locale.paragraphs\" ng-click=scrollcontroller.gotoParagraph($index) class=chapter-selector-item><span>{{paragraph.title}}</span></li></ul></div></div></div>");
$templateCache.put("app/privacy/privacy.html","<div class=privacy-policy-page ng-mousemove=privacy.pageParticleMouseMove($event)><page-particles on-mouse-move=privacy.pageParticleMouseMove color=\"\'#aeb53e\'\" background-color=\"\'#2a323e\'\" main=main></page-particles><div class=page-content><h1 css3d-rotation-effect class=title>{{main.locale.privacy_page.title}}</h1><div class=chapter ng-repeat=\"chapter in main.locale.privacy_page.chapters\"><h2 class=chapter-title ng-bind-html=chapter.title></h2><p class=chapter-text ng-bind-html=chapter.text></p></div></div><div class=\"fader top\"></div><div class=\"fader bottom\"></div></div>");
$templateCache.put("app/share/share.html","<div class=share-page ng-mousemove=share.pageParticleMouseMove($event)><page-particles on-mouse-move=share.pageParticleMouseMove color=\"\'#aeb53e\'\" background-color=\"\'#2a323e\'\" main=main></page-particles><div class=page-content><h1 class=title>{{main.locale.share_page.title}}</h1><div class=buttons><div class=\"button facebook\" ng-mouseenter=\"main.playSound(\'hover_menu\')\" ng-click=share.openWindow(share.getFBLink())>{{main.locale.share_page.facebook}}</div><div class=\"button twitter\" ng-mouseenter=\"main.playSound(\'hover_menu\')\" ng-click=share.openWindow(share.getTWLink())>{{main.locale.share_page.twitter}}</div><div class=\"button google\" ng-mouseenter=\"main.playSound(\'hover_menu\')\" ng-click=share.openWindow(share.getGLink())>{{main.locale.share_page.google}}</div></div></div></div>");
$templateCache.put("app/components/drag-to-discover/drag-to-discover.html","<div class=drag-to-discover><div class=arrowleft></div><div class=points><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div><div class=point></div></div><div class=arrowright></div><div class=cursor></div><div class=label>{{main.locale.drag_to_discover}}</div></div>");
$templateCache.put("app/components/footer/footer.html","<div class=footer><div ng-show=footer.open class=footer-content ng-animate-children><ul class=footer-menu ng-if=footer.open><li><a ui-sref=home.gallery ng-click=footer.onElementClick()>{{main.locale.footer_gallery}}</a></li><li><a ui-sref=home.contacts ng-click=footer.onElementClick()>{{main.locale.footer_contatti}}</a></li><li><a href=\"https://www.google.it/maps/place/Campo+alle+Comete+-+Feudi+Toscana+Soc.+Agricola+a+r.+l./@43.173044,10.604627,15z/data=!4m5!3m4!1s0x0:0x21d5f0e2cbd38300!8m2!3d43.173044!4d10.604627\" target=_blank>{{main.locale.footer_where}}</a></li><li><a ui-sref=home.privacy ng-click=footer.onElementClick()>{{main.locale.footer_privacy}}</a></li><li><a href=https://www.aquest.it/ target=_blank>{{main.locale.footer_credits}}</a></li></ul><div class=bottom ng-if=footer.open><p class=footer-piva>{{main.locale.footer_piva}}</p><p class=footer-copyright>{{main.locale.footer_copyright}}</p></div></div><div class=open-close-button ng-click=footer.toggleFooter($event) ng-mouseenter=\"main.playSound(\'hover_menu\')\"><div class=plusbutton><div class=plus-horizontal></div><div class=plus-vertical ng-if=!footer.open></div></div><span class=button-label ng-class=\"{\'close\': footer.open}\">{{footer.button_label}}</span></div></div>");
$templateCache.put("app/components/hamburger-menu/hamburger-menu.html","<div class=hamburger-menu ng-if=!main.loading ng-click=hamburgermenu.toggleOpen($event) ng-class=\"{\'open\': hamburgermenu.open}\" ng-mouseenter=\"main.playSound(\'hover_menu\')\"><div class=hamburger ng-class=\"{\'clicked\': hamburgermenu.clicked}\"><div class=lines-container ng-if=!hamburgermenu.open><div class=hamburger-line></div><div class=hamburger-line></div><div class=hamburger-line></div></div><div class=x-container ng-if=hamburgermenu.open><div class=hamburger-x>&#10005;</div></div></div><span class=button-label ng-class=\"{\'open\': hamburgermenu.open}\">{{hamburgermenu.button_label}}</span></div>");
$templateCache.put("app/components/language-selector/language-selector.html","<ul class=language-selector><li ng-repeat=\"item in main.config.locales\"><a ui-sref-active=active ui-sref={language:item.code}>{{item.label}}</a></li></ul>");
$templateCache.put("app/components/loading-indicator/loading-indicator.html","<div class=loading-indicator><div class=centered-container ng-switch=loadingindicator.step><div class=text-container ng-switch-when=0><p ng-bind-html=\"main.locale.loading_line1 | wordseparation:true:.5:.1\"></p></div><div class=text-container ng-switch-when=1><p ng-bind-html=\"main.locale.loading_line2 | wordseparation:true:.5:.1\"></p></div><div class=text-container ng-switch-when=2><p ng-bind-html=\"main.locale.loading_line3 | wordseparation:true:.5:.1\"></p></div></div></div>");
$templateCache.put("app/components/page-particles/page-particles.html","<canvas class=page-particles ng-resize=pageparticles.onResize($event)></canvas>");
$templateCache.put("app/components/pin-2d/pin-2d.html","<div class=pin-2d ng-style=pin2d.style ng-if=pin2d.visible ng-animate-children><a ui-sref={{pin2d.getLink()}} ng-mouseover=pin2d.onMouseOver($event) ng-mouseout=pin2d.onMouseOut($event) ng-style=\"{\'margin-left\': -pin2d.pinSize/2+\'px\', \'margin-top\': -pin2d.pinSize/2+\'px\', \'width\': pin2d.pinSize+\'px\', \'height\': pin2d.pinSize+\'px\'}\"><!-- <pulse-circle-css ng-class=\"{\'closed\':pin2d.state == \'idle\', \'opened\':pin2d.state == \'zoom\', \'expanded\': pin2d.state == \'showinfo\'}\"></pulse-circle-css> --><pulse-circle main=main id=id size=pin2d.pinSize speed=pin2d.pinSpeed active=\"alwaysVisible || pin2d.state == \'zoom\' || pin2d.state == \'showinfo\'\" ng-if=\"alwaysVisible || pin2d.state == \'zoom\' || pin2d.state == \'showinfo\'\" scene-update=true></pulse-circle><div class=product-info ng-if=\"pin2d.state == \'showinfo\'\"><div class=\"circle circle2\"></div><div class=\"circle circle1\"></div><img ng-src={{pin2d.loadingImageURL}}><p class=loading-info>{{pin2d.loadingInfo}}</p><p class=loading-copy>{{main.locale.loading}}</p></div></a><span class=label ng-class=\"{\'opened\':pin2d.labelopened}\">{{pin2d.info.label}}</span></div>");
$templateCache.put("app/components/pin-label/pin-label.html","<div class=pin-label ng-style=pinlabel.style><span class=label>{{pinlabel.label}}</span><div class=white-dots><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div><div class=white-dot></div></div></div>");
$templateCache.put("app/components/product-circle/product-circle.html","<div class=product-circle ng-class={open:productcircle.open,close:productcircle.close}><pulse-circle main=main ng-show=!productcircle.close size=402 speed=12 active=!productcircle.close id=productcircle.id></pulse-circle><div class=\"circle circle2\"></div><div class=\"circle circle1\"></div><div class=product-image><img ng-if=main.platform.desktop ng-src={{locale.loading_image}}><img ng-if=!main.platform.desktop ng-src={{locale.loading_image_mobile}}></div></div>");
$templateCache.put("app/components/pulse-circle/pulse-circle-css.html","<div class=pulse-circle-css><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div><div class=pulse-circle-element></div></div>");
$templateCache.put("app/components/pulse-circle/pulse-circle.html","<canvas class=pulse-circle ng-style=\"{\'width\': size+\'px\', \'height\': size+\'px\'}\"></canvas>");
$templateCache.put("app/components/scene-2d/scene-2d.html","<div class=\"scene-2d scene\" ng-resize=scene2d.onResize()><div class=loading-screen ng-if=main.loading></div><div class=main-screen ng-if=!main.loading><div class=main-screen-world></div></div></div>");
$templateCache.put("app/components/scene-3d/scene-3d.html","<canvas ng-show=scene3d.scene.skyboxLoaded class=\"scene-3d scene\" msd-wheel=scene3d.scene.onMouseWheel($event) ng-resize=scene3d.scene.onResize($event)></canvas>");
$templateCache.put("app/components/share-volume-menu/share-volume-menu.html","<div class=share-volume-menu><object ng-if=\"sharevolume.locale == \'en\' || sharevolume.locale == \'de\'\" class=logo-ce data=assets/images/logo-comunita-europea.svg type=image/svg+xml></object><a class=share ui-sref=home.share ng-mouseenter=\"main.playSound(\'hover_menu\')\"></a> <button class=volume ng-mouseenter=\"main.playSound(\'hover_menu\')\" ng-class=\"{\'disabled\': main.muted}\" ng-click=\"main.muted = !main.muted\"><div class=line></div><div class=line></div><div class=line></div><div class=line></div></button></div>");
$templateCache.put("app/components/site-menu/site-menu.html","<div class=site-menu ng-if=main.menuOpen msd-wheel=\"sitemenu.onMouseWheel($event, $delta, $deltaX, $deltaY)\" ng-style=\"{\'background-color\': main.locale[main.config.products[sitemenu.selected].id].page_color}\" ng-swipe-up=sitemenu.scrollDown() ng-swipe-down=sitemenu.scrollUp() ng-mousemove=sitemenu.onParticlesMouseMove($event) ng-animate-children><page-particles color=sitemenu.getParticlesColor() background-color=main.locale[main.config.products[sitemenu.selected].id].page_color on-mouse-move=sitemenu.onParticlesMouseMove main=main></page-particles><ul class=labels ng-style=sitemenu.getLabelsTop() ng-if=main.menuOpen><li class=element ng-repeat=\"product in main.config.products\" ng-style=sitemenu.getLabelStyle($index) ng-class=\"{selected: $index == sitemenu.selected, upper: $index == sitemenu.selected - 1, lower: $index == sitemenu.selected + 1, \'upper-hidden\': $index < sitemenu.selected - 1, \'lower-hidden\': $index > sitemenu.selected + 1}\"><a ng-click=\"sitemenu.onItemClick($index,\'home.product\',product)\" class=\"label noPreventDefault\" ng-touchmove=sitemenu.preventDefault($event)>{{main.locale[product.id].label}}</a></li><!-- about item --><li class=element ng-style=sitemenu.getLabelStyle(main.config.products.length) ng-class=\"{selected: sitemenu.selected == main.config.products.length, lower: sitemenu.selected == main.config.products.length - 1, \'lower-hidden\': sitemenu.selected < main.config.products.length - 1}\"><a ng-click=\"sitemenu.onItemClick(main.config.products.length,\'home.about\')\" class=\"label noPreventDefault\" ng-touchmove=sitemenu.preventDefault($event)>{{main.locale.about}}</a></li></ul><ul class=images ng-if=main.menuOpen><li class=element ng-repeat=\"product in main.config.products\" ng-class=\"{selected: $index == sitemenu.selected, upper: $index == sitemenu.selected - 1, lower: $index == sitemenu.selected + 1, \'upper-hidden\': $index < sitemenu.selected - 1, \'lower-hidden\': $index > sitemenu.selected + 1}\"><a class=noPreventDefault ng-touchmove=sitemenu.preventDefault($event) ng-click=\"sitemenu.onItemClick($index,\'home.product\',product)\" ng-mouseenter=sitemenu.onImageHover($event,$index)><product-circle id=product.id main=main locale=main.locale[product.id] is-close=\"$index != sitemenu.selected\"></product-circle><div class=enter-label><p>{{main.locale.enter}}</p><div class=\"curved-line curved-line1\"></div><div class=\"curved-line curved-line2\"></div><div class=\"curved-line curved-line3\"></div></div></a></li><!-- about item --><li class=element ng-class=\"{selected: sitemenu.selected == main.config.products.length, lower: sitemenu.selected == main.config.products.length - 1, \'lower-hidden\': sitemenu.selected < main.config.products.length - 1}\"><a class=noPreventDefault ng-touchmove=sitemenu.preventDefault($event) ng-click=\"sitemenu.onItemClick(main.config.products.length,\'home.about\')\" ng-mouseenter=sitemenu.onImageHover($event,main.config.products.length)><product-circle id=product.id main=main locale=\"{\'loading_image\':\'assets/images/product_about.png\',\'loading_image_mobile\':\'assets/images/product_about-low.png\'}\" is-close=\"sitemenu.selected != main.config.products.length\"></product-circle><div class=enter-label><p>{{main.locale.enter}}</p><div class=\"curved-line curved-line1\"></div><div class=\"curved-line curved-line2\"></div><div class=\"curved-line curved-line3\"></div></div></a></li></ul><language-selector class=noPreventDefault></language-selector></div>");
$templateCache.put("app/components/version-info/version-info.html","<div class=version-info><span ng-if=!info.ci_build>v{{info.version}}+local built {{info.date}}</span> <span ng-if=info.ci_build>v{{info.version}}+git{{info.ci_commit}} built {{info.date}} by {{info.ci_author}} on {{info.ci_branch}}</span></div>");
$templateCache.put("app/components/webgl-detector/webgl-detector.html","<div class=webgl-detector ng-transclude></div>");}]);
