import React, { useState } from 'react';
import { SaleReturn, PurchaseReturn } from '../types';
import { CURRENCY_SYMBOL } from '../constants';

interface ReturnsViewProps {
  saleReturns: SaleReturn[];
  purchaseReturns: PurchaseReturn[];
}

const ReturnsView: React.FC<ReturnsViewProps> = ({ saleReturns, purchaseReturns }) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'supplier'>('customer');

  const renderContent = () => {
    const list = activeTab === 'customer' ? saleReturns : purchaseReturns;
    if (list.length === 0) {
      return <p className="text-center text-gray-500 mt-8">No returns in this category yet.</p>;
    }
    
    return (
      <div className="space-y-4">
        {list.map(ret => {
           const isSaleReturn = 'invoiceNumber' in ret;
           return (
            <div key={ret.id} className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{new Date(ret.date).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isSaleReturn ? `Original Invoice: #${ret.invoiceNumber}` : `Original PO: #${ret.poNumber}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isSaleReturn ? `Customer: ${ret.customerName}` : `Supplier: ${ret.supplierName}`}
                  </p>
                  {ret.reason && (
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reason: {ret.reason}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-yellow-500">
                    {isSaleReturn ? 'Refund' : 'Credit'}: {CURRENCY_SYMBOL}{(isSaleReturn ? ret.totalRefund : ret.totalCredit).toFixed(2)}
                  </p>
                </div>
              </div>
              <ul className="mt-2 text-sm border-t dark:border-gray-700 pt-2">
                {ret.items.map((item, index) => (
                  <li key={`${item.productId}-${index}`} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>
                      {CURRENCY_SYMBOL}{(('price' in item ? item.price : item.purchasePrice) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">Returns History</h1>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('customer')}
            className={`${
              activeTab === 'customer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Customer Returns
          </button>
          <button
            onClick={() => setActiveTab('supplier')}
            className={`${
              activeTab === 'supplier'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Supplier Returns
          </button>
        </nav>
      </div>
      <div className="pt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReturnsView;
