'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUploader from '@/components/upload/FileUploader';
import FilePreview from '@/components/upload/FilePreview';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const result = await response.json();
      
      sessionStorage.setItem(`analysis_${result.id}`, JSON.stringify(result.data));
      
      router.push(`/analyze?id=${result.id}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze receipt. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100">

      <div className="bg-yellow-400 border-b-8 border-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)'
          }}></div>
        </div>
        
        <nav className="relative z-10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-black text-orange-900">GREEN RECEIPT</Link>
          <Link 
            href="/"
            className="px-4 py-2 bg-orange-600 text-white font-bold border-2 border-orange-900 hover:bg-orange-700 transition"
          >
            ← BACK
          </Link>
        </nav>
      </div>

   
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
 
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-orange-500 text-white font-black text-sm tracking-widest rotate-[-1deg] shadow-lg border-4 border-orange-700">
              STEP 1 OF 2
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-orange-900 mb-4"
                style={{textShadow: '3px 3px 0px #fed7aa'}}>
              UPLOAD RECEIPT
            </h1>
            <p className="text-lg text-gray-700 font-semibold">
              Upload your receipt and discover its environmental impact
            </p>
          </div>

          
          {!file ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <FilePreview
              file={file}
              onRemove={handleRemove}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          )}

   
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-white text-orange-900 font-bold border-4 border-orange-900 rounded-lg hover:bg-yellow-100 transition shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:shadow-[2px_2px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] duration-150"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}