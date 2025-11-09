import React, { useState, useEffect } from "react";
import {
  Product,
  Customer,
  Sale,
  CartItem,
  BusinessDetails,
  Supplier,
  Purchase,
  PurchaseItem,
  SaleReturn,
  PurchaseReturn,
  BackupData,
  CourierService,
} from "./types";
import Sidebar from "./components/Sidebar";
import SellView from "./components/POSView";
import ProductsView from "./components/ProductsView";
import CustomersView from "./components/CustomersView";
import SalesHistoryView from "./components/SalesHistoryView";
import Invoice from "./components/Invoice";
import SettingsView from "./components/SettingsView";
import SuppliersView from "./components/SuppliersView";
import PurchasesView from "./components/PurchasesView";
import NewPurchaseView from "./components/NewPurchaseView";
import DashboardView from "./components/DashboardView";
import ReportsView from "./components/ReportsView";
import ReturnsView from "./components/ReturnsView";
import BackupView from "./components/BackupView";
import ShippingView from "./components/ShippingView";

type View =
  | "dashboard"
  | "sell"
  | "sales"
  | "purchases"
  | "newPurchase"
  | "products"
  | "customers"
  | "suppliers"
  | "returns"
  | "shipping"
  | "reports"
  | "settings"
  | "backup"
  | "invoice";
  
