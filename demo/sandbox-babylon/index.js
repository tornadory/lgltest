var assetUrl;
var cameraPosition;
var kiosk;
var currentGroup; // animation group
var currentGroupIndex;
var currentScene;
// html balise
var animationBar = document.getElementById("animationBar");
var dropdownBtn = document.getElementById("dropdownBtn");
var chevronUp = document.getElementById("chevronUp");
var chevronDown = document.getElementById("chevronDown");
var dropdownLabel = document.getElementById("dropdownLabel");
var dropdownContent = document.getElementById("dropdownContent");
var playBtn = document.getElementById("playBtn");
var slider = document.getElementById("slider");

var indexOf = location.href.indexOf("?");
if (indexOf !== -1) {
    var params = location.href.substr(indexOf + 1).split("&");
    for (var index = 0; index < params.length; index++) {
        var param = params[index].split("=");
        var name = param[0];
        var value = param[1];
        switch (name) {
            case "assetUrl":
                {
                    assetUrl = value;
                    break;
                }
            case "cameraPosition":
                {
                    cameraPosition = BABYLON.Vector3.FromArray(value.split(",").map(function (component) {
                        return +component;
                    }));
                    break;
                }
            case "kiosk":
                {
                    kiosk = value === "true" ? true : false;
                    break;
                }
        }
    }
}

