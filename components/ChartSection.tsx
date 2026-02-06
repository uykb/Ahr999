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
    axios.get('/api/ahr999?type=history')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Chart Data...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load chart data</div>;

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md">
      <AhrChart data={data} />
    </div>
  );
}
