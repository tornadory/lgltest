// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function() {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// Place any jQuery/helper plugins in here.

/*global jQuery */
/*!
 * Lettering.JS 0.6.1
 *
 * Copyright 2010, Dave Rupert http://daverupert.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Thanks to Paul Irish - http://paulirish.com - for the feedback.
 *
 * Date: Mon Sep 20 17:14:00 2010 -0600
 */
(function($) {
  function injector(t, splitter, klass, after) {
    var text = t.text(),
      a = text.split(splitter),
      inject = '';
    if (a.length) {
      $(a).each(function(i, item) {
        inject += '<span class="' + klass + (i + 1) + '" aria-hidden="true">' + item + '</span>' + after;
      });
      t.attr('aria-label', text)
        .empty()
        .append(inject)

    }
  }

  var methods = {
    init: function() {

      return this.each(function() {
        injector($(this), '', 'char', '');
      });

    },

    words: function() {

      return this.each(function() {
        injector($(this), ' ', 'word', ' ');
      });

    },

    lines: function() {

      return this.each(function() {
        var r = "eefec303079ad17405c889e092e105b0";
        // Because it's hard to split a <br/> tag consistently across browsers,
        // (*ahem* IE *ahem*), we replace all <br/> instances with an md5 hash
        // (of the word "split").  If you're trying to use this plugin on that
        // md5 hash string, it will fail because you're being ridiculous.
        injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
      });

    }
  };

  $.fn.lettering = function(method) {
    // Method calling logic
    if (method && methods[method]) {
      return methods[method].apply(this, [].slice.call(arguments, 1));
    } else if (method === 'letters' || !method) {
      return methods.init.apply(this, [].slice.call(arguments, 0)); // always pass an array
    }
    $.error('Method ' + method + ' does not exist on jQuery.lettering');
    return this;
  };

})(jQuery);

/*global jQuery */
/*!
 * FitText.js 1.1
 *
 * Copyright 2011, Dave Rupert http://daverupert.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Thu May 05 14:23:00 2011 -0600
 */

