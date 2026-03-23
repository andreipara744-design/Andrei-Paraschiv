import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';

function RemixedGrid() {
  const scroll = useScroll();
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    const offset = scroll.offset;
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 4) % 1;
      gridRef.current.rotation.z = offset * Math.PI; // twist
      
      const opacity = 1 - THREE.MathUtils.smoothstep(offset, 0.15, 0.25);
      const material = gridRef.current.material as THREE.Material;
      material.opacity = opacity * 0.5;
      material.transparent = true;
      gridRef.current.visible = opacity > 0;
    }
  });

  return (
    <gridHelper 
      ref={gridRef} 
      args={[40, 40, '#B026FF', '#4B0082']} 
      position={[0, -2, 0]} 
    />
  );
}

function RemixedHexagons() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#8A2BE2", wireframe: true, transparent: true }), []);

  useFrame((state) => {
    const offset = scroll.offset;
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.15, 0.25);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(offset, 0.35, 0.45);
      const opacity = Math.min(fadeIn, fadeOut);
      
      material.opacity = opacity;
      groupRef.current.visible = opacity > 0;
      
      const scale = THREE.MathUtils.lerp(0.1, 2, (offset - 0.1) * 3);
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} material={material} position={[0, 0, -i * 2]}>
          <cylinderGeometry args={[2 + i, 2 + i, 0.5, 6]} />
        </mesh>
      ))}
    </group>
  );
}

function RemixedFigure8() {
  const scroll = useScroll();
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#9D00FF", wireframe: true, transparent: true }), []);

  const curve = useMemo(() => {
    class TrefoilKnot extends THREE.Curve<THREE.Vector3> {
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        t *= Math.PI * 2;
        const x = Math.sin(t) + 2 * Math.sin(2 * t);
        const y = Math.cos(t) - 2 * Math.cos(2 * t);
        const z = -Math.sin(3 * t);
        return optionalTarget.set(x, y, z).multiplyScalar(0.8);
      }
    }
    return new TrefoilKnot();
  }, []);

  useFrame((state) => {
    const offset = scroll.offset;
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.4, 0.5);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(offset, 0.6, 0.7);
      const opacity = Math.min(fadeIn, fadeOut);
      
      material.opacity = opacity;
      meshRef.current.visible = opacity > 0;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <tubeGeometry args={[curve, 128, 0.2, 8, true]} />
    </mesh>
  );
}

function RemixedTunnel() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#B026FF", transparent: true, wireframe: true }), []);

  const geometry = useMemo(() => new THREE.TorusGeometry(3, 0.1, 16, 100), []);

  useFrame((state) => {
    const offset = scroll.offset;
    if (groupRef.current) {
      groupRef.current.position.z = (state.clock.elapsedTime * 5) % 2;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.65, 0.75);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(offset, 0.85, 0.95);
      const opacity = Math.min(fadeIn, fadeOut);
      
      material.opacity = opacity;
      groupRef.current.visible = opacity > 0;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} geometry={geometry} material={material} position={[0, 0, -i * 2]} />
      ))}
    </group>
  );
}