if (BABYLON.Engine.isSupported()) {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true, {
        premultipliedAlpha: false,
        preserveDrawingBuffer: true
    });
    var htmlInput = document.getElementById("files");
    var footer = document.getElementById("footer");
    var btnFullScreen = document.getElementById("btnFullscreen");
    var btnInspector = document.getElementById("btnInspector");
    var errorZone = document.getElementById("errorZone");
    var filesInput;
    var currentScene;
    var currentSkybox;
    var currentPluginName;
    var skyboxPath = "Assets/environment.dds";
    var debugLayerEnabled = false;
    var debugLayerLastActiveTab = 0;

    engine.loadingUIBackgroundColor = "#a9b5bc";

    btnFullScreen.classList.add("hidden");
    btnInspector.classList.add("hidden");

    canvas.addEventListener("contextmenu", function (evt) {
        evt.preventDefault();
    }, false);

    BABYLON.Engine.ShadersRepository = "/src/Shaders/";

    // This is really important to tell Babylon.js to use decomposeLerp and matrix interpolation
    BABYLON.Animation.AllowMatricesInterpolation = true;

    // Setting up some GLTF values
    BABYLON.GLTFFileLoader.IncrementalLoading = false;
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
        currentPluginName = plugin.name;
    });

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });

    var sceneLoaded = function (sceneFile, babylonScene) { //loaded...
        console.log("sceneLoaded ...", sceneFile);
        engine.clearInternalTexturesCache();

        // Clear dropdown that contains animation names
        dropdownContent.innerHTML = "";
        animationBar.style.display = "none";
        currentGroup = null;

        if (babylonScene.animationGroups.length > 0) {
            animationBar.style.display = "flex";
            for (var index = 0; index < babylonScene.animationGroups.length; index++) {
                var group = babylonScene.animationGroups[index];
                createDropdownLink(group, index);
            }
            currentGroup = babylonScene.animationGroups[0];
            currentGroupIndex = 0;
            document.getElementById(formatId(currentGroup.name + "-" + currentGroupIndex)).click();
        }

        // Sync the slider with the current frame
        babylonScene.registerBeforeRender(function () {
            if (currentGroup != null && currentGroup.targetedAnimations[0].animation.runtimeAnimations[0] != null) {
                var currentValue = slider.valueAsNumber;
                var newValue = currentGroup.targetedAnimations[0].animation.runtimeAnimations[0].currentFrame;
                var range = Math.abs(currentGroup.from - currentGroup.to);
                if (Math.abs(currentValue - newValue) > range * 0.01) { // Only move if greater than a 1% change
                    slider.value = newValue;
                }
            }
        });

        // Clear the error
        errorZone.style.display = 'none';

        btnFullScreen.classList.remove("hidden");
        btnInspector.classList.remove("hidden");

        currentScene = babylonScene;
        document.title = "BabylonJS - " + sceneFile.name;
        // Fix for IE, otherwise it will change the default filter for files selection after first use
        htmlInput.value = "";

        // Attach camera to canvas inputs
        if (!currentScene.activeCamera || currentScene.lights.length === 0) {
            currentScene.createDefaultCameraOrLight(true);

            if (cameraPosition) {
                currentScene.activeCamera.setPosition(cameraPosition);
            } else {
                if (currentPluginName === "gltf") {
                    // glTF assets use a +Z forward convention while the default camera faces +Z. Rotate the camera to look at the front of the asset.
                    currentScene.activeCamera.alpha += Math.PI;
                }

                // Enable camera's behaviors
                currentScene.activeCamera.useFramingBehavior = true;

                var framingBehavior = currentScene.activeCamera.getBehaviorByName("Framing");
                framingBehavior.framingTime = 0;
                framingBehavior.elevationReturnTime = -1;

                if (currentScene.meshes.length) {
                    var worldExtends = currentScene.getWorldExtends();
                    currentScene.activeCamera.lowerRadiusLimit = null;
                    framingBehavior.zoomOnBoundingInfo(worldExtends.min, worldExtends.max);
                }
            }

            currentScene.activeCamera.pinchPrecision = 200 / currentScene.activeCamera.radius;
            currentScene.activeCamera.upperRadiusLimit = 5 * currentScene.activeCamera.radius;

            currentScene.activeCamera.wheelDeltaPercentage = 0.01;
            currentScene.activeCamera.pinchDeltaPercentage = 0.01;
        }

        currentScene.activeCamera.attachControl(canvas);

        // Environment
        if (currentPluginName === "gltf") {
            console.log("plugin gltf");
            // var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(skyboxPath, currentScene);
            // console.log("hdr texture ", skyboxPath);
            // // currentSkybox = currentScene.createDefaultSkybox(hdrTexture, true, (currentScene.activeCamera.maxZ - currentScene.activeCamera.minZ) / 2, 0.3);
            // currentSkybox = currentScene.createDefaultSkybox(hdrTexture, false);



            // Environment Texture
            var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(skyboxPath, currentScene);

            currentScene.imageProcessingConfiguration.exposure = 0.6;
            currentScene.imageProcessingConfiguration.contrast = 1.6;

            // Skybox
            var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, currentScene);
            var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", currentScene);
            hdrSkyboxMaterial.backFaceCulling = false;
            hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
            hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            hdrSkyboxMaterial.microSurface = 1.0;
            hdrSkyboxMaterial.disableLighting = true;
            hdrSkybox.material = hdrSkyboxMaterial;
            hdrSkybox.infiniteDistance = true;
            // -----------------------------------------------------------


            // var skyMaterial = new BABYLON.SkyMaterial("skyMaterial", currentScene);
            // skyMaterial.backFaceCulling = false;
            // skyMaterial.turbidity = 20; // Represents the amount (scattering) of haze as opposed to molecules in atmosphere
            // skyMaterial.luminance = 0.1; // Controls the overall luminance of sky in interval ]0, 1,190[
            // // Control the planet's orientation over the sun
            // skyMaterial.inclination = 0.42; // The solar inclination, related to the solar azimuth in interval [0, 1]
            // skyMaterial.azimuth = 0.25; // The solar azimuth in interval [0, 1]
            // // Manually set the sun position
            // skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
            // skyMaterial.sunPosition = new BABYLON.Vector3(0, 100, 0);

            // var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, currentScene);
            // skybox.material = skyMaterial;



            // // Skybox
            // var box = BABYLON.Mesh.CreateBox('SkyBox', 1000, currentScene, false, BABYLON.Mesh.BACKSIDE);
            // box.material = new BABYLON.SkyMaterial('sky', currentScene);
            // box.material.inclination = -0.35;

            // // Reflection probe
            // var rp = new BABYLON.ReflectionProbe('ref', 512, currentScene);
            // rp.renderList.push(box);

            // // Sphere
            // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, currentScene);
            // sphere.position.y = 1;

            // // PBR
            // var pbr = new BABYLON.PBRMaterial('pbr', currentScene);
            // pbr.reflectionTexture = rp.cubeTexture;
            // sphere.material = pbr;
        }

        // In case of error during loading, meshes will be empty and clearColor is set to red
        if (currentScene.meshes.length === 0 && currentScene.clearColor.r === 1 && currentScene.clearColor.g === 0 && currentScene.clearColor.b === 0) {
            document.getElementById("logo").className = "";
            canvas.style.opacity = 0;
            debugLayerEnabled = true;
        } else {
            if (BABYLON.Tools.errorsCount > 0) {
                debugLayerEnabled = true;
            }
            document.getElementById("logo").className = "hidden";
            document.getElementById("droptext").className = "hidden";
            canvas.style.opacity = 1;
            if (currentScene.activeCamera.keysUp) {
                currentScene.activeCamera.keysUp.push(90); // Z
                currentScene.activeCamera.keysUp.push(87); // W
                currentScene.activeCamera.keysDown.push(83); // S
                currentScene.activeCamera.keysLeft.push(65); // A
                currentScene.activeCamera.keysLeft.push(81); // Q
                currentScene.activeCamera.keysRight.push(69); // E
                currentScene.activeCamera.keysRight.push(68); // D
            }
        }

        if (debugLayerEnabled) {
            currentScene.debugLayer.show({
                initialTab: debugLayerLastActiveTab
            });
        }
    };

    var sceneError = function (sceneFile, babylonScene, message) {
        document.title = "BabylonJS - " + sceneFile.name;
        document.getElementById("logo").className = "";
        canvas.style.opacity = 0;

        var errorContent = '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button>' + message.replace("file:[object File]", "'" + sceneFile.name + "'") + '</div>';

        errorZone.style.display = 'block';
        errorZone.innerHTML = errorContent;

        // Close button error
        errorZone.querySelector('.close').addEventListener('click', function () {
            errorZone.style.display = 'none';
        });
    };

    var loadFromAssetUrl = function () {
        console.log("loadFromAssetsUrl ...");
        var rootUrl = BABYLON.Tools.GetFolderPath(assetUrl);
        var fileName = BABYLON.Tools.GetFilename(assetUrl);
        BABYLON.SceneLoader.LoadAsync(rootUrl, fileName, engine).then(function (scene) {

            console.log(".........................");
            if (currentScene) {
                currentScene.dispose();
            }

            sceneLoaded({
                name: fileName
            }, scene);

            scene.whenReadyAsync().then(function () {
                engine.runRenderLoop(function () {
                    scene.render();
                });
            });
        }).catch(function (reason) {
            sceneError({
                name: fileName
            }, null, reason.message || reason);
        });
    };

    if (assetUrl) {
        console.log("try load from asset url");
        loadFromAssetUrl();
    } else {
        console.log("try others");
        filesInput = new BABYLON.FilesInput(engine, null, sceneLoaded, null, null, null, function () {
            BABYLON.Tools.ClearLogCache()
        }, null, sceneError);
        filesInput.onProcessFileCallback = (function (file, name, extension) {
            if (filesInput._filesToLoad && filesInput._filesToLoad.length === 1 && extension) {
                if (extension.toLowerCase() === "dds" || extension.toLowerCase() === "env") {
                    BABYLON.FilesInput.FilesToLoad[name] = file;
                    skyboxPath = "file:" + file.correctName;
                    return false;
                }
            }
            return true;
        }).bind(this);
        filesInput.monitorElementForDragNDrop(canvas);

        htmlInput.addEventListener('change', function (event) {
            console.log("event change");
            var filestoLoad;
            // Handling data transfer via drag'n'drop
            if (event && event.dataTransfer && event.dataTransfer.files) {
                filesToLoad = event.dataTransfer.files;
            }
            // Handling files from input files
            if (event && event.target && event.target.files) {
                filesToLoad = event.target.files;
            }
            filesInput.loadFiles(event);
        }, false);
    }

    window.addEventListener("keydown", function (event) {
        // Press R to reload
        if (event.keyCode === 82 && event.target.nodeName !== "INPUT" && currentScene) {
            debugLayerLastActiveTab = currentScene.debugLayer.getActiveTab();

            if (assetUrl) {
                loadFromAssetUrl();
            } else {
                filesInput.reload();
            }
        }
    });

    if (kiosk) {
        footer.style.display = "none";
    }

    btnFullScreen.addEventListener('click', function () {
        engine.switchFullscreen(true);
    }, false);

    btnInspector.addEventListener('click', function () {
        if (currentScene) {
            if (currentScene.debugLayer.isVisible()) {
                debugLayerEnabled = false;
                debugLayerLastActiveTab = currentScene.debugLayer.getActiveTab();
                currentScene.debugLayer.hide();
            } else {
                currentScene.debugLayer.show({
                    initialTab: debugLayerLastActiveTab
                });
                debugLayerEnabled = true;
            }
        }
    }, false);

    window.addEventListener("keydown", function (event) {
        // Press space to toggle footer
        if (event.keyCode === 32 && event.target.nodeName !== "INPUT") {
            if (footer.style.display === "none") {
                footer.style.display = "block";
            } else {
                footer.style.display = "none";
                errorZone.style.display = "none";
                if (enableDebugLayer) {
                    currentScene.debugLayer.hide();
                    enableDebugLayer = false;
                }
            }
        }
    });

    sizeScene();

    window.onresize = function () {
        sizeScene();
    }
}

