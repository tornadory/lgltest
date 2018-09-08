function ColorSelector(a) {
    this.init(a)
}
ColorSelector.prototype = {
    container: null,
    hue: null,
    hueSelector: null,
    hueData: null,
    luminosity: null,
    luminositySelector: null,
    luminosityData: null,
    luminosityPosition: null,
    init: function (b) {
        var a;
        this.container = document.createElement("div");
		this.container.setAttribute('id', "color-picker-container")
        this.container.style.position = "absolute";
        this.container.style.width = "180px";
        this.container.style.height = "180px";
        this.container.style.visibility = "hidden";
        this.container.style.cursor = "pointer";
        this.hue = document.createElement("canvas");
        this.hue.width = b.width;
        this.hue.height = b.height;
        a = this.hue.getContext("2d");
        a.drawImage(b, 0, 0);
        this.hueData = a.getImageData(0, 0, this.hue.width, this.hue.height).data;
        this.container.appendChild(this.hue);
        this.luminosity = document.createElement("canvas");
        this.luminosity.style.position = "absolute";
        this.luminosity.style.left = "0px";
        this.luminosity.style.top = "0px";
        this.luminosity.width = 180;//250
        this.luminosity.height = 180;//250
        this.container.appendChild(this.luminosity);
        this.updateLuminosity([255, 255, 255]);
        this.hueSelector = document.createElement("canvas");
        this.hueSelector.style.position = "absolute";
        this.hueSelector.style.left = ((this.hue.width - 15) / 2) + "px";
        this.hueSelector.style.top = ((this.hue.height - 15) / 2) + "px";
        this.hueSelector.width = 15;
        this.hueSelector.height = 15;
        a = this.hueSelector.getContext("2d");
        a.lineWidth = 1;
        a.strokeStyle = "rgba(0, 0, 0, 1)";
        a.beginPath();
        a.arc(7, 7, 5, 0, Math.PI * 2, true);
        a.stroke();
        a.strokeStyle = "rgba(256, 256, 256, 1)";
        a.beginPath();
        a.arc(6, 6, 5, 0, Math.PI * 2, true);
        a.stroke();
        this.container.appendChild(this.hueSelector);
        this.luminosityPosition = [(b.width - 10), (b.height - 10) / 2];//15,15
        this.luminositySelector = document.createElement("canvas");
        this.luminositySelector.style.position = "absolute";
        this.luminositySelector.style.left = (this.luminosityPosition[0] - 2) + "px";
        this.luminositySelector.style.top = (this.luminosityPosition[1] - 2) + "px";
		this.luminositySelector.width = 15;
        this.luminositySelector.height = 15;
        a = this.luminositySelector.getContext("2d");
        a.drawImage(this.hueSelector, 0, 0);
        this.container.appendChild(this.luminositySelector)
    },
    show: function () {
        this.container.style.visibility = "visible"
    },
    hide: function () {
        this.container.style.visibility = "hidden"
    },
    updateLuminosity: function (g) {
        var d, e, l, b, a, k = 81,//100 inner ring position
            f = 90,//120 outter ring position
            h, j = 1080 / 2,
            c = Math.PI / 180;
        b = this.luminosity.width / 2;
        a = this.luminosity.height / 2;
        d = this.luminosity.getContext("2d");
        d.lineWidth = 3;
        d.clearRect(0, 0, this.luminosity.width, this.luminosity.height);
        for (h = 0; h < j; h++) {
            e = h / (j / 360) * c;
            l = 255 - (h / j) * 255;
            d.strokeStyle = "rgb(" + Math.floor(g[0] - l) + "," + Math.floor(g[1] - l) + "," + Math.floor(g[2] - l) + ")";
            d.beginPath();
            d.moveTo(Math.cos(e) * k + b, Math.sin(e) * k + a);
            d.lineTo(Math.cos(e) * f + b, Math.sin(e) * f + a);
            d.stroke()
        }
        this.luminosityData = d.getImageData(0, 0, this.luminosity.width, this.luminosity.height).data
    },
    update: function (g) {
        var b, k, f, c, h, a, j;
        b = (g.clientX - this.container.offsetLeft);
        k = (g.clientY - this.container.offsetTop);
        f = b - 90//125
        c = k - 90//125
        h = Math.sqrt(f * f + c * c);
        if (h < 74) { //90  if mouse is in inner color selector
            this.hueSelector.style.left = (b - 7) + "px";
            this.hueSelector.style.top = (k - 7) + "px";
            this.updateLuminosity([this.hueData[(b + (k * 180)) * 4], this.hueData[(b + (k * 180)) * 4 + 1], this.hueData[(b + (k * 180)) * 4 + 2]]) //250
        } else {
            if (h > 80 && h < 90) { //100,120  if mouse is in outer hue ring
                a = f / h;
                j = c / h;
                this.luminosityPosition[0] = (a * 85) + 90; //110,125
                this.luminosityPosition[1] = (j * 85) + 90; //110,125
                this.luminositySelector.style.left = (this.luminosityPosition[0] - 5) + "px";
                this.luminositySelector.style.top = (this.luminosityPosition[1] - 5) + "px"
            }
        }
    },
    getColor: function () {
        var a, b;
        a = Math.floor(this.luminosityPosition[0]);
        b = Math.floor(this.luminosityPosition[1]);
        return [this.luminosityData[(a + (b * 180)) * 4], this.luminosityData[(a + (b * 180)) * 4 + 1], this.luminosityData[(a + (b * 180)) * 4 + 2]]//250
    }
};

function Palette() {
    var f, e, b, a, q = 0,
        h = 74, //90 //width of color wheel
        o = 1080 / 2,
        n = 30,
        m, d = Math.PI / 180,
        l, k, p, g, r;
    f = document.createElement("canvas");
    f.width = 180;//250
    f.height = 180;//250
    b = f.width / 2;
    a = f.height / 2;
    m = (h - q) / n;
    e = f.getContext("2d");
    e.lineWidth = 3;

    function s(z, v, u) {
        var w, x, B, y, A, j, c, C;
        if (u == 0) {
            return [0, 0, 0]
        }
        z /= 60;
        v /= 100;
        u /= 100;
        y = Math.floor(z);
        A = z - y;
        j = u * (1 - v);
        c = u * (1 - (v * A));
        C = u * (1 - (v * (1 - A)));
        switch (y) {
        case 0:
            w = u;
            x = C;
            B = j;
            break;
        case 1:
            w = c;
            x = u;
            B = j;
            break;
        case 2:
            w = j;
            x = u;
            B = C;
            break;
        case 3:
            w = j;
            x = c;
            B = u;
            break;
        case 4:
            w = C;
            x = j;
            B = u;
            break;
        case 5:
            w = u;
            x = j;
            B = c;
            break
        }
        return [w, x, B]
    }
    for (l = 0; l < o; l++) {
        p = s(Math.floor((l / o) * 360), 100, 100);
        g = l / (o / 360) * d;
        for (k = 0; k < n; k++) {
            r = 255 - (k / n) * 255;
            e.strokeStyle = "rgb(" + Math.floor(p[0] * 255 + r) + "," + Math.floor(p[1] * 255 + r) + "," + Math.floor(p[2] * 255 + r) + ")";
            e.beginPath();
            e.moveTo(Math.cos(g) * (m * k + q) + b, Math.sin(g) * (m * k + q) + a);
            e.lineTo(Math.cos(g) * (m * (k + 1) + q) + b, Math.sin(g) * (m * (k + 1) + q) + a);
            e.stroke()
        }
    }
    return f
}