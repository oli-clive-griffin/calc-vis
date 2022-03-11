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

const BOX_COLOR = 0x8888ff
const FACE_COLOR = 0xffff33
const EDGE_COLOR = 0x55ff88
const POINT_COLOR = 0x777744

const baseUnit = 10;
let initialDx = 2;
const opacity = 0.5;
const halfBoxHeightPlusOffset = (baseUnit + initialDx) / 2

const xAxis = new Vector3(1, 0, 0)
const yAxis = new Vector3(0, 1, 0)
const zAxis = new Vector3(0, 0, 1)

const dirToAxis = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
}

const ninteydeg = Math.PI/2
const gap = 0.05;


// y = x^3 - box
const mainBoxMesh = (() => {
  const geometry = new THREE.BoxGeometry(baseUnit, baseUnit, baseUnit);
  const material = new THREE.MeshMatcapMaterial( { color: BOX_COLOR, transparent: true, opacity } );
  const box = new THREE.Mesh( geometry, material )
  scene.add(box);
})()
const addMainBox = () => scene.add(mainBoxMesh)

// dy = 3x^2 dx - faces
const faces = [
  {w: initialDx, h: baseUnit, d: baseUnit, dir: 'x'},
  {w: baseUnit, h: initialDx, d: baseUnit, dir: 'y'},
  {w: baseUnit, h: baseUnit, d: initialDx, dir: 'z'},
]
const faceMeshes = faces.map(({w, h, d, dir}) => {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshMatcapMaterial( { color: FACE_COLOR, transparent: true, opacity } );
  const faceMesh = new THREE.Mesh( geometry, material )
  faceMesh.translateOnAxis(dirToAxis[dir], halfBoxHeightPlusOffset + gap)
  return { faceMesh, dir }
})
const addFaces = () => faceMeshes.forEach(({ faceMesh }) => scene.add(faceMesh))

// edges
const edges = [
  {w: baseUnit, h: initialDx, d: initialDx, translations: [zAxis, yAxis], dir: 'x'},
  {w: initialDx, h: baseUnit, d: initialDx, translations: [xAxis, zAxis], dir: 'y'},
  {w: initialDx, h: initialDx, d: baseUnit, translations: [yAxis, xAxis], dir: 'z'},
]
const edgeMeshes = edges.map(({w, h, d, translations, dir}) => {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshMatcapMaterial( { color: EDGE_COLOR, transparent: true, opacity } );
  const edgeMesh = new THREE.Mesh( geometry, material )
  edgeMesh.translateOnAxis(translations[0], halfBoxHeightPlusOffset + gap)
  edgeMesh.translateOnAxis(translations[1], halfBoxHeightPlusOffset + gap)
  scene.add(edgeMesh)
  return { edgeMesh, dir }
})
const addEdges = () => edgeMeshes.forEach(({ edgeMesh }) => scene.add(edgeMesh))

// point
const pointMesh = (() => {
  const geometry = new THREE.BoxGeometry(initialDx, initialDx, initialDx);
  const material = new THREE.MeshMatcapMaterial( { color: POINT_COLOR, transparent: true, opacity: 1 } );
  const point = new THREE.Mesh( geometry, material )
  point.translateX(halfBoxHeightPlusOffset + gap)
  point.translateY(halfBoxHeightPlusOffset + gap)
  point.translateZ(halfBoxHeightPlusOffset + gap)
  return point
})()
const addPoint = () => scene.add(pointMesh)

addMainBox()
addEdges()
addFaces()
addPoint()

const slider = document.querySelector('#slider')

let prevval = initialDx / 2
slider.addEventListener('input', (e) => {
  const translate = e.target.value - prevval;

  faceMeshes.forEach(({ faceMesh, dir }) => handleFaceTranslate(faceMesh, dir, translate))
  faceMeshes.forEach(({ faceMesh, dir }) => handleFaceScale(faceMesh, dir, e.target.value))

  edgeMeshes.forEach(({ edgeMesh, dir }) => handleEdgeTranslate(edgeMesh, dir, translate))
  edgeMeshes.forEach(({ edgeMesh, dir }) => handleEdgeScale(edgeMesh, dir, e.target.value))

  pointMesh.scale.set(e.target.value, e.target.value, e.target.value);
  handlePointTranslate(pointMesh, translate)

  prevval = e.target.value
})

const handlePointTranslate = (point, translate) => {
  point.translateX(translate)
  point.translateY(translate)
  point.translateZ(translate)
}

const handleFaceTranslate = (faceMesh, dir, amount) => {
  if (dir === 'x') faceMesh.translateX(amount)
  if (dir === 'y') faceMesh.translateY(amount)
  if (dir === 'z') faceMesh.translateZ(amount)
}

const handleFaceScale = (faceMesh, dir, amount) => {
  if (dir === 'x') faceMesh.scale.setX(amount)
  if (dir === 'y') faceMesh.scale.setY(amount)
  if (dir === 'z') faceMesh.scale.setZ(amount)
}

const handleEdgeTranslate = (edgeObj, dir, amount) => {
  if (dir === 'x') {
    edgeObj.translateOnAxis(zAxis, amount)
    edgeObj.translateOnAxis(yAxis, amount)
  }
  if (dir === 'y'){
    edgeObj.translateOnAxis(xAxis, amount)
    edgeObj.translateOnAxis(zAxis, amount)
  }
  if (dir === 'z') {
    edgeObj.translateOnAxis(xAxis, amount)
    edgeObj.translateOnAxis(yAxis, amount)
  }
}

const handleEdgeScale = (edgeObj, dir, length) => {
  if (dir === 'x') edgeObj.scale.set(1, length, length)
  if (dir === 'y') edgeObj.scale.set(length, 1, length)
  if (dir === 'z') edgeObj.scale.set(length, length, 1)
}

const animate = () => {
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
}

animate()
