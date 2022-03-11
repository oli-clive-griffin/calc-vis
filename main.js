import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Vector3 } from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(10, 10, 20)

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

// ################

const baseUnit = 10;
let initialDx = 2;
const opacity = 0.9;
const halfBoxHeightPlusOffset = (baseUnit + initialDx) / 2

const xAxis = new Vector3(1, 0, 0)
const yAxis = new Vector3(0, 1, 0)
const zAxis = new Vector3(0, 0, 1)

const ninteydeg = Math.PI/2
const gap = 0.05;


const genBox = () => {
  const geometry = new THREE.BoxGeometry( baseUnit, baseUnit, baseUnit );
  const material = new THREE.MeshMatcapMaterial( { color: 0x00ff00, transparent: true, opacity } );
  const box = new THREE.Mesh( geometry, material )
  scene.add(box);
}
genBox();

const faces = [
  {z: 0,  x: 0,  y: 0 },
  {z: -ninteydeg, x: 0,  y: 0 },
  {z: 0,  x: ninteydeg, y: 0 },
]
const faceObjs = faces.map(({x, y, z}) => {
  const geometry = new THREE.BoxGeometry(baseUnit, initialDx, baseUnit);
  const material = new THREE.MeshMatcapMaterial( { color: 0x4444ff, transparent: true, opacity } );
  const box = new THREE.Mesh( geometry, material )
  box.rotation.set(x, y, z)
  box.translateY(halfBoxHeightPlusOffset + gap)
  // box.translateOnAxis([0, 0, 1], 5)
  return box
})
faceObjs.forEach(o => scene.add(o))



let edgeDx = initialDx;
const edges = [
  {w: baseUnit, h: edgeDx, d: edgeDx, translations: [zAxis, yAxis], dir: 'x'},
  {w: edgeDx, h: baseUnit, d: edgeDx, translations: [xAxis, zAxis], dir: 'y'},
  {w: edgeDx, h: edgeDx, d: baseUnit, translations: [yAxis, xAxis], dir: 'z'},
]
const edgeObjs = edges.map(({w, h, d, translations, dir}) => {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshMatcapMaterial( { color: 0xdd7722, transparent: true, opacity: 0.5 } );
  const edge = new THREE.Mesh( geometry, material )
  edge.translateOnAxis(translations[0], halfBoxHeightPlusOffset + gap)
  edge.translateOnAxis(translations[1], halfBoxHeightPlusOffset + gap)
  scene.add(edge)
  return { edge, dir }
})
edgeObjs.forEach(({edge}) => scene.add(edge))

const slider = document.querySelector('#slider')
let prevval = 1
slider.addEventListener('input', (e) => {
  const translate = e.target.value - prevval;
  faceObjs.forEach(box => box.translateY(translate))
  faceObjs.forEach(box => box.scale.set(1, e.target.value, 1))
  prevval = e.target.value

  edgeObjs.forEach(o => handleEdgeTranslate(o.edge, o.dir, translate))
  edgeObjs.forEach(o => handleEdgeScale(o.edge, o.dir, e.target.value))
})

// const handle

const handleEdgeTranslate = (edgeObj, dir, length) => {
  if (dir === 'x') {
    edgeObj.translateOnAxis(zAxis, length)
    edgeObj.translateOnAxis(yAxis, length)
  }
  if (dir === 'y'){
    edgeObj.translateOnAxis(xAxis, length)
    edgeObj.translateOnAxis(zAxis, length)
  }
  if (dir === 'z') {
    edgeObj.translateOnAxis(xAxis, length)
    edgeObj.translateOnAxis(yAxis, length)
  }
}

const handleEdgeScale = (edgeObj, dir, length) => {
  if (dir === 'x') {
    edgeObj.scale.set(1, length, length)
  }
  if (dir === 'y'){
    edgeObj.scale.set(length, 1, length)
  }
  if (dir === 'z') {
    edgeObj.scale.set(length, length, 1)
  }
}

const animate = () => {
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
}

animate()
