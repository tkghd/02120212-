
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { P5Canvas } from './components/P5Canvas';
import { StatsChart } from './components/StatsChart';
import { BankingUI } from './components/BankingUI';
import { analyzeWealth } from './services/geminiService';
import { Transaction, WealthInsight, BankAccount, AccountType } from './types';

const ACCOUNTS: BankAccount[] = [
  { id: 'v1', name: 'Primary Vault', type: 'Personal', balance: 12450.62, currency: 'USD' },
  { id: 'v2', name: 'Ether Wallet', type: 'Web3', balance: 2.41, currency: 'ETH', address: '0x71C...4f2' },
  { id: 'v3', name: 'Fusion Corp', type: 'Corporate', balance: 85200.00, currency: 'JPY' },
];

const TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Global SaaS', amount: -299.00, date: '2024-12-10', category: 'Tech', status: 'completed' },
  { id: '2', merchant: 'Starlight Bistro', amount: -142.50, date: '2024-12-09', category: 'Food', status: 'completed' },
  { id: '3', merchant: 'Binance Inflow', amount: 4200.00, date: '2024-12-08', category: 'Finance', status: 'completed' },
  { id: '4', merchant: 'Tokyo Metro', amount: -12.20, date: '2024-12-08', category: 'Transport', status: 'pending' },
];

const INITIAL_VISUAL = `
p.setup = () => { p.createCanvas(400, 400); p.colorMode(p.HSB, 360, 100, 100); };
p.draw = () => {
  p.clear(); p.translate(200, 200);
  let t = p.millis() * 0.001;
  p.noFill(); p.strokeWeight(2);
  for(let i=0; i<8; i++) {
    p.stroke(160 + i*15, 70, 100, 0.4);
    p.beginShape();
    for(let a=0; a<p.TWO_PI; a+=0.2) {
      let r = 100 + p.noise(i, a, t) * 60;
      p.vertex(p.cos(a)*r, p.sin(a)*r);
    }
    p.endShape(p.CLOSE);
  }
};
`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'transfer' | 'accounts' | 'business'>('home');
  const [insight, setInsight] = useState<WealthInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) triggerAI();
  }, [isInitialized]);

  const triggerAI = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeWealth(12450.62, TRANSACTIONS);
      setInsight(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-8 space-y-8">
        <div className="w-32 h-32 relative">
          <div className="absolute inset-0 border-[3px] border-emerald-500/20 rounded-[2rem] animate-pulse" />
          <div className="absolute inset-4 border border-emerald-400 rounded-2xl flex items-center justify-center font-black text-emerald-400 text-xs tracking-tighter shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            VF_OS
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter mb-2 text-white">VAULT FUSION</h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.4em] font-medium">Hyper-Modern Liquidity</p>
        </div>
        <button 
          onClick={() => setIsInitialized(true)}
          className="w-full max-w-xs py-4 bg-emerald-500 text-black font-black text-xs tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-transform"
        >
          AUTHENTICATE
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020202] text-white flex flex-col overflow-hidden font-mono">
      {/* HUD Header */}
      <header className="px-6 pt-14 pb-4 flex items-center justify-between z-50 bg-gradient-to-b from-black to-transparent">
        <div>
          <h2 className="text-[9px] text-neutral-500 font-black uppercase tracking-[0.2em]">Total Liquidity</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tighter">$97,653.03</span>
            <span className="text-emerald-400 text-[10px] font-bold">+2.4%</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute -top-0.5 -right-0.5 border border-black animate-pulse" />
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 space-y-8 custom-scrollbar pt-4">
        {activeTab === 'home' && (
          <>
            {/* Generative Pulse Card */}
            <section className="relative aspect-[4/5] w-full bg-neutral-900/40 rounded-[3rem] border border-neutral-800/50 overflow-hidden shadow-2xl group">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 opacity-60" />
               <div className="absolute top-10 left-10 z-10">
                 <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">
                   {insight?.mutationName || "Neural Pulse"}
                 </h3>
                 <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                   System Health: {isAnalyzing ? 'EVOLVING' : 'OPTIMAL'}
                 </p>
               </div>

               <div className="absolute inset-0 flex items-center justify-center">
                 <P5Canvas code={insight?.visualCode || INITIAL_VISUAL} />
               </div>

               <div className="absolute bottom-10 inset-x-10 z-10 flex justify-between items-end">
                 <div>
                    <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">Wealth Index</span>
                    <p className="text-4xl font-bold tracking-tighter">{insight?.healthScore || 92}<span className="text-sm opacity-50">%</span></p>
                 </div>
                 <button onClick={triggerAI} className={`p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 ${isAnalyzing ? 'animate-spin opacity-50' : 'hover:scale-110'}`}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth={2} /></svg>
                 </button>
               </div>
            </section>

            {/* Insight Stream */}
            <section className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] relative overflow-hidden">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                 <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">AI Intelligence</h4>
               </div>
               <p className="text-xs text-neutral-300 leading-relaxed italic">
                 {isAnalyzing ? "Processing multi-chain velocity..." : (insight?.analysis || "Your capital deployment is currently 92% efficient. Recommended move: Hedge tech volatility.")}
               </p>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-4 gap-4">
              {['Send', 'Swap', 'Receive', 'Stake'].map((label) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition-colors">
                     <div className="w-6 h-6 bg-neutral-700 rounded-lg animate-pulse" />
                  </div>
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </section>
          </>
        )}

        {activeTab === 'transfer' && (
          <BankingUI />
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tighter text-white">Vault Management</h2>
            <div className="space-y-4">
              {ACCOUNTS.map(acc => (
                <div key={acc.id} className="p-5 bg-neutral-900/40 border border-neutral-800/50 rounded-3xl hover:border-emerald-500/30 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] px-2 py-0.5 bg-neutral-800 rounded-full text-neutral-400 uppercase tracking-widest font-bold border border-neutral-700">{acc.type}</span>
                        <h4 className="text-base font-bold mt-2 text-white">{acc.name}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold tracking-tighter text-white">{acc.currency} {acc.balance.toLocaleString()}</p>
                        <p className="text-[9px] text-neutral-500 font-mono">{acc.address || 'XXXX-XXXX-82'}</p>
                      </div>
                   </div>
                   <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-3/4" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Dock Navigation */}
      <nav className="fixed bottom-6 inset-x-6 h-20 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        <NavButton label="HUD" active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth={2}/></svg>} />
        <NavButton label="TX" active={activeTab === 'transfer'} onClick={() => setActiveTab('transfer')} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth={2}/></svg>} />
        
        <div className="relative -top-5">
           <button className="w-16 h-16 bg-emerald-500 text-black rounded-[2rem] shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
           </button>
        </div>

        <NavButton label="VAL" active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth={2}/></svg>} />
        <NavButton label="CORP" active={activeTab === 'business'} onClick={() => setActiveTab('business')} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth={2}/></svg>} />
      </nav>
    </div>
  );
}

function NavButton({ label, active, icon, onClick }: { label: string, active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-emerald-400 scale-110' : 'text-neutral-600 hover:text-neutral-400'}`}>
      {icon}
      <span className="text-[8px] font-black tracking-widest uppercase">{label}</span>
    </button>
  );
}
