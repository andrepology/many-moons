import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import MoonGrid from './components/MoonGrid'
import Background from './components/Background'
import SquircleContainer from './components/SquircleContainer'
import './App.css'

// List of full moon dates in 2024 (UTC times, can be replaced with more accurate data)
const FULL_MOONS_2024 = [
  new Date('2024-01-25T17:54:00Z'),
  new Date('2024-02-24T12:30:00Z'),
  new Date('2024-03-25T07:00:00Z'),
  new Date('2024-04-24T00:49:00Z'),
  new Date('2024-05-23T13:53:00Z'),
  new Date('2024-06-22T01:08:00Z'),
  new Date('2024-07-21T10:17:00Z'),
  new Date('2024-08-19T18:26:00Z'),
  new Date('2024-09-18T02:34:00Z'),
  new Date('2024-10-17T11:26:00Z'),
  new Date('2024-11-15T21:29:00Z'),
  new Date('2024-12-15T09:02:00Z'),
  // Add 2025 dates if needed
]

function App() {
  const [fullMoonCount, setFullMoonCount] = useState<number>(0);
  
  useEffect(() => {
    const startDate = new Date(2024, 0, 5); // January 5th, 2024
    const today = new Date();
    
    // Count full moons between startDate and today
    const count = FULL_MOONS_2024.filter(fullMoonDate => 
      fullMoonDate >= startDate && fullMoonDate <= today
    ).length;
    
    setFullMoonCount(count);
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 50 }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#050505']} />
          
          {/* Environment lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[40, 10, 5]} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />
          
          {/* Background with stars */}
          <Background />
          
          {/* 3D Squircle Container */}
          <SquircleContainer fullMoonCount={fullMoonCount}>
            {/* Moons with dynamic layout */}
            <group position={[0, -1, 0]}>
              <MoonGrid count={fullMoonCount} />
            </group>
          </SquircleContainer>
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minPolarAngle={Math.PI/3}
            maxPolarAngle={Math.PI/1.5}
            minDistance={15}
            maxDistance={40}
          />
        </Suspense>
      </Canvas>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-white opacity-80 text-sm">
        Zoom in/out to change the moon layout
      </div>
    </div>
  );
}

export default App
