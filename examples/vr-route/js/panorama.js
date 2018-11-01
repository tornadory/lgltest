var Panorama = function () {
    return {
        init(config) {
            console.log(Date.parse(new Date()), "----------------start------------------------------");
            this._config = Object.assign({
                url: '/images/scene/vip/jitang_one.jpg',                    //全景图片
                container: document.body,   //容器
                radius: 500,                //球体半径
                fov: 90,                    //相机视角，可用于放大和缩小图片
                vue: "",
                offsetLatitude: 0,          //纬度偏移量，可用于默认展示图片位置
                supportMouse: true,        //是否支持鼠标
                supportTouch: true,         //是否支持手指滑动
                supportOrient: true,        //是否支持陀螺仪
                memorial: '',
                onFrame(lon, lat) {
                    return {lon, lat};
                }
            }, config);
            this.vue = config.vue;
            this._config.width = config.container.clientWidth;
            this._config.height = config.container.clientHeight;
            config = this._config;
            this._fix = {
                lat: config.offsetLatitude || 0,
                lon: config.offsetLongitude || 180,
                isFixed: config.offsetLatitude || config.offsetLongitude
            };
            this._touch = this._orient = {
                lat: 0,
                lon: 0
            };
            this.memorial = config.memorial;
            this.clock;
            this.dragControlsEnable = false;
            this.mixers = [];
            this.objects = new Array();
            this.productMap = new Map();//数量集合
            this.sceneMap = new Map();//数量集合
            this.imgMap = new Map();
            this.hostUrl=window.location.href.indexOf("m.jibai.com")!=-1?"http://img.jibai.com/mstatic":"";
            this.initBaseInfo();
            this._initStage();
            this.resize();
            this._animate();
            this._initControl();
            //初始化基本信息
        },
// 初始化信息，灵位，墓碑，头像
        initBaseInfo() {
            this.baseInfo = new Map();
            var type = this.memorial.type;
            var name = this.memorial.name.replace('的纪念馆', '').replace('纪念馆', '');
            var departedSaints = this.memorial.departedSaints;
            if (type == 'one') {
                var attr=this.memorial.avatar;
                if(attr.indexOf("imgs0.zupu.cn")!=-1&&attr.indexOf("!")==-1){
                    attr=attr+"!vertical"
                }
                this.baseInfo.set('avatar', attr);
                this.baseInfo.set('mubei', name);
                this.baseInfo.set('lingwei', name + '');
            } else {
                if (departedSaints != null && departedSaints.length != 0) {
                    for (var i = 0; i < departedSaints.length; i++) {
                        var attr= departedSaints[i].avatar;
                        if(attr.indexOf("imgs0.zupu.cn")!=-1&&attr.indexOf("!")==-1){
                            attr=attr+"!vertical"
                        }
                        this.baseInfo.set('avatar-' + (i + 1), attr);
                        this.baseInfo.set('mubei-' + (i + 1), departedSaints[i].name);
                        this.baseInfo.set('lingwei-' + (i + 1), departedSaints[i].name + '');
                    }
                } else {
                    var attr= this.memorial.avatar;
                    if(attr.indexOf("imgs0.zupu.cn")!=-1&&attr.indexOf("!")==-1){
                        attr=attr+"!vertical"
                    }
                    this.baseInfo.set('avatar-1', attr);
                    this.baseInfo.set('avatar-2', attr);

                    this.baseInfo.set('mubei-1', name);
                    this.baseInfo.set('mubei-2', name);

                    this.baseInfo.set('lingwei-1', name );
                    this.baseInfo.set('lingwei-2', name );
                }
            }
            var sceneList = this.vue.sceneList;
            for (var i = 0; i < sceneList.length; i++) {
                this.baseInfo.set(sceneList[i].id, sceneList[i])
            }


        },

        update(config = {}) {
            this._config = Object.assign({}, this._config, config);
            if (config.width || config.height) {
                this.renderer.setSize(this._config.width, this._config.height);
                this.camera.aspect = this._config.width / this._config.height;
            }
            if (config.fov) {
                this.camera.fov = config.fov;
            }
            this.camera.updateProjectionMatrix();
            this.resize();
        },

        //重置大小，以及相机视角
        resize() {
            this.camera.lookAt(this.camera.target);
            this.renderer.render(this.scene, this.camera);
        },

        _initStage() {
//添加环境灯
            if (window.location.hash.replace("#", "").split("-")[1]) {
                this.dragControlsEnable = true;
            }
            this.animationGroup = new THREE.AnimationObjectGroup();
            var {container, width, height, fov, radius} = this._config;
            this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1100);
            this.camera.target = new THREE.Vector3(0, 0, 0);
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(width, height);
            this.canvas = this.renderer.domElement;
            this.renderer.render(this.scene, this.camera);
            container.appendChild(this.canvas);
            this.clock = new THREE.Clock();
            var sceneId = window.location.hash.replace("#", "").split("-")[0];
            var isVip = this.memorial.maxType;
            if (sceneId == null || sceneId == "") {
                if (isVip == 'vip') {
                    sceneId = 106;
                } else {
                    sceneId = 203;
                }
            }
            this.vue.panoramaOpne();
            // 第一次加载祭堂场景

            this.initMemorialScene(sceneId);

            // 方向按钮动效
            this.animate();
            window.addEventListener('resize', this._bindResize = this._onResize.bind(this));
        },

        initSceneImg(sceneId) {
            var tempCount = 6;
            var self = this;
            self.vue.Load = true;
            if (this.sceneMap.get(sceneId) == undefined || this.sceneMap.get(sceneId).get("mesh") == undefined) {
                var sceneInfo = this.baseInfo.get(parseInt(sceneId));
                var type = this.memorial.type;
                var cubeGeometry = new THREE.CubeGeometry(1000, 1000, 1000, 1, 1, 1);
                cubeGeometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
                var cubeMaterialArray = [];
                var imgCodeArray = ['3', '1', '5', '6', '2', '4']
                for (var i = 0; i < 6; i++) {
                    var imgPath = sceneInfo.sceneImg + imgCodeArray[i] + '.jpg';
                    imgPath = imgPath.replace("one_1", type + "_1")
                    if (imgPath && imgPath.indexOf("createImg") != -1 || imgPath.indexOf("https://") != -1) {
                    } else {
                        imgPath = self.hostUrl + imgPath
                    }
                    cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                        map: new THREE.TextureLoader().load(imgPath, function (img) {
                            tempCount--;
                            if (tempCount == 0) {
                                self.vue.Load = false;
                            }
                        })
                    }));
                }
                this.vue.jpBtn = sceneInfo.shopping;
                this._fix.lon = sceneInfo.fov;

                var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
                cube.position.set(0, 0, 0);
                <!-- 立方体放置的位置 -->
                this.scene.add(cube);
                this.renderer.render(this.scene,this.camera)
                if (this.sceneMap.get(sceneId) == undefined) {
                    // var objmesh=new Map();
                    // objmesh.set("mesh",objmesh)
                    // this.sceneMap.set(sceneId,objmesh)
                } else {
                    this.sceneMap.get(sceneId).set("mesh", cube)
                }
            } else {
                var mesh = this.sceneMap.get(sceneId).get("mesh");
                this.scene.add(mesh);
            }
        }
        ,
        animate() {
            requestAnimationFrame(this.animate.bind(this));
            this._render();
        }
        ,
        _render() {
            var delta = this.clock.getDelta();
            if (this.mixers) {

                for (var i = 0; i < this.mixers.length; i++) {
                    this.mixers[i].update(delta);
                }
            }
        }
        ,

