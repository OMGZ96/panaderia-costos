
import React, { useState, useMemo } from 'react';
import { ProductionLog } from '../types';
import * as XLSX from 'xlsx';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ProductionLog[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onDeleteDay: (dateString: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClearHistory, onDeleteItem, onDeleteDay }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Group history by Date
  const groupedHistory = useMemo(() => {
    if (!isOpen) return {}; // Optimization: don't compute if closed
    return history.reduce((acc, log) => {
      const dateKey = new Date(log.timestamp).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    }, {} as Record<string, ProductionLog[]>);
  }, [history, isOpen]);

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => {
    const timeA = new Date(groupedHistory[a][0].timestamp).getTime();
    const timeB = new Date(groupedHistory[b][0].timestamp).getTime();
    return timeB - timeA;
  });

  const toggleDate = (date: string) => {
    if (expandedDate === date) {
      setExpandedDate(null);
    } else {
      setExpandedDate(date);
    }
  };

  const toggleRow = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const handleExportExcel = () => {
    // Flatten the data for better Excel analysis (Pivot tables ready)
    const flatData = history.flatMap(log => {
      const date = new Date(log.timestamp);
      
      // Base info for the batch
      const baseInfo = {
        'Tipo': log.type === 'sale' ? 'Venta' : 'Producción',
        'Fecha': date.toLocaleDateString('es-MX'),
        'Hora': date.toLocaleTimeString('es-MX'),
        'ID Registro': log.id.substring(0, 8),
        'Unidades (Prod/Venta)': log.yieldUnits,
        'Costo Total': log.type === 'sale' ? 0 : log.totalCost,
        'Ganancia/Venta Total': log.totalProfit || 0,
      };

      if (log.type === 'sale' && log.buyersSnapshot) {
         return log.buyersSnapshot.map(buyer => ({
            ...baseInfo,
            'Detalle Nombre': buyer.name,
            'Cantidad': buyer.quantity,
            'Precio Unitario': buyer.pricePerUnit,
            'Subtotal': buyer.quantity * buyer.pricePerUnit
         }));
      }

      // Create a row for each ingredient used (Production)
      return log.ingredientsUsed.map(ing => ({
        ...baseInfo,
        'Detalle Nombre': ing.name,
        'Cantidad': ing.quantity,
        'Unidad': ing.unit,
        'Costo Insumo': ing.cost || 0
      }));
    });

    if (flatData.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial Detallado");

    // Generate file name with current date
    const fileName = `Historial_Panaderia_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Write file
    XLSX.writeFile(workbook, fileName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historial de Producción y Ventas
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-0 overflow-y-auto flex-1 overflow-x-auto bg-gray-50/30">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No hay lotes ni ventas registradas aún.</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {sortedDates.map((date) => {
                const logs = groupedHistory[date];
                const isDateExpanded = expandedDate === date;
                
                // Day Summaries
                const totalProductionRuns = logs.filter(l => l.type === 'production').length;
                const totalSalesRuns = logs.filter(l => l.type === 'sale').length;
                const dailyCost = logs.reduce((acc, l) => acc + (l.type === 'production' ? l.totalCost : 0), 0);
                const dailyRevenue = logs.reduce((acc, l) => acc + (l.type === 'sale' ? (l.totalProfit || 0) : 0), 0);
                const dailyNet = dailyRevenue - dailyCost;

                return (
                  <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Day Header Row */}
                    <div 
                      className="p-4 flex flex-wrap gap-4 items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleDate(date)}
                    >
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className={`p-1.5 rounded-full transition-transform ${isDateExpanded ? 'rotate-90 bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                           </svg>
                        </div>
                        <h4 className="font-bold text-gray-800 text-lg capitalize">{date}</h4>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 flex-1 justify-center md:justify-start">
                         {totalProductionRuns > 0 && (
                            <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded">
                               <span className="font-bold">{totalProductionRuns}</span> Lotes
                            </span>
                         )}
                         {totalSalesRuns > 0 && (
                            <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded">
                               <span className="font-bold">{totalSalesRuns}</span> Ventas
                            </span>
                         )}
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold uppercase">Balance Día</p>
                          <p className={`font-mono font-bold ${dailyNet >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                             {dailyNet >= 0 ? '+' : ''}${dailyNet.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             onDeleteDay(date);
                           }}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                           title="Eliminar todo el día"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Day Details (List of Logs) */}
                    {isDateExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        <table className="w-full text-sm text-left border-collapse">
                          <thead className="bg-gray-100 text-gray-500 font-medium uppercase text-xs">
                            <tr>
                              <th className="px-6 py-2 w-32">Hora</th>
                              <th className="px-6 py-2 w-32">Tipo</th>
                              <th className="px-6 py-2">Resumen</th>
                              <th className="px-6 py-2 text-right">Monto</th>
                              <th className="px-6 py-2 text-center w-40">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                             {logs.map(log => {
                                const isExpanded = expandedRow === log.id;
                                const isSale = log.type === 'sale';
                                const calculatedRevenue = isSale && log.buyersSnapshot
                                  ? log.buyersSnapshot.reduce((acc, curr) => acc + (curr.quantity * curr.pricePerUnit), 0)
                                  : (log.totalProfit || 0);
                                const calculatedCOGS = !isSale 
                                  ? log.ingredientsUsed.reduce((acc, curr) => acc + (curr.cost || 0), 0)
                                  : 0;

                                return (
                                  <React.Fragment key={log.id}>
                                    <tr className={`bg-white hover:bg-gray-50 transition-colors`}>
                                      <td className="px-6 py-4 font-mono text-gray-500">
                                         {new Date(log.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                      </td>
                                      <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${isSale ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                           {isSale ? 'Venta' : 'Lote'}
                                         </span>
                                      </td>
                                      <td className="px-6 py-4 font-medium text-gray-700">
                                         {log.yieldUnits} {isSale ? 'unidades vendidas' : 'panes producidos'}
                                      </td>
                                      <td className="px-6 py-4 text-right font-mono">
                                         {isSale ? (
                                           <span className="text-green-600 font-bold">+${calculatedRevenue.toFixed(2)}</span>
                                         ) : (
                                           <span className="text-red-500 font-bold">-${log.totalCost.toFixed(2)}</span>
                                         )}
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                         <div className="flex items-center justify-center gap-2">
                                            <button 
                                              onClick={() => toggleRow(log.id)}
                                              className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                              {isExpanded ? 'Ocultar' : 'Ver Detalles'}
                                            </button>
                                            <button
                                               onClick={() => onDeleteItem(log.id)}
                                               className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                               title="Eliminar registro"
                                            >
                                              <TrashIcon />
                                            </button>
                                         </div>
                                      </td>
                                    </tr>

                                    {/* Detailed breakdown (Level 3) */}
                                    {isExpanded && (
                                      <tr>
                                        <td colSpan={5} className="p-4 bg-gray-50 shadow-inner">
                                           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-2xl mx-auto shadow-sm">
                                             <div className={`px-4 py-2 border-b border-gray-200 text-xs font-bold uppercase tracking-wide ${isSale ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {isSale ? 'Detalle de Compradores' : 'Detalle de Insumos Utilizados'}
                                             </div>
                                             <table className="w-full text-xs">
                                                <thead className="bg-gray-50 font-medium text-gray-500 border-b border-gray-100">
                                                   <tr>
                                                      <th className="px-3 py-2 text-left">{isSale ? 'Cliente' : 'Insumo'}</th>
                                                      <th className="px-3 py-2 text-right">Cant.</th>
                                                      <th className="px-3 py-2 text-right">{isSale ? 'Precio' : 'Costo'}</th>
                                                      {isSale && <th className="px-3 py-2 text-right">Subtotal</th>}
                                                   </tr>
                                                </thead>
                                                <tbody>
                                                   {isSale && log.buyersSnapshot ? (
                                                      log.buyersSnapshot.map((b, idx) => (
                                                         <tr key={idx} className="border-b border-gray-50 last:border-0">
                                                            <td className="px-3 py-2">{b.name}</td>
                                                            <td className="px-3 py-2 text-right">{b.quantity}</td>
                                                            <td className="px-3 py-2 text-right">${b.pricePerUnit}</td>
                                                            <td className="px-3 py-2 text-right font-bold">${(b.quantity * b.pricePerUnit).toFixed(2)}</td>
                                                         </tr>
                                                      ))
                                                   ) : (
                                                      log.ingredientsUsed.map((i, idx) => (
                                                         <tr key={idx} className="border-b border-gray-50 last:border-0">
                                                            <td className="px-3 py-2">{i.name}</td>
                                                            <td className="px-3 py-2 text-right">{i.quantity} {i.unit}</td>
                                                            <td className="px-3 py-2 text-right">${(i.cost || 0).toFixed(2)}</td>
                                                         </tr>
                                                      ))
                                                   )}
                                                </tbody>
                                             </table>
                                           </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                             })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
          <button 
             onClick={onClearHistory}
             className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg shadow-sm transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             disabled={history.length === 0}
          >
             <TrashIcon />
            Borrar Todo el Historial
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={handleExportExcel}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar Excel
            </button>
            
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium shadow-sm transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Icon inside HistoryModal
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
