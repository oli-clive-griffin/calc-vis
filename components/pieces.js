import * as THREE from 'three'

const YELLOW = 0xEEEE22

const GLOBAL_X_OFFSET = {
  faces: 15,
  edges: 27,
  point: 38,
}

const genOffsetCuboids = (l, w, h, localOffsets, globalOffset) => (
  localOffsets.map((offset) => {
    const geometry = new THREE.BoxGeometry(l, w, h)
    const material = new THREE.MeshMatcapMaterial({ color: YELLOW, transparent: true, opacity: 0.9 })
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      globalOffset + offset,
      -offset,
      offset,
    )

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

const addPiecesToScene = (scene, thickness, width) => {
  const faceMeshes = genOffsetCuboids(width, width, thickness, [-1, 0, 1], GLOBAL_X_OFFSET.faces)
  const edgeMeshes = genOffsetCuboids(thickness, width, thickness, [-1, 0, 1], GLOBAL_X_OFFSET.edges)
  const pointMesh = genPointMesh(thickness)

  const meshes = [...faceMeshes, ...edgeMeshes, pointMesh]
  meshes.forEach(mesh => scene.add(mesh))

  const setPiecesThickness = (newThickness) => {

    for (const mesh of faceMeshes) {
      mesh.scale.setZ(newThickness)
    }

    for (const mesh of edgeMeshes) {
      mesh.scale.set(newThickness, 1, newThickness)
    }

    // use .set for all other scales?
    pointMesh.scale.set(newThickness, newThickness, newThickness)
  }

  return setPiecesThickness
}

export default addPiecesToScene
