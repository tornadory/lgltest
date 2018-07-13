(function(w){
	if(w.fCircle){
		return;
	}
	var fCircle = function(opt){
		var container = opt.container;
		if(!(container instanceof Element)){
			return;
		}
		var emptyColor = opt.emptyColor || 'red';
		var fillColor = opt.fillColor || 'green';
		var diameter = opt.diameter || '100px';
		var width = opt.width || '10px';

		var wrap = document.createElement('div');
		var bg = document.createElement('div');
		var fill = document.createElement('div');
		var mask = document.createElement('div');

		wrap.appendChild(bg);
		wrap.appendChild(fill);
		wrap.appendChild(mask);

		wrap.style.cssText = 'position:relative;width:' + diameter + ';height:' + diameter + ';';

		var ct = 'position: absolute;top: 0;left: 0;width:100%;height: 100%;border: ' + width + ' solid ' + fillColor + ';box-sizing: border-box;border-radius: 50%;';

		bg.style.cssText = ct;
		fill.style.cssText = ct;
		mask.style.cssText = ct;

		var setRotate = function(el, deg){
			var val = 'rotate(' + deg + 'deg)';
			el.style['-moz-transform'] = val;
			el.style['-webkit-transform'] = val;
			el.style['-o-transform'] = val;
			el.style['-ms-transform'] = val;
			el.style['transform'] = val;
		};
		var createHalfCircle = function(el, color, isLeft){
			el.style.borderColor = color + ' ' + color + ' transparent transparent';
			if(isLeft){
				setRotate(el, -135);
			}
			else{
				setRotate(el, 45);
			}
		};

		createHalfCircle(fill, emptyColor, false);
		createHalfCircle(mask, emptyColor, true);

		container.appendChild(wrap);

		var update = function(percent){
			var deg = 45 + Math.round(percent / 100 * 360);
			setRotate(fill, deg);
			if(percent >= 50){
				createHalfCircle(mask, fillColor, false);
			}
			else{
				createHalfCircle(mask, emptyColor, true);
			}
		};

		return {
			update : update
		};
	};
	if ( typeof define === "function") { //AMD|CMD
		define(function(require, exports, module) {
			module.exports = fCircle;
		});
		return;
	}
	w.fCircle = fCircle; //normal
})(this);