//取消事件，重力感应，点击滑动，鼠标事件
        unbind() {
            this._mouser && this._mouser.unbind();
            this._toucher && this._toucher.unbind();
            if (this._orienter) {
                this._orienter.isOpen = this.vue.offSafe;
            }
        }
        ,
        unbindOrienter() {
            if (this._orienter) {
                this._orienter.isOpen = false;
            }
        }
        ,
        bindOrienter() {
            if (this._orienter) {
                this._orienter.isOpen = true;
            }
        }
        ,
//绑定事件，重力感应，点击滑动，鼠标事件
        bind() {
            this._mouser && this._mouser.bind();
            this._toucher && this._toucher.bind();
            if (this._orienter) {
                this._orienter.isOpen = this.vue.offSafe;
            }
        }
        ,

//添加灯光
        addSpotLight(x, y, z) {
            var spotLight = new THREE.SpotLight(0xffffaa);
            spotLight.position.set(x, y, z);
            spotLight.castShadow = true;
            this.scene.add(spotLight);
        }
        ,

//加载材质，1️⃣图片的名称为Key
        loadTexture(path) {
            var material = new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load(path, function (imageObj) {
                    console.info("加载完成", imageObj, path)
                }),
                overdraw: 0.5,
                depthTest: false,
                transparent: true
            });
            return material;
        }
        ,

