import React, { useState } from 'react';
import { X, Calendar, Package, User, Thermometer, Clock, Save, AlertCircle } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ProductionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  production: {
    id: string;
    lotNumber: string;
    productionDate: Date;
    quantity: number;
    unit: string;
    operatorName: string;
    cookingTemperature: number;
    cookingTime: number;
  };
  onSave: (productionId: string, updates: any) => Promise<void>;
}

export default function ProductionEditModal({
  isOpen,
  onClose,
  production,
  onSave
}: ProductionEditModalProps) {
  // Ensure we have a valid date, fallback to current date if invalid
  const getValidDate = (date: Date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    return new Date();
  };

  const [formData, setFormData] = useState({
    productionDate: format(getValidDate(production.productionDate), 'yyyy-MM-dd'),
    quantity: production.quantity,
    operatorName: production.operatorName,
    cookingTemperature: production.cookingTemperature,
    cookingTime: production.cookingTime
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    if (formData.quantity <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return false;
    }
    if (formData.cookingTemperature <= 0) {
      toast.error('La température de cuisson doit être supérieure à 0');
      return false;
    }
    if (formData.cookingTime <= 0) {
      toast.error('Le temps de cuisson doit être supérieur à 0');
      return false;
    }
    if (!formData.operatorName.trim()) {
      toast.error('Le nom de l\'opérateur est requis');
      return false;
    }

    const date = parseISO(formData.productionDate);
    if (!isValid(date)) {
      toast.error('La date de production est invalide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const date = parseISO(formData.productionDate);
      
      await onSave(production.id, {
        dateProduction: date,
        quantity: formData.quantity,
        operatorName: formData.operatorName,
        cookingTemperature: formData.cookingTemperature,
        cookingTime: formData.cookingTime,
      });
      
      toast.success('Production mise à jour avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la production');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Modifier la production</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="font-medium">Lot n° {production.lotNumber}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block h-5 w-5 mr-2" />
              Date de production
            </label>
            <input
              type="date"
              value={formData.productionDate}
              onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="inline-block h-5 w-5 mr-2" />
              Quantité produite
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500">{production.unit}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline-block h-5 w-5 mr-2" />
              Opérateur responsable
            </label>
            <input
              type="text"
              value={formData.operatorName}
              onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="inline-block h-5 w-5 mr-2" />
              Température de production (°C)
            </label>
            <input
              type="number"
              value={formData.cookingTemperature}
              onChange={(e) => setFormData({ ...formData, cookingTemperature: parseFloat(e.target.value) })}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline-block h-5 w-5 mr-2" />
              Temps de cuisson (minutes)
            </label>
            <input
              type="number"
              value={formData.cookingTime}
              onChange={(e) => setFormData({ ...formData, cookingTime: parseFloat(e.target.value) })}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}