
import React, { useState } from 'react';
import { ProductionLog } from '../types';
import * as XLSX from 'xlsx';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ProductionLog[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClearHistory }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!isOpen) return null;

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
        'Fecha': date.toLocaleDateString('es-MX'),
        'Hora': date.toLocaleTimeString('es-MX'),
        'ID Lote': log.id.substring(0, 8),
        'Unidades Producidas': log.yieldUnits,
        'Costo Total Lote': log.totalCost,
        'Costo Unitario': log.costPerUnit,
        'Precio Venta Unitario': log.salePrice || 0,
        'Ganancia Total': log.totalProfit || 0,
        'Mano de Obra (Global)': log.laborCost || 0,
        'Gastos Fijos (Global)': log.fixedCosts || 0,
      };

      // Create a row for each ingredient used
      return log.ingredientsUsed.map(ing => ({
        ...baseInfo,
        'Insumo Nombre': ing.name,
        'Cantidad Usada': ing.quantity,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historial de Producción
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-0 overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No hay lotes registrados aún.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3">Fecha / Hora</th>
                  <th className="px-6 py-3">Unidades</th>
                  <th className="px-6 py-3">Costo Total</th>
                  <th className="px-6 py-3">Costo Unit.</th>
                  <th className="px-6 py-3">Ganancia Est.</th>
                  <th className="px-6 py-3 text-center">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((log) => {
                   const isExpanded = expandedRow === log.id;
                   
                   // Calculate missing values for backward compatibility if needed
                   const hasDetails = log.ingredientsUsed.some(i => i.cost !== undefined) || log.laborCost !== undefined;
                   const totalIngredientsCost = log.ingredientsUsed.reduce((acc, curr) => acc + (curr.cost || 0), 0);
                   const profit = log.totalProfit || 0;
                   const isProfitPositive = profit >= 0;
                   
                   return (
                  <React.Fragment key={log.id}>
                    <tr className={`hover:bg-blue-50/20 transition-colors ${isExpanded ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {new Date(log.timestamp).toLocaleDateString('es-MX', { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-bold">
                        {log.yieldUnits} panes
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        ${log.totalCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-green-600 font-semibold">
                        ${log.costPerUnit.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 font-bold ${isProfitPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {log.totalProfit !== undefined ? `$${profit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleRow(log.id)}
                          className={`text-xs font-semibold focus:outline-none transition-colors border px-3 py-1 rounded ${isExpanded ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50'}`}
                        >
                          {isExpanded ? 'Ocultar' : 'Ver Detalles'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={6} className="p-0 border-b border-gray-100 shadow-inner">
                           <div className="bg-white m-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-3xl mx-auto">
                             <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                 </svg>
                                 <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Desglose de Costos del Lote</h4>
                               </div>
                               {!hasDetails && <span className="text-[10px] text-orange-500 font-medium">Lote antiguo (detalles limitados)</span>}
                             </div>
                             
                             <table className="w-full text-sm">
                               <thead className="bg-gray-50/50 text-gray-500 font-medium text-xs border-b border-gray-100">
                                 <tr>
                                   <th className="px-4 py-2 text-left w-1/2">Insumo</th>
                                   <th className="px-4 py-2 text-right">Cantidad</th>
                                   <th className="px-4 py-2 text-right">Costo</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-50">
                                 {log.ingredientsUsed.map((ing, idx) => (
                                   <tr key={idx} className="hover:bg-gray-50">
                                     <td className="px-4 py-2 font-medium text-gray-700">{ing.name}</td>
                                     <td className="px-4 py-2 text-right text-gray-600">
                                        {ing.quantity} {ing.unit}
                                     </td>
                                     <td className="px-4 py-2 text-right font-mono text-gray-700">
                                       {ing.cost !== undefined ? `$${ing.cost.toFixed(2)}` : '-'}
                                     </td>
                                   </tr>
                                 ))}
                               </tbody>
                               <tfoot className="bg-gray-50 border-t border-gray-200 text-xs">
                                 {hasDetails ? (
                                   <>
                                     <tr>
                                       <td className="px-4 py-1 text-right font-medium text-gray-500" colSpan={2}>Subtotal Materia Prima:</td>
                                       <td className="px-4 py-1 text-right font-medium text-gray-700">${totalIngredientsCost.toFixed(2)}</td>
                                     </tr>
                                     <tr>
                                       <td className="px-4 py-1 text-right font-medium text-gray-500" colSpan={2}>+ Mano de Obra:</td>
                                       <td className="px-4 py-1 text-right font-medium text-gray-700">${(log.laborCost || 0).toFixed(2)}</td>
                                     </tr>
                                     <tr>
                                       <td className="px-4 py-1 text-right font-medium text-gray-500" colSpan={2}>+ Gastos Fijos:</td>
                                       <td className="px-4 py-1 text-right font-medium text-gray-700">${(log.fixedCosts || 0).toFixed(2)}</td>
                                     </tr>
                                     <tr className="bg-orange-50 border-t border-orange-100">
                                       <td className="px-4 py-2 text-right font-bold text-gray-800 uppercase" colSpan={2}>Costo Total Producción:</td>
                                       <td className="px-4 py-2 text-right font-bold text-orange-600 text-sm">${log.totalCost.toFixed(2)}</td>
                                     </tr>
                                     {log.totalProfit !== undefined && (
                                       <tr className={log.totalProfit >= 0 ? "bg-green-50 border-t border-green-100" : "bg-red-50 border-t border-red-100"}>
                                         <td className="px-4 py-2 text-right font-bold text-gray-800 uppercase" colSpan={2}>Ganancia Neta:</td>
                                         <td className={`px-4 py-2 text-right font-bold text-sm ${log.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                           ${log.totalProfit.toFixed(2)}
                                         </td>
                                       </tr>
                                     )}
                                   </>
                                 ) : (
                                    <tr className="bg-orange-50 border-t border-orange-100">
                                       <td className="px-4 py-2 text-right font-bold text-gray-800 uppercase" colSpan={2}>Costo Total Producción:</td>
                                       <td className="px-4 py-2 text-right font-bold text-orange-600 text-sm">${log.totalCost.toFixed(2)}</td>
                                     </tr>
                                 )}
                               </tfoot>
                             </table>
                           </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )})}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
          <button 
             onClick={() => {
               if(window.confirm('¿Estás seguro de que quieres borrar todo el historial? Esta acción no se puede deshacer.')) onClearHistory();
             }}
             className="text-red-500 hover:text-red-700 text-xs font-medium px-4 py-2 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
             disabled={history.length === 0}
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Borrar Historial
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
