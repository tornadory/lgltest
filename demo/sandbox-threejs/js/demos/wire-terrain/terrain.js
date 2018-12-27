var Glslify = require('glslify')

function _createGeometry( width, segments ) {
	
	var geometry = new THREE.PlaneGeometry( width, width, segments, segments )
	
	geometry.applyMatrix(
		new THREE.Matrix4().makeRotationX( Math.PI * 0.5 )
	)
	
	return geometry
	
}

function _createTexture( mesh, scene ) {
	
	var img = new Image()
	var texture = new THREE.Texture( img )
	img.src = 'assets/images/cloud1024.png'
	
	texture.wrapT = THREE.RepeatWrapping
	texture.wrapS = THREE.RepeatWrapping
	
	$(img).on('load', function() {
		texture.needsUpdate = true
		scene.add( mesh )
	})
	
	return texture
	
}

function _createMeshGrid( material, width, gridLength, totalPolygonDensity ) {
	
	var geometry = _createGeometry(
		width / gridLength,
		Math.floor( totalPolygonDensity / gridLength )
	)
	
	var meshGrid = new THREE.Object3D()
	
	var mesh
	var step = width / gridLength
	
	for( var i=0; i < gridLength; i++ ) {
		for( var j=0; j < gridLength; j++ ) {
			
			mesh = new THREE.Mesh( geometry, material )
			mesh.frustumCulled = false
			
			meshGrid.add( mesh )
			mesh.position.set(
				i * step,
				0,
				j * step
			)
		}
	}
	
	return meshGrid
}

function _updateModuloMeshGrid( cameraPosition, meshes, width, state ) {
	
	var il = meshes.length
	var halfWidth = width / 2
	
	return function() {
		var position
		
		for( var i=0; i < il; i++ ) {
			
			position = meshes[i].position
	
			position.set(
				( ( position.x - cameraPosition.x + halfWidth ) % width ) + cameraPosition.x - halfWidth,
				position.y,
				( ( position.z - cameraPosition.z + halfWidth ) % width ) + cameraPosition.z - halfWidth
			)
			
		}
		
	}
}

module.exports = function wireTerrain( poem, properties ) {
	
	var config = _.extend({
		width				: 8000,
		heightScale			: 200,
		gridLength			: 16,
		totalPolygonDensity	: 256,
		positionY			: 0,
		height				: 1
	}, properties)
	
	var state = {
		height : config.height
	}
	
	var material = new THREE.ShaderMaterial({
		
		vertexShader    : Glslify('./terrain.vert'),
		fragmentShader  : Glslify('./terrain.frag'),

		side:        THREE.DoubleSide,
		wireframe:   true,
		transparent: true,
		
		uniforms: {
			terrain         : { type: 't' },
			heightFactor    : { type: 'f' },
			width           : { type: 'f' },
			elapsed         : { type: 'f' },
		},
		attributes      : {}

	})
	
	var meshGrid = _createMeshGrid(
		material,
		config.width,
		config.gridLength,
		config.totalPolygonDensity
	)
	
	meshGrid.position.y = config.positionY
	
	material.uniforms.terrain.value = _createTexture( meshGrid, poem.scene )
	material.uniforms.width.value = config.width / 2
	material.uniforms.height = state.height
	
	poem.emitter.on( 'update', function( e ) {
		material.uniforms.heightFactor.value = state.height
		material.uniforms.elapsed.value = e.elapsed
	})
	
	poem.emitter.on( 'update', _updateModuloMeshGrid(
		poem.camera.object.position,
		meshGrid.children,
		config.width,
		state
	))
	
	return state
}