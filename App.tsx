import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './utils/hooks';
import {
  Waiter, Language, MenuItem, Category, OrderItem,
  Order, InventoryItem, CustomizationOption, ShiftReport,
  Transaction, HeldOrder, RestaurantSettings, Table, Area, UserRole
} from './types';
import { mockWaiters, mockCategories, mockMenuItems, mockInventory, mockTables, mockRestaurantSettings } from './data/mockData';
import { TAX_RATE } from './constants';
import { translations } from './translations';
import WaiterSelectionScreen from './components/WaiterSelectionScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Menu from './components/Menu';
import CurrentOrder from './components/CurrentOrder';
import OrderQueue from './components/OrderQueue';
import CustomizationModal from './components/CustomizationModal';
import PaymentModal from './components/PaymentModal';
import PinModal from './components/PinModal';
import OpeningBalanceModal from './components/OpeningBalanceModal';
import AdminView from './components/admin/AdminView';
import ShiftSummaryModal from './components/admin/ShiftSummaryModal';
import WaiterShiftSummaryModal from './components/WaiterShiftSummaryModal';
import ConfirmationModal from './components/ConfirmationModal';
import CreditConfirmationModal from './components/admin/CreditConfirmationModal';
import ReceiptPreviewModal from './components/ReceiptPreviewModal';
import TableSelectionScreen from './components/TableSelectionScreen';
import TableActionsModal from './components/TableActionsModal';
import HeldOrderActionsModal from './components/HeldOrderActionsModal';

