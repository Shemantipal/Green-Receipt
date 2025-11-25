'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  carbonFootprint: number;
  waterUsage: number;
  packagingWaste: number;
  ecoRating: 'A' | 'B' | 'C' | 'D' | 'F';
  alternatives: string[];
}

interface AnalysisResult {
  id: string;
  items: ReceiptItem[];
  totals: {
    carbonFootprint: number;
    waterUsage: number;
    packagingWaste: number;
    totalPrice: number;
  };
  overallRating: 'A' | 'B' | 'C' | 'D' | 'F';
  timestamp: string;
}

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    
    if (!id) {
      setError('No analysis ID provided');
      setLoading(false);
      return;
    }

    // In a real app, you'd fetch from an API or database
    // For now, we'll get it from sessionStorage (set by upload page)
    const storedData = sessionStorage.getItem(`analysis_${id}`);
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAnalysis(data);
      } catch (e) {
        setError('Failed to load analysis data');
      }
    } else {
      setError('Analysis not found');
    }
    
    setLoading(false);
  }, [searchParams]);

  const getRatingColor = (rating: string) => {
    const colors: { [key: string]: string } = {
      A: 'from-green-300 to-green-400',
      B: 'from-lime-300 to-lime-400',
      C: 'from-yellow-300 to-yellow-400',
      D: 'from-orange-300 to-orange-400',
      F: 'from-red-300 to-red-400',
    };
    return colors[rating] || colors.C;
  };

  const getRatingLabel = (rating: string) => {
    const labels: { [key: string]: string } = {
      A: 'EXCELLENT',
      B: 'GOOD',
      C: 'AVERAGE',
      D: 'POOR',
      F: 'VERY POOR',
    };
    return labels[rating] || 'AVERAGE';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <p className="text-2xl font-black text-orange-900">ANALYZING YOUR RECEIPT...</p>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-black text-orange-900 mb-4">OOPS!</h1>
          <p className="text-lg text-gray-700 mb-6">{error || 'Something went wrong'}</p>
          <Link href="/upload">
            <button className="px-8 py-4 bg-orange-600 text-white font-black border-4 border-orange-900 shadow-lg hover:shadow-md transition">
              TRY AGAIN
            </button>
          </Link>
        </div>
      </main>
    );
  }

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
          <div className="flex gap-4">
            <Link 
              href="/upload"
              className="px-4 py-2 bg-orange-600 text-white font-bold border-2 border-orange-900 hover:bg-orange-700 transition"
            >
              NEW SCAN
            </Link>
          </div>
        </nav>
      </div>

      {/* Results Content */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Overall Score Card */}
          <div className="mb-12 text-center">
            <div className="inline-block mb-4 px-6 py-2 bg-orange-500 text-white font-black text-sm tracking-widest rotate-[-1deg] shadow-lg border-4 border-orange-700">
              ANALYSIS COMPLETE
            </div>
            
            <div className={`inline-block p-12 bg-gradient-to-br ${getRatingColor(analysis.overallRating)} border-8 border-orange-900 rounded-2xl shadow-[12px_12px_0px_0px_rgba(124,45,18,1)]`}>
              <div className="text-8xl font-black text-orange-900 mb-4">
                {analysis.overallRating}
              </div>
              <div className="text-2xl font-black text-orange-900">
                {getRatingLabel(analysis.overallRating)} ECO SCORE
              </div>
            </div>
          </div>

          {/* Total Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white border-4 border-orange-900 rounded-xl shadow-lg">
              <div className="text-4xl mb-3">🌍</div>
              <div className="text-3xl font-black text-orange-900 mb-2">
                {analysis.totals.carbonFootprint.toFixed(1)} kg
              </div>
              <div className="text-sm font-bold text-gray-700">CARBON FOOTPRINT</div>
              <div className="text-xs text-gray-600 mt-2">
                ≈ Driving {(analysis.totals.carbonFootprint * 4).toFixed(0)} km
              </div>
            </div>

            <div className="p-6 bg-white border-4 border-orange-900 rounded-xl shadow-lg">
              <div className="text-4xl mb-3">💧</div>
              <div className="text-3xl font-black text-orange-900 mb-2">
                {analysis.totals.waterUsage.toFixed(0)} L
              </div>
              <div className="text-sm font-bold text-gray-700">WATER USAGE</div>
              <div className="text-xs text-gray-600 mt-2">
                ≈ {(analysis.totals.waterUsage / 10).toFixed(0)} shower minutes
              </div>
            </div>

            <div className="p-6 bg-white border-4 border-orange-900 rounded-xl shadow-lg">
              <div className="text-4xl mb-3">📦</div>
              <div className="text-3xl font-black text-orange-900 mb-2">
                {analysis.totals.packagingWaste.toFixed(0)} g
              </div>
              <div className="text-sm font-bold text-gray-700">PACKAGING WASTE</div>
              <div className="text-xs text-gray-600 mt-2">
                ≈ {(analysis.totals.packagingWaste / 500).toFixed(1)} plastic bottles
              </div>
            </div>
          </div>

          {/* Item Breakdown */}
          <div className="mb-12">
            <h2 className="text-4xl font-black text-orange-900 mb-6 text-center"
                style={{textShadow: '3px 3px 0px #fed7aa'}}>
              ITEM BREAKDOWN
            </h2>

            <div className="space-y-4">
              {analysis.items.map((item, index) => (
                <div key={index} className="bg-white border-4 border-orange-900 rounded-xl overflow-hidden shadow-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-orange-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-semibold">
                          Qty: {item.quantity} • ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className={`px-4 py-2 bg-gradient-to-br ${getRatingColor(item.ecoRating)} border-4 border-orange-900 rounded-lg`}>
                        <div className="text-2xl font-black text-orange-900">{item.ecoRating}</div>
                      </div>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-yellow-50 border-2 border-orange-900 rounded-lg">
                        <div className="text-lg font-black text-orange-900">
                          {item.carbonFootprint.toFixed(1)}
                        </div>
                        <div className="text-xs font-bold text-gray-600">kg CO₂</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 border-2 border-orange-900 rounded-lg">
                        <div className="text-lg font-black text-orange-900">
                          {item.waterUsage.toFixed(0)}
                        </div>
                        <div className="text-xs font-bold text-gray-600">L H₂O</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 border-2 border-orange-900 rounded-lg">
                        <div className="text-lg font-black text-orange-900">
                          {item.packagingWaste.toFixed(0)}
                        </div>
                        <div className="text-xs font-bold text-gray-600">g waste</div>
                      </div>
                    </div>

                    {/* Alternatives */}
                    {item.alternatives && item.alternatives.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-green-100 to-lime-100 border-4 border-orange-900 rounded-lg">
                        <p className="text-sm font-black text-orange-900 mb-2">
                          🌱 ECO ALTERNATIVES:
                        </p>
                        <ul className="text-sm text-gray-700 font-semibold space-y-1">
                          {item.alternatives.map((alt, i) => (
                            <li key={i}>• {alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/upload">
              <button className="w-full md:w-auto px-8 py-4 bg-green-600 text-white text-lg font-black border-4 border-orange-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:shadow-[2px_2px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150">
                📸 SCAN ANOTHER RECEIPT
              </button>
            </Link>
            <button 
              onClick={() => window.print()}
              className="w-full md:w-auto px-8 py-4 bg-orange-600 text-white text-lg font-black border-4 border-orange-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:shadow-[2px_2px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
            >
              🖨️ SAVE REPORT
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}