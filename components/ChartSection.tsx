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

  if (isLoading) return (
    <div className="h-[500px] flex flex-col items-center justify-center text-slate-500 font-medium">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-mono uppercase tracking-widest">Loading Chart Data...</p>
    </div>
  );
  
  if (error || !data || data.length === 0) return (
    <div className="h-[500px] flex flex-col items-center justify-center text-center text-rose-400">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <p className="font-bold">Failed to load chart data</p>
      <p className="text-sm mt-2 text-slate-600">Please try refreshing in a few minutes</p>
    </div>
  );

  return (
    <div className="w-full">
      <AhrChart data={data} />
    </div>
  );
}
