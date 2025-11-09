import React, { useState, useMemo } from 'react';
import { Sale, Purchase, Customer } from '../types';
import { CURRENCY_SYMBOL } from '../constants';

interface ReportsViewProps {
  sales: Sale[];
  purchases: Purchase[];
  customers: Customer[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ sales, purchases, customers }) => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases' | 'dues' | 'payables'>('sales');
  
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const {
    filteredSales,
    filteredPurchases,
    filteredDues,
    filteredPayables
  } = useMemo(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredSales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= start && saleDate <= end;
    });

    const filteredPurchases = purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      return purchaseDate >= start && purchaseDate <= end;
    });
    
    const filteredDues = filteredSales.filter(s => s.due > 0);
    const filteredPayables = filteredPurchases.filter(p => p.payable > 0);

    return { filteredSales, filteredPurchases, filteredDues, filteredPayables };
  }, [sales, purchases, startDate, endDate]);


  const salesReport = useMemo(() => {
    const totalRevenue = filteredSales.reduce((acc, s) => acc + s.total, 0);
    const totalDiscount = filteredSales.reduce((acc, s) => acc + s.discount, 0);
    return {
      totalRevenue,
      totalDiscount,
      totalTransactions: filteredSales.length,
      list: filteredSales,
    };
  }, [filteredSales]);
  
  const purchasesReport = useMemo(() => {
    const totalSpent = filteredPurchases.reduce((acc, p) => acc + p.total, 0);
    const totalItems = filteredPurchases.reduce((acc, p) => acc + p.items.length, 0);
    return {
      totalSpent,
      totalItems,
      totalTransactions: filteredPurchases.length,
      list: filteredPurchases,
    };
  }, [filteredPurchases]);
  
   const duesReport = useMemo(() => {
    const newDues = filteredDues.reduce((acc, s) => acc + s.due, 0);
    return {
      newDues,
      totalTransactions: filteredDues.length,
      list: filteredDues,
    };
  }, [filteredDues]);
  
   const payablesReport = useMemo(() => {
    const newPayables = filteredPayables.reduce((acc, p) => acc + p.payable, 0);
    return {
      newPayables,
      totalTransactions: filteredPayables.length,
      list: filteredPayables,
    };
  }, [filteredPayables]);


  const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'sales':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Revenue" value={`${CURRENCY_SYMBOL}${salesReport.totalRevenue.toFixed(2)}`} />
              <StatCard title="Total Discounts" value={`${CURRENCY_SYMBOL}${salesReport.totalDiscount.toFixed(2)}`} />
              <StatCard title="Total Transactions" value={salesReport.totalTransactions} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Invoice #</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport.list.map(sale => (
                    <tr key={sale.id} className="border-b dark:border-gray-700">
                      <td className="p-4">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="p-4">{sale.invoiceNumber}</td>
                      <td className="p-4">{sale.customer?.name || sale.walkInCustomerName || 'Walk-in'}</td>
                      <td className="p-4 text-right">{CURRENCY_SYMBOL}{sale.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'purchases':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Spent" value={`${CURRENCY_SYMBOL}${purchasesReport.totalSpent.toFixed(2)}`} />
              <StatCard title="Total Items Purchased" value={purchasesReport.totalItems} />
              <StatCard title="Total Transactions" value={purchasesReport.totalTransactions} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">PO #</th>
                    <th className="p-4 font-semibold">Supplier</th>
                    <th className="p-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasesReport.list.map(purchase => (
                    <tr key={purchase.id} className="border-b dark:border-gray-700">
                      <td className="p-4">{new Date(purchase.date).toLocaleDateString()}</td>
                      <td className="p-4">{purchase.poNumber}</td>
                      <td className="p-4">{purchase.supplier?.name || 'N/A'}</td>
                      <td className="p-4 text-right">{CURRENCY_SYMBOL}{purchase.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'dues':
        return (
           <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <StatCard title="New Dues Created" value={`${CURRENCY_SYMBOL}${duesReport.newDues.toFixed(2)}`} />
              <StatCard title="Transactions with New Dues" value={duesReport.totalTransactions} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Invoice #</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold text-right">Due Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {duesReport.list.map(sale => (
                    <tr key={sale.id} className="border-b dark:border-gray-700">
                      <td className="p-4">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="p-4">{sale.invoiceNumber}</td>
                      <td className="p-4">{sale.customer?.name || sale.walkInCustomerName || 'Walk-in'}</td>
                      <td className="p-4 text-right text-red-500 font-medium">{CURRENCY_SYMBOL}{sale.due.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'payables':
        return (
           <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <StatCard title="New Payables Created" value={`${CURRENCY_SYMBOL}${payablesReport.newPayables.toFixed(2)}`} />
              <StatCard title="Transactions with New Payables" value={payablesReport.totalTransactions} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">PO #</th>
                    <th className="p-4 font-semibold">Supplier</th>
                    <th className="p-4 font-semibold text-right">Payable Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payablesReport.list.map(purchase => (
                    <tr key={purchase.id} className="border-b dark:border-gray-700">
                      <td className="p-4">{new Date(purchase.date).toLocaleDateString()}</td>
                      <td className="p-4">{purchase.poNumber}</td>
                      <td className="p-4">{purchase.supplier?.name || 'N/A'}</td>
                      <td className="p-4 text-right text-red-500 font-medium">{CURRENCY_SYMBOL}{purchase.payable.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium mb-1">From</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium mb-1">To</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md"/>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {['sales', 'purchases', 'dues', 'payables'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`${
                            activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                    >
                        {tab}
                    </button>
                ))}
                </nav>
            </div>
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};

export default ReportsView;
