import * as THREE from 'three'
import { Vector3 } from 'three'

const defaultOpacity = 0.8;

const xAxis = new Vector3(1, 0, 0)
const yAxis = new Vector3(0, 1, 0)
const zAxis = new Vector3(0, 0, 1)

const dirToAxis = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
}

const gap = 0.2;

// y = x^3 - box
const genMainBoxMesh = (baseUnit, color) => {
  const geometry = new THREE.BoxGeometry(baseUnit, baseUnit, baseUnit);
  const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: defaultOpacity } );
  const boxMesh = new THREE.Mesh( geometry, material )

  return boxMesh
}

// dy = 3x^2 dx - faces
const genFaceMeshes = (baseUnit, initialDx, color) => {
  const halfBoxHeightPlusOffset = (baseUnit + initialDx) / 2

  const faces = [
    {w: initialDx, h: baseUnit, d: baseUnit, dir: 'x'},
    {w: baseUnit, h: initialDx, d: baseUnit, dir: 'y'},
    {w: baseUnit, h: baseUnit, d: initialDx, dir: 'z'},
  ].map(({w, h, d, dir}) => {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: 0.5 } );
    const mesh = new THREE.Mesh( geometry, material )
    mesh.translateOnAxis(dirToAxis[dir], halfBoxHeightPlusOffset + gap)
    return { mesh, dir }
  })

  return faces
}

// edges
const genEdgeMeshes = (baseUnit, initialDx, color) => {
  const halfBoxHeightPlusOffset = (baseUnit + initialDx) / 2

  const edges = [
    {w: baseUnit, h: initialDx, d: initialDx, translations: [zAxis, yAxis], dir: 'x'},
    {w: initialDx, h: baseUnit, d: initialDx, translations: [xAxis, zAxis], dir: 'y'},
    {w: initialDx, h: initialDx, d: baseUnit, translations: [yAxis, xAxis], dir: 'z'},
  ].map(({w, h, d, translations, dir}) => {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: defaultOpacity } );
    const mesh = new THREE.Mesh( geometry, material )
    mesh.translateOnAxis(translations[0], halfBoxHeightPlusOffset + gap)
    mesh.translateOnAxis(translations[1], halfBoxHeightPlusOffset + gap)
    return { mesh, dir }
  })

  return edges
}

// point
const genPointMesh = (baseUnit, initialDx, color) => {
  const halfBoxHeightPlusOffset = (baseUnit + initialDx) / 2

  const geometry = new THREE.BoxGeometry(initialDx, initialDx, initialDx);
  const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: defaultOpacity } );
  const point = new THREE.Mesh( geometry, material )

  point.translateX(halfBoxHeightPlusOffset + gap)
  point.translateY(halfBoxHeightPlusOffset + gap)
  point.translateZ(halfBoxHeightPlusOffset + gap)

  return point
}


const handlePointTranslateFactory = (point) => (amount) => {
  point.translateX(amount)
  point.translateY(amount)
  point.translateZ(amount)
}

const handleFaceTranslateFactory = (faceMesh, dir) => (amount) => {
  if (dir === 'x') faceMesh.translateX(amount)
  if (dir === 'y') faceMesh.translateY(amount)
  if (dir === 'z') faceMesh.translateZ(amount)
}

const handleFaceScaleFactory = (faceMesh, dir) => (scale) => {
  if (dir === 'x') faceMesh.scale.setX(scale)
  if (dir === 'y') faceMesh.scale.setY(scale)
  if (dir === 'z') faceMesh.scale.setZ(scale)
}

const handleEdgeTranslateFactory = (edgeMesh, dir) => (amount) => {
  if (dir === 'x') {
    edgeMesh.translateOnAxis(zAxis, amount)
    edgeMesh.translateOnAxis(yAxis, amount)
  }
  if (dir === 'y'){
    edgeMesh.translateOnAxis(xAxis, amount)
    edgeMesh.translateOnAxis(zAxis, amount)
  }
  if (dir === 'z') {
    edgeMesh.translateOnAxis(xAxis, amount)
    edgeMesh.translateOnAxis(yAxis, amount)
  }
}

const handleEdgeScaleFactory = (edgeMesh, dir) => (scale) => {
  if (dir === 'x') edgeMesh.scale.set(1, scale, scale)
  if (dir === 'y') edgeMesh.scale.set(scale, 1, scale)
  if (dir === 'z') edgeMesh.scale.set(scale, scale, 1)
}

export const addAllToScene = (scene, initialDx, baseUnit, config) => {
  const { boxColor, edgeColor, faceColor, pointColor } = config

  const boxMesh = genMainBoxMesh(baseUnit, boxColor)
  const edges = genEdgeMeshes(baseUnit, initialDx, edgeColor)
  const faces = genFaceMeshes(baseUnit, initialDx, faceColor)
  const pointMesh = genPointMesh(baseUnit, initialDx, pointColor)
  const meshes = [
    boxMesh,
    ...edges.map(({ mesh }) => mesh),
    ...faces.map(({ mesh }) => mesh),
    pointMesh
  ]

  meshes.forEach((mesh) => scene.add(mesh))

  // const handleFacesTranslate = (amount) => faces.forEach(
  //   ({ mesh, dir }) => handleFaceTranslateFactory(mesh, dir)(amount))

  // const handleFacesScale = (amount) => faces.forEach(
  //   ({ mesh, dir }) => handleFaceScaleFactory(mesh, dir)(amount))

  // const handleEdgesTranslate = (amount) => edges.forEach(
  //   ({ mesh, dir }) => handleEdgeTranslateFactory(mesh, dir)(amount))

  // const handleEdgesScale = (amount) => 

  // const handlePointTranslate = handlePointTranslateFactory(pointMesh)

  // const handlePointScale = (amount) => 
  //   pointMesh.scale.set(amount, amount, amount);

  const handleValueChange = (translateAmount, scaleAmount) => {
    // handleFacesTranslate(translateAmount)
    // handleFacesScale(scaleAmount)
    // handleEdgesTranslate(translateAmount)
    // handleEdgesScale(scaleAmount)
    // handlePointTranslate(translateAmount)
    // handlePointScale(scaleAmount)

    faces.forEach(
      ({ mesh, dir }) => handleFaceTranslateFactory(mesh, dir)(translateAmount))
  
    faces.forEach(
      ({ mesh, dir }) => handleFaceScaleFactory(mesh, dir)(scaleAmount))
  
    edges.forEach(
      ({ mesh, dir }) => handleEdgeTranslateFactory(mesh, dir)(translateAmount))

    edges.forEach(
      ({ mesh, dir }) => handleEdgeScaleFactory(mesh, dir)(scaleAmount))

    handlePointTranslateFactory(pointMesh)

    pointMesh.scale.set(scaleAmount, scaleAmount, scaleAmount);

  }

  return handleValueChange
}

export default addAllToScene;
