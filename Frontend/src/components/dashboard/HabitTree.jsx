import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Helper for color interpolation
function lerpColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t).getStyle();
}

const BRANCH_ANGLES = [Math.PI / 4, -Math.PI / 4, Math.PI / 8, -Math.PI / 8];

export default function HabitTree({
  position,
  habit,
  streak,
  dull,
  milestone,
}) {
  const group = useRef();

  // Sway animation
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.7 + position[0]) * 0.04;
    }
  });

  // Trunk
  const trunkHeight = 1.2 + streak * 0.13;
  const trunkRadiusTop = 0.13 + Math.min(streak, 50) * 0.012;
  const trunkRadiusBottom = 0.22 + Math.min(streak, 50) * 0.018;

  // Branches
  const branchCount = 2 + Math.floor(streak / 5);
  const branchLength = 0.5 + streak * 0.04;
  const branchThickness = 0.09 + streak * 0.005;

  // Leaves
  const leafCount = 8 + Math.floor(streak / 2);
  let leafColor = "#228B22";
  if (streak >= 50) leafColor = "#7CFC00";
  else if (streak >= 20) leafColor = "#32CD32";
  else if (streak >= 10) leafColor = "#32CD32";
  const leafDull = dull ? "#b7c9b7" : leafColor;

  // Glow
  let glowColor = null;
  let glowIntensity = 0;
  if (streak >= 50) {
    glowColor = "#00FA9A";
    glowIntensity = 1.2;
  } else if (streak >= 20) {
    glowColor = "#00FF7F";
    glowIntensity = 0.8;
  } else if (streak >= 10) {
    glowColor = "#00FF7F";
    glowIntensity = 0.5;
  }

  // Sparkle burst for milestones
  const showSparkles = milestone;

  // Leaves positions
  const leaves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const y = trunkHeight / 2 + 0.3 + Math.random() * 0.2;
      arr.push([
        Math.cos(angle) * 0.35 + (Math.random() - 0.5) * 0.1,
        y + (Math.random() - 0.5) * 0.1,
        Math.sin(angle) * 0.35 + (Math.random() - 0.5) * 0.1,
      ]);
    }
    return arr;
    // eslint-disable-next-line
  }, [leafCount, trunkHeight]);

  // Branches positions
  const branches = useMemo(() => {
    const arr = [];
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      arr.push(angle);
    }
    return arr;
  }, [branchCount]);

  // Grass tufts for high streaks
  const grassTufts =
    streak >= 10 ? Array(3 + Math.floor(streak / 10)).fill(0) : [];

  // Leaf shimmer for 50+ days
  useFrame(({ clock }) => {
    if (group.current && streak >= 50) {
      group.current.children.forEach((child, idx) => {
        if (child.name === "leaf") {
          child.scale.setScalar(
            1 + Math.sin(clock.getElapsedTime() * 2 + idx) * 0.07
          );
        }
      });
    }
  });

  return (
    <group position={position} ref={group}>
      {/* Trunk */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[trunkRadiusTop, trunkRadiusBottom, trunkHeight, 14]}
        />
        <meshStandardMaterial
          color={dull ? "#a3a3a3" : "#8B5A2B"}
          roughness={0.55}
          metalness={0.18}
        />
      </mesh>
      {/* Trunk roots (darker base) */}
      <mesh position={[0, -trunkHeight / 2 + 0.13, 0]} scale={[1.1, 0.4, 1.1]}>
        <sphereGeometry args={[trunkRadiusBottom * 0.9, 10, 10]} />
        <meshStandardMaterial color="#5C4033" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Branches */}
      {branches.map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.18,
            trunkHeight / 2 - 0.15,
            Math.cos(angle) * 0.18,
          ]}
          rotation={[0, angle, -Math.PI / 4]}
          castShadow
        >
          <cylinderGeometry
            args={[
              branchThickness * 0.7,
              branchThickness,
              branchLength * (0.9 + Math.random() * 0.2),
              10,
            ]}
          />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#A0522D" : "#7B3F00"}
            roughness={0.38}
            metalness={0.22}
          />
        </mesh>
      ))}
      {/* Leaves */}
      {leaves.map((pos, i) => (
        <mesh
          key={i}
          name="leaf"
          position={pos}
          castShadow
          scale={1 + Math.random() * 0.2}
        >
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial
            color={leafDull}
            roughness={0.18}
            metalness={0.13}
            emissive={leafDull}
            emissiveIntensity={dull ? 0.2 : 0.7}
          />
        </mesh>
      ))}
      {/* Glow Aura */}
      {glowColor && (
        <mesh position={[0, trunkHeight / 2 + 0.2, 0]}>
          <sphereGeometry args={[0.55 + streak * 0.04, 24, 24]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={glowIntensity}
            transparent
            opacity={0.18 + Math.sin(Date.now() / 700) * 0.06}
          />
        </mesh>
      )}
      {/* Sparkles for milestones */}
      {showSparkles && (
        <Sparkles
          count={18}
          scale={[1.2, 1.2, 1.2]}
          size={3}
          color={["#FFFFFF", "#90EE90", "#FFD700"]}
          position={[0, trunkHeight / 2 + 0.3, 0]}
          speed={0.8}
        />
      )}
      {/* Grass tufts */}
      {grassTufts.map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / grassTufts.length) * Math.PI * 2) * 0.35,
            -trunkHeight / 2 + 0.05,
            Math.sin((i / grassTufts.length) * Math.PI * 2) * 0.35,
          ]}
          scale={[0.18, 0.09 + Math.random() * 0.05, 0.18]}
        >
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial
            color="#6B8E23"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      ))}
      {/* Floating label */}
      <Html
        position={[0, trunkHeight / 2 + 0.7, 0]}
        center
        style={{
          pointerEvents: "none",
          fontWeight: 700,
          color: "#2F4F4F",
          background: "rgba(255,255,255,0.7)",
          borderRadius: 8,
          padding: "6px 14px",
          fontSize: 15,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.13)",
          border: "2px solid #006400",
        }}
      >
        {habit.name} <span style={{ color: "#228B22" }}>({streak})</span>
      </Html>
    </group>
  );
}
