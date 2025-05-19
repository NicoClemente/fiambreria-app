export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    description?: string;
    supplier?: string;
    barcode?: string;
  }
  
  export interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    movementType: 'entry' | 'exit' | 'adjustment';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    date: Date;
    user: string;
  }
  
  export interface CashRegister {
    id: string;
    openingAmount: number;
    closingAmount?: number;
    openingDate: Date;
    closingDate?: Date;
    user: string;
    status: 'open' | 'closed';
    sales: Sale[];
    expenses: Expense[];
  }
  
  export interface Sale {
    id: string;
    items: SaleItem[];
    total: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    date: Date;
    user: string;
  }
  
  export interface SaleItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }
  
  export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: Date;
    user: string;
  }
  
  export interface CashRegisterSummary {
    totalSales: number;
    totalExpenses: number;
    expectedTotal: number;
    difference: number;
    salesByPaymentMethod: {
      cash: number;
      card: number;
      transfer: number;
    };
  }