import { useTexture } from '@react-three/drei'
import { BackSide } from 'three'

export function Background() {
  const worldTexture = useTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg")
  
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 60]} />
      <meshBasicMaterial
        map={worldTexture}
        side={BackSide}
        fog={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export default Background 