//清空基本元素
        clearMesh() {
            if (this.animationGroup._objects) {
                this.animationGroup._objects.splice(0, this.animationGroup._objects.length);
            }
            this.productMap.clear();

            for (var i = 0; i < this.scene.children.length; i++) {
                this.scene.remove(this.scene.children[i]);
            }
            this.scene.children.splice(0, this.scene.children.length);

            this.objects.splice(0, this.objects.length);
            this.objects=[];
        }
        ,

        addDragControls() {
            var self = this;
            this.ranking = 0;
            //添加点击事件
            var dragControls = new THREE.DragControls(self.objects, self.camera, self.renderer.domElement);
            dragControls.enabled = self.dragControlsEnable;

            dragControls.addEventListener('dragstart', function (event) {


                // 弹出购买狂
                var tag = event.object;
                console.info(tag.memorialOriginal, tag.memorialOriginal.id, self.ranking)
                if (!dragControls.enabled) {
                    //祭拜按钮
                    if (tag.memorialOriginal.type == "market") {
                        self.unbind()
                        self.vue.JipinX();
                    } else {
                        //清除元素，
                        var targetScene = tag.memorialOriginal.targetScene;
                        if (targetScene != null) {
                            //初始化背景
                            self.initMemorialScene(targetScene.id, true)

                        }
                        return;
                    }
                } else {
                    self.unbind()

                }
            });
            dragControls.addEventListener('dragend', function (event) {
                var position = event.object.position;
                //自动保存位置
                self.ranking++;
                if (dragControls.enabled) {
                    $.post('/scene/saveMemorialOriginal', {
                        x: position.x,
                        y: position.y,
                        z: position.z,
                        ranking: self.ranking,
                        id: event.object.memorialOriginal.id
                    }, function (data) {
                        //绘制商品列表
                        self.bind();
                    });
                }
            });
        }
        ,

        initBaseData(sceneId) {

            var self = this;
            var tempSceneInfo = this.sceneMap.get(sceneId);
            var _originals = tempSceneInfo.get("originals");
            var currentProductRecords = tempSceneInfo.get("currentProductRecords");
            console.info(_originals, "--------------_originals")
            self.initToatal = _originals.length;
            for (var i = 0; i < _originals.length; i++) {
                self.addPlaneAndObjects(_originals[i]);
            }
            //编辑模式不加载数据
            if (!self.dragControlsEnable) {
                self.addCurrentProductRecords(currentProductRecords);
            }
        }
        ,
        getSceneInfo(sceneId) {
            var self = this;
            $.post('/scene/' + sceneId, {memorialId: this.memorial.id}, function (data) {
                var _originals = data.originals;
                var m = new Map();
                m.set("originals", _originals);
                m.set("currentProductRecords", data.currentProductRecords);
                self.sceneMap.set(sceneId, m);

                self.initBaseData(sceneId);
                self.addDragControls();
            });
        }
        ,
        //初始化祭糖信息，添加灯光，排位，照片等
        initMemorialScene(sceneId, isShowloading) {
            //初始化背景
            //清理数据
            this.clearMesh();
            console.log(Date.parse(new Date()), "----------------initMemorialScene start------------------------------");
            this.sceneId = sceneId;
            var url = document.URL,   //获取当前页面的网址信息
                URL;
            var num = url.indexOf('#');  //获取＃在的位置信息
            if (num){
                URL = url.substring(0,num);  //截取网址信息
                URL=URL+"#"+sceneId
                history.pushState(null,null,URL);  //将网址设置
            }


            if (isShowloading) {
                this.vue.Load = true;
                this.vue.productsAndCategory = null;

            }
            // 背景
            this.initSceneImg(sceneId);
            this.getSceneInfo(sceneId, true)
            var ambiColor = "#ffffff";
            var ambientLight = new THREE.AmbientLight(ambiColor);
            this.scene.add(ambientLight);

            // this._initControl()
        }
        ,


        addCurrentProductRecords(records) {
            console.log(records, '---------------------.records')
            if (records != null) {
                for (var i = 0; i < records.length; i++) {
                    var positionId = records[i].product.positionId + "";

                    var productPosition = this.productMap.get(positionId);
                    if (productPosition == undefined) {
                        console.warn(positionId, "categoryName----不存在、---------", records[i])
                        continue;
                    }
                    var position = productPosition.get("position");
                    var number = productPosition.get("number") + records[i].number
                    productPosition.set("number", number)
                    for (var j = 0; j < records[i].number; j++) {
                        for (var m = 0; m < position.length; m++) {
                            if (position[m].isUsed == null || position[m].isUsed == false) {
                                var mesh = this.addPlaneMemorialOriginal(position[m], records[i].product.loadingImg, records[i].product);
                                position[m].isUsed = true;
                                break;
                            }
                        }
                    }
                }

                //重新生成总数
                var numberTextCount = this.productMap.get("祭品数量");
                if (numberTextCount) {
                    for (var i = 0; i < numberTextCount.length; i++) {
                        var temp = numberTextCount[i];
                        var positionId = temp.get("positionId");
                        // if (categoryName == '香烛') {
                        //     categoryName = '香'
                        // }
                        var pp = this.productMap.get(positionId);
                        if (pp == null)
                            break;
                        var total = pp.get("position").length;
                        var currentTotal = pp.get("number");
                        if (positionId == '1') {
                            currentTotal = currentTotal + this.productMap.get("14").get("number");
                        }
                        if (currentTotal > total) {
                            var old1 = this.scene.getObjectByName(numberTextCount[i].get("numberPosition").id);
                            var old2 = this.scene.getObjectByName("background"+numberTextCount[i].get("numberPosition").id);
                            this.scene.remove(old1)
                            var mesh = this.addPlaneMemorialOriginal(numberTextCount[i].get("numberPosition"), numberTextCount[i].get("numberPosition").img.replace("number", currentTotal));
                            var memorialOriginal = numberTextCount[i].get("numberPosition");
                            if(!old1){
                                this.addPlane(this.hostUrl+'/images/scene/number_background.png', memorialOriginal.x, memorialOriginal.y, memorialOriginal.z, parseInt(memorialOriginal.width) + 10, memorialOriginal.height, memorialOriginal.rotationX, memorialOriginal.rotationY, "background"+memorialOriginal.id);
                            }

                        }
                    }
                }
            }

        }
        ,
        addPlaneAndObjects(memorialOriginal) {
            var type = memorialOriginal.type;
            //自动添加背景
          var isVip=  this.memorial.maxType;
            var img = memorialOriginal.img;
            var oneOrTwo = this.memorial.type;
            switch (type) {
                case 'directionText':   //方位direction文本
                    // 添加背景背景
                    this.addPlane(this.hostUrl+'/images/scene/number_background.png', memorialOriginal.x, memorialOriginal.y, memorialOriginal.z,
                        parseInt(memorialOriginal.width) + 10, memorialOriginal.height, memorialOriginal.rotationX, memorialOriginal.rotationY);
                case 'numberText':   //numberText
                    // 添加背景背景
                    this.addPlane(this.hostUrl+'/images/scene/number_background.png', memorialOriginal.x, memorialOriginal.y, memorialOriginal.z,
                        parseInt(memorialOriginal.width) + 10, memorialOriginal.height, memorialOriginal.rotationX, memorialOriginal.rotationY);
                    break;
                case 'product':
                    if (this.productMap.get(memorialOriginal.positionId) == null) {
                        var products = new Map();
                        products.set("position", [memorialOriginal]);
                        products.set("number", 0);
                        products.set("name", memorialOriginal.name);
                        this.productMap.set(memorialOriginal.positionId, products)
                    } else {
                        var cur = this.productMap.get(memorialOriginal.positionId);
                        cur.get('position').push(memorialOriginal);
                    }
                    //编辑模式不动态加载数据
                    if (!this.dragControlsEnable) {

                        this.initToatal--;
                        return;
                    }
                    break;
                // img="/createImg?isVertical=false&name="+parseInt(memorialOriginal.id);
                case 'productNumberText':
                    if (this.productMap.get("祭品数量") == null) {
                        var number_ = new Map();
                        number_.set("number", 0);
                        number_.set("positionId", memorialOriginal.positionId);
                        number_.set("name", memorialOriginal.name);
                        number_.set("numberPosition", memorialOriginal);
                        var arr = new Array();
                        arr.push(number_)
                        this.productMap.set("祭品数量", arr)
                    } else {
                        var array = this.productMap.get("祭品数量");
                        var number_ = new Map();
                        number_.set("number", 0);
                        number_.set("positionId", memorialOriginal.positionId);
                        number_.set("name", memorialOriginal.name);
                        number_.set("numberPosition", memorialOriginal);
                        array.push(number_)

                    }
                    this.initToatal--;

                    if (!this.dragControlsEnable) {
                        console.info(this.initToatal, "productNumberText", memorialOriginal.name)
                        return;
                    }
                    break;
                case 'one':   //方位direction
                    // 添加背景背景
                    if (oneOrTwo == 'two') {
                        this.initToatal--;
                        return;
                    }
                    if (memorialOriginal.name.indexOf('avatar') != -1) {
                        img = this.baseInfo.get(memorialOriginal.name);
                    } else {
                        img = img + this.baseInfo.get(memorialOriginal.name);
                    }
                    break;
                case 'two':   //方位direction
                    // 添加背景背景
                    if (oneOrTwo == 'one') {
                        this.initToatal--;
                        return;
                    }
                    if (memorialOriginal.name.indexOf('avatar') != -1) {
                        img = this.baseInfo.get(memorialOriginal.name);
                    } else {
                        img = img + this.baseInfo.get(memorialOriginal.name);
                    }

                    break;
                case 'avatar':   //头像
                    // 添加背景背景
                    img = this.memorial.avatar;
                    break;
                case 'lingwei':
                    img = memorialOriginal.img + this.memorial.name;
                    break;
                case 'zhimu':
                    if(isVip=="vip"){
                        img=img.replace("normal","vip");
                    }

                    break;
                default:
                    img = memorialOriginal.img
                    break;
            }


            this.addPlaneMemorialOriginal(memorialOriginal, img);
            this.playClipAction();
        }
        ,

