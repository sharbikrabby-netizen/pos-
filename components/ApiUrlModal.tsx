import React, { useState } from 'react';

interface ApiUrlModalProps {
  onConnect: (url: string) => Promise<void>;
  isConnecting: boolean;
  connectionError: string | null;
}

const ApiUrlModal: React.FC<ApiUrlModalProps> = ({ onConnect, isConnecting, connectionError }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConnect(url.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Connect to Backend</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Please enter the base URL of your POS backend API to get started.
          For example: <code>http://localhost:8000</code>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-api-url.com"
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoFocus
          />
          {connectionError && (
              <p className="text-red-500 text-sm mt-2">{connectionError}</p>
          )}
          <button
            type="submit"
            disabled={isConnecting}
            className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiUrlModal;
