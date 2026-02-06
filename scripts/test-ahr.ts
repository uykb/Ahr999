import { getAHR999Data } from '../lib/ahr999';

async function main() {
  console.log('Testing AHR999 Algorithm...');
  try {
    const data = await getAHR999Data();
    console.log('Result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