//播放动画
        playClipAction() {

            var meshs = this.animationGroup._objects;
            for (var i = 0; i < meshs.length; i++) {
                var mesh = meshs[i];
                var positionKF = new THREE.VectorKeyframeTrack(
                    '.position',
                    [0, 1, 2],
                    [mesh.position.x, mesh.position.y - 5, mesh.position.z,
                        mesh.position.x, mesh.position.y - 3, mesh.position.z,
                        mesh.position.x, mesh.position.y, mesh.position.z]
                );
                var mixer = new THREE.AnimationMixer(mesh);
                var clip;

                if (mesh.memorialOriginal.name.indexOf('market') == -1) {
                    var colorKF = new THREE.ColorKeyframeTrack('.material.color', [0, 1, 2], [1, 1, 1, 171, 171, 171, 222, 222, 222], THREE.InterpolateDiscrete);
                    clip = new THREE.AnimationClip('Action' + mesh.id, 3, [positionKF, colorKF]);
                } else {
                    clip = new THREE.AnimationClip('Action' + mesh.id, 3, [positionKF])
                }
                var clipAction = mixer.clipAction(clip);
                clipAction.play();
                this.mixers.push(mixer)
            }

        }
        ,

        addPlaneMemorialOriginal(memorialOriginal, imgPath, product) {
            var self = this;
            if (imgPath && imgPath.indexOf("createImg") != -1 || imgPath.indexOf("https://") != -1) {
            } else {
                imgPath = self.hostUrl + imgPath
            }
            imgPath = imgPath.replace("undefined", "");

            var material_1 = new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load(imgPath, function (imageObj) {
                    var geometry_1;
                    var addY = 0;
                    var scole;

                    if (memorialOriginal.type == 'product') {
                        if (memorialOriginal.width == "0") {
                            if (product && product.name.indexOf("莲花") != -1) {
                                scole = memorialOriginal.height / 2 / imageObj.image.naturalHeight;
                                geometry_1 = new THREE.PlaneGeometry(parseInt(imageObj.image.naturalWidth) * scole, memorialOriginal.height / 2, 1, 1);

                            } else {
                                scole = memorialOriginal.height / imageObj.image.naturalHeight;
                                geometry_1 = new THREE.PlaneGeometry(parseInt(imageObj.image.naturalWidth) * scole, memorialOriginal.height, 1, 1);

                            }

                        } else if (memorialOriginal.height == "0") {
                            scole = memorialOriginal.width / imageObj.image.naturalWidth;
                            geometry_1 = new THREE.PlaneGeometry(memorialOriginal.width, imageObj.image.naturalHeight * scole, 1, 1);

                        } else {
                            scole = parseInt(memorialOriginal.width) / imageObj.image.naturalWidth;
                            addY = imageObj.image.naturalHeight * scole;

                            geometry_1 = new THREE.PlaneGeometry(memorialOriginal.width, memorialOriginal.height, 1, 1);
                        }
                        console.info(scole, imageObj.image.naturalWidth, imageObj.image.naturalHeight, imgPath, memorialOriginal.width, memorialOriginal.height)
                    } else {

                        geometry_1 = new THREE.PlaneGeometry(memorialOriginal.width, memorialOriginal.height, 1, 1);
                    }

                    var map = new Map();
                    map.set("material", material_1);
                    map.set("imageObj", imageObj)
                    map.set("height", imageObj.image.naturalHeight)
                    map.set("width", imageObj.image.naturalWidth)
                    map.set("scole", scole)
                    map.set("geometry", geometry_1)
                    self.imgMap.set(imgPath, map)
                    // geometry_1.parameters.height=1
                    var plane = new THREE.Mesh(geometry_1, material_1);
                    //设置角度static
                    plane.rotation.x = memorialOriginal.rotationX * Math.PI
                    plane.rotation.y = memorialOriginal.rotationY * Math.PI
                    plane.rotation.z = memorialOriginal.rotationZ * Math.PI
                    if (product && memorialOriginal.type == 'product' && product.name.indexOf("莲花") != -1) {
                        var t = memorialOriginal.height / 4;
                        plane.position.x = memorialOriginal.x;
                        plane.position.y = memorialOriginal.y - t;
                        plane.position.z = memorialOriginal.z;
                    } else {
                        plane.position.x = memorialOriginal.x;
                        plane.position.y = memorialOriginal.y;
                        plane.position.z = memorialOriginal.z;

                    }
                    plane.memorialOriginal = memorialOriginal;
                    plane.name = memorialOriginal.id;
                    plane.memorialOriginal = memorialOriginal;
                    self.scene.add(plane);
                    //点击事件
                    if (self.dragControlsEnable || memorialOriginal.name == 'market' || memorialOriginal.type == 'direction' || memorialOriginal.type == 'directionText') {
                        self.objects.push(plane);
                    }
                    if (self.dragControlsEnable) {
                        return;
                    }
                    // 动画
                    if (memorialOriginal.name == 'market' || memorialOriginal.type == 'direction') {
                        self.animationGroup.add(plane);
                    }
                    self.initToatal--;
                    if (self.initToatal == 0) {
                        self.playClipAction();
                    }
                }),
                overdraw: 0.5,
                transparent: true
            });


        }
        ,

