
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES & INTERFACES ---

export type AppMode = 'HUD' | 'BANKING' | 'AI_SUITE' | 'CORP' | 'SEC' | 'RAG';
export type BankingSubMode = 'Overview' | 'Transfer' | 'Web3' | 'History';
export type AISuiteSubMode = 'Chat' | 'Slides' | 'Agent' | 'Designer';

export interface WealthState {
  analysis: string;
  healthScore: number;
  visualCode: string;
  mutationName: string;
}

// --- AI SERVICE LAYER ---

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const INTELLIGENCE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mutationName: { type: Type.STRING },
    analysis: { type: Type.STRING },
    healthScore: { type: Type.NUMBER },
    visualCode: { type: Type.STRING, description: "p5.js instance mode body" },
  },
  required: ["mutationName", "analysis", "healthScore", "visualCode"],
};

// --- CORE COMPONENTS ---

// 1. Generative Visuals (p5.js)
const PulseEngine = forwardRef(({ code }: { code: string }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !(window as any).p5) return;
    if (instanceRef.current) instanceRef.current.remove();

    const sketch = (p: any) => {
      p.setup = () => { p.createCanvas(400, 400); p.colorMode(p.HSB, 360, 100, 100); p.clear(); };
      try {
        const fn = new Function('p', code.replace(/```javascript|```/g, '').trim());
        fn(p);
      } catch (e) { console.error("p5 Execution Error", e); }
    };
    instanceRef.current = new (window as any).p5(sketch, containerRef.current);
    return () => instanceRef.current?.remove();
  }, [code]);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center scale-90 md:scale-100" />;
});

