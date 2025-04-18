import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { Upload, Loader } from 'lucide-react';

interface OCRScannerProps {
  onResult: (text: string) => void;
}

export default function OCRScanner({ onResult }: OCRScannerProps) {
  const [scanning, setScanning] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setScanning(true);
    try {
      const worker = await createWorker('fra');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      onResult(text);
    } catch (error) {
      console.error('Erreur lors de la lecture du document:', error);
    } finally {
      setScanning(false);
    }
  }, [onResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.pdf']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        {scanning ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Analyse du document en cours...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600">
                Glissez-déposez un document ici, ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG ou PDF
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}