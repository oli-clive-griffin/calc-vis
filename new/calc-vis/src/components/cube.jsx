import react, { useEffect } from "react"

const Cube = react.forwardRef(({ dimensions, position, color = 0x555555 }, ref) => {
  return (
    <mesh ref={ref} position={position}>
      <boxBufferGeometry attach="geometry" args={dimensions}/>
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  )
})

export default Cube
