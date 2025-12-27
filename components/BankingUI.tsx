
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

type TransferMode = 'Domestic' | 'Global' | 'Crypto';

export const BankingUI: React.FC = () => {
  const [mode, setMode] = useState<TransferMode>('Domestic');
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold tracking-tighter text-white">Unified Transfer Hub</h2>
      
      {/* Mode Selector */}
      <div className="flex bg-neutral-900 rounded-2xl p-1 border border-neutral-800">
        {(['Domestic', 'Global', 'Crypto'] as TransferMode[]).map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              mode === m ? 'bg-neutral-800 text-emerald-400 shadow-inner' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'Crypto' ? (
        <div className="space-y-6">
          {/* Web3 Connection Status Section */}
          <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    MetaMask {isConnected ? 'Connected' : 'Disconnected'}
                  </h3>
                </div>

                {isConnected ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest block mb-1">Account Address</span>
                      <p className="text-sm font-mono text-emerald-400 font-bold break-all bg-black/40 p-3 rounded-xl border border-white/5">
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest block mb-1">Network</span>
                      <p className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {network}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 font-medium">Connect your decentralized wallet to execute high-velocity on-chain transfers.</p>
                )}
              </div>

              <div className="flex-none">
                {isConnected ? (
                  <button 
                    onClick={handleDisconnect}
                    className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={handleConnect}
                    className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Crypto Transfer Form */}
          <div className={`p-6 bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] space-y-6 transition-opacity duration-300 ${!isConnected ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] block mb-2 font-bold">Recipient ENS or Wallet Address</label>
              <input className="w-full bg-black border border-neutral-800 rounded-2xl p-4 text-sm font-mono text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700" placeholder="0x... or vitalik.eth" />
            </div>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] block mb-2 font-bold">Transaction Value</label>
              <div className="relative">
                <input className="w-full bg-black border border-neutral-800 rounded-2xl p-4 pr-16 text-2xl font-bold tracking-tighter text-white outline-none focus:border-emerald-500 transition-all placeholder:text-neutral-700" placeholder="0.00" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-xs">ETH</span>
              </div>
            </div>
            <button className="w-full py-5 bg-emerald-500 text-black font-black text-xs tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:brightness-110 active:scale-95 transition-all">
              BROADCAST TO NETWORK
            </button>
          </div>
        </div>
      ) : (
        /* Legacy Forms for Domestic/Global */
        <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] space-y-6">
          <div>
             <label className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] block mb-2 font-bold">Recipient Account Details</label>
             <input className="w-full bg-black border border-neutral-800 rounded-2xl p-4 text-sm font-mono text-white focus:border-emerald-500 outline-none transition-all" placeholder={mode === 'Domestic' ? "Routing Number / Account" : "IBAN / SWIFT Code"} />
          </div>
          <div>
             <label className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] block mb-2 font-bold">Amount</label>
             <div className="relative">
                <input className="w-full bg-black border border-neutral-800 rounded-2xl p-4 pr-16 text-2xl font-bold tracking-tighter text-white outline-none focus:border-emerald-500 transition-all" placeholder="0.00" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-xs">{mode === 'Domestic' ? 'USD' : 'EUR'}</span>
             </div>
          </div>
          <button className="w-full py-5 bg-white text-black font-black text-xs tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:brightness-90 active:scale-95 transition-all">
            EXECUTE {mode.toUpperCase()} SETTLEMENT
          </button>
        </div>
      )}
    </div>
  );
};
