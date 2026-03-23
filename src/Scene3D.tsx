import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// --- SCENE 1: Tunnel ---
function Tunnel() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#8A2BE2", transparent: true }), []);

  const lines = useMemo(() => {
    const curves = [];
    for (let i = 0; i < 10; i++) {
      const points = [];
      const angle = (i / 10) * Math.PI * 2;
      for (let j = 0; j < 20; j++) {
        const z = -j * 2;
        const radius = 3 + Math.sin(j * 0.5) * 0.5;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z));
      }
      curves.push(new THREE.CatmullRomCurve3(points));
    }
    return curves;
  }, []);

  useFrame((state) => {
    const offset = scroll.offset;
    if (groupRef.current) {
      groupRef.current.position.z = (state.clock.elapsedTime * 2) % 4;
      const opacity = 1 - THREE.MathUtils.smoothstep(offset, 0.15, 0.25);
      material.opacity = opacity;
      groupRef.current.visible = opacity > 0;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((curve, index) => (
        <mesh key={index} material={material}>
          <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
        </mesh>
      ))}
    </group>
  );
}

// --- SCENE 2: Hexagon ---
function Hexagon() {
  const scroll = useScroll();
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#9D00FF", wireframe: true, transparent: true }), []);

  useFrame((state, delta) => {
    const offset = scroll.offset;
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.15, 0.2);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(offset, 0.35, 0.45);
      const opacity = Math.min(fadeIn, fadeOut);
      
      material.opacity = opacity;
      meshRef.current.visible = opacity > 0;
      
      const scale = THREE.MathUtils.lerp(0.5, 1.5, (offset - 0.2) * 5);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <cylinderGeometry args={[2, 2, 1, 6]} />
    </mesh>
  );
}

// --- SCENE 3: Figure 8 ---
function Figure8() {
  const scroll = useScroll();
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#B026FF", wireframe: true, transparent: true }), []);

  const curve = useMemo(() => {
    class LissajousCurve extends THREE.Curve<THREE.Vector3> {
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const a = 1;
        const b = 2;
        const A = 2;
        const B = 2;
        const delta = Math.PI / 2;
        const x = A * Math.sin(a * t * Math.PI * 2 + delta);
        const y = B * Math.sin(b * t * Math.PI * 2);
        const z = Math.sin(t * Math.PI * 4) * 0.5;
        return optionalTarget.set(x, y, z);
      }
    }
    return new LissajousCurve();
  }, []);

  useFrame((state, delta) => {
    const offset = scroll.offset;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.35, 0.4);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(offset, 0.55, 0.65);
      const opacity = Math.min(fadeIn, fadeOut);
      
      material.opacity = opacity;
      meshRef.current.visible = opacity > 0;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <tubeGeometry args={[curve, 128, 0.1, 8, true]} />
    </mesh>
  );
}

// --- SCENE 4: Grid ---
function InfinityGrid() {
  const scroll = useScroll();
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    const offset = scroll.offset;
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 1;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.55, 0.6);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(offset, 0.75, 0.85);
      const opacity = Math.min(fadeIn, fadeOut);
      
      const material = gridRef.current.material as THREE.Material;
      material.opacity = opacity * 0.5;
      material.transparent = true;
      gridRef.current.visible = opacity > 0;
    }
  });

  return (
    <gridHelper 
      ref={gridRef} 
      args={[40, 40, '#8A2BE2', '#4B0082']} 
      position={[0, -2, 0]} 
    />
  );
}

// --- SCENE 5: Particles ---
function ParticleSystem() {
  const scroll = useScroll();
  const pointsRef = useRef<THREE.Points>(null);
  const material = useMemo(() => new THREE.PointsMaterial({ 
    color: "#B026FF", 
    size: 0.05, 
    sizeAttenuation: true, 
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
  }), []);

  const [positions, sizes] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      sz[i] = Math.random() * 0.05;
    }
    return [pos, sz];
  }, []);

  useFrame((state, delta) => {
    const offset = scroll.offset;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2;
      pointsRef.current.rotation.x += delta * 0.1;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.75, 0.85);
      
      material.opacity = fadeIn;
      pointsRef.current.visible = fadeIn > 0;
      
      const scale = THREE.MathUtils.lerp(0.1, 1, fadeIn);
      pointsRef.current.scale.setScalar(scale);
    }
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}

export default function Scene3D() {
  return (
    <>
      <Tunnel />
      <Hexagon />
      <Figure8 />
      <InfinityGrid />
      <ParticleSystem />
    </>
  );
}
