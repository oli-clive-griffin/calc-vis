import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import addAllToScene from './components/box'

const INITIAL_DX = 1
const X = 10
const GAP = 0
// const EXPANSION = 1.04

const COLORS = {
  boxColor: 0x59b2e3,
  edgeColor: 0x8888ff,
  faceColor: 0xd4e678,
  pointColor: 0xe88133,
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(10, 20, 100)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
const light = new THREE.AmbientLight( 0xffffff );
light.position.set(20, 30, 40)
scene.add(light)
const controls = new OrbitControls(camera, renderer.domElement);

const handleValueChange = addAllToScene(scene, INITIAL_DX, X, GAP, COLORS);

let prevDx = INITIAL_DX
document.querySelector('#slider').addEventListener('input', (e) => {
  const newDx = e.target.value
  const translateAmount = (newDx - prevDx) / 2
  const scaleAmount = newDx

  handleValueChange(translateAmount, scaleAmount)

  prevDx = newDx
})


const animate = () => {
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
}

animate()
