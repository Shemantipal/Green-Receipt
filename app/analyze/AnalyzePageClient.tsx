'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Item {
  name: string;
  quantity: number;
  price: string;
  carbonFootprint: number;
  waterUsage: number;
  packagingScore: number;
  ecoAlternative: string;
}

interface AnalysisData {
  store: string;
  date: string;
  total: string;
  items: Item[];
  totalCarbonFootprint: number;
  totalWaterUsage: number;
  avgPackagingScore: number;
  ecoScore: number;
  recommendations: string[];
}

export default function AnalyzePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    
    if (!id) {
      router.push('/upload');
      return;
    }

    const stored = sessionStorage.getItem(`analysis_${id}`);
    
    if (!stored) {
      router.push('/upload');
      return;
    }

    try {
      const parsedData = JSON.parse(stored);
      setData(parsedData);
    } catch (err) {
      console.error('Failed to parse analysis data:', err);
      router.push('/upload');
    } finally {
      setLoading(false);
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <p className="text-2xl font-black text-orange-900">Loading Analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getPackagingColor = (score: number) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100">
      {/* Header */}
      <div className="bg-yellow-400 border-b-8 border-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)'
          }}></div>
        </div>
        
        <nav className="relative z-10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-black text-orange-900">GREEN RECEIPT</Link>
          <Link 
            href="/upload"
            className="px-4 py-2 bg-orange-600 text-white font-bold border-2 border-orange-900 hover:bg-orange-700 transition rounded"
          >
            UPLOAD NEW
          </Link>
        </nav>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-orange-500 text-white font-black text-sm tracking-widest rotate-[-1deg] shadow-lg border-4 border-orange-700">
              STEP 2 OF 2
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-orange-900 mb-4"
                style={{textShadow: '3px 3px 0px #fed7aa'}}>
              ENVIRONMENTAL IMPACT
            </h1>
            <div className="flex items-center justify-center gap-4 text-lg font-semibold text-gray-700 flex-wrap">
              <span>🏪 {data.store}</span>
              <span>•</span>
              <span>📅 {data.date}</span>
              <span>•</span>
              <span>💰 {data.total}</span>
            </div>
          </div>

          {/* Eco Score Card */}
          <div className="mb-12 bg-white border-8 border-orange-900 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-orange-900 mb-2">YOUR ECO SCORE</h2>
              <p className="text-gray-600 font-semibold">Lower is better for the planet!</p>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#fed7aa"
                    strokeWidth="16"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke={data.ecoScore >= 70 ? '#22c55e' : data.ecoScore >= 40 ? '#eab308' : '#ef4444'}
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={`${(data.ecoScore / 100) * 502.4} 502.4`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-black text-orange-900">{data.ecoScore}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 border-4 border-red-600 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🌍</div>
                <div className="text-3xl font-black text-red-900 mb-1">{data.totalCarbonFootprint.toFixed(2)}</div>
                <div className="text-sm font-bold text-gray-700">kg CO₂e</div>
              </div>
              
              <div className="bg-blue-50 border-4 border-blue-600 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">💧</div>
                <div className="text-3xl font-black text-blue-900 mb-1">{data.totalWaterUsage.toFixed(0)}</div>
                <div className="text-sm font-bold text-gray-700">liters</div>
              </div>
              
              <div className="bg-orange-50 border-4 border-orange-600 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-3xl font-black text-orange-900 mb-1">{data.avgPackagingScore.toFixed(1)}/10</div>
                <div className="text-sm font-bold text-gray-700">Packaging Impact</div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-12">
            <h2 className="text-4xl font-black text-orange-900 mb-6 text-center">ITEM BREAKDOWN</h2>
            <div className="space-y-4">
              {data.items.map((item, index) => (
                <div key={index} className="bg-white border-6 border-orange-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-orange-900">{item.name}</h3>
                      <p className="text-gray-600 font-semibold">Qty: {item.quantity} • {item.price}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3">
                      <div className="text-sm font-bold text-gray-600 mb-1">Carbon</div>
                      <div className="text-xl font-black text-red-900">{item.carbonFootprint} kg CO₂e</div>
                    </div>
                    
                    <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-3">
                      <div className="text-sm font-bold text-gray-600 mb-1">Water</div>
                      <div className="text-xl font-black text-blue-900">{item.waterUsage}L</div>
                    </div>
                    
                    <div className={`bg-orange-50 border-2 border-orange-400 rounded-lg p-3`}>
                      <div className="text-sm font-bold text-gray-600 mb-1">Packaging</div>
                      <div className={`text-xl font-black ${getPackagingColor(item.packagingScore)}`}>
                        {item.packagingScore}/10
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">💡</span>
                      <div>
                        <div className="font-bold text-green-900 mb-1">Eco-Friendly Alternative:</div>
                        <p className="text-sm text-gray-700">{item.ecoAlternative}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-green-100 to-lime-100 border-8 border-orange-900 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-4xl font-black text-orange-900 mb-6 text-center">
              🌱 YOUR ACTION PLAN
            </h2>
            <div className="space-y-4">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-4 bg-white border-4 border-green-600 rounded-lg p-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white font-black rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <p className="text-lg font-semibold text-gray-800 flex-1">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="px-8 py-4 bg-green-600 text-white text-xl font-black border-4 border-orange-900 rounded-xl shadow-[6px_6px_0px_0px_rgba(124,45,18,1)] hover:shadow-[3px_3px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 text-center"
            >
              📸 ANALYZE ANOTHER RECEIPT
            </Link>
            
            <Link
              href="/"
              className="px-8 py-4 bg-white text-orange-900 text-xl font-black border-4 border-orange-900 rounded-xl shadow-[6px_6px_0px_0px_rgba(124,45,18,1)] hover:shadow-[3px_3px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 text-center"
            >
              🏠 BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
