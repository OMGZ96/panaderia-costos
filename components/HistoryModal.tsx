
import React, { useState } from 'react';
import { ProductionLog } from '../types';
import * as XLSX from 'xlsx';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ProductionLog[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClearHistory, onDeleteItem }) => {
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
        <div className="p-0 overflow-y-auto flex-1 overflow-x-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No hay lotes ni ventas registradas aún.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse min-w-[600px]">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3">Fecha / Hora</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Unidades</th>
                  <th className="px-6 py-3">Costo Total</th>
                  <th className="px-6 py-3 text-center">Detalles / Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((log) => {
                   const isExpanded = expandedRow === log.id;
                   const isSale = log.type === 'sale';
                   
                   // Dynamic calculations for display
                   const calculatedRevenue = isSale && log.buyersSnapshot
                      ? log.buyersSnapshot.reduce((acc, curr) => acc + (curr.quantity * curr.pricePerUnit), 0)
                      : (log.totalProfit || 0);

                   const calculatedCOGS = !isSale 
                      ? log.ingredientsUsed.reduce((acc, curr) => acc + (curr.cost || 0), 0)
                      : 0;

                   const rowBgClass = isSale ? (isExpanded ? 'bg-purple-50/50' : 'hover:bg-purple-50/30') : (isExpanded ? 'bg-blue-50/30' : 'hover:bg-blue-50/20');
                   const textClass = isSale ? 'text-purple-700' : 'text-gray-800';
                   const unitsLabel = isSale ? 'vendidas' : 'panes';

                   return (
                  <React.Fragment key={log.id}>
                    <tr className={`transition-colors ${rowBgClass}`}>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {new Date(log.timestamp).toLocaleDateString('es-MX', { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${isSale ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                           {isSale ? 'Venta' : 'Lote'}
                         </span>
                      </td>
                      <td className={`px-6 py-4 font-bold ${textClass}`}>
                        {log.yieldUnits} {unitsLabel}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {isSale ? '-' : `$${log.totalCost.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => toggleRow(log.id)}
                            className={`text-xs font-semibold focus:outline-none transition-colors border px-3 py-1 rounded ${isExpanded ? 'bg-gray-100 text-gray-700 border-gray-300' : 'text-gray-500 hover:text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                          >
                            {isExpanded ? 'Ocultar' : 'Ver Detalles'}
                          </button>
                          
                          <button
                             onClick={(e) => {
                               e.stopPropagation();
                               onDeleteItem(log.id);
                             }}
                             className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                             title="Eliminar registro"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={5} className="p-0 border-b border-gray-100 shadow-inner">
                           <div className="bg-white m-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-3xl mx-auto">
                             <div className={`px-4 py-2 border-b border-gray-200 flex items-center justify-between ${isSale ? 'bg-purple-50' : 'bg-blue-50'}`}>
                               <div className="flex items-center gap-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isSale ? 'text-purple-500' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                 </svg>
                                 <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    {isSale ? 'Desglose de Ventas por Cliente' : 'Desglose de Costos del Lote'}
                                 </h4>
                               </div>
                             </div>
                             
                             <table className="w-full text-sm">
                               <thead className="bg-gray-50/50 text-gray-500 font-medium text-xs border-b border-gray-100">
                                 <tr>
                                   <th className="px-4 py-2 text-left w-1/2">{isSale ? 'Cliente' : 'Insumo'}</th>
                                   <th className="px-4 py-2 text-right">Cantidad</th>
                                   <th className="px-4 py-2 text-right">{isSale ? 'Precio Unit.' : 'Costo'}</th>
                                   {isSale && <th className="px-4 py-2 text-right">Subtotal</th>}
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-50">
                                 {isSale && log.buyersSnapshot ? (
                                    log.buyersSnapshot.map((buyer, idx) => (
                                      <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 font-medium text-gray-700">{buyer.name}</td>
                                        <td className="px-4 py-2 text-right text-gray-600">
                                            {buyer.quantity}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-600">
                                            ${buyer.pricePerUnit.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right font-mono text-gray-700 font-bold">
                                            ${(buyer.quantity * buyer.pricePerUnit).toFixed(2)}
                                        </td>
                                      </tr>
                                    ))
                                 ) : (
                                    log.ingredientsUsed.map((ing, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 font-medium text-gray-700">{ing.name}</td>
                                      <td className="px-4 py-2 text-right text-gray-600">
                                          {ing.quantity} {ing.unit}
                                      </td>
                                      <td className="px-4 py-2 text-right font-mono text-gray-700">
                                        {ing.cost !== undefined ? `$${ing.cost.toFixed(2)}` : '-'}
                                      </td>
                                    </tr>
                                    ))
                                 )}
                               </tbody>
                               <tfoot className="bg-gray-50 border-t border-gray-200 text-xs">
                                 {!isSale && (
                                   <>
                                     <tr>
                                       <td className="px-4 py-1 text-right font-medium text-gray-500" colSpan={2}>Costo de Insumos (COGS):</td>
                                       <td className="px-4 py-1 text-right font-medium text-gray-700">
                                          ${calculatedCOGS.toFixed(2)}
                                       </td>
                                     </tr>
                                     <tr>
                                       <td className="px-4 py-1 text-right font-medium text-gray-500" colSpan={2}>+ Mano de Obra:</td>
                                       <td className="px-4 py-1 text-right font-medium text-gray-700">${(log.laborCost || 0).toFixed(2)}</td>
                                     </tr>
                                     <tr>
                                       <td className="px-4 py-1 text-right font-medium text-gray-500" colSpan={2}>+ Gastos Fijos:</td>
                                       <td className="px-4 py-1 text-right font-medium text-gray-700">${(log.fixedCosts || 0).toFixed(2)}</td>
                                     </tr>
                                   </>
                                 )}
                                 
                                 {/* Grand Totals */}
                                 {isSale ? (
                                    <tr className="bg-purple-50 border-t border-purple-100">
                                       <td className="px-4 py-2 text-right font-bold text-gray-800 uppercase" colSpan={3}>Total Ingresos (Revenue):</td>
                                       <td className="px-4 py-2 text-right font-bold text-purple-600 text-sm">${calculatedRevenue.toFixed(2)}</td>
                                     </tr>
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
             className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg shadow-sm transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
