import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";

const WHITE = "#f8f8f5";
const ORBIT = "#8f918e";
const SILVER = "#b8bab6";
const CORE_LINE = "#737572";

function curve(radius, vertical, wobble, phase, harmonic = 3, count = 260) {
  return Array.from({ length: count + 1 }, (_, index) => {
    const t = (index / count) * Math.PI * 2;
    return new THREE.Vector3(
      Math.cos(t + phase) * radius + Math.sin(t * harmonic + phase) * wobble,
      Math.sin(t * 2 + phase) * vertical + Math.cos(t * 5 + phase) * wobble * 0.32,
      Math.sin(t + phase) * radius + Math.cos(t * (harmonic + 1) + phase) * wobble
    );
  });
}

function CoreGlow() {
  const core = useRef();
  useFrame((state) => {
    if (!core.current) return;
    const breath = 1 + Math.sin(state.clock.elapsedTime * 0.46) * 0.035;
    core.current.scale.setScalar(breath);
  });

  return (
    <group ref={core}>
      <mesh>
        <sphereGeometry args={[0.78, 64, 64]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.075} />
      </mesh>
      <mesh scale={1.22}>
        <sphereGeometry args={[0.82, 48, 48]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.022} depthWrite={false} />
      </mesh>
      <mesh scale={1.65}>
        <sphereGeometry args={[0.82, 48, 48]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.008} depthWrite={false} />
      </mesh>
      <mesh rotation={[0.25, 0.5, 0]}>
        <icosahedronGeometry args={[1.06, 3]} />
        <meshBasicMaterial color={CORE_LINE} wireframe transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

function OrbitalArchitecture() {
  const group = useRef();
  const paths = useMemo(() => {
    const generated = [];
    for (let i = 0; i < 22; i += 1) {
      generated.push(curve(
        1.45 + i * 0.105,
        0.34 + (i % 6) * 0.15,
        0.035 + (i % 5) * 0.025,
        i * 0.57,
        2 + (i % 6)
      ));
    }
    return generated;
  }, []);

  const radialLines = useMemo(() => Array.from({ length: 42 }, (_, i) => {
    const a = (i / 42) * Math.PI * 2;
    const r = 2.2 + (i % 7) * 0.25;
    return [
      new THREE.Vector3(Math.cos(a) * 0.92, Math.sin(a * 3) * 0.22, Math.sin(a) * 0.92),
      new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 2.35) * (0.7 + (i % 4) * 0.24), Math.sin(a) * r)
    ];
  }), []);

  const constellation = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 24; i += 1) {
      const a = (i / 24) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(a) * (2.15 + (i % 4) * 0.38),
        Math.sin(a * 1.7) * 1.18,
        Math.sin(a) * (2.15 + ((i + 2) % 5) * 0.29)
      ));
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.027;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.075, 0.025);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * 0.045, 0.025);
  });

  return (
    <group ref={group}>
      <CoreGlow />
      {paths.map((points, index) => (
        <Line key={`orbit-${index}`} points={points} color={ORBIT} transparent opacity={0.19 + (index % 4) * 0.022} lineWidth={0.34} />
      ))}
      {radialLines.map((points, index) => (
        <Line key={`radial-${index}`} points={points} color={SILVER} transparent opacity={0.12} lineWidth={0.28} />
      ))}
      <Line points={[...constellation, constellation[0]]} color={ORBIT} transparent opacity={0.18} lineWidth={0.34} />
      {constellation.map((point, index) => (
        <mesh key={`satellite-${index}`} position={point} scale={index % 5 === 0 ? 1.5 : 1}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color={WHITE} transparent opacity={0.9} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, index) => (
        <mesh key={`ring-${index}`} rotation={[0.16 + index * 0.31, 0.35 + index * 0.61, index * 0.19]}>
          <torusGeometry args={[1.35 + index * 0.245, 0.0042, 8, 240]} />
          <meshBasicMaterial color={ORBIT} transparent opacity={0.19} />
        </mesh>
      ))}
    </group>
  );
}

