import { useMemo, useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Moon } from './Moon'
import { Vector3 } from 'three'

interface MoonGridProps {
  count: number;
  layout?: 'grid' | 'circular';
}

export function MoonGrid({ count, layout = 'grid' }: MoonGridProps) {
  // Get camera from scene
  const { camera } = useThree()
  
  // Track whether we should use circular or grid layout based on camera z position
  const [currentLayout, setCurrentLayout] = useState(layout)
  const [transitionProgress, setTransitionProgress] = useState(1) // 0 to 1
  const targetPositionsRef = useRef<{ x: number; y: number; z: number }[]>([])
  const currentPositionsRef = useRef<{ x: number; y: number; z: number }[]>([])
  
  // Calculate both grid and circular positions
  const { gridPositions, circularPositions } = useMemo(() => {
    // Circular layout positions
    const circular = [];
    const radius = Math.min(6, 2 + count * 0.25);
    const angleStep = (2 * Math.PI) / count;
    
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      
      if (count === 1) {
        circular.push({ x: 0, y: 0, z: 0 });
      } else {
        circular.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0
        });
      }
    }
    
    // Grid layout positions
    const grid = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = 3;
    
    const totalWidth = (gridSize - 1) * spacing;
    const totalHeight = (gridSize - 1) * spacing;
    
    const startX = -totalWidth / 2;
    const startY = totalHeight / 2;
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      grid.push({
        x: startX + col * spacing,
        y: startY - row * spacing,
        z: 0
      });
    }
    
    return { gridPositions: grid, circularPositions: circular };
  }, [count]);
  
  // Initialize positions
  useEffect(() => {
    if (currentLayout === 'grid') {
      currentPositionsRef.current = [...gridPositions];
      targetPositionsRef.current = [...gridPositions];
    } else {
      currentPositionsRef.current = [...circularPositions];
      targetPositionsRef.current = [...circularPositions];
    }
  }, [count, gridPositions, circularPositions, currentLayout]);
  
  // Check camera position and update layout
  useFrame(({ clock }) => {
    // Determine layout based on camera z position
    const cameraZ = camera.position.z;
    const newLayout = cameraZ > 20 ? 'grid' : 'circular';
    
    // If layout needs to change, start transition
    if (newLayout !== currentLayout && transitionProgress === 1) {
      setCurrentLayout(newLayout);
      setTransitionProgress(0);
      targetPositionsRef.current = newLayout === 'grid' ? gridPositions : circularPositions;
    }
    
    // Animate transition if in progress
    if (transitionProgress < 1) {
      const newProgress = Math.min(transitionProgress + 0.02, 1);
      setTransitionProgress(newProgress);
      
      // Update current positions based on transition progress
      currentPositionsRef.current = currentPositionsRef.current.map((pos, i) => {
        const target = targetPositionsRef.current[i];
        return {
          x: pos.x + (target.x - pos.x) * 0.05,
          y: pos.y + (target.y - pos.y) * 0.05,
          z: pos.z + (target.z - pos.z) * 0.05
        };
      });
    }
  });
  
  return (
    <group>
      {currentPositionsRef.current.map((position, index) => (
        <group 
          key={index} 
          position={[position.x, position.y, position.z]}
        >
          <Moon index={index} />
        </group>
      ))}
    </group>
  );
}

export default MoonGrid 