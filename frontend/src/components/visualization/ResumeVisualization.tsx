'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { ResumeData } from '@/types';

interface ResumeVisualizationProps {
  data: ResumeData;
}

// Dynamically import the ThreeCanvas component with no SSR
const ThreeCanvas = dynamic(() => Promise.resolve(ThreeCanvasComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg" />
  ),
});

function ThreeCanvasComponent({ data }: ResumeVisualizationProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Center>
        <motion.group
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Text3D
            font="/fonts/Inter-Bold.woff"
            size={0.5}
            height={0.2}
            curveSegments={12}
          >
            {data.name}
            <meshStandardMaterial color="#4F46E5" />
          </Text3D>
        </motion.group>
      </Center>
    </Canvas>
  );
}

export function ResumeVisualization({ data }: ResumeVisualizationProps) {
  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
      <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
        <ThreeCanvas data={data} />
      </Suspense>
    </div>
  );
} 