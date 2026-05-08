import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import type { EntityState } from '../App';

function AirportSquare() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial color="#d1d5db" side={THREE.DoubleSide} />
    </mesh>
  );
}

function GridLines() {
  return (
    <gridHelper args={[10, 10, '#9ca3af', '#e5e7eb']} position={[0, 0.01, 0]} />
  );
}

function DroneModel({ state }: { state: EntityState }) {
  const { scene } = useGLTF('/models/crazyflie_2.x.glb');
  return (
    <primitive
      object={scene.clone()}
      position={[state.x, state.z, -state.y]}
      rotation={[0, (state.yaw * Math.PI) / 180, 0]}
      scale={[3, 3, 3]}
    />
  );
}

interface ThreeSceneProps {
  entityState: EntityState;
}

export default function ThreeScene({ entityState }: ThreeSceneProps) {
  const fov = Math.max(20, 75 - entityState.focal * 5);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [3, 3, 3], fov, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <AirportSquare />
          <GridLines />
          <DroneModel state={entityState} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
