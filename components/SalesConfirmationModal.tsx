import React, { useState, useEffect } from 'react';
import { Buyer } from '../types';

interface SalesConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  buyers: Buyer[];
  totalQuantity: number;
  totalRevenue: number;
  currentStock: number;
  costPerUnit: number;
}

export const SalesConfirmationModal: React.FC<SalesConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  buyers,
  totalQuantity,
  totalRevenue,
  currentStock,
  costPerUnit
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (isOpen) setAcknowledged(false);
  }, [isOpen]);

  if (!isOpen) return null;

  // Analysis
  const isStockInsufficient = totalQuantity > currentStock;
  const activeBuyers = buyers.filter(b => b.quantity > 0);
  const lowPriceBuyers = activeBuyers.filter(b => b.pricePerUnit < costPerUnit);
  const hasLowPrice = lowPriceBuyers.length > 0;

  // Conditions to enable confirm button
  // If stock is insufficient, user MUST acknowledge.
  // Low price is just a visual warning, doesn't require extra checkbox logic (optional).
  const canConfirm = !isStockInsufficient || (isStockInsufficient && acknowledged);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-gray-100 bg-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Confirmar Venta</h3>
              <p className="text-xs text-gray-500">Resumen de transacción</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">Total Unidades</p>
                <p className="text-xl font-bold text-gray-800">{totalQuantity}</p>
             </div>
             <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center">
                <p className="text-xs text-purple-600 uppercase font-bold">Total Dinero</p>
                <p className="text-xl font-bold text-purple-700">${totalRevenue.toFixed(2)}</p>
             </div>
          </div>

          {/* Buyers List */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium text-xs">
                 <tr>
                   <th className="px-3 py-2 text-left">Cliente</th>
                   <th className="px-3 py-2 text-right">Cant.</th>
                   <th className="px-3 py-2 text-right">Total</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {activeBuyers.map(b => (
                   <tr key={b.id}>
                     <td className="px-3 py-2 text-gray-700">{b.name}</td>
                     <td className="px-3 py-2 text-right text-gray-600">{b.quantity}</td>
                     <td className="px-3 py-2 text-right font-bold text-gray-800">${(b.quantity * b.pricePerUnit).toFixed(2)}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>

          {/* WARNING: Price < Cost */}
          {hasLowPrice && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-yellow-800 text-xs font-bold uppercase flex items-center gap-1 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Alerta de Rentabilidad
              </h4>
              <p className="text-xs text-yellow-700">
                Algunos clientes tienen un precio de venta menor al costo de producción actual (${costPerUnit.toFixed(2)}). Esto generará pérdidas.
              </p>
            </div>
          )}

          {/* WARNING: Insufficient Stock */}
          {isStockInsufficient && (
             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
               <h4 className="text-red-800 text-xs font-bold uppercase flex items-center gap-1 mb-1">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                 </svg>
                 Stock Insuficiente
               </h4>
               <p className="text-xs text-red-700 mb-2">
                 Estás vendiendo <strong>{totalQuantity}</strong> unidades pero solo tienes <strong>{currentStock}</strong> en stock. El inventario quedará en negativo.
               </p>
               <div className="flex items-start gap-2 mt-2">
                 <input 
                   type="checkbox" 
                   id="ack-sales"
                   checked={acknowledged}
                   onChange={(e) => setAcknowledged(e.target.checked)}
                   className="mt-0.5 rounded border-red-300 text-red-600 focus:ring-red-500"
                 />
                 <label htmlFor="ack-sales" className="text-xs text-red-800 font-medium cursor-pointer">
                   Entiendo y deseo registrar la venta de todos modos.
                 </label>
               </div>
             </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
           <button 
             onClick={onClose}
             className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
           >
             Cancelar
           </button>
           <button 
             onClick={onConfirm}
             disabled={!canConfirm}
             className={`flex-1 px-4 py-2 rounded-lg text-white font-bold shadow-md transition-all text-sm ${
                canConfirm ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'
             }`}
           >
             Confirmar y Descontar
           </button>
        </div>

      </div>
    </div>
  );
};