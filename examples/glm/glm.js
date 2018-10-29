class GLMap {
  constructor(container, options) {
    this.options = {
      scale: 1.5,
      minScale: 0,
      maxScale: 100,
      background: 0xffffff
    };
    this._center = { x: 0, y: 0 };
    this._scale = 1;

    Object.assign(this.options, options);
    this._container = container;
    this._init();
  }

  _init() {
    let width = this._container.getBoundingClientRect().width;
    let height = this._container.getBoundingClientRect().height;
    this._scene = new THREE.Scene({ background: this.options.background });
    this._camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    );
    this._camera.position.z = 5;

    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(width, height);
    this._renderer.domElement.style.width = "100%";
    this._renderer.domElement.style.height = "100%";
    this._container.appendChild(this._renderer.domElement);

    let isMousedown = false;
    let lastMouseX, lastMouseY;
    this._renderer.domElement.addEventListener("mousedown", evt => {
      lastMouseX = evt.pageX;
      lastMouseY = evt.pageY;
      isMousedown = true;
    });
    this._renderer.domElement.addEventListener("mouseup", evt => {
      isMousedown = false;
    });
    this._mouse = new THREE.Vector2();
    this._renderer.domElement.addEventListener("mousemove", evt => {
      if (isMousedown) {
        let dx = lastMouseX - evt.pageX;
        let dy = evt.pageY - lastMouseY;
        lastMouseX = evt.pageX;
        lastMouseY = evt.pageY;
        this._camera.position.x += dx * this._camera.scale.x;
        this._camera.position.y += dy * this._camera.scale.y;
        this._update();
      }
    });
    this._renderer.domElement.addEventListener("mousewheel", evt => {
      let offset = evt.wheelDelta / 120;
      let scale = this._camera.scale.x * Math.pow(this.options.scale, -offset);
      this.setScale(scale);
    });

    this._pickingTexture = new THREE.WebGLRenderTarget(width, height);
    this.pickingSceneArr = [];
    // this._pickingTexture.texture.minFilter = THREE.LinearFilter;

    this._update();
  }

  _update() {
    this._renderer.render(this._scene, this._camera);
    // this.pickingSceneArr.forEach(
    //   (pickingScene)=>{
    //     this._renderer.render(pickingScene, this._camera, this._pickingTexture);
    //   }
    // );
  }
  /**
   *
   * @param {*} Event 绑定的事件类型
   * @param {*} pickingScene  绑定的点击层
   * @param {*} fun 绑定的事件 返回图形的index
   */
  addEventListener(Event, pickingScene, fun) {
    this._renderer.domElement.addEventListener(Event, evt => {
      this._mouse.x = evt.clientX;
      this._mouse.y = evt.clientY;
      this._update();
      this._renderer.render(pickingScene, this._camera, this._pickingTexture);

      var pixelBuffer = new Uint8Array(4);
      this._renderer.readRenderTargetPixels(
        this._pickingTexture,
        this._mouse.x,
        this._pickingTexture.height - this._mouse.y,
        1,
        1,
        pixelBuffer
      );
      //interpret the pixel as an ID
      var id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
      fun(id);
      this._update();
    });
  }
  setCenter(x, y) {
    this._camera.position.x = x;
    this._camera.position.y = y;
    this._update();
  }
  getCenter() {
    return this._center;
  }

  setScale(scale) {
    if (scale <= this.options.maxScale && scale >= this.options.minScale) {
      this._scale = scale;
      this._camera.scale.x = scale;
      this._camera.scale.y = scale;
      console.log(scale);
      this._update();
    }
  }
  getScale() {
    return this._scale;
  }

  centerAndScale(x, y, scale) {
    this._camera.position.x = x;
    this._camera.position.x = y;
    if (scale <= this.options.maxScale && scale >= this.options.minScale) {
      this._scale = scale;
      this._camera.scale.x = scale;
      this._camera.scale.y = scale;
    }
    this._update();
  }
  /**
   * 多边形集合添加到地图上作为一个图层
   * @param {*} points 多边形顶点集合 [[[x,y],...],...]
   * @param {*} color 填充颜色 0xffffff
   * @param {*} enabledMouseEvent  是否启用鼠标事件
   */
  addGeometryLayer(points, color, enabledMouseEvent) {
    var geometriesDrawn = [];
    var geometriesPicking = [];
    var Color = new THREE.Color();
    points.forEach((ps, index) => {
      if (ps.length > 2) {
        var shape = new THREE.Shape();
        shape.moveTo(ps[0][0], ps[0][1]);
        for (let i = 1; i < ps.length; i++) shape.lineTo(ps[i][0], ps[i][1]);
        var geometry2 = new THREE.ShapeBufferGeometry(shape);
        // console.log(shape,geometry2);
        geometriesDrawn.push(geometry2);
        if (enabledMouseEvent) {
          var Pickgeometry = geometry2.clone();
          this.applyVertexColors(Pickgeometry, Color.setHex(index + 1));
          geometriesPicking.push(Pickgeometry);
        }
      }
    });
    var objects = new THREE.Mesh(
      THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn),
      new THREE.MeshBasicMaterial({ color })
    );
    this._scene.add(objects);
    if (enabledMouseEvent) {
      var pickingScene = new THREE.Scene();
      var pickingMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors
      });

      pickingScene.add(
        new THREE.Mesh(
          THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesPicking),
          pickingMaterial
        )
      );
      objects.pickingScene = pickingScene;
      this.pickingSceneArr.push(pickingScene);
      /**
       * 获取id次图形的点数据
       */
      objects.getPoints = function(id) {
        return points[id - 1];
      };
    }
    this._update();

    return objects;
  }
  addGeometryLayer2(geometriesDrawn, color, enabledMouseEvent) {
    var objects = new THREE.Mesh(
      THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn),
      new THREE.MeshBasicMaterial({ color })
    );
    this._scene.add(objects);
    this._update();

    return objects;
  }
  removeGeometryLayer(geometryLayer) {
    this._scene.remove(geometryLayer);
    this._update();
  }
  //使用index
  applyVertexColors(geometry, color) {
    var position = geometry.attributes.position;
    var colors = [];
    for (var i = 0; i < position.count; i++) {
      colors.push(color.r, color.g, color.b);
    }
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  }
}
