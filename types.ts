export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  due_amount?: number;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  payable_amount?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customer?: Customer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingDetails?: {
    courierId: string;
    courierName: string;
    cost: number;
  };
  total: number;
  paidAmount: number;
  due: number;
  date: Date;
  challanNumber?: string;
  billNumber?: string;
  poNumber?: string;
  deliveryDate?: string;
  walkInCustomerName?: string;
  walkInCustomerPhone?: string;
}

export interface BusinessDetails {
    name: string;
    address: string;
    email: string;
    phone: string;
    qrCode1_url?: string;
    qrCode2_url?: string;
    watermarkLogoUrl?: string;
}

export interface PurchaseItem {
    productId: string;
    name: string;
    purchasePrice: number;
    quantity: number;
}

export interface Purchase {
    id: string;
    poNumber: string;
    supplier?: Supplier;
    items: PurchaseItem[];
    total: number;
    paidAmount: number;
    payable: number;
    date: Date;
}

export interface SaleReturn {
  id: string;
  originalSaleId: string;
  invoiceNumber: string;
  customerName: string;
  items: CartItem[];
  totalRefund: number;
  date: Date;
  reason: string;
}

export interface PurchaseReturn {
  id: string;
  originalPurchaseId: string;
  poNumber: string;
  supplierName: string;
  items: PurchaseItem[];
  totalCredit: number;
  date: Date;
  reason: string;
}

export interface CourierService {
  id: string;
  name: string;
  portalUrl: string;
  apiKey: string;
  apiSecret: string;
}

export interface BackupData {
    products: Product[];
    customers: Customer[];
    suppliers: Supplier[];
    sales: Sale[];
    purchases: Purchase[];
    saleReturns: SaleReturn[];
    purchaseReturns: PurchaseReturn[];
    businessDetails: BusinessDetails;
    couriers: CourierService[];
}