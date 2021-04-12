<template>
  <div class="container">
    <div class="page-des">css3 Renderer</div>
    <div
      ref="css3Renderer"
      class="css3"
    ></div>
  </div>

</template>

<script>
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import CSS3DObject from 'three-css3drenderer';
export default {
  data() {
    return {
      num: 300,
      camera: null,
      scene: null,
      renderer: null,
      group: null,
      duration: 2000,
      rotSpeed: 0.05,
      objects: [],
      targets: { grid: [], sphere: [], helix: [] }

    }
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      let _this = this
      let container = this.$refs.css3Renderer
      // 创建渲染器
      _this.renderer = new CSS3DRenderer()
      _this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(_this.renderer.domElement);

      //创建相机
      _this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 1, 10000);
      _this.camera.position.z = 6000;

      //创建场景
      _this.scene = new THREE.Scene();

      //创建网格模型
      _this.group = new THREE.Object3D();

      for (var i = 0; i < _this.num; i++) {

        var element = document.createElement('div');
        element.className = 'element';
        element.style.opacity = Math.random() * 0.7 + 0.3;

        var object = new CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 2000 - 2000;
        _this.group.add(object);

        _this.objects.push(object);


        var object = new THREE.Object3D();

        object.position.x = ((i % 5) * 400) - 800;
        object.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
        object.position.z = (Math.floor(i / 25)) * 1000 - 3000;

        _this.targets.grid.push(object);
      }

      scene.add(group);

      // sphere
      var vector = new THREE.Vector3();

      for (var i = 0, l = _this.objects.length; i < l; i++) {

        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var object = new THREE.Object3D();

        object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
        object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
        object.position.z = 800 * Math.cos(phi);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        _this.targets.sphere.push(object);

      }

      // helix
      var vector = new THREE.Vector3();

      for (var i = 0, l = _this.objects.length; i < l; i++) {

        var phi = i * 0.175 + Math.PI;

        var object = new THREE.Object3D();

        object.position.x = 1200 * Math.sin(phi);
        object.position.y = - (i * 8) + 1200;
        object.position.z = 1200 * Math.cos(phi);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        _this.targets.helix.push(object);

      }

      transform(_this.targets.sphere, _this.duration);

      setTimeout(function () {
        transform(_this.targets.grid, _this.duration);
      }, duration + 500);

      setTimeout(function () {
        transform(_this.targets.helix, _this.duration);
      }, duration * 2 + 1000);

      container.addEventListener('resize', onWindowResize, false);
    },


    onWindowResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    },

    transform(targets, duration) {

      TWEEN.removeAll();

      for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
          .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

      }
    },

    animate() {
      let _this = this
      _this.group.rotation.y += _this.rotSpeed;
      requestAnimationFrame(animate);
      TWEEN.update();
      _this.renderer.render(_this.scene, _this.camera);
    }
  }
}
</script>

<style scoped>
.container {
  background: #000;
}
.element {
  width: 80px;
  height: 100px;
  animation: blink 5s ease-in infinite;
}
@keyframes blink {
  0% {
    background: blue;
  }
  50% {
    background: red;
  }
  100% {
    background: yellow;
  }
}
</style>
