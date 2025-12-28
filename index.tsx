
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES & INTERFACES ---

export type AppMode = 'HUD' | 'BANK' | 'PAY' | 'KOTORA' | 'CARDS' | 'ATM' | 'LEDGER' | 'CORP' | 'INTEL' | 'SYSTEM';
export type UITheme = 'SOVEREIGN' | 'MONO' | 'NEON' | 'GHOST' | 'GOLD';
export type Language = 'JP' | 'EN' | 'KR' | 'CN' | 'DE';

export interface CardData {
  id: string;
  number: string;
  expiry: string;
  cvv: string;
  isReal: boolean;
  type: 'VIRTUAL' | 'REAL';
  nickname: string;
}

// --- LOCALIZATION ---

const I18N = {
  JP: { hud: '監視', bank: '銀行', pay: 'PayPay', ktr: 'コトラ', cards: 'カード', atm: 'ATM', val: '口座', corp: '法人', ai: '法務AI', sys: '設定', execute: '実行', approve: '承認', amount: '金額', source: '送金元', target: '送金先', branch: '支店番号', name: '名義', phone: '電話番号', sync: '外部連携中', topology: '構成図' },
  EN: { hud: 'HUD', bank: 'Bank', pay: 'PayPay', ktr: 'Kotora', cards: 'Cards', atm: 'ATM', val: 'Ledger', corp: 'Corp', ai: 'Legal AI', sys: 'System', execute: 'Execute', approve: 'Approve', amount: 'Amount', source: 'Source', target: 'Target', branch: 'Branch', name: 'Name', phone: 'Phone', sync: 'Ext Sync Active', topology: 'Topology' },
  KR: { hud: '모니터', bank: '은행', pay: '페이페이', ktr: '코토라', cards: '카드', atm: 'ATM', val: '장부', corp: '법인', ai: '법률AI', sys: '설정', execute: '실행', approve: '승인', amount: '금액', source: '출금', target: '입금', branch: '지점', name: '예금주', phone: '전화번호', sync: '외부 연동 중', topology: '토폴로지' },
  CN: { hud: '监控', bank: '银行', pay: '支付', ktr: '科托拉', cards: '卡片', atm: 'ATM', val: '账目', corp: '企业', ai: '法律AI', sys: '系统', execute: '执行', approve: '批准', amount: '金额', source: '来源', target: '目标', branch: '分行', name: '户名', phone: '电话', sync: '外部连接中', topology: '拓扑图' },
  DE: { hud: 'HUD', bank: 'Bank', pay: 'PayPay', ktr: 'Kotora', cards: 'Karten', atm: 'ATM', val: 'Ledger', corp: 'Firma', ai: 'Recht-KI', sys: 'System', execute: 'Ausführen', approve: 'Bestätigen', amount: 'Betrag', source: 'Quelle', target: 'Ziel', branch: 'Zweig', name: 'Name', phone: 'Telefon', sync: 'Externer Sync', topology: 'Topologie' },
};

// --- CONSTANTS ---

const THEMES: Record<UITheme, string> = {
  SOVEREIGN: 'bg-[#181818] text-white border-emerald-500/20 text-emerald-400',
  MONO: 'bg-[#222222] text-neutral-100 border-neutral-700 text-neutral-400',
  NEON: 'bg-[#0f1425] text-cyan-400 border-cyan-500/30 text-cyan-300',
  GHOST: 'bg-[#1a1a1a] text-neutral-300 border-white/5 text-white',
  GOLD: 'bg-[#1a1612] text-amber-200 border-amber-600/20 text-amber-500',
};

// --- COMPONENTS ---

const ArchitectureView = ({ t }: { t: any }) => {
  return (
    <div className="p-6 bg-black/40 border border-white/5 rounded-3xl font-mono text-[8px] leading-[1.2] text-neutral-500 overflow-x-auto">
      <p className="text-emerald-400 mb-4 font-black uppercase tracking-widest">{t.topology}</p>
      <pre>{`
 [ CLIENT_OS ] <--- WebSocket (Secure) ---> [ SYNC_GATEWAY ]
      |                                           |
      +--- WebWorkers (Encryption)                +--- REST (Compliance)
      |                                           |
      v                                           v
 [ LIQUIDITY_HUB ] <--- gRPC (Ultra-Low) ---> [ EXTERNAL_NODE ]
      |                                           |
      +--- DB (Ledger)                            +--- SWIFT / ZENGIN
      |                                           |
      +--- AI (LLM Verification)                  +--- BLOCKCHAIN (ETH)
      `}</pre>
    </div>
  );
};

