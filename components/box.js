import * as THREE from 'three'
import { Vector3 } from 'three'

const DEFAULT_OPACITY = 0.8;

const faceDirToTranslateVector = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
}
const edgeDirToTranslateVector = {
  x: new Vector3(0, 1, 1),
  y: new Vector3(1, 0, 1),
  z: new Vector3(1, 1, 0),
}

const getFaceInitialTranslate = (dir, initialDx) => {
  // half face thickness
  const h = initialDx / 2
  if (dir === 'x') return [h, 0, 0]
  if (dir === 'y') return [0, h, 0]
  if (dir === 'z') return [0, 0, h]
}

const getEdgeInitialTranslate = (dir, initialDx) => {
  // half edge thickness
  const h = initialDx / 2
  if (dir === 'x') return [0, h, h]
  if (dir === 'y') return [h, 0, h]
  if (dir === 'z') return [h, h, 0]

}

// box
const genMainBoxMesh = (baseUnit, color) => {
  const geometry = new THREE.BoxGeometry(baseUnit, baseUnit, baseUnit);
  const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: DEFAULT_OPACITY } );
  const boxMesh = new THREE.Mesh( geometry, material )

  return boxMesh
}

// faces
const genFaceMeshes = (baseUnit, initialDx, gap, initialTransform, color) => {
  const halfBoxHeight = baseUnit / 2

  const faces = [
    {w: initialDx, h: baseUnit, d: baseUnit, dir: 'x'},
    {w: baseUnit, h: initialDx, d: baseUnit, dir: 'y'},
    {w: baseUnit, h: baseUnit, d: initialDx, dir: 'z'},
  ].map(({w, h, d, dir}) => {
    const [tx, ty, tz] = getFaceInitialTranslate(dir, initialDx)
    const geometry = new THREE.BoxGeometry(w, h, d)
      .translate(tx, ty, tz)
    const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: 0.5 } )
    const mesh = new THREE.Mesh( geometry, material )

    mesh.translateOnAxis(faceDirToTranslateVector[dir], halfBoxHeight + gap + initialTransform) // asdf

    return { mesh, dir }
  })

  return faces
}

// edges
const genEdgeMeshes = (baseUnit, initialDx, gap, initialTransform, color) => {
  const halfBoxHeight = baseUnit / 2

  const edges = [
    {w: baseUnit, h: initialDx, d: initialDx, dir: 'x'},
    {w: initialDx, h: baseUnit, d: initialDx, dir: 'y'},
    {w: initialDx, h: initialDx, d: baseUnit, dir: 'z'},
  ].map(({w, h, d, dir}) => {
    const [tx, ty ,tz] = getEdgeInitialTranslate(dir, initialDx)
    const geometry = new THREE.BoxGeometry(w, h, d)
      .translate(tx, ty, tz)
    const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: DEFAULT_OPACITY } )
    const mesh = new THREE.Mesh( geometry, material )

    mesh.translateOnAxis(edgeDirToTranslateVector[dir], halfBoxHeight + gap + initialTransform) // asdf

    return { mesh, dir }
  })

  return edges
}

// point
const genPointMesh = (baseUnit, initialDx, gap, initialTransform, color) => {
  const halfBoxHeight = baseUnit / 2
  const halfPointWidth = initialDx / 2

  const geometry = new THREE.BoxGeometry(initialDx, initialDx, initialDx)
    .translate(halfPointWidth, halfPointWidth, halfPointWidth)
  const material = new THREE.MeshMatcapMaterial( { color, transparent: true, opacity: DEFAULT_OPACITY } );
  const point = new THREE.Mesh( geometry, material )

  point.translateOnAxis(new Vector3(1, 1, 1), halfBoxHeight + gap + initialTransform) // asdf

  return point
}

const handleFaceTranslate = (mesh, dir, amount) => {
  mesh.translateOnAxis(faceDirToTranslateVector[dir], amount)
}

const handleEdgeTranslate = (mesh, dir, amount) => {
  mesh.translateOnAxis(edgeDirToTranslateVector[dir], amount)
}

const handlePointTranslate = (mesh, amount) => {
  mesh.translateOnAxis(new Vector3(1, 1, 1), amount)
}

// TODO scale using a vector
const handleFaceScale = (mesh, dir, scale) => {
  if (dir === 'x') mesh.scale.setX(scale)
  if (dir === 'y') mesh.scale.setY(scale)
  if (dir === 'z') mesh.scale.setZ(scale)
}

const handleEdgeScale = (mesh, dir, scale) => {
  if (dir === 'x') mesh.scale.set(1, scale, scale)
  if (dir === 'y') mesh.scale.set(scale, 1, scale)
  if (dir === 'z') mesh.scale.set(scale, scale, 1)
}

const handlePointScale = (mesh, amount) => mesh.scale.set(amount, amount, amount);

export const addAllToScene = (scene, initialDx, baseUnit, gap, expandyness, colorConfig) => {
  const { cubeColor, edgeColor } = colorConfig
  const initialTransform = initialDx * expandyness

  const boxMesh = genMainBoxMesh(baseUnit, cubeColor)
  const edgeMeshes = genEdgeMeshes(baseUnit, initialDx, gap, initialTransform, edgeColor)
  const faceMeshes = genFaceMeshes(baseUnit, initialDx, gap, initialTransform, edgeColor)
  const pointMesh = genPointMesh(baseUnit, initialDx, gap, initialTransform, edgeColor)

  const meshes = [
    boxMesh,
    ...edgeMeshes.map(({ mesh }) => mesh),
    ...faceMeshes.map(({ mesh }) => mesh),
    pointMesh
  ]

  meshes.forEach((mesh) => scene.add(mesh))

  const handleValueChange = (translateAmount, dx) => {
    const scaleAmount = dx / initialDx

    faceMeshes.forEach(({ mesh, dir }) => {
      handleFaceTranslate(mesh, dir, translateAmount)
      handleFaceScale(mesh, dir, scaleAmount)
    })
  
    edgeMeshes.forEach(({ mesh, dir }) => {
      handleEdgeTranslate(mesh, dir, translateAmount)
      handleEdgeScale(mesh, dir, scaleAmount)
    })

    handlePointTranslate(pointMesh, translateAmount)
    handlePointScale(pointMesh, scaleAmount)
  }

  return handleValueChange
}

export default addAllToScene;
