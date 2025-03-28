'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { ResumeData } from '@/types';

interface ThreeCanvasProps {
  data: ResumeData;
}

function Scene({ name }: { name: string }): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <mesh>
        <Html center>Loading...</Html>
      </mesh>
    );
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <Html
          center
          className="text-4xl font-bold text-primary transform-gpu"
          distanceFactor={10}
        >
          {name}
        </Html>
      </mesh>
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
}

export function ThreeCanvas({ data }: ThreeCanvasProps): JSX.Element {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={
          <mesh>
            <Html center>Loading 3D scene...</Html>
          </mesh>
        }>
          <Scene name={data.name} />
        </Suspense>
      </Canvas>
    </div>
  );
} 