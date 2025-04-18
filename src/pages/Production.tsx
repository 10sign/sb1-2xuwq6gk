import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Calendar, Search, Plus, CheckCircle, Clock, PauseCircle, Users, QrCode, ChevronDown, Trash2, Edit, AlertTriangle, Thermometer } from 'lucide-react';
import ActionBar from '../components/ActionBar';
import ProductionForm from '../components/ProductionForm';
import ProductionPlanningModal from '../components/ProductionPlanningModal';
import ProductionEditModal from '../components/ProductionEditModal';
import ProductionStatusSelect from '../components/ProductionStatusSelect';
import { useProductions } from '../hooks/useProductions';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode.react';
import toast from 'react-hot-toast';
import type { ProductStatus } from '../types/firestore';

export default function Production() {
  const [showForm, setShowForm] = useState(false);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduction, setEditingProduction] = useState<any>(null);
  const [deletingProduction, setDeletingProduction] = useState<string | null>(null);
  const { productions, loading, deleteProduction, updateProduction, updateProductionStatus } = useProductions();
  const { user } = useAuth();

  const isAdmin = user?.role === 'responsable_production';

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDelete = async (productionId: string) => {
    setDeletingProduction(productionId);
  };

  const confirmDelete = async () => {
    if (!deletingProduction) return;
    
    try {
      const report = await deleteProduction(deletingProduction);
      if (report.error === 'lot_not_found') {
        toast.success('Production supprimée avec succès');
      } else {
        toast.success('Production supprimée avec succès');
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la production');
    } finally {
      setDeletingProduction(null);
    }
  };

  const handleEdit = (production: any) => {
    const productionWithValidDate = {
      ...production,
      productionDate: production.dateProduction instanceof Date ? 
        production.dateProduction : 
        new Date(production.dateProduction)
    };
    setEditingProduction(productionWithValidDate);
  };

  const handleUpdateProduction = async (productionId: string, updates: any) => {
    try {
      await updateProduction(productionId, updates);
      setEditingProduction(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  const handleStatusChange = async (productionId: string, newStatus: ProductStatus) => {
    try {
      await updateProductionStatus(productionId, newStatus);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const filteredProductions = productions.filter(production => 
    production.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'terminé':
        return (
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Terminé</span>
          </div>
        );
      case 'en_pause':
        return (
          <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
            <PauseCircle className="h-4 w-4" />
            <span className="text-sm font-medium">En pause</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">En cours</span>
          </div>
        );
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Date invalide';
      }
      return format(dateObj, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };

  return (
    <div className="space-y-6">
      <ActionBar 
        title="Production" 
        onSearch={handleSearch}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowPlanningModal(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Plan de production
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? 'Masquer le formulaire' : 'Nouvelle production'}
        </button>
      </div>

      {showForm && <ProductionForm />}

      <div className="bg-white shadow rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des productions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <QrCode className="h-4 w-4" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro de lot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opérateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paramètres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProductions.map((production) => (
                  <tr key={production.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <QRCode value={production.id} size={64} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <span className="font-medium text-gray-900">{production.lotNumber}</span>
                          {production.type === 'composite' && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Composé
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-500">
                          {formatDate(production.dateProduction)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {production.quantity} {production.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{production.operatorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Thermometer className="h-4 w-4" />
                        <span>{production.cookingTemperature}°C</span>
                        <span className="text-gray-300">|</span>
                        <Clock className="h-4 w-4" />
                        <span>{production.cookingTime} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAdmin ? (
                        <ProductionStatusSelect
                          currentStatus={production.status}
                          onStatusChange={(newStatus) => handleStatusChange(production.id, newStatus)}
                        />
                      ) : (
                        getStatusBadge(production.status)
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(production)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Modifier la production"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(production.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Supprimer la production"
                            disabled={production.status === 'terminé'}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredProductions.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} className="px-6 py-4 text-center text-gray-500">
                      Aucune production trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductionPlanningModal
        isOpen={showPlanningModal}
        onClose={() => setShowPlanningModal(false)}
      />

      {editingProduction && (
        <ProductionEditModal
          isOpen={true}
          onClose={() => setEditingProduction(null)}
          production={editingProduction}
          onSave={handleUpdateProduction}
        />
      )}

      {deletingProduction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer cette production ? Cette action est irréversible.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeletingProduction(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}