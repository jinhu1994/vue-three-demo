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
//   destroyed() {
//     this.camera = null
//     this.scene = null
//     this.renderer = null
//     this.mesh = null
//     this.stats = null
//   },
  methods: {
    init() {
      let _this = this
      const container = _this.$refs.bufferGeometry
      _this.stats = new Stats() // JavaScript性能监视器
      _this.stats.domElement.style.position = 'absolute'
      _this.stats.domElement.style.top = '50px'
      _this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
      container.appendChild(this.stats.domElement)

      _this.camera = new THREE.PerspectiveCamera(27, container.clientWidth / container.clientHeight, 1, 3500);
      _this.camera.position.z = 2750;

      _this.scene = new THREE.Scene();

      /**
       * Fog类定义的是线性雾，雾的密度是随着距离线性增大的，即场景中物体雾化效果随着随距离线性变化。
       * 构造函数雾Fog(color,near,far)的三个参数分别对应雾对象Fog的三个属性.color、.near和.far。
       * .color属性表示雾的颜色，比如设置为红色，场景中远处物体为黑色，场景中最近处距离物体是自身颜色，
       * 最远和最近之间的物体颜色是物体本身颜色和雾颜色的混合效果。
       */
      _this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);

      // 设置环境光  环境光会均匀的照亮场景中的所有物体。
      const light = new THREE.AmbientLight(0xffffff);
      _this.scene.add(light);

      /**
       *  平行光
       *  DirectionalLight( color : Integer, intensity : Float )
       *  color - (可选参数) 16进制表示光的颜色。 缺省值为 0xffffff (白色)。
       *  intensity - (可选参数) 光照的强度。缺省值为1。
       */
      var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
      light1.position.set(1, 1, 1);
      _this.scene.add(_this.light1);

      var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
      light2.position.set(0, -1, 0);
      _this.scene.add(_this.light2);

      var triangles = 1600000; // 160万个三角形

      var geometry = new THREE.BufferGeometry();

      var positions = new Float32Array(triangles * 3 * 3);
      // 这里是每个顶点一个法线，也可以一个面一个法线
      var normals = new Float32Array(triangles * 3 * 3);
      // 每个顶点一种颜色
      var colors = new Float32Array(triangles * 3 * 3);

      var color = new THREE.Color();

      var n = 800, n2 = n / 2;	// triangles spread in the cube
      var d = 12, d2 = d / 2;	// individual triangle size

      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();

      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();

      for (var i = 0; i < positions.length; i += 9) {

        // positions
        var x = Math.random() * n - n2;
        var y = Math.random() * n - n2;
        var z = Math.random() * n - n2;

        var ax = x + Math.random() * d - d2;
        var ay = y + Math.random() * d - d2;
        var az = z + Math.random() * d - d2;

        var bx = x + Math.random() * d - d2;
        var by = y + Math.random() * d - d2;
        var bz = z + Math.random() * d - d2;

        var cx = x + Math.random() * d - d2;
        var cy = y + Math.random() * d - d2;
        var cz = z + Math.random() * d - d2;

        positions[i] = ax;
        positions[i + 1] = ay;
        positions[i + 2] = az;

        positions[i + 3] = bx;
        positions[i + 4] = by;
        positions[i + 5] = bz;

        positions[i + 6] = cx;
        positions[i + 7] = cy;
        positions[i + 8] = cz;

        // flat face normals
        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        var nx = cb.x;
        var ny = cb.y;
        var nz = cb.z;

        normals[i] = nx;
        normals[i + 1] = ny;
        normals[i + 2] = nz;

        normals[i + 3] = nx;
        normals[i + 4] = ny;
        normals[i + 5] = nz;

        normals[i + 6] = nx;
        normals[i + 7] = ny;
        normals[i + 8] = nz;

        // point colors
        var vx = (x / n) + 0.5;
        var vy = (y / n) + 0.5;
        var vz = (z / n) + 0.5;

        color.setRGB(vx, vy, vz);

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;

        colors[i + 3] = color.r;
        colors[i + 4] = color.g;
        colors[i + 5] = color.b;

        colors[i + 6] = color.r;
        colors[i + 7] = color.g;
        colors[i + 8] = color.b;

      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      geometry.computeBoundingSphere(); // 计算集合体的边界

      var material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
      });

      _this.mesh = new THREE.Mesh(geometry, material);
      _this.scene.add(_this.mesh);

      //

      _this.renderer = new THREE.WebGLRenderer({ antialias: true });
      _this.renderer.setClearColor(_this.scene.fog.color);
      _this.renderer.setPixelRatio(window.devicePixelRatio);
      _this.renderer.setSize(container.clientWidth, container.clientHeight);

      //   _this.renderer.gammaInput = true;
      //   _this.renderer.gammaOutput = true;

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