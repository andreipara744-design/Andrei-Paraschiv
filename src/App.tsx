import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Timer } from 'three/addons/misc/Timer.js';
import Scene3D from './Scene3D';
import OverlayUI from './OverlayUI';
import MethodsDeepDive from './MethodsDeepDive';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 2, 15]} />
        
        {currentView === 'home' && (
          <ScrollControls pages={5} damping={0.2}>
            <Scene3D />
            <OverlayUI onNavigate={() => setCurrentView('methods')} />
          </ScrollControls>
        )}

        {currentView === 'methods' && (
          <MethodsDeepDive />
        )}

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={2.0} 
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
