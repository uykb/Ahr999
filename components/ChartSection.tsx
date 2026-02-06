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

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Chart Data... (Please wait ~5s)</div>;
  if (error || data.length === 0) return (
    <div className="p-10 text-center text-red-500 bg-white rounded-xl border border-red-100">
      <p className="font-bold">Failed to load chart data.</p>
      <p className="text-sm mt-2 text-gray-600">Possible reasons:</p>
      <ul className="text-sm text-left list-disc pl-5 mt-2 inline-block">
        <li>Coingecko API Rate Limit (Too many requests)</li>
        <li>Network timeout</li>
      </ul>
      <p className="text-xs mt-4 text-gray-400">Try refreshing the page in a few minutes.</p>
    </div>
  );

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md">
      <AhrChart data={data} />
    </div>
  );
}
