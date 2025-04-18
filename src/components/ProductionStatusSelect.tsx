import React from 'react';
import { CheckCircle, Clock, PauseCircle } from 'lucide-react';
import type { ProductStatus } from '../types/firestore';

interface ProductionStatusSelectProps {
  currentStatus: ProductStatus;
  onStatusChange: (status: ProductStatus) => void;
  disabled?: boolean;
}

export default function ProductionStatusSelect({
  currentStatus,
  onStatusChange,
  disabled = false
}: ProductionStatusSelectProps) {
  const statuses: { value: ProductStatus; label: string; icon: React.ReactNode; className: string }[] = [
    {
      value: 'en_cours',
      label: 'En cours',
      icon: <Clock className="h-4 w-4" />,
      className: 'text-amber-700 bg-amber-50'
    },
    {
      value: 'en_pause',
      label: 'En pause',
      icon: <PauseCircle className="h-4 w-4" />,
      className: 'text-gray-700 bg-gray-50'
    },
    {
      value: 'terminé',
      label: 'Terminé',
      icon: <CheckCircle className="h-4 w-4" />,
      className: 'text-green-700 bg-green-50'
    }
  ];

  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value as ProductStatus)}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg border-0 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
        statuses.find(s => s.value === currentStatus)?.className
      }`}
    >
      {statuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}