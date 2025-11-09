import React, { useState } from 'react';
import { CourierService } from '../types';

interface CourierFormProps {
  onSave: (courier: Omit<CourierService, 'id'> | CourierService) => void;
  courier?: CourierService;
}

const CourierForm: React.FC<CourierFormProps> = ({ onSave, courier }) => {
  const [name, setName] = useState(courier?.name || '');
  const [portalUrl, setPortalUrl] = useState(courier?.portalUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const courierData = {
        name,
        portalUrl,
        apiKey: courier?.apiKey || '',
        apiSecret: courier?.apiSecret || ''
    };
    if (courier) {
      onSave({ ...courierData, id: courier.id });
    } else {
      onSave(courierData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Courier Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="portalUrl" className="block text-sm font-medium mb-1">Portal URL (e.g., https://pathao.com/)</label>
        <input
          id="portalUrl"
          type="url"
          value={portalUrl}
          onChange={e => setPortalUrl(e.target.value)}
          placeholder="https://courier.example.com"
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Courier
        </button>
      </div>
    </form>
  );
};

export default CourierForm;