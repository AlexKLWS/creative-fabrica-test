// @ts-nocheck seems that @react-three/fiber v9 alpha type definitions aren't ready yet
"use client";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { PerspectiveCamera, CameraShake } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const gridSize = 28;

function Rig() {
  const [vec] = useState(() => new THREE.Vector3());
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.lerp(vec.set(20 + mouse.x * 2, 10, 128), 0.05);
  });
  return (
    <CameraShake
      maxYaw={0.01}
      maxPitch={0.01}
      maxRoll={0.01}
      yawFrequency={0.05}
      pitchFrequency={0.05}
      rollFrequency={0.04}
    />
  );
}

const DynamicBackground = () => {
  const obj = useLoader(
    OBJLoader,
    "https://raw.githubusercontent.com/iondrimba/images/master/buildings.obj"
  );

  const [buildings, setBuildings] =
    useState<THREE.Object3D<THREE.Object3DEventMap>[]>();

  useEffect(() => {
    if (obj && !buildings?.length) {
      const modelsRef = [...obj.children].map((model) => {
        const scale = 0.01;

        model.scale.set(scale, scale, scale);
        model.receiveShadow = true;
        model.castShadow = true;

        return model;
      });

      const getRandomBuiding = () => {
        return modelsRef[
          Math.floor(Math.random() * Math.floor(modelsRef.length))
        ];
      };

      const boxSize = 3;

      const buildingsRef = [];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const building = getRandomBuiding()?.clone();
          if (building) {
            building.position.set(i * boxSize, 0, j * boxSize);

            buildingsRef.push(building);
          }
        }
      }
      setBuildings(buildingsRef);
    }
  }, [obj]);

  return (
    <div className="h-full w-full absolute pointer-events-none -z-10">
      <Canvas>
        <fog attach="fog" args={["white", 1, 146]} />
        <PerspectiveCamera
          rotation={[-0.22, 0, 0]}
          makeDefault
          far={1000}
          near={0.1}
          fov={20}
        >
          <ambientLight intensity={0.2} color={"#0000ff"} />
          <directionalLight
            castShadow
            position={[10, 40, 15]}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-left={-8}
            shadow-camera-bottom={-8}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            intensity={2}
            shadow-bias={-0.0001}
          />
        </PerspectiveCamera>
        {buildings?.map((b) => (
          <primitive
            key={b.id}
            object={b}
            scale={0.01}
            receiveShadow={true}
            castShadow={true}
            material={
              new THREE.MeshStandardMaterial({
                color: new THREE.Color("#FFF"),
              })
            }
          />
        ))}
        <Rig />
      </Canvas>
      <div className="absolute top-0 left-0 right-0 bottom-0 h-full w-full pointer-events-none bg-slate-50/80" />
    </div>
  );
};

export default DynamicBackground;