function sizeScene() {
    let divInspWrapper = document.getElementsByClassName('insp-wrapper')[0];
    if (divInspWrapper) {
        let divFooter = document.getElementsByClassName('footer')[0];
        divInspWrapper.style.height = (document.body.clientHeight - divFooter.clientHeight) + "px";
        divInspWrapper.style['max-width'] = document.body.clientWidth + "px";
    }
}

// animation
// event on the dropdown
function formatId(name) {
    return "data-" + name.replace(/\s/g, '');
}

function displayDropdownContent(display) {
    if (display) {
        dropdownContent.style.display = "flex";
        chevronDown.style.display = "inline";
        chevronUp.style.display = "none";
    } else {
        dropdownContent.style.display = "none";
        chevronDown.style.display = "none";
        chevronUp.style.display = "inline";
    }
}
dropdownBtn.addEventListener("click", function () {
    if (dropdownContent.style.display === "flex") {
        displayDropdownContent(false);
    } else {
        displayDropdownContent(true);
    }
});

function createDropdownLink(group, index) {
    var animation = document.createElement("a");
    animation.innerHTML = group.name;
    animation.setAttribute("id", formatId(group.name + "-" + index));
    animation.addEventListener("click", function () {
        // stop the current animation group
        currentGroup.reset();
        currentGroup.stop();
        document.getElementById(formatId(currentGroup.name + "-" + currentGroupIndex)).classList.remove("active");
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");

        // start the new animation group
        currentGroup = group;
        currentGroupIndex = index;
        currentGroup.start(true);
        this.classList.add("active");
        dropdownLabel.innerHTML = currentGroup.name;

        // set the slider
        slider.setAttribute("min", currentGroup.from);
        slider.setAttribute("max", currentGroup.to);
        currentSliderValue = currentGroup.from;
        slider.value = currentGroup.from;

        // hide the content of the dropdown
        displayDropdownContent(false);
    });
    dropdownContent.appendChild(animation);
}

// event on the play/pause button
playBtn.addEventListener("click", function () {
    // click on the button to run the animation
    if (this.classList.contains("play")) {
        this.classList.remove("play");
        this.classList.add("pause");
        var currentFrame = slider.value;
        currentGroup.play(true);
    }
    // click on the button to pause the animation
    else {
        this.classList.add("play");
        this.classList.remove("pause");
        currentGroup.pause();
    }
});

// event on the slider
slider.addEventListener("input", function () {
    if (playBtn.classList.contains("play")) {
        currentGroup.play(true);
        currentGroup.goToFrame(this.value);
        currentGroup.pause();
    } else {
        currentGroup.goToFrame(this.value);
    }
});

var sliderPause = false;
slider.addEventListener("mousedown", function () {
    if (playBtn.classList.contains("pause")) {
        sliderPause = true;
        playBtn.click();
    }
});

slider.addEventListener("mouseup", function () {
    if (sliderPause) {
        sliderPause = false;
        playBtn.click();
    }
});