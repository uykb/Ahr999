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
    title: {
      text: 'Bitcoin Price vs AHR999 Index',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['BTC Price', 'AHR999'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => format(new Date(item.timestamp), 'yyyy-MM-dd')),
      boundaryGap: false
    },
    yAxis: [
      {
        type: 'log',
        name: 'Price (USD)',
        position: 'left',
        axisLabel: {
          formatter: '${value}'
        },
        min: 'dataMin'
      },
      {
        type: 'value',
        name: 'AHR999 Index',
        position: 'right',
        splitLine: {
          show: false
        },
        min: 0
      }
    ],
    series: [
      {
        name: 'BTC Price',
        type: 'line',
        data: data.map(item => item.price),
        showSymbol: false,
        itemStyle: {
          color: '#f7931a'
        },
        lineStyle: {
          width: 2
        }
      },
      {
        name: 'AHR999',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.ahr999),
        showSymbol: false,
        itemStyle: {
          color: '#2f4554'
        },
        lineStyle: {
          width: 1
        },
        markLine: {
          silent: true,
          data: [
            {
              yAxis: 1.2,
              lineStyle: { color: 'red', type: 'dashed' },
              label: { position: 'end', formatter: 'Sell (>1.2)' }
            },
            {
              yAxis: 0.45,
              lineStyle: { color: 'green', type: 'dashed' },
              label: { position: 'end', formatter: 'Buy (<0.45)' }
            }
          ]
        },
        markArea: {
          silent: true,
          data: [
            [
              {
                yAxis: 0
              },
              {
                yAxis: 0.45,
                itemStyle: {
                  color: 'rgba(0, 255, 0, 0.1)'
                }
              }
            ]
          ]
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />;
}
