var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "three"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = require("three");
    var InstancedShader = {
        LambertVertex: "\n            varying vec3 vLightFront;\n\n            #ifdef DOUBLE_SIDED\n\t            varying vec3 vLightBack;\n            #endif\n\n            #include <common>\n            #include <uv_pars_vertex>\n            #include <uv2_pars_vertex>\n            #include <envmap_pars_vertex>\n            #include <bsdfs>\n            #include <lights_pars>\n            #include <color_pars_vertex>\n            #include <fog_pars_vertex>\n            #include <morphtarget_pars_vertex>\n            #include <skinning_pars_vertex>\n            #include <shadowmap_pars_vertex>\n            #include <logdepthbuf_pars_vertex>\n            #include <clipping_planes_pars_vertex>\n\n            attribute vec3 mcol0;\n            attribute vec3 mcol1;\n            attribute vec3 mcol2;\n            attribute vec3 mcol3;\n\n            attribute float visible;\n            varying float vVisible;\n\n            void main() {\n                vVisible = visible;\n                if(visible < 0.5)\n                    return;\n\n\t            #include <uv_vertex>\n\t            #include <uv2_vertex>\n\t            #include <color_vertex>\n\n\t            #include <beginnormal_vertex>\n\t            #include <morphnormal_vertex>\n\t            #include <skinbase_vertex>\n\t            #include <skinnormal_vertex>\n\t            \n                mat3 normalMat = mat3(mcol0, mcol1, mcol2);\n                vec3 transformedNormal = normalMatrix * normalMat * objectNormal;\n                #ifdef FLIP_SIDED\n                    transformedNormal = - transformedNormal;\n                #endif\n\n\t            #include <begin_vertex>\n\t            #include <morphtarget_vertex>\n\t            #include <skinning_vertex>\n\t            \n                mat4 matrix = mat4(vec4(mcol0, 0), vec4(mcol1, 0), vec4(mcol2, 0), vec4(mcol3, 1));\n                vec4 matPosition = matrix * vec4( transformed, 1.0 );\n                vec4 mvPosition = modelViewMatrix * matPosition;\n                gl_Position = projectionMatrix * mvPosition;\n\n\t            #include <logdepthbuf_vertex>\n\t            #include <clipping_planes_vertex>\n\n\t            #if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )\n\t                vec4 worldPosition = modelMatrix * matPosition;\n                #endif\n\n\t            #include <envmap_vertex>\n\t            #include <lights_lambert_vertex>\n\t            #include <shadowmap_vertex>\n\t            #include <fog_vertex>\n            }\n        ",
        LambertFragment: "\n            uniform vec3 diffuse;\n            uniform vec3 emissive;\n            uniform float opacity;\n\n            varying vec3 vLightFront;\n\n            #ifdef DOUBLE_SIDED\n\t            varying vec3 vLightBack;\n            #endif\n\n            #include <common>\n            #include <packing>\n            #include <dithering_pars_fragment>\n            #include <color_pars_fragment>\n            #include <uv_pars_fragment>\n            #include <uv2_pars_fragment>\n            #include <map_pars_fragment>\n            #include <alphamap_pars_fragment>\n            #include <aomap_pars_fragment>\n            #include <lightmap_pars_fragment>\n            #include <emissivemap_pars_fragment>\n            #include <envmap_pars_fragment>\n            #include <bsdfs>\n            #include <lights_pars>\n            #include <fog_pars_fragment>\n            #include <shadowmap_pars_fragment>\n            #include <shadowmask_pars_fragment>\n            #include <specularmap_pars_fragment>\n            #include <logdepthbuf_pars_fragment>\n            #include <clipping_planes_pars_fragment>\n\n            varying float vVisible;\n\n            void main() {\n                if(vVisible < 0.5)\n                    discard;\n\n\t            #if NUM_CLIPPING_PLANES > 0\n                    for ( int i = 0; i < UNION_CLIPPING_PLANES; ++ i ) {\n                        vec4 plane = clippingPlanes[ i ];\n                        if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n                    }\n                    #if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n                        bool clipped = true;\n                        for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; ++ i ) {\n                            vec4 plane = clippingPlanes[ i ];\n                            clipped = ( dot( vViewPosition, plane.xyz ) > plane.w ) && clipped;\n                            if(!clipped)\n                                break;\n                        }\n                        if ( clipped ) discard;\n                    #endif\n        \n                #endif\n\n\t            vec4 diffuseColor = vec4( diffuse, opacity );\n\t            ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\t            vec3 totalEmissiveRadiance = emissive;\n\n\t            #include <logdepthbuf_fragment>\n\t            #include <map_fragment>\n\t            #include <color_fragment>\n\t            #include <alphamap_fragment>\n\t            #include <alphatest_fragment>\n\t            #include <specularmap_fragment>\n\t            #include <emissivemap_fragment>\n\n\t            // accumulation\n\t            reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );\n\n\t            #include <lightmap_fragment>\n\n\t            reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );\n\n\t            #ifdef DOUBLE_SIDED\n\n\t\t            reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;\n\n\t            #else\n\n\t\t            reflectedLight.directDiffuse = vLightFront;\n\n\t            #endif\n\n\t            reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();\n\n\t            // modulation\n\t            #include <aomap_fragment>\n\n\t            vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\n\t            #include <envmap_fragment>\n\n\t            gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\n\t            #include <tonemapping_fragment>\n\t            #include <encodings_fragment>\n\t            #include <fog_fragment>\n\t            #include <premultiplied_alpha_fragment>\n\t            #include <dithering_fragment>\n            }\n        ",
        PhongVertex: "\n            varying vec3 vViewPosition;\n\n            #ifndef FLAT_SHADED\n\t            varying vec3 vNormal;\n            #endif\n\n            #include <common>\n            #include <uv_pars_vertex>\n            #include <uv2_pars_vertex>\n            #include <displacementmap_pars_vertex>\n            #include <envmap_pars_vertex>\n            #include <color_pars_vertex>\n            #include <fog_pars_vertex>\n            #include <morphtarget_pars_vertex>\n            #include <skinning_pars_vertex>\n            #include <shadowmap_pars_vertex>\n            #include <logdepthbuf_pars_vertex>\n            #include <clipping_planes_pars_vertex>\n\n            attribute vec3 mcol0;\n            attribute vec3 mcol1;\n            attribute vec3 mcol2;\n            attribute vec3 mcol3;\n\n            attribute float visible;\n            varying float vVisible;\n\n            void main() {\n                vVisible = visible;\n                if(visible < 0.5)\n                    return;\n\n\t            #include <uv_vertex>\n\t            #include <uv2_vertex>\n\t            #include <color_vertex>\n\n\t            #include <beginnormal_vertex>\n\t            #include <morphnormal_vertex>\n\t            #include <skinbase_vertex>\n\t            #include <skinnormal_vertex>\n\n\t            mat3 normalMat = mat3(mcol0, mcol1, mcol2);\n                vec3 transformedNormal = normalMatrix * normalMat * objectNormal;\n                #ifdef FLIP_SIDED\n                    transformedNormal = - transformedNormal;\n                #endif\n\n                #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n\t                vNormal = normalize( transformedNormal );\n                #endif\n\n\t            #include <begin_vertex>\n\t            #include <morphtarget_vertex>\n\t            #include <skinning_vertex>\n\t            #include <displacementmap_vertex>\n\t            \n                mat4 matrix = mat4(vec4(mcol0, 0), vec4(mcol1, 0), vec4(mcol2, 0), vec4(mcol3, 1));\n                vec4 matPosition = matrix * vec4( transformed, 1.0 );\n                vec4 mvPosition = modelViewMatrix * matPosition;\n                gl_Position = projectionMatrix * mvPosition;\n\n\t            #include <logdepthbuf_vertex>\n\t            #include <clipping_planes_vertex>\n\n\t            vViewPosition = - mvPosition.xyz;\n\n\t            #if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )\n\t                vec4 worldPosition = modelMatrix * matPosition;\n                #endif\n\n\t            #include <envmap_vertex>\n\t            #include <shadowmap_vertex>\n\t            #include <fog_vertex>\n            }\n        ",
        PhongFragment: "\n            uniform vec3 diffuse;\n            uniform vec3 emissive;\n            uniform vec3 specular;\n            uniform float shininess;\n            uniform float opacity;\n\n            #include <common>\n            #include <packing>\n            #include <dithering_pars_fragment>\n            #include <color_pars_fragment>\n            #include <uv_pars_fragment>\n            #include <uv2_pars_fragment>\n            #include <map_pars_fragment>\n            #include <alphamap_pars_fragment>\n            #include <aomap_pars_fragment>\n            #include <lightmap_pars_fragment>\n            #include <emissivemap_pars_fragment>\n            #include <envmap_pars_fragment>\n            #include <gradientmap_pars_fragment>\n            #include <fog_pars_fragment>\n            #include <bsdfs>\n            #include <lights_pars>\n            #include <lights_phong_pars_fragment>\n            #include <shadowmap_pars_fragment>\n            #include <bumpmap_pars_fragment>\n            #include <normalmap_pars_fragment>\n            #include <specularmap_pars_fragment>\n            #include <logdepthbuf_pars_fragment>\n            #include <clipping_planes_pars_fragment>\n\n            varying float vVisible;\n\n            void main() {\n                if(vVisible < 0.5)\n                    discard;\n\n\t            #if NUM_CLIPPING_PLANES > 0\n                    for ( int i = 0; i < UNION_CLIPPING_PLANES; ++ i ) {\n                        vec4 plane = clippingPlanes[ i ];\n                        if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n                    }\n                    #if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n                        bool clipped = true;\n                        for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; ++ i ) {\n                            vec4 plane = clippingPlanes[ i ];\n                            clipped = ( dot( vViewPosition, plane.xyz ) > plane.w ) && clipped;\n                            if(!clipped)\n                                break;\n                        }\n                        if ( clipped ) discard;\n                    #endif\n        \n                #endif\n\n\t            vec4 diffuseColor = vec4( diffuse, opacity );\n\t            ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\t            vec3 totalEmissiveRadiance = emissive;\n\n\t            #include <logdepthbuf_fragment>\n\t            #include <map_fragment>\n\t            #include <color_fragment>\n\t            #include <alphamap_fragment>\n\t            #include <alphatest_fragment>\n\t            #include <specularmap_fragment>\n\t            #include <normal_fragment>\n\t            #include <emissivemap_fragment>\n\n\t            // accumulation\n\t            #include <lights_phong_fragment>\n\t            #include <lights_template>\n\n\t            // modulation\n\t            #include <aomap_fragment>\n\n\t            vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n\t            #include <envmap_fragment>\n\n\t            gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\n\t            #include <tonemapping_fragment>\n\t            #include <encodings_fragment>\n\t            #include <fog_fragment>\n\t            #include <premultiplied_alpha_fragment>\n\t            #include <dithering_fragment>\n\n            }\n        ",
        PickVertex: "\n            #include <clipping_planes_pars_vertex>\n\n            attribute vec3 mcol0;\n            attribute vec3 mcol1;\n            attribute vec3 mcol2;\n            attribute vec3 mcol3;\n\n            attribute float visible;\n            varying float vVisible;\n\n            attribute vec3 pickingColor;\n            varying vec3 vColor;\n\n            void main() {\n                vVisible = visible;\n                vColor = pickingColor;\n                if(visible < 0.5)\n                    return;\n\n                mat4 matrix = mat4(\n                            vec4( mcol0, 0 ),\n                            vec4( mcol1, 0 ),\n                            vec4( mcol2, 0 ),\n                            vec4( mcol3, 1 )\n                        );\n                vec3 transformed = vec3( position );\n                vec4 matPosition = matrix * vec4( transformed, 1.0 );\n                vec4 mvPosition = modelViewMatrix * matPosition;\n                gl_Position = projectionMatrix * mvPosition;\n\n                #include <clipping_planes_vertex>\n            }\n        ",
        PickFragment: "\n            #include <clipping_planes_pars_fragment>\n\n            varying float vVisible;\n            varying vec3 vColor;\n\n            void main()\t{\n                if(vVisible < 0.5)\n                    discard;\n\n                #if NUM_CLIPPING_PLANES > 0\n                    for ( int i = 0; i < UNION_CLIPPING_PLANES; ++ i ) {\n                        vec4 plane = clippingPlanes[ i ];\n                        if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n                    }\n                    #if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n                        bool clipped = true;\n                        for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; ++ i ) {\n                            vec4 plane = clippingPlanes[ i ];\n                            clipped = ( dot( vViewPosition, plane.xyz ) > plane.w ) && clipped;\n                            if(!clipped)\n                                break;\n                        }\n                        if ( clipped ) discard;\n                    #endif\n        \n                #endif\n\n                gl_FragColor = vec4( vColor, 1.0 );\n            }\n        "
    };
    var InstancedLambertMaterial = /** @class */ (function (_super) {
        __extends(InstancedLambertMaterial, _super);
        function InstancedLambertMaterial(parameters) {
            var _this = _super.call(this, parameters) || this;
            _this.type = "InstancedLambertMaterial";
            _this.fog = true;
            _this.lights = true;
            _this.clipping = true;
            _this.side = THREE.DoubleSide;
            _this.shading = THREE.FlatShading;
            _this.uniforms = THREE.UniformsUtils.merge([
                THREE.UniformsLib.common,
                THREE.UniformsLib.aomap,
                THREE.UniformsLib.lightmap,
                THREE.UniformsLib.emissivemap,
                THREE.UniformsLib.fog,
                THREE.UniformsLib.lights,
                {
                    emissive: { value: new THREE.Color(0x000000) }
                }
            ]);
            _this.vertexShader = InstancedShader.LambertVertex;
            _this.fragmentShader = InstancedShader.LambertFragment;
            return _this;
        }
        InstancedLambertMaterial.prototype.setTexture = function (texture) {
            this.map = texture;
            this.uniforms.map.value = texture;
            this.needsUpdate = true;
        };
        return InstancedLambertMaterial;
    }(THREE.ShaderMaterial));
    exports.InstancedLambertMaterial = InstancedLambertMaterial;
    var InstancedPhongMaterial = /** @class */ (function (_super) {
        __extends(InstancedPhongMaterial, _super);
        function InstancedPhongMaterial(parameters) {
            var _this = _super.call(this, parameters) || this;
            _this.type = "InstancedPhongMaterial";
            _this.fog = true;
            _this.lights = true;
            _this.clipping = true;
            _this.side = THREE.DoubleSide;
            _this.shading = THREE.FlatShading;
            _this.uniforms = THREE.UniformsUtils.merge([
                THREE.UniformsLib.common,
                THREE.UniformsLib.aomap,
                THREE.UniformsLib.lightmap,
                THREE.UniformsLib.emissivemap,
                THREE.UniformsLib.bumpmap,
                THREE.UniformsLib.normalmap,
                THREE.UniformsLib.displacementmap,
                THREE.UniformsLib.fog,
                THREE.UniformsLib.lights,
                {
                    emissive: { value: new THREE.Color(0x000000) },
                    specular: { value: new THREE.Color(0x111111) },
                    shininess: { value: 30 }
                }
            ]);
            _this.vertexShader = InstancedShader.PhongVertex;
            _this.fragmentShader = InstancedShader.PhongFragment;
            return _this;
        }
        InstancedPhongMaterial.prototype.setTexture = function (texture) {
            this.map = texture;
            this.uniforms.map.value = texture;
            this.needsUpdate = true;
        };
        return InstancedPhongMaterial;
    }(THREE.ShaderMaterial));
    exports.InstancedPhongMaterial = InstancedPhongMaterial;
    var InstancedPickMaterial = /** @class */ (function (_super) {
        __extends(InstancedPickMaterial, _super);
        function InstancedPickMaterial(parameters) {
            var _this = _super.call(this, parameters) || this;
            _this.type = "InstancedPickMaterial";
            _this.clipping = true;
            _this.side = THREE.DoubleSide;
            _this.shading = THREE.FlatShading;
            _this.vertexShader = InstancedShader.PickVertex;
            _this.fragmentShader = InstancedShader.PickFragment;
            return _this;
        }
        return InstancedPickMaterial;
    }(THREE.ShaderMaterial));
    exports.InstancedPickMaterial = InstancedPickMaterial;
});
//# sourceMappingURL=MyMaterial.js.map


