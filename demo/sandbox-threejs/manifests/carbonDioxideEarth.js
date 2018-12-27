module.exports = {
	name : "Carbon Dioxide Earth",
	description : "Mapping NASA Data",
	order : 0,
	config : {
		camera : {
			x : -400,
			far : 3000
		}
	},
	components : {
		renderer : { function : require('../js/renderers/basic-renderer') },
		sphere : {
			construct: require("../js/demos/Earth"),
			properties: {}
		},
		controls : {
			construct: require("../js/components/cameras/Controls"),
			properties: {
				minDistance : 500,
				maxDistance : 1000,
				zoomSpeed : 0.1,
				autoRotate : true,
				autoRotateSpeed : 0.2
			}
		},
		info : {
			construct: require("../js/components/Info"),
			properties : {
				documentTitle : "Earth's CO2 – a Three.js Visualization adapted by Greg Tatum",
				title : "Earth's CO2",
				subtitle : "3d Visualisation of a map from NASA",
				appendCredits : "<br/> Map visualization by <a href='http://svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=11719'>NASA's Goddard Space Flight Center</a>",
				titleCss : { "font-size": "3.35em" },
				subtitleCss : {	"font-size": "0.7em" },
				showArrowNext : true
			}
		},
		stars : {
			construct: require("../js/components/Stars"),
		},
		// stats : {
		// 	construct: require("../js/components/utils/Stats")
		// },
		lights : {
			construct: require("../js/components/lights/TrackCameraLights")
		}
	}
};