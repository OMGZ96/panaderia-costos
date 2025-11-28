import React, { useState, useMemo, useEffect } from 'react';
import { Ingredient, ProductionData, CostAnalysis, ProductionLog } from './types';
import { INITIAL_INGREDIENTS, DEFAULT_YIELD, DEFAULT_LABOR, DEFAULT_FIXED } from './constants';
import { SummaryCard } from './components/SummaryCard';
import { HistoryModal } from './components/HistoryModal';
import { ConfirmationModal } from './components/ConfirmationModal';

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

// New Icons for Config Section
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const BreadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);


export default function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [yieldUnits, setYieldUnits] = useState<number>(DEFAULT_YIELD);
  const [laborCost, setLaborCost] = useState<number>(DEFAULT_LABOR);
  const [fixedCosts, setFixedCosts] = useState<number>(DEFAULT_FIXED);
  const [activeTab, setActiveTab] = useState<'recipe' | 'inventory'>('recipe');
  
  // History State
  const [history, setHistory] = useState<ProductionLog[]>(() => {
    try {
      const saved = localStorage.getItem('productionHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Calculations
  const analysis = useMemo<CostAnalysis>(() => {
    const totalMaterials = ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.pricePerUnit), 0);
    const totalProduction = totalMaterials + laborCost + fixedCosts;
    const costPerUnit = yieldUnits > 0 ? totalProduction / yieldUnits : 0;
    
    return {
      totalMaterials,
      totalProduction,
      costPerUnit
    };
  }, [ingredients, laborCost, fixedCosts, yieldUnits]);

  // Inventory Valuation
  const totalInventoryValue = useMemo(() => {
    return ingredients.reduce((sum, ing) => sum + (ing.stock * ing.pricePerUnit), 0);
  }, [ingredients]);

  // Check inventory status
  const missingStockItems = useMemo(() => {
    return ingredients.filter(i => i.stock < i.quantity);
  }, [ingredients]);
  
  const lowStockCount = missingStockItems.length;

  // Handlers
  const handleInputChange = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map(ing => {
      if (ing.id === id) {
        return { ...ing, [field]: value };
      }
      return ing;
    }));
  };

  const addIngredient = () => {
    const newId = Math.max(...ingredients.map(i => parseInt(i.id)), 0) + 1;
    setIngredients([...ingredients, {
      id: newId.toString(),
      name: 'Nuevo Ingrediente',
      quantity: 1,
      stock: 0,
      unit: 'kg',
      pricePerUnit: 0
    }]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  // Opens the modal
  const handleProductionRun = () => {
    setIsConfirmOpen(true);
  };

  // Executes the action
  const handleFinalizeProduction = () => {
    // 1. Update Stock
    const updatedIngredients = ingredients.map(ing => ({
      ...ing,
      stock: parseFloat((ing.stock - ing.quantity).toFixed(2))
    }));
    setIngredients(updatedIngredients);

    // 2. Add to History
    const newLog: ProductionLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      yieldUnits,
      totalCost: analysis.totalProduction,
      costPerUnit: analysis.costPerUnit,
      laborCost: laborCost, // Snapshot
      fixedCosts: fixedCosts, // Snapshot
      ingredientsUsed: ingredients.map(i => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
        cost: i.quantity * i.pricePerUnit // Snapshot of actual cost at this moment
      }))
    };
    
    const newHistory = [newLog, ...history];
    setHistory(newHistory);
    localStorage.setItem('productionHistory', JSON.stringify(newHistory));
    
    // 3. Close Modal
    setIsConfirmOpen(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('productionHistory');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Costo de Producción Panadera</h1>
            <p className="text-xs text-gray-500">Calculadora de Materia Prima e Inventario</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg shadow-sm transition-all font-medium text-sm"
          >
            <HistoryIcon />
            <span>Historial</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel: Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full min-h-[500px]">
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-100 shrink-0">
              <button 
                onClick={() => setActiveTab('recipe')}
                className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'recipe' 
                    ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <TabRecipeIcon /> Receta y Costos
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all relative ${
                  activeTab === 'inventory' 
                    ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <TabBoxIcon /> Gestión de Inventario
                {lowStockCount > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                    {lowStockCount} alertas
                  </span>
                )}
              </button>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h2 className="font-semibold text-gray-700 text-sm">
                {activeTab === 'recipe' ? 'Definición de Insumos y Precios' : 'Control de Existencias'}
              </h2>
              <button 
                onClick={addIngredient}
                className="flex items-center gap-1 text-xs font-medium bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md transition-colors shadow-sm"
              >
                <PlusIcon /> Agregar Insumo
              </button>
            </div>
            
            {/* Table Area */}
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 w-10">#</th>
                    <th className="px-4 py-3 min-w-[150px]">Ingrediente</th>
                    
                    {/* RECIPE COLUMNS */}
                    {activeTab === 'recipe' && (
                      <>
                        <th className="px-4 py-3 w-32 bg-orange-50/50 border-b border-orange-100">Cantidad (Receta)</th>
                        <th className="px-4 py-3 w-20 text-xs">Unidad</th>
                        <th className="px-4 py-3 w-32">Precio/Unid.</th>
                        <th className="px-4 py-3 w-32 text-right">Subtotal</th>
                      </>
                    )}

                    {/* INVENTORY COLUMNS */}
                    {activeTab === 'inventory' && (
                      <>
                        <th className="px-4 py-3 w-32 bg-blue-50/50 border-b border-blue-100">Stock Actual</th>
                        <th className="px-4 py-3 w-32 bg-blue-50/30 border-b border-blue-100">Precio/Unid.</th>
                        <th className="px-4 py-3 w-20 text-xs">Unidad</th>
                        <th className="px-4 py-3 w-32 text-center">Estado</th>
                      </>
                    )}

                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ingredients.map((ing, index) => {
                    const isLowStock = ing.stock < ing.quantity;
                    const stockStatusColor = isLowStock ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200';
                    const stockStatusText = isLowStock ? 'FALTA' : 'OK';

                    return (
                      <tr key={ing.id} className="hover:bg-gray-50 group transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>
                        
                        {/* NAME (Shared) */}
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={ing.name}
                            onChange={(e) => handleInputChange(ing.id, 'name', e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 font-medium text-gray-800 placeholder-gray-400 focus:text-blue-600 transition-colors"
                            placeholder="Nombre del insumo"
                          />
                        </td>

                        {/* RECIPE VIEW CELLS */}
                        {activeTab === 'recipe' && (
                          <>
                            <td className="px-4 py-3 bg-orange-50/20">
                              <input 
                                type="number" 
                                value={ing.quantity}
                                onChange={(e) => handleInputChange(ing.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-orange-200 rounded px-2 py-1 text-right focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all font-semibold text-gray-700"
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="text" 
                                value={ing.unit}
                                onChange={(e) => handleInputChange(ing.id, 'unit', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-500 text-xs"
                                placeholder="u"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-gray-700 font-medium flex items-center gap-1">
                                <span className="text-gray-400 text-xs">$</span>
                                {ing.pricePerUnit.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-medium text-gray-700">
                              ${(ing.quantity * ing.pricePerUnit).toFixed(2)}
                            </td>
                          </>
                        )}

                        {/* INVENTORY VIEW CELLS */}
                        {activeTab === 'inventory' && (
                          <>
                            <td className="px-4 py-3 bg-blue-50/20 border-l border-gray-100">
                              <input 
                                type="number" 
                                value={ing.stock}
                                onChange={(e) => handleInputChange(ing.id, 'stock', parseFloat(e.target.value) || 0)}
                                className={`w-full bg-white border rounded px-2 py-1 text-right focus:ring-2 outline-none transition-all font-medium ${isLowStock ? 'border-red-300 text-red-600 focus:ring-red-100' : 'border-blue-200 text-gray-700 focus:ring-blue-100'}`}
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="px-4 py-3">
                               <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input 
                                  type="number" 
                                  value={ing.pricePerUnit}
                                  onChange={(e) => handleInputChange(ing.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                                  className="w-full bg-white border border-gray-200 rounded pl-5 pr-2 py-1 text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-gray-700"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                               <span className="text-gray-500 text-xs">{ing.unit}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                               <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded border ${stockStatusColor}`}>
                                 {stockStatusText}
                               </span>
                            </td>
                          </>
                        )}

                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => removeIngredient(ing.id)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                            title="Eliminar fila"
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {ingredients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400 italic">
                        No hay insumos registrados. Agrega uno para comenzar.
                      </td>
                    </tr>
                  )}
                </tbody>
                {activeTab === 'recipe' && (
                  <tfoot className="bg-gray-50 font-semibold text-gray-700 border-t border-gray-200">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-right text-xs uppercase tracking-wider">Total Materia Prima</td>
                      <td className="px-4 py-3 text-right text-base">${analysis.totalMaterials.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: Settings & Summary */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto shadow-xl z-20 shrink-0">
          
          {/* Global Settings */}
          <section>
             <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Configuración de Lote</h3>
             
             <div className="space-y-4">
               {/* Main Output */}
               <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 transition-all focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-300">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-orange-800 uppercase tracking-wide">Unidades a Producir</label>
                    <div className="bg-white p-1 rounded-full shadow-sm">
                      <BreadIcon />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                     <input 
                      type="number"
                      value={yieldUnits}
                      onChange={(e) => setYieldUnits(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-2xl font-bold text-gray-800 focus:outline-none focus:border-orange-400 text-center"
                    />
                  </div>
                  <p className="text-center text-[10px] text-orange-600 mt-2 font-medium">Panes obtenidos con esta receta</p>
               </div>

               {/* Operational Costs Grid */}
               <div className="grid grid-cols-2 gap-3">
                 {/* Labor */}
                 <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-gray-200 focus-within:bg-white transition-all">
                    <div className="flex items-center gap-2 mb-2">
                       <UsersIcon />
                       <label className="text-[10px] font-bold text-gray-500 uppercase">Mano de Obra</label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input 
                        type="number"
                        value={laborCost}
                        onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-lg pl-5 pr-2 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                 </div>

                 {/* Fixed Costs */}
                 <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-gray-200 focus-within:bg-white transition-all">
                    <div className="flex items-center gap-2 mb-2">
                       <BoltIcon />
                       <label className="text-[10px] font-bold text-gray-500 uppercase">Gastos Fijos</label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input 
                        type="number"
                        value={fixedCosts}
                        onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-lg pl-5 pr-2 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                 </div>
               </div>
             </div>
          </section>

          {/* Inventory Valuation Section */}
          <section className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Estado del Inventario</h3>
            <SummaryCard 
              label="Valor Total en Stock" 
              value={totalInventoryValue}
              isCurrency={true}
              subtext="Capital inmovilizado en insumos."
            />
          </section>

          {/* Results Cards */}
          <section className="space-y-3 mt-auto">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Resultados Financieros</h3>
            
            <SummaryCard 
              label="Costo Total Lote" 
              value={analysis.totalProduction} 
            />
            
            <SummaryCard 
              label="Costo Unitario (Por Pan)" 
              value={analysis.costPerUnit} 
              highlight={true}
              subtext="Costo de producción puro, sin margen de ganancia."
            />
          </section>

          {/* Production Action */}
          <section className="pt-2">
            <button 
              onClick={handleProductionRun}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold ${
                lowStockCount > 0 ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <CheckCircleIcon />
              Registrar Lote y Descontar
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              {lowStockCount > 0 
                ? '⚠️ Hay insumos insuficientes, el stock quedará negativo.' 
                : 'Esto restará los ingredientes usados de tu stock actual.'}
            </p>
          </section>
        </div>
      </main>

      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalizeProduction}
        yieldUnits={yieldUnits}
        missingStock={missingStockItems}
      />
    </div>
  );
}