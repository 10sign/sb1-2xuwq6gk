import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BatchQRData } from '../utils/qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const [scannedData, setScannedData] = useState<BatchQRData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText) as BatchQRData;
            setScannedData(data);
            if (scannerRef.current) {
              scannerRef.current.pause();
            }
          } catch (err) {
            setError('Format de QR code non valide');
          }
        },
        (errorMessage) => {
          console.error('QR Scan error:', errorMessage);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      setScannedData(null);
      setError(null);
    };
  }, [isOpen]);

  const handleViewInApp = () => {
    if (scannedData) {
      const encodedData = encodeURIComponent(JSON.stringify(scannedData));
      navigate(`/lot/${encodedData}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Scanner un QR code</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error ? (
            <div className="text-center p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  if (scannerRef.current) {
                    scannerRef.current.resume();
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          ) : scannedData ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-4">Informations du lot</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Numéro de lot:</span> {scannedData.lotNumber}</p>
                  <p><span className="font-medium">Fournisseur:</span> {scannedData.supplier}</p>
                  <p><span className="font-medium">Matière première:</span> {scannedData.rawMaterial}</p>
                  <p><span className="font-medium">Quantité:</span> {scannedData.quantity} {scannedData.unit}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setScannedData(null);
                    if (scannerRef.current) {
                      scannerRef.current.resume();
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Scanner un autre lot
                </button>
                <button
                  onClick={handleViewInApp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Voir dans l'application
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div id="qr-reader" className="mb-4"></div>
              <p className="text-sm text-gray-500 text-center">
                Placez le QR code dans la zone de scan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}