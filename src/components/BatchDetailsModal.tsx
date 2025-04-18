import React from 'react';
import { X, Package, Calendar, Truck, CheckCircle2, XCircle, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import QRCode from 'qrcode.react';
import { BatchQRData, generateBatchQRData } from '../utils/qrcode';

interface BatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: {
    id: string;
    lotNumber: string;
    receptionDate: string;
    supplier: string;
    quantity: string;
    unit: string;
    rawMaterial: string;
    expiryDate?: string;
    orderNumber?: string;
    qualityStatus?: 'approved' | 'pending' | 'rejected';
    storageLocation?: string;
    documentUrl?: string;
    status?: string;
    validated?: boolean;
  };
}

export default function BatchDetailsModal({ isOpen, onClose, batch }: BatchDetailsModalProps) {
  if (!isOpen) return null;

  const qrData: BatchQRData = {
    id: batch.id,
    lotNumber: batch.lotNumber,
    supplier: batch.supplier,
    rawMaterial: batch.rawMaterial,
    quantity: batch.quantity,
    unit: batch.unit,
    receptionDate: batch.receptionDate,
    expiryDate: batch.expiryDate,
    status: batch.status,
    validated: batch.validated
  };

  const qrCodeData = generateBatchQRData(qrData);

  const getQualityStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Approuvé</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2 text-red-700 bg-red-50 px-3 py-1 rounded-full">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Rejeté</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">En attente</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Détails du lot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex justify-center items-center bg-gray-50 p-6 rounded-xl">
            <QRCode
              value={qrCodeData}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">Numéro de lot</span>
              </div>
              <p className="text-lg font-semibold">{batch.lotNumber}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">Date de réception</span>
              </div>
              <p className="text-lg">{format(new Date(batch.receptionDate), 'dd MMMM yyyy', { locale: fr })}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Truck className="h-5 w-5" />
                <span className="text-sm font-medium">Fournisseur</span>
              </div>
              <p className="text-lg">{batch.supplier}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">Quantité</span>
              </div>
              <p className="text-lg">{batch.quantity} {batch.unit}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Informations supplémentaires</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Date de péremption:</span>
                <p className="font-medium">
                  {batch.expiryDate 
                    ? format(new Date(batch.expiryDate), 'dd MMMM yyyy', { locale: fr })
                    : 'Non spécifiée'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Numéro de commande:</span>
                <p className="font-medium">{batch.orderNumber || 'Non spécifié'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Statut qualité:</span>
                <div className="mt-1">
                  {getQualityStatusBadge(batch.qualityStatus)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Localisation et Documents</h3>
            <div className="space-y-2">
              <div>
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Emplacement de stockage:</span>
                </div>
                <p className="font-medium">{batch.storageLocation || 'Non spécifié'}</p>
              </div>
              {batch.documentUrl && (
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Document associé:</span>
                  </div>
                  <a
                    href={batch.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center space-x-1"
                  >
                    <span>Voir le document</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}