import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Calendar, Truck, CheckCircle2, XCircle, MapPin, ArrowLeft } from 'lucide-react';
import type { BatchQRData } from '../utils/qrcode';

export default function BatchDetails() {
  const navigate = useNavigate();
  const { data } = useParams();
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-gray-600">Aucune donnée de lot trouvée</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  try {
    const batchData: BatchQRData = JSON.parse(decodeURIComponent(data));

    const getValidationStatus = () => {
      if (batchData.validated) {
        return (
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Validé</span>
          </div>
        );
      }
      return (
        <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Non validé</span>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-4 inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Détails du lot</h1>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Package className="h-5 w-5" />
                    <span className="text-sm font-medium">Numéro de lot</span>
                  </div>
                  <p className="text-lg font-semibold">{batchData.lotNumber}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium">Date de réception</span>
                  </div>
                  <p className="text-lg">
                    {format(new Date(batchData.receptionDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Truck className="h-5 w-5" />
                    <span className="text-sm font-medium">Fournisseur</span>
                  </div>
                  <p className="text-lg">{batchData.supplier}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Package className="h-5 w-5" />
                    <span className="text-sm font-medium">Matière première</span>
                  </div>
                  <p className="text-lg">{batchData.rawMaterial}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Package className="h-5 w-5" />
                    <span className="text-sm font-medium">Quantité</span>
                  </div>
                  <p className="text-lg">{batchData.quantity} {batchData.unit}</p>
                </div>

                {batchData.expiryDate && (
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm font-medium">Date de péremption</span>
                    </div>
                    <p className="text-lg">
                      {format(new Date(batchData.expiryDate), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Statut de validation</span>
                  </div>
                  {getValidationStatus()}
                </div>

                {batchData.status && (
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Package className="h-5 w-5" />
                      <span className="text-sm font-medium">État du lot</span>
                    </div>
                    <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                      batchData.status === 'utilisé'
                        ? 'bg-green-100 text-green-800'
                        : batchData.status === 'périmé'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {batchData.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error parsing batch data:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-600">Erreur lors de la lecture des données du lot</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
      </div>
    );
  }
}