//添加平面
        addPlane(img, positionX, positionY, positionZ, planeX, planeY, rotationX, rotationY, name) {
            var self = this;
            var material_1 = new THREE.MeshBasicMaterial({
                overdraw: 0.5,
                depthTest: false,
                transparent: true,
                map: new THREE.TextureLoader().load(img, function (imgObject) {
                    // var planeX=material_1.image.width;
                    // var planeY=material_1.image.height;
                    var sc = 20 / imgObject.image.height
                    var geometry_1 = new THREE.PlaneGeometry(planeX, planeY, 1, 1);

                    var plane = new THREE.Mesh(geometry_1, material_1);
                    plane.name = name == null ? img : name;
                    if (rotationX != "") {
                        plane.rotation.x = rotationX * Math.PI
                    }
                    if (rotationY != "") {
                        plane.rotation.y = rotationY * Math.PI
                    }
                    plane.position.x = positionX;
                    plane.position.y = positionY;
                    plane.position.z = positionZ;
                    plane.receiveShadow = true;

                    self.scene.add(plane);
                })
            });

        }
        ,

//添加球面
        addSphere() {
            var geometry_2 = new THREE.SphereGeometry(15, 20, 20);
            var material_2 = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/worship/mg.jpg')});
            var sphere = new THREE.Mesh(geometry_2, material_2);
            sphere.position.x = -250;
            sphere.position.y = -33;
            sphere.position.z = -230;
            sphere.castShadow = true;
            this.scene.add(sphere);
        }
        ,

        _onResize() {
            var {container} = this._config;
            this.update({
                width: container.clientWidth,
                height: container.clientHeight
            });
        }
        ,

        _initControl() {
            var self = this;
            var config = this._config;
            if (!config.supportTouch) {
                let fov;
                this._mouser = new Mouser();
                this._mouser.init({
                    container: config.container,

                    radius: config.radius,
                    onChange({lon, lat, scale}) {
                        if (scale) {
                            fov = self._config.fov / scale;
                            fov = Math.min(120, Math.max(fov, 60));
                            self.update({fov});
                        }
                        if (lon !== undefined && lat !== undefined) {
                            //超出范围，用fix来补
                            if (self._fix.lat + self._orient.lat + lat > 90) {
                                self._fix.lat = 90 - self._orient.lat - lat;
                            } else if (self._fix.lat + self._orient.lat + lat < -90) {
                                self._fix.lat = -90 - self._orient.lat - lat;
                            }
                            self._touch = {lon, lat};
                        }
                    }
                });
            }
            if (config.supportTouch) {
                let fov;
                this._toucher = new Toucher()
                this._toucher.init({
                    container: config.container,
                    radius: config.radius,
                    parentPanorama: self,
                    onChange({lon, lat, scale}) {
                        if (scale) {
                            fov = self._config.fov / scale;
                            fov = Math.min(120, Math.max(fov, 60));
                            self.update({fov});
                        }
                        if (lon !== undefined && lat !== undefined) {
                            //超出范围，用fix来补
                            if (self._fix.lat + self._orient.lat + lat > 90) {
                                self._fix.lat = 90 - self._orient.lat - lat;
                            } else if (self._fix.lat + self._orient.lat + lat < -90) {
                                self._fix.lat = -90 - self._orient.lat - lat;
                            }
                            self._touch = {lon, lat};
                        }
                    }
                });
            }
            if (config.supportOrient) {
                this._orienter = new Orienter()
                this._orienter.init({
                    onChange({lat, lon}) {
                        var {_fix} = self;
                        if (!_fix.isFixed) {
                            self._fix = {
                                lat: _fix.lat - lat,
                                lon: _fix.lon - lon,
                                isFixed: true
                            };
                        }
                        if (Math.abs(self._orient.lat - lat) >= 90) {
                            return;
                        }
                        //超出范围，用fix来补
                        if (self._fix.lat + self._touch.lat + lat > 90) {
                            self._fix.lat = 90 - self._touch.lat - lat;
                        } else if (self._fix.lat + self._touch.lat + lat < -90) {
                            self._fix.lat = -90 - self._touch.lat - lat;
                        }
                        self._orient = {lat, lon};
                    }
                })
            }
        }
        ,

        destroy() {
            this._mouser && this._mouser.unbind();
            this._toucher && this._toucher.unbind();
            this._orienter && this._orienter.destroy();
            this._bindResize && window.removeEventListener('resize', this._bindResize);
            cancelAnimationFrame(this._intFrame);
        }
        ,


        _animate() {
            var config = this._config;
            let lat = this._touch.lat + this._fix.lat + this._orient.lat;
            let lon = this._touch.lon + this._fix.lon + this._orient.lon;
            //外部传的经纬度
            let obj = config.onFrame(lon, lat) || {};
            lon += (obj.lon || 0);
            lat += (obj.lat || 0);
            lat = Math.max(-89, Math.min(89, lat));
            lat = THREE.Math.degToRad(lat);
            lon = THREE.Math.degToRad(lon);
            this.camera.target.x = 500 * Math.cos(lat) * Math.cos(lon);
            this.camera.target.y = 500 * Math.sin(lat);
            this.camera.target.z = 500 * Math.cos(lat) * Math.sin(lon);
            this.resize();
            this._intFrame = requestAnimationFrame(this._animate.bind(this));
        }
    }

}

