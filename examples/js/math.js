var _Math = {
    DEG2RAD: Math.PI / 180,
    RAD2DEG: 180 / Math.PI,

    clamp: function (value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    euclideanModulo: function (n, m) {
        return (n % m + m) % m;
    },

    mapLinear: function (x, a1, a2, b1, b2) {
        return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    },

    lerp: function (x, y, t) {
        return (1 - t) * x + t * y;
    },

    smoothstep: function (x, min, max) {
        if (x <= min) return 0;
		if (x >= max) return 1;

		x = (x - min) / (max - min);

		return x * x * (3 - 2 * x);
    },

    smootherstep: function (x, min, max) {
        if (x <= min) return 0;
		if (x >= max) return 1;

		x = (x - min) / (max - min);

		return x * x * x * (x * (x * 6 - 15) + 10);
    },

    randInt: function (low, high) {
        return low + Math.floor(Math.random() * (hight - low + 1));
    },

    randFloat: function (low, high) {
        return low + Math.random() * (high - low);
    },

    randFloatSpread: function (range) {
        return range * (0.5 - Math.random());
    },

    degToRad: function (degrees) {
        return degrees * _Math.DEG2RAD;
    },

    radToDeg: function (radians) {
        return radians * _Math.RAD2DEG;
    },

    isPowerOfTwo: function (value) {
        return (value & (value - 1)) === 0 && value !== 0;
    },

    gaussianRandom: function (u, o) {
        var a = Math.random(), b = Math.random();

        return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b) * u + o;
    }
}