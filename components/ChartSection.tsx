'use client';

import React from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { AHR999HistoryPoint } from '@/lib/ahr999';

const AhrChart = dynamic(() => import('./AhrChart'), { ssr: false });

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ChartSection() {
  const { data, error, isLoading } = useSWR<AHR999HistoryPoint[]>('/api/ahr999?type=history', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  if (isLoading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Chart Data... (Please wait ~5s)</div>;
  
  if (error || !data || data.length === 0) return (
    <div className="p-10 text-center text-rose-400 bg-slate-900/50 rounded-2xl border border-rose-500/20">
      <p className="font-bold">Failed to load chart data.</p>
      <p className="text-sm mt-2 text-slate-500">All data sources (Coingecko & Binance) failed.</p>
    </div>
  );

  return (
    <div className="w-full bg-slate-900/30 p-4 md:p-6 rounded-2xl border border-slate-800/50">
      <AhrChart data={data} />
    </div>
  );
}
