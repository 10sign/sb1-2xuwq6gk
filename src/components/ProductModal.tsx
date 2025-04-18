import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductFormData) => void;
}

export interface ProductFormData {
  lotNumber: string;
  supplier: string;
  productName: string;
  quantity: string;
  expirationDate: string;
  storageUnit?: string;
}

export default function ProductModal({ isOpen, onClose, onSubmit }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    lotNumber: '',
    supplier: '',
    productName: '',
    quantity: '',
    expirationDate: '',
    storageUnit: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Créer un nouveau produit</h2>
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
            <input
              type="text"
              placeholder="Ex: VDC-2024-001"
              required
              className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.lotNumber}
              onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-base mb-2">
              Fournisseur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Fournisseur ABC"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-base mb-2">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Glace Vanille"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-base mb-2">
              Quantité <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Ex: 100"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-base mb-2">
              Date d'expiration <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
              <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-base mb-2">
              Numéro de cuve <span className="text-gray-500">(optionnel)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: CUVE-001"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.storageUnit}
              onChange={(e) => setFormData({ ...formData, storageUnit: e.target.value })}
            />
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