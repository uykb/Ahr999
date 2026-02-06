import axios from 'axios';
import { differenceInDays } from 'date-fns';

export const GENESIS_DATE = new Date('2009-01-03');

export interface BitcoinPrice {
  timestamp: number;
  price: number;
}

export interface AHR999Result {
  currentPrice: number;
  ahr999: number;
  geometricMean200: number;
  expectedPrice: number;
  timestamp: number;
  indicatorStatus: 'buy' | 'invest' | 'high'; // <0.45, 0.45-1.2, >1.2
}

export interface AHR999HistoryPoint {
  timestamp: number;
  price: number;
  ahr999: number;
  geometricMean200: number;
  expectedPrice: number;
}

/**
 * Calculate Geometric Mean of an array of numbers
 */
export function calculateGeometricMean(values: number[]): number {
  if (values.length === 0) return 0;
  const logSum = values.reduce((sum, val) => sum + Math.log(val), 0);
  return Math.exp(logSum / values.length);
}

/**
 * Calculate Expected Price based on coin age
 * Formula: 10^(5.84 * log10(days) - 17.01)
 */
export function calculateExpectedPrice(date: Date): number {
  const ageInDays = differenceInDays(date, GENESIS_DATE);
  if (ageInDays <= 0) return 1; 
  return Math.pow(10, 5.84 * Math.log10(ageInDays) - 17.01);
}

// Simple in-memory cache to prevent hitting Coingecko Rate Limits
const CACHE: {
  history: BitcoinPrice[] | null;
  lastFetch: number;
} = {
  history: null,
  lastFetch: 0,
};

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Fetch from Binance (Fallback)
 * Returns last 1000 days (approx 2.7 years)
 */
async function fetchFromBinance(): Promise<BitcoinPrice[]> {
  try {
    console.log('Fetching fallback data from Binance...');
    const response = await axios.get(
      'https://api.binance.com/api/v3/klines',
      {
        params: {
          symbol: 'BTCUSDT',
          interval: '1d',
          limit: 1000
        },
        timeout: 5000
      }
    );
    
    // Binance response: [Open Time, Open, High, Low, Close, Volume, Close Time, ...]
    // We use Close Time (index 6) or Open Time (index 0) and Close Price (index 4)
    const data = response.data as any[][];
    
    return data.map(item => ({
      timestamp: item[0], // Open time
      price: parseFloat(item[4]) // Close price
    }));
  } catch (error) {
    console.error('Error fetching from Binance:', error);
    return [];
  }
}

/**
 * Fetch Bitcoin Market Chart Data
 */
export async function fetchBitcoinHistory(days: string = '2000'): Promise<BitcoinPrice[]> {
  // Check cache first
  const now = Date.now();
  if (CACHE.history && (now - CACHE.lastFetch < CACHE_DURATION)) {
    console.log('Serving from cache');
    return CACHE.history;
  }

  let result: BitcoinPrice[] = [];

  // Strategy 1: Try Coingecko
  try {
    console.log(`Fetching Bitcoin history from Coingecko (${days} days)...`);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'daily',
        },
        timeout: 8000, // 8s timeout
      }
    );
    
    const prices: [number, number][] = response.data.prices;
    result = prices.map(([timestamp, price]) => ({
      timestamp,
      price,
    }));
  } catch (error) {
    console.error('Coingecko API failed, trying fallback...');
  }

  // Strategy 2: Try Binance if Coingecko failed or returned empty
  if (result.length === 0) {
    result = await fetchFromBinance();
  }

  // Strategy 3: Use stale cache if available (even if expired)
  if (result.length === 0 && CACHE.history && CACHE.history.length > 0) {
    console.warn('All APIs failed, serving stale cache');
    return CACHE.history;
  }

  // Update cache if we got data
  if (result.length > 0) {
    CACHE.history = result;
    CACHE.lastFetch = now;
  }

  return result;
}

/**
 * Get current AHR999 Data
 */
export async function getAHR999Data(): Promise<AHR999Result | null> {
  // Use '2000' instead of '300' to share cache with history chart
  const history = await fetchBitcoinHistory('2000');
  
  if (history.length < 200) {
    return null;
  }

  const currentItem = history[history.length - 1];
  const currentPrice = currentItem.price;
  const currentDate = new Date(currentItem.timestamp);

  const last200 = history.slice(-200).map(p => p.price);
  const geometricMean200 = calculateGeometricMean(last200);
  const expectedPrice = calculateExpectedPrice(currentDate);
  const ahr999 = (currentPrice / geometricMean200) * (currentPrice / expectedPrice);

  let status: 'buy' | 'invest' | 'high' = 'high';
  if (ahr999 < 0.45) status = 'buy';
  else if (ahr999 <= 1.2) status = 'invest';

  return {
    currentPrice,
    ahr999,
    geometricMean200,
    expectedPrice,
    timestamp: currentItem.timestamp,
    indicatorStatus: status
  };
}

/**
 * Get Historical AHR999 Data (for Chart)
 */
export async function getAHR999History(): Promise<AHR999HistoryPoint[]> {
  // Use default (2000 days) to leverage cache
  const history = await fetchBitcoinHistory('2000');
  
  if (history.length < 200) return [];

  const results: AHR999HistoryPoint[] = [];

  // Sliding window calculation
  // We need a window of 200 days.
  // We can optimize geometric mean calculation using sliding window log sums.
  
  // Initialize window
  let logSum = 0;
  const windowSize = 200;
  
  // Pre-calculate first window sum (excluding the last element of the window which is handled in loop?)
  // Let's just do it simply first.
  
  for (let i = 0; i < history.length; i++) {
    // We need 200 days history prior to or including this day to calculate the mean.
    // If i < 199, we don't have 200 days.
    if (i < 199) continue;

    const window = history.slice(i - 199, i + 1); // 200 items ending at i
    const prices = window.map(p => p.price);
    
    // Optimization: we could update logSum incrementally, but recalculating 200 items is fast enough for ~3000 items
    const geoMean = calculateGeometricMean(prices);
    
    const item = history[i];
    const date = new Date(item.timestamp);
    const expected = calculateExpectedPrice(date);
    
    const ahr = (item.price / geoMean) * (item.price / expected);
    
    results.push({
      timestamp: item.timestamp,
      price: item.price,
      ahr999: ahr,
      geometricMean200: geoMean,
      expectedPrice: expected
    });
  }

  return results;
}
