import react from "react";
import Cube from "./cube";

const XCubed = ({ dx }) => {


  return (
    <group>
      <Cube dimensions={[1, 1, 1]} position={[0, 1, 0]}/>
      <Cube dimensions={[1, dx, 1]} position={[1, 0, 0]}/>
    </group>
  )
}

export default XCubed
