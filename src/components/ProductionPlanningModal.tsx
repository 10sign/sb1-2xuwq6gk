import React, { useState } from 'react';
import { X, Calendar, Users, Package, ChevronDown, ChevronUp, BarChart2, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProductionPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductionPlan {
  id: string;
  date: Date;
  product: string;
  quantity: number;
  unit: string;
  operators: number;
  duration: number;
  status: 'planned' | 'in_progress' | 'completed';
}

interface ResourceCapacity {
  name: string;
  current: number;
  max: number;
  unit: string;
}

const mockProductionPlan: ProductionPlan[] = [
  {
    id: '1',
    date: new Date(),
    product: 'Glace Vanille',
    quantity: 500,
    unit: 'L',
    operators: 2,
    duration: 4,
    status: 'planned'
  },
  {
    id: '2',
    date: addDays(new Date(), 1),
    product: 'Glace Chocolat',
    quantity: 300,
    unit: 'L',
    operators: 2,
    duration: 3,
    status: 'in_progress'
  },
  {
    id: '3',
    date: addDays(new Date(), 2),
    product: 'Sorbet Fraise',
    quantity: 400,
    unit: 'L',
    operators: 3,
    duration: 5,
    status: 'completed'
  }
];

const resourceCapacities: ResourceCapacity[] = [
  { name: 'Personnel', current: 8, max: 10, unit: 'opérateurs' },
  { name: 'Machines', current: 3, max: 4, unit: 'machines' },
  { name: 'Matières premières', current: 1200, max: 1500, unit: 'L' }
];

export default function ProductionPlanningModal({ isOpen, onClose }: ProductionPlanningModalProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [showCapacities, setShowCapacities] = useState(true);

  if (!isOpen) return null;

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'text-blue-600 bg-blue-50';
      case 'in_progress':
        return 'text-amber-600 bg-amber-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Planifié';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Plan de production</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Capacités de production */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowCapacities(!showCapacities)}
            >
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium">Capacités de production actuelles</h3>
              </div>
              {showCapacities ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {showCapacities && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {resourceCapacities.map((resource, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{resource.name}</h4>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold">{resource.current}</span>
                        <span className="text-gray-500 ml-1">/ {resource.max}</span>
                      </div>
                      <span className="text-sm text-gray-500">{resource.unit}</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${(resource.current / resource.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sélecteur de semaine */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronDown className="h-5 w-5 transform rotate-90" />
            </button>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">
                  Semaine du {format(weekStart, 'dd MMMM', { locale: fr })} au {format(weekEnd, 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            </button>
          </div>

          {/* Planning de production */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opérateurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockProductionPlan.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {format(plan.date, 'EEEE dd MMMM', { locale: fr })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{plan.product}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{plan.quantity} {plan.unit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{plan.operators}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{plan.duration}h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {getStatusLabel(plan.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fermer
          </button>
          <button
            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Mettre à jour le plan
          </button>
        </div>
      </div>
    </div>
  );
}