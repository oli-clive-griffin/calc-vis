import * as THREE from 'three'
import { Vector3 } from 'three';

const YELLOW = 0xEEEE22

const GLOBAL_X_OFFSET = {
  faces: 15,
  edges: 27,
  point: 38,
}

const genFaceMeshes = (x, dx) => (
  [0, 1, 2].map((i) => {
    const geometry = new THREE.BoxGeometry(x, x, dx)
    const material = new THREE.MeshMatcapMaterial({ color: YELLOW, transparent: true, opacity: 0.9 })
    const mesh = new THREE.Mesh(geometry, material);

    mesh.translateOnAxis(new Vector3(1, -1, 1), i)

    return mesh
  })
    .map(mesh => mesh.translateX(GLOBAL_X_OFFSET.faces))
)

const genEdgeMeshes = (x, dx) => (
  [0, 1, 2].map((i) => {
    const geometry = new THREE.BoxGeometry(dx, x, dx)
    const material = new THREE.MeshMatcapMaterial({ color: YELLOW, transparent: true, opacity: 0.9 })
    const mesh = new THREE.Mesh(geometry, material);

    mesh.translateOnAxis(new Vector3(1, -1, 1), i)
    mesh.translateX(GLOBAL_X_OFFSET.edges)

    return mesh
  })
)

const genPointMesh = (dx) => {
  const geometry = new THREE.BoxGeometry(dx, dx, dx)
  const material = new THREE.MeshMatcapMaterial({ color: YELLOW, transparent: true, opacity: 0.9 })
  const mesh = new THREE.Mesh(geometry, material);

  mesh.translateX(GLOBAL_X_OFFSET.point)

  return mesh
}

const addPiecesToScene = (scene, initialDx, x) => {
  const faceMeshes = genFaceMeshes(x, initialDx)
  const edgeMeshes = genEdgeMeshes(x, initialDx)
  const pointMesh = genPointMesh(initialDx)

  const meshes = [...faceMeshes, ...edgeMeshes, pointMesh]
  meshes.forEach(mesh => scene.add(mesh))

  // TODO implement translation for faces and edges
  return (dx) => {
    const scale = dx/initialDx
    faceMeshes.forEach(mesh => {
      mesh.scale.setZ(scale)
    });
    edgeMeshes.forEach(mesh => {
      mesh.scale.setZ(scale)
      mesh.scale.setX(scale)
    })
    // use .set for all other scales?
    pointMesh.scale.set(scale, scale, scale)
  }
}

export default addPiecesToScene