//陀螺仪移动
var Orienter = function () {
    return {
        init(config) {
            this._config = Object.assign({
                onChange() {
                },
                onOrient() {
                }
            }, config);
            this.lon = this.lat = 0;
            this.moothFactor = 10;
            this.boundary = 320;
            this.isOpen = true;
            this.direction = window.orientation || 0;
            this.bind();
        },

        bind() {
            window.addEventListener('deviceorientation', this._bindChange = this._onChange.bind(this));
            window.addEventListener('orientationchange', this._bindOrient = this._onOrient.bind(this));
        },

        destroy() {
            window.removeEventListener('deviceorientation', this._bindChange, false);
            window.removeEventListener('orientationchange', this._bindOrient, false);
        },

        _onOrient(event) {
            this.direction = window.orientation;
            this._config.onOrient(event);
            this.lastLon = this.lastLat = undefined
        },

        _mooth(x, lx) { //插值为了平滑些
            if (lx === undefined) {
                return x;
            }
            //0至360,边界值特例，有卡顿待优化
            if (Math.abs(x - lx) > this.boundary) {
                if (lx > this.boundary) {
                    lx = 0;
                } else {
                    lx = 360;
                }
            }
            //滤波降噪
            x = lx + (x - lx) / this.moothFactor;
            return x;
        },

        _onChange(evt) {
            if (this.isOpen) {
                switch (this.direction) {
                    case 0 :
                        this.lon = -(evt.alpha + evt.gamma);
                        this.lat = evt.beta - 90;
                        break;
                    case 90:
                        this.lon = evt.alpha - Math.abs(evt.beta);
                        this.lat = evt.gamma < 0 ? -90 - evt.gamma : 90 - evt.gamma;
                        break;
                    case -90:
                        this.lon = -(evt.alpha + Math.abs(evt.beta));
                        this.lat = evt.gamma > 0 ? evt.gamma - 90 : 90 + evt.gamma;
                        break;
                }
                this.lon = this.lon > 0 ? this.lon % 360 : this.lon % 360 + 360;
                //插值为了平滑，修复部分android手机陀螺仪数字有抖动异常的
                this.lastLat = this.lat = this._mooth(this.lat, this.lastLat);
                this.lastLon = this.lon = this._mooth(this.lon, this.lastLon);
                this._config.onChange({
                    lon: this.lon,
                    lat: this.lat
                });
            }
        }
    }

}