(function($) {

  $.fn.fitText = function(kompressor, options) {

    // Setup options
    var compressor = kompressor || 1,
      settings = $.extend({
        'minFontSize': Number.NEGATIVE_INFINITY,
        'maxFontSize': Number.POSITIVE_INFINITY
      }, options);

    return this.each(function() {

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function() {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize', resizer);

    });

  };

})(jQuery);
/*
 * CircleType 0.36
 * Peter Hrynkow
 * Copyright 2014, Licensed GPL & MIT
 *
 */

$.fn.circleType = function(options) {

  var self = this,
    settings = {
      dir: 1,
      position: 'relative',
    };
  if (typeof($.fn.lettering) !== 'function') {
    console.log('Lettering.js is required');
    return;
  }
  return this.each(function() {

    if (options) {
      $.extend(settings, options);
    }
    var elem = this,
      delta = (180 / Math.PI),
      fs = parseInt($(elem).css('font-size'), 10),
      ch = parseInt($(elem).css('line-height'), 10) || fs,
      txt = elem.innerHTML.replace(/^\s+|\s+$/g, '').replace(/\s/g, '&nbsp;'),
      letters,
      center;

    elem.innerHTML = txt
    $(elem).lettering();

    elem.style.position = settings.position;

    letters = elem.getElementsByTagName('span');
    center = Math.floor(letters.length / 2)

    var layout = function() {
      var tw = 0,
        i,
        offset = 0,
        minRadius,
        origin,
        innerRadius,
        l, style, r, transform;

      for (i = 0; i < letters.length; i++) {
        tw += letters[i].offsetWidth;
      }
      minRadius = (tw / Math.PI) / 2 + ch;

      if (settings.fluid && !settings.fitText) {
        settings.radius = Math.max(elem.offsetWidth / 2, minRadius);
      } else if (!settings.radius) {
        settings.radius = minRadius;
      }

      if (settings.dir === -1) {
        origin = 'center ' + (-settings.radius + ch) / fs + 'em';
      } else {
        origin = 'center ' + settings.radius / fs + 'em';
      }

      innerRadius = settings.radius - ch;

      for (i = 0; i < letters.length; i++) {
        l = letters[i];
        offset += l.offsetWidth / 2 / innerRadius * delta;
        l.rot = offset;
        offset += l.offsetWidth / 2 / innerRadius * delta;
      }
      for (i = 0; i < letters.length; i++) {
        l = letters[i]
        style = l.style
        r = (-offset * settings.dir / 2) + l.rot * settings.dir
        transform = 'rotate(' + r + 'deg)';

        style.position = 'absolute';
        style.left = '50%';
        style.marginLeft = -(l.offsetWidth / 2) / fs + 'em';

        style.webkitTransform = transform;
        style.MozTransform = transform;
        style.OTransform = transform;
        style.msTransform = transform;
        style.transform = transform;

        style.webkitTransformOrigin = origin;
        style.MozTransformOrigin = origin;
        style.OTransformOrigin = origin;
        style.msTransformOrigin = origin;
        style.transformOrigin = origin;
        if (settings.dir === -1) {
          style.bottom = 0;
        }
      }

      if (settings.fitText) {
        if (typeof($.fn.fitText) !== 'function') {
          console.log('FitText.js is required when using the fitText option');
        } else {
          $(elem).fitText();
          $(window).resize(function() {
            updateHeight();
          });
        }
      }
      updateHeight();

      if (typeof settings.callback === 'function') {
        // Execute our callback with the element we transformed as `this`
        settings.callback.apply(elem);
      }
    };

    var getBounds = function(elem) {
      var docElem = document.documentElement,
        box = elem.getBoundingClientRect();
      return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft,
        height: box.height
      };
    };

    var updateHeight = function() {
      var mid = getBounds(letters[center]),
        first = getBounds(letters[0]),
        h;
      if (mid.top < first.top) {
        h = first.top - mid.top + first.height;
      } else {
        h = mid.top - first.top + first.height;
      }
      elem.style.height = h + 'px';
    }

    if (settings.fluid && !settings.fitText) {
      $(window).resize(function() {
        layout();
      });
    }

    if (document.readyState !== "complete") {
      elem.style.visibility = 'hidden';
      $(window).load(function() {
        elem.style.visibility = 'visible';
        layout();
      });
    } else {
      layout();
    }
  });
};;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory(require("jquery"));
    } else {
      factory(jQuery);
    }
  }
  (function($) {
    var pluginName = "tinycircleslider",
      defaults = {
        interval: false,
        intervalTime: 3500,
        dotsSnap: false,
        dotsHide: true,
        radius: 140,
        start: 0,
        slides: []
      };

    function Plugin($container, options) {
      /**
       * The options of the carousel extend with the defaults.
       *
       * @property options
       * @type Object
       * @default defaults
       */
      this.options = $.extend({}, defaults, options);

      /**
       * @property _defaults
       * @type Object
       * @private
       * @default defaults
       */
      this._defaults = defaults;

      /**
       * @property _name
       * @type String
       * @private
       * @final
       * @default 'tinycircleslider'
       */
      this._name = pluginName;

      var self = this,
        $viewport = $container.find(".viewport"),
        $overview = $container.find(".overview"),
        $slides = $overview.children(),
        $thumb = $container.find(".thumb"),
        $dots = $container.find(".dot"),
        $links = $slides.find("a")

      , containerSize = {
        width: $container.outerWidth(true),
        height: $container.outerHeight(true)
      }, slideSize = {
        width: $slides.first().outerWidth(true),
        height: $slides.first().outerHeight(true)
      }, thumbSize = {
        width: $thumb.outerWidth(true),
        height: $thumb.outerHeight(true)
      }, dotSize = {
        width: $dots.outerWidth(),
        height: $dots.outerHeight()
      }

      , intervalTimer = null, animationTimer = null, touchEvents = 'ontouchstart' in window, isTouchEvent = false, hasRequestAnimationFrame = 'requestAnimationFrame' in window;

      /**
       * When dotsSnap is enabled every slide has a corresponding dot.
       *
       * @property dots
       * @type Array
       * @default []
       */
      this.dots = [];

      /**
       * The index of the current slide.
       *
       * @property slideCurrent
       * @type Number
       * @default 0
       */
      this.slideCurrent = 0;

      /**
       * The current angle in degrees
       *
       * @property angleCurrent
       * @type Number
       * @default 0
       */
      this.angleCurrent = 0;

      /**
       * The number of slides the slider is currently aware of.
       *
       * @property slidesTotal
       * @type Number
       * @default 0
       */
      this.slidesTotal = $slides.length;

      /**
       * If the interval is running the value will be true.
       *
       * @property intervalActive
       * @type Boolean
       * @default false
       */
      this.intervalActive = false;

      /**
       * @method _initialize
       * @private
       */
      function _initialize() {
        _setDots();

        $overview
          .append($slides.first().clone())
          .css("width", slideSize.width * ($slides.length + 1));

        _setEvents();

        _setCSS(0);
        self.move(self.options.start, self.options.interval);

        return self;
      }

      /**
       * @method _setEvents
       * @private
       */
      function _setEvents() {
        if (touchEvents) {
          $container[0].ontouchstart = _startDrag;
          $container[0].ontouchmove = _drag;
          $container[0].ontouchend = _endDrag;
        }

        $thumb.bind("mousedown", _startDrag);

        var snapHandler = function(event) {
          event.preventDefault();
          event.stopImmediatePropagation();

          self.stop();
          self.move($(this).attr("data-slide-index"));

          return false;
        };

        if (touchEvents) {
          $container.delegate(".dot", "touchstart", snapHandler);
        }
        $container.delegate(".dot", "mousedown", snapHandler);
      }

      /**
       * @method _setTimer
       * @private
       */
      function _setTimer(slideFirst) {
        intervalTimer = setTimeout(function() {
          self.move(self.slideCurrent + 1, true);
        }, (slideFirst ? 50 : self.options.intervalTime));
      }

      /**
       * @method _toRadians
       * @private
       * @param {Number} [degrees]
       */
      function _toRadians(degrees) {
        return degrees * (Math.PI / 180);
      }

      /**
       * @method _toDegrees
       * @private
       * @param {Number} [radians]
       */
      function _toDegrees(radians) {
        return radians * 180 / Math.PI;
      }

      /**
       * @method _setDots
       * @private
       */
      function _setDots() {
        var docFragment = document.createDocumentFragment();

        $dots.remove();

        $slides.each(function(index, slide) {
          var $dotClone = null,
            angle = parseInt($(slide).attr("data-degrees"), 10) || (index * 360 / self.slidesTotal),
            position = {
              top: -Math.cos(_toRadians(angle)) * self.options.radius + containerSize.height / 2 - dotSize.height / 2,
              left: Math.sin(_toRadians(angle)) * self.options.radius + containerSize.width / 2 - dotSize.width / 2
            };

          if ($dots.length > 0) {
            $dotClone = $dots.clone();
            $dotClone
              .addClass($(slide).attr("data-classname"))
              .css(position);

            docFragment.appendChild($dotClone[0]);
          }

          self.dots.push({
            "angle": angle,
            "slide": slide,
            "dot": $dotClone
          });
        });

        self.dots.sort(function(dotA, dotB) {
          return dotA.angle - dotB.angle;
        });

        $.each(self.dots, function(index, dot) {
          // custom
          if ($(dot.dot).length > 0) {
            if (index === 4) {
              $(dot.dot)
                .addClass("dot-" + (index + 1))
                .attr('data-slide-index', index)
                .html("<h1><div class='flip text'>" + options.slides[index] + "</div><div class='flip-curve curve'>&nbsp;</div></h1>");
            } else {
              $(dot.dot)
                .addClass("dot-" + (index + 1))
                .attr('data-slide-index', index)
                .html("<h1><div class='text'>" + options.slides[index] + "</div></h1>");
            }
          }

        });

        $container.append(docFragment);
        // custom
        $('h1').each(function(i, text) {
          if ($(this).find('div').html() === "Norway") {
            $(this).find('div.text').circleType({
              radius: 220,
              dir: -1
            });
          } else {
            $(this).find('div.text').circleType({
              radius: 220
            });
          }
        });

        $dots = $container.find(".dot");
      }

      /**
       * If the interval is stopped start it.
       *
       * @method start
       * @chainable
       */
      this.start = function(first) {
        if (self.options.interval) {
          self.intervalActive = true;

          _setTimer(first);
        }
        return self;
      };

      /**
       * If the interval is running stop it.
       *
       * @method stop
       * @chainable
       */
      this.stop = function() {
        self.intervalActive = false;

        clearTimeout(intervalTimer);

        return self;
      };

      /**
       * @method _findShortestPath
       * @private
       * @param {Number} [angleA]
       * @param {Number} [angleB]
       */
      function _findShortestPath(angleA, angleB) {
        var angleCW, angleCCW, angleShortest;

        if (angleA > angleB) {
          angleCW = angleA - angleB;
          angleCCW = -(angleB + 360 - angleA);
        } else {
          angleCW = angleA + 360 - angleB;
          angleCCW = -(angleB - angleA);
        }

        angleShortest = angleCW < Math.abs(angleCCW) ? angleCW : angleCCW;

        return [angleShortest, angleCCW, angleCW];
      }

      /**
       * @method _findClosestSlide
       * @private
       * @param {Number} [angle]
       */
      function _findClosestSlide(angle) {
        var closestDotAngleToAngleCCW = 9999,
          closestDotAngleToAngleCW = 9999,
          closestDotAngleToAngle = 9999,
          closestSlideCCW = 0,
          closestSlideCW = 0,
          closestSlide = 0;

        $.each(self.dots, function(index, dot) {
          var delta = _findShortestPath(dot.angle, angle);

          if (Math.abs(delta[0]) < Math.abs(closestDotAngleToAngle)) {
            closestDotAngleToAngle = delta[0];
            closestSlide = index;
          }

          if (Math.abs(delta[1]) < Math.abs(closestDotAngleToAngleCCW)) {
            closestDotAngleToAngleCCW = delta[1];
            closestSlideCCW = index;
          }

          if (Math.abs(delta[2]) < Math.abs(closestDotAngleToAngleCW)) {
            closestDotAngleToAngleCW = delta[2];
            closestSlideCW = index;
          }
        });

        return [
          [closestSlide, closestSlideCCW, closestSlideCW],
          [closestDotAngleToAngle, closestDotAngleToAngleCCW, closestDotAngleToAngleCW]
        ];
      }

      /**
       * Move to a specific slide.
       *
       * @method move
       * @chainable
       * @param {Number} [index] The slide to move to.
       */
      this.move = function(index) {
        var slideIndex = Math.max(0, isNaN(index) ? self.slideCurrent : index);

        if (slideIndex >= self.slidesTotal) {
          slideIndex = 0;
        }

        var angleDestination = self.dots[slideIndex] && self.dots[slideIndex].angle,
          angleDelta = _findShortestPath(angleDestination, self.angleCurrent)[0],
          angleStep = angleDelta > 0 ? -2 : 2;

        self.slideCurrent = slideIndex;
        _stepMove(angleStep, angleDelta, 50);

        self.start();

        return self;
      };

      /**
       * @method _sanitizeAngle
       * @private
       * @param {Number} [degrees]
       */
      function _sanitizeAngle(degrees) {
        return (degrees < 0) ? 360 + (degrees % -360) : degrees % 360;
      }

      /**
       * @method _stepMove
       * @private
       * @param {Number} [angleStep]
       * @param {Number} [angleDelta]
       * @param {Boolean} [stepInterval]
       */
      function _stepMove(angleStep, angleDelta, stepInterval) {
        var angleStepNew = angleStep,
          endAnimation = false;

        if (Math.abs(angleStep) > Math.abs(angleDelta)) {
          angleStepNew = -angleDelta;
          endAnimation = true;
        } else if (hasRequestAnimationFrame) {
          requestAnimationFrame(function() {
            _stepMove(angleStepNew, angleDelta + angleStep);
          });
        } else {
          animationTimer = setTimeout(function() {
            _stepMove(angleStepNew, angleDelta + angleStep, stepInterval * 0.9);
          }, stepInterval);
        }

        self.angleCurrent = _sanitizeAngle(self.angleCurrent - angleStepNew);

        _setCSS(self.angleCurrent, endAnimation);
      }

      /**
       * @method _page
       * @private
       * @param {Object} [event]
       */
      function _page(event) {
        return {
          x: isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX),
          y: isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY)
        };
      }

      /**
       * @method _drag
       * @private
       * @param {Object} [event]
       */
      function _drag(event) {
        var containerOffset = $container.offset(),
          thumbPositionNew = {
            left: _page(event).x - containerOffset.left - (containerSize.width / 2),
            top: _page(event).y - containerOffset.top - (containerSize.height / 2)
          };

        self.angleCurrent = _sanitizeAngle(
          _toDegrees(
            Math.atan2(thumbPositionNew.left, -thumbPositionNew.top)
          )
        );

        if (!hasRequestAnimationFrame) {
          _setCSS(self.angleCurrent);
        }

        return false;
      }

      /**
       * @method _setCSS
       * @private
       * @param {Number} [angle]
       * @param {Function} [fireCallback]
       */
      function _setCSS(angle, fireCallback) {
        closestSlidesAndAngles = _findClosestSlide(angle);
        closestSlides = closestSlidesAndAngles[0];
        closestAngles = closestSlidesAndAngles[1];

        $overview.css("left", -(closestSlides[1] * slideSize.width + Math.abs(closestAngles[1]) * slideSize.width / (Math.abs(closestAngles[1]) + Math.abs(closestAngles[2]))));
        $thumb.css({
          top: -Math.cos(_toRadians(angle)) * self.options.radius + (containerSize.height / 2 - thumbSize.height / 2),
          left: Math.sin(_toRadians(angle)) * self.options.radius + (containerSize.width / 2 - thumbSize.width / 2)
        });

        if (fireCallback) {
          /**
           * The move event will trigger when the carousel slides to a new slide.
           *
           * @event move
           * custom
           */
          $container.trigger("move", [$slides[self.slideCurrent], self.slideCurrent]);
          var slideno = _findClosestSlide(self.angleCurrent)[0][0];
          $('.dot').removeClass('active');
          $('.dot:eq(' + slideno + ')').addClass('active');
          $('#overlayActive').removeClass('slideno(0) slideno(1) slideno(2) slideno(3) slideno(4) slideno(5) slideno(6) slideno(7)').addClass('slideno(' + slideno + ')');
          
             $('.dot-1').mouseover(function() {
               $('#overlayInteraction').addClass('is-slide1-hovered');
             });
             $('.dot-1').mouseout(function() {
               $('#overlayInteraction').removeClass('is-slide1-hovered');
             });

             $('.dot-2').mouseover(function() {
               $('#overlayInteraction').addClass('is-slide2-hovered');
             });
             $('.dot-2').mouseout(function() {
               $('#overlayInteraction').removeClass('is-slide2-hovered');
             });

             $('.dot-3').mouseover(function() {
               $('#overlayInteraction').addClass('is-slide3-hovered');
             });
             $('.dot-3').mouseout(function() {
               $('#overlayInteraction').removeClass('is-slide3-hovered');
             });

             $('.dot-4').mouseover(function() {
              $('#overlayInteraction').addClass('is-slide4-hovered');
             });
             $('.dot-4').mouseout(function() {
              $('#overlayInteraction').removeClass('is-slide4-hovered');
             });

             $('.dot-5').mouseover(function() {
              $('#overlayInteraction').addClass('is-slide5-hovered');
             });
             $('.dot-5').mouseout(function() {
              $('#overlayInteraction').removeClass('is-slide5-hovered');
             });

             $('.dot-6').mouseover(function() {
              $('#overlayInteraction').addClass('is-slide6-hovered');
             });
             $('.dot-6').mouseout(function() {
              $('#overlayInteraction').removeClass('is-slide6-hovered');
             });

             $('.dot-7').mouseover(function() {
              $('#overlayInteraction').addClass('is-slide7-hovered');
             });
             $('.dot-7').mouseout(function() {
              $('#overlayInteraction').removeClass('is-slide7-hovered');
             });

             $('.dot-8').mouseover(function() {
              $('#overlayInteraction').addClass('is-slide8-hovered');
             });
             $('.dot-8').mouseout(function() {
              $('#overlayInteraction').removeClass('is-slide8-hovered');
             });           
          
        }
      }

      /**
       * @method _endDrag
       * @private
       * @param {Object} [event]
       */
      function _endDrag(event) {
        if ($(event.target).hasClass("dot")) {
          return false;
        }
        self.dragging = false;
        event.preventDefault();

        $(document).unbind("mousemove mouseup");
        $thumb.unbind("mouseup");

        if (self.options.dotsHide) {
          $dots.stop(true, true).fadeOut("slow");
        }

        if (self.options.dotsSnap) {
          self.move(_findClosestSlide(self.angleCurrent)[0][0]);
        }
      }

      function _dragAnimationLoop() {
        if (self.dragging) {
          _setCSS(self.angleCurrent);
          requestAnimationFrame(function() {
            _dragAnimationLoop();
          });
        }
      }

      /**
       * @method _startDrag
       * @private
       * @param {Object} [event]
       */
      function _startDrag(event) {
        event.preventDefault();
        isTouchEvent = event.type == 'touchstart';
        self.dragging = true;

        if ($(event.target).hasClass("dot")) {
          return false;
        }

        self.stop();

        $(document).mousemove(_drag);
        $(document).mouseup(_endDrag);
        $thumb.mouseup(_endDrag);

        if (self.options.dotsHide) {
          $dots.stop(true, true).fadeIn("slow");
        }

        if (hasRequestAnimationFrame) {
          _dragAnimationLoop();
        }
      }

      return _initialize();
    }

    /**
     * @class tinycircleslider
     * @constructor
     * @param {Object} options
     @param {Boolean} [options.dotsSnap=false] Shows dots when user starts dragging and snap to them.
     @param {Boolean} [options.dotsHide=true] Fades out the dots when user stops dragging.
     @param {Number}  [options.radius=140] Used to determine the size of the circleslider.
     @param {Boolean} [options.interval=false] Move to another block on intervals.
     @param {Number}  [options.intervalTime=intervalTime] Interval time in milliseconds.
     @param {Number}  [options.start=0] The slide to start with.
     */
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
        }
      });
    };
  }));
$(document).ready(function() {
  var widthtoacquire = $(window).width() - 30;
  var radius = (widthtoacquire - 80) / 2 > 150 ? 150 : (widthtoacquire - 80) / 2;

  $("#rotatescroll").tinycircleslider({
    dotsSnap: true,
    radius: radius,
    dotsHide: false,
    slides: ["England", "Ireland", "Wales", "Guernsey", "Norway", "Netherlands", "Belgium", "Italy"],
    interval: false
  });

});