function MemoryFragment({ memory, active, onSelect, onActiveScreenPosition }) {
  const node = useRef();
  const halo = useRef();
  const [hovered, setHovered] = useState(false);
  const { camera, size } = useThree();

  const position = useMemo(() => [
    Math.cos(memory.angle) * memory.distance,
    memory.height,
    Math.sin(memory.angle) * memory.distance
  ], [memory]);

  useFrame((state) => {
    if (!node.current || !halo.current) return;
    const awaken = active || hovered;
    const target = active ? 1.5 : hovered ? 1.28 : 1;
    node.current.scale.setScalar(THREE.MathUtils.lerp(node.current.scale.x, target, 0.07));
    halo.current.scale.setScalar(THREE.MathUtils.lerp(halo.current.scale.x, awaken ? 2.35 : 1.18, 0.055));
    halo.current.material.opacity = THREE.MathUtils.lerp(halo.current.material.opacity, active ? 0.13 : hovered ? 0.085 : 0.025, 0.06);

    if (active && onActiveScreenPosition) {
      const projected = new THREE.Vector3(...position).project(camera);
      onActiveScreenPosition({
        x: (projected.x * 0.5 + 0.5) * size.width,
        y: (-projected.y * 0.5 + 0.5) * size.height
      });
    }
  });

  const core = new THREE.Vector3(0, 0, 0);
  const nodePoint = new THREE.Vector3(...position);

  return (
    <group>
      {(hovered || active) && <Line points={[core, nodePoint]} color={WHITE} transparent opacity={active ? 0.34 : 0.18} lineWidth={0.6} />}
      <group position={position}>
        <mesh ref={node} onClick={(e) => { e.stopPropagation(); onSelect(memory); }} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
          <sphereGeometry args={[0.065 + (memory.intensity ?? 0.5) * 0.038, 24, 24]} />
          <meshBasicMaterial color={WHITE} transparent opacity={0.96} />
        </mesh>
        <mesh ref={halo}>
          <sphereGeometry args={[0.18, 28, 28]} />
          <meshBasicMaterial color={WHITE} transparent opacity={0.025} depthWrite={false} />
        </mesh>
        {(hovered || active) && (
          <Html center distanceFactor={10}>
            <button className="orbit-label" onClick={() => onSelect(memory)}>
              <span>{memory.date}</span>
              <strong>{memory.time}</strong>
              <small>FRAGMENT // {memory.id}</small>
            </button>
          </Html>
        )}
      </group>
    </group>
  );
}

function Scene({ memories, activeMemory, onSelect, onActiveScreenPosition }) {
  return (
    <>
      <fog attach="fog" args={["#d0d1ce", 9.5, 22]} />
      <ambientLight intensity={0.35} />
      <OrbitalArchitecture />
      {memories.map((memory) => (
        <MemoryFragment key={memory.id} memory={memory} active={activeMemory?.id === memory.id} onSelect={onSelect} onActiveScreenPosition={onActiveScreenPosition} />
      ))}
      <Sparkles count={190} scale={14} size={0.7} speed={0.045} opacity={0.25} />
      <OrbitControls enablePan={false} enableZoom minDistance={5.2} maxDistance={11} autoRotate={!activeMemory} autoRotateSpeed={0.08} dampingFactor={0.05} />
    </>
  );
}

export default function MemoryOrbit({ memories, activeMemory, onSelect, onActiveScreenPosition }) {
  return (
    <div className="orbit-canvas">
      <Canvas camera={{ position: [0, 0.95, 7.8], fov: 46 }} dpr={[1, 2]}>
        <Scene memories={memories} activeMemory={activeMemory} onSelect={onSelect} onActiveScreenPosition={onActiveScreenPosition} />
      </Canvas>
    </div>
  );
}