const ExternalSyncStatus = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full animate-in fade-in zoom-in duration-700">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
      <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-60">{label}</span>
    </div>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('HUD');
  const [theme, setTheme] = useState<UITheme>('SOVEREIGN');
  const [lang, setLang] = useState<Language>('JP');
  const [isAuth, setIsAuth] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  const t = I18N[lang];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const handleAIChat = async () => {
    if (!input) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction: "You are VAULT FUSION Intelligence. Verify global banking laws, legal licenses, and settlement compliance in real-time." }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.text || 'Protocol verified.' }]);
    } catch (e) { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection offline.' }]); }
  };

  if (!isAuth) {
    return (
      <div className="h-screen bg-[#141414] flex flex-col items-center justify-center p-8 space-y-12 animate-in fade-in duration-1000">
        <div className="w-32 h-32 relative cursor-pointer group" onClick={() => setIsAuth(true)}>
          <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-[2.5rem] group-hover:border-emerald-500/30 transition-all animate-pulse" />
          <div className="absolute inset-4 border border-emerald-400 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-xs tracking-[0.4em]">VF_V8</div>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Vault Fusion</h1>
        <button onClick={() => setIsAuth(true)} className="w-full max-w-[240px] py-6 bg-emerald-500 text-black font-black text-[10px] tracking-[0.5em] rounded-[1.5rem] border-2 border-black hover:scale-[1.02] transition-transform">AUTHENTICATE</button>
      </div>
    );
  }

  const currentThemeStyles = THEMES[theme];

  return (
    <div className={`h-screen flex flex-col font-mono selection:bg-emerald-500/30 overflow-hidden relative ${currentThemeStyles}`}>
      
      {/* HEADER */}
      <header className="px-6 pt-10 pb-4 flex items-center justify-between z-40 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div>
          <h2 className="text-[7px] opacity-40 font-black uppercase tracking-[0.2em] mb-1">SOVEREIGN CORE V8.2</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tighter">¥162.5<span className="text-sm opacity-20 ml-0.5">京</span></span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <ExternalSyncStatus label={t.sync} />
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-6 space-y-8 relative custom-scrollbar">
        
        {/* HUD */}
        {activeMode === 'HUD' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="p-8 bg-white/[0.04] border border-white/[0.08] rounded-[2.5rem] shadow-2xl relative overflow-hidden group min-h-[160px] flex flex-col justify-center text-center backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              <p className="text-sm font-black italic tracking-tight uppercase opacity-90 leading-snug">
                {lang === 'JP' ? '外部クラスターへのセキュア接続を確認。実時間同期は正常です。' : 'Secure link to external clusters verified. Real-time sync nominal.'}
              </p>
            </div>
            
            <ArchitectureView t={t} />

            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setActiveMode('BANK')} className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex flex-col gap-1 cursor-pointer hover:bg-white/[0.1] transition-all">
                <span className="text-[7px] opacity-40 font-black uppercase tracking-widest">{t.bank}</span>
                <p className="text-[10px] font-black tracking-tight">ZENGIN_CORRIDOR</p>
              </div>
              <div onClick={() => setActiveMode('INTEL')} className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex flex-col gap-1 cursor-pointer hover:bg-white/[0.1] transition-all">
                <span className="text-[7px] opacity-40 font-black uppercase tracking-widest">{t.ai}</span>
                <p className="text-[10px] font-black tracking-tight">LLM_VERIFY</p>
              </div>
            </div>
          </div>
        )}

        {/* BANKING MODULES (ZENGIN/PAY/KOTORA) */}
        {(activeMode === 'BANK' || activeMode === 'PAY' || activeMode === 'KOTORA') && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <h3 className="text-xl font-black tracking-tighter uppercase">{activeMode === 'BANK' ? t.bank : activeMode === 'PAY' ? t.pay : t.ktr}</h3>
              <div className="p-6 bg-white/[0.03] border border-white/[0.1] rounded-[2.5rem] space-y-4 shadow-xl backdrop-blur-md">
                <div className="space-y-1">
                  <label className="text-[7px] opacity-40 font-black uppercase px-2">{activeMode === 'BANK' ? t.source : t.phone}</label>
                  <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] outline-none focus:border-white/30 transition-all" placeholder={activeMode === 'BANK' ? 'MUFG / 001' : '090-XXXX-XXXX'} />
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] opacity-40 font-black uppercase px-2">{t.amount}</label>
                  <input className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-3xl font-black tracking-tighter outline-none focus:border-white/30 transition-all" placeholder="0" />
                </div>
                <button className="w-full py-5 bg-white text-black font-black text-[9px] tracking-[0.3em] rounded-2xl border-2 border-black transition-all hover:bg-neutral-100">{t.execute}</button>
              </div>
           </div>
        )}

        {/* CARD MGMT */}
        {activeMode === 'CARDS' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <h3 className="text-xl font-black tracking-tighter uppercase">{t.cards}</h3>
              <div className="grid grid-cols-1 gap-3">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex justify-between items-center group hover:bg-white/[0.1] transition-all">
                      <div>
                        <span className="text-[6px] font-black opacity-30 tracking-widest uppercase">{i === 1 ? 'REAL' : 'VIRTUAL'} SLOT {i}</span>
                        <p className="text-[10px] font-black">•••• •••• •••• {1000 + i*13}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* SYSTEM CONFIG */}
        {activeMode === 'SYSTEM' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <h3 className="text-xl font-black tracking-tighter uppercase">{t.sys}</h3>
              <div className="space-y-4">
                <p className="text-[7px] opacity-40 font-black uppercase px-2">Language Protocol</p>
                <div className="grid grid-cols-5 gap-2">
                  {(['JP', 'EN', 'KR', 'CN', 'DE'] as Language[]).map(l => (
                    <button key={l} onClick={() => setLang(l)} className={`py-3 rounded-xl border text-[9px] font-black transition-all ${lang === l ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.05] opacity-60'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[7px] opacity-40 font-black uppercase px-2">UI Matrix Theme</p>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(THEMES) as UITheme[]).map(th => (
                    <button key={th} onClick={() => setTheme(th)} className={`h-10 rounded-xl border flex items-center justify-center transition-all ${theme === th ? 'border-white bg-white/10' : 'border-white/10 opacity-30 hover:opacity-60'}`}>
                       <div className={`w-2 h-2 rounded-full ${th === 'SOVEREIGN' ? 'bg-emerald-400' : th === 'NEON' ? 'bg-cyan-400' : 'bg-white'}`} />
                    </button>
                  ))}
                </div>
              </div>
           </div>
        )}

        {/* AI INTEL */}
        {activeMode === 'INTEL' && (
          <div className="space-y-4 h-[60vh] flex flex-col animate-in slide-in-from-bottom-4">
            <h3 className="text-xl font-black tracking-tighter uppercase">{t.ai}</h3>
            <div className="flex-1 overflow-y-auto space-y-4 px-2 custom-scrollbar">
               {messages.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4 text-center">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    <p className="text-[8px] font-black uppercase tracking-widest px-8">Consult LLM on Real-time Settlement Laws & Compliance</p>
                 </div>
               )}
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-[10px] leading-relaxed ${m.role === 'user' ? 'bg-white/10 text-white' : 'bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/20'}`}>
                      {m.content}
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-[2rem] flex gap-3 shadow-2xl">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAIChat()} className="flex-1 bg-transparent border-none outline-none text-[10px] px-2 font-mono placeholder:text-neutral-700" placeholder="Compliance Check..." />
              <button onClick={handleAIChat} className="p-3 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* DOCK NAVIGATION */}
      <nav className="fixed bottom-6 inset-x-6 h-14 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] flex items-center justify-around px-6 shadow-2xl z-[60]">
        <NavButton label={t.hud} active={activeMode === 'HUD'} onClick={() => setActiveMode('HUD')} icon={<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />} />
        <NavButton label={t.val} active={activeMode === 'LEDGER'} onClick={() => setActiveMode('LEDGER')} icon={<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />} />
        
        <div className="relative -top-4">
           <button onClick={() => { setActiveMode('ATM'); setIsBusy(true); }} className="w-16 h-16 bg-emerald-500 text-black rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 border-[6px] border-[#181818]">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
           </button>
        </div>

        <NavButton label={t.ai} active={activeMode === 'INTEL'} onClick={() => setActiveMode('INTEL')} icon={<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />} />
        <NavButton label={t.sys} active={activeMode === 'SYSTEM'} onClick={() => setActiveMode('SYSTEM')} icon={<path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />} />
      </nav>

      {/* QUICK TILES */}
      {activeMode === 'HUD' && (
        <div className="fixed bottom-24 inset-x-8 grid grid-cols-4 gap-2 animate-in slide-in-from-bottom-2 duration-300">
          <QuickTile label={t.cards} onClick={() => setActiveMode('CARDS')} />
          <QuickTile label={t.corp} onClick={() => setActiveMode('CORP')} />
          <QuickTile label={t.pay} onClick={() => setActiveMode('PAY')} />
          <QuickTile label={t.ktr} onClick={() => setActiveMode('KOTORA')} />
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0; }
        * { font-family: 'JetBrains Mono', monospace; transition: background-color 0.4s ease, border-color 0.4s ease; }
        body { background: #121212; overflow: hidden; }
      `}</style>
    </div>
  );
}

function NavButton({ label, active, icon, onClick }: { label: string, active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-60'}`}>
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{icon}</svg>
      <span className="text-[7px] font-black tracking-widest uppercase">{label}</span>
    </button>
  );
}

function QuickTile({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="py-2.5 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl text-[7px] font-black tracking-widest text-neutral-400 hover:text-white transition-all uppercase shadow-sm">{label}</button>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
