
import React, { useState, useMemo, useEffect } from 'react';
import { Ingredient, CostAnalysis, ProductionLog, Buyer } from './types';
import { INITIAL_INGREDIENTS, DEFAULT_YIELD, DEFAULT_LABOR, DEFAULT_FIXED } from './constants';
import { SummaryCard } from './components/SummaryCard';
import { HistoryModal } from './components/HistoryModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SalesConfirmationModal } from './components/SalesConfirmationModal';
import { TransferConfirmationModal } from './components/TransferConfirmationModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { TrendChart } from './components/TrendChart';
import * as XLSX from 'xlsx';

// Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TabRecipeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const TabBoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TabUsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

// New Icons for Config Section
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const BreadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37 2.37a1.724 1.724 0 002.572 1.065c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 001.066-2.573c1.543-.94 3.31.826 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Helper function for safe number input
const sanitizeNumber = (val: string, max: number = 999999): number => {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  if (num < 0) return 0;
  if (num > max) return max;
  return num;
};

// --- Custom UI Components for Inputs ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  colorTheme?: 'orange' | 'blue' | 'purple' | 'red';
  labelSuffix?: string;
  isCurrency?: boolean;
}

const MoneyInput: React.FC<InputProps> = ({ colorTheme = 'blue', className, ...props }) => {
  const ringColor = {
    orange: 'focus:ring-orange-300 focus:border-orange-500',
    blue: 'focus:ring-blue-300 focus:border-blue-500',
    purple: 'focus:ring-purple-300 focus:border-purple-500',
    red: 'focus:ring-red-300 focus:border-red-500',
  }[colorTheme];

  // Default to white background and dark text for visibility
  const baseClasses = "block w-full rounded-md border-gray-300 pl-7 pr-3 py-1.5 text-right font-mono font-medium text-gray-900 focus:outline-none focus:ring-2 transition-all sm:text-sm bg-white";

  return (
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-400 font-medium sm:text-sm">$</span>
      </div>
      <input
        type="number"
        min="0"
        step="0.01"
        className={`${baseClasses} ${ringColor} ${className || ''}`}
        {...props}
      />
    </div>
  );
};

