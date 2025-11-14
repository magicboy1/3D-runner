import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#7CB342" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#8BC34A" />
      </mesh>
    </group>
  );
}

function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.6, 0.1, 0]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.6, 0.1, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

function PlayerPreview() {
  const { scene } = useGLTF("/models/player.glb");
  const clonedScene = scene.clone();
  
  return <primitive object={clonedScene} scale={1.5} position={[0, 1.2, -3]} />;
}

function MenuScene3D() {
  const buildings = useMemo(() => {
    const colors = ['#7CB342', '#42A5F5', '#FFB74D'];
    return [
      { x: -10, z: -15, height: 8, color: colors[0] },
      { x: 10, z: -18, height: 6, color: colors[1] },
      { x: -8, z: -25, height: 10, color: colors[2] },
    ];
  }, []);
  
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <hemisphereLight args={["#87CEEB", "#8BC34A", 0.6]} />
      
      <mesh receiveShadow position={[0, -0.1, -5]}>
        <boxGeometry args={[10, 0.2, 25]} />
        <meshStandardMaterial color="#D97C47" />
      </mesh>
      
      <mesh position={[-1.5, 0.01, -5]}>
        <boxGeometry args={[0.15, 0.02, 25]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[1.5, 0.01, -5]}>
        <boxGeometry args={[0.15, 0.02, 25]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      
      <mesh position={[-5.5, -0.05, -5]}>
        <boxGeometry args={[1, 0.3, 25]} />
        <meshStandardMaterial color="#7CB342" />
      </mesh>
      <mesh position={[5.5, -0.05, -5]}>
        <boxGeometry args={[1, 0.3, 25]} />
        <meshStandardMaterial color="#7CB342" />
      </mesh>
      
      <Tree position={[-7, 0, -2]} />
      <Tree position={[7, 0, -4]} />
      <Tree position={[-7, 0, -10]} />
      <Tree position={[7, 0, -12]} />
      
      {buildings.map((building, i) => (
        <mesh
          key={i}
          position={[building.x, building.height / 2, building.z]}
          castShadow
        >
          <boxGeometry args={[4, building.height, 4]} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}
      
      <Cloud position={[-8, 8, -15]} />
      <Cloud position={[8, 9, -20]} />
      
      <Suspense fallback={
        <mesh position={[0, 1.2, -3]}>
          <boxGeometry args={[0.8, 1.2, 0.8]} />
          <meshStandardMaterial color="#4CAF50" />
        </mesh>
      }>
        <PlayerPreview />
      </Suspense>
    </>
  );
}

export function MenuScreen() {
  const start = useStepChallenge((state) => state.start);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 3, 8], fov: 60 }}
        >
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 10, 40]} />
          <MenuScene3D />
        </Canvas>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg z-20 bg-white/90 hover:bg-white"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <div className="relative h-full flex flex-col items-center justify-end pb-20 px-4 max-w-4xl mx-auto z-10">
        <div className="text-center space-y-6 backdrop-blur-md bg-white/10 p-8 rounded-3xl border-2 border-white/30 shadow-2xl">
          <div className="space-y-2">
            <h1 className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 drop-shadow-lg" 
                dir="rtl"
                style={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 100, 255, 0.3)'
                }}>
              عداء الأمان الرقمي
            </h1>
            <h2 className="text-3xl lg:text-5xl font-bold text-white/90 drop-shadow-md" dir="rtl">
              Digital Safety Runner
            </h2>
          </div>
          
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
            <p className="text-xl lg:text-2xl font-bold text-white" dir="rtl">
              🎮 لعبة ثلاثية الأبعاد
            </p>
          </div>
          
          <p className="text-lg lg:text-xl text-white max-w-md mx-auto lg:mx-0 drop-shadow-md leading-relaxed" dir="rtl">
            اركض، اقفز، وانزلق! اجمع العملات وتجنب الفيروسات في مغامرة سريعة ومثيرة!
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 space-y-3">
            <p className="text-white font-bold text-xl flex items-center justify-center lg:justify-end gap-2" dir="rtl">
              <span>👆</span>
              <span>التحكم</span>
            </p>
            <div className="space-y-2 text-white/90">
              <div className="flex items-center justify-center lg:justify-end gap-2" dir="rtl">
                <span className="text-lg">⬅️ ➡️ يمين/يسار للتحرك</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-2" dir="rtl">
                <span className="text-lg">⬆️ للقفز | ⬇️ للانزلاق</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={start}
            size="lg"
            className="text-3xl px-16 py-10 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-black rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/30"
            style={{
              boxShadow: '0 0 40px rgba(74, 222, 128, 0.6), 0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span dir="rtl" className="flex items-center gap-3">
              <span>🚀</span>
              <span>ابدأ اللعب</span>
              <span>🎯</span>
            </span>
          </Button>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
