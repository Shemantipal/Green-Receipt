'use client';

import { useCallback } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (validTypes.includes(droppedFile.type)) {
        onFileSelect(droppedFile);
      } else {
        alert('Please upload a valid file: PDF, JPG, PNG, or DOCX');
      }
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-8 border-dashed border-orange-900 bg-yellow-100 p-16 text-center rounded-xl hover:bg-yellow-200 transition cursor-pointer"
      >
        <div className="text-6xl mb-4">📄</div>
        <p className="text-2xl font-black text-orange-900 mb-2">
          DROP YOUR RECEIPT HERE
        </p>
        <p className="text-gray-700 font-semibold mb-4">
          or click to browse (PDF, JPG, PNG, DOCX)
        </p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="inline-block px-8 py-3 bg-orange-600 text-white font-bold border-4 border-orange-900 cursor-pointer hover:bg-orange-700 transition shadow-[4px_4px_0px_0px_rgba(124,45,18,1)] hover:shadow-[2px_2px_0px_0px_rgba(124,45,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] duration-150"
        >
          BROWSE FILES
        </label>
      </div>

      {/* Tips Section */}
      <div className="p-6 bg-gradient-to-r from-green-100 to-lime-100 border-4 border-orange-900 rounded-xl">
        <p className="text-sm font-bold text-orange-900 mb-3 flex items-center gap-2">
          💡 TIPS FOR BEST RESULTS:
        </p>
        <ul className="text-sm font-semibold text-gray-700 space-y-2">
          <li>✓ Ensure receipt text is clear and readable</li>
          <li>✓ Avoid shadows or glare on the image</li>
          <li>✓ Keep the entire receipt within frame</li>
          <li>✓ Supported formats: PDF, JPG, PNG, DOCX</li>
        </ul>
      </div>

      {/* Example Receipts */}
      <div className="p-6 bg-white border-4 border-orange-900 rounded-xl">
        <p className="text-sm font-bold text-orange-900 mb-3">
          📸 EXAMPLE RECEIPTS:
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 border-2 border-orange-900 rounded-lg">
            <div className="text-3xl mb-2">🛒</div>
            <p className="text-xs font-bold text-gray-700">Grocery Store</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 border-2 border-orange-900 rounded-lg">
            <div className="text-3xl mb-2">👕</div>
            <p className="text-xs font-bold text-gray-700">Clothing</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 border-2 border-orange-900 rounded-lg">
            <div className="text-3xl mb-2">🍕</div>
            <p className="text-xs font-bold text-gray-700">Restaurant</p>
          </div>
        </div>
      </div>
    </div>
  );
}