const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [couriers, setCouriers] = useState<CourierService[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [saleReturns, setSaleReturns] = useState<SaleReturn[]>([]);
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([]);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    name: "Your Business Name",
    address: "123 Main Street, Anytown, USA",
    email: "contact@yourbusiness.com",
    phone: "555-123-4567",
    qrCode1_url: "",
    qrCode2_url: "",
    watermarkLogoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [saleToView, setSaleToView] = useState<Sale | null>(null);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const [purchaseToEdit, setPurchaseToEdit] = useState<Purchase | null>(null);
  const [invoiceCounter, setInvoiceCounter] = useState(1);
  const [poCounter, setPoCounter] = useState(1);
  
  // --- Data Persistence ---
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        const dataReviver = (key: string, value: any) => {
            if (['date', 'deliveryDate'].includes(key) && typeof value === 'string') {
                const date = new Date(value);
                if (!isNaN(date.getTime())) return date;
            }
            return value;
        };

        const storedProducts = localStorage.getItem("GEMINI_POS_PRODUCTS");
        if (storedProducts) setProducts(JSON.parse(storedProducts));

        const storedCustomers = localStorage.getItem("GEMINI_POS_CUSTOMERS");
        if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
        
        const storedSuppliers = localStorage.getItem("GEMINI_POS_SUPPLIERS");
        if (storedSuppliers) setSuppliers(JSON.parse(storedSuppliers));
        
        const storedCouriers = localStorage.getItem("GEMINI_POS_COURIERS");
        if (storedCouriers) setCouriers(JSON.parse(storedCouriers));
        
        const storedSales = localStorage.getItem("GEMINI_POS_SALES");
        if (storedSales) setSales(JSON.parse(storedSales, dataReviver));
        
        const storedPurchases = localStorage.getItem("GEMINI_POS_PURCHASES");
        if (storedPurchases) setPurchases(JSON.parse(storedPurchases, dataReviver));

        const storedSaleReturns = localStorage.getItem("GEMINI_POS_SALE_RETURNS");
        if (storedSaleReturns) setSaleReturns(JSON.parse(storedSaleReturns, dataReviver));
        
        const storedPurchaseReturns = localStorage.getItem("GEMINI_POS_PURCHASE_RETURNS");
        if (storedPurchaseReturns) setPurchaseReturns(JSON.parse(storedPurchaseReturns, dataReviver));

        const storedDetails = localStorage.getItem("GEMINI_POS_BUSINESS_DETAILS");
        if (storedDetails) setBusinessDetails(JSON.parse(storedDetails));

        const storedInvCounter = localStorage.getItem("GEMINI_POS_INVOICE_COUNTER");
        if (storedInvCounter) setInvoiceCounter(JSON.parse(storedInvCounter));

        const storedPoCounter = localStorage.getItem("GEMINI_POS_PO_COUNTER");
        if (storedPoCounter) setPoCounter(JSON.parse(storedPoCounter));

      } catch (error) {
        console.error("Failed to load data from localStorage", error);
        // Could implement a recovery/reset mechanism here
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => { localStorage.setItem("GEMINI_POS_PRODUCTS", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_CUSTOMERS", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_SUPPLIERS", JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_COURIERS", JSON.stringify(couriers)); }, [couriers]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_SALES", JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_PURCHASES", JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_SALE_RETURNS", JSON.stringify(saleReturns)); }, [saleReturns]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_PURCHASE_RETURNS", JSON.stringify(purchaseReturns)); }, [purchaseReturns]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_BUSINESS_DETAILS", JSON.stringify(businessDetails)); }, [businessDetails]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_INVOICE_COUNTER", JSON.stringify(invoiceCounter)); }, [invoiceCounter]);
  useEffect(() => { localStorage.setItem("GEMINI_POS_PO_COUNTER", JSON.stringify(poCounter)); }, [poCounter]);
  
  // --- Helper Functions ---
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // --- CRUD Functions (Local Logic) ---
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: generateId() };
    setProducts(prev => [...prev, newProduct]);
  };
  
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, "id">) => {
    setCustomers(prev => [...prev, { ...customer, id: generateId() }]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };
  
  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    setSuppliers(prev => [...prev, { ...supplier, id: generateId() }]);
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };
  
  const addSale = (saleData: any) => {
    const { cart, selectedCustomer, discount, paidAmount, walkInCustomerName, walkInCustomerPhone, shippingDetails } = saleData;

    const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    const total = subtotal - discount + (shippingDetails?.cost || 0);
    const due = total - paidAmount;

    const invoiceNumber = `INV-${String(invoiceCounter).padStart(5, '0')}`;
    setInvoiceCounter(prev => prev + 1);

    const newSale: Sale = {
        id: generateId(),
        invoiceNumber,
        items: cart,
        subtotal,
        discount,
        total,
        paidAmount,
        due,
        date: new Date(),
        ...(selectedCustomer && { customer: selectedCustomer }),
        ...(walkInCustomerName && { walkInCustomerName }),
        ...(walkInCustomerPhone && { walkInCustomerPhone }),
        ...(shippingDetails && { shippingDetails }),
    };

    setSales(prev => [...prev, newSale]);

    // Update product stock
    setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        cart.forEach((item: CartItem) => {
            const productIndex = newProducts.findIndex(p => p.id === item.productId);
            if (productIndex !== -1) {
                newProducts[productIndex].stock -= item.quantity;
            }
        });
        return newProducts;
    });

    // Update customer due
    if (selectedCustomer && due > 0) {
        setCustomers(prevCustomers => {
            const newCustomers = [...prevCustomers];
            const customerIndex = newCustomers.findIndex(c => c.id === selectedCustomer.id);
            if (customerIndex !== -1) {
                newCustomers[customerIndex].due_amount = (newCustomers[customerIndex].due_amount || 0) + due;
            }
            return newCustomers;
        });
    }

    setSaleToView(newSale);
    setCurrentView('invoice');
  };
  
  const updateSale = (saleId: string, saleData: any) => {
    const originalSale = sales.find(s => s.id === saleId);
    if (!originalSale) return;
    
    // 1. Revert original transaction effects
    let tempProducts = [...products];
    originalSale.items.forEach(item => {
        const productIndex = tempProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) tempProducts[productIndex].stock += item.quantity;
    });
    let tempCustomers = [...customers];
    if (originalSale.customer && originalSale.due > 0) {
        const customerIndex = tempCustomers.findIndex(c => c.id === originalSale.customer!.id);
        if (customerIndex !== -1) tempCustomers[customerIndex].due_amount = (tempCustomers[customerIndex].due_amount || 0) - originalSale.due;
    }

    // 2. Apply new transaction effects
    const { cart, selectedCustomer, discount, paidAmount, walkInCustomerName, walkInCustomerPhone, shippingDetails } = saleData;
    const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    const total = subtotal - discount + (shippingDetails?.cost || 0);
    const due = total - paidAmount;
    
    cart.forEach((item: CartItem) => {
        const productIndex = tempProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) tempProducts[productIndex].stock -= item.quantity;
    });
    if (selectedCustomer && due > 0) {
        const customerIndex = tempCustomers.findIndex(c => c.id === selectedCustomer.id);
        if (customerIndex !== -1) tempCustomers[customerIndex].due_amount = (tempCustomers[customerIndex].due_amount || 0) + due;
    }
    
    // 3. Update states
    const updatedSale: Sale = {
        ...originalSale,
        items: cart, subtotal, total, paidAmount, due, discount,
        customer: selectedCustomer, walkInCustomerName, walkInCustomerPhone, shippingDetails
    };
    setProducts(tempProducts);
    setCustomers(tempCustomers);
    setSales(prev => prev.map(s => s.id === saleId ? updatedSale : s));

    setSaleToView(updatedSale);
    setCurrentView('invoice');
    setSaleToEdit(null);
  };
  
  const deleteSale = (saleId: string) => {
    const saleToDelete = sales.find(s => s.id === saleId);
    if (!saleToDelete) return;
    
    setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        saleToDelete.items.forEach(item => {
            const productIndex = newProducts.findIndex(p => p.id === item.productId);
            if (productIndex > -1) newProducts[productIndex].stock += item.quantity;
        });
        return newProducts;
    });
    
    if (saleToDelete.customer && saleToDelete.due > 0) {
        setCustomers(prevCustomers => {
            const newCustomers = [...prevCustomers];
            const custIndex = newCustomers.findIndex(c => c.id === saleToDelete.customer?.id);
            if(custIndex > -1) newCustomers[custIndex].due_amount = (newCustomers[custIndex].due_amount || 0) - saleToDelete.due;
            return newCustomers;
        });
    }

    setSales(prev => prev.filter(s => s.id !== saleId));
  };

  const addPurchase = (data: any) => {
    const { items, selectedSupplier, paidAmount } = data;
    const total = items.reduce((acc: number, item: PurchaseItem) => acc + item.purchasePrice * item.quantity, 0);
    const payable = total - paidAmount;
    const poNumber = `PO-${String(poCounter).padStart(5, '0')}`;
    setPoCounter(prev => prev + 1);

    const newPurchase: Purchase = {
        id: generateId(), poNumber, items, total, paidAmount, payable, date: new Date(),
        ...(selectedSupplier && { supplier: selectedSupplier })
    };
    
    setPurchases(prev => [...prev, newPurchase]);

    setProducts(prev => {
        const newProducts = [...prev];
        items.forEach((item: PurchaseItem) => {
            const prodIndex = newProducts.findIndex(p => p.id === item.productId);
            if (prodIndex > -1) {
                newProducts[prodIndex].stock += item.quantity;
                // Optional: Update purchase price if needed
            }
        });
        return newProducts;
    });
    
    if (selectedSupplier && payable > 0) {
        setSuppliers(prev => {
            const newSuppliers = [...prev];
            const suppIndex = newSuppliers.findIndex(s => s.id === selectedSupplier.id);
            if(suppIndex > -1) newSuppliers[suppIndex].payable_amount = (newSuppliers[suppIndex].payable_amount || 0) + payable;
            return newSuppliers;
        });
    }
    
    setPurchaseToEdit(null);
    setCurrentView('purchases');
  };
  
  const updatePurchase = (purchaseId: string, data: any) => {
    const originalPurchase = purchases.find(p => p.id === purchaseId);
    if (!originalPurchase) return;

    // 1. Revert original effects
    let tempProducts = [...products];
    originalPurchase.items.forEach(item => {
      const productIndex = tempProducts.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) tempProducts[productIndex].stock -= item.quantity;
    });
    let tempSuppliers = [...suppliers];
    if (originalPurchase.supplier && originalPurchase.payable > 0) {
      const supplierIndex = tempSuppliers.findIndex(s => s.id === originalPurchase.supplier!.id);
      if (supplierIndex !== -1) tempSuppliers[supplierIndex].payable_amount = (tempSuppliers[supplierIndex].payable_amount || 0) - originalPurchase.payable;
    }

    // 2. Apply new effects
    const { items, selectedSupplier, paidAmount } = data;
    const total = items.reduce((acc: number, item: PurchaseItem) => acc + item.purchasePrice * item.quantity, 0);
    const payable = total - paidAmount;
    
    items.forEach((item: PurchaseItem) => {
      const productIndex = tempProducts.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) tempProducts[productIndex].stock += item.quantity;
    });
    if (selectedSupplier && payable > 0) {
      const supplierIndex = tempSuppliers.findIndex(s => s.id === selectedSupplier.id);
      if (supplierIndex !== -1) tempSuppliers[supplierIndex].payable_amount = (tempSuppliers[supplierIndex].payable_amount || 0) + payable;
    }

    // 3. Update states
    const updatedPurchase: Purchase = {
        ...originalPurchase, items, supplier: selectedSupplier, paidAmount, total, payable
    };
    setProducts(tempProducts);
    setSuppliers(tempSuppliers);
    setPurchases(prev => prev.map(p => p.id === purchaseId ? updatedPurchase : p));
    
    setPurchaseToEdit(null);
    setCurrentView('purchases');
  };


  const deletePurchase = (id: string) => {
    const purchaseToDelete = purchases.find(p => p.id === id);
    if (!purchaseToDelete) return;

    setProducts(prev => {
        const newProds = [...prev];
        purchaseToDelete.items.forEach(item => {
            const prodIndex = newProds.findIndex(p => p.id === item.productId);
            if (prodIndex > -1) newProds[prodIndex].stock -= item.quantity;
        });
        return newProds;
    });

    if (purchaseToDelete.supplier && purchaseToDelete.payable > 0) {
        setSuppliers(prev => {
            const newSupps = [...prev];
            const suppIndex = newSupps.findIndex(s => s.id === purchaseToDelete.supplier?.id);
            if (suppIndex > -1) newSupps[suppIndex].payable_amount = (newSupps[suppIndex].payable_amount || 0) - purchaseToDelete.payable;
            return newSupps;
        });
    }

    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const createSaleReturn = (sale: Sale, items: CartItem[], reason: string) => {
    const totalRefund = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newSaleReturn: SaleReturn = {
      id: generateId(),
      originalSaleId: sale.id,
      invoiceNumber: sale.invoiceNumber,
      customerName: sale.customer?.name || sale.walkInCustomerName || 'Walk-in',
      items,
      totalRefund,
      date: new Date(),
      reason,
    };
    setSaleReturns(prev => [...prev, newSaleReturn]);

    setProducts(prev => {
      const newProds = [...prev];
      items.forEach(item => {
        const prodIndex = newProds.findIndex(p => p.id === item.productId);
        if (prodIndex > -1) newProds[prodIndex].stock += item.quantity;
      });
      return newProds;
    });

    if (sale.customer) {
      setCustomers(prev => {
        const newCusts = [...prev];
        const custIndex = newCusts.findIndex(c => c.id === sale.customer!.id);
        if (custIndex > -1) newCusts[custIndex].due_amount = Math.max(0, (newCusts[custIndex].due_amount || 0) - totalRefund);
        return newCusts;
      });
    }
    alert('✅ Sale return processed successfully!');
  };
  
  const createPurchaseReturn = (purchase: Purchase, items: PurchaseItem[], reason: string) => {
    const totalCredit = items.reduce((acc, item) => acc + item.purchasePrice * item.quantity, 0);
    const newPurchaseReturn: PurchaseReturn = {
        id: generateId(),
        originalPurchaseId: purchase.id,
        poNumber: purchase.poNumber,
        supplierName: purchase.supplier?.name || 'N/A',
        items,
        totalCredit,
        date: new Date(),
        reason,
    };
    setPurchaseReturns(prev => [...prev, newPurchaseReturn]);

    setProducts(prev => {
        const newProds = [...prev];
        items.forEach(item => {
            const prodIndex = newProds.findIndex(p => p.id === item.productId);
            if (prodIndex > -1) newProds[prodIndex].stock -= item.quantity;
        });
        return newProds;
    });

    if (purchase.supplier) {
        setSuppliers(prev => {
            const newSupps = [...prev];
            const suppIndex = newSupps.findIndex(s => s.id === purchase.supplier!.id);
            if (suppIndex > -1) newSupps[suppIndex].payable_amount = Math.max(0, (newSupps[suppIndex].payable_amount || 0) - totalCredit);
            return newSupps;
        });
    }
    alert('✅ Purchase return processed successfully!');
  };

  const recordCustomerPayment = (id: string, amount: number) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, due_amount: Math.max(0, (c.due_amount || 0) - amount) } : c));
    alert(`✅ Payment of ${amount} recorded.`);
  };

  const recordSupplierPayment = (id: string, amount: number) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, payable_amount: Math.max(0, (s.payable_amount || 0) - amount) } : s));
    alert(`✅ Payment of ${amount} made.`);
  };
  
  const saveBusinessDetails = (details: BusinessDetails) => {
      setBusinessDetails(details);
      alert('✅ Business details saved!');
  };
  
  const addCourier = (courier: Omit<CourierService, 'id'>) => {
    setCouriers(prev => [...prev, { ...courier, id: generateId() }]);
  };
  const updateCourier = (courier: CourierService) => {
    setCouriers(prev => prev.map(c => c.id === courier.id ? courier : c));
  };
  const deleteCourier = (id: string) => {
    setCouriers(prev => prev.filter(c => c.id !== id));
  };

  const handleExport = () => {
      const backupData: BackupData = {
          products, customers, suppliers, sales, purchases, 
          saleReturns, purchaseReturns, businessDetails, couriers,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `gemini-pos-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
  };

  const handleImport = (data: BackupData) => {
      if (!window.confirm("Are you sure you want to restore data? This will overwrite everything.")) return;
      setProducts(data.products || []);
      setCustomers(data.customers || []);
      setSuppliers(data.suppliers || []);
      setCouriers(data.couriers || []);
      setSales((data.sales || []).map(s => ({...s, date: new Date(s.date)})));
      setPurchases((data.purchases || []).map(p => ({...p, date: new Date(p.date)})));
      setSaleReturns((data.saleReturns || []).map(sr => ({...sr, date: new Date(sr.date)})));
      setPurchaseReturns((data.purchaseReturns || []).map(pr => ({...pr, date: new Date(pr.date)})));
      setBusinessDetails(data.businessDetails || businessDetails);
      // Counters might need resetting or deriving from imported data. For simplicity, we just log.
      console.log("Data imported. Counters may need manual adjustment if IDs conflict.");
      alert("✅ Data imported successfully!");
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard": return <DashboardView sales={sales} customers={customers} purchases={purchases} suppliers={suppliers} onRecordCustomerPayment={recordCustomerPayment} onRecordSupplierPayment={recordSupplierPayment} />;
      case "sell": return <SellView products={products} customers={customers} couriers={couriers} onCompleteSale={addSale} saleToEdit={saleToEdit} onUpdateSale={updateSale} onCancelEdit={() => { setSaleToEdit(null); setCurrentView('sales'); }} />;
      case "sales": return <SalesHistoryView sales={sales} onViewInvoice={(sale) => { setSaleToView(sale); setCurrentView('invoice'); }} onEditSale={(sale) => { setSaleToEdit(sale); setCurrentView('sell'); }} onDeleteSale={deleteSale} onCreateReturn={createSaleReturn} />;
      case "purchases": return <PurchasesView purchases={purchases} onNewPurchase={() => setCurrentView('newPurchase')} onEditPurchase={(p) => { setPurchaseToEdit(p); setCurrentView('newPurchase'); }} onDeletePurchase={deletePurchase} onCreateReturn={createPurchaseReturn} />;
      case "newPurchase": return <NewPurchaseView products={products} suppliers={suppliers} onAddPurchase={addPurchase} onCancel={() => { setPurchaseToEdit(null); setCurrentView('purchases'); }} purchaseToEdit={purchaseToEdit} onUpdatePurchase={updatePurchase} />;
      case "products": return <ProductsView products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />;
      case "customers": return <CustomersView customers={customers} onAddCustomer={addCustomer} onUpdateCustomer={updateCustomer} onDeleteCustomer={deleteCustomer} />;
      case "suppliers": return <SuppliersView suppliers={suppliers} onAddSupplier={addSupplier} onUpdateSupplier={updateSupplier} onDeleteSupplier={deleteSupplier} />;
      case "returns": return <ReturnsView saleReturns={saleReturns} purchaseReturns={purchaseReturns} />;
      case "shipping": return <ShippingView couriers={couriers} onAddCourier={addCourier} onUpdateCourier={updateCourier} onDeleteCourier={deleteCourier} />;
      case "reports": return <ReportsView sales={sales} purchases={purchases} customers={customers} />;
      case "settings": return <SettingsView details={businessDetails} onSaveDetails={saveBusinessDetails} />;
      case "backup": return <BackupView onExport={handleExport} onImport={handleImport} />;
      case "invoice": return saleToView ? <Invoice sale={saleToView} businessDetails={businessDetails} onBack={() => { setSaleToView(null); setCurrentView('sales'); }} onSave={(s) => { /* Invoice save is illustrative; main save is via POS view */ }} /> : <p>No sale selected.</p>;
      default: return null;
    }
  };

  if (loading) {
      return <div className="text-center p-10"><p className="animate-pulse">Loading data from your browser...</p></div>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <Sidebar
            currentView={currentView}
            setCurrentView={(view: View) => {
            setSaleToEdit(null);
            setPurchaseToEdit(null);
            setCurrentView(view);
            }}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderView()}
        </main>
    </div>
  );
};

export default App;
