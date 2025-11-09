import React, { useState } from 'react';
import { BusinessDetails } from '../types';
import { SaveIcon } from './icons/Icons';

interface SettingsViewProps {
  details: BusinessDetails;
  onSaveDetails: (details: BusinessDetails) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ details, onSaveDetails }) => {
  const [currentDetails, setCurrentDetails] = useState<BusinessDetails>(details);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    onSaveDetails(currentDetails);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Business Details</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Business Name</label>
            <input
            id="name"
            name="name"
            type="text"
            value={currentDetails.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
            <input
            id="address"
            name="address"
            type="text"
            value={currentDetails.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
            id="email"
            name="email"
            type="email"
            value={currentDetails.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
            <input
            id="phone"
            name="phone"
            type="tel"
            value={currentDetails.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        <div>
            <label htmlFor="qrCode1_url" className="block text-sm font-medium mb-1">QR Code 1 Image URL</label>
            <input
            id="qrCode1_url"
            name="qrCode1_url"
            type="url"
            placeholder="https://example.com/your-qr-code1.png"
            value={currentDetails.qrCode1_url || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div>
            <label htmlFor="qrCode2_url" className="block text-sm font-medium mb-1">QR Code 2 Image URL</label>
            <input
            id="qrCode2_url"
            name="qrCode2_url"
            type="url"
            placeholder="https://example.com/your-qr-code2.png"
            value={currentDetails.qrCode2_url || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div>
            <label htmlFor="watermarkLogoUrl" className="block text-sm font-medium mb-1">Watermark Logo URL (for Invoice)</label>
            <input
            id="watermarkLogoUrl"
            name="watermarkLogoUrl"
            type="url"
            placeholder="https://example.com/your-logo.png"
            value={currentDetails.watermarkLogoUrl || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="flex justify-end pt-4">
            <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <SaveIcon className="mr-2" />
            {saveStatus === 'saved' ? 'Settings Saved!' : 'Save Settings'}
            </button>
        </div>
        </form>
    </div>
  );
};

export default SettingsView;