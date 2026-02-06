const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function fetchBitcoinHistory(days = '2000') {
  try {
    console.log(`Fetching Bitcoin history (${days} days)...`);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'daily',
        },
        timeout: 10000,
      }
    );
    
    const prices = response.data.prices;
    return prices.map(([timestamp, price]) => ({
      timestamp,
      price,
    }));
  } catch (error) {
    console.error('Coingecko API failed, trying Binance...');
    try {
      const response = await axios.get(
        'https://api.binance.com/api/v3/klines',
        {
          params: {
            symbol: 'BTCUSDT',
            interval: '1d',
            limit: 1000
          },
          timeout: 10000
        }
      );
      return response.data.map(item => ({
        timestamp: item[0],
        price: parseFloat(item[4])
      }));
    } catch (binanceError) {
      console.error('Binance API also failed.');
      return null;
    }
  }
}

async function main() {
  const prices = await fetchBitcoinHistory();
  if (!prices || prices.length === 0) {
    console.error('Failed to fetch data, aborting.');
    process.exit(1);
  }

  const content = `import { BitcoinPrice } from './ahr999';

// Snapshot generated on ${new Date().toISOString()}
export const STATIC_BITCOIN_HISTORY: BitcoinPrice[] = ${JSON.stringify(prices, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, '../lib/static-data.ts'), content);
  console.log('Static data updated with ' + prices.length + ' points.');
}

main();
