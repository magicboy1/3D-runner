export function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 15, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.3}
        color="#4FC3F7"
      />
      <hemisphereLight
        args={["#87CEEB", "#8BC34A", 0.5]}
      />
    </>
  );
}
