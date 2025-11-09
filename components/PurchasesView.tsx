import React, { useState } from 'react';
import { Purchase, PurchaseItem } from '../types';
import { PlusIcon, TrashIcon, PencilIcon, ReplyIcon } from './icons/Icons';
import { CURRENCY_SYMBOL } from '../constants';
import ReturnModal from './ReturnModal';

interface PurchasesViewProps {
  purchases: Purchase[];
  onNewPurchase: () => void;
  onEditPurchase: (purchase: Purchase) => void;
  onDeletePurchase: (purchaseId: string) => void;
  onCreateReturn: (purchase: Purchase, itemsToReturn: PurchaseItem[], reason: string) => void;
}

const PurchasesView: React.FC<PurchasesViewProps> = ({ purchases, onNewPurchase, onEditPurchase, onDeletePurchase, onCreateReturn }) => {
  const [returnPurchase, setReturnPurchase] = useState<Purchase | null>(null);
  
  const handleCreateReturn = (itemsToReturn: PurchaseItem[], reason: string) => {
    if (returnPurchase) {
      onCreateReturn(returnPurchase, itemsToReturn, reason);
      setReturnPurchase(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Purchase History</h1>
          <button onClick={onNewPurchase} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <PlusIcon className="mr-2" />
            New Purchase
          </button>
        </div>
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <p className="text-center text-gray-500">No purchases yet.</p>
          ) : (
              purchases.map(purchase => (
              <div key={purchase.id} className="p-4 border dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                      <p className="font-semibold">{purchase.date.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">PO #{purchase.poNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                          Supplier: {purchase.supplier?.name || 'N/A'}
                      </p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-lg">{CURRENCY_SYMBOL}{purchase.total.toFixed(2)}</p>
                      {purchase.payable > 0 && (
                          <p className="text-sm font-semibold text-red-500">Payable: {CURRENCY_SYMBOL}{purchase.payable.toFixed(2)}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                          <button onClick={() => setReturnPurchase(purchase)} className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-sm rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800" aria-label="Return Items">
                            <ReplyIcon className="mr-1 w-4 h-4"/> Return Items
                          </button>
                          <button onClick={() => onEditPurchase(purchase)} className="p-2 text-blue-500 hover:text-blue-700" aria-label="Edit purchase">
                              <PencilIcon />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this purchase? This action will remove the items from stock and cannot be undone.')) {
                                onDeletePurchase(purchase.id);
                              }
                            }} 
                            className="p-2 text-red-500 hover:text-red-700"
                            aria-label="Delete purchase"
                          >
                            <TrashIcon />
                          </button>
                      </div>
                  </div>
                </div>
                <ul className="mt-2 text-sm border-t dark:border-gray-700 pt-2">
                  {purchase.items.map(item => (
                    <li key={item.productId} className="flex justify-between">
                      <span>{item.name} x {item.quantity} (@ {CURRENCY_SYMBOL}{item.purchasePrice.toFixed(2)})</span>
                      <span>{CURRENCY_SYMBOL}{(item.purchasePrice * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
      {returnPurchase && (
        <ReturnModal
          transaction={returnPurchase}
          transactionType="purchase"
          onClose={() => setReturnPurchase(null)}
          onSave={handleCreateReturn}
        />
      )}
    </>
  );
};

export default PurchasesView;
