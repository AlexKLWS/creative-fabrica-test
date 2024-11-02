// @ts-nocheck seems that @react-three/fiber v9 alpha type definitions aren't ready yet
"use client";
import * as THREE from "three";
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useSprings, a } from "@react-spring/three";

const length = 35;
const colors = [
  "#A2CCB6",
  "#FCEEB5",
  "#EE786E",
  "#e0feff",
  "lightpink",
  "lightblue",
];
const data = Array.from({ length }, () => ({
  args: [0.1 + Math.random() * 9, 0.1 + Math.random() * 9, 10],
}));
const random = (i) => {
  const r = Math.random();
  return {
    position: [100 - Math.random() * 200, 100 - Math.random() * 200, i * 1.5],
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    scale: [1 + r * 14, 1 + r * 14, 1],
    rotation: [0, 0, THREE.MathUtils.degToRad(Math.round(Math.random()) * 45)],
  };
};

function Content() {
  const [springs, set] = useSprings(length, (i) => ({
    from: random(i),
    ...random(i),
    config: { mass: 25, tension: 280, friction: 120 },
  }));
  useEffect(
    () =>
      void setInterval(
        () => set((i) => ({ ...random(i), delay: i * 60 })),
        5000
      ),
    []
  );
  return data.map((d, index) => (
    <a.mesh key={index} {...springs[index]}>
      <boxGeometry args={d.args} />
      <a.meshStandardMaterial
        color={springs[index].color}
        roughness={0.75}
        metalness={0.5}
      />
    </a.mesh>
  ));
}

const DynamicBackground = () => {
  return (
    <div className="h-full w-full absolute pointer-events-none -z-10">
      <Canvas flat shadows camera={{ position: [0, 0, 100], fov: 100 }}>
        <ambientLight intensity={4.85} />
        <spotLight
          castShadow
          intensity={0.2}
          angle={Math.PI / 7}
          position={[150, 150, 250]}
          penumbra={1}
          shadow-mapSize={2048}
        />
        <Content />
      </Canvas>
    </div>
  );
};

export default DynamicBackground;
