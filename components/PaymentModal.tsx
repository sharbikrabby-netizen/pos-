import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CURRENCY_SYMBOL } from '../constants';

type PaymentTarget = {
    id: string;
    name: string;
    amount: number;
    type: 'customer' | 'supplier';
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    target: PaymentTarget;
    onSavePayment: (id: string, type: 'customer' | 'supplier', amount: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, target, onSavePayment }) => {
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            // Pre-fill with the full due amount when the modal opens
            setAmount(target.amount);
        }
    }, [isOpen, target.amount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount > 0 && amount <= target.amount) {
            onSavePayment(target.id, target.type, amount);
        }
    };
    
    if (!isOpen) return null;

    const title = target.type === 'customer' ? 'Record Customer Payment' : 'Make Supplier Payment';
    
    return (
        <Modal onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p>
                    Recording payment for <strong className="font-semibold">{target.name}</strong>.
                </p>
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount Owed:</span>
                    <p className="text-2xl font-bold">{CURRENCY_SYMBOL}{target.amount.toFixed(2)}</p>
                </div>
                <div>
                    <label htmlFor="paymentAmount" className="block text-sm font-medium mb-1">Payment Amount</label>
                    <input
                        id="paymentAmount"
                        type="number"
                        value={amount}
                        onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        max={target.amount}
                        min="0.01"
                        step="0.01"
                        required
                        autoFocus
                    />
                     {amount > target.amount && (
                        <p className="text-xs text-red-500 mt-1">Payment cannot exceed the total amount owed.</p>
                    )}
                </div>
                 <div className="flex justify-end pt-4 space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={amount <= 0 || amount > target.amount}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Save Payment
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PaymentModal;