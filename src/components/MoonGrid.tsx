import { useMemo, useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Moon } from './Moon'
import { Vector3 } from 'three'

interface MoonGridProps {
  count: number;
  layout?: 'grid' | 'circular' | 'auto';
}

export function MoonGrid({ count, layout = 'auto' }: MoonGridProps) {
  const { camera } = useThree();
  const [currentLayout, setCurrentLayout] = useState<'grid' | 'circular'>(
    layout === 'auto' ? 'circular' : layout
  );
  
  // Track previous camera position to detect significant changes
  const prevCameraZRef = useRef(camera.position.z);
  
  // Update layout based on camera position
  useFrame(() => {
    if (layout === 'auto') {
      const currentZ = camera.position.z;
      const zDiff = Math.abs(currentZ - prevCameraZRef.current);
      
      // If camera has moved significantly in Z direction
      if (zDiff > 3) {
        prevCameraZRef.current = currentZ;
        
        // Close to objects (zoomed in) - use grid
        // Far from objects (zoomed out) - use circular
        const newLayout = currentZ < 15 ? 'grid' : 'circular';
        
        if (newLayout !== currentLayout) {
          setCurrentLayout(newLayout);
        }
      }
    }
  });
  
  // Calculate positions for all moons based on current layout
  const moonPositions = useMemo(() => {
    const positions = [];
    
    if (currentLayout === 'circular') {
      // Arrange moons in a circular pattern
      const radius = Math.min(6, 2 + count * 0.4); // Adjusted radius based on count
      const angleStep = (2 * Math.PI) / count;
      
      for (let i = 0; i < count; i++) {
        const angle = i * angleStep;
        
        // For a single moon, place it in the center
        if (count === 1) {
          positions.push({ x: 0, y: 0, z: 0 });
        } else {
          positions.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: 0
          });
        }
      }
    } else {
      // Grid layout
      const gridSize = Math.ceil(Math.sqrt(count));
      const spacing = 3; // Reduced spacing for 3D container
      
      const totalWidth = (gridSize - 1) * spacing;
      const totalHeight = (gridSize - 1) * spacing;
      
      const startX = -totalWidth / 2;
      const startY = totalHeight / 2;
      
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        
        positions.push({
          x: startX + col * spacing,
          y: startY - row * spacing,
          z: 0
        });
      }
    }
    
    return positions;
  }, [count, currentLayout]);
  
  // Refs to track positions for smooth transitions
  const positionRefs = useRef<Vector3[]>([]);
  
  // Create position refs if needed
  if (positionRefs.current.length !== count) {
    positionRefs.current = Array(count)
      .fill(null)
      .map((_, i) => new Vector3(
        moonPositions[i]?.x || 0,
        moonPositions[i]?.y || 0, 
        moonPositions[i]?.z || 0
      ));
  }
  
  // Animate positions
  useFrame(() => {
    for (let i = 0; i < count; i++) {
      const targetPos = moonPositions[i];
      const currentPos = positionRefs.current[i];
      
      if (targetPos && currentPos) {
        // Smooth transition between positions
        currentPos.x += (targetPos.x - currentPos.x) * 0.05;
        currentPos.y += (targetPos.y - currentPos.y) * 0.05;
        currentPos.z += (targetPos.z - currentPos.z) * 0.05;
      }
    }
  });
  
  return (
    <group>
      {positionRefs.current.map((position, index) => (
        <group key={index} position={position}>
          <Moon index={index} />
        </group>
      ))}
    </group>
  );
}

export default MoonGrid 