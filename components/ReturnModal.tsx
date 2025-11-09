import React, { useState } from 'react';
import { Sale, Purchase, CartItem, PurchaseItem } from '../types';
import Modal from './Modal';
import { CURRENCY_SYMBOL } from '../constants';

type Transaction = Sale | Purchase;
type TransactionItem = CartItem | PurchaseItem;

interface ReturnModalProps {
  transaction: Transaction;
  transactionType: 'sale' | 'purchase';
  onClose: () => void;
  onSave: (itemsToReturn: TransactionItem[], reason: string) => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ transaction, transactionType, onClose, onSave }) => {
  const [returnItems, setReturnItems] = useState<Map<string, number>>(new Map());
  const [reason, setReason] = useState('');

  const handleQuantityChange = (productId: string, quantity: number, maxQuantity: number) => {
    const newQuantity = Math.max(0, Math.min(quantity, maxQuantity));
    setReturnItems(prev => new Map(prev).set(productId, newQuantity));
  };

  const handleSubmit = () => {
    const itemsToReturn: TransactionItem[] = [];
    transaction.items.forEach(item => {
      const returnQty = returnItems.get(item.productId);
      if (returnQty && returnQty > 0) {
        itemsToReturn.push({ ...item, quantity: returnQty });
      }
    });

    if (itemsToReturn.length > 0) {
      onSave(itemsToReturn, reason);
    }
  };

  const totalReturnAmount = transaction.items.reduce((acc, item) => {
    const returnQty = returnItems.get(item.productId) || 0;
    const price = 'price' in item ? item.price : item.purchasePrice;
    return acc + (price * returnQty);
  }, 0);

  const title = transactionType === 'sale' ? 'Process Customer Return' : 'Process Supplier Return';
  const transactionIdLabel = transactionType === 'sale' ? 'Invoice #' : 'PO #';
  const transactionId = transactionType === 'sale' ? (transaction as Sale).invoiceNumber : (transaction as Purchase).poNumber;

  return (
    <Modal onClose={onClose} title={title}>
      <div className="space-y-4">
        <p>
          Creating a return for <strong>{transactionIdLabel}{transactionId}</strong>
        </p>

        <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
          {transaction.items.map(item => (
            <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex-grow">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Original Qty: {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm">Return Qty:</label>
                <input
                  type="number"
                  min="0"
                  max={item.quantity}
                  value={returnItems.get(item.productId) || 0}
                  onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 0, item.quantity)}
                  className="w-20 p-1 text-center rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason for Return (Optional)</label>
            <textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-right">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total {transactionType === 'sale' ? 'Refund' : 'Credit'}: </span>
            <span className="text-xl font-bold">{CURRENCY_SYMBOL}{totalReturnAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={totalReturnAmount <= 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Process Return
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReturnModal;
