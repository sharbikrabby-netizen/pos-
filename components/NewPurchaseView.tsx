
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Supplier, PurchaseItem, Purchase } from '../types';
import { PlusIcon, TrashIcon, TruckIcon } from './icons/Icons';
import { CURRENCY_SYMBOL } from '../constants';

interface NewPurchaseViewProps {
  products: Product[];
  suppliers: Supplier[];
  onAddPurchase: (purchaseData: { items: PurchaseItem[], selectedSupplier?: Supplier, paidAmount: number }) => void;
  onCancel: () => void;
  purchaseToEdit?: Purchase | null;
  onUpdatePurchase?: (purchaseId: string, purchaseData: { items: PurchaseItem[], selectedSupplier?: Supplier, paidAmount: number }) => void;
}

const NewPurchaseView: React.FC<NewPurchaseViewProps> = ({ products, suppliers, onAddPurchase, onCancel, purchaseToEdit, onUpdatePurchase }) => {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('none');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [paidAmount, setPaidAmount] = useState('');

  const isEditing = !!purchaseToEdit;

  useEffect(() => {
    if (isEditing && purchaseToEdit) {
        setItems(purchaseToEdit.items);
        setSelectedSupplierId(purchaseToEdit.supplier?.id || 'none');
        setPaidAmount(purchaseToEdit.paidAmount.toString());
    } else {
        setItems([]);
        setSelectedSupplierId('none');
        setPaidAmount('');
    }
  }, [purchaseToEdit, isEditing]);

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product || quantity <= 0 || Number(purchasePrice) < 0) return;

    setItems(prevItems => {
        const existingItem = prevItems.find(item => item.productId === product.id);
        const price = Number(purchasePrice) || 0;
        if (existingItem) {
            return prevItems.map(item =>
                item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity, purchasePrice: (item.purchasePrice * item.quantity + price * quantity) / (item.quantity + quantity) } // average price
                : item
            );
        }
        return [...prevItems, { productId: product.id, name: product.name, quantity, purchasePrice: price }];
    });
    setQuantity(1);
    setPurchasePrice('');
  };

  const removeFromItems = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };
  
  const { total, payable } = useMemo(() => {
    const total = items.reduce((acc, item) => acc + item.purchasePrice * item.quantity, 0);
    const payable = total - (Number(paidAmount) || 0);
    return { total, payable };
  }, [items, paidAmount]);

  useEffect(() => {
    if (!isEditing) {
      if (total > 0) {
        setPaidAmount(total.toString());
      } else {
        setPaidAmount('');
      }
    }
  }, [total, isEditing]);

  const handleSubmit = () => {
    if (items.length === 0) return;
    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);
    
    const purchaseData = {
        items,
        selectedSupplier,
        paidAmount: Number(paidAmount) || 0,
    };
    
    if (isEditing && onUpdatePurchase && purchaseToEdit) {
        onUpdatePurchase(purchaseToEdit.id, purchaseData);
    } else {
        onAddPurchase(purchaseData);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{isEditing ? 'Edit Purchase Order' : 'New Purchase Order'}</h1>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Cancel</button>
        </div>
        
        {/* Purchase Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Add items */}
            <div className="border dark:border-gray-700 rounded-lg p-4 space-y-4">
                <h2 className="text-lg font-semibold">Add Products to Purchase Order</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Product</label>
                    <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md">
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Purchase Price (per item)</label>
                        <input type="number" step="0.01" value={purchasePrice} placeholder="0.00" onChange={e => setPurchasePrice(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                </div>
                <button onClick={handleAddItem} className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <PlusIcon className="mr-2" /> Add Item
                </button>
            </div>

            {/* Right side: Order summary */}
            <div className="border dark:border-gray-700 rounded-lg p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="flex items-center p-2 border-b dark:border-gray-700 mb-4">
                    <TruckIcon className="w-5 h-5 mr-2 text-gray-500" />
                    <select value={selectedSupplierId} onChange={e => setSelectedSupplierId(e.target.value)} className="w-full bg-transparent dark:bg-gray-900 focus:outline-none">
                        <option value="none">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <p className="text-center text-gray-500">No items in purchase order.</p>
                    ) : (
                        <ul className="space-y-2">
                            {items.map(item => (
                                <li key={item.productId} className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-semibold">{item.name} x {item.quantity}</p>
                                        <p className="text-xs text-gray-500">@ {CURRENCY_SYMBOL}{item.purchasePrice.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium mr-4">{CURRENCY_SYMBOL}{(item.purchasePrice * item.quantity).toFixed(2)}</span>
                                        <button onClick={() => removeFromItems(item.productId)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2 text-sm">
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{CURRENCY_SYMBOL}{total.toFixed(2)}</span></div>
                     <div className="flex justify-between items-center">
                        <span>Paid Amount</span>
                        <input type="number" value={paidAmount} placeholder="0.00" onChange={(e) => setPaidAmount(e.target.value)} className="w-24 p-1 text-right rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"/>
                    </div>
                    <div className="flex justify-between font-semibold"><span>Payable</span><span>{CURRENCY_SYMBOL}{payable.toFixed(2)}</span></div>
                     <button onClick={handleSubmit} disabled={items.length === 0} className="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                        {isEditing ? 'Update Purchase' : 'Complete Purchase'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default NewPurchaseView;
