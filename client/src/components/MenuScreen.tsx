import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingObjects() {
  const groupRef = useRef<THREE.Group>(null);
  
  const objects = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ] as [number, number, number],
        scale: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.5 + 0.2,
        type: Math.random() > 0.5 ? 'box' : 'sphere'
      });
    }
    return arr;
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <mesh key={i} position={obj.position} scale={obj.scale}>
          {obj.type === 'box' ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : (
            <sphereGeometry args={[0.5, 16, 16]} />
          )}
          <meshStandardMaterial 
            color={i % 3 === 0 ? "#4CAF50" : i % 3 === 1 ? "#2196F3" : "#FF9800"}
            wireframe={i % 2 === 0}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function AnimatedParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4CAF50" />
      <FloatingObjects />
      <AnimatedParticles />
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
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
        >
          <Scene3D />
        </Canvas>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/40"></div>
      
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg z-20 bg-white/90 hover:bg-white"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <div className="relative h-full flex flex-col lg:flex-row items-center justify-center gap-8 px-4 max-w-7xl mx-auto z-10">
        <div className="relative perspective-1000 transform-gpu">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse" 
               style={{ animationDuration: '2s' }}></div>
          <div className="relative transform hover:scale-110 transition-transform duration-500">
            <img 
              src="/images/hero-character.png" 
              alt="Hero Character" 
              className="relative w-72 h-72 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 20px 50px rgba(255, 100, 0, 0.5))',
                animation: 'float 3s ease-in-out infinite'
              }}
            />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/30 rounded-full blur-xl"></div>
        </div>
        
        <div className="text-center lg:text-right space-y-6 backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/20">
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
