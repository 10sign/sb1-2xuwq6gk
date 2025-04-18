import React, { useState } from 'react';
import { X, Package, Calendar, Truck, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Batch } from '../hooks/useBatches';
import QRCode from 'qrcode.react';

interface BatchSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: Batch[];
  onSelect: (selectedBatches: Batch[]) => void;
  multiSelect?: boolean;
}

export default function BatchSelectionModal({
  isOpen,
  onClose,
  batches,
  onSelect,
  multiSelect = false
}: BatchSelectionModalProps) {
  const [selectedBatches, setSelectedBatches] = useState<Batch[]>([]);
  const [selectedBatchForDetails, setSelectedBatchForDetails] = useState<Batch | null>(null);

  if (!isOpen) return null;

  const handleBatchSelect = (batch: Batch) => {
    if (multiSelect) {
      const isSelected = selectedBatches.some(b => b.id === batch.id);
      if (isSelected) {
        setSelectedBatches(selectedBatches.filter(b => b.id !== batch.id));
      } else {
        setSelectedBatches([...selectedBatches, batch]);
      }
    } else {
      setSelectedBatches([batch]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedBatches);
    onClose();
  };

  const BatchDetails = ({ batch }: { batch: Batch }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Détails du lot</h3>
          <button
            onClick={() => setSelectedBatchForDetails(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <QRCode
                value={JSON.stringify({
                  id: batch.id,
                  lotNumber: batch.lotNumber,
                  supplier: batch.supplier,
                  rawMaterial: batch.rawMaterial,
                  quantity: batch.quantity,
                  unit: batch.unit,
                  receptionDate: batch.receptionDate,
                  expiryDate: batch.expiryDate
                })}
                size={200}
                level="H"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Numéro de lot</p>
              <p className="font-medium">{batch.lotNumber}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Fournisseur</p>
              <p className="font-medium">{batch.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Matière première</p>
              <p className="font-medium">{batch.rawMaterial}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantité disponible</p>
              <p className="font-medium">{batch.quantity} {batch.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de réception</p>
              <p className="font-medium">
                {format(new Date(batch.receptionDate), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            {batch.expiryDate && (
              <div>
                <p className="text-sm text-gray-500">Date de péremption</p>
                <p className="font-medium">
                  {format(new Date(batch.expiryDate), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setSelectedBatchForDetails(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {multiSelect ? 'Sélectionner des lots' : 'Sélectionner un lot'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {batches.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
              <p className="text-gray-600">Aucun lot disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedBatches.some(b => b.id === batch.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleBatchSelect(batch)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{batch.lotNumber}</p>
                        <p className="text-sm text-gray-500">{batch.rawMaterial}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{batch.quantity} {batch.unit}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(batch.receptionDate), 'dd/MM/yyyy', { locale: fr })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBatchForDetails(batch);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        <Info className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedBatches.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmer la sélection
          </button>
        </div>

        {selectedBatchForDetails && (
          <BatchDetails batch={selectedBatchForDetails} />
        )}
      </div>
    </div>
  );
}