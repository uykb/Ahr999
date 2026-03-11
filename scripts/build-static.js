const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function fetchBitcoinHistory(days = '2000') {
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
        timeout: 15000,
      }
    );
    
    if (response.data && response.data.prices) {
      return response.data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
      }));
    }
  } catch (error) {
    console.error('Coingecko API failed, trying Binance...');
  }

  // Strategy 2: Try Binance
  try {
    console.log('Fetching Bitcoin history from Binance...');
    const response = await axios.get(
      'https://api.binance.com/api/v3/klines',
      {
        params: {
          symbol: 'BTCUSDT',
          interval: '1d',
          limit: 1000
        },
        timeout: 15000
      }
    );
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(item => ({
        timestamp: item[0],
        price: parseFloat(item[4])
      }));
    }
  } catch (binanceError) {
    console.error('Binance API failed, trying OKX...');
  }

  // Strategy 3: Try OKX
  try {
    console.log('Fetching Bitcoin history from OKX...');
    const response = await axios.get(
      'https://www.okx.com/api/v5/market/history-candles',
      {
        params: {
          instId: 'BTC-USDT',
          bar: '1D',
          limit: 1000
        },
        timeout: 15000
      }
    );
    if (response.data && response.data.data) {
      // OKX returns newest first, we need to reverse it for consistency
      return response.data.data.map(item => ({
        timestamp: parseInt(item[0]),
        price: parseFloat(item[4])
      })).reverse();
    }
  } catch (okxError) {
    console.error('OKX API failed.');
  }

  return null;
}

async function fetchFearAndGreedHistory(limit = 2000) {
  try {
    console.log(`Fetching Fear & Greed history (${limit} days)...`);
    const response = await axios.get(`https://api.alternative.me/fng/?limit=${limit}`, {
      timeout: 15000
    });
    if (response.data && response.data.data) {
      return response.data.data.map(item => ({
        value: parseInt(item.value),
        value_classification: item.value_classification,
        timestamp: parseInt(item.timestamp) * 1000
      })).reverse(); // Return in chronological order
    }
  } catch (error) {
    console.error('Fear & Greed API failed:', error.message);
  }
  return null;
}

async function main() {
  const [prices, fng] = await Promise.all([
    fetchBitcoinHistory(),
    fetchFearAndGreedHistory()
  ]);

  if (!prices || prices.length === 0) {
    console.error('Failed to fetch Bitcoin prices, aborting.');
    process.exit(1);
  }

  let content = `// Snapshot generated on ${new Date().toISOString()}
import { BitcoinPrice, FearAndGreed } from './ahr999';

export const STATIC_BITCOIN_HISTORY: BitcoinPrice[] = ${JSON.stringify(prices, null, 2)};
`;

  if (fng && fng.length > 0) {
    content += `\nexport const STATIC_FNG_HISTORY: FearAndGreed[] = ${JSON.stringify(fng, null, 2)};\n`;
    console.log('Static FNG data added with ' + fng.length + ' points.');
  } else {
    // Keep an empty array if FNG failed, to avoid import errors
    content += `\nexport const STATIC_FNG_HISTORY: FearAndGreed[] = [];\n`;
    console.warn('Fear & Greed data empty, using empty array.');
  }

  fs.writeFileSync(path.join(__dirname, '../lib/static-data.ts'), content);
  console.log('Static data updated with ' + prices.length + ' price points.');
}

main();
