import React, { useState } from 'react';
import { X, Calendar, Package, AlertTriangle } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

interface BatchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: {
    id: string;
    lotNumber: string;
    supplier: string;
    rawMaterial: string;
    quantity: string;
    unit: string;
    receptionDate: string;
    expiryDate?: string;
    status: 'utilisé' | 'partiel' | 'périmé';
    notes?: string;
  };
  onSave: (batchId: string, updates: any) => Promise<void>;
  onDelete: (batchId: string) => Promise<void>;
}

export default function BatchEditModal({ isOpen, onClose, batch, onSave, onDelete }: BatchEditModalProps) {
  const [formData, setFormData] = useState({
    lotNumber: batch.lotNumber,
    supplier: batch.supplier,
    rawMaterial: batch.rawMaterial,
    quantity: batch.quantity,
    unit: batch.unit,
    receptionDate: format(new Date(batch.receptionDate), 'yyyy-MM-dd'),
    expiryDate: batch.expiryDate ? format(new Date(batch.expiryDate), 'yyyy-MM-dd') : '',
    notes: batch.notes || '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!formData.lotNumber.trim()) {
      toast.error('Le numéro de lot est obligatoire');
      return false;
    }

    if (!formData.supplier.trim()) {
      toast.error('Le fournisseur est obligatoire');
      return false;
    }

    if (!formData.rawMaterial.trim()) {
      toast.error('La matière première est obligatoire');
      return false;
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return false;
    }

    if (!formData.receptionDate) {
      toast.error('La date de réception est obligatoire');
      return false;
    }

    if (!formData.expiryDate) {
      toast.error('La date de péremption est obligatoire');
      return false;
    }

    const receptionDate = parseISO(formData.receptionDate);
    const expiryDate = parseISO(formData.expiryDate);

    if (!isAfter(expiryDate, receptionDate)) {
      toast.error('La date de péremption doit être postérieure à la date de réception');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await onSave(batch.id, formData);
      toast.success('Lot mis à jour avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du lot:', error);
      toast.error('Erreur lors de la mise à jour du lot');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      await onDelete(batch.id);
      toast.success('Lot supprimé avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression du lot:', error);
      toast.error('Erreur lors de la suppression du lot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Modifier le lot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de lot <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lotNumber}
              onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fournisseur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du fournisseur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matière première <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.rawMaterial}
              onChange={(e) => setFormData({ ...formData, rawMaterial: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom de la matière première"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unité <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="L">Litres (L)</option>
                <option value="KG">Kilogrammes (KG)</option>
                <option value="U">Unités (U)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de réception <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.receptionDate}
                onChange={(e) => setFormData({ ...formData, receptionDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de péremption <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={batch.status === 'utilisé' || loading}
            >
              <Package className="h-5 w-5 mr-2" />
              Supprimer le lot
            </button>
            <div className="space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-bold text-center mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer ce lot ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}