'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { AHR999HistoryPoint } from '@/lib/ahr999';

const AhrChart = dynamic(() => import('./AhrChart'), { ssr: false });

export default function ChartSection() {
  const [data, setData] = useState<AHR999HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/ahr999?type=history')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data);
        } else {
          console.warn('API returned empty array or invalid format', res.data);
          setError(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load chart data:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Chart Data...</div>;
  if (error || data.length === 0) return (
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
