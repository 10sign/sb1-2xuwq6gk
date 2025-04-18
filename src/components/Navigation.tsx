import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  IceCream, 
  Package, 
  Factory, 
  Cookie, 
  Palette, 
  Box, 
  Truck, 
  History, 
  Settings,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navigationItems = [
  { path: '/', label: 'Tableau de bord', icon: IceCream },
  { path: '/reception', label: 'Réception', icon: Package },
  { path: '/production', label: 'Production', icon: Factory },
  { path: '/moulage', label: 'Moulage', icon: Cookie },
  { path: '/decoration', label: 'Décoration', icon: Palette },
  { path: '/emballage', label: 'Emballage', icon: Box },
  { path: '/distribution', label: 'Distribution', icon: Truck },
  { path: '/historique', label: 'Historique', icon: History },
  { path: '/admin', label: 'Administration', icon: Settings }
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <nav className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-40`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <IceCream className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">VDC traça</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex flex-col px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">{user?.displayName || user?.email}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
                <div className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-2 py-1.5 rounded hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}