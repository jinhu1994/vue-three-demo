<template>
  <div class="container">
    <div class="page-des">使用ObjLoader加载器加载人物模型</div>
    <div
      ref="objLoader"
      class="three-area"
    ></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: 0,
      windowHalfY: 0
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
    if (this.mesh) this.mesh = null
  },
  methods: {
    init: function () {
      let _this = this
      const container = _this.$refs.objLoader
      _this.windowHalfX = container.clientWidth / 2
      _this.windowHalfY = container.clientHeight / 2

      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 2000);
      this.camera.position.z = 200;

      this.scene = new THREE.Scene();

      this.scene.add(this.camera);

      /**
       * light
       * AmbientLight( color : Integer, intensity : Float )
       * color - (参数可选）颜色的rgb数值。缺省值为 0xffffff。
       * intensity - (参数可选)光照的强度。缺省值为 1。
       */
      const ambient = new THREE.AmbientLight(0x101030);
      this.scene.add(ambient);

      var directionalLight = new THREE.DirectionalLight(0xffeedd);
      directionalLight.position.set(0, 0, 1);
      this.scene.add(directionalLight);

      // texture
      var manager = new THREE.LoadingManager();
      manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
      };
      var texture = new THREE.Texture();
      var loader = new THREE.ImageLoader(manager);
      loader.load('textureImage/UV_Grid_Sm.jpg', function (image) {

        texture.image = image;
        texture.needsUpdate = true;

      });

      // model
      var loader = new OBJLoader(manager);
      loader.load('/objModel/male02.obj', function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.map = texture;
          }
        });
        object.position.y = - 80;
        _this.scene.add(object);

      }, onProgress, onError);

      var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
          var percentComplete = xhr.loaded / xhr.total * 100;
          console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
      };

      var onError = function (xhr) {
      };


      _this.renderer = new THREE.WebGLRenderer({ antialias: true })
      _this.renderer.setPixelRatio(window.devicePixelRatio);
      _this.renderer.setSize(container.clientWidth, container.clientHeight);
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