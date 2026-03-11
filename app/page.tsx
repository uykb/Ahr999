'use client';

import useSWR from 'swr';
import ChartSection from '@/components/ChartSection';
import { AHR999Result } from '@/lib/ahr999';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { data } = useSWR<AHR999Result>('/api/ahr999', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'buy': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]';
      case 'invest': return 'text-blue-400 border-blue-500/20 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]';
      case 'high': return 'text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.1)]';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/5';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'buy': return '抄底区间 (Buy Zone)';
      case 'invest': return '定投区间 (DCA Zone)';
      case 'high': return '起飞区间 (High Zone)';
      default: return '未知';
    }
  };

  const getFngColor = (value: number) => {
    if (value <= 25) return 'text-rose-500';
    if (value <= 45) return 'text-orange-400';
    if (value <= 55) return 'text-yellow-400';
    if (value <= 75) return 'text-lime-400';
    return 'text-emerald-500';
  };

  return (
    <main className="min-h-screen bg-black text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white">
              AHR<span className="text-blue-500">999</span>
            </h1>
            <p className="text-slate-400 font-medium flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              比特币囤币指标 · 实时数据分析
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500 backdrop-blur-sm">
            LAST UPDATE: {data ? new Date(data.timestamp).toLocaleTimeString() : '--:--:--'}
          </div>
        </div>

        {/* Stats Grid */}
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Price Card */}
            <div className="group relative bg-zinc-900/50 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between text-slate-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest">BTC Price</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white tracking-tight tabular-nums">
                  <span className="text-slate-500 text-lg mr-1">$</span>
                  {data.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* AHR999 Card */}
            <div className="group relative bg-zinc-900/50 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between text-slate-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest">AHR999 Index</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </div>
                </div>
                <div className={`text-3xl font-bold tracking-tight tabular-nums ${data.ahr999 < 0.45 ? 'text-emerald-400' : data.ahr999 > 1.2 ? 'text-rose-400' : 'text-blue-400'}`}>
                  {data.ahr999.toFixed(4)}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-medium bg-white/5 w-fit px-2 py-1 rounded-md border border-white/5">
                  <span className="text-slate-500">TARGET</span>
                  <span className="text-slate-300 tabular-nums">${Math.round(data.expectedPrice).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Fear & Greed Card */}
            <div className="group relative bg-zinc-900/50 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between text-slate-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Fear & Greed</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                </div>
                {data.fng ? (
                  <>
                    <div className={`text-3xl font-bold tracking-tight tabular-nums ${getFngColor(data.fng.value)}`}>
                      {data.fng.value}
                    </div>
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 w-fit px-2 py-1 rounded-md border border-white/5">
                      {data.fng.value_classification}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-600 italic text-sm">Unavailable</div>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className={`group relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden ${getStatusColor(data.indicatorStatus)}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 opacity-80 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Suggestion</span>
                </div>
                <div className="text-xl font-black tracking-wide leading-tight">
                  {getStatusText(data.indicatorStatus)}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-[180px] flex flex-col items-center justify-center bg-zinc-900/30 border border-dashed border-slate-800 rounded-3xl animate-pulse">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">System Initializing...</p>
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
          <ChartSection />
        </div>

        {/* Footer / Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 border-t border-white/5">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs">?</div>
              关于 AHR999 指数
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm max-w-2xl">
              AHR999 指数由微博用户 @ahr999 创建，旨在帮助囤币党在合适的时机定投。它综合考虑了比特币价格与 200 日定投成本的关系，以及比特币价格与预期估值的偏差。
            </p>
            <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-[11px] text-blue-400/80">
              AHR999 = (Price / 200-Day GeoMean) * (Price / Exp Growth Valuation)
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                <span className="text-emerald-400 font-bold text-sm">抄底区间 (&lt; 0.45)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium bg-white/5 px-2 py-1 rounded">STRONG BUY</span>
            </div>
            <div className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                <span className="text-blue-400 font-bold text-sm">定投区间 (0.45 - 1.2)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium bg-white/5 px-2 py-1 rounded">DCA ZONE</span>
            </div>
            <div className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-rose-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]"></div>
                <span className="text-rose-400 font-bold text-sm">起飞区间 (&gt; 1.2)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium bg-white/5 px-2 py-1 rounded">TOP RANGE</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
