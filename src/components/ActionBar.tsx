import React from 'react';
import { Search } from 'lucide-react';

interface ActionBarProps {
  title: string;
  onSearch?: (term: string) => void;
}

export default function ActionBar({ title, onSearch }: ActionBarProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}