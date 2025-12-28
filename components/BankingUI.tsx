
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

type TransferMode = 'Domestic' | 'Global' | 'Crypto';

export const BankingUI: React.FC = () => {
  const [mode, setMode] = useState<TransferMode>('Crypto');
  const [isConnected, setIsConnected] = useState(true);
  const [account, setAccount] = useState('0x71C2496A24581248447101824701248447');
  const [network, setNetwork] = useState('Ethereum Mainnet');

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleConnect = () => {
    setIsConnected(true);
    setAccount('0x71C2496A24581248447101824701248447');
    setNetwork('Ethereum Mainnet');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Sovereign Settlement Hub</h2>
        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.4em]">Integrated Liquidity Corridors v800.0</p>
      </div>
      
      {/* Mode Selector */}
      <div className="flex bg-neutral-900 rounded-[2rem] p-1.5 border border-neutral-800 shadow-2xl">
        {(['Domestic', 'Global', 'Crypto'] as TransferMode[]).map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${
              mode === m ? 'bg-neutral-800 text-emerald-400 shadow-inner' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'Crypto' ? (
        <div className="space-y-8">
          {/* Web3 Connection Status Section - PROMINENT DISPLAY */}
          <div className="p-10 bg-gradient-to-br from-indigo-500/10 via-black to-purple-500/10 border border-indigo-500/30 rounded-[4rem] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
               <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
            </div>
            
            <div className="relative z-10 flex flex-col gap-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_20px_#10b981]' : 'bg-red-500 shadow-[0_0_20px_#ef4444]'}`} />
                    <h3 className="text-lg font-black text-white uppercase tracking-[0.3em]">
                      MetaMask {isConnected ? 'Sovereign-Link Active' : 'Detached'}
                    </h3>
                  </div>

                  {isConnected ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                      <div className="p-6 bg-black/60 border border-white/5 rounded-3xl shadow-inner group/addr">
                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest block mb-2">Connected Account Address</span>
                        <p className="text-xl font-mono text-emerald-400 font-black break-all drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                          {account.slice(0, 10)}<span className="opacity-20 text-white">...</span>{account.slice(-8)}
                        </p>
                      </div>
                      <div className="p-6 bg-black/60 border border-white/5 rounded-3xl shadow-inner">
                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest block mb-2">Active Network Node</span>
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                          <p className="text-sm font-black text-indigo-300 tracking-widest">
                            {network.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-neutral-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                       <p className="text-xs text-neutral-500 font-bold leading-relaxed max-w-xs uppercase tracking-widest">Handshake required for decentralized liquidity broadcasting.</p>
                    </div>
                  )}
                </div>

                <div className="flex-none flex items-center justify-center">
                  {isConnected ? (
                    <button 
                      onClick={handleDisconnect}
                      className="px-10 py-5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-[0_20px_50px_rgba(239,68,68,0.2)] active:scale-95 border-2"
                    >
                      Terminate Connection
                    </button>
                  ) : (
                    <button 
                      onClick={handleConnect}
                      className="px-14 py-6 bg-emerald-500 text-black rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-[0_30px_60px_rgba(16,185,129,0.4)] active:scale-95 border-4 border-black"
                    >
                      Connect Sovereign Wallet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Crypto Transfer Form */}
          <div className={`p-10 bg-neutral-900/40 border border-neutral-800 rounded-[4rem] space-y-8 transition-all duration-500 shadow-2xl ${!isConnected ? 'opacity-20 blur-md grayscale pointer-events-none' : 'opacity-100'}`}>
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] block px-2 font-black">Destination ENS / Wallet</label>
              <input className="w-full bg-black border border-neutral-800 rounded-3xl p-6 text-sm font-mono text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-800 shadow-inner" placeholder="0x... or vitalik.eth" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] block px-2 font-black">Broadcasting Value</label>
              <div className="relative">
                <input className="w-full bg-black border border-neutral-800 rounded-[2.5rem] p-8 pr-24 text-4xl font-black tracking-tighter text-white outline-none focus:border-emerald-500 transition-all placeholder:text-neutral-800 shadow-inner" placeholder="0.00" />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-neutral-600 font-black text-lg tracking-widest">ETH</span>
              </div>
            </div>
            <button className="w-full py-8 bg-white text-black font-black text-xs tracking-[0.5em] rounded-[3rem] shadow-[0_40px_100px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all border-4 border-black">
              EXECUTE BLOCKCHAIN SETTLEMENT
            </button>
          </div>
        </div>
      ) : (
        /* Legacy Forms for Domestic/Global */
        <div className="p-10 bg-neutral-900/40 border border-neutral-800 rounded-[4rem] space-y-8 shadow-2xl">
          <div className="space-y-2">
             <label className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] block px-2 font-black">Recipient Master Identity</label>
             <input className="w-full bg-black border border-neutral-800 rounded-3xl p-6 text-sm font-mono text-white focus:border-emerald-500 outline-none transition-all shadow-inner" placeholder={mode === 'Domestic' ? "ZENGIN_CODE / ACCOUNT_NO" : "IBAN / SWIFT_BIC"} />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] block px-2 font-black">Fiat Volume</label>
             <div className="relative">
                <input className="w-full bg-black border border-neutral-800 rounded-[2.5rem] p-8 pr-24 text-4xl font-black tracking-tighter text-white outline-none focus:border-emerald-500 transition-all shadow-inner" placeholder="0.00" />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-neutral-600 font-black text-lg tracking-widest">{mode === 'Domestic' ? 'JPY' : 'USD'}</span>
             </div>
          </div>
          <button className="w-full py-8 bg-emerald-500 text-black font-black text-xs tracking-[0.5em] rounded-[3rem] shadow-[0_40px_100px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-4 border-black">
            INITIATE {mode.toUpperCase()} SETTLEMENT
          </button>
        </div>
      )}
    </div>
  );
};
