import { Scroll } from '@react-three/drei';

export default function OverlayUI({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Scroll html style={{ width: '100%' }}>
      {/* Page 1 */}
      <div style={{ position: 'absolute', top: '0vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(157,0,255,0.8)]">
          Sistemul Liquid:<br/>Bani din Micro-Nișe AI în 2026.
        </h1>
        <p className="text-lg md:text-xl text-purple-200 max-w-2xl">
          Nu ai nevoie de experiență. Copiază, lipește, încasează. Scroll în jos.
        </p>
      </div>

      {/* Page 2 */}
      <div style={{ position: 'absolute', top: '100vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(138,43,226,0.8)]">
          Metoda #1: Asistenți AI pentru Stomatologi.
        </h2>
        <div className="text-left bg-black/50 p-6 rounded-xl border border-purple-500/30 backdrop-blur-sm max-w-2xl">
          <p className="text-purple-100 mb-2">1. Cont gratuit Voiceflow.com</p>
          <p className="text-purple-100 mb-2">2. Caută pe Google Maps cabinete locale</p>
          <p className="text-purple-100 mb-2">3. ChatGPT Prompt: 'Scrie email scurt oferind demo gratuit pentru AI programări 24/7'</p>
          <p className="text-purple-100 font-bold mt-4 text-purple-300">4. Vinde cu 150€/lună.</p>
        </div>
      </div>

      {/* Page 3 */}
      <div style={{ position: 'absolute', top: '200vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(176,38,255,0.8)]">
          Metoda #2: YouTube Faceless - Povești Audio.
        </h2>
        <div className="text-left bg-black/50 p-6 rounded-xl border border-purple-500/30 backdrop-blur-sm max-w-2xl">
          <p className="text-purple-100 mb-2">1. Claude.ai: 'Scrie poveste de 1000 cuv pentru a adormi copii'</p>
          <p className="text-purple-100 mb-2">2. Voce pe ElevenLabs.io</p>
          <p className="text-purple-100 mb-2">3. Imagine pe Leonardo.ai</p>
          <p className="text-purple-100 font-bold mt-4 text-purple-300">4. Montează în CapCut, postează zilnic.</p>
        </div>
      </div>

      {/* Page 4 */}
      <div style={{ position: 'absolute', top: '300vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(157,0,255,0.8)]">
          Metoda #3: SEO Automat pentru Etsy.
        </h2>
        <div className="text-left bg-black/50 p-6 rounded-xl border border-purple-500/30 backdrop-blur-sm max-w-2xl">
          <p className="text-purple-100 mb-2">1. Găsește vânzători pe pagina 5+</p>
          <p className="text-purple-100 mb-2">2. Oferă optimizare 5 produse pt 20$</p>
          <p className="text-purple-100 mb-2">3. ChatGPT: 'Expert SEO Etsy: generează titlu, 13 tag-uri lungi, descriere.'</p>
          <p className="text-purple-100 font-bold mt-4 text-purple-300">4. Livrează textele.</p>
        </div>
      </div>

      {/* Page 5 */}
      <div style={{ position: 'absolute', top: '400vh', width: '100%' }} className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(176,38,255,1)]">
          Prezentarea Method Core™
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-10">
          Sistemul tău centralizat pentru execuție automată.
        </p>
        <button 
          onClick={onNavigate}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(157,0,255,0.6)] hover:shadow-[0_0_30px_rgba(176,38,255,0.9)] hover:scale-105 cursor-pointer">
          Începe Acum
        </button>
      </div>
    </Scroll>
  );
}