//触屏移动
var Toucher = function () {
    return {
        init(config) {
            this.config = Object.assign({
                radius: 50,
                container: document.body,
                onStart() {
                },
                onMove() {
                },
                onEnd() {
                },
                onChange() {
                }
            }, config);
            this.lat = this.lon = 0;
            this.lastX = this.lastY = 0;
            this.lastDistance = 0;
            this.startX = this.startY = 0;
            this.speed = {lat: 0, lon: 0};
            this.deceleration = 0.5;
            this.parentPanorama = config.parentPanorama;

            this.factor = 50 / this.config.radius;
            this.bind();
        },

        bind() {
            var {container} = this.config;
            container.addEventListener('touchstart', this._bindStart = this._onStart.bind(this));
            container.addEventListener('touchmove', this._bindMove = this._onMove.bind(this));
            container.addEventListener('touchend', this._bindEnd = this._onEnd.bind(this));
        },

        unbind() {
            var {container} = this.config;
            container.removeEventListener('touchstart', this._bindStart);
            container.removeEventListener('touchmove', this._bindMove);
            container.removeEventListener('touchend', this._bindEnd);
        },

        _onStart(event) {

            var evt = event.changedTouches[0];
            this.startX = this.lastX = evt.clientX;
            this.startY = this.lastY = evt.clientY;
            this.startTime = Date.now();
            this.config.onStart(event);
            this.speed = {lat: 0, lon: 0};
            this.lastDistance = undefined;

        },

        _onMove(event) {
            event.preventDefault();
            var evt = event.changedTouches[0];
            switch (event.changedTouches.length) {
                case 1 :
                    if (!this.lastDistance) {
                        this.lon += (this.lastX - evt.clientX) * this.factor;
                        this.lat += (evt.clientY - this.lastY) * this.factor;
                        this.lastX = evt.clientX;
                        this.lastY = evt.clientY;
                        this.config.onChange({
                            lat: this.lat,
                            lon: this.lon
                        });
                    }
                    break;
                case 2:
                    var evt1 = event.changedTouches[1];
                    let distance = Math.abs(evt.clientX - evt1.clientX) + Math.abs(evt.clientY - evt1.clientY);
                    if (this.lastDistance === undefined) {
                        this.lastDistance = distance;
                    }
                    let scale = distance / this.lastDistance;
                    if (scale) {
                        this.config.onChange({scale});
                        this.lastDistance = distance;
                    }
            }
            this.config.onMove(event);
        },

        _onEnd(event) {
            //惯性
            let t = (Date.now() - this.startTime) / 5;
            this.speed = {
                lat: (this.startY - this.lastY) / t,
                lon: (this.startX - this.lastX) / t
            };
            this._inertance();
            this.config.onEnd(event);

        },

        _subSpeed(speed) {
            if (speed !== 0) {
                if (speed > 0) {
                    speed -= this.deceleration;
                    speed < 0 && (speed = 0);
                } else {
                    speed += this.deceleration;
                    speed > 0 && (speed = 0);
                }
            }
            return speed;
        },

        _inertance() {
            var speed = this.speed;
            speed.lat = this._subSpeed(speed.lat);
            speed.lon = this._subSpeed(speed.lon);
            this.lat -= speed.lat;
            this.lon += speed.lon;
            this.config.onChange({
                isUserInteracting: false,
                speed,
                lat: this.lat,
                lon: this.lon
            });
            if (speed.lat === 0 && speed.lon === 0) {
                this._intFrame && cancelAnimationFrame(this._intFrame);
                this._intFrame = 0;
            } else {
                this._intFrame = requestAnimationFrame(this._inertance.bind(this));
            }
        }
    }

}

