//定义容器
var container,
	camera, //定义摄像机，
	scene, //场景，
	controls, //控制器，
	renderer, //渲染器
	ambientLight, //环境光
	modelLoader, //模型加载器
	textureLoader, //贴图加载器
	stats, //状态监控器
	clock,

	onClickbaseSphere, //被点击的球
	baseSphere = [], //基本球组
	unrealBall = [], //用于被点击的球的判断区域，这样的虚拟球组
	sphereNameSprite = [], //用于存储点击球名字的精灵图数组
	particlesArray = [], //用于存储星空中的星群点集
	particlesControlsArray = [], //用于存储控制星星椭圆转动的 方向参数：turnArround, 以及 短轴长度 ovalB
	oldParticlesPositonArray = [
		[],
		[],
		[],
		[]
	], //用于存储星空中的星群点集之前的位置

	pyramid, //定义一个四棱锥Group对象
	pointsArray = [], //定义一个存储四棱锥group所有点的坐标的数组
	oldPointsArray = [],
	controlsPyramidArray = [], //用于存储椎体点运动的各种参数的数组
	currentRotationAngle = [], //当前椎体已经转动的角度
	angleRotation, //椎体转动的角度
	matrixRotation = [], //椎体的旋转矩阵

	starCloud, //星云(实现粒子聚散)
	cloudControls, //星云运动指示变量
	cloudPosition = [], //星云抵达指定位置时候的3维坐标
	copyCloudPoints = [], //cloudPosition的复制
	cloudMoveIn = [], //飞行距离
	isArrival = [], //是否抵达

	raycaster, //射线类
	mouse, //鼠标坐标
	angle, //用于记录每一帧星星转动的角度的绝对值
	maxA, //用于记录椭圆运动长轴的最大长度
	cloudAngle = [0, 0, 0], //星云转动的角度
	cloudRotationSpeed = [0.03, 0.02, 0.01], //星云转动速度
	cloudMoveout = [], //星云的飞出方向向量
	// cloudOpacity,//星云透明度变化速度

	oldCameraPosition, //原轨道位置
	cameraCurrentState = false, //摄像机状态记录变量，true 代表摄像机视点落在一个球上面，false 代表摄像机视点落在场景原点上面

	//屏幕后处理
	composer, clearPass, cubeTexturePassP, ldrUrls, renderPass, copyPass,

	//定义鼠标在屏幕上的坐标
	mouseX = 0,
	mouseY = 0,

	//定义窗口的大小（一半）
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	rotationCount = -1;



