import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Sparkles } from "@react-three/drei";
import HabitTree from "./HabitTree";
import Legend from "./Legend";

// Color palette for habits
const palette = [
  "#34D399", // green
  "#A2BFFE", // blue
  "#FFB347", // orange
  "#FF6961", // red
  "#B19CD9", // purple
  "#FFD700", // gold
  "#FF69B4", // pink
  "#43E6D8", // teal
  "#C0C0C0", // silver
  "#8B5E3C", // brown
];

function getColor(idx) {
  return palette[idx % palette.length];
}

// Simple cloud component
function Cloud({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.7, 0.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.7, 0.1, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.3, -0.2, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Sun component (opposite to shadow direction)
function Sun({ position = [-15, 18, -15] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[1.7, 32, 32]} />
      <meshBasicMaterial color="#FFD700" emissive="#FFD700" />
    </mesh>
  );
}

export default function HabitForest3D({ habits }) {
  // Spread trees out evenly
  const spacing = 2.7;
  const offset = ((habits.length - 1) * spacing) / 2;

  // For milestone sparkles
  const getMilestone = (streak) =>
    streak === 10 || streak === 25 || streak === 50;

  // For dull trees (if streak is 0)
  const isDull = (habit) => !habit.currentStreak || habit.currentStreak < 1;

  // Memoize for perf
  const treeProps = useMemo(
    () =>
      habits.map((habit, idx) => ({
        position: [idx * spacing - offset, 0, 0],
        habit,
        streak: habit.currentStreak || 0,
        dull: isDull(habit),
        milestone: getMilestone(habit.currentStreak || 0),
      })),
    [habits, offset]
  );

  return (
    <div style={{ width: "100%", height: 520, position: "relative" }}>
      <Legend habits={habits} getColor={getColor} />
      <Canvas
        camera={{ position: [0, 4, 13], fov: 50 }}
        shadows
        style={{
          borderRadius: 18,
          background: "linear-gradient(180deg, #6CB6FF 0%, #B0E0E6 100%)",
        }}
      >
        {/* Sky gradient */}
        <Sky
          sunPosition={[100, 20, 100]}
          turbidity={8}
          rayleigh={6}
          mieCoefficient={0.01}
          mieDirectionalG={0.8}
          inclination={0.45}
          azimuth={0.25}
        />
        {/* Sun (opposite to shadow direction) */}
        <Sun position={[-15, 18, -15]} />
        {/* Clouds */}
        <Cloud position={[-6, 8, -10]} scale={1.8} />
        <Cloud position={[5, 7.5, -8]} scale={1.3} />
        <Cloud position={[0, 9, -12]} scale={2.1} />
        {/* Ambient particles */}
        <Sparkles
          count={40}
          scale={[habits.length * 2.5, 2, 6]}
          size={2.5}
          color={["#FFFFFF", "#90EE90", "#FFD700"]}
          opacity={0.18}
          position={[0, 2, 0]}
          speed={0.3}
        />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={6}
          maxDistance={30}
        />
        {/* Soft ground with grass patches */}
        <mesh receiveShadow position={[0, -0.7, 0]}>
          <cylinderGeometry args={[100, 100, 0.5, 64]} />
          <meshStandardMaterial
            color="#DEB887"
            roughness={0.8}
            metalness={0.1}
            bumpScale={0.12}
          />
        </mesh>
        {/* Random grass patches */}
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 12) * Math.PI * 2) * 4.5 + (Math.random() - 0.5),
                -0.45,
                Math.sin((i / 12) * Math.PI * 2) * 4.5 + (Math.random() - 0.5),
              ]}
              scale={[
                0.5 + Math.random() * 0.3,
                0.2,
                0.5 + Math.random() * 0.3,
              ]}
            >
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial
                color="#6B8E23"
                roughness={0.7}
                metalness={0.1}
              />
            </mesh>
          ))}
        {/* Render all trees */}
        {treeProps.map((props, idx) => (
          <HabitTree key={props.habit._id || idx} {...props} />
        ))}
      </Canvas>
    </div>
  );
}