//鼠标移动
var Mouser = function () {
    return {

        init(config) {
            this.config = Object.assign({
                radius: 50,
                container: document.body,
                onStart() {
                },
                onMove() {
                },
                onEnd() {
                },
                onChange() {
                }
            }, config);
            this.lat = this.lon = 0;
            this.lastX = this.lastY = 0;
            this.lastDistance = 0;
            this.startX = this.startY = 0;
            this.speed = {lat: 0, lon: 0};
            this.deceleration = 0.5;
            this.factor = 50 / this.config.radius;
            this.status = false;

            this.bind();
        },

        bind() {
            var {container} = this.config;
            container.addEventListener('mousedown', this._bindStart = this._onStart.bind(this));
            container.addEventListener('mousemove', this._bindMove = this._onMove.bind(this));
            container.addEventListener('mouseup', this._bindEnd = this._onEnd.bind(this));
        },

        unbind() {
            var {container} = this.config;
            container.removeEventListener('mousedown', this._bindStart);
            container.removeEventListener('mousemove', this._bindMove);
            container.removeEventListener('mouseup', this._bindEnd);
        },

        _onStart(event) {

            var evt = event;
            this.startX = this.lastX = evt.clientX;
            this.startY = this.lastY = evt.clientY;
            this.startTime = Date.now();
            this.config.onStart(event);
            this.speed = {lat: 0, lon: 0};
            this.lastDistance = undefined;
            this.status = true;
        },

        _onMove(event) {
            event.preventDefault();
            var evt = event;
            if (!this.lastDistance && this.status) {

                this.lon += (this.lastX - evt.clientX) * this.factor;
                this.lat += (evt.clientY - this.lastY) * this.factor;
                this.lastX = evt.clientX;
                this.lastY = evt.clientY;
                this.config.onChange({
                    lat: this.lat,
                    lon: this.lon
                });
            }
            this.config.onMove(event);
        },

        _onEnd(event) {
            //惯性
            let t = (Date.now() - this.startTime);
            this.speed = {
                lat: (this.startY - this.lastY) / t,
                lon: (this.startX - this.lastX) / t
            };
            this._inertance();
            this.config.onEnd(event);
            this.status = false;
        },

        _subSpeed(speed) {
            if (speed !== 0) {
                if (speed > 0) {
                    speed -= this.deceleration;
                    speed < 0 && (speed = 0);
                } else {
                    speed += this.deceleration;
                    speed > 0 && (speed = 0);
                }
            }
            return speed;
        },

        _inertance() {
            var speed = this.speed;
            speed.lat = this._subSpeed(speed.lat);
            speed.lon = this._subSpeed(speed.lon);
            this.lat -= speed.lat;
            this.lon += speed.lon;
            this.config.onChange({
                isUserInteracting: false,
                speed,
                lat: this.lat,
                lon: this.lon
            });
            if (speed.lat === 0 && speed.lon === 0) {
                this._intFrame && cancelAnimationFrame(this._intFrame);
                this._intFrame = 0;
            } else {
                this._intFrame = requestAnimationFrame(this._inertance.bind(this));
            }
        }
    }

}

window.Opanorama = Panorama;


