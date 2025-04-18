import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Calendar, Truck, Search, Plus, QrCode, Edit, CheckCircle2, XCircle } from 'lucide-react';
import BatchModal, { BatchFormData } from '../components/BatchModal';
import BatchDetailsModal from '../components/BatchDetailsModal';
import BatchEditModal from '../components/BatchEditModal';
import DocumentScannerModal from '../components/DocumentScannerModal';
import QRScannerModal from '../components/QRScannerModal';
import { useBatches } from '../hooks/useBatches';
import { useAuth } from '../contexts/AuthContext';
import { generateBatchQRData } from '../utils/qrcode';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';

export default function Reception() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { batches, loading, createBatch, updateBatch, deleteBatch, validateBatch } = useBatches();

  const isAdmin = user?.role === 'responsable_production';

  const handleBatchSubmit = async (batchData: BatchFormData) => {
    try {
      await createBatch(batchData);
      setIsModalOpen(false);
      toast.success('Lot créé avec succès');
    } catch (error) {
      console.error('Error submitting batch:', error);
      toast.error('Erreur lors de la création du lot');
    }
  };

  const handleScanComplete = (lotNumber: string, documentUrl: string) => {
    console.log('Scanned lot number:', lotNumber);
    console.log('Document URL:', documentUrl);
    toast.success('Document scanné avec succès');
    setIsScannerOpen(false);
    setIsModalOpen(true);
  };

  const handleBatchClick = (batch: any) => {
    setSelectedBatch({
      ...batch,
      qualityStatus: batch.validated ? 'approved' : 'pending'
    });
  };

  const handleValidation = async (batchId: string, validated: boolean) => {
    try {
      await validateBatch(batchId, validated);
      toast.success(validated ? 'Lot validé avec succès' : 'Lot marqué comme non validé');
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error('Erreur lors de la validation du lot');
    }
  };

  const handleEditClick = (e: React.MouseEvent, batch: any) => {
    e.stopPropagation();
    setEditingBatch(batch);
  };

  const getValidationStatus = (batch: any) => {
    if (batch.validated === true) {
      return (
        <div className="flex items-center space-x-1 text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Validé</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
        <XCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Non validé</span>
      </div>
    );
  };

  const filteredBatches = batches.filter(batch => 
    batch.lotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.rawMaterial?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Responsive Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un lot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex flex-row gap-2 sm:gap-4">
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <QrCode className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Scanner QR</span>
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <QrCode className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Scanner Document</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Nouveau lot</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des lots...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 sm:w-24">
                      <span className="sr-only">QR Code</span>
                      <QrCode className="h-4 w-4" />
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lot
                    </th>
                    <th scope="col" className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matière
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qté
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réception
                    </th>
                    <th scope="col" className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Péremption
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Validation
                    </th>
                    {isAdmin && (
                      <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBatches.map((batch) => {
                    const qrData = generateBatchQRData({
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
                    });

                    return (
                      <tr key={batch.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center cursor-pointer" onClick={() => handleBatchClick(batch)}>
                            <QRCode value={qrData} size={32} className="sm:hidden" />
                            <QRCode value={qrData} size={48} className="hidden sm:block" />
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-2 hidden sm:block" />
                            <span className="font-medium text-gray-900">{batch.lotNumber}</span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Truck className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-500">{batch.supplier}</span>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-gray-500">
                          {batch.rawMaterial}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-500">
                          <span className="font-medium">{batch.quantity}</span>
                          <span className="text-gray-400 ml-1">{batch.unit}</span>
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-500">
                              {format(new Date(batch.receptionDate), 'dd/MM/yyyy', { locale: fr })}
                            </span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-500">
                              {batch.expiryDate ? format(new Date(batch.expiryDate), 'dd/MM/yyyy', { locale: fr }) : '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getValidationStatus(batch)}
                            {isAdmin && batch.status !== 'utilisé' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleValidation(batch.id, true)}
                                  className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                                  title="Valider le lot"
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleValidation(batch.id, false)}
                                  className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                                  title="Invalider le lot"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        {isAdmin && (
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={(e) => handleEditClick(e, batch)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                              disabled={batch.status === 'utilisé'}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {filteredBatches.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 9 : 8} className="px-3 sm:px-6 py-4 text-center text-gray-500">
                        Aucun lot trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBatchSubmit}
      />

      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      {selectedBatch && (
        <BatchDetailsModal
          isOpen={true}
          onClose={() => setSelectedBatch(null)}
          batch={selectedBatch}
        />
      )}

      {editingBatch && (
        <BatchEditModal
          isOpen={true}
          onClose={() => setEditingBatch(null)}
          batch={editingBatch}
          onSave={updateBatch}
          onDelete={deleteBatch}
        />
      )}
    </div>
  );
}