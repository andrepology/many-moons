import { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/three'

interface AnimatedLayoutProps {
  position: [number, number, number];
  children: React.ReactNode;
}

export function AnimatedLayout({ position, children }: AnimatedLayoutProps) {
  const [springProps, setSpringProps] = useSpring(() => ({
    position: position,
    config: { mass: 1, tension: 120, friction: 14 }
  }));
  
  useEffect(() => {
    setSpringProps({
      position: position
    });
  }, [position, setSpringProps]);
  
  return (
    <animated.group position={springProps.position}>
      {children}
    </animated.group>
  );
}

export default AnimatedLayout 