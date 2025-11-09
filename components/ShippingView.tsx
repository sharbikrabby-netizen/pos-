
import React, { useState, useEffect } from 'react';
import { CourierService } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/Icons';
import Modal from './Modal';
import CourierForm from './CourierForm';

interface ShippingViewProps {
  couriers: CourierService[];
  onAddCourier: (courier: Omit<CourierService, 'id'>) => void;
  onUpdateCourier: (courier: CourierService) => void;
  onDeleteCourier: (courierId: string) => void;
}

const ShippingView: React.FC<ShippingViewProps> = ({ couriers, onAddCourier, onUpdateCourier, onDeleteCourier }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<CourierService | undefined>(undefined);
  
  // FIX: Removed local state `editableCouriers` that was causing stale data.
  // The component now directly renders the `couriers` prop, ensuring it's always up to date.

  const handleOpenModal = (courier?: CourierService) => {
    setEditingCourier(courier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCourier(undefined);
    setIsModalOpen(false);
  };

  const handleSaveCourierForm = (courierData: Omit<CourierService, 'id'> | CourierService) => {
    if ('id' in courierData) {
      onUpdateCourier(courierData);
    } else {
      onAddCourier(courierData);
    }
    handleCloseModal();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipping & Courier Integrations</h1>
      </div>
      
      <div className="p-4 mb-6 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-800 dark:text-blue-200">
          <p className="font-semibold mb-2">How to Use This Page:</p>
          <ol className="list-decimal list-inside space-y-1">
              <li>Manage your list of courier services below.</li>
              <li>When processing a sale in the 'Sell' tab, you can select from this list and add a shipping cost.</li>
          </ol>
      </div>

      <div className="space-y-6">
        {couriers.map(courier => (
          <div key={courier.id} className="p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{courier.name}</h2>
              <div className="flex space-x-2">
                 <a 
                    href={courier.portalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 ${!courier.portalUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-disabled={!courier.portalUrl}
                    onClick={(e) => !courier.portalUrl && e.preventDefault()}
                 >
                    Go to Portal
                 </a>
                <button onClick={() => handleOpenModal(courier)} className="p-2 text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                <button onClick={() => onDeleteCourier(courier.id)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <label className="block font-medium mb-1">Portal URL</label>
                    <p className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md truncate">{courier.portalUrl || 'Not set'}</p>
                </div>
            </div>
          </div>
        ))}
      </div>
       <div className="mt-6 text-right">
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto">
          <PlusIcon className="mr-2" />
          Add New Courier
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={editingCourier ? 'Edit Courier' : 'Add Courier'}>
          <CourierForm onSave={handleSaveCourierForm} courier={editingCourier} />
        </Modal>
      )}
    </div>
  );
};

export default ShippingView;
