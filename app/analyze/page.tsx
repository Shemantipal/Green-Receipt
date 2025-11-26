'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      
      // Create preview for images only
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === 'application/pdf') {
        setPreview(null); // No preview for PDFs
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, file.type);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to analyze receipt');
      }

      if (result.success && result.data) {
        console.log('Analysis successful:', result.id);
        
        // CRITICAL: Store the analysis data in sessionStorage BEFORE navigating
        sessionStorage.setItem(`analysis_${result.id}`, JSON.stringify(result.data));
        
        // Add a small delay to ensure storage completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Navigate to analysis page
        router.push(`/analyze?id=${result.id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload and analyze receipt');
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
      
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
        </nav>
      </div>

      {/* Upload Content */}
      <div className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-orange-900 mb-4"
                style={{textShadow: '4px 4px 0px #fed7aa'}}>
              UPLOAD YOUR RECEIPT
            </h1>
            <p className="text-lg text-gray-700 font-semibold">
              📸 Take a photo or upload a PDF to see your environmental impact!
            </p>
          </div>

          {/* Upload Area */}
          <div 
            className="bg-white border-8 border-dashed border-orange-900 rounded-2xl p-12 text-center mb-6 hover:bg-yellow-50 transition cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            {preview ? (
              <div className="mb-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg border-4 border-orange-900" />
              </div>
            ) : file?.type === 'application/pdf' ? (
              <div className="mb-4">
                <div className="text-6xl mb-2">📄</div>
                <p className="font-bold text-orange-900">{file.name}</p>
              </div>
            ) : (
              <div className="text-6xl mb-4">📸</div>
            )}
            
            <input
              id="fileInput"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <p className="text-xl font-black text-orange-900 mb-2">
              {file ? 'FILE SELECTED' : 'CLICK OR DROP FILE HERE'}
            </p>
            <p className="text-sm text-gray-600 font-semibold">
              Accepts: JPG, PNG, WebP, PDF
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-4 border-red-600 rounded-lg p-4 mb-6">
              <p className="text-red-900 font-bold">⚠️ {error}</p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-6 text-2xl font-black rounded-xl border-4 transition-all duration-150 ${
              !file || uploading
                ? 'bg-gray-300 border-gray-500 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 border-orange-900 text-white shadow-[6px_6px_0px_0px_rgba(124,45,18,1)] hover:shadow-[3px_3px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[3px] hover:translate-y-[3px]'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="animate-spin">🔄</span>
                ANALYZING...
              </span>
            ) : (
              '🌱 ANALYZE RECEIPT'
            )}
          </button>

          {/* Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-lime-100 border-4 border-orange-900 rounded-xl">
            <p className="text-sm font-bold text-gray-700">
              💡 <strong>TIP:</strong> Make sure your receipt is clear and readable. 
              We'll calculate the carbon footprint, water usage, and packaging waste 
              of each item and suggest eco-friendly alternatives!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}