const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../static-data-blockchain.json');
const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);

const prices = data.values.map(v => ({
  timestamp: v.x * 1000,
  price: v.y
}));

const content = `import { BitcoinPrice } from './ahr999';

// Snapshot generated on ${new Date().toISOString()}
export const STATIC_BITCOIN_HISTORY: BitcoinPrice[] = ${JSON.stringify(prices, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../lib/static-data.ts'), content);
console.log('Static data generated with ' + prices.length + ' points.');
