'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { AHR999HistoryPoint } from '@/lib/ahr999';
import { format } from 'date-fns';

interface AhrChartProps {
  data: AHR999HistoryPoint[];
}

export default function AhrChart({ data }: AhrChartProps) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(51, 65, 85, 1)',
      textStyle: {
        color: '#e2e8f0'
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#475569'
        }
      }
    },
    legend: {
      data: ['Bitcoin Price', 'AHR999 Index', 'Fear & Greed'],
      textStyle: {
        color: '#94a3b8'
      },
      top: 0
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => format(new Date(item.timestamp), 'yyyy-MM-dd')),
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#334155'
        }
      },
      axisLabel: {
        color: '#64748b'
      }
    },
    yAxis: [
      {
        type: 'log',
        name: 'Price (USD)',
        position: 'left',
        splitLine: {
          lineStyle: {
            color: 'rgba(51, 65, 85, 0.3)'
          }
        },
        axisLabel: {
          color: '#64748b',
          formatter: (value: number) => `$${value.toLocaleString()}`
        },
        min: 'dataMin'
      },
      {
        type: 'value',
        name: 'AHR/FNG',
        position: 'right',
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#64748b'
        },
        min: 0,
        // We will use two different scales conceptually, but one Y axis for simplicity 
        // OR two Y axes on the right? Echarts supports multiple.
        // Let's just use one for now and scale AHR999 up if needed, or just let them overlap.
        // Actually AHR is 0-4 usually, FNG is 0-100. Let's use two right axes.
      },
      {
        type: 'value',
        name: 'FNG',
        position: 'right',
        offset: 40,
        splitLine: { show: false },
        axisLabel: { color: '#64748b' },
        min: 0,
        max: 100
      }
    ],
    series: [
      {
        name: 'Bitcoin Price',
        type: 'line',
        data: data.map(item => item.price),
        showSymbol: false,
        itemStyle: {
          color: '#f59e0b'
        },
        lineStyle: {
          width: 2,
          color: '#f59e0b'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.1)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0)' }
            ]
          }
        }
      },
      {
        name: 'AHR999 Index',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.ahr999),
        showSymbol: false,
        itemStyle: {
          color: '#3b82f6'
        },
        lineStyle: {
          width: 1.5,
          color: '#3b82f6'
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              yAxis: 1.2,
              lineStyle: { color: 'rgba(244, 63, 94, 0.5)', type: 'dashed' },
              label: { position: 'end', formatter: 'Sell', color: '#f43f5e' }
            },
            {
              yAxis: 0.45,
              lineStyle: { color: 'rgba(16, 185, 129, 0.5)', type: 'dashed' },
              label: { position: 'end', formatter: 'Buy', color: '#10b981' }
            }
          ]
        }
      },
      {
        name: 'Fear & Greed',
        type: 'line',
        yAxisIndex: 2,
        data: data.map(item => item.fng),
        showSymbol: false,
        itemStyle: {
          color: '#a855f7'
        },
        lineStyle: {
          width: 1,
          color: '#a855f7',
          type: 'dotted'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '550px', width: '100%' }} />;
}
