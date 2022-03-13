import react, { useState, useRef } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import './App.css'
import XCubed from './components/x-cubed';

extend({ OrbitControls })

const MIN_DX = 0
const INITIAL_DX = 1.5
const MAX_DX = 3

function App() {
  const [dx, setDx] = useState(INITIAL_DX)

  const handleChangeDx = (e ) => {
    setDx(e.target.value)
  }

  return (
    <div className="App">
      <div id="container">
        <input
          onChange={handleChangeDx}
          value={dx}
          min={MIN_DX}
          max={MAX_DX}
          step={0.001}
          id="slider"
          type="range"
        />
      </div>

      <Canvas id="canvas" color={0x333333}>
        <CameraControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <XCubed dx={dx}/>
      </Canvas>
    </div>
  )
}

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};


export default App