function SphereParticles() {
  const scroll = useScroll();
  const pointsRef = useRef<THREE.Points>(null);
  const material = useMemo(() => new THREE.PointsMaterial({ 
    color: "#8A2BE2", 
    size: 0.08, 
    sizeAttenuation: true, 
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
  }), []);

  const [positions, sizes] = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 2 + Math.random() * 0.5;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      sz[i] = Math.random() * 0.05;
    }
    return [pos, sz];
  }, []);

  useFrame((state) => {
    const offset = scroll.offset;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.9, 1.0);
      
      material.opacity = fadeIn;
      pointsRef.current.visible = fadeIn > 0;
      
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      const scale = THREE.MathUtils.lerp(0.1, pulse, fadeIn);
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

function MethodsOverlay() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      await fetch('https://script.google.com/macros/s/AKfycbxmBp-RaxKnnC8C99XkUy9zVgOIWB6lARtE8q7sW5EutidoO2Rk6E42UBejmqRpbLP_/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ email })
      });
      // no-cors doesn't return readable response, assume success
      setStatus('success');
    } catch (error) {
      setStatus('success');
    }
  };

  return (
    <Scroll html style={{ width: '100%' }}>
      {/* SCENA 1 */}
      <div style={{ position: 'absolute', top: '0vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(157,0,255,0.8)]">
          Masterclass: Execuția.
        </h1>
        <p className="text-lg md:text-xl text-purple-200 max-w-3xl">
          Aici nu vindem vise. Aici implementăm sisteme. Ai nevoie doar de un laptop și conexiune la internet. Urmează prompturile cu strictețe.
        </p>
      </div>

      {/* SCENA 2 */}
      <div style={{ position: 'absolute', top: '180vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(138,43,226,0.8)]">
          Metoda #1: Sistemul AI pentru Stomatologi<br/><span className="text-2xl text-purple-300">(Retainer 150€/lună)</span>
        </h2>
        <div className="text-left bg-black/60 p-6 rounded-xl border border-purple-500/40 backdrop-blur-md max-w-4xl space-y-4">
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 1: Construcția.</strong> Intră pe Voiceflow.com. Alege template-ul 'Appointment Booking'. Setează AI-ul să ceară 3 lucruri: Nume, Problemă, Data dorită.</p>
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 2: Prospectarea.</strong> Caută pe Google Maps "stomatolog [oraș]" care NU are website modern. Găsește adresa de email.</p>
          <div className="bg-purple-900/30 p-4 rounded border border-purple-500/30">
            <p className="text-purple-200 text-sm font-mono">
              <strong>PROMPT-UL DE VÂNZARE (ChatGPT):</strong><br/>
              "Acționează ca un expert în cold email. Scrie un email de 4 rânduri către un cabinet stomatologic. Subiect: 'Am created un sistem pentru voi'. Text: Spune-le că ai observat că nu au programări automate online. Zi-le că le-ai construit gratuit un asistent AI care preia mesaje 24/7 și întreabă-i la ce număr de WhatsApp le poți trimite demo-ul de 1 minut. Fără linkuri, fără vânzare agresivă."
            </p>
          </div>
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 4: Livrarea.</strong> Când răspund, trimite-le linkul de test Voiceflow. Dacă vor să-l pună pe site, cere-le 150€/lună (plată recurentă prin Stripe) pentru "mentenanță server și tokeni AI".</p>
        </div>
      </div>

      {/* SCENA 3 */}
      <div style={{ position: 'absolute', top: '360vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(176,38,255,0.8)]">
          Metoda #2: Fabrica de Somn pentru Copii<br/><span className="text-2xl text-purple-300">(Monetizare YouTube)</span>
        </h2>
        <div className="text-left bg-black/60 p-6 rounded-xl border border-purple-500/40 backdrop-blur-md max-w-4xl space-y-4">
          <div className="bg-purple-900/30 p-4 rounded border border-purple-500/30">
            <p className="text-purple-200 text-sm font-mono">
              <strong>PROMPT-UL PENTRU SCRIPT (Claude.ai):</strong><br/>
              "Ești un scriitor de povești terapeutice pentru copii. Scrie un script de 1500 de cuvinte pentru un video de YouTube conceput să adoarmă un copil de 4-6 ani. Subiect: Călătoria unei frunze de toamnă. Folosește un ritm foarte lent, repetitiv, cu pauze marcate prin [PAUZĂ 3 SECUNDE]. Indică sunetele de fundal necesare (ex: vânt lin, apă curgătoare)."
            </p>
          </div>
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 2: Vocea.</strong> Pune textul în ElevenLabs. Alege o voce feminină blândă. Setează 'Stability' la 80% pentru un ton constant și monoton.</p>
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 3: Vizualul.</strong> În Leonardo.ai, generează imagini de fundal folosind promptul: "Lo-fi anime style, night sky, gentle autumn leaf floating, dark blue and purple colors, relaxing background, 16:9".</p>
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 4: Monetizare.</strong> Editează în CapCut. Postează de 3 ori pe săptămână. Activează YouTube Partner Program după 1000 abonați.</p>
        </div>
      </div>

      {/* SCENA 4 */}
      <div style={{ position: 'absolute', top: '540vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(157,0,255,0.8)]">
          Metoda #3: Arbitrajul SEO pe Etsy<br/><span className="text-2xl text-purple-300">(20$ per micro-serviciu)</span>
        </h2>
        <div className="text-left bg-black/60 p-6 rounded-xl border border-purple-500/40 backdrop-blur-md max-w-4xl space-y-4">
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 1: Găsirea clienților.</strong> Caută pe Etsy "handmade leather wallet" (sau altă nișă). Mergi la paginile 5-10. Acolo sunt vânzătorii disperați care nu fac vânzări pentru că nu au SEO bun.</p>
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 2: Oferta.</strong> Trimite-le mesaj: "Produsele tale sunt grozave, dar nu apar în căutări. Te ajut să pui 5 produse pe prima pagină optimizând titlurile și tag-urile pentru 20$."</p>
          <div className="bg-purple-900/30 p-4 rounded border border-purple-500/30">
            <p className="text-purple-200 text-sm font-mono">
              <strong>PROMPT-UL DE EXECUȚIE (ChatGPT):</strong><br/>
              "Acționează ca un algoritm de ranking Etsy (Etsy Search Algorithm expert). Am acest produs: [TITLUL VECHI]. Generează: 1) Un titlu SEO complet de maxim 140 de caractere care folosește cele mai căutate cuvinte cheie. 2) O listă exactă de 13 Tag-uri (etichete), fiecare de maxim 20 caractere (folosește long-tail keywords). 3) O descriere de produs care încorporează natural aceste tag-uri în primele 2 rânduri."
            </p>
          </div>
          <p className="text-purple-100"><strong className="text-purple-300">Pasul 4: Trimite-le documentul.</strong> Durează 2 minute per client.</p>
        </div>
      </div>

      {/* SCENA 5 - Formular */}
      <div style={{ position: 'absolute', top: '720vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(176,38,255,1)]">
          Sistemul este la dispoziția ta.
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-10 max-w-2xl">
          Vrei să primești o metodă ultra-nișată nouă, testată, în fiecare vineri dimineață? Nu facem spam, facem bani.
        </p>
        
        {status === 'success' ? (
          <div className="animate-fade-in max-w-2xl bg-black/60 p-8 rounded-2xl border border-purple-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(157,0,255,0.4)]">
            <p className="text-2xl md:text-3xl font-bold text-purple-400 drop-shadow-[0_0_15px_rgba(176,38,255,0.8)]">
              BINE AI VENIT! Verifică-ți adresa de Gmail (inclusiv Spam) pentru link-ul de Telegram.
            </p>
          </div>
        ) : (
          <form className="flex flex-col sm:flex-row gap-4 w-full max-w-md" onSubmit={handleSubmit}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email-ul tău" 
              required
              disabled={status === 'loading'}
              className="flex-1 bg-black/50 border border-purple-500/50 rounded-full px-6 py-4 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_15px_rgba(157,0,255,0.5)] transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(157,0,255,0.6)] hover:shadow-[0_0_30px_rgba(176,38,255,0.9)] hover:scale-105 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Se procesează...' : 'Accesează Rețeaua'}
            </button>
          </form>
        )}
      </div>
    </Scroll>
  );
}

export default function MethodsDeepDive() {
  return (
    <ScrollControls pages={8.5} damping={0.2}>
      <RemixedGrid />
      <RemixedHexagons />
      <RemixedFigure8 />
      <RemixedTunnel />
      <SphereParticles />
      <MethodsOverlay />
    </ScrollControls>
  );
}
