
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Customer, CartItem, Sale, CourierService } from '../types';
import { PlusIcon, MinusIcon, TrashIcon, UserIcon } from './icons/Icons';
import { CURRENCY_SYMBOL } from '../constants';

interface SellViewProps {
  products: Product[];
  customers: Customer[];
  couriers: CourierService[];
  onCompleteSale: (saleData: {cart: CartItem[], selectedCustomer?: Customer, discount: number, paidAmount: number, walkInCustomerName?: string, walkInCustomerPhone?: string, shippingDetails?: Sale['shippingDetails']}) => void;
  saleToEdit?: Sale | null;
  onUpdateSale?: (saleId: string, saleData: {cart: CartItem[], selectedCustomer?: Customer, discount: number, paidAmount: number, walkInCustomerName?: string, walkInCustomerPhone?: string, shippingDetails?: Sale['shippingDetails']}) => void;
  onCancelEdit?: () => void;
}

const SellView: React.FC<SellViewProps> = ({ products, customers, couriers, onCompleteSale, saleToEdit, onUpdateSale, onCancelEdit }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [walkInCustomerName, setWalkInCustomerName] = useState('');
  const [walkInCustomerPhone, setWalkInCustomerPhone] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [selectedCourierId, setSelectedCourierId] = useState<string>('none');
  
  const isEditing = !!saleToEdit;

  useEffect(() => {
    if (isEditing && saleToEdit) {
        setCart(saleToEdit.items);
        setSelectedCustomerId(saleToEdit.customer?.id || 'none');
        setDiscount(saleToEdit.discount?.toString() || '');
        setPaidAmount(saleToEdit.paidAmount?.toString() || '');
        setWalkInCustomerName(saleToEdit.walkInCustomerName || '');
        setWalkInCustomerPhone(saleToEdit.walkInCustomerPhone || '');
        setShippingCost(saleToEdit.shippingDetails?.cost?.toString() || '');
        setSelectedCourierId(saleToEdit.shippingDetails?.courierId || 'none');
    } else {
        // Reset form for a new sale
        setCart([]);
        setSelectedCustomerId('none');
        setDiscount('');
        setPaidAmount('');
        setWalkInCustomerName('');
        setWalkInCustomerPhone('');
        setShippingCost('');
        setSelectedCourierId('none');
    }
  }, [saleToEdit, isEditing]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
            return prevCart.map(item =>
                item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return prevCart; // Do not add if stock limit reached
      }
      if (product.stock > 0) {
        return [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
      return prevCart;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
        const productInCatalog = products.find(p => p.id === productId);
        if (!productInCatalog) return prevCart;

        return prevCart.map(item => {
            if (item.productId === productId) {
                const newQuantity = item.quantity + delta;
                if (newQuantity > 0 && newQuantity <= productInCatalog.stock) {
                    return { ...item, quantity: newQuantity };
                } else if (newQuantity <= 0) {
                    return null; // Will be filtered out
                }
            }
            return item;
        }).filter((item): item is CartItem => item !== null);
    });
  };
  
  const handleQuantityInputChange = (productId: string, value: string) => {
    const newQuantity = parseInt(value, 10);

    setCart(prevCart => {
        // If input is cleared or invalid, remove the item
        if (isNaN(newQuantity) || newQuantity <= 0) {
            return prevCart.filter(item => item.productId !== productId);
        }

        const productInCatalog = products.find(p => p.id === productId);
        if (!productInCatalog) return prevCart;
        
        // Update quantity, but clamp to max stock
        return prevCart.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: Math.min(newQuantity, productInCatalog.stock) };
            }
            return item;
        });
    });
  };

  const updatePrice = (productId: string, newPrice: number) => {
    if (newPrice < 0) return; // Prevent negative prices
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, price: newPrice } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const { subtotal, total, due } = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal - (Number(discount) || 0) + (Number(shippingCost) || 0);
    const due = total - (Number(paidAmount) || 0);
    return { subtotal, total, due };
  }, [cart, discount, paidAmount, shippingCost]);

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
    if (cart.length === 0) return;
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const selectedCourier = couriers.find(c => c.id === selectedCourierId);

    const saleData = {
        cart,
        selectedCustomer: selectedCustomerId === 'none' ? undefined : selectedCustomer,
        discount: Number(discount) || 0,
        paidAmount: Number(paidAmount) || 0,
        walkInCustomerName: selectedCustomerId === 'none' ? walkInCustomerName : '',
        walkInCustomerPhone: selectedCustomerId === 'none' ? walkInCustomerPhone : '',
        shippingDetails: selectedCourierId !== 'none' && selectedCourier ? {
            courierId: selectedCourier.id,
            courierName: selectedCourier.name,
            cost: Number(shippingCost) || 0,
        } : undefined,
    };
    
    if (isEditing && onUpdateSale && saleToEdit) {
        onUpdateSale(saleToEdit.id, saleData);
    } else {
        onCompleteSale(saleData);
    }

    // Reset form
    setCart([]);
    setSelectedCustomerId('none');
    setDiscount('');
    setPaidAmount('');
    setWalkInCustomerName('');
    setWalkInCustomerPhone('');
    setShippingCost('');
    setSelectedCourierId('none');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Product Selection */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col h-full">
        <div className="p-4 border-b dark:border-gray-700">
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= (cart.find(item => item.productId === product.id)?.quantity || 0)}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col justify-between"
            >
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 break-words">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{CURRENCY_SYMBOL}{product.price.toFixed(2)}</p>
              <p className={`text-xs mt-1 ${product.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>Stock: {product.stock} kg</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col h-full">
        <h2 className="text-xl font-bold p-4 border-b dark:border-gray-700">{isEditing ? 'Edit Sale' : 'Current Sale'}</h2>
        <div className="flex items-center p-4 border-b dark:border-gray-700">
            <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
            <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full bg-transparent dark:bg-gray-900 focus:outline-none"
            >
                <option value="none">Walk-in Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
        {selectedCustomerId === 'none' && (
            <div className="p-4 border-b dark:border-gray-700 space-y-2">
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={walkInCustomerName}
                    onChange={(e) => setWalkInCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Customer Phone (Optional)"
                    value={walkInCustomerPhone}
                    onChange={(e) => setWalkInCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
        )}
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {cart.map(item => (
                <li key={item.productId} className="flex flex-col gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold flex-grow">{item.name}</p>
                      <button onClick={() => removeFromCart(item.productId)} className="p-1 text-red-500 hover:text-red-700 flex-shrink-0"><TrashIcon /></button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Price Input */}
                        <div className="flex items-center">
                            <span className="text-sm mr-1 text-gray-500">{CURRENCY_SYMBOL}</span>
                            <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updatePrice(item.productId, parseFloat(e.target.value) || 0)}
                                className="w-full sm:w-24 p-1 text-right rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                step="0.01"
                                min="0"
                            />
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center">
                            <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><MinusIcon /></button>
                             <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityInputChange(item.productId, e.target.value)}
                                className="w-16 p-1 text-center rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mx-1"
                                min="1"
                            />
                            <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon /></button>
                        </div>
                        {/* Item Total */}
                        <p className="w-full sm:w-24 text-right font-semibold">{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t dark:border-gray-700 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between items-center">
            <span>Discount</span>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0.00" className="w-24 p-1 text-right rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"/>
          </div>
           <div className="border-t dark:border-gray-700 pt-2 space-y-2">
                <div className="flex justify-between items-center">
                    <select value={selectedCourierId} onChange={(e) => setSelectedCourierId(e.target.value)} className="bg-transparent dark:bg-gray-900 focus:outline-none text-sm">
                        <option value="none">No Shipping</option>
                        {couriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="number" placeholder="0.00" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} 
                    disabled={selectedCourierId === 'none'}
                    className="w-24 p-1 text-right rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-700"/>
                </div>
            </div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{CURRENCY_SYMBOL}{total.toFixed(2)}</span></div>
          <div className="flex justify-between items-center">
            <span>Paid Amount</span>
            <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} placeholder="0.00" className="w-24 p-1 text-right rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"/>
          </div>
          <div className="flex justify-between font-semibold"><span>Due</span><span>{CURRENCY_SYMBOL}{due.toFixed(2)}</span></div>

          <button
            onClick={handleSubmit}
            disabled={cart.length === 0}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing ? 'Update Sale' : 'Checkout'}
          </button>
          {isEditing && (
              <button onClick={onCancelEdit} className="w-full mt-2 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors">
                Cancel Edit
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellView;
