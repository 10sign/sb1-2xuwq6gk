import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { X, Upload, Loader, FileText, Camera, Search } from 'lucide-react';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (lotNumber: string, documentUrl: string) => void;
}

export default function DocumentScannerModal({ 
  isOpen, 
  onClose, 
  onScanComplete 
}: DocumentScannerModalProps) {
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const extractLotNumber = (text: string): string | null => {
    // Look for patterns like LOT-YYYY-XXX or similar
    const lotPattern = /LOT[-]?\d{4}[-]?\d{3}/i;
    const match = text.match(lotPattern);
    return match ? match[0] : null;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      toast.error('Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const takePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      await handleScan(file);
      stopCamera();
    }, 'image/jpeg');
  };

  const handleScan = async (file: File) => {
    setScanning(true);
    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      // Perform OCR
      const worker = await createWorker('fra');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Extract lot number
      const lotNumber = extractLotNumber(text);
      if (!lotNumber) {
        throw new Error('Aucun numéro de lot trouvé dans le document');
      }

      onScanComplete(lotNumber, downloadUrl);
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      toast.error('Erreur lors du scan du document');
    } finally {
      setScanning(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleScan(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Scanner un document</h2>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {showCamera ? (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl"
              />
              <div className="flex justify-center space-x-4">
                <button
                  onClick={takePhoto}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Prendre la photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={startCamera}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Prendre une photo
                </button>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  {scanning ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                      <p className="text-sm text-gray-600">Analyse du document en cours...</p>
                    </div>
                  ) : preview ? (
                    <div className="space-y-4">
                      <FileText className="h-12 w-12 text-blue-500 mx-auto" />
                      <p className="text-sm text-gray-600">Document chargé</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
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

              {preview && (
                <img 
                  src={preview} 
                  alt="Aperçu du document" 
                  className="max-h-48 mx-auto rounded-lg"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}