const UnitInput: React.FC<InputProps> = ({ colorTheme = 'blue', labelSuffix, className, ...props }) => {
  const ringColor = {
    orange: 'focus:ring-orange-300 focus:border-orange-500',
    blue: 'focus:ring-blue-300 focus:border-blue-500',
    purple: 'focus:ring-purple-300 focus:border-purple-500',
    red: 'focus:ring-red-300 focus:border-red-500',
  }[colorTheme];

  // Default to white background and dark text for visibility
  const baseClasses = "block w-full rounded-md border-gray-300 pl-3 pr-10 py-1.5 text-right font-medium text-gray-900 focus:outline-none focus:ring-2 transition-all sm:text-sm bg-white";

  return (
    <div className="relative rounded-md shadow-sm">
      <input
        type="number"
        min="0"
        className={`${baseClasses} ${ringColor} ${className || ''}`}
        {...props}
      />
      {labelSuffix && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-400 sm:text-xs font-medium">{labelSuffix}</span>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

function App() {
  // State: Inventory & Recipe
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('panaderia_ingredients');
    return saved ? JSON.parse(saved) : INITIAL_INGREDIENTS;
  });

  // State: Bread Stock (Finished Product)
  const [breadStock, setBreadStock] = useState<number>(() => {
    const saved = localStorage.getItem('panaderia_bread_stock');
    return saved ? parseFloat(saved) : 0;
  });

  // State: Config
  const [yieldUnits, setYieldUnits] = useState<number>(() => {
    const saved = localStorage.getItem('panaderia_yield');
    return saved ? parseFloat(saved) : DEFAULT_YIELD;
  });
  const [laborCost, setLaborCost] = useState<number>(() => {
    const saved = localStorage.getItem('panaderia_labor');
    return saved ? parseFloat(saved) : DEFAULT_LABOR;
  });
  const [fixedCosts, setFixedCosts] = useState<number>(() => {
    const saved = localStorage.getItem('panaderia_fixed');
    return saved ? parseFloat(saved) : DEFAULT_FIXED;
  });

  // State: History
  const [history, setHistory] = useState<ProductionLog[]>(() => {
    const saved = localStorage.getItem('panaderia_history');
    return saved ? JSON.parse(saved) : [];
  });

  // State: Buyers
  const [buyers, setBuyers] = useState<Buyer[]>(() => {
    const saved = localStorage.getItem('panaderia_buyers');
    return saved ? JSON.parse(saved) : [];
  });

  // State: Orders
  const [orders, setOrders] = useState<Buyer[]>(() => {
    const saved = localStorage.getItem('panaderia_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'recipe' | 'inventory'>('inventory');
  const [activeRightTab, setActiveRightTab] = useState<'config' | 'orders' | 'buyers' | 'results'>('config');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [profitTimeRange, setProfitTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [profitFilterDate, setProfitFilterDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
  
  // Confirmation Modals State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [missingStock, setMissingStock] = useState<Ingredient[]>([]);

  // Sales Confirmation Modal State
  const [isSalesConfirmModalOpen, setIsSalesConfirmModalOpen] = useState(false);

  // Transfer Confirmation Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Delete Confirmation Modal State
  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    type: 'all' | 'day' | 'item' | 'ingredient';
    id?: string;
    date?: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'item',
    title: '',
    description: ''
  });

  // --- Effects for Persistence ---
  useEffect(() => {
    localStorage.setItem('panaderia_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('panaderia_bread_stock', breadStock.toString());
  }, [breadStock]);

  useEffect(() => {
    localStorage.setItem('panaderia_yield', yieldUnits.toString());
    localStorage.setItem('panaderia_labor', laborCost.toString());
    localStorage.setItem('panaderia_fixed', fixedCosts.toString());
  }, [yieldUnits, laborCost, fixedCosts]);

  useEffect(() => {
    localStorage.setItem('panaderia_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('panaderia_buyers', JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem('panaderia_orders', JSON.stringify(orders));
  }, [orders]);

  // --- Calculations ---
  const analysis: CostAnalysis = useMemo(() => {
    const totalMaterials = ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.pricePerUnit), 0);
    const totalProduction = totalMaterials + laborCost + fixedCosts;
    const costPerUnit = yieldUnits > 0 ? totalProduction / yieldUnits : 0;
    
    return {
      totalMaterials,
      totalProduction,
      costPerUnit
    };
  }, [ingredients, laborCost, fixedCosts, yieldUnits]);

  const totalInventoryValue = useMemo(() => {
    return ingredients.reduce((sum, ing) => sum + (ing.stock * ing.pricePerUnit), 0);
  }, [ingredients]);

  // Derived calculations from Buyers
  const totalRealSales = useMemo(() => {
    return buyers.reduce((sum, buyer) => sum + (buyer.quantity * buyer.pricePerUnit), 0);
  }, [buyers]);

  const totalQuantitySold = useMemo(() => {
     return buyers.reduce((sum, buyer) => sum + buyer.quantity, 0);
  }, [buyers]);

  const averageSalePrice = useMemo(() => {
    return totalQuantitySold > 0 ? totalRealSales / totalQuantitySold : 0;
  }, [totalRealSales, totalQuantitySold]);

  // Derived calculations from Orders
  const totalOrdersQuantity = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.quantity, 0);
  }, [orders]);

  // Profit Margins (Projected based on Average Sale Price)
  const profitMargin = useMemo(() => {
    return averageSalePrice - analysis.costPerUnit;
  }, [averageSalePrice, analysis.costPerUnit]);

  const totalProfit = useMemo(() => {
    return (averageSalePrice * yieldUnits) - analysis.totalProduction;
  }, [averageSalePrice, yieldUnits, analysis.totalProduction]);

  // Daily Metrics Calculations
  const totalRevenueToday = useMemo(() => {
    const today = new Date().toDateString();
    return history
      .filter(log => log.type === 'sale' && new Date(log.timestamp).toDateString() === today)
      .reduce((sum, log) => sum + (log.totalProfit || 0), 0);
  }, [history]);

  const totalProductionCostToday = useMemo(() => {
    const today = new Date().toDateString();
    return history
      .filter(log => log.type === 'production' && new Date(log.timestamp).toDateString() === today)
      .reduce((sum, log) => sum + (log.totalCost || 0), 0);
  }, [history]);

  // Specific Profit Summary (Based on selected Range and Date)
  const specificProfitSummary = useMemo(() => {
    let calculatedProfit = 0;
    
    const filterDate = new Date(profitFilterDate + 'T00:00:00');

    let weekStart: Date, weekEnd: Date;
    if (profitTimeRange === 'week') {
      const day = filterDate.getDay();
      weekStart = new Date(filterDate);
      weekStart.setDate(filterDate.getDate() - day);
      weekStart.setHours(0,0,0,0);
      
      weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23,59,59,999);
    }

    history.forEach(log => {
      const logDate = new Date(log.timestamp);
      let matches = false;

      if (profitTimeRange === 'day') {
        matches = logDate.toLocaleDateString('en-CA') === profitFilterDate;
      } else if (profitTimeRange === 'month') {
        const logMonth = logDate.toISOString().slice(0, 7);
        matches = logMonth === profitFilterDate;
      } else if (profitTimeRange === 'week') {
        matches = logDate >= weekStart && logDate <= weekEnd;
      }

      if (matches) {
        if (log.type === 'sale') {
          calculatedProfit += (log.totalProfit || 0);
        } else if (log.type === 'production') {
          calculatedProfit -= (log.totalCost || 0);
        }
      }
    });

    return calculatedProfit;
  }, [history, profitTimeRange, profitFilterDate]);


  // --- Handlers: Ingredients ---
  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    const newIngredients = ingredients.map(ing => {
      if (ing.id === id) {
        return { ...ing, [field]: value };
      }
      return ing;
    });
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: 'Nuevo Insumo',
      quantity: 0,
      stock: 0,
      unit: 'kg',
      pricePerUnit: 0,
      minStockThreshold: 0
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleDeleteIngredient = (id: string) => {
    const ingredientName = ingredients.find(i => i.id === id)?.name || 'insumo';
    setDeleteConfig({
      isOpen: true,
      type: 'ingredient',
      id,
      title: 'Eliminar Insumo',
      description: `¿Estás seguro de que quieres eliminar "${ingredientName}" del inventario? Esta acción no se puede deshacer.`
    });
  };

  const handleExportInventory = () => {
    const data = ingredients.map(ing => ({
      'Nombre': ing.name,
      'Stock Actual': ing.stock,
      'Unidad': ing.unit,
      'Precio/Unidad':ing.pricePerUnit,
      'Valor Total': ing.stock * ing.pricePerUnit,
      'Minimo Requerido': ing.minStockThreshold || 0
    }));

    if (breadStock > 0) {
       data.push({
         'Nombre': 'PAN (Producto Terminado)',
         'Stock Actual': breadStock,
         'Unidad': 'unid',
         'Precio/Unidad': analysis.costPerUnit,
         'Valor Total': breadStock * analysis.costPerUnit,
         'Minimo Requerido': 0
       })
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, `Inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // --- Handlers: Production ---
  const handleProductionClick = () => {
    const missing = ingredients.filter(ing => ing.stock < ing.quantity);
    setMissingStock(missing);
    setIsConfirmModalOpen(true);
  };

  const handleFinalizeProduction = () => {
    const newIngredients = ingredients.map(ing => ({
      ...ing,
      stock: ing.stock - ing.quantity
    }));
    setIngredients(newIngredients);
    setBreadStock(prev => prev + yieldUnits);

    const newLog: ProductionLog = {
      id: Date.now().toString(),
      type: 'production',
      timestamp: new Date().toISOString(),
      yieldUnits,
      totalCost: analysis.totalProduction,
      costPerUnit: analysis.costPerUnit,
      laborCost,
      fixedCosts,
      salePrice: averageSalePrice,
      totalProfit: totalProfit,
      ingredientsUsed: ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        cost: ing.quantity * ing.pricePerUnit
      }))
    };
    
    setHistory([newLog, ...history]);
    setIsConfirmModalOpen(false);
  };

  // --- Handlers: History Deletion (With Custom Modal) ---
  const handleDeleteHistoryItem = (id: string) => {
    setDeleteConfig({
      isOpen: true,
      type: 'item',
      id,
      title: 'Eliminar Registro',
      description: '¿Estás seguro de eliminar este registro del historial? Esta acción no se puede deshacer.'
    });
  };

  const handleDeleteHistoryDay = (dateString: string) => {
    setDeleteConfig({
      isOpen: true,
      type: 'day',
      date: dateString,
      title: `Eliminar Día: ${dateString}`,
      description: `¿Estás seguro de ELIMINAR TODOS los registros del día ${dateString}? Esta acción no se puede deshacer.`
    });
  };

  const handleClearHistoryRequest = () => {
    setDeleteConfig({
      isOpen: true,
      type: 'all',
      title: 'Borrar Todo el Historial',
      description: '¿Estás seguro de que quieres borrar TODO el historial? Se perderán todos los registros de lotes y ventas. Esta acción no se puede deshacer.'
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfig.type === 'item' && deleteConfig.id) {
      setHistory(prev => prev.filter(item => item.id !== deleteConfig.id));
    } else if (deleteConfig.type === 'day' && deleteConfig.date) {
      setHistory(prev => prev.filter(item => {
        const itemDate = new Date(item.timestamp).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
        return itemDate !== deleteConfig.date;
      }));
    } else if (deleteConfig.type === 'all') {
      setHistory([]);
    } else if (deleteConfig.type === 'ingredient' && deleteConfig.id) {
       setIngredients(prev => prev.filter(ing => ing.id !== deleteConfig.id));
    }
    setDeleteConfig(prev => ({ ...prev, isOpen: false }));
  };


  // --- Handlers: Buyers ---
  const handleAddBuyer = () => {
    const newBuyer: Buyer = {
      id: Date.now().toString(),
      name: `Cliente ${buyers.length + 1}`,
      quantity: 0,
      pricePerUnit: 0
    };
    setBuyers([...buyers, newBuyer]);
  };

  const handleUpdateBuyer = (id: string, field: keyof Buyer, value: string | number) => {
    const updatedBuyers = buyers.map(b => {
      if (b.id === id) {
        return { ...b, [field]: value };
      }
      return b;
    });
    setBuyers(updatedBuyers);
  };

  const handleDeleteBuyer = (id: string) => {
    setBuyers(buyers.filter(b => b.id !== id));
  };

  // --- Handlers: Orders ---
  const handleAddOrder = () => {
    const newOrder: Buyer = {
      id: Date.now().toString(),
      name: `Pedido ${orders.length + 1}`,
      quantity: 0,
      pricePerUnit: 0
    };
    setOrders([...orders, newOrder]);
  };

  const handleUpdateOrder = (id: string, field: keyof Buyer, value: string | number) => {
    const updatedOrders = orders.map(o => {
      if (o.id === id) {
        return { ...o, [field]: value };
      }
      return o;
    });
    setOrders(updatedOrders);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleTransferClick = () => {
    if (orders.length === 0) return;

    const invalidOrders = orders.filter(o => !o.quantity || o.quantity <= 0);
    if (invalidOrders.length > 0) {
      alert(`No se pueden transferir pedidos con cantidad 0 o vacía. Revisa ${invalidOrders.length} pedido(s).`);
      return;
    }

    const unnamedOrders = orders.filter(o => !o.name || o.name.trim() === '');
    if (unnamedOrders.length > 0) {
       alert(`Todos los pedidos deben tener un nombre de cliente. Hay ${unnamedOrders.length} pedido(s) sin nombre.`);
       return;
    }

    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    const ordersToTransfer = orders.map(o => ({
      ...o,
      id: `transferred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    setBuyers(prev => [...prev, ...ordersToTransfer]);
    setOrders([]);
    setIsTransferModalOpen(false);
    setActiveRightTab('buyers');
  };

  // --- Handlers: Sales ---
  const handleRegisterSales = () => {
    if (totalQuantitySold <= 0) return;
    
    const lowPriceBuyers = buyers.filter(b => b.quantity > 0 && b.pricePerUnit < analysis.costPerUnit);
    if (lowPriceBuyers.length > 0) {
      const msg = `ADVERTENCIA DE PRECIO:\n\nLos siguientes clientes tienen un precio menor al costo de producción ($${analysis.costPerUnit.toFixed(2)}):\n\n` +
                  lowPriceBuyers.map(b => `- ${b.name}: $${b.pricePerUnit}`).join('\n') +
                  `\n\n¿Deseas continuar de todos modos?`;
      
      if (!window.confirm(msg)) {
        return; 
      }
    }

    setIsSalesConfirmModalOpen(true);
  };

  const handleFinalizeSales = () => {
    setBreadStock(prev => prev - totalQuantitySold);

    const newLog: ProductionLog = {
      id: Date.now().toString(),
      type: 'sale',
      timestamp: new Date().toISOString(),
      yieldUnits: totalQuantitySold,
      totalCost: 0,
      costPerUnit: averageSalePrice,
      totalProfit: totalRealSales,
      ingredientsUsed: [],
      buyersSnapshot: buyers.filter(b => b.quantity > 0)
    };
    
    setHistory([newLog, ...history]);
    setBuyers([]);
    setIsSalesConfirmModalOpen(false);
  };

  // --- Alerts ---
  const criticalStockItems = ingredients.filter(ing => 
    (ing.stock <= (ing.minStockThreshold || 0))
  );

  return (
    <div className="h-full flex flex-col md:overflow-hidden bg-gray-50/50">
      {/* Modals */}
      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onClearHistory={handleClearHistoryRequest}
        onDeleteItem={handleDeleteHistoryItem}
        onDeleteDay={handleDeleteHistoryDay}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleFinalizeProduction}
        yieldUnits={yieldUnits}
        missingStock={missingStock}
      />
      <SalesConfirmationModal
        isOpen={isSalesConfirmModalOpen}
        onClose={() => setIsSalesConfirmModalOpen(false)}
        onConfirm={handleFinalizeSales}
        buyers={buyers}
        totalQuantity={totalQuantitySold}
        totalRevenue={totalRealSales}
        currentStock={breadStock}
        costPerUnit={analysis.costPerUnit}
      />
      <TransferConfirmationModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onConfirm={handleConfirmTransfer}
        orderCount={orders.length}
        totalItems={totalOrdersQuantity}
      />
      <DeleteConfirmationModal
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteConfig.title}
        description={deleteConfig.description}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex flex-wrap justify-between items-center gap-4 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
             <BreadIcon />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Panadería Costos Pro</h1>
        </div>
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
        >
          <HistoryIcon />
          Historial
        </button>
      </header>

      {/* Global Alert Banner */}
      {criticalStockItems.length > 0 && (
        <div className="bg-red-600 text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 shrink-0 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Atención: {criticalStockItems.length} insumo(s) con stock crítico ({criticalStockItems.map(i => i.name).join(', ')}).
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        
        {/* Left Panel: Recipe & Inventory Table */}
        <div className="w-full md:w-2/3 flex flex-col border-r border-gray-200 bg-white shrink-0 md:h-full">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 shrink-0 bg-white">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('recipe')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'recipe' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <TabRecipeIcon />
                Receta y Costos
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'inventory' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <TabBoxIcon />
                Inventario
              </button>
            </div>

            {activeTab === 'inventory' && (
              <div className="flex gap-2">
                <button 
                  onClick={handleAddIngredient}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                >
                  <PlusIcon />
                  Agregar Insumo
                </button>
                <button 
                  onClick={handleExportInventory}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-xs px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded transition-colors"
                >
                  <DownloadIcon />
                  Exportar Inventario
                </button>
              </div>
            )}
          </div>

          {/* Bread Stock Section (Only in Inventory Tab) */}
          {activeTab === 'inventory' && (
             <div className="bg-orange-50 border-b border-orange-100 p-4 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-full shadow-sm border border-orange-100">
                      <BreadIcon />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Producto Terminado (Pan)</h3>
                      <p className="text-xs text-orange-600">Stock disponible para venta</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <span className="block text-2xl font-bold text-gray-800">{breadStock} <span className="text-sm font-normal text-gray-500">unid.</span></span>
                      <span className="text-xs text-gray-400">Valor: ${(breadStock * analysis.costPerUnit).toFixed(2)}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => setBreadStock(prev => prev + 1)}
                        className="w-8 h-6 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-orange-100 hover:border-orange-300 text-gray-600 transition-colors"
                      >
                        +
                      </button>
                      <button 
                         onClick={() => setBreadStock(prev => Math.max(0, prev - 1))}
                         className="w-8 h-6 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-orange-100 hover:border-orange-300 text-gray-600 transition-colors"
                      >
                        -
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto md:overflow-y-auto p-2 md:p-6 bg-gray-50/30 min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[600px] bg-white rounded-lg shadow-sm overflow-hidden">
              <thead>
                <tr className="text-xs font-bold text-gray-400 border-b border-gray-100 uppercase tracking-wider bg-gray-50">
                  <th className="px-4 py-3">Insumo</th>
                  {activeTab === 'recipe' && <th className="px-4 py-3 w-36">Requerido x Lote</th>}
                  {activeTab === 'inventory' && <th className="px-4 py-3 w-36">Stock Actual</th>}
                  {activeTab === 'inventory' && <th className="px-4 py-3 w-24">Unidad</th>}
                  {activeTab === 'inventory' && <th className="px-4 py-3 w-36">Precio/Unid.</th>}
                  {activeTab === 'recipe' && <th className="px-4 py-3 w-24">Unidad</th>}
                  {activeTab === 'recipe' && <th className="px-4 py-3 w-32">Precio/Unid.</th>}
                  {activeTab === 'recipe' && <th className="px-4 py-3 w-32 text-right">Costo Total</th>}
                  {activeTab === 'inventory' && <th className="px-4 py-3 w-32 text-right">Valor Stock</th>}
                  {activeTab === 'inventory' && <th className="px-4 py-3 w-28 text-center">Min. Alert</th>}
                  {activeTab === 'inventory' && <th className="px-4 py-3 w-16 text-center"></th>} {/* Actions Column */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {ingredients.map((ing) => {
                  const isLowStock = activeTab === 'recipe' && ing.stock < ing.quantity;
                  const isBelowThreshold = activeTab === 'inventory' && ing.stock <= (ing.minStockThreshold || 0);
                  
                  return (
                  <tr 
                    key={ing.id} 
                    className={`group transition-colors ${isLowStock ? 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                  >
                    <td className="px-2 md:px-4 py-3 font-medium text-gray-700">
                      {activeTab === 'inventory' ? (
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 font-medium"
                        />
                      ) : (
                        <>
                          {ing.name}
                          {isLowStock && <span className="block text-[10px] text-red-500 font-bold">Stock Insuficiente ({ing.stock})</span>}
                        </>
                      )}
                    </td>
                    
                    {/* Requerido (Recipe Only) */}
                    {activeTab === 'recipe' && (
                      <td className="px-2 md:px-4 py-3">
                        <UnitInput
                           colorTheme="orange"
                           value={ing.quantity}
                           onChange={(e) => handleUpdateIngredient(ing.id, 'quantity', sanitizeNumber(e.target.value))}
                        />
                      </td>
                    )}

                    {/* Stock (Inventory Only) */}
                    {activeTab === 'inventory' && (
                      <td className="px-2 md:px-4 py-3">
                        <UnitInput
                           colorTheme={isBelowThreshold ? 'red' : 'blue'}
                           value={ing.stock}
                           onChange={(e) => handleUpdateIngredient(ing.id, 'stock', sanitizeNumber(e.target.value))}
                           className={isBelowThreshold ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        />
                      </td>
                    )}

                    {/* Unidad (Moved after stock in Inventory) */}
                    {activeTab === 'inventory' && (
                       <td className="px-2 md:px-4 py-3">
                         <input 
                            type="text"
                            value={ing.unit}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 text-center font-medium"
                         />
                       </td>
                    )}

                    {/* Precio Unitario (Editable in Inventory, Read-only in Recipe) */}
                    <td className="px-2 md:px-4 py-3">
                      {activeTab === 'inventory' ? (
                        <MoneyInput
                          colorTheme="blue"
                          value={ing.pricePerUnit}
                          onChange={(e) => handleUpdateIngredient(ing.id, 'pricePerUnit', sanitizeNumber(e.target.value))}
                        />
                      ) : (
                        <span className="text-gray-900 text-xs font-mono font-medium">${ing.pricePerUnit.toFixed(2)}</span>
                      )}
                    </td>

                    {/* Unidad (Recipe position) */}
                    {activeTab === 'recipe' && (
                       <td className="px-2 md:px-4 py-3">
                         <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full font-medium">{ing.unit}</span>
                       </td>
                    )}

                    {/* Totals */}
                    {activeTab === 'recipe' && (
                      <td className="px-2 md:px-4 py-3 text-right font-bold text-gray-700 font-mono">
                        ${(ing.quantity * ing.pricePerUnit).toFixed(2)}
                      </td>
                    )}

                    {activeTab === 'inventory' && (
                      <td className="px-2 md:px-4 py-3 text-right font-medium text-gray-500 font-mono">
                        ${(ing.stock * ing.pricePerUnit).toFixed(2)}
                      </td>
                    )}

                    {/* Min Alert Threshold (Inventory Only) */}
                    {activeTab === 'inventory' && (
                      <td className="px-2 md:px-4 py-3 text-center">
                         <UnitInput
                           colorTheme="red"
                           value={ing.minStockThreshold || 0}
                           onChange={(e) => handleUpdateIngredient(ing.id, 'minStockThreshold', sanitizeNumber(e.target.value))}
                           className="text-center px-2"
                         />
                      </td>
                    )}
                    
                    {/* Delete Action (Inventory Only) */}
                    {activeTab === 'inventory' && (
                      <td className="px-2 md:px-4 py-3 text-center">
                         <button
                           onClick={() => handleDeleteIngredient(ing.id)}
                           className="text-gray-400 hover:text-red-500 transition-colors p-1"
                           title="Eliminar insumo"
                         >
                           <TrashIcon />
                         </button>
                      </td>
                    )}

                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Sidebar (Config/Results/Buyers/Orders) */}
        <div className="w-full md:w-1/3 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col h-auto md:h-full md:overflow-hidden order-last">
          
          {/* Right Panel Tabs */}
          <div className="flex border-b border-gray-200 bg-white shrink-0 overflow-x-auto">
             <button 
               onClick={() => setActiveRightTab('config')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors min-w-[80px] ${activeRightTab === 'config' ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               <CogIcon />
               Config
             </button>
             <button 
               onClick={() => setActiveRightTab('orders')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors min-w-[80px] ${activeRightTab === 'orders' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               <ClipboardIcon />
               Pedidos
             </button>
             <button 
               onClick={() => setActiveRightTab('buyers')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors min-w-[80px] ${activeRightTab === 'buyers' ? 'border-purple-500 text-purple-600 bg-purple-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               <TabUsersIcon />
               Ventas
             </button>
             <button 
               onClick={() => setActiveRightTab('results')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors min-w-[80px] ${activeRightTab === 'results' ? 'border-green-500 text-green-600 bg-green-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               <ChartBarIcon />
               Res
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

            {/* TAB: CONFIGURATION */}
            {activeRightTab === 'config' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6">
                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2 mb-2">
                     Parámetros de Lote
                   </h3>
                   
                   {/* Yield */}
                   <div className="group">
                      <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5 uppercase">
                        <BreadIcon /> Unidades Producidas
                      </label>
                      <UnitInput
                        colorTheme="orange"
                        value={yieldUnits}
                        onChange={(e) => setYieldUnits(sanitizeNumber(e.target.value))}
                        labelSuffix="panes"
                        className="text-lg font-bold py-2.5"
                      />
                      <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Divisor principal del costo unitario.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                     {/* Labor */}
                     <div className="group">
                        <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5 uppercase">
                          <UsersIcon /> Mano de Obra
                        </label>
                        <MoneyInput
                           colorTheme="blue"
                           value={laborCost}
                           onChange={(e) => setLaborCost(sanitizeNumber(e.target.value))}
                        />
                     </div>

                     {/* Fixed Costs */}
                     <div className="group">
                        <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5 uppercase">
                          <BoltIcon /> Gastos Fijos
                        </label>
                        <MoneyInput
                           colorTheme="blue"
                           value={fixedCosts}
                           onChange={(e) => setFixedCosts(sanitizeNumber(e.target.value))}
                        />
                     </div>
                   </div>
                </div>

                {/* Stock Info Card in Config */}
                <div className={`p-4 rounded-xl border ${breadStock < yieldUnits ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'} shadow-sm`}>
                    <p className="text-xs font-bold text-gray-500 uppercase">Stock Actual de Pan</p>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-bold text-gray-800">{breadStock} <span className="text-sm font-normal text-gray-500">unidades</span></span>
                    </div>
                    {breadStock < yieldUnits && (
                      <p className="text-xs text-orange-600 mt-1 font-medium">Sugerencia: Producir nuevo lote pronto.</p>
                    )}
                </div>

                <button
                  onClick={handleProductionClick}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform active:scale-[0.98] transition-all font-bold text-lg flex items-center justify-center gap-2"
                >
                   <CheckCircleIcon />
                   Registrar Lote y Descontar Stock
                </button>
              </div>
            )}

            {/* TAB: ORDERS (New) */}
            {activeRightTab === 'orders' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                <div className="shrink-0 flex justify-between items-center mb-2">
                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Pedidos Pendientes</h3>
                   <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{orders.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <input
                          type="text"
                          value={order.name}
                          onChange={(e) => handleUpdateOrder(order.id, 'name', e.target.value)}
                          className="font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent w-full text-sm pb-1"
                          placeholder="Nombre Cliente"
                        />
                        <button onClick={() => handleDeleteOrder(order.id)} className="text-gray-300 hover:text-red-500 ml-2 p-1">
                          <TrashIcon />
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Cantidad</label>
                          <UnitInput 
                             colorTheme="blue"
                             value={order.quantity}
                             onChange={(e) => handleUpdateOrder(order.id, 'quantity', sanitizeNumber(e.target.value))}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Precio Unit.</label>
                          <MoneyInput
                             colorTheme="blue"
                             value={order.pricePerUnit}
                             onChange={(e) => handleUpdateOrder(order.id, 'pricePerUnit', sanitizeNumber(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-right pt-2 border-t border-gray-50">
                         <span className="text-xs font-bold text-blue-600">Total: ${(order.quantity * order.pricePerUnit).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {orders.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                       <p className="text-gray-400 text-xs">No hay pedidos registrados.</p>
                       <p className="text-gray-400 text-xs">Agrega uno para comenzar.</p>
                    </div>
                  )}

                   <button 
                    onClick={handleAddOrder}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <PlusIcon /> Agregar Pedido
                  </button>
                </div>

                <div className="mt-auto shrink-0 pt-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm font-bold text-gray-600 uppercase">Total Panes:</span>
                       <span className="text-xl font-bold text-blue-700">{totalOrdersQuantity} <span className="text-xs font-normal text-gray-400">unid.</span></span>
                    </div>
                    <button
                      onClick={handleTransferClick}
                      disabled={orders.length === 0}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl shadow-md font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Transferir a Ventas
                    </button>
                </div>
              </div>
            )}

            {/* TAB: BUYERS (Sales) */}
            {activeRightTab === 'buyers' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                <div className="shrink-0 flex justify-between items-center mb-2">
                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Registro de Ventas</h3>
                   <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{buyers.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                  {buyers.map((buyer) => (
                    <div key={buyer.id} className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm hover:border-purple-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <input
                          type="text"
                          value={buyer.name}
                          onChange={(e) => handleUpdateBuyer(buyer.id, 'name', e.target.value)}
                          className="font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none bg-transparent w-full text-sm pb-1"
                          placeholder="Nombre Cliente"
                        />
                        <button onClick={() => handleDeleteBuyer(buyer.id)} className="text-gray-300 hover:text-red-500 ml-2 p-1">
                          <TrashIcon />
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Cantidad</label>
                          <UnitInput
                             colorTheme="purple"
                             value={buyer.quantity}
                             onChange={(e) => handleUpdateBuyer(buyer.id, 'quantity', sanitizeNumber(e.target.value))}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Precio Unit.</label>
                          <MoneyInput
                             colorTheme="purple"
                             value={buyer.pricePerUnit}
                             onChange={(e) => handleUpdateBuyer(buyer.id, 'pricePerUnit', sanitizeNumber(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-right pt-2 border-t border-gray-50">
                         <span className="text-xs font-bold text-purple-600">Total: ${(buyer.quantity * buyer.pricePerUnit).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {buyers.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                       <p className="text-gray-400 text-xs">No hay clientes agregados.</p>
                    </div>
                  )}

                   <button 
                    onClick={handleAddBuyer}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <PlusIcon /> Agregar Comprador
                  </button>
                </div>

                <div className="mt-auto shrink-0 pt-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm font-bold text-gray-600 uppercase">Total Ventas:</span>
                       <span className="text-xl font-bold text-purple-700">${totalRealSales.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleRegisterSales}
                      disabled={totalQuantitySold <= 0}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl shadow-md font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <TagIcon />
                      Registrar Ventas y Descontar
                    </button>
                </div>
              </div>
            )}

            {/* TAB: RESULTS */}
            {activeRightTab === 'results' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Inventory Value */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                      <TabBoxIcon />
                    </div>
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Valor del Inventario</h3>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                       <p className="text-2xl font-bold text-gray-800">${totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                       <p className="text-[10px] text-gray-400">Total en insumos + pan</p>
                     </div>
                  </div>
                </div>

                {/* Daily Metrics */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-100 rounded-md text-green-600">
                      <ChartBarIcon />
                    </div>
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Métricas del Día</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <SummaryCard label="Ventas Hoy" value={totalRevenueToday} isCurrency={true} highlight={true} subtext="Ingresos Reales" />
                    <SummaryCard label="Costo Prod. Hoy" value={totalProductionCostToday} isCurrency={true} subtext="Basado en Lotes" />
                  </div>
                </div>

                {/* Profit Summary Section */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-yellow-100 rounded-md text-yellow-600">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </div>
                       <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Resumen de Ganancia</h3>
                    </div>
                  </div>

                  {/* Range Selector */}
                  <div className="bg-gray-100 p-1 rounded-lg flex mb-4">
                     <button 
                       onClick={() => {
                         setProfitTimeRange('day');
                         setProfitFilterDate(new Date().toISOString().split('T')[0]);
                       }}
                       className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${profitTimeRange === 'day' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                       Día
                     </button>
                     <button 
                       onClick={() => {
                         setProfitTimeRange('week');
                         setProfitFilterDate(new Date().toISOString().split('T')[0]);
                       }}
                       className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${profitTimeRange === 'week' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                       Semana
                     </button>
                     <button 
                       onClick={() => {
                         setProfitTimeRange('month');
                         setProfitFilterDate(new Date().toISOString().slice(0, 7));
                       }}
                       className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${profitTimeRange === 'month' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                       Mes
                     </button>
                  </div>

                  {/* Specific Date Filter Input */}
                  <div className="mb-4">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      {profitTimeRange === 'week' ? 'Semana del día:' : `Seleccionar ${profitTimeRange}:`}
                    </label>
                    <input 
                      type={profitTimeRange === 'month' ? 'month' : 'date'}
                      value={profitFilterDate}
                      onChange={(e) => setProfitFilterDate(e.target.value)}
                      className="w-full text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400"
                    />
                  </div>

                  {/* Display Value */}
                  <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${specificProfitSummary >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                      Ganancia Neta
                    </p>
                    <span className={`text-3xl font-bold tracking-tight ${specificProfitSummary >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {specificProfitSummary >= 0 ? '+' : ''}${specificProfitSummary.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">Ingresos (Ventas) - Costos (Producción)</p>
                  </div>
                </div>
                
                {/* Trend Chart */}
                <div className="mt-6">
                   <TrendChart data={
                      // Simple aggregation for chart (last 7 days of history)
                      Object.entries(history.reduce((acc, curr) => {
                        const date = new Date(curr.timestamp).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
                        if (!acc[date]) acc[date] = { date, production: 0, revenue: 0 };
                        if (curr.type === 'production') acc[date].production += curr.totalCost;
                        if (curr.type === 'sale') acc[date].revenue += (curr.totalProfit || 0);
                        return acc;
                      }, {} as Record<string, any>))
                      .map(([_, val]) => val)
                      .slice(-7)
                   } />
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;