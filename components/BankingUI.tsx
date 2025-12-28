
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

type TransferMode = 'Domestic' | 'Global' | 'Crypto';

interface TransactionItem {
  id: string;
  type: 'Transfer' | 'Swap' | 'Stake' | 'Deposit';
  amount: string;
  asset: string;
  recipient: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  fee?: string;
  network?: string;
  txHash?: string;
}

const MOCK_HISTORY: TransactionItem[] = [
  { id: 'tx_01', type: 'Transfer', amount: '88,888', asset: 'TKG', recipient: 'bc1qjr...e1e0', status: 'completed', timestamp: '2024-05-22 14:30', fee: '0.1 TKG', network: 'TKG Protocol', txHash: '0x639c...4ddb' },
  { id: 'tx_02', type: 'Swap', amount: '12,400', asset: 'USDC', recipient: 'Uniswap v3', status: 'pending', timestamp: '2024-05-23 09:12', fee: '1.2 USDC', network: 'Polygon PoS', txHash: '0x1a2b...c3d4' },
  { id: 'tx_05', type: 'Transfer', amount: '45.0', asset: 'ETH', recipient: 'vitalik.eth', status: 'completed', timestamp: '2024-05-20 18:05', fee: '0.0001 ETH', network: 'Ethereum Mainnet', txHash: '0xsol...xyz' },
];

const Icons = {
  Copy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Power: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>,
  Domestic: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 21h18M3 7v14M21 7v14M9 21V3h6v18M9 7h6M9 11h6M9 15h6"/></svg>,
  Global: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Crypto: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
};

