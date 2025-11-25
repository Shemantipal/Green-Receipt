import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50 text-gray-900">
      
      {/* Retro Header with Pattern */}
      <div className="bg-yellow-400 border-b-8 border-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)'
          }}></div>
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-black text-orange-900">GREEN RECEIPT</Link>
          <div className="hidden md:flex gap-6 font-bold text-orange-900">
            <a href="#features" className="hover:text-orange-700 transition">Features</a>
            <a href="#how" className="hover:text-orange-700 transition">How It Works</a>
            <a href="#impact" className="hover:text-orange-700 transition">Impact</a>
          </div>
        </nav>
      </div>

      {/* Hero Section with Retro Vibes */}
      <section className="relative pt-20 pb-24 px-6 text-center overflow-hidden">
        {/* Retro Sun Rays Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px]"
               style={{
                 background: 'repeating-conic-gradient(from 0deg, #fbbf24 0deg 10deg, #fcd34d 10deg 20deg)'
               }}>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Retro Badge */}
          <div className="inline-block mb-6 px-6 py-2 bg-orange-500 text-white font-black text-sm tracking-widest rotate-[-2deg] shadow-lg border-4 border-orange-700">
            EST. 2025 • ECO REVOLUTION
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-orange-900 mb-6 tracking-tight leading-none"
              style={{
                textShadow: '4px 4px 0px #fed7aa, 8px 8px 0px #fdba74'
              }}>
            GREEN<br/>RECEIPT
          </h1>
          
          <p className="text-2xl md:text-3xl font-bold text-orange-800 mb-4">
            Shop Smarter. Live Greener.
          </p>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your shopping receipts and instantly discover their environmental impact — 
            carbon footprint, water usage, packaging waste & sustainability ratings.
          </p>

          {/* CTA Button with Retro Style - LINKED TO UPLOAD PAGE */}
          <Link href="/upload">
            <button className="group relative px-10 py-5 bg-orange-600 text-white text-xl font-black tracking-wide border-4 border-orange-900 shadow-[6px_6px_0px_0px_rgba(124,45,18,1)] hover:shadow-[3px_3px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150">
              <span className="flex items-center gap-3">
                📸 UPLOAD RECEIPT
                <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </Link>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-bold text-orange-800">
            <div className="flex items-center gap-2">✓ 100% Free</div>
            <div className="flex items-center gap-2">✓ Instant Analysis</div>
            <div className="flex items-center gap-2">✓ Privacy First</div>
          </div>
        </div>
      </section>

      {/* Feature Cards with Retro Design */}
      <section id="features" className="px-6 pb-20 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center text-orange-900 mb-16"
            style={{textShadow: '3px 3px 0px #fed7aa'}}>
          WHAT WE TRACK
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="group p-8 bg-gradient-to-br from-yellow-300 to-yellow-400 border-4 border-orange-900 shadow-[8px_8px_0px_0px_rgba(124,45,18,1)] hover:shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-2xl font-black text-orange-900 mb-3">CARBON FOOTPRINT</h3>
            <p className="text-gray-800 font-semibold">
              See the CO₂ emissions for every product on your receipt.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 bg-gradient-to-br from-blue-300 to-blue-400 border-4 border-orange-900 shadow-[8px_8px_0px_0px_rgba(124,45,18,1)] hover:shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-2xl font-black text-orange-900 mb-3">WATER USAGE</h3>
            <p className="text-gray-800 font-semibold">
              Understand water consumption across product lifecycles.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 bg-gradient-to-br from-green-300 to-green-400 border-4 border-orange-900 shadow-[8px_8px_0px_0px_rgba(124,45,18,1)] hover:shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-2xl font-black text-orange-900 mb-3">PACKAGING WASTE</h3>
            <p className="text-gray-800 font-semibold">
              Track plastic, paper, and recyclable materials used.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group p-8 bg-gradient-to-br from-orange-300 to-orange-400 border-4 border-orange-900 shadow-[8px_8px_0px_0px_rgba(124,45,18,1)] hover:shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-2xl font-black text-orange-900 mb-3">ECO RATING</h3>
            <p className="text-gray-800 font-semibold">
              Get A-F sustainability scores plus eco-friendly alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-6 py-20 bg-gradient-to-b from-orange-100 to-yellow-200 border-y-8 border-orange-600">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center text-orange-900 mb-16"
              style={{textShadow: '3px 3px 0px #fed7aa'}}>
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center">
              <div className="inline-block mb-6 w-20 h-20 bg-yellow-400 border-4 border-orange-900 rounded-full flex items-center justify-center text-3xl font-black text-orange-900 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-black text-orange-900 mb-3">SNAP & UPLOAD</h3>
              <p className="text-gray-800 font-semibold">
                Take a photo of your receipt or manually enter items. Our OCR tech does the rest.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-block mb-6 w-20 h-20 bg-yellow-400 border-4 border-orange-900 rounded-full flex items-center justify-center text-3xl font-black text-orange-900 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-black text-orange-900 mb-3">INSTANT ANALYSIS</h3>
              <p className="text-gray-800 font-semibold">
                We analyze each product's environmental impact in seconds using our database.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-block mb-6 w-20 h-20 bg-yellow-400 border-4 border-orange-900 rounded-full flex items-center justify-center text-3xl font-black text-orange-900 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-black text-orange-900 mb-3">GET INSIGHTS</h3>
              <p className="text-gray-800 font-semibold">
                View your eco-report with actionable tips and greener alternatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-orange-900 mb-6"
              style={{textShadow: '3px 3px 0px #fed7aa'}}>
            MAKING AN IMPACT
          </h2>
          <p className="text-xl text-gray-700 mb-12 font-semibold">
            Join thousands making conscious shopping choices
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-yellow-300 border-4 border-orange-900 shadow-lg">
              <div className="text-5xl font-black text-orange-900 mb-2">50K+</div>
              <div className="text-lg font-bold text-gray-800">Receipts Scanned</div>
            </div>
            <div className="p-8 bg-yellow-300 border-4 border-orange-900 shadow-lg">
              <div className="text-5xl font-black text-orange-900 mb-2">2M kg</div>
              <div className="text-lg font-bold text-gray-800">CO₂ Awareness</div>
            </div>
            <div className="p-8 bg-yellow-300 border-4 border-orange-900 shadow-lg">
              <div className="text-5xl font-black text-orange-900 mb-2">10K+</div>
              <div className="text-lg font-bold text-gray-800">Eco-Swaps Made</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - LINKED TO UPLOAD PAGE */}
      <section className="px-6 py-20 bg-gradient-to-b from-yellow-400 to-orange-400 border-t-8 border-orange-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-orange-900 mb-6"
              style={{textShadow: '3px 3px 0px #fed7aa'}}>
            START TODAY
          </h2>
          <p className="text-xl text-gray-900 mb-10 font-bold">
            Every receipt tells a story. Make yours count for the planet.
          </p>
          <Link href="/upload">
            <button className="px-12 py-6 bg-orange-600 text-white text-2xl font-black border-4 border-orange-900 shadow-[8px_8px_0px_0px_rgba(124,45,18,1)] hover:shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150">
              📸 UPLOAD YOUR FIRST RECEIPT
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-yellow-100 px-6 py-12 border-t-8 border-yellow-400">
        <div className="text-center font-bold border-t-2 border-yellow-600 pt-6">
          © 2025 Green Receipt. Built with purpose by Shemanti 🌳
        </div>
      </footer>
    </main>
  );
}