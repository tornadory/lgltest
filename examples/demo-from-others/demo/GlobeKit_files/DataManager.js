"use strict";

var Site = Site || {};
Site.DataManager = function(){
    var self = this;
    var url = "/GlobeKit_files/4.5_month.geojson.json";
    this.earthquakes = [];
    this.loadSignal = new BK.Signal();

    this.load = function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onload = function () {
            var response = JSON.parse(xhr.responseText);
            for (var i=0; i<response.features.length; i++) {
                var feature = response.features[i];
                self.earthquakes.push(new Site.DataManager.Earthquake(feature));
            }

            self.loadSignal.fire();
        }
    }
}

Site.DataManager.Earthquake = function(data) {
    this.magnitude = data.mag;
    this.desc = data.place;
    this.data = data;

    var coords = data.geometry.coordinates;
    this.latLng = new GK.LatLng(coords[1], coords[0]);
    this.pos = GK.LatLng.toWorld(this.latLng);
}
