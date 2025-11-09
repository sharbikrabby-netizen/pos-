
import React from 'react';
import { XIcon } from './icons/Icons';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b dark:border-gray-700 p-4 flex-shrink-0">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XIcon />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
