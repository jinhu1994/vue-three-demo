<template>
  <div class="container">
    <div class="page-des">人物粒子系统</div>
    <div
      ref="figure"
      class="three-area"
    ></div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { LegacyJSONLoader } from '@/utils/LegacyJSONLoader.js'
import { BinaryLoader } from '@/utils/BinaryLoader.js'
var clock = new THREE.Clock();
export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      parent: null,
      mesh: null,
      clonesMeshes: [],
      meshes: [],
    }
  },
  mounted() {
    this.init()
    this.animate()
  },
  beforeDestroy() {
    if (this.camera) this.camera = null
    if (this.scene) this.scene = null
    if (this.renderer) this.renderer = null
    if (this.parent) this.parent = null
  },
  methods: {
    init() {
      const _this = this
      const container = _this.$refs.figure
      _this.camera = new THREE.PerspectiveCamera(20, container.clientWidth / container.clientHeight, 1, 50000)
      _this.camera.position.set(0, 700, 13000)

      _this.scene = new THREE.Scene()
      _this.scene.fog = new THREE.FogExp2(0x000104, 0.0000675);
      _this.camera.lookAt(_this.scene.position)

      // const axeshelper = new THREE.AxesHelper(5000)
      // _this.scene.add(axeshelper)

      const manager = new THREE.LoadingManager()
      manager.onProgress = (url, loaded, total) => {
        console.log(url, loaded, total)
      }

      // 粒子系统
      _this.parent = new THREE.Object3D()
      let grid = new THREE.Points(new THREE.PlaneBufferGeometry(15000, 15000, 64, 64), new THREE.PointsMaterial({
        color: 0xff0000, size: 10
      }));
      grid.position.y = -400;
      grid.rotation.x = -Math.PI / 2
      _this.parent.add(grid)
      _this.scene.add(_this.parent)

      // 初始化JSON模型加载器
      var jsonLoader = new LegacyJSONLoader(manager)

      // 加载场景模型
      jsonLoader.load("objModel/terrain.js", (geometry) => {
        _this.createMesh(geometry, _this.scene, 16.8, -11000, -200, -5000, 0x00ff44, false);
        _this.createMesh(geometry, _this.scene, 16.8, 11000, -200, -15000, 0x00ff33, false);
        _this.createMesh(geometry, _this.scene, 16.8, 0, -200, -15000, 0x00ff33, false);
        _this.createMesh(geometry, _this.scene, 16.8, 0, -200, 15000, 0x00ff33, false);
        _this.createMesh(geometry, _this.scene, 16.8, 11000, -200, 15000, 0x00ff22, false);
        _this.createMesh(geometry, _this.scene, 16.8, -11000, -200, 5000, 0x00ff11, false);
        _this.createMesh(geometry, _this.scene, 16.8, 13000, -200, 5000, 0x00ff55, false);
        _this.createMesh(geometry, _this.scene, 16.8, 13000, -200, -5000, 0x00ff66, false);
      })

      // 初始化Binary模型
      var binaryLoader = new BinaryLoader()

      // 加载汽车模型
      binaryLoader.load("objModel/veyron/VeyronNoUv_bin.js", (geometry) => {
        _this.createMesh(geometry, _this.scene, 6.8, 2200, -200, -100, 0x0055ff, false)
      })

      // 加载男人模型
      binaryLoader.load("/objModel/female02/Female02_bin.js", (geometry) => {
        _this.createMesh(geometry, _this.scene, 4.05, -1000, -350, 0, 0xffdd44, true);
        _this.createMesh(geometry, _this.scene, 4.05, 0, -350, 0, 0xffffff, true);
        _this.createMesh(geometry, _this.scene, 4.05, 1000, -350, 400, 0xff4422, true);
        _this.createMesh(geometry, _this.scene, 4.05, 250, -350, 1500, 0xff9955, true);
        _this.createMesh(geometry, _this.scene, 4.05, 250, -350, 2500, 0xff77dd, true);
      })

      // 加载女人模型
      binaryLoader.load("objModel/male02/Male02_bin.js", (geometry) => {
        _this.createMesh(geometry, _this.scene, 4.05, -500, -350, 600, 0xff7744, true);
        _this.createMesh(geometry, _this.scene, 4.05, 500, -350, 0, 0xff5522, true);
        _this.createMesh(geometry, _this.scene, 4.05, -250, -350, 1500, 0xff9922, true);
        _this.createMesh(geometry, _this.scene, 4.05, -250, -350, -1500, 0xff99ff, true);
      })


      _this.renderer = new THREE.WebGLRenderer({ antialias: false });
      _this.renderer.setClearColor(_this.scene.fog.color);
      _this.renderer.setPixelRatio(window.devicePixelRatio) // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
      _this.renderer.setSize(container.clientWidth, container.clientHeight) // 将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小
      _this.renderer.autoClear = false; // 定义渲染器是否在渲染每一帧之前自动清除其输出。
      _this.renderer.sortObjects = false; // 定义渲染器是否应对对象进行排序。默认是true.
      container.appendChild(_this.renderer.domElement);

    },


    /**
     *  @param {Geometry} orginalGeometry 几何模型
     *  @param {Scene} scene 场景
     *  @param {Number} scale 缩放比
     *  @param {Number} x 在Vetor3D中的X坐标
     *  @param {Number} y 在Vetor3D中的Y坐标
     *  @param {Number} z 在Vetor3D中的Z坐标
     *  @param {string} color 颜色
     *  @param {Boolean} dynamic 是否是动态的
     */
    createMesh(orginalGeometry, scene, scale, x, y, z, color, dynamic) {
      const _this = this
      // 获取顶点的位置
      var vertices = orginalGeometry.vertices
      var vLegnth = vertices.length

      // 几何体对象和相关属性
      var geometry = new THREE.Geometry()
      var vertices_tmp = [] // x,y,z,down,up

      for (let i = 0; i < vLegnth; i++) {

        let p = vertices[i]
        geometry.vertices[i] = p.clone()

        vertices_tmp[i] = [p.x, p.y, p.z, 0, 0]
      }

      // 人的位置
      var clones = [
        [6000, 0, -4000],
        [5000, 0, 0],
        [1000, 0, 5000],
        [1000, 0, -5000],
        [4000, 0, 2000],
        [-4000, 0, 1000],
        [-5000, 0, -5000],
        [0, 0, 0] // 原始位置
      ];

      // 模型上到下，或者下到上，静态的物体，动态物体 ，生产points
      if (dynamic) {
        for (let j = 0; j < clones.length; j++) {

          let c = (j < clones.length - 1) ? 0x252525 : color;

          _this.mesh = new THREE.Points(geometry, new THREE.PointsMaterial({
            color: color,
            size: 3
          }))

          _this.mesh.scale.x = _this.mesh.scale.y = _this.mesh.scale.z = scale;
          _this.mesh.position.x = x + clones[j][0];
          _this.mesh.position.y = y + clones[j][1];
          _this.mesh.position.z = z + clones[j][2];

          _this.parent.add(_this.mesh);

          // 将所有的对象放进数组
          _this.clonesMeshes.push({ mesh: _this.mesh, speed: 0.5 + Math.random() })
        }
      } else {
        _this.mesh = new THREE.Points(geometry, new THREE.PointsMaterial({
          color: color,
          size: 3
        }))

        _this.mesh.scale.x = _this.mesh.scale.y = _this.mesh.scale.z = scale;
        _this.mesh.position.x = x;
        _this.mesh.position.y = y;
        _this.mesh.position.z = z;

        _this.parent.add(_this.mesh);
      }

      // 设置一些初始化的参数，方向
      _this.meshes.push({
        mesh: _this.mesh,
        vertices: geometry.vertices,
        vertices_tmp: vertices_tmp,
        vl: vLegnth,
        down: 0,
        up: 0,
        direction: 0,
        speed: 35,
        delay: Math.floor(200 + 200 * Math.random()), //到最高点停留的时间
        started: false,
        start: Math.floor(100 + 200 * Math.random()),
        dynamic: dynamic
      })
    },


    animate() {
      requestAnimationFrame(this.animate)
      this.render()
    },

    render() {

      const _this = this
      // 计算每一帧的时间
      let delta = 10 * clock.getDelta();

      delta < 2 ? delta : 2

      _this.parent.rotation.y += -0.02 * delta

      // 根据模型的 动/静状态 调整模型每个顶点的位置 
      for (let i = 0; i < _this.meshes.length; i++) {
        let item = _this.meshes[i]
        let mesh = item.mesh
        let vertices = item.vertices
        let vertices_tmp = item.vertices_tmp
        let vl = item.vl

        // 判断粒子是否是动态的
        if (!item.dynamic) continue

        // 最开始的时候，没有移动，设置移动，向下
        if (item.start > 0) {
          item.start -= 1
        } else {
          // 开始动画
          if (!item.started) {
            item.started = true
            item.direction = -1
          }
        }

        for (let j = 0; j < vl; j++) {
          let p = vertices[j]
          let vt = vertices_tmp[j]
          // 向下运动
          if (item.direction < 0) {
            if (p.y > 0) {
              p.x += 1.5 * (0.50 - Math.random()) * item.speed * delta;
              // 向下的概念明显大于向上的概率，所以整个人物总有一个时刻是向下的。
              p.y += 3.0 * (0.15 - Math.random()) * item.speed * delta;
              p.z += 1.5 * (0.50 - Math.random()) * item.speed * delta;
            } else {
              if (!vt[3]) {
                vt[3] = 1
                item.down += 1 // 记录运动到最底下模型点的个数
              }
            }
          }

          // 向上运动
          if (item.direction > 0) {
            let d = Math.abs(p.x - vt[0]) + Math.abs(p.y - vt[1]) + Math.abs(p.z - vt[2])

            if (d > 1) {
              p.x += -(p.x - vt[0]) / d * item.speed * delta * (0.85 - Math.random());
              p.y += -(p.y - vt[1]) / d * item.speed * delta * (1 + Math.random());
              p.z += -(p.z - vt[2]) / d * item.speed * delta * (0.85 - Math.random());

            } else {
              if (!vt[4]) {
                vt[4] = 1;
                item.up += 1;
              }
            }
          }
        }

        if (item.down === vl) {
          if (item.delay === 0) {
            item.direction = 1;
            item.speed = 10;
            item.down = 0;
            item.delay = 300;

            for (i = 0; i < vl; i++) {
              vertices_tmp[i][3] = 0;
            }

          } else {
            item.delay -= 1;
          }
        }

        if (item.up === vl) {
          if (item.delay === 0) {
            item.direction = -1;
            item.speed = 10;
            item.up = 0;
            item.delay = 300;

            for (i = 0; i < vl; i++) {
              vertices_tmp[i][4] = 0;
            }

          } else {
            item.delay -= 1;
          }
        }


        mesh.geometry.verticesNeedUpdate = true;
      }

      _this.renderer.clear()
      _this.renderer.render(_this.scene, _this.camera)
    }


  }
}
</script>
