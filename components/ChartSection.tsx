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

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading Chart Data... (Please wait ~5s)</div>;
  
  if (error || !data || data.length === 0) return (
    <div className="p-10 text-center text-red-500 bg-white rounded-xl border border-red-100">
      <p className="font-bold">Failed to load chart data.</p>
      <p className="text-sm mt-2 text-gray-600">All data sources (Coingecko & Binance) failed.</p>
      <p className="text-xs mt-4 text-gray-400">Please try refreshing in a few minutes.</p>
    </div>
  );

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md">
      <AhrChart data={data} />
    </div>
  );
}
