import React, { useState } from 'react';
import { Supplier } from '../types';

interface SupplierFormProps {
  onSave: (supplier: Omit<Supplier, 'id'> | Supplier) => void;
  supplier?: Supplier;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onSave, supplier }) => {
  const [name, setName] = useState(supplier?.name || '');
  const [email, setEmail] = useState(supplier?.email || '');
  const [phone, setPhone] = useState(supplier?.phone || '');
  const [address, setAddress] = useState(supplier?.address || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplierData = { name, email, phone, address };
    if (supplier) {
      onSave({ ...supplier, ...supplierData });
    } else {
      onSave(supplierData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
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
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email || ''}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone || ''}
          onChange={e => setPhone(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
        <input
          id="address"
          type="text"
          value={address || ''}
          onChange={e => setAddress(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          className="px-4 py-2 text-white rounded-lg transition-colors duration-200 bg-blue-600 hover:bg-blue-700"
          >
          Save Supplier
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;