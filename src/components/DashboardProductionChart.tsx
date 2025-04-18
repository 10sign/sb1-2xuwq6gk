import React, { useEffect, useState } from 'react';
import { BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProductionData {
  hour: string;
  actual: number;
  target: number;
}

interface DashboardProductionChartProps {
  data: ProductionData[];
  unit: string;
  refreshInterval?: number;
}

export default function DashboardProductionChart({ data, unit, refreshInterval = 5000 }: DashboardProductionChartProps) {
  const [currentData, setCurrentData] = useState(data);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const maxValue = Math.max(...currentData.map(d => Math.max(d.actual, d.target)));

  useEffect(() => {
    const timer = setInterval(() => {
      setIsRefreshing(true);
      // Simulate real-time data update
      const updatedData = currentData.map(d => ({
        ...d,
        actual: d.actual + Math.floor(Math.random() * 10) - 5
      }));
      setCurrentData(updatedData);
      setLastUpdate(new Date());
      setTimeout(() => setIsRefreshing(false), 500);
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [currentData, refreshInterval]);

  const getTrendIndicator = (actual: number, target: number) => {
    const diff = actual - target;
    if (diff >= 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span className="text-sm">+{diff} {unit}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-red-600">
        <ArrowDownRight className="h-4 w-4 mr-1" />
        <span className="text-sm">{diff} {unit}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold">Production journalière</h3>
        </div>
        {getTrendIndicator(
          currentData.reduce((sum, d) => sum + d.actual, 0),
          currentData.reduce((sum, d) => sum + d.target, 0)
        )}
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-6">
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>
          Dernière mise à jour : {format(lastUpdate, 'HH:mm:ss', { locale: fr })}
        </span>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between">
          {currentData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full px-1 flex flex-col items-center space-y-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500 ease-in-out"
                  style={{
                    height: `${(d.actual / maxValue) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <div
                  className="w-full bg-gray-200 rounded-t"
                  style={{
                    height: `${(d.target / maxValue) * 100}%`,
                    minHeight: '4px'
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">{d.hour}h</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-sm text-gray-600">Réel</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-200 rounded" />
          <span className="text-sm text-gray-600">Objectif</span>
        </div>
      </div>
    </div>
  );
}