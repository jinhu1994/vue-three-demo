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

export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
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
  },
  methods: {
    init() {
      const _this = this
      const container = _this.$refs.figure
      _this.camera = new THREE.PerspectiveCamera(20, container.clientWidth / container.clientHeight, 1, 50000)
      _this.camera.position.set(0, 700, 7000)

      _this.scene = new THREE.Scene()
      _this.scene.fog = new THREE.FogExp2(0x000104, 0.0000675);
      _this.camera.lookAt(_this.scene.position)

      const manager = new THREE.LoadingManager()
      manager.onProgress = (url, loaded, total) => {
        console.log(url, loaded, total)
      }

      // 加载JSON模型
      var jsonLoader = new LegacyJSONLoader(manager)
      jsonLoader.load("objModel/terrain.js", (geometry) => {
        console.log("jsonLoader-------->", geometry)
        let material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true
        })
        let mesh = new THREE.Mesh(geometry, material)
        _this.scene.add(mesh)
      })

      // 加载Binary模型
      var binaryLoader = new BinaryLoader()
      binaryLoader.load("objModel/male02/Male02_bin.js", (geometry) => {
        let material = new THREE.MeshBasicMaterial({
          color: 0xFF0000,
          wireframe: true
        });
        let mesh = new THREE.Mesh(geometry, material);
        _this.scene.add(mesh);
      })

      // 粒子系统
      let parent = new THREE.Object3D()
      let grid = new THREE.Points(new THREE.PlaneBufferGeometry(15000, 15000, 64, 64), new THREE.PointsMaterial({
        color: 0xff0000, size: 10
      }));
      grid.position.y = -400;
      grid.rotation.x = -Math.PI / 2
      parent.add(grid)
      _this.scene.add(parent)


      _this.renderer = new THREE.WebGLRenderer({ antialias: false });
      _this.renderer.setPixelRatio(window.devicePixelRatio) // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
      _this.renderer.setSize(container.clientWidth, container.clientHeight) // 将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小
      _this.renderer.autoClear = false; // 定义渲染器是否在渲染每一帧之前自动清除其输出。
      _this.renderer.sortObjects = false; // 定义渲染器是否应对对象进行排序。默认是true.
      container.appendChild(_this.renderer.domElement);

    },


    animate() {
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.animate)
    },


  }
}
</script>