// 2. Advanced Banking Module (v701 Spec)
const BankingModule = () => {
  const [subMode, setSubMode] = useState<BankingSubMode>('Overview');
  const [isWeb3Connected, setIsWeb3Connected] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold tracking-tighter">Settlement Hub</h2>
        <div className="flex gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
           {['Overview', 'Transfer', 'Web3', 'History'].map((m) => (
             <button 
               key={m} 
               onClick={() => setSubMode(m as BankingSubMode)}
               className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${subMode === m ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-500'}`}
             >
               {m}
             </button>
           ))}
        </div>
      </div>

      {subMode === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-8 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] space-y-6">
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Master Liquidity Pool</p>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold tracking-tighter">$97,653.03</span>
              <span className="text-emerald-400 font-bold text-xs">+2.4% APR</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[72%] shadow-[0_0_15px_#10b981]" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
               <div><p className="text-[8px] text-neutral-600 font-black uppercase">Domestic</p><p className="text-sm font-bold">¥12,400,000</p></div>
               <div><p className="text-[8px] text-neutral-600 font-black uppercase">Sovereign</p><p className="text-sm font-bold">$12,450.62</p></div>
               <div><p className="text-[8px] text-neutral-600 font-black uppercase">Web3</p><p className="text-sm font-bold">2.41 ETH</p></div>
            </div>
          </div>
          <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] flex flex-col justify-between">
             <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Network Status</p>
             <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-neutral-400">Zengin Net</span><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /></div>
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-neutral-400">SWIFT v2</span><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /></div>
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-neutral-400">Ethereum</span><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /></div>
             </div>
             <button className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Audit Connections</button>
          </div>
        </div>
      )}

      {subMode === 'Transfer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Domestic / Zengin</h3>
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-black border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500" placeholder="銀行名 (Bank)" />
                <input className="bg-black border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500" placeholder="支店名 (Branch)" />
              </div>
              <input className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs font-mono text-white outline-none focus:border-emerald-500" placeholder="口座番号 (Number)" />
              <input className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500" placeholder="口座名義 (Name)" />
              <div className="relative">
                <input className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-xl font-bold text-white outline-none focus:border-emerald-500" placeholder="0" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-xs">JPY</span>
              </div>
              <button className="w-full py-5 bg-white text-black font-black text-xs tracking-widest rounded-2xl shadow-xl hover:bg-neutral-200 transition-all">送金を実行する</button>
           </div>
           <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Global / Wise Integration</h3>
              <input className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500" placeholder="IBAN / SWIFT BIC" />
              <input className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500" placeholder="Recipient Full Legal Name" />
              <div className="relative">
                <input className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-xl font-bold text-white outline-none focus:border-emerald-500" placeholder="0.00" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-xs">USD</span>
              </div>
              <div className="p-4 bg-black/40 border border-neutral-800 rounded-2xl">
                 <div className="flex justify-between text-[10px] mb-1"><span className="text-neutral-500">Wise Exchange Rate</span><span className="text-white font-bold">1 USD = 148.52 JPY</span></div>
                 <div className="flex justify-between text-[10px]"><span className="text-neutral-500">Service Fee</span><span className="text-white font-bold">$12.40</span></div>
              </div>
              <button className="w-full py-5 bg-emerald-500 text-black font-black text-xs tracking-widest rounded-2xl shadow-xl transition-all">SETTLE GLOBALLY</button>
           </div>
        </div>
      )}

      {subMode === 'Web3' && (
        <div className="p-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[3rem] space-y-8">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className={`w-3 h-3 rounded-full ${isWeb3Connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                 <h3 className="text-xs font-black text-white uppercase tracking-widest">MetaMask / ERC20 Integration</h3>
              </div>
              <button onClick={() => setIsWeb3Connected(!isWeb3Connected)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isWeb3Connected ? 'bg-red-500/10 text-red-400' : 'bg-white text-black'}`}>
                {isWeb3Connected ? 'Disconnect' : 'Connect'}
              </button>
           </div>
           {isWeb3Connected && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4">
                <div className="space-y-4">
                   <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Active Wallet</p>
                   <p className="text-sm font-mono text-emerald-400 font-bold bg-black/40 p-4 rounded-2xl border border-white/5 break-all">0x71C2496A24581248447101824701248447</p>
                   <div className="flex gap-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex-1">
                         <p className="text-[8px] text-neutral-500 font-black uppercase">Balance</p>
                         <p className="text-lg font-bold">2.41 ETH</p>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex-1">
                         <p className="text-[8px] text-neutral-500 font-black uppercase">Network</p>
                         <p className="text-lg font-bold">Mainnet</p>
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Web3 Broadcast</p>
                   <input className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-xs font-mono text-white outline-none focus:border-emerald-500" placeholder="Recipient Wallet / ENS" />
                   <div className="relative">
                      <input className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-lg font-bold text-white outline-none focus:border-emerald-500" placeholder="0.0" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-xs">ETH</span>
                   </div>
                   <button className="w-full py-5 bg-indigo-500 text-white font-black text-xs tracking-widest rounded-2xl shadow-xl">SIGNED BROADCAST</button>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

// 3. AI Suite Module (v701 Spec)
const AISuiteModule = () => {
  const [subMode, setSubMode] = useState<AISuiteSubMode>('Chat');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input) return;
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Gemini 3 Flash Response
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: { systemInstruction: "You are the VAULT FUSION Sovereign Agent. Tactical, sharp, and results-oriented." }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "Thinking logic fault." }]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold tracking-tighter">Intelligence Suite</h2>
        <div className="flex gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
           {['Chat', 'Slides', 'Agent', 'Designer'].map((m) => (
             <button 
               key={m} 
               onClick={() => setSubMode(m as AISuiteSubMode)}
               className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${subMode === m ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-500'}`}
             >
               {m}
             </button>
           ))}
        </div>
      </div>

      {subMode === 'Chat' && (
        <div className="h-[60vh] flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-[3rem] overflow-hidden">
           <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.length === 0 && <p className="text-center text-neutral-600 text-xs mt-20 uppercase tracking-[0.4em]">Initialize Tactical Handshake</p>}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-5 rounded-3xl text-sm ${m.role === 'user' ? 'bg-emerald-500 text-black font-bold' : 'bg-neutral-800 text-neutral-200 border border-neutral-700'}`}>
                      {m.content}
                   </div>
                </div>
              ))}
           </div>
           <div className="p-6 bg-black border-t border-neutral-800 flex gap-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-sm text-white outline-none focus:border-emerald-500" 
                placeholder="Query Sovereign Agent..." 
              />
              <button onClick={handleSend} className="p-5 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 12h14m-7-7l7 7-7 7" /></svg></button>
           </div>
        </div>
      )}

      {subMode === 'Agent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">SuperAgent Orchestration</h3>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-medium italic">Autonomous agents capable of managing Zengin transfers, filing corporate compliance, and auditing Web3 wallets across the v701 ecosystem.</p>
              <div className="space-y-4 pt-4">
                 {[
                   { name: 'ComplianceBot', status: 'Idle', load: '2%' },
                   { name: 'LiquidityWatcher', status: 'Active', load: '45%' },
                   { name: 'AuditSentinel', status: 'Deep Scan', load: '88%' }
                 ].map(agent => (
                   <div key={agent.name} className="flex items-center justify-between p-4 bg-black/40 border border-neutral-800 rounded-2xl">
                      <div><p className="text-xs font-bold">{agent.name}</p><p className="text-[8px] text-neutral-500 uppercase">{agent.status}</p></div>
                      <span className="text-[10px] font-mono text-emerald-400">{agent.load}</span>
                   </div>
                 ))}
              </div>
           </div>
           <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Task Queue</h3>
                <div className="space-y-2">
                   <div className="text-[10px] text-neutral-400 p-3 bg-white/5 rounded-xl border border-white/5">Generate Quarterly Entity Audit Report</div>
                   <div className="text-[10px] text-neutral-400 p-3 bg-white/5 rounded-xl border border-white/5 opacity-50">Sync SWIFT v2 logs with local ledger</div>
                </div>
              </div>
              <button className="w-full py-5 bg-emerald-500 text-black font-black text-xs tracking-widest rounded-2xl shadow-xl">INITIATE GLOBAL TASK</button>
           </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN OS INTERFACE ---

function App() {
  const [activeTab, setActiveTab] = useState<AppMode>('HUD');
  const [wealth, setWealth] = useState<WealthState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => { 
    if (isAuth) refreshIntel(); 
  }, [isAuth]);

  const refreshIntel = async () => {
    setIsBusy(true);
    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Analyze current capital velocity ($97,653.03). Output wealth pulse p5.js HSB code.",
        config: {
          systemInstruction: "Tactical Financial OS. p5 code 400x400 transparent. Sharp analysis.",
          responseMimeType: "application/json",
          responseSchema: INTELLIGENCE_SCHEMA,
        },
      });
      setWealth(JSON.parse(result.text || "{}"));
    } catch (e) { console.error(e); } 
    finally { setIsBusy(false); }
  };

  if (!isAuth) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-12 space-y-12 animate-in fade-in duration-1000">
        <div className="w-48 h-48 relative cursor-pointer group" onClick={() => setIsAuth(true)}>
          <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-[4rem] group-hover:border-emerald-500/30 transition-all duration-500" />
          <div className="absolute inset-4 border-2 border-emerald-400 rounded-[3rem] flex items-center justify-center text-emerald-400 font-black text-sm tracking-[0.3em] shadow-[0_0_80px_rgba(16,185,129,0.2)]">VF_CORE</div>
        </div>
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tighter text-white">VAULT FUSION</h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.5em] font-medium opacity-60">Sovereign Financial OS v7.0.1 PROD</p>
        </div>
        <button onClick={() => setIsAuth(true)} className="w-full max-w-sm py-6 bg-emerald-500 text-black font-black text-xs tracking-[0.3em] rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl">AUTHENTICATE SYSTEM</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020202] text-white flex flex-col overflow-hidden font-mono selection:bg-emerald-500/30">
      {/* HUD HEADER */}
      <header className="px-8 pt-16 pb-6 flex items-center justify-between bg-gradient-to-b from-black via-black/90 to-transparent z-50">
        <div>
          <h2 className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em] mb-1">Portfolio MCAP</h2>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold tracking-tighter">$97,653.03</span>
            <span className="text-emerald-400 text-xs font-bold px-2 py-0.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">+2.4%</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:block text-right">
              <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">Compliance Status</p>
              <p className="text-xs font-bold text-emerald-400">ACTIVE_AUDIT_OK</p>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center relative hover:border-emerald-500 transition-all cursor-pointer shadow-lg group">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute -top-0.5 -right-0.5 border-2 border-black animate-pulse" />
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="group-hover:text-emerald-400 transition-colors"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
           </div>
        </div>
      </header>

      {/* VIEWPORT */}
      <main className="flex-1 overflow-y-auto px-8 pb-48 space-y-12 custom-scrollbar pt-4 relative">
        {activeTab === 'HUD' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* PULSE SECTION */}
            <section className="relative aspect-[4/5] w-full bg-neutral-900/40 rounded-[4rem] border border-neutral-800/50 overflow-hidden shadow-inner group">
              <div className="absolute inset-0 flex items-center justify-center">
                <PulseEngine code={wealth?.visualCode || `p.draw = () => { p.clear(); p.translate(200,200); p.noFill(); p.stroke(160,70,100,0.3); p.circle(0,0,100); };`} />
              </div>
              <div className="absolute top-12 left-12 z-10">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-1">{wealth?.mutationName || "Pulse Generator"}</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">SYNC_STATUS: {isBusy ? 'EVOLVING' : 'OPTIMAL'}</p>
              </div>
              <div className="absolute bottom-12 inset-x-12 z-10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest block mb-2">Health Index</span>
                  <p className="text-6xl font-bold tracking-tighter">{wealth?.healthScore || 92}<span className="text-lg opacity-40 ml-2">%</span></p>
                </div>
                <button onClick={refreshIntel} className={`p-6 rounded-[2rem] bg-neutral-800 border border-neutral-700 hover:border-emerald-500 hover:bg-neutral-700 transition-all ${isBusy ? 'animate-spin opacity-50' : ''}`}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>
            </section>

            {/* AI FEED */}
            <section className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] relative overflow-hidden group hover:bg-emerald-500/10 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg width="80" height="80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
              </div>
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> Strategic Wealth Intelligence
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed font-medium italic opacity-90">{wealth?.analysis || "Analyzing high-velocity liquidity flows and domestic Zengin settlement patterns. v701 OS optimized."}</p>
            </section>

            {/* 12-SEQUENCE QUICK ACTIONS GRID (Correct Sequence Alignment) */}
            <section className="grid grid-cols-4 gap-6 px-4">
              {[
                { label: 'BANK', mode: 'BANKING', icon: <path d="M12 19V5m-7 7l7-7 7 7" /> },
                { label: 'CHAT', mode: 'AI_SUITE', icon: <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
                { label: 'SWAP', mode: 'BANKING', icon: <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> },
                { label: 'CORP', mode: 'CORP', icon: <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /> },
                { label: 'RAG', mode: 'RAG', icon: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> },
                { label: 'SLIDE', mode: 'AI_SUITE', icon: <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
                { label: 'SEC', mode: 'SEC', icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
                { label: 'NODE', mode: 'AI_SUITE', icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
                { label: 'DATA', mode: 'RAG', icon: <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /> },
                { label: 'AGENT', mode: 'AI_SUITE', icon: <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
                { label: 'AUDIT', mode: 'CORP', icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                { label: 'BRIDGE', mode: 'BANKING', icon: <path d="M14 5l7 7m0 0l-7 7m7-7H3" /> },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveTab(item.mode as AppMode)} className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2.2rem] bg-neutral-900/60 border border-neutral-800 flex items-center justify-center group-hover:bg-neutral-800 group-hover:border-emerald-500/50 transition-all shadow-xl active:scale-95 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-neutral-500 group-hover:text-emerald-400 transition-colors">
                      {item.icon}
                    </svg>
                  </div>
                  <span className="text-[9px] text-neutral-600 font-black uppercase tracking-[0.2em] group-hover:text-neutral-300 transition-colors">{item.label}</span>
                </div>
              ))}
            </section>
          </div>
        )}

        {activeTab === 'BANKING' && <BankingModule />}
        {activeTab === 'AI_SUITE' && <AISuiteModule />}

        {activeTab === 'RAG' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
             <h2 className="text-3xl font-bold tracking-tighter">File Search RAG</h2>
             <div className="p-10 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] space-y-8">
                <div className="flex items-center gap-4 p-8 border-2 border-dashed border-neutral-800 rounded-[2.5rem] hover:border-emerald-500/50 transition-all cursor-pointer group">
                   <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-emerald-400 transition-colors">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                   </div>
                   <div>
                      <p className="text-sm font-bold">Upload Knowledge Base</p>
                      <p className="text-[10px] text-neutral-500 uppercase font-black">PDF, DOCX, CSV, JSON Supported</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Active Indexing</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Corporate_Tax_2023.pdf', 'Web3_Audit_Logs_Q4.json'].map(file => (
                        <div key={file} className="flex justify-between items-center p-4 bg-black/40 border border-neutral-800 rounded-2xl">
                           <span className="text-xs font-mono">{file}</span>
                           <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-black uppercase">Indexed</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'CORP' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-3xl font-bold tracking-tighter">Corporate Panel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-neutral-900/40 border border-neutral-800 rounded-[3rem] space-y-6">
                 <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Entity Sovereign ID</p>
                 <h4 className="text-2xl font-bold tracking-tighter">Fusion Global Holdings (UK/JP)</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between p-4 bg-black/40 rounded-2xl border border-neutral-800">
                       <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">KYC Status</span>
                       <span className="text-[10px] font-black uppercase text-emerald-400">VERIFIED</span>
                    </div>
                    <div className="flex justify-between p-4 bg-black/40 rounded-2xl border border-neutral-800">
                       <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Next Audit</span>
                       <span className="text-[10px] font-black uppercase text-white font-mono">2024-03-31</span>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-neutral-900/40 border border-neutral-800 rounded-[3rem] space-y-6">
                 <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Sovereign Licenses</p>
                 <div className="space-y-3">
                    {['VASP Class-A (JP)', 'E-Money Inst. (EU)', 'Global Broker-Dealer'].map(l => (
                      <div key={l} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         <span className="text-xs font-bold text-neutral-300">{l}</span>
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-4 mt-2 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest">Renew All Licenses</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DOCK NAVIGATION */}
      <nav className="fixed bottom-10 inset-x-10 h-28 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] flex items-center justify-around px-8 shadow-2xl z-50">
        <NavButton label="HUD" active={activeTab === 'HUD'} onClick={() => setActiveTab('HUD')} icon={<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />} />
        <NavButton label="CORE" active={activeTab === 'BANKING'} onClick={() => setActiveTab('BANKING')} icon={<path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />} />
        
        <div className="relative -top-12">
           <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse rounded-full" />
           <button onClick={() => setActiveTab('HUD')} className="w-24 h-24 bg-emerald-500 text-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 border-4 border-black">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
           </button>
        </div>

        <NavButton label="INTEL" active={activeTab === 'AI_SUITE'} onClick={() => setActiveTab('AI_SUITE')} icon={<path d="M13 10V3L4 14h7v7l9-11h-7z" />} />
        <NavButton label="SEC" active={activeTab === 'SEC'} onClick={() => setActiveTab('HUD')} icon={<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />} />
      </nav>
    </div>
  );
}

function NavButton({ label, active, icon, onClick }: { label: string, active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all duration-300 ${active ? 'text-emerald-400 scale-110' : 'text-neutral-600 hover:text-neutral-400'}`}>
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={active ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}>
        {icon}
      </svg>
      <span className="text-[9px] font-black tracking-[0.3em] uppercase">{label}</span>
    </button>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
