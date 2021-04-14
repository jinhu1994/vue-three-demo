<template>
  <div class="container">
    <div class="page-des">WebGL高性能渲染，保持高帧数</div>
    <div
      ref="bufferGeometry"
      class="three-area"
    ></div>
  </div>

</template>

<script>
import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL.js' // 判断浏览器是否支持webGl
import Stats from 'three/examples/jsm/libs/stats.module.js' // JavaScript性能监视器
export default {
  data() {
    return {
      renderer: null,
      stats: null,
      camera: null,
      scene: null,
      mesh: null
    }
  },
  mounted() {
    if (WEBGL.isWebGLAvailable()) {
      this.init()
      this.render()
    }
  },
  methods: {
    init() {
      let _this = this
      const container = _this.$refs.bufferGeometry
      _this.stats = new Stats() // JavaScript性能监视器
      _this.stats.domElement.style.position = 'absolute'
      _this.stats.domElement.style.top = '50px'
      _this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
      container.appendChild(this.stats.domElement)

      _this.camera = new THREE.PerspectiveCamera(27, container.clientWidth / container.clientHeight, 5, 3500);
      _this.camera.position.z = 2750;

      _this.scene = new THREE.Scene();

      /**
       * Fog类定义的是线性雾，雾的密度是随着距离线性增大的，即场景中物体雾化效果随着随距离线性变化。
       * 构造函数雾Fog(color,near,far)的三个参数分别对应雾对象Fog的三个属性.color、.near和.far。
       * .color属性表示雾的颜色，比如设置为红色，场景中远处物体为黑色，场景中最近处距离物体是自身颜色，
       * 最远和最近之间的物体颜色是物体本身颜色和雾颜色的混合效果。
       */
      _this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);



      var particles = 500000; // 50万个粒子

      var geometry = new THREE.BufferGeometry();

      var positions = new Float32Array(particles * 3);

      // 每个顶点一种颜色
      var colors = new Float32Array(particles * 3);

      var color = new THREE.Color();

      var n = 800, n2 = n / 2;	// particles spread in the cube


      for (var i = 0; i < positions.length; i += 3) {

        // positions
        var x = Math.random() * n - n2;
        var y = Math.random() * n - n2;
        var z = Math.random() * n - n2;
        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;

        // point colors
        var vx = (x / n) + 0.5;
        var vy = (y / n) + 0.5;
        var vz = (z / n) + 0.5;

        color.setRGB(vx, vy, vz);

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      geometry.computeBoundingSphere(); // 计算集合体的边界

      const material = new THREE.PointsMaterial({
        size: 8,
        vertexColors: THREE.VertexColors
      });

      _this.mesh = new THREE.Points(geometry, material);
      _this.scene.add(_this.mesh);


      _this.renderer = new THREE.WebGLRenderer({ antialias: true });
      _this.renderer.setClearColor(_this.scene.fog.color);
      _this.renderer.setPixelRatio(window.devicePixelRatio);
      _this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(_this.renderer.domElement);

    },

    render() {
      let _this = this
      _this.stats.begin()
      _this.renderer.clear()
      _this.renderer.render(_this.scene, _this.camera)
      if (_this.mesh) {
        _this.mesh.rotation.x += 0.005
        _this.mesh.rotation.y += 0.01
      }
      _this.stats.end()
      requestAnimationFrame(_this.render)
    },
  }
}
</script>

<style>
</style>