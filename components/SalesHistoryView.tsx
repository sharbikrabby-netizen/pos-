import React, { useState } from 'react';
import { Sale, CartItem } from '../types';
import { ClipboardListIcon, TrashIcon, PencilIcon, ReplyIcon } from './icons/Icons';
import { CURRENCY_SYMBOL } from '../constants';
import ReturnModal from './ReturnModal';

interface SalesHistoryViewProps {
  sales: Sale[];
  onViewInvoice: (sale: Sale) => void;
  onEditSale: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
  onCreateReturn: (sale: Sale, itemsToReturn: CartItem[], reason: string) => void;
}

const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({ sales, onViewInvoice, onEditSale, onDeleteSale, onCreateReturn }) => {
  const [returnSale, setReturnSale] = useState<Sale | null>(null);

  const handleCreateReturn = (itemsToReturn: CartItem[], reason: string) => {
    if (returnSale) {
      onCreateReturn(returnSale, itemsToReturn, reason);
      setReturnSale(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Sales History</h1>
        <div className="space-y-4">
          {sales.length === 0 ? (
            <p className="text-center text-gray-500">No sales yet.</p>
          ) : (
            sales.map(sale => (
              <div key={sale.id} className="p-4 border dark:border-gray-700 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <div className="flex-grow">
                      <p className="font-semibold">{sale.date.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Invoice #{sale.invoiceNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                          Customer: {sale.customer?.name || sale.walkInCustomerName || 'Walk-in Customer'}
                      </p>
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto">
                      <p className="font-bold text-lg text-left sm:text-right">{CURRENCY_SYMBOL}{sale.total.toFixed(2)}</p>
                      <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 mt-2">
                        <button onClick={() => onViewInvoice(sale)} className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600" aria-label="View Invoice">
                          <ClipboardListIcon className="mr-1 w-4 h-4"/> View Invoice
                        </button>
                        <button onClick={() => setReturnSale(sale)} className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-sm rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800" aria-label="Return Items">
                          <ReplyIcon className="mr-1 w-4 h-4"/> Return Items
                        </button>
                        <div className="flex items-center">
                          <button onClick={() => onEditSale(sale)} className="p-2 text-blue-500 hover:text-blue-700" aria-label="Edit sale">
                            <PencilIcon />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this sale? This action will restock the items and cannot be undone.')) {
                                onDeleteSale(sale.id);
                              }
                            }} 
                            className="p-2 text-red-500 hover:text-red-700"
                            aria-label="Delete sale"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                  </div>
                </div>
                <ul className="mt-2 text-sm border-t dark:border-gray-700 pt-2">
                  {sale.items.map(item => (
                    <li key={item.productId} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
      {returnSale && (
        <ReturnModal
          transaction={returnSale}
          transactionType="sale"
          onClose={() => setReturnSale(null)}
          onSave={handleCreateReturn}
        />
      )}
    </>
  );
};

export default SalesHistoryView;