//document
doc = document,

	mixers = [], //动画矩阵数组

	//开始启动three
	startThree = function () {
		//判断浏览器是否支持WebGL
		if (!Detector.webgl) Detector.addGetWebGLMessage();
		//初始化方法
		init();
	},

	//初始化方法
	init = function () {

		//时间计时器
		clock = new THREE.Clock();
		//创建容器
		container = doc.createElement('div');

		//将容器加载进body中
		doc.body.appendChild(container);

		//初始化场景
		scene = new THREE.Scene();
		sphereGroup = new THREE.Group();
		// scene.add(sphereGroup);

		//初始化 摄像机原位置记录变量
		oldCameraPosition = new THREE.Vector3();

		//定义摄像机
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
		camera.position.z = 500;
		camera.lookAt(scene.position); //看向场景原点				
		scene.add(camera);

		oldCameraPosition.x = camera.position.x;
		oldCameraPosition.y = camera.position.y;
		oldCameraPosition.z = camera.position.z; //记录摄像机当前位置

		raycaster = new THREE.Raycaster(); //定义射线类
		mouse = new THREE.Vector2(0, 0); //鼠标坐标
		angle = 0.03; //设定当前星星转动的角度为零
		maxA = 80; //定义椭圆运动的长轴的最大长度
		pyramid = new THREE.Group(); //定义椎体group对象
		currentRotationAngle = 0; //当前椎体已经转动的角度
		angleRotation = 0.01; //椎体转动的角度
		matrixRotation = [
			[Math.cos(angleRotation), 0, Math.sin(angleRotation)],
			[0, 1, 0],
			[-1 * Math.sin(angleRotation), 0, Math.cos(angleRotation)],
		]; //椎体的旋转矩阵
		cloudControls = 0; //星云运动指示量


		//定义环境光
		ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
		scene.add(ambientLight);

		//定义并实例化贴图加载器
		textureLoader = new THREE.TextureLoader();

		//实例化OBJ模型加载器
		modelLoader = new THREE.FBXLoader();

		//载入基本球模型
		modelLoader.load('models/fbx/sphere.FBX', function (object) {

			// object.mixer = new THREE.AnimationMixer( object );
			// mixers.push( object.mixer );
			// let action = object.mixer.clipAction( object.animations[ 0 ] );
			//      action.play();
			// object.traverse( function ( child ) {
			//     if ( child.isMesh ) {
			//          child.castShadow = true;
			//          child.receiveShadow = true;
			//     };
			// });
			object.children[0].material.color.setHex(0x68e4ff);
			//产生8个球
			baseSphere[0] = object;
			for (var i = 1; i < 8; i++) {
				baseSphere[i] = baseSphere[0].clone();
				baseSphere[i].children[0].position = baseSphere[0].children[0].position.clone();
				baseSphere[i].children[0].material = baseSphere[0].children[0].material.clone();
			}

			//定位并且载入
			baseSphere[0].children[0].position.set(80, 80, 80);
			scene.add(baseSphere[0]);

			baseSphere[1].children[0].position.set(-80, 80, 80);
			scene.add(baseSphere[1]);

			baseSphere[2].children[0].position.set(80, -80, 80);
			scene.add(baseSphere[2]);

			baseSphere[3].children[0].position.set(-80, -80, 80);
			scene.add(baseSphere[3]);

			baseSphere[4].children[0].position.set(80, 80, -80);
			scene.add(baseSphere[4]);

			baseSphere[5].children[0].position.set(-80, 80, -80);
			scene.add(baseSphere[5]);

			baseSphere[6].children[0].position.set(80, -80, -80);
			scene.add(baseSphere[6]);

			baseSphere[7].children[0].position.set(-80, -80, -80);
			scene.add(baseSphere[7]);

			//创建虚拟球对象
			var geometry = new THREE.SphereBufferGeometry(24, 32, 32);
			var material = new THREE.MeshBasicMaterial({
				color: 0xffff00
			});
			material.transparent = true;
			material.opacity = 0;
			material.alphaTest = 0.1;
			var sphere = new THREE.Mesh(geometry, material);

			let positionTemp;
			for (var i = 0; i < baseSphere.length; i++) {
				unrealBall[i] = sphere.clone();
				positionTemp = baseSphere[i].children[0].position;
				unrealBall[i].position.set(positionTemp.x, positionTemp.y, positionTemp.z);
				scene.add(unrealBall[i]);
			} //创建虚拟球对象

			createSprite(); //将精灵图使用贴图加载器载入并且放入场景中

		});

		//加载爱心模型文件并将其定位
		modelLoader.load('models/fbx/haihang/aixin.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.position.set(unrealBall[0].position.x, unrealBall[0].position.y, unrealBall[0].position.z);
			// object.scale.x = 1.5;//模型x轴上放大1.5倍

			scene.add(object);
			// sphereGroup.add(object.children[0]);
		});

		//加载齿轮模型文件并将其定位
		modelLoader.load('models/fbx/haihang/chilun.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.children[0].position.set(unrealBall[1].position.x, unrealBall[1].position.y, unrealBall[1].position.z);
			scene.add(object);
			// sphereGroup.add(object.children[0]);
		});

		//加载灯泡模型文件并将其定位
		modelLoader.load('models/fbx/haihang/dengpao.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.children[0].position.set(unrealBall[2].position.x, unrealBall[2].position.y, unrealBall[2].position.z);
			scene.add(object);
		});

		//加载飞机模型文件并将其定位
		modelLoader.load('models/fbx/haihang/feiji.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.children[0].position.set(unrealBall[3].position.x, unrealBall[3].position.y, unrealBall[3].position.z);
			scene.add(object);
		});

		//加载金钱模型文件并将其定位
		modelLoader.load('models/fbx/haihang/jinqian.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.children[0].position.set(unrealBall[4].position.x, unrealBall[4].position.y, unrealBall[4].position.z);
			scene.add(object);
		});

		//加载机械手模型文件并将其定位
		modelLoader.load('models/fbx/haihang/jixieshou.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.children[0].position.set(unrealBall[5].position.x, unrealBall[5].position.y, unrealBall[5].position.z);
			scene.add(object);
		});

		//加载logo模型文件并将其定位
		modelLoader.load('models/fbx/haihang/logo.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.children[0].position.set(unrealBall[6].position.x, unrealBall[6].position.y, unrealBall[6].position.z);
			scene.add(object);
		});

		//加载柱状图模型文件并将其定位
		modelLoader.load('models/fbx/haihang/zhuzhuangtu.FBX', function (object) {
			object.children[0].material.color.setHex(0x68e4ff);
			object.children[0].position.set(unrealBall[7].position.x, unrealBall[7].position.y, unrealBall[7].position.z);
			scene.add(object);
		});

		// var axesHelper = new THREE.AxesHelper( 2500 );//一个轴对象显示坐标系
		// scene.add( axesHelper );

		//创建星空
		//  createStarrySky();

		//将原先星空中所有点的坐标记录下来
		// for(var i = 0;i < particlesArray.length; i++) {						
		// 	for(var j = 0; j <particlesArray[i].geometry.vertices.length; j++) {						
		// 		oldParticlesPositonArray[i][j] = particlesArray[i].geometry.vertices[j].clone();	
		// 	}
		// }

		//随机生成星星转动的控制数组
		// createParticlesControlsArray();

		//实例化椎体的group对象
		// createPyramid();

		//实例化控制椎体运动的数组
		// createControlsPyramidArray();

		//实例化星云对象
		createStarCloud();

		//实例化渲染器
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		//屏幕后处理，背景
		screenPostProcessingBackground();

		//实例化照相机控制器
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.enableRotate = true;
		controls.dampingFactor = 0.25;
		controls.enablePan = true;
		controls.screenSpacePanning = false;
		// controls.enableZoom = false;//禁用Z轴移动
		controls.rotateSpeed = 0.05;

		controls.autoRotate = false; //自动旋转
		controls.autoRotateSpeed = 0.5; //设置自动旋转的速度

		//实例化状态监视器
		stats = new Stats();
		container.appendChild(stats.dom);

		//定义鼠标移动时的方法
		doc.addEventListener('mousemove', onDocumentMouseMove, false);

		//定义鼠标点击时的方法
		doc.addEventListener('click', onDocumentMouseclick, false);

		//定义窗口重置方法
		window.addEventListener('resize', onWindowResize, false);
	},


	//窗口重置时启动的方法
	onWindowResize = function () {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

		let pixelRatio = renderer.getPixelRatio();
		composer.setSize(Math.floor(width / pixelRatio) || 1, Math.floor(height / pixelRatio) || 1);
	},

	//当鼠标移动时启动的方法
	onDocumentMouseMove = function (event) {

		mouseX = (event.clientX - windowHalfX) / 2;
		mouseY = (event.clientY - windowHalfY) / 2;
	},

	//当鼠标点击时启动的方法
	onDocumentMouseclick = function (event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		raycasterRender();
	},

	//帧循环方法
	animate = function () {
		requestAnimationFrame(animate);
		render();
	},

	//判断是否被点击以及点击后该做的事情
	raycasterRender = function () {

		raycaster.setFromCamera(mouse, camera); //更新光线
		var intersects = raycaster.intersectObjects(unrealBall); //生成对象是否被射线击中的判断数组
		if (intersects.length === 1 && cameraCurrentState == false) {
			var intersectsMash = intersects[0].object; //储存被点击的虚拟球
			var positionTransition = intersectsMash.position.clone(); //记录被点击虚拟球的坐标
			var tweenTarget = new TWEEN.Tween(controls.target)
				.to({
					x: positionTransition.x,
					y: positionTransition.y,
					z: positionTransition.z
				}, 1000)
				.start();
			var tweenCamera = new TWEEN.Tween(camera.position)
				.to({
					x: positionTransition.x,
					y: positionTransition.y,
					z: positionTransition.z + 120
				}, 1000)
				.start();
			cameraCurrentState = true;
		} else if (intersects.length === 0 && cameraCurrentState == true) {
			var tweenTarget = new TWEEN.Tween(controls.target)
				.to({
					x: scene.position.x,
					y: scene.position.y,
					z: scene.position.z
				}, 1000)
				.start();
			var tweenCamera = new TWEEN.Tween(camera.position)
				.to({
					x: oldCameraPosition.x,
					y: oldCameraPosition.y,
					z: oldCameraPosition.z
				}, 1000)
				.start();
			cameraCurrentState = false;
		}
		renderer.render(scene, camera);
	},

	//载入并定位点击球名字的精灵图
	createSprite = function () {

		var spriteMap = new THREE.TextureLoader().load("models/png/gl_name_aixin.png"); //载入爱心球名字的精灵图
		var spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[0] = new THREE.Sprite(spriteMaterial);


		spriteMap = new THREE.TextureLoader().load("models/png/gl_name_chilun.png"); //载入齿轮名字的精灵图
		spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[1] = new THREE.Sprite(spriteMaterial);

		spriteMap = new THREE.TextureLoader().load("models/png/gl_name_dengpao.png"); //载入灯泡名字的精灵图
		spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[2] = new THREE.Sprite(spriteMaterial);

		spriteMap = new THREE.TextureLoader().load("models/png/gl_name_feiji.png"); //载入飞机名字的精灵图
		spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[3] = new THREE.Sprite(spriteMaterial);

		spriteMap = new THREE.TextureLoader().load("models/png/gl_name_jinqian.png"); //载入金钱的精灵图
		spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[4] = new THREE.Sprite(spriteMaterial);

		spriteMap = new THREE.TextureLoader().load("models/png/gl_name_jixieshou.png"); //载入机械手名字的精灵图
		spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[5] = new THREE.Sprite(spriteMaterial);

		spriteMap = new THREE.TextureLoader().load("models/png/gl_name_logo.png"); //载入logo名字的精灵图
		spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[6] = new THREE.Sprite(spriteMaterial);

		spriteMap = new THREE.TextureLoader().load("models/png/gl_name_zhuzhuangtu.png"); //载入柱状图名字的精灵图
		spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap
		});
		sphereNameSprite[7] = new THREE.Sprite(spriteMaterial);

		for (var i = 0; i < sphereNameSprite.length; i++) {
			sphereNameSprite[i].material.transparent = true;
			sphereNameSprite[i].material.opacity = 0.8;
			sphereNameSprite[i].material.lights = true;
			sphereNameSprite[i].material.alphaTest = 0.1;
			sphereNameSprite[i].scale.x = 6;
			sphereNameSprite[i].scale.y = 2.5;
			sphereNameSprite[i].position.set(unrealBall[i].position.x + 30, unrealBall[i].position.y, unrealBall[i].position.z);
			scene.add(sphereNameSprite[i]);
		}
	},

	//载入并创建星空
	createStarrySky = function () {

		var geometry = new THREE.Geometry();
		for (var i = 0; i < 1000; i++) {
			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 1000 - 500;
			vertex.y = Math.random() * 1000 - 500;
			vertex.z = Math.random() * 1000 - 500;

			geometry.vertices.push(vertex);
		}

		var starPoint1 = textureLoader.load("textures/star/star1.png");
		var starPoint2 = textureLoader.load("textures/star/star2.png");
		var starPoint3 = textureLoader.load("textures/star/star3.png");
		var starPoint4 = textureLoader.load("textures/star/star4.png");

		//将加载好的材质wenj
		var starPoints = [
			[starPoint1, 35],
			[starPoint2, 25],
			[starPoint3, 15],
			[starPoint4, 10],
		];

		var sprites = [],
			materials = [],
			sizes = [];

		for (var i = 0; i < starPoints.length; i++) {
			sprites[i] = starPoints[i][0];
			sizes[i] = starPoints[i][1];

			materials[i] = new THREE.PointsMaterial({
				size: sizes[i],
				map: sprites[i],
				blending: THREE.AdditiveBlending,
				depthTest: false,
				transparent: true
			});
			var particles = new THREE.Points(geometry, materials[i]);

			particles.rotation.x = Math.random() * 8;
			particles.rotation.y = Math.random() * 8;
			particles.rotation.z = Math.random() * 8;
			particlesArray[i] = particles.clone();
		}
		scene.add(particlesArray[0]);
		scene.add(particlesArray[1]);
		scene.add(particlesArray[2]);
		scene.add(particlesArray[3]);
	},

	//创建星星运动控制数组
	createParticlesControlsArray = function () {
		for (let i = 0; i < particlesArray[0].geometry.vertices.length; i++) {
			// particlesControlsArray
			let turnArround; //方向参数
			let ovalB; //椭圆运动短轴长度
			let currentAngle; //当前的角度大小
			let ovalA; //椭圆运动长轴长度

			if (Math.random() - 0.5 < 0) {
				turnArround = false;
			} else {
				turnArround = true;
			}

			ovalA = Math.random() * maxA; //生成一个长轴a的长度

			ovalB = Math.random() * ovalA; //生成一个绝对小于长轴a长度的短轴b

			currentAngle = Math.random() * 2 * Math.PI;

			particlesControlsArray.push([turnArround, ovalB, currentAngle, ovalA]);

		}
	},

	//计算星星发生变化后当前的位置
	starCurrentPosition = function () {
		starOvalpositon();
	},

	//计算星星进行椭圆运动后当前的位置
	starOvalpositon = function () {

		let geometryTemp = particlesArray[0].geometry;
		let starPositionArray = geometryTemp.vertices;

		for (let i = 0; i < starPositionArray.length; i++) {
			// 椭圆运动中心点坐标：(oldParticlesPositonArray[i].x,oldParticlesPositonArray[i].y - 8)
			// 长轴长度：ovalA = particlesControlsArray[i][3]
			// 短轴：ovalB = particlesControlsArray[i][1] 
			// 转动方向：turnArround = particlesControlsArray[i][0] 
			// 当前的转动角度：currentAngle = particlesControlsArray[i][2] 

			var turnArround = particlesControlsArray[i][0];
			var ovalB = particlesControlsArray[i][1];
			var currentAngle = particlesControlsArray[i][2];
			var ovalA = particlesControlsArray[i][3]
			starPositionArray[i].setX(ovalA * Math.cos(currentAngle) + oldParticlesPositonArray[0][i].x);
			starPositionArray[i].setY(ovalB * Math.sin(currentAngle) + oldParticlesPositonArray[0][i].y - ovalB);
			if (turnArround == true) {
				particlesControlsArray[i][2] += angle;
				if (particlesControlsArray[i][2] > 2 * Math.PI) particlesControlsArray[i][2] = 0;
			} else {
				particlesControlsArray[i][2] -= angle;
				if (particlesControlsArray[i][2] < -2 * Math.PI) particlesControlsArray[i][2] = 0;
			}
		}
		geometryTemp.verticesNeedUpdate = true;
	},

	//实例化椎体的group对象
	createPyramid = function () {

		//为Pyramid添加粒子集群：pointsCluster
		pointsArray = [ //定位顶点的位置
			new THREE.Vector3(0, 80, 0),
			new THREE.Vector3(-50, 0, 50),
			new THREE.Vector3(-50, 0, -50),
			new THREE.Vector3(50, 0, -50),
			new THREE.Vector3(50, 0, 50),
		];
		for (let i = 0; i < pointsArray.length; i++) {
			oldPointsArray.push(pointsArray[i].clone());
		}
		//载入点材质文件和设置size
		var pointRed = textureLoader.load("textures/points/red_point.png"); //载入材质文件
		var pointBlue = textureLoader.load("textures/points/blue_point.png");

		//生成带有特定材质的点，，并放入pyramid中
		var pointmaterials = [];
		for (let i = 0; i < pointsArray.length; i++) {
			var geometry = new THREE.Geometry();
			geometry.vertices.push(pointsArray[i]);
			if (i === 0) {
				pointmaterials[i] = new THREE.PointsMaterial({
					size: 50,
					map: pointRed,
					blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true
				});

			} else {
				pointmaterials[i] = new THREE.PointsMaterial({
					size: 20,
					map: pointBlue,
					blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true
				});

			}
			var point = new THREE.Points(geometry, pointmaterials[i]);
			pyramid.add(point);
		}


		//为Pyramid添加线 line

		//开始生成所有线的 Geometry
		var geometryArray = [];
		//生成与四棱锥顶点 pointsArray[0] 与底点[1][2][3][4] 相连生成的四条直线
		for (let i = 1; i < pointsArray.length; i++) {
			geometryArray[i - 1] = new THREE.Geometry();
			geometryArray[i - 1].vertices.push(pointsArray[0]);
			geometryArray[i - 1].vertices.push(pointsArray[i]);
		}
		//生成四棱锥底面[1][2][3][4][1]前后两两依次相连的四条直线
		for (let i = 1; i < pointsArray.length; i++) {
			geometryArray[i + 3] = new THREE.Geometry();

			geometryArray[i + 3].vertices.push(pointsArray[i]);
			if (i === pointsArray.length - 1) {
				geometryArray[i + 3].vertices.push(pointsArray[1]);
			} else {
				geometryArray[i + 3].vertices.push(pointsArray[i + 1]);
			}

		}

		//生成线的材质					
		var lineMaterial = new THREE.LineBasicMaterial({
			color: 0x68e4ff
		}); //设置好线的材质

		//开始合成线集：lineCluster
		for (let i = 0, j = 0; i < geometryArray.length; i++, j++) {
			var line = new THREE.Line(geometryArray[i], lineMaterial);
			pyramid.add(line);
		}


		//将设置好的椎体对象放入场景sence中
		scene.add(pyramid);
	},

	//实例化控制椎体运动的数组
	createControlsPyramidArray = function () {

		// ( controlsPyramidArray[0] == direction[5] == 点的运动方向 ) : Boolean 
		// ( controlsPyramidArray[1] == maxDistance[5] == 点的最大位移距离 ) : float
		// ( controlsPyramidArray[2] == speed[5] == 点的位移速度 ) : float
		// ( controlsPyramidArray[3] == currentDistance[5] == 点的当前位移距离 ) : float
		var direction = [];
		var maxDistance = [];
		var speed = [];
		var currentDistance = [];

		//实例化direction数组
		for (var j = 0; j < pointsArray.length; j++) {
			var pointDirection = (Math.random() - 0.5 > 0) ? true : false;
			direction.push(pointDirection);
		}
		controlsPyramidArray.push(direction);

		//实例化maxDistance数组
		for (var j = 0; j < pointsArray.length; j++) {
			var distanceMax = Math.random() * 15;
			maxDistance.push(distanceMax);
		}
		controlsPyramidArray.push(maxDistance);

		//实例化speed数组
		for (var j = 0; j < pointsArray.length; j++) {
			var pointSpeed = Math.random() * 0.1;
			speed.push(pointSpeed);
		}
		controlsPyramidArray.push(speed);

		//实例化currentDistance数组
		for (var j = 0; j < pointsArray.length; j++) {
			var distance = 0;
			currentDistance.push(distance);
		}
		controlsPyramidArray.push(currentDistance);
	},

	//计算当前椎体每一个点发生的变化
	pyramidCurrentPosition = function () {

		// ControlsPyramidArray 点控制数组的名字			
		let pointsTemp = []; //引用椎体中点集数组
		for (let i = 0; i < pointsArray.length; i++) {
			pointsTemp.push(pyramid.children[i]);
		}

		let linesTemp = []; //引用椎体中线集数组
		for (let i = pointsArray.length; i < pyramid.children.length; i++) {
			linesTemp.push(pyramid.children[i]);
		}

		for (let i = 0; i < pointsArray.length; i++) {
			if (controlsPyramidArray[0][i] == true) {
				pointsArray[i].y += controlsPyramidArray[2][i];
				controlsPyramidArray[3][i] += controlsPyramidArray[2][i];
			} else {
				pointsArray[i].y -= controlsPyramidArray[2][i];
				controlsPyramidArray[3][i] -= controlsPyramidArray[2][i];
			}
			if (controlsPyramidArray[3][i] * controlsPyramidArray[3][i] > controlsPyramidArray[1][i] * controlsPyramidArray[1][i])
				controlsPyramidArray[0][i] = !controlsPyramidArray[0][i];
		}

		// 实现椎体绕Y轴不停的旋转
		pyramidRotation();

		//重新定位椎体所有点的位置
		for (let i = 0; i < pointsArray.length; i++) {
			pointsTemp[i].geometry.verticesNeedUpdate = true;
		}
		for (let i = 0; i < linesTemp.length; i++) {
			linesTemp[i].geometry.verticesNeedUpdate = true;
		}

	},

	//实现椎体绕Y轴不停的旋转
	pyramidRotation = function () {

		// angleRotation 椎体转动的角度
		// matrixRotation 椎体的旋转矩阵
		for (var i = 0; i < pointsArray.length; i++) {
			var x = oldPointsArray[i].x;
			var z = oldPointsArray[i].z;
			pointsArray[i].set(x * Math.cos(currentRotationAngle) - z * Math.sin(currentRotationAngle), pointsArray[i].y, x * Math.sin(currentRotationAngle) + z * Math.cos(currentRotationAngle));

			// pointsArray[i].set( -1 * x * Math.cos( currentRotationAngle ) , y, z * Math.sin( currentRotationAngle )  );
		}
		currentRotationAngle += angleRotation;
	},

	//创建星云对象
	createStarCloud = function () {
		//vertex.z = Math.random() * 5;	
		var geometry = new THREE.Geometry(); //定位所有星点的位置
		for (let i = 0; i < 1500; i++) {
			var vertex = new THREE.Vector3();
			if (i < 500) {
				vertex.x = Math.random() * 100 - 50;
				vertex.y = Math.random() * 10 + 13;
				vertex.z = 510;
			} else if (i > 999) {
				vertex.x = Math.random() * 100 - 50;
				vertex.y = -1 * (Math.random() * 10 + 13);
				vertex.z = 510;
			} else {
				vertex.x = Math.random() * 80 - 40;
				vertex.y = Math.random() * 10 - 5;
				vertex.z = 510;
			}
			geometry.vertices.push(vertex);
			cloudPosition.push(new THREE.Vector3(vertex.x, vertex.y, Math.random() * 5 + 5));
			cloudMoveIn.push(cloudPosition[i].z - 1000);
			isArrival.push(false);
			cloudMoveout.push(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1));
		}
		//载入星云中星星的材质
		var pointBlue = textureLoader.load("textures/points/blue_point.png");
		var starPointsMaterial = new THREE.PointsMaterial({
			size: 5,
			map: pointBlue,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			sizeAttenuation: true
		});

		starCloud = new THREE.Points(geometry, starPointsMaterial);
		scene.add(starCloud);
	},

	//计算星云运动后每一个点的位置
	cloudPointsPosition = function () {
		let cloudPoints = starCloud.geometry.vertices;
		if (cloudControls === 0) {
			for (let i = 0; i < cloudPoints.length; i++) {
				cloudPoints[i].z = (isArrival[i]) ? cloudPoints[i].z : cloudPoints[i].z + cloudMoveIn[i] / (50 + i % 100);
				isArrival[i] = (cloudPoints[i].z < cloudPosition[i].z) ? true : false;
			}
			if (cloudPoints[cloudPoints.length - 1].z < cloudPosition[cloudPoints.length - 1].z) {
				for (let i = 0; i < cloudPoints.length; i++) {
					copyCloudPoints[i] = cloudPoints[i].clone();
				}
				setTimeout(cloudControls++, 1000);
			}
		} else if (cloudControls === 1) {
			var i = 0;
			if (cloudAngle[0] >= Math.PI)
				i = 500;
			if (cloudAngle[1] >= Math.PI)
				i = 1000;
			for (; i < cloudPoints.length; i++) {
				cloudPoints[i].setX(copyCloudPoints[i].x * Math.cos(cloudAngle[parseInt(i / 500)]) - copyCloudPoints[i].z * Math.sin(cloudAngle[parseInt(i / 500)]));
				cloudPoints[i].setZ(copyCloudPoints[i].x * Math.sin(cloudAngle[parseInt(i / 500)]) + copyCloudPoints[i].z * Math.cos(cloudAngle[parseInt(i / 500)]));
			}
			for (let j = 0; j < 3; j++) {
				cloudAngle[j] += cloudRotationSpeed[j];
			}
			if (cloudAngle[2] >= Math.PI) {
				setTimeout(cloudControls++, 1000);
			}
		} else if (cloudControls === 2) {
			for (let i = 0; i < cloudPoints.length; i++) {
				cloudPoints[i].set(cloudPoints[i].x + cloudMoveout[i].x, cloudPoints[i].y + cloudMoveout[i].y, cloudPoints[i].z + cloudMoveout[i].z);
			}
			if (cloudPoints[0].x * cloudPoints[0].x + cloudPoints[0].y * cloudPoints[0].y + cloudPoints[0].z * cloudPoints[0].z > 20000)
				cloudControls++;
		} else if (cloudControls === 3) {
			starCloud.material.opacity -= 0.01;
			if (starCloud.material.opacity === 0) cloudControls++;
		}
		starCloud.geometry.verticesNeedUpdate = true;
	},

	//获取背景
	genCubeUrls = function (prefix, postfix) {
		return [
			prefix + 'skybox1x' + postfix,
			prefix + 'skybox2x' + postfix,
			prefix + 'skybox1x' + postfix,
			prefix + 'skybox2x' + postfix,
			prefix + 'skybox1x' + postfix,
			prefix + 'skybox2x' + postfix
		];
	},

	//通过后处理设置背景
	screenPostProcessingBackground = function () {

		composer = new THREE.EffectComposer(renderer);
		clearPass = new THREE.ClearPass(0x000000, 1.0);
		clearPass.enabled = true;
		composer.addPass(clearPass);

		cubeTexturePassP = new THREE.CubeTexturePass(camera);
		cubeTexturePassP.enabled = true;
		cubeTexturePassP.opacity = 1.0;
		composer.addPass(cubeTexturePassP);

		ldrUrls = genCubeUrls('textures/cube/pisa/', '.jpg');
		new THREE.CubeTextureLoader().load(ldrUrls, function (ldrCubeMap) {
			cubeTexturePassP.envMap = ldrCubeMap;
		});
		renderPass = new THREE.RenderPass(scene, camera);
		renderPass.enabled = true;
		renderPass.clear = false;
		composer.addPass(renderPass);

		copyPass = new THREE.ShaderPass(THREE.CopyShader);
		copyPass.renderToScreen = true;
		composer.addPass(copyPass);

	},


	//每一帧要做的事
	render = function () {

		if (stats != undefined)
			stats.update();
		if (controls != undefined)
			controls.update();
		// camera.lookAt(scene.position);
		// if (TWEEN)
		TWEEN.update();
		console.log(camera.position.z);
		//计算星星发生变化后当前的位置
		//  starCurrentPosition();

		//计算椎体发生变化后的位置
		// pyramidCurrentPosition();

		//计算星云中各个点的位置

		cloudPointsPosition();

		//-----------------------最近修改时间 2018/8/10 13:54 -------------------------------
		// let mixersLength = mixers.length;
		// if ( mixersLength > 0 ) {
		//     for ( let i = 0; i < mixersLength; i ++ ) {
		//         mixers[ i ].update( clock.getDelta() );
		//     }
		// }
		//------------------------------------------------------------------------------
		composer.render();


	};