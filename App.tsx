
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { P5Canvas } from './components/P5Canvas';
import { BankingUI } from './components/BankingUI';
import { analyzeWealth } from './services/geminiService';
import { WealthInsight, CorporateEntity, PortfolioItem, BankAccount } from './types';

const BANK_ACCOUNTS: BankAccount[] = [
  { id: 'b1', name: '住信SBIネット銀行', branch: 'イチゴ支店', accountNumber: '4064979', balance: '¥94,800,000,000,000', type: 'Savings' },
  { id: 'b2', name: 'みんな銀行', branch: 'ブリッジ支店', accountNumber: '9140345', balance: '¥53,600,000,000,000', type: 'Savings' },
  { id: 'b3', name: '三井住友銀行', branch: '六本木支店', accountNumber: '3440673', balance: '¥14,100,000,000,000', type: 'Savings' },
];

const INITIAL_VISUAL = `
p.setup = () => { p.createCanvas(400, 400); p.colorMode(p.HSB, 360, 100, 100); };
p.draw = () => {
  p.clear(); p.translate(200, 200);
  let t = p.millis() * 0.0005;
  p.noFill(); p.strokeWeight(1);
  for(let i=0; i<12; i++) {
    p.stroke(210, 40, 100, 0.3);
    p.rotate(t * 0.08);
    p.ellipse(0, 0, 120 + i*25, 120 + i*18);
  }
};
`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'transfer' | 'ledger'>('home');
  const [insight, setInsight] = useState<WealthInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) triggerAI();
  }, [isInitialized]);

  const triggerAI = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeWealth(162500000, []);
      setInsight(res);
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
  };

  if (!isInitialized) {
    return (
      <div className="h-screen bg-[#001b33] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003566] via-[#001d3d] to-[#000814]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,180,216,0.1),transparent)] animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl font-light tracking-[0.6em] text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">VAULT</h1>
            <div className="h-[2px] w-16 bg-cyan-400/50 shadow-[0_0_10px_#22d3ee]" />
          </div>
          <button 
            onClick={() => setIsInitialized(true)}
            className="group relative px-20 py-5 border border-white/20 rounded-full hover:bg-white/10 transition-all duration-700 backdrop-blur-xl"
          >
            <span className="text-xs tracking-[1em] text-white/60 group-hover:text-white transition-colors">INITIALIZE_SYSTEM</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#000d1a] text-white flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#002b5c] via-[#000d1a] to-[#00050a]" />
        <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Header */}
      <header className="px-16 pt-16 pb-10 flex items-end justify-between z-50">
        <div className="space-y-2">
          <p className="text-[10px] text-cyan-400/60 tracking-[0.5em] font-bold uppercase">Liquidity Monitor</p>
          <h2 className="text-5xl font-light tracking-tighter text-white">¥162.5 <span className="text-xl opacity-30 ml-2 font-bold tracking-[0.2em]">QUADRILLION</span></h2>
        </div>
        <div className="flex flex-col items-end gap-3">
          <p className="text-[10px] text-white/40 tracking-[0.4em] font-black uppercase">Alpha Node Connected</p>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
             <div className="absolute inset-0 bg-cyan-500/30 w-1/2 animate-[shimmer_3s_infinite]" />
          </div>
        </div>
      </header>

      {/* Viewport */}
      <main className="flex-1 overflow-y-auto px-16 pb-48 custom-scrollbar relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-20 animate-in fade-in duration-1000 max-w-7xl mx-auto">
            <section className="relative aspect-[21/9] w-full bg-white/[0.04] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] group transition-all hover:border-white/20">
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
               <div className="absolute inset-0 flex items-center justify-center opacity-80 scale-125">
                 <P5Canvas code={insight?.visualCode || INITIAL_VISUAL} />
               </div>
               <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
                 <div className="space-y-2">
                   <p className="text-[11px] text-cyan-400 tracking-[0.6em] uppercase font-black">{insight?.mutationName || "SYSTEM_CORE"}</p>
                   <p className="text-2xl font-light tracking-widest text-white/90 italic drop-shadow-lg">Stability at peak harmonics.</p>
                 </div>
                 <button onClick={triggerAI} className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 hover:scale-110 transition-all shadow-xl bg-white/5">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 </button>
               </div>
            </section>

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               <SimpleMetric label="Risk Level" value="0.001%" />
               <SimpleMetric label="Annual Yield" value="+15.8Q" />
               <SimpleMetric label="Net Reserve" value="74.2%" />
               <SimpleMetric label="Sync Latency" value="0.01ms" />
            </section>
          </div>
        )}

        {activeTab === 'transfer' && <BankingUI />}

        {activeTab === 'ledger' && (
          <div className="space-y-10 animate-in fade-in duration-1000 max-w-5xl mx-auto pt-8">
            <h3 className="text-[11px] text-white/40 tracking-[0.8em] uppercase text-center mb-16 font-black">Global Ledger Accounts</h3>
            <div className="grid gap-6">
              {BANK_ACCOUNTS.map(acc => (
                <div key={acc.id} className="p-10 bg-white/[0.04] border border-white/10 rounded-[2.5rem] flex justify-between items-center hover:bg-white/[0.08] hover:border-cyan-400/30 transition-all group backdrop-blur-2xl shadow-xl">
                   <div className="space-y-2">
                      <h4 className="text-2xl font-light tracking-wide text-white/80 group-hover:text-white transition-colors uppercase italic">{acc.name}</h4>
                      <p className="text-[10px] text-cyan-400/40 tracking-[0.4em] font-bold uppercase">{acc.branch} // {acc.accountNumber}</p>
                   </div>
                   <p className="text-4xl font-light tracking-tighter text-white drop-shadow-md">{acc.balance}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sony Style Floating Nav */}
      <nav className="fixed bottom-12 inset-x-0 h-24 flex items-center justify-center z-[100]">
        <div className="bg-white/10 border border-white/20 rounded-full px-12 flex items-center gap-16 backdrop-blur-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] h-full">
          <DockBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M3 12l9-9 9 9M5 10v10h14V10" /></svg>} />
          <DockBtn active={activeTab === 'transfer'} onClick={() => setActiveTab('transfer')} icon={<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" /></svg>} />
          <DockBtn active={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} icon={<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
        </div>
      </nav>

      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function DockBtn({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${active ? 'text-white scale-125' : 'text-white/30 hover:text-white/60 hover:scale-110'}`}>
      <div className={`${active ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' : ''}`}>{icon}</div>
      {active && <div className="absolute -bottom-4 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-pulse" />}
    </button>
  );
}

function SimpleMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-10 bg-white/[0.04] border border-white/10 rounded-[2.5rem] space-y-2 hover:bg-white/[0.08] transition-all backdrop-blur-xl shadow-xl">
      <p className="text-[10px] text-cyan-400/40 tracking-[0.5em] uppercase font-black italic">{label}</p>
      <p className="text-4xl font-light text-white drop-shadow-lg">{value}</p>
    </div>
  );
}
