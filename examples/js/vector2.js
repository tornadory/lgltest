function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}
Vector2.prototype = {
    constructor: Vector2,

    set: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    clone: function () {
        return new this.constructor(this.x, this.y);
    },

    copy: function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    },

    add: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    addScalar: function (s) {
        this.x += s;
        this.y += s;
        return this;
    },

    addVectors: function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    },

    addScaledVector: function (v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
    },

    sub: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },
    
    subScalar: function (s) {
        this.x -= s;
        this.y -= s;
        return this;
    },

    subVectors: function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
    },

    multiply: function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    },

    multiplyScalar: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    },

    divide: function (v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    },

    divideScalar: function (scalar) {
        return this.multiplyScalar(1 / scalar);
    },

    applyMatrix3: function (m) {
        var x = this.x, y = this.y;
        var e = m.elements;

        this.x = e[0] * x + e[3] * y + e[6];
        this.y = e[1] * x + e[4] * y + e[7];
        return this;
    },

    min: function (v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    },

    max: function (v) {
        this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		return this;
    },

    limit: function (scalar) {
        var len = this.lengthSq();
        if (len > scalar * scalar) {
            return this.multiplyScalar(scalar / Math.sqrt(len));
        }
        return this;
    },

    clamp: function (min, max) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		return this;
    },

    clampScalar: function (minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(this.x, maxVal));
        this.y = Math.max(minVal, Math.min(this.y, maxVal));
        return this;
    },

    clampLength: function (min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    },

    negate: function () {
        this.x = - this.x;
		this.y = - this.y;
		return this;
    },

    dot: function (v) {
        return this.x * v.x + this.y * v.y;
    },

    lengthSq: function () {
        return this.x * this.x + this.y * this.y;
    },

    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    manhattanLength: function () {
        return Math.abs(this.x) + Math.abs(this.y);
    },

    normalize: function () {
        return this.divideScalar(this.length() || 1);
    },

    angle: function () {
        var angle = Math.atan2(this.y, this.x);
        if (angle < 0) angle += 2 * Math.PI;
        return angle;
    },

    distanceTo: function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    },

    distanceToSquared: function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    },

    manhattanDistanceTo: function (v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    },

    setLength: function (length) {
        return this.normalize().multiplyScalar(length);
    },

    lerp: function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    },

    lerpVectors: function (v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
    },

    equals: function (v) {
        return (v.x === this.x) && (v.y === this.y);
    },

    fromArray: function (array, offset) {
        if ( offset === undefined ) offset = 0;
		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		return this;
    },

    toArray: function (array, offset) {
        if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;
		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		return array;
    },

    rotateAround: function (center, angle) {
        var c = Math.cos(angle), s = Math.sin(angle);

        var x = this.x - center.x;
        var y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;

        return this;
    }
};