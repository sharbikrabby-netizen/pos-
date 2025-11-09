import React, { useMemo, useState } from 'react';
import { Sale, Customer, Purchase, Supplier } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { CreditCardIcon } from './icons/Icons';
import PaymentModal from './PaymentModal';

type PaymentTarget = {
    id: string;
    name: string;
    amount: number;
    type: 'customer' | 'supplier';
}

interface DashboardViewProps {
  sales: Sale[];
  customers: Customer[];
  purchases: Purchase[];
  suppliers: Supplier[];
  onRecordCustomerPayment: (customerId: string, amount: number) => void;
  onRecordSupplierPayment: (supplierId: string, amount: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ sales, customers, purchases, suppliers, onRecordCustomerPayment, onRecordSupplierPayment }) => {
  const [customerSearch, setCustomerSearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);

  const { totalDue, customersWithDue } = useMemo(() => {
    const dueMap = new Map<string, { id: string, name: string; phone: string; due: number }>();
    let totalDue = 0;

    sales.forEach(sale => {
      if (sale.due <= 0) return;
      
      let customerId = sale.customer?.id;
      let customerName = sale.customer?.name;
      let customerPhone = sale.customer?.phone;

      // Only add to total due if it's a registered customer
      if (customerId && customerName) {
        totalDue += sale.due;
        const existingDue = dueMap.get(customerId) || { id: customerId, name: customerName, phone: customerPhone!, due: 0 };
        dueMap.set(customerId, { ...existingDue, due: existingDue.due + sale.due });
      } else if (sale.walkInCustomerName){
          // We can track walk-in customer dues for display, but can't take payment later
           totalDue += sale.due;
           customerId = `walkin_${sale.id}`; // Give a unique ID for the list
           customerName = `${sale.walkInCustomerName} (Walk-in)`;
           customerPhone = sale.walkInCustomerPhone || 'N/A';
           const existingDue = dueMap.get(customerId) || { id: customerId, name: customerName, phone: customerPhone!, due: 0 };
           dueMap.set(customerId, { ...existingDue, due: existingDue.due + sale.due });
      }
    });
    return { totalDue, customersWithDue: Array.from(dueMap.values()) };
  }, [sales]);

  const { totalPayable, suppliersToPay } = useMemo(() => {
    const payableMap = new Map<string, { id: string, name: string; phone: string; payable: number }>();
    let totalPayable = 0;

    purchases.forEach(purchase => {
        if (purchase.payable <= 0 || !purchase.supplier) return;
        totalPayable += purchase.payable;
        const supplier = purchase.supplier;
        const existingPayable = payableMap.get(supplier.id) || { id: supplier.id, name: supplier.name, phone: supplier.phone!, payable: 0 };
        payableMap.set(supplier.id, { ...existingPayable, payable: existingPayable.payable + purchase.payable });
    });
    return { totalPayable, suppliersToPay: Array.from(payableMap.values())};
  }, [purchases]);


  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customersWithDue;
    return customersWithDue.filter(c =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customersWithDue, customerSearch]);

  const filteredSuppliers = useMemo(() => {
      if (!supplierSearch) return suppliersToPay;
      return suppliersToPay.filter(s =>
        s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
        s.phone!.toLowerCase().includes(supplierSearch.toLowerCase())
      );
  }, [suppliersToPay, supplierSearch]);

  const handleSavePayment = (id: string, type: 'customer' | 'supplier', amount: number) => {
    if (type === 'customer') {
        onRecordCustomerPayment(id, amount);
    } else {
        onRecordSupplierPayment(id, amount);
    }
    setPaymentTarget(null);
  };


  const StatCard: React.FC<{ title: string; value: string | number; theme?: 'green' | 'red' }> = ({ title, value, theme = 'green' }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${theme === 'red' ? 'text-red-500' : 'text-green-500'}`}>{value}</p>
    </div>
  );

  return (
    <>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Overview</h1>
      
      {/* Accounts Receivable */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Accounts Receivable (Customer Dues)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Outstanding Due" value={`${CURRENCY_SYMBOL}${totalDue.toFixed(2)}`} theme="green" />
            <StatCard title="Customers with Due" value={customersWithDue.length} theme="green" />
        </div>
      </div>
      
      {/* Accounts Payable */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Accounts Payable (Supplier Payables)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Outstanding Payable" value={`${CURRENCY_SYMBOL}${totalPayable.toFixed(2)}`} theme="red" />
            <StatCard title="Suppliers to Pay" value={suppliersToPay.length} theme="red" />
        </div>
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Due Customers List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Customers with Dues</h2>
                <input type="text" placeholder="Search customers..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full max-w-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold text-right">Amount Due</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredCustomers.length === 0 ? (
                    <tr><td colSpan={4} className="text-center p-4 text-gray-500">{customerSearch ? 'No matches found.' : 'No customers have dues.'}</td></tr>
                ) : (
                    filteredCustomers.map(c => {
                        const isWalkIn = c.id.startsWith('walkin_');
                        return (
                            <tr key={c.id} className="border-b dark:border-gray-700">
                                <td className="p-4">{c.name}</td>
                                <td className="p-4">{c.phone}</td>
                                <td className="p-4 text-right font-medium text-green-500">{CURRENCY_SYMBOL}{c.due.toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => setPaymentTarget({ id: c.id, name: c.name, amount: c.due, type: 'customer' })}
                                        disabled={isWalkIn}
                                        className="flex items-center mx-auto px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm rounded-md hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-100 dark:disabled:hover:bg-green-900"
                                        title={isWalkIn ? "Cannot record payment for a walk-in customer" : "Record Payment"}
                                    >
                                        <CreditCardIcon className="mr-1 w-4 h-4" /> Record Payment
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                )}
                </tbody>
            </table>
            </div>
        </div>

        {/* Payable Suppliers List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Suppliers with Payables</h2>
                <input type="text" placeholder="Search suppliers..." value={supplierSearch} onChange={(e) => setSupplierSearch(e.target.value)}
                    className="w-full max-w-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="p-4 font-semibold">Supplier</th>
                        <th className="p-4 font-semibold">Phone</th>
                        <th className="p-4 font-semibold text-right">Amount Payable</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {filteredSuppliers.length === 0 ? (
                    <tr><td colSpan={4} className="text-center p-4 text-gray-500">{supplierSearch ? 'No matches found.' : 'No suppliers have payables.'}</td></tr>
                ) : (
                    filteredSuppliers.map(s => (
                    <tr key={s.id} className="border-b dark:border-gray-700">
                        <td className="p-4">{s.name}</td>
                        <td className="p-4">{s.phone}</td>
                        <td className="p-4 text-right font-medium text-red-500">{CURRENCY_SYMBOL}{s.payable.toFixed(2)}</td>
                         <td className="p-4 text-center">
                            <button
                                onClick={() => setPaymentTarget({ id: s.id, name: s.name, amount: s.payable, type: 'supplier' })}
                                className="flex items-center mx-auto px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                            >
                                <CreditCardIcon className="mr-1 w-4 h-4" /> Make Payment
                            </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
    {paymentTarget && (
        <PaymentModal
            isOpen={!!paymentTarget}
            onClose={() => setPaymentTarget(null)}
            target={paymentTarget}
            onSavePayment={handleSavePayment}
        />
    )}
    </>
  );
};

export default DashboardView;
