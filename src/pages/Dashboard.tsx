import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBatches } from '../hooks/useBatches';
import { useProductions } from '../hooks/useProductions';
import { useNavigate } from 'react-router-dom';
import { 
  Package,
  Factory,
  BarChart3,
  Truck,
  Search,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DashboardProductionStats from '../components/DashboardProductionStats';
import DashboardProductionChart from '../components/DashboardProductionChart';
import ProductionTrackingTable from '../components/ProductionTrackingTable';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batches, loading: loadingBatches } = useBatches();
  const { productions, loading: loadingProductions } = useProductions();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate statistics
  const validatedBatches = batches?.filter(batch => batch.validated) || [];
  const pendingBatches = batches?.filter(batch => !batch.validated) || [];
  const activeProductions = productions?.filter(prod => prod.status === 'en_cours') || [];
  const completedProductions = productions?.filter(prod => prod.status === 'terminé') || [];

  // Mock production data for chart
  const productionData = [
    { hour: '08', actual: 65, target: 60 },
    { hour: '09', actual: 58, target: 60 },
    { hour: '10', actual: 62, target: 60 },
    { hour: '11', actual: 55, target: 60 },
    { hour: '12', actual: 45, target: 60 },
    { hour: '13', actual: 50, target: 60 },
    { hour: '14', actual: 63, target: 60 },
    { hour: '15', actual: 58, target: 60 }
  ];

  const stats = [
    {
      label: 'Lots validés',
      value: validatedBatches.length,
      change: `${pendingBatches.length} en attente`,
      description: 'Lots de matières premières validés',
      icon: Package,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      changeColor: 'text-amber-600',
      onClick: () => navigate('/reception')
    },
    {
      label: 'En Production',
      value: activeProductions.length,
      change: `${completedProductions.length} terminés`,
      description: 'Productions en cours',
      icon: Factory,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      changeColor: 'text-green-600',
      onClick: () => navigate('/production')
    },
    {
      label: 'Stock disponible',
      value: batches?.filter(b => b.status === 'partiel').length || 0,
      change: `${batches?.filter(b => b.status === 'utilisé').length || 0} utilisés`,
      description: 'Lots disponibles en stock',
      icon: BarChart3,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      changeColor: 'text-gray-600',
      onClick: () => navigate('/reception')
    },
    {
      label: 'Livraisons',
      value: '0',
      change: 'Aucune en cours',
      description: 'Livraisons en attente',
      icon: Truck,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      changeColor: 'text-gray-600',
      onClick: () => navigate('/distribution')
    }
  ];

  // Refresh data periodically
  useEffect(() => {
    const refreshData = () => {
      setIsRefreshing(true);
      // The actual data refresh is handled by the hooks
      setLastUpdate(new Date());
      setTimeout(() => setIsRefreshing(false), 500);
    };

    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loadingBatches || loadingProductions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Last Update */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">
            Dernière mise à jour : {format(lastUpdate, 'HH:mm:ss', { locale: fr })}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.onClick}
              className="bg-white rounded-xl p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <span className={`text-sm font-medium ${stat.changeColor}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Tracking */}
      <ProductionTrackingTable productions={productions} />

      {/* Production Chart and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardProductionChart 
          data={productionData} 
          unit="unités" 
          refreshInterval={30000}
        />

        {/* Active Workshops Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Statistiques des ateliers</h2>
          <DashboardProductionStats
            workshops={[
              {
                name: 'Réception',
                current: 6,
                target: 7,
                unit: 'lots',
                efficiency: 85.71,
                incidents: 0
              },
              {
                name: 'Production',
                current: 3,
                target: 3,
                unit: 'unités',
                efficiency: 100,
                incidents: 0
              }
            ]}
            onWorkshopClick={(workshop) => navigate(`/${workshop.toLowerCase()}`)}
          />
        </div>
      </div>
    </div>
  );
}