------------------------------- 用法 ------------------------------

if (this._geometry instanceof THREE.InstancedBufferGeometry && this._quotenum > 0) {
	var mcol0 = new THREE.InstancedBufferAttribute(new Float32Array(this._quotenum * 3), 3, 1);
	var mcol1 = new THREE.InstancedBufferAttribute(new Float32Array(this._quotenum * 3), 3, 1);
	var mcol2 = new THREE.InstancedBufferAttribute(new Float32Array(this._quotenum * 3), 3, 1);
	var mcol3 = new THREE.InstancedBufferAttribute(new Float32Array(this._quotenum * 3), 3, 1);
	this._geometry.addAttribute('mcol0', mcol0);
	this._geometry.addAttribute('mcol1', mcol1);
	this._geometry.addAttribute('mcol2', mcol2);
	this._geometry.addAttribute('mcol3', mcol3);
	var viewMcol = new THREE.InstancedBufferAttribute(new Float32Array(this._quotenum), 1, 1);
	for (var i = 0; i < this._quotenum; i++)
		viewMcol.setX(i, 0);
	this._geometry.addAttribute('visible', viewMcol);
	var pickingColors = new THREE.InstancedBufferAttribute(new Float32Array(this._quotenum * 3), 3, 1);
	this._geometry.addAttribute('pickingColor', pickingColors);
}