const App: React.FC = () => {
  // State Management
  const [lang, setLang] = useLocalStorage<Language>('pos-lang', 'ar');
  const [waiters, setWaiters] = useLocalStorage<Waiter[]>('pos-waiters', mockWaiters);
  const [categories, setCategories] = useLocalStorage<Category[]>('pos-categories', mockCategories);
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('pos-menu-items', mockMenuItems);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('pos-inventory', mockInventory);
  const [orders, setOrders] = useLocalStorage<Order[]>('pos-orders', []);
  const [heldOrders, setHeldOrders] = useLocalStorage<HeldOrder[]>('pos-held-orders', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('pos-transactions', []);
  const [shifts, setShifts] = useLocalStorage<ShiftReport[]>('pos-shifts', []);
  const [tables, setTables] = useLocalStorage<Table[]>('pos-tables', mockTables);
  const [restaurantSettings, setRestaurantSettings] = useLocalStorage<RestaurantSettings>('pos-settings', mockRestaurantSettings);
  const [pins, setPins] = useLocalStorage<{ [key in UserRole]?: string }>('pos-pins', { MANAGER: '0000', ADMIN: '4714' });


  const [activeView, setActiveView] = useState<'tables' | 'queue' | 'credit' | 'admin'>('tables');
  const [currentWaiter, setCurrentWaiter] = useState<Waiter | null>(null);
  const [overrideRole, setOverrideRole] = useState<UserRole | null>(null);
  
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [currentOrderNotes, setCurrentOrderNotes] = useState('');
  const [currentTable, setCurrentTable] = useState<{ number: number; area: Area } | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [originalItemIds, setOriginalItemIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');

  const [pinRequest, setPinRequest] = useState<{
    isOpen: boolean;
    title?: string;
    onConfirm?: (pin: string) => void;
  }>({ isOpen: false });

  const [isCustomizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [itemToCustomize, setItemToCustomize] = useState<MenuItem | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);
  const [isOpeningBalanceModalOpen, setOpeningBalanceModalOpen] = useState(false);
  const [isShiftSummaryModalOpen, setShiftSummaryModalOpen] = useState(false);
  const [isWaiterShiftSummaryModalOpen, setWaiterShiftSummaryModalOpen] = useState(false);
  const [lastClosedShift, setLastClosedShift] = useState<ShiftReport | null>(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationProps, setConfirmationProps] = useState({ title: '', message: '', onConfirm: () => {} });
  const [isCreditConfirmationOpen, setCreditConfirmationOpen] = useState(false);
  const [isReceiptPreviewOpen, setReceiptPreviewOpen] = useState(false);
  const [isTableActionsModalOpen, setTableActionsModalOpen] = useState(false);
  const [isHeldOrderActionsModalOpen, setHeldOrderActionsModalOpen] = useState(false);
  const [selectedOrderForActions, setSelectedOrderForActions] = useState<Order | null>(null);
  const [selectedHeldOrder, setSelectedHeldOrder] = useState<HeldOrder | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area>('Bar');

  const activeShift = shifts.find(s => s.status === 'OPEN');
  
  // Translation function
  const t = (key: string, params: any = {}): string => {
    let translation = translations[lang][key] || key;
    Object.keys(params).forEach(p => {
        translation = translation.replace(`{${p}}`, params[p]);
    });
    return translation;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Derived state for current order calculations
  const subtotal = useMemo(() => currentOrderItems.reduce((acc, item) => acc + (item.totalPrice * (1 - (item.discount || 0) / 100) * item.quantity), 0), [currentOrderItems]);
  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  // Handlers
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

  const handleWaiterSelect = (waiter: Waiter) => {
    setPinRequest({
      isOpen: true,
      title: t('enterPinFor', { name: waiter.name }),
      onConfirm: (pin: string) => {
        if (waiter.pin === pin) {
          setCurrentWaiter(waiter);
          setPinRequest({ isOpen: false });
        } else {
          alert(t('incorrectPin'));
        }
      }
    });
  };

  const handleNavigate = (view: 'tables' | 'queue' | 'credit' | 'admin') => {
    if (view !== 'admin') {
      setOverrideRole(null);
    }
    
    if (view === 'admin' && currentWaiter?.role === 'WAITER') {
      setPinRequest({
        isOpen: true,
        title: t('adminAccess'),
        onConfirm: (pin) => {
          if (pin === pins.ADMIN) {
            setOverrideRole('ADMIN');
            setActiveView('admin');
            setPinRequest({ isOpen: false });
          } else if (pin === pins.MANAGER) {
            setOverrideRole('MANAGER');
            setActiveView('admin');
            setPinRequest({ isOpen: false });
          } else {
            alert(t('incorrectPin'));
          }
        }
      });
      return;
    }
    
    setActiveView(view);
  };

  const handleLogout = () => {
    setCurrentWaiter(null);
    setOverrideRole(null);
    setActiveView('tables');
  };

  const handleSelectTable = (tableNumber: number, area: Area) => {
    const heldOrder = heldOrders.find(ho => ho.tableNumber === tableNumber && ho.area === area);
    if (heldOrder) {
        setSelectedHeldOrder(heldOrder);
        setHeldOrderActionsModalOpen(true);
    } else {
        setCurrentTable({ number: tableNumber, area });
    }
  };

  const handleOpenTableActions = (order: Order) => {
    setSelectedOrderForActions(order);
    setTableActionsModalOpen(true);
  };

  const handleResumeHeldOrder = (heldOrder: HeldOrder) => {
    if (!currentWaiter) return;
    setCurrentTable({ number: heldOrder.tableNumber, area: heldOrder.area });
    setCurrentOrderItems(heldOrder.items);
    setCurrentOrderNotes(heldOrder.notes);
    setHeldOrders(prev => prev.filter(ho => ho.id !== heldOrder.id));
    setHeldOrderActionsModalOpen(false);
  };
  
  const handleStartNewOrderOnHeldTable = (heldOrder: HeldOrder) => {
    setConfirmationProps({
      title: t('discardHeldOrder'),
      message: t('discardHeldOrderConfirmation'),
      onConfirm: () => {
        setHeldOrders(prev => prev.filter(ho => ho.id !== heldOrder.id));
        setCurrentTable({ number: heldOrder.tableNumber, area: heldOrder.area });
        setHeldOrderActionsModalOpen(false);
      }
    });
    setConfirmationModalOpen(true);
  };

  const handleCustomizeItem = (item: MenuItem) => {
    setItemToCustomize(item);
    setCustomizationModalOpen(true);
  };

  const handleSelectItem = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      handleCustomizeItem(item);
    } else {
      handleAddToCart({
        menuItem: item,
        quantity: 1,
        customizations: {},
        removedIngredients: [],
        totalPrice: item.price
      });
    }
  };

  const handleAddToCart = (customizedItem: {
    menuItem: MenuItem;
    quantity: number;
    customizations: { [key: string]: CustomizationOption | CustomizationOption[] };
    removedIngredients: string[];
    totalPrice: number;
  }) => {
    const getItemSignature = (item: {
        menuItem: MenuItem;
        customizations: { [key: string]: CustomizationOption | CustomizationOption[] };
        removedIngredients: string[];
    }) => {
        const customizationParts: string[] = [];
        const custKeys = Object.keys(item.customizations).sort();
        for (const key of custKeys) {
            const val = item.customizations[key];
            if (Array.isArray(val) && val.length > 0) {
                // Fix: Add explicit type to map parameter to prevent 'unknown' type inference.
                const ids = val.map((o: CustomizationOption) => o.id).sort().join(',');
                customizationParts.push(`${key}:${ids}`);
            } else if (val && !Array.isArray(val)) {
                customizationParts.push(`${key}:${(val as CustomizationOption).id}`);
            }
        }
        const customizationSignature = customizationParts.join(';');
        const ingredientsSignature = [...item.removedIngredients].sort().join(',');

        return `${item.menuItem.id}|${customizationSignature}|${ingredientsSignature}`;
    };

    const newItemSignature = getItemSignature(customizedItem);
    // Fix: Add explicit type to find parameter to prevent 'unknown' type inference.
    const existingItem = currentOrderItems.find((item: OrderItem) => getItemSignature(item) === newItemSignature && !originalItemIds.has(item.id));

    if (existingItem) {
        // Fix: Explicitly type the 'item' parameter in the map function to resolve type inference issues.
        setCurrentOrderItems(prev => prev.map((item: OrderItem) =>
            item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    } else {
        const newOrderItem: OrderItem = {
            id: `item-${Date.now()}`,
            menuItem: customizedItem.menuItem,
            quantity: 1,
            customizations: customizedItem.customizations,
            removedIngredients: customizedItem.removedIngredients,
            totalPrice: customizedItem.totalPrice, // Price per single item, pre-tax.
            timestamp: new Date().toISOString(),
        };
        setCurrentOrderItems(prev => [...prev, newOrderItem]);
    }
    setCustomizationModalOpen(false);
  };
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    setCurrentOrderItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };
  
  const handleUpdateItemDiscount = (itemId: string, discount: number) => {
    const val = Math.max(0, Math.min(100, discount));
    setCurrentOrderItems(prev => prev.map(item => item.id === itemId ? { ...item, discount: val } : item));
  }

  const handleRemoveItem = (itemId: string) => {
    setCurrentOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const resetCurrentOrder = () => {
    setCurrentOrderItems([]);
    setCurrentOrderNotes('');
    setCurrentTable(null);
    setEditingOrder(null);
    setOriginalItemIds(new Set());
    setSelectedCategory(categories[0]?.id || '');
  };
  
  const handleSubmitOrder = () => {
    if (!currentWaiter || (!currentTable && !editingOrder) || currentOrderItems.length === 0) return;
    
    // Atomically update inventory and orders
    setInventory(prevInventory => {
      // Fix: Explicitly type the inventoryMap to resolve type inference issue.
      const inventoryMap: Map<string, InventoryItem> = new Map(prevInventory.map(i => [i.id, { ...i }]));
      // Fix: Explicitly type the 'orderItem' parameter to resolve type inference issues.
      currentOrderItems.forEach((orderItem: OrderItem) => {
        // Only deduct stock for new items or items where quantity changed.
        // For simplicity, we assume if editing, new quantity is submitted.
        // A more robust solution would track quantity changes.
        // Here we just deduct for all items in the current basket.
        // Let's refine this to only deduct for NEW items
        if (editingOrder && originalItemIds.has(orderItem.id)) {
            return; // Don't deduct stock for items already on the order
        }
        const stockItem = inventoryMap.get(orderItem.menuItem.stockItemId);
        if (stockItem) {
          stockItem.quantity -= orderItem.menuItem.stockConsumption * orderItem.quantity;
          inventoryMap.set(stockItem.id, stockItem);
        }
      });
      return Array.from(inventoryMap.values());
    });

    if (editingOrder) {
        setOrders(prev => prev.map(o => o.id === editingOrder.id ? {
            ...o,
            items: currentOrderItems,
            notes: currentOrderNotes,
            subtotal,
            tax,
            total
        } : o));
    } else {
        const newOrder: Order = {
          id: Date.now(),
          items: currentOrderItems,
          subtotal,
          tax,
          total,
          status: 'pending',
          timestamp: new Date().toISOString(),
          tableNumber: currentTable!.number,
          area: currentTable!.area,
          waiterId: currentWaiter.id,
          notes: currentOrderNotes,
        };
        setOrders(prev => [...prev, newOrder]);
    }
    resetCurrentOrder();
  };
  
  const handleCancelOrder = () => {
    resetCurrentOrder();
  };

  const handleAddToExistingOrder = (order: Order) => {
    setEditingOrder(order);
    setCurrentOrderItems(order.items);
    setCurrentOrderNotes(order.notes);
    setOriginalItemIds(new Set(order.items.map(item => item.id)));
    setTableActionsModalOpen(false);
  };
  
  const handleGoToPaymentFromTable = (order: Order) => {
    setOrderToPay(order);
    setPaymentModalOpen(true);
    setTableActionsModalOpen(false);
  };
  
  const handleHoldOrder = () => {
    if (!currentTable || !currentWaiter || currentOrderItems.length === 0) return;
    const newHeldOrder: HeldOrder = {
        id: `held-${Date.now()}`,
        timestamp: new Date().toISOString(),
        tableNumber: currentTable.number,
        area: currentTable.area,
        items: currentOrderItems,
        notes: currentOrderNotes,
        waiterId: currentWaiter.id,
    };
    setHeldOrders(prev => [...prev, newHeldOrder]);
    resetCurrentOrder();
  };

  const handleUpdateStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };
  
  const handlePayOrder = (order: Order) => {
    setOrderToPay(order);
    setPaymentModalOpen(true);
  };
  
  const handleReprintReceipt = (order: Order) => {
    setOrderToPay(order);
    setReceiptPreviewOpen(true);
  };
  
  const handleConfirmPayment = (orderId: number, details: any, finalTotal: number, finalTax: number) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    // Create all new state objects before setting them
    const updatedOrder = { ...orderToUpdate, status: 'paid' as const, paymentDetails: details, total: finalTotal, tax: finalTax };
    
    const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'sale',
        amount: finalTotal,
        timestamp: new Date().toISOString(),
        description: `Order #${orderId}`,
        paymentMethod: details.method,
        tax: finalTax,
        orderId: orderId
    };

    // Update states atomically
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    
    setShifts(prevShifts => prevShifts.map(s => {
        if (s.status === 'OPEN') {
            const newShift = {...s};
            newShift.totalTax += finalTax;
            if (details.method === 'cash') {
                newShift.cashSales += finalTotal;
            } else if (details.method === 'card') {
                newShift.cardSales += finalTotal;
            } else if (details.method === 'multiple' && details.payments) {
                details.payments.forEach((p: any) => {
                    if(p.method === 'cash') newShift.cashSales += p.amount;
                    if(p.method === 'card') newShift.cardSales += p.amount;
                })
            }
            return newShift;
        }
        return s;
    }));
    
    setTransactions(prev => [...prev, newTransaction]);

    setPaymentModalOpen(false);
    setOrderToPay(updatedOrder);
    setReceiptPreviewOpen(true);
  };

  const handleOpenDay = (balance: number) => {
    const newShift: ShiftReport = {
        id: `shift-${Date.now()}`,
        status: 'OPEN',
        openingBalance: balance,
        dayOpenedTimestamp: new Date().toISOString(),
        dayClosedTimestamp: null,
        cashSales: 0,
        cardSales: 0,
        manualIncomeCash: 0,
        manualIncomeCard: 0,
        totalTax: 0,
    };
    setShifts(prev => [...prev, newShift]);
    setOpeningBalanceModalOpen(false);
  };

  const handleCloseDay = () => {
      const openOrders = orders.filter(o => o.status !== 'paid' && o.status !== 'cancelled' && o.status !== 'on_credit');
      if (openOrders.length > 0) {
          setCreditConfirmationOpen(true);
          return;
      }

      setConfirmationProps({
          title: t('closeDay'),
          message: t('confirmCloseDay'),
          onConfirm: () => finalizeCloseDay()
      });
      setConfirmationModalOpen(true);
  };

  const finalizeCloseDay = (ordersToCredit: Order[] = []) => {
      const currentActiveShift = shifts.find(s => s.status === 'OPEN');
      if (!currentActiveShift) return;

      const finalShift: ShiftReport = {
          ...currentActiveShift,
          status: 'CLOSED',
          dayClosedTimestamp: new Date().toISOString(),
          finalTotalRevenue: currentActiveShift.cashSales + currentActiveShift.cardSales + currentActiveShift.manualIncomeCash + currentActiveShift.manualIncomeCard,
          finalTotalTax: currentActiveShift.totalTax,
          finalCashSales: currentActiveShift.cashSales,
          finalCardSales: currentActiveShift.cardSales,
          finalManualIncomeCash: currentActiveShift.manualIncomeCash,
          finalManualIncomeCard: currentActiveShift.manualIncomeCard,
      };
      
      // Group state updates
      setOrders(prev => prev.map(o => {
          const creditOrder = ordersToCredit.find(co => co.id === o.id);
          if (creditOrder) {
              return { ...o, status: 'on_credit', customerName: (creditOrder as any).customerName };
          }
          return o;
      }));
      setShifts(prev => prev.map(s => s.id === currentActiveShift.id ? finalShift : s));
      
      setCreditConfirmationOpen(false);
      setLastClosedShift(finalShift);
      if (currentWaiter?.role === 'WAITER') {
          setWaiterShiftSummaryModalOpen(true);
      } else {
          setShiftSummaryModalOpen(true);
      }
      setConfirmationModalOpen(false);
  };
  
  const handleCreditConfirmation = (ordersToCredit: (Order & {customerName: string})[]) => {
      finalizeCloseDay(ordersToCredit);
  };

  if (!currentWaiter) {
    return (
      <>
        <WaiterSelectionScreen waiters={waiters} onSelectWaiter={handleWaiterSelect} t={t} />
        <PinModal
          isOpen={pinRequest.isOpen}
          onClose={() => setPinRequest({ isOpen: false })}
          onConfirm={pinRequest.onConfirm || (() => {})}
          t={t}
          title={pinRequest.title || ''}
        />
      </>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        waiterName={currentWaiter.name}
        t={t}
        dayStatus={activeShift ? 'OPEN' : 'CLOSED'}
        onOpenDay={() => setOpeningBalanceModalOpen(true)}
        onCloseDay={handleCloseDay}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView !== 'admin' && activeView !== 'tables' && (
            <Header
                lang={lang}
                toggleLang={toggleLang}
                searchTerm=""
                setSearchTerm={()=>{}}
                onOpenDrawer={()=>{}}
                t={t}
            />
        )}

        {!activeShift && activeView !== 'admin' && (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('dayIsClosed')}</h2>
                    <p className="text-gray-600">{t('pleaseOpenNewDay')}</p>
                </div>
            </div>
        )}
        
        {activeShift && activeView === 'tables' && !currentTable && !editingOrder && (
            <TableSelectionScreen
                orders={orders}
                heldOrders={heldOrders}
                activeShift={activeShift}
                tables={tables}
                onSelectTable={handleSelectTable}
                onOpenTableActions={handleOpenTableActions}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                t={t}
                inventory={inventory}
                onOpenDrawer={() => {}}
            />
        )}
        
        {activeShift && (currentTable || editingOrder) && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-2/3 flex flex-col">
                <Header lang={lang} toggleLang={toggleLang} searchTerm="" setSearchTerm={()=>{}} onOpenDrawer={()=>{}} t={t} />
                <Menu
                    menuItems={menuItems}
                    categories={categories}
                    inventory={inventory}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onSelectItem={handleSelectItem}
                    onCustomizeItem={handleCustomizeItem}
                    searchTerm=""
                    t={t}
                />
            </div>
            <div className="w-1/3 border-l">
                <CurrentOrder
                    currentOrderItems={currentOrderItems}
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                    notes={currentOrderNotes}
                    onUpdateNotes={setCurrentOrderNotes}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onSubmitOrder={handleSubmitOrder}
                    onUpdateItemDiscount={handleUpdateItemDiscount}
                    onHoldOrder={handleHoldOrder}
                    onCancelOrder={handleCancelOrder}
                    t={t}
                    isEditing={!!editingOrder}
                    originalItemIds={originalItemIds}
                />
            </div>
          </div>
        )}
        
        {activeShift && activeView === 'queue' && (
          <OrderQueue
            orders={orders}
            waiters={waiters}
            onUpdateStatus={handleUpdateStatus}
            onPayOrder={handlePayOrder}
            onReprintReceipt={handleReprintReceipt}
            t={t}
            lang={lang}
            activeShift={activeShift}
          />
        )}
        
        {activeView === 'admin' && (
          <AdminView 
            waiter={currentWaiter} 
            t={t} lang={lang}
            overrideRole={overrideRole}
            pins={pins}
            setPins={setPins}
            data={{
              waiters, setWaiters, categories, setCategories, menuItems, setMenuItems,
              inventory, setInventory, orders, setOrders, transactions, setTransactions,
              shifts, setShifts, tables, setTables, restaurantSettings, setRestaurantSettings,
              activeShift
            }}
          />
        )}
      </main>
      
      {/* Modals */}
      <PinModal
        isOpen={pinRequest.isOpen}
        onClose={() => setPinRequest({ isOpen: false })}
        onConfirm={pinRequest.onConfirm || (() => {})}
        t={t}
        title={pinRequest.title || ''}
      />
      <CustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setCustomizationModalOpen(false)}
        item={itemToCustomize}
        onAddToCart={handleAddToCart}
        t={t}
        lang={lang}
      />
       <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        order={orderToPay}
        onConfirmPayment={handleConfirmPayment}
        onPrint={()=>{}}
        t={t}
        lang={lang}
      />
      <OpeningBalanceModal 
        isOpen={isOpeningBalanceModalOpen}
        onClose={() => setOpeningBalanceModalOpen(false)}
        onConfirm={handleOpenDay}
        t={t}
        lang={lang}
      />
      <ShiftSummaryModal 
        isOpen={isShiftSummaryModalOpen}
        onClose={() => setShiftSummaryModalOpen(false)}
        shiftReport={lastClosedShift}
        t={t}
        lang={lang}
      />
       <WaiterShiftSummaryModal 
        isOpen={isWaiterShiftSummaryModalOpen}
        onClose={() => setWaiterShiftSummaryModalOpen(false)}
        shiftReport={lastClosedShift}
        t={t}
        lang={lang}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        {...confirmationProps}
        t={t}
        lang={lang}
      />
      <CreditConfirmationModal
        isOpen={isCreditConfirmationOpen}
        onClose={() => setCreditConfirmationOpen(false)}
        onConfirm={handleCreditConfirmation}
        openOrders={orders.filter(o => o.status !== 'paid' && o.status !== 'cancelled' && o.status !== 'on_credit')}
        t={t}
        lang={lang}
      />
       <ReceiptPreviewModal
        isOpen={isReceiptPreviewOpen}
        onClose={() => setReceiptPreviewOpen(false)}
        order={orderToPay}
        waiters={waiters}
        restaurantSettings={restaurantSettings}
        t={t}
        lang={lang}
      />
       <TableActionsModal 
        isOpen={isTableActionsModalOpen}
        onClose={() => setTableActionsModalOpen(false)}
        order={selectedOrderForActions}
        onAddToOrder={handleAddToExistingOrder}
        onGoToPayment={handleGoToPaymentFromTable}
        t={t}
       />
        <HeldOrderActionsModal
            isOpen={isHeldOrderActionsModalOpen}
            onClose={() => setHeldOrderActionsModalOpen(false)}
            heldOrder={selectedHeldOrder}
            onResume={handleResumeHeldOrder}
            onStartNew={handleStartNewOrderOnHeldTable}
            t={t}
        />
    </div>
  );
};

export default App;
