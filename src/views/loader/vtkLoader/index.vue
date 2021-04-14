<template>
  <div class="container">
    <div class="page-des">使用VTKLoader加载器加载3D兔子模型</div>
    <div
      id="vtkLoader"
      class="three-area"
    ></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader.js' // vtk文件加载器
import { WEBGL } from 'three/examples/jsm/WebGL.js' // 判断浏览器是否支持webGl
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module.js' // JavaScript性能监视器

export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      stats: null,
    }
  },
  mounted() {
    if (WEBGL.isWebGLAvailable()) {
      this.init()
      this.render()
    }
  },
  // destroyed(){
  //   this.camera = null
  //   this.scene = null
  //   this.renderer = null
  //   this.mesh = null
  //   this.controls = null
  //   this.stats = null
  // },
  methods: {
    init: function () {
      let _this = this
      const container = document.getElementById('vtkLoader')
      this.stats = new Stats() // JavaScript性能监视器
      this.stats.domElement.style.position = 'absolute'
      this.stats.domElement.style.top = '50px'
      this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
      container.appendChild(this.stats.domElement)

      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1e10);
      this.camera.position.z = 0.3;

      this.scene = new THREE.Scene();

      this.scene.add(this.camera);

      // light
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
      this.scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(2, 2, 2);
      this.scene.add(dirLight);

      var material = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });


      var loader = new VTKLoader();
      loader.load('/bunny.vtk', function (geometry) {
        geometry.center(); // 让3D模型居中显示
        geometry.computeVertexNormals(); // 计算面的法向量
        _this.mesh = new THREE.Mesh(geometry, material);
        // mesh.position.setY(- 0.09);
        _this.scene.add(_this.mesh);

      });

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.setClearColor(0x000000, 1)
      container.appendChild(this.renderer.domElement)

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // this.controls.addEventListener('change', this.render);//监听鼠标、键盘事件,如果使用animate方法时，将此函数删除
    },
    render() {
      this.stats.begin()
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      if (this.mesh) {
        this.mesh.rotation.y += 0.01
      }
      this.stats.end()
      requestAnimationFrame(this.render)
    },

  }
}
</script>