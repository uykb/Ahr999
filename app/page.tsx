'use client';

import useSWR from 'swr';
import ChartSection from '@/components/ChartSection';
import { AHR999Result } from '@/lib/ahr999';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { data } = useSWR<AHR999Result>('/api/ahr999', fetcher, {
    refreshInterval: 10000, // 每10秒自动刷新一次
    revalidateOnFocus: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'buy': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'invest': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      case 'high': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
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
    <main className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Bitcoin AHR999
            </h1>
            <p className="text-slate-500 font-medium">囤币党指数 · 实时数据分析</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-500">
            Last Updated: {data ? new Date(data.timestamp).toLocaleString() : 'Loading...'}
          </div>
        </div>

        {/* Stats Grid */}
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Price Card */}
            <div className="group bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300">
              <div className="flex items-center gap-2 text-slate-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-xs font-bold uppercase tracking-wider">BTC Price</span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">
                <span className="text-slate-500 text-xl mr-1">$</span>
                {data.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* AHR999 Card */}
            <div className="group bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300">
              <div className="flex items-center gap-2 text-slate-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                <span className="text-xs font-bold uppercase tracking-wider">AHR999 Index</span>
              </div>
              <div className={`text-3xl font-bold tracking-tight ${data.ahr999 < 0.45 ? 'text-emerald-400' : data.ahr999 > 1.2 ? 'text-rose-400' : 'text-blue-400'}`}>
                {data.ahr999.toFixed(4)}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <span>拟合价格:</span>
                <span className="text-slate-300">${Math.round(data.expectedPrice).toLocaleString()}</span>
              </div>
            </div>

            {/* Fear & Greed Card */}
            <div className="group bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300">
              <div className="flex items-center gap-2 text-slate-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span className="text-xs font-bold uppercase tracking-wider">Fear & Greed</span>
              </div>
              {data.fng ? (
                <>
                  <div className={`text-3xl font-bold tracking-tight ${getFngColor(data.fng.value)}`}>
                    {data.fng.value}
                  </div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {data.fng.value_classification}
                  </div>
                </>
              ) : (
                <div className="text-slate-600 italic text-sm">Unavailable</div>
              )}
            </div>

            {/* Status Card */}
            <div className={`group p-6 rounded-2xl border transition-all duration-300 ${getStatusColor(data.indicatorStatus)}`}>
              <div className="flex items-center gap-2 opacity-60 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-xs font-bold uppercase tracking-wider">Suggestion</span>
              </div>
              <div className="text-xl font-black tracking-wide leading-tight">
                {getStatusText(data.indicatorStatus)}
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-400 mb-4">
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
            <p className="text-slate-400 font-medium">Fetching market data...</p>
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-slate-900/40 p-1 rounded-3xl border border-slate-800/50">
          <ChartSection />
        </div>

        {/* Footer / Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-t border-slate-800/50">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              什么是 AHR999 指数？
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              AHR999 指数由微博用户 @ahr999 创建，旨在帮助囤币党在合适的时机定投。它综合考虑了比特币价格与 200 日定投成本的关系，以及比特币价格与预期估值的偏差。
            </p>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-500">
              AHR999 = (Price / 200-Day GeoMean) * (Price / Exp Growth Valuation)
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-emerald-400 font-bold text-sm">抄底区间 (&lt; 0.45)</span>
              <span className="text-xs text-slate-500 font-medium">砸锅卖铁，分批买入</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
              <span className="text-blue-400 font-bold text-sm">定投区间 (0.45 - 1.2)</span>
              <span className="text-xs text-slate-500 font-medium">坚持定投，稳扎稳打</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <span className="text-rose-400 font-bold text-sm">等待起飞 (&gt; 1.2)</span>
              <span className="text-xs text-slate-500 font-medium">牛市高位，谨慎追高</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
