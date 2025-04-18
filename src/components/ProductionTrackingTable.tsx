import React from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Clock, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import type { Production } from '../hooks/useProductions';

interface ProductionTrackingTableProps {
  productions: Production[];
}

export default function ProductionTrackingTable({ productions }: ProductionTrackingTableProps) {
  const calculateProgress = (production: Production) => {
    const startTime = new Date(production.dateProduction);
    const estimatedDuration = production.cookingTime;
    const elapsed = differenceInMinutes(new Date(), startTime);
    const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
    return Math.round(progress);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'terminé':
        return 'bg-green-100 text-green-800';
      case 'en_pause':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const activeProductions = productions.filter(p => p.status !== 'terminé');

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Suivi des productions en temps réel</h2>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantités
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avancement
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temps
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opérateur
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeProductions.map((production) => {
                  const progress = calculateProgress(production);
                  const startTime = format(new Date(production.dateProduction), 'HH:mm', { locale: fr });
                  const isDelayed = progress > 100 && production.status !== 'terminé';

                  return (
                    <tr key={production.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2 hidden md:block" />
                          <div>
                            <div className="font-medium text-gray-900">{production.lotNumber}</div>
                            <div className="text-sm text-gray-500 hidden md:block">Ligne {production.id.slice(-4)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{production.quantity}</span>
                          <span className="text-gray-500">{production.unit}</span>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{progress}%</span>
                          </div>
                          <div className="w-24 md:w-48 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isDelayed ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-400 hidden md:block" />
                          <span>{startTime}</span>
                          <ArrowRight className="h-4 w-4 text-gray-300" />
                          <span>{production.cookingTime} min</span>
                          {isDelayed && (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-sm hidden md:inline">Retard</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-2 hidden md:block" />
                          <span>{production.operatorName}</span>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(production.status)}`}>
                          {production.status.charAt(0).toUpperCase() + production.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {activeProductions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 md:px-6 py-4 text-center text-gray-500">
                      Aucune production en cours
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}