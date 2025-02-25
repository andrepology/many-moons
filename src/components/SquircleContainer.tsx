import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text3D, Center, useFont, Billboard } from '@react-three/drei'
import { Group, SpotLight } from 'three'

interface SquircleContainerProps {
  children: React.ReactNode;
  fullMoonCount: number;
}

export function SquircleContainer({ children, fullMoonCount }: SquircleContainerProps) {
  const groupRef = useRef<Group>(null)
  const spotLightRef = useRef<SpotLight>(null)
  
  // Preload font
  useEffect(() => {
    const preloadFont = async () => {
      try {
        const response = await fetch('/fonts/helvetiker_regular.typeface.json');
        const fontData = await response.json();
        console.log('Font loaded successfully', Object.keys(fontData));
      } catch (error) {
        console.error('Error loading font:', error);
      }
    };
    
    preloadFont();
  }, []);
  
  // Subtle floating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.03;
    }
    
    // Animate the spotlight
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.3) * 3;
    }
  })
  
  return (
    <group ref={groupRef}>
     
          
      {/* Internal light */}
      <spotLight
        ref={spotLightRef}
        position={[0, 2, 8]}
        angle={1}
        penumbra={0.1}
        intensity={200}
        color="#e0b0ff"
        distance={20}
      />
      
      {/* Container for the moon content - positioned inside the carved area */}
      <group position={[0, -0.5, 0.5]}>
        {children}
      </group>
      
      {/* "Full Moons" title text - with Billboard to face camera */}
      <group position={[-2.5, 7.5, 1.5]}>
        <Billboard follow={true} lockX={false} lockY={false}>
          <Center alignX="left">
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.8}
              height={0.2}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              Full Moons
              <meshStandardMaterial color="white" emissive="#4040ff" emissiveIntensity={0.2} />
            </Text3D>
          </Center>
        </Billboard>

        {/* "Since January 5th" subtitle text - with Billboard to face camera */}
        <group position={[0.4, -1, 0]}>
          <Billboard follow={true} lockX={false} lockY={false}>
            <Center alignX="left">
              <Text3D
                font="/fonts/helvetiker_regular.typeface.json"
                size={0.4}
                height={0.1}
              >
                Since January 5th, 2024
                <meshStandardMaterial color="#cccccc" />
              </Text3D>
            </Center>
          </Billboard>
        </group>
      </group>
      
      {/* Count display - with Billboard to face camera */}
      
    </group>
  )
}

export default SquircleContainer