export const BankingUI: React.FC = () => {
  const [mode, setMode] = useState<TransferMode>('Crypto');
  const [isConnected, setIsConnected] = useState(true);
  const account = '0x71C12A9B9A2F4D5E6F8G0H1I2J3K4L5M6N7O8P9Q';
  const network = 'TKG Sovereign Node (Mainnet)';

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 max-w-6xl mx-auto">
      {/* Sony Navigation Dock */}
      <div className="flex items-center justify-center gap-16 border-b border-white/10 pb-10">
        <ModeItem active={mode === 'Domestic'} onClick={() => setMode('Domestic')} icon={<Icons.Domestic />} label="DOMESTIC" />
        <ModeItem active={mode === 'Global'} onClick={() => setMode('Global')} icon={<Icons.Global />} label="GLOBAL" />
        <ModeItem active={mode === 'Crypto'} onClick={() => setMode('Crypto')} icon={<Icons.Crypto />} label="CRYPTO" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          {mode === 'Crypto' ? (
            <div className="space-y-10 animate-in slide-in-from-left-6">
              {/* SLAB OF BLUE GLASS: WALLET */}
              <div className="relative p-12 bg-white/[0.06] border border-white/20 rounded-[3rem] flex flex-col gap-12 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden group hover:bg-white/[0.1] transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-60" />
                
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-cyan-400 shadow-[0_0_20px_#22d3ee]' : 'bg-red-500'}`} />
                    <span className="text-[11px] text-white/60 tracking-[0.5em] font-black uppercase italic">{isConnected ? 'NODE_ACTIVE' : 'OFFLINE'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/60 font-black">CORE_v14 // SECURED</span>
                </div>

                <div className="space-y-8 z-10">
                  <p className="text-[10px] text-white/30 tracking-[0.6em] uppercase px-4 font-black">Authorized Master Hash</p>
                  <div className="bg-black/30 p-10 rounded-[2rem] border border-white/10 group-hover:border-cyan-400/30 transition-all shadow-inner">
                    <p className="text-3xl md:text-4xl font-mono text-cyan-300 tracking-tighter break-all drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                      {isConnected ? account : '0x_REQUISITION_PENDING'}
                    </p>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex justify-between items-center z-10">
                  <div className="space-y-2">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Protocol Gateway</p>
                    <p className="text-base font-light tracking-widest text-white/80 uppercase">{network}</p>
                  </div>
                  <button onClick={() => setIsConnected(!isConnected)} className="w-12 h-12 border border-white/20 rounded-full text-white/40 hover:text-white hover:bg-white/10 hover:border-white/50 transition-all flex items-center justify-center bg-white/5 shadow-lg">
                    <Icons.Power />
                  </button>
                </div>
              </div>

              {/* Minimal Input Slab */}
              <div className={`p-12 bg-white/[0.04] border border-white/10 rounded-[3rem] space-y-12 transition-all duration-1000 backdrop-blur-2xl shadow-xl ${!isConnected ? 'opacity-10 blur-xl pointer-events-none' : ''}`}>
                <div className="space-y-4">
                  <label className="text-[10px] text-cyan-400/50 uppercase tracking-[0.5em] px-4 font-black italic">Target Settlement Node</label>
                  <input className="w-full bg-black/20 border-b border-white/20 p-6 text-xl font-mono text-white outline-none focus:border-cyan-400 transition-all placeholder:text-white/5 italic" placeholder="0x_ADDRESS_OR_NODE_ID" />
                </div>
                <div className="space-y-4 text-center">
                  <label className="text-[10px] text-cyan-400/50 uppercase tracking-[0.5em] px-4 font-black italic">Flux Amount (TKG)</label>
                  <input className="w-full bg-transparent border-b border-white/20 p-6 text-8xl font-light tracking-tighter text-white outline-none focus:border-cyan-400 transition-all text-center italic" placeholder="0.00" />
                </div>
                <button className="w-full py-8 bg-white text-[#000d1a] font-black text-xs tracking-[1.2em] rounded-full hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all uppercase italic shadow-2xl">
                  PROPAGATE_TX
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white/[0.04] border border-white/10 rounded-[3rem] space-y-16 animate-in fade-in duration-700 backdrop-blur-2xl shadow-xl">
              <div className="space-y-6">
                <label className="text-[10px] text-cyan-400/50 uppercase tracking-[0.5em] px-4 font-black italic">Recipient Account Node</label>
                <input className="w-full bg-black/20 border-b border-white/20 p-6 text-xl font-mono text-white outline-none focus:border-cyan-400 transition-all italic" placeholder={mode === 'Domestic' ? "ZENGIN_CODE / ACC_NO" : "IBAN / SWIFT_BIC"} />
              </div>
              <div className="space-y-6">
                <label className="text-[10px] text-cyan-400/50 uppercase tracking-[0.5em] px-4 font-black italic">Settlement Liquidity ({mode === 'Domestic' ? 'JPY' : 'USD'})</label>
                <input className="w-full bg-transparent border-b border-white/20 p-6 text-8xl font-light tracking-tighter text-white outline-none focus:border-cyan-400 transition-all text-center italic" placeholder="0" />
              </div>
              <button className="w-full py-8 bg-cyan-500 text-[#000d1a] font-black text-xs tracking-[1.2em] rounded-full transition-all uppercase italic shadow-2xl hover:bg-white">
                INITIATE_TRANSFER
              </button>
            </div>
          )}
        </div>

        {/* RECENT LEDGER ARCHIVE */}
        <div className="space-y-8 flex flex-col h-full">
          <div className="px-6 flex justify-between items-center">
            <h3 className="text-[11px] text-white/30 tracking-[0.7em] uppercase font-black italic">Ledger Archive</h3>
            <button className="text-[10px] text-cyan-400/60 hover:text-cyan-400 tracking-[0.3em] transition-colors font-black uppercase italic">Audit_Global</button>
          </div>
          <div className="space-y-6 flex-1 max-h-[850px] overflow-y-auto custom-scrollbar pr-4">
            {MOCK_HISTORY.map((tx) => (
              <div key={tx.id} className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex items-center justify-between hover:bg-white/[0.07] hover:border-cyan-400/40 transition-all group backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.5rem] border border-white/10 bg-black/30 flex items-center justify-center text-white/20 group-hover:text-cyan-400/60 transition-colors shadow-inner">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M12 2v20M2 12h20" /></svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/30 tracking-[0.3em] font-black uppercase italic">{tx.timestamp}</p>
                    <p className="text-lg font-light text-white/70 group-hover:text-white transition-colors uppercase italic">{tx.type} <span className="text-white/10 font-medium italic mx-2 lowercase">to</span> {tx.recipient}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light tracking-tighter text-white drop-shadow-md italic">{tx.amount} <span className="text-[10px] opacity-30 uppercase ml-2 font-black italic">{tx.asset}</span></p>
                  <div className="flex items-center gap-2.5 justify-end mt-2">
                    <div className={`w-2 h-2 rounded-full ${tx.status === 'completed' ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-amber-400'}`} />
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black italic">{tx.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function ModeItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-4 transition-all duration-700 relative group ${active ? 'text-white scale-110' : 'text-white/20 hover:text-white/50 hover:scale-105'}`}>
      <div className={`transition-transform duration-700 ${active ? 'drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]' : ''}`}>{icon}</div>
      <span className={`text-[10px] font-black tracking-[0.6em] uppercase transition-opacity duration-700 ${active ? 'opacity-100 italic' : 'opacity-0'}`}>{label}</span>
      {active && <div className="absolute -bottom-6 w-10 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-full" />}
    </button>
  );
}
