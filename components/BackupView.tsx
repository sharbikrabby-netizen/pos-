import React, { useState, useRef } from 'react';
import { BackupData } from '../types';
import { CloudArrowDownIcon, CloudArrowUpIcon } from './icons/Icons';

interface BackupViewProps {
  onExport: () => void;
  onImport: (data: BackupData) => void;
}

const BackupView: React.FC<BackupViewProps> = ({ onExport, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImportClick = () => {
    if (!file) {
      alert('Please select a backup file first.');
      return;
    }
    if (!window.confirm('Are you sure you want to restore from this backup? This will overwrite all current data in the application.')) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const data = JSON.parse(result) as BackupData;
          onImport(data);
        }
      } catch (error) {
        console.error('Error parsing backup file:', error);
        alert('Failed to read or parse the backup file. Please ensure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Backup & Restore</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
            This application stores data in your browser, which can be lost. Use these tools to manually save your data to a file and restore it later.
            It's recommended to create a backup at the end of each day.
        </p>
      </div>

      {/* Export Section */}
      <div className="p-6 border dark:border-gray-700 rounded-lg">
        <div className="flex items-start">
            <CloudArrowDownIcon className="w-8 h-8 mr-4 text-blue-500 flex-shrink-0 mt-1" />
            <div>
                <h2 className="text-xl font-bold">Create Backup</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
                    Download a single JSON file containing all your products, customers, sales, purchases, and settings. Keep this file in a safe place.
                </p>
                <button
                    onClick={onExport}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <CloudArrowDownIcon className="mr-2" />
                    Download Backup File
                </button>
            </div>
        </div>
      </div>

      {/* Import Section */}
       <div className="p-6 border border-red-500/50 dark:border-red-500/30 rounded-lg bg-red-50/20 dark:bg-red-900/10">
        <div className="flex items-start">
             <CloudArrowUpIcon className="w-8 h-8 mr-4 text-red-500 flex-shrink-0 mt-1" />
            <div>
                <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Restore from Backup</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
                    Upload a previously saved backup file. <strong className="font-bold text-red-600 dark:text-red-400">Warning:</strong> This will completely overwrite all existing data in the application. This action cannot be undone.
                </p>
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {file ? 'Change File' : 'Select File'}
                    </button>
                    {file && <span className="text-sm text-gray-500 truncate">{file.name}</span>}
                </div>
                 <button
                    onClick={handleImportClick}
                    disabled={!file}
                    className="mt-4 flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <CloudArrowUpIcon className="mr-2" />
                    Restore Data
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BackupView;