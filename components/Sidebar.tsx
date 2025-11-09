import React from 'react';
import { CashIcon, ShoppingBagIcon, UserGroupIcon, ClipboardListIcon, CogIcon, TruckIcon, ArchiveIcon, ChartBarIcon, DocumentReportIcon, ReplyIcon, CloudArrowDownIcon, PaperAirplaneIcon } from './icons/Icons';

type View = 'dashboard' | 'sell' | 'sales' | 'purchases' | 'products' | 'customers' | 'suppliers' | 'returns' | 'shipping' | 'reports' | 'settings' | 'backup';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
    { id: 'sell', label: 'Sell', icon: <CashIcon /> },
    { id: 'sales', label: 'Sales History', icon: <ClipboardListIcon /> },
    { id: 'purchases', label: 'Purchases', icon: <ArchiveIcon /> },
    { id: 'products', label: 'Products', icon: <ShoppingBagIcon /> },
    { id: 'customers', label: 'Customers', icon: <UserGroupIcon /> },
    { id: 'suppliers', label: 'Suppliers', icon: <TruckIcon /> },
    { id: 'returns', label: 'Returns', icon: <ReplyIcon /> },
    { id: 'shipping', label: 'Shipping', icon: <PaperAirplaneIcon /> },
    { id: 'reports', label: 'Reports', icon: <DocumentReportIcon /> },
    { id: 'settings', label: 'Settings', icon: <CogIcon /> },
    { id: 'backup', label: 'Backup & Restore', icon: <CloudArrowDownIcon /> },
  ];

  const NavLink: React.FC<{item: typeof navItems[0]}> = ({ item }) => {
    const isActive = currentView === item.id || 
                    (currentView === 'newPurchase' && item.id === 'purchases') ||
                    (currentView === 'invoice' && item.id === 'sales');
    return (
        <button
            onClick={() => setCurrentView(item.id as View)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            <span className="w-6 h-6 mr-3">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
        </button>
    );
  };

  return (
    <div className="flex flex-col w-16 md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 no-print h-screen sticky top-0">
        <div className="flex items-center justify-center md:justify-start h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <CogIcon className="w-8 h-8 text-blue-600" />
            <div className="hidden md:block ml-2">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Gemini POS</h1>
                <div className="flex items-center text-xs text-green-500">
                    <span className="w-2 h-2 rounded-full mr-1.5 bg-green-500"></span>
                    Local Mode
                </div>
            </div>
        </div>
        <nav className="flex-1 p-2 space-y-2">
            {navItems.map(item => <NavLink key={item.id} item={item} />)}
        </nav>
    </div>
  );
};

export default Sidebar;
