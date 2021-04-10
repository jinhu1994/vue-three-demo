<template>
  <div class="container">
    <div class="page-des">使用Texture模拟真实环境</div>
    <div
      id="texture"
      class="three-area"
    ></div>
  </div>
</template>
<script>
import * as THREE from 'three'
//import Stats from 'stats-js' // JavaScript性能监视器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      boxMesh: null,
      controls: null,
      stats: null
    }
  },
  created() {

  },
  mounted() {
    this.init()
    this.render()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  },
  methods: {
    init() {
      let container = document.getElementById('texture')
      this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
      this.camera.position.set(10, 10, 10)
      // this.camera.up.x = 0
      // this.camera.up.y = 1  // 设置相机快门的方向
      // this.camera.up.z = 0
      // this.camera.lookAt(0, 0, 0) // 相机视点方向

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.setClearColor(0xb9d3ff, 1)
      container.appendChild(this.renderer.domElement)

      this.scene = new THREE.Scene()
      const loader = new THREE.TextureLoader();
      const geometry = new THREE.BoxGeometry(4, 4, 4)
      const material = new THREE.MeshBasicMaterial({
        map: loader.load('/box.jpg'),
        side: THREE.DoubleSide
      });

      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.name = 'box'
      this.scene.add(this.mesh)

      const skyBoxGeometry = new THREE.BoxGeometry(500, 500, 500)
      const skyBoxMaterials = [
        new THREE.MeshBasicMaterial({ map: loader.load('/skybox/rt.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('/skybox/lf.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('/skybox/up.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('/skybox/dn.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('/skybox/bk.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('/skybox/ft.png'), side: THREE.DoubleSide })
      ]
      this.boxMesh = new THREE.Mesh(skyBoxGeometry, skyBoxMaterials)
      this.boxMesh.name = 'skyBox'
      this.scene.add(this.boxMesh)
    },

    render() {
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    },
  }
}
</script>
