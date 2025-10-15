
export type Language = 'en' | 'es' | 'ar';
export type UserRole = 'WAITER' | 'MANAGER' | 'ADMIN';

export interface Waiter {
  id: string;
  name: string;
  pin: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
}

export interface CustomizationOption {
    id: string;
    name: string;
    priceModifier: number;
}

export interface CustomizationCategory {
    id: string;
    name: string;
    type: 'single' | 'multiple';
    options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  ingredients: string[];
  customizations?: CustomizationCategory[];
  stockItemId: string;
  stockConsumption: number;
}

export interface OrderItem {
    id: string; // Unique ID for this specific item instance in the order
    menuItem: MenuItem;
    quantity: number;
    customizations: { [key: string]: CustomizationOption | CustomizationOption[] };
    removedIngredients: string[];
    totalPrice: number; // Price for one item with customizations
    timestamp: string;
    discount?: number; // percentage discount
}

export interface PartialPayment {
    method: 'cash' | 'card';
    amount: number;
}

export interface PaymentDetails {
    method: 'cash' | 'card' | 'split' | 'multiple';
    amount?: number;
    cashAmount?: number;
    cardAmount?: number;
    payments?: PartialPayment[];
}

export interface Order {
  id: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'paid' | 'on_credit' | 'cancelled';
  timestamp: string;
  tableNumber: number;
  area: Area;
  waiterId: string;
  notes: string;
  paymentDetails?: PaymentDetails;
  customerName?: string;
}

export interface HeldOrder {
    id: string;
    timestamp: string;
    tableNumber: number;
    area: Area;
    items: OrderItem[];
    notes: string;
    waiterId: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    lowStockThreshold: number;
}

export interface Transaction {
    id: string;
    type: 'sale' | 'manual';
    amount: number;
    timestamp: string;
    description: string;
    paymentMethod?: 'cash' | 'card' | 'multiple';
    tax: number;
    orderId?: number;
}

export interface RestaurantSettings {
    name: string;
    address: string;
    phone: string;
    footer: string;
}

export interface ShiftReport {
    id: string;
    status: 'OPEN' | 'CLOSED';
    openingBalance: number;
    dayOpenedTimestamp: string;
    dayClosedTimestamp: string | null;
    // Live values for open shift
    cashSales: number;
    cardSales: number;
    manualIncomeCash: number;
    manualIncomeCard: number;
    totalTax: number;
    // Final values for closed shift
    finalTotalRevenue?: number;
    finalTotalTax?: number;
    finalCashSales?: number;
    finalCardSales?: number;
    finalManualIncomeCash?: number;
    finalManualIncomeCard?: number;
}

export type Area = 'Bar' | 'VIP' | 'Barra' | 'Gaming';

export interface Table {
    id: string;
    number: number;
    area: Area;
    shape: 'square' | 'circle' | 'rectangle' | 'bar' | 'fixture';
    x: number;
    y: number;
    width: number;
    height: number;
}
