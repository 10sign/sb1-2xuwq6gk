import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WorkshopStats {
  name: string;
  current: number;
  target: number;
  unit: string;
  efficiency: number;
  incidents: number;
}

interface DashboardProductionStatsProps {
  workshops: WorkshopStats[];
  onWorkshopClick: (workshop: string) => void;
}

export default function DashboardProductionStats({ workshops, onWorkshopClick }: DashboardProductionStatsProps) {
  const getProgressColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-500';
    if (efficiency >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {workshops.map((workshop) => (
        <div
          key={workshop.name}
          onClick={() => onWorkshopClick(workshop.name)}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center">
              {workshop.name}
              {workshop.incidents > 0 && (
                <AlertTriangle className="h-5 w-5 text-amber-500 ml-2" />
              )}
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-gray-600 mb-2">Production</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">
                  {workshop.current} / {workshop.target} {workshop.unit}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(workshop.efficiency)} transition-all duration-300`}
                  style={{ width: `${Math.min((workshop.current / workshop.target) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-gray-600 mb-1">Opéra</div>
                <div className="text-2xl font-bold">N/A</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Matières</div>
                <div className="text-2xl font-bold">N/A</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-gray-600 mb-1">Rendement</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(workshop.efficiency)}`}>
                  {workshop.efficiency.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Écart</div>
                <div className="text-2xl font-bold">
                  {Math.abs(workshop.target - workshop.current)} {workshop.unit}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}