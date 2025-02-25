import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Text3D, Center, useFont } from '@react-three/drei'
import { Group, SpotLight, Vector3 } from 'three'

interface SquircleContainerProps {
  children: React.ReactNode;
  fullMoonCount: number;
}

export function SquircleContainer({ children, fullMoonCount }: SquircleContainerProps) {
  const groupRef = useRef<Group>(null)
  const spotLightRef = useRef<SpotLight>(null)
  const titleRef = useRef<Group>(null)
  const subtitleRef = useRef<Group>(null)
  const countRef = useRef<Group>(null)
  
  // Get camera from three context
  const { camera } = useThree()
  
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
  
  // Animation and billboard effect for text
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.03;
    }
    
    // Animate the spotlight
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.3) * 3;
    }
    
    // Make text groups face the camera (billboard effect)
    [titleRef, subtitleRef, countRef].forEach(ref => {
      if (ref.current) {
        // Get the direction from the text to the camera
        const direction = new Vector3();
        const textWorldPosition = new Vector3();
        ref.current.getWorldPosition(textWorldPosition);
        
        // Calculate direction from text to camera
        direction.subVectors(camera.position, textWorldPosition).normalize();
        
        // Make the text face the camera while maintaining its up direction
        ref.current.lookAt(camera.position);
        
        // Preserve the original y-rotation of the parent group
        if (groupRef.current) {
          ref.current.rotation.y = groupRef.current.rotation.y;
        }
      }
    });
  });
  
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
      
      {/* Title: "Full Moons" */}
      <group ref={titleRef} position={[-3.5, 7.5, 1.5]}>
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

        {/* Subtitle */}
        <group ref={subtitleRef} position={[0.4, -1, 0]}>
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
        </group>
      </group>
      
      {/* Count display */}
      <group ref={countRef} position={[0, -1, 1.5]}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={2}
            height={0.5}
            bevelEnabled
            bevelThickness={0.1}
            bevelSize={0.05}
          >
            {fullMoonCount}
            <meshPhysicalMaterial color="white" metalness={0.7} roughness={0.1} />
          </Text3D>
        </Center>
      </group>
    </group>
  )
}

export default SquircleContainer