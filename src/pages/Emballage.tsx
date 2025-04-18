import React from 'react';
import ActionBar from '../components/ActionBar';

const Emballage = () => {
  const handleSearch = (term: string) => {
    console.log('Searching for:', term);
    // Implement search logic
  };

  return (
    <div className="space-y-6">
      <ActionBar 
        title="Emballage" 
        onSearch={handleSearch}
      />
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Emballage content will go here */}
          <p className="text-gray-600">Liste des emballages en cours...</p>
        </div>
      </div>
    </div>
  );
};

export default Emballage;