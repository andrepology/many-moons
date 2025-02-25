import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Mesh } from 'three'

interface MoonProps {
  index: number;
}

export function Moon({ index }: MoonProps) {
  const meshRef = useRef<Mesh>(null)
  
  // Load textures using the provided URLs
  const texture = useTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg")
  const displacementMap = useTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg")
  
  // Rotate the moon with slight variation based on index
  useFrame(() => {
    if (meshRef.current) {
      const speedVariation = 1 + (index % 5) * 0.1;
      meshRef.current.rotation.y += 0.002 * speedVariation;
      meshRef.current.rotation.x += 0.0001 * speedVariation;
    }
  })
  
  // Scale for the moons - adjusted for 3D container
  const moonSize = 1.1;
  
  return (
    <mesh 
      ref={meshRef} 
      rotation={[
        3.1415 * 0.02 + (index * 0.01), 
        3.1415 * 1.54 + (index * 0.02), 
        0
      ]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[moonSize, 48, 48]} />
      <meshStandardMaterial
        map={texture}
        displacementMap={displacementMap}
        displacementScale={0.06}
        bumpMap={displacementMap}
        bumpScale={0.04}
        roughness={0.7}
        metalness={0.2}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

export default Moon 