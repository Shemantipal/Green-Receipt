'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export default function FilePreview({ 
  file, 
  onRemove, 
  onAnalyze, 
  isAnalyzing = false 
}: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'document'>('document');

  useEffect(() => {
    // Determine file type
    const type = file.type;
    if (type.startsWith('image/')) {
      setFileType('image');
      // Create preview for images
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (type === 'application/pdf') {
      setFileType('pdf');
    } else {
      setFileType('document');
    }

    // Cleanup
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon based on type
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return '🖼️';
      case 'pdf':
        return '📄';
      case 'document':
        return '📝';
      default:
        return '📎';
    }
  };

  return (
    <div className="bg-white border-4 border-orange-900 rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(124,45,18,1)]">
      {/* Preview Area */}
      <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-8 border-b-4 border-orange-900">
        {fileType === 'image' && preview ? (
          <div className="relative w-full aspect-video bg-white border-4 border-orange-900 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white border-4 border-orange-900 rounded-lg">
            <div className="text-8xl mb-4">{getFileIcon()}</div>
            <p className="text-xl font-black text-orange-900 mb-2">
              {file.name}
            </p>
            <p className="text-sm font-bold text-gray-600">
              {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
            </p>
          </div>
        )}
      </div>

      {/* File Info & Actions */}
      <div className="p-6 space-y-4">
        {/* File Details */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-yellow-50 border-4 border-orange-900 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-black text-orange-900 mb-1">
              {formatFileSize(file.size)}
            </div>
            <div className="text-xs font-bold text-gray-600">FILE SIZE</div>
          </div>
          <div className="text-center border-x-2 border-orange-900">
            <div className="text-2xl font-black text-orange-900 mb-1">
              {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
            </div>
            <div className="text-xs font-bold text-gray-600">FORMAT</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-orange-900 mb-1">
              {fileType === 'image' ? '✓' : '○'}
            </div>
            <div className="text-xs font-bold text-gray-600">PREVIEW</div>
          </div>
        </div>

        {/* File Name (truncated if long) */}
        <div className="p-3 bg-amber-50 border-2 border-orange-900 rounded-lg">
          <p className="text-sm font-bold text-gray-600 mb-1">FILENAME:</p>
          <p className="text-base font-black text-orange-900 truncate" title={file.name}>
            {file.name}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="flex-1 px-6 py-4 bg-green-600 text-white text-lg font-black border-4 border-orange-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:shadow-[2px_2px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                ANALYZING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🌱 ANALYZE RECEIPT
              </span>
            )}
          </button>
          
          <button
            onClick={onRemove}
            disabled={isAnalyzing}
            className="px-6 py-4 bg-red-500 text-white text-lg font-black border-4 border-orange-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:shadow-[2px_2px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🗑️
          </button>
        </div>

        {/* Tips Section */}
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-lime-100 border-4 border-orange-900 rounded-lg">
          <p className="text-xs font-bold text-orange-900 mb-2 flex items-center gap-2">
            💡 TIPS FOR BEST RESULTS:
          </p>
          <ul className="text-xs font-semibold text-gray-700 space-y-1">
            <li>• Ensure receipt text is clear and readable</li>
            <li>• Avoid shadows or glare on the image</li>
            <li>• Keep the entire receipt within frame</li>
          </ul>
        </div>
      </div>
    </div>
  );
}