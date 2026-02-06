import { getAHR999Data } from '@/lib/ahr999';
import ChartSection from '@/components/ChartSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getAHR999Data();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'buy': return 'bg-green-100 text-green-800 border-green-200';
      case 'invest': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'buy': return '抄底区间 (Buy Zone)';
      case 'invest': return '定投区间 (DCA Zone)';
      case 'high': return '起飞区间 (High Zone)';
      default: return 'Unknown';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Bitcoin AHR999 Index</h1>
          <p className="text-gray-500">Real-time AHR999 Indicator for Bitcoin Accumulation</p>
        </div>

        {/* Stats Grid */}
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Price Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Current BTC Price</div>
              <div className="text-3xl font-bold text-gray-900">
                ${data.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* AHR999 Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">AHR999 Index</div>
              <div className={`text-3xl font-bold ${data.ahr999 < 0.45 ? 'text-green-600' : data.ahr999 > 1.2 ? 'text-red-600' : 'text-blue-600'}`}>
                {data.ahr999.toFixed(4)}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Expected Price: ${Math.round(data.expectedPrice).toLocaleString()}
              </div>
            </div>

            {/* Status Card */}
            <div className={`p-6 rounded-xl shadow-sm border ${getStatusColor(data.indicatorStatus)} flex flex-col justify-center items-center`}>
              <div className="text-sm opacity-80 mb-1">Suggestion</div>
              <div className="text-2xl font-bold text-center">
                {getStatusText(data.indicatorStatus)}
              </div>
            </div>

          </div>
        ) : (
          <div className="p-10 text-center text-red-500 bg-white rounded-xl">
            Failed to load current data. Please try again later.
          </div>
        )}

        {/* Chart Section */}
        <ChartSection />

        {/* Footer / Explanation */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-gray-600 text-sm space-y-4">
          <h3 className="font-bold text-lg text-gray-900">About AHR999 Index</h3>
          <p>
            The AHR999 index is used to assess the deviation between short-term returns and price of Bitcoin.
            Formula: <code className="bg-gray-100 px-1 py-0.5 rounded">AHR999 = (Price / 200-Day GeoMean) * (Price / Exponential Growth Valuation)</code>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>&lt; 0.45</strong>: The bottom range. It is recommended to buy the bottom.</li>
            <li><strong>0.45 - 1.2</strong>: The fixed investment range. Suitable for Dollar Cost Averaging (DCA).</li>
            <li><strong>&gt; 1.2</strong>: The bull market top range. Prices are relatively high.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
