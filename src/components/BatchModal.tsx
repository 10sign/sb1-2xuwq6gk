import React, { useState } from 'react';
import { X, Calendar, Package, Truck } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchData: BatchFormData) => void;
  suppliers?: string[];
  rawMaterials?: string[];
}

export interface BatchFormData {
  lotNumber: string;
  supplier: string;
  rawMaterial: string;
  quantity: string;
  unit: string;
  receptionDate: string;
  expiryDate: string;
}

const defaultSuppliers = [
  'Fournisseur A',
  'Fournisseur B',
  'Fournisseur C',
  'Autre'
];

const defaultRawMaterials = [
  'Lait entier',
  'Crème',
  'Sucre',
  'Fruits',
  'Autre'
];

export default function BatchModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  suppliers = defaultSuppliers,
  rawMaterials = defaultRawMaterials
}: BatchModalProps) {
  const [formData, setFormData] = useState<BatchFormData>({
    lotNumber: '',
    supplier: '',
    rawMaterial: '',
    quantity: '',
    unit: 'L',
    receptionDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [customSupplier, setCustomSupplier] = useState('');
  const [customRawMaterial, setCustomRawMaterial] = useState('');

  if (!isOpen) return null;

  const validateForm = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const finalFormData = {
      ...formData,
      supplier: formData.supplier === 'Autre' ? customSupplier : formData.supplier,
      rawMaterial: formData.rawMaterial === 'Autre' ? customRawMaterial : formData.rawMaterial
    };

    onSubmit(finalFormData);
    setShowQRCode(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Créer un nouveau lot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base mb-2">
              Numéro de lot <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: LOT-2024-001"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.lotNumber}
                onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
              />
              <Package className="absolute left-3 top-3.5 h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div>
            <label className="block text-base mb-2">
              Fournisseur <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
              <Truck className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {formData.supplier === 'Autre' && (
              <input
                type="text"
                placeholder="Nom du fournisseur"
                required
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customSupplier}
                onChange={(e) => setCustomSupplier(e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-base mb-2">
              Matière première <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.rawMaterial}
              onChange={(e) => setFormData({ ...formData, rawMaterial: e.target.value })}
            >
              <option value="">Sélectionner une matière première</option>
              {rawMaterials.map((material) => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
            {formData.rawMaterial === 'Autre' && (
              <input
                type="text"
                placeholder="Nom de la matière première"
                required
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customRawMaterial}
                onChange={(e) => setCustomRawMaterial(e.target.value)}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base mb-2">
                Quantité <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Ex: 500"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-base mb-2">
                Unité <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="L">Litres (L)</option>
                <option value="KG">Kilogrammes (KG)</option>
                <option value="U">Unités (U)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base mb-2">
              Date de réception <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.receptionDate}
                onChange={(e) => setFormData({ ...formData, receptionDate: e.target.value })}
              />
              <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-base mb-2">
              Date de péremption <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
              <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Champs obligatoires
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Créer le lot
          </button>
        </form>
      </div>
    </div>
  );
}