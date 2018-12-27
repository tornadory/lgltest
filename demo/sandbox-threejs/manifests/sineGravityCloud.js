module.exports = {
	name : "Sine Gravity Cloud",
	description : "An evolving cloud of movement",
	order : 0,
	config : {
		camera : {
			x : -400
		},
	},
	components : {
		renderer : { function : require('../js/renderers/basic-renderer') },
		controls : {
			construct: require("../js/components/cameras/Controls"),
		},
		pointcloud : {
			construct: require("../js/demos/sine-gravity-cloud/sine"),
		},
		grid : {
			construct: require("../js/demos/Grid"),
		},
		// stats : {
		// 	construct: require("../js/components/utils/Stats")
		// }
	}
};