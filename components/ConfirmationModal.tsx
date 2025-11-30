import React, { useState, useEffect } from 'react';
import { Ingredient } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  yieldUnits: number;
  missingStock: Ingredient[];
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  yieldUnits,
  missingStock
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  // Reset acknowledgment when modal opens or requirements change
  useEffect(() => {
    if (isOpen) {
      setAcknowledged(false);
    }
  }, [isOpen, missingStock]);

  if (!isOpen) return null;

  const hasMissing = missingStock.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${hasMissing ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar Producción</h3>
              <p className="text-sm text-gray-500">Registrar lote de {yieldUnits} unidades</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Esta acción registrará el lote en el historial y <strong>descontará automáticamente</strong> las cantidades de la receta de tu inventario actual.
          </p>

          {hasMissing && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 space-y-3">
              <div>
                <h4 className="text-red-800 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Advertencia de Stock Insuficiente
                </h4>
                <p className="text-xs text-red-600 mb-2">
                  Los siguientes insumos no tienen suficiente stock y quedarán en negativo:
                </p>
                <ul className="text-xs text-red-700 list-disc list-inside space-y-1 max-h-24 overflow-y-auto">
                  {missingStock.map((item) => (
                    <li key={item.id}>
                      <span className="font-medium">{item.name}</span>: Faltan {(item.quantity - item.stock).toFixed(2)} {item.unit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-start gap-2 pt-2 border-t border-red-100">
                <input 
                  type="checkbox" 
                  id="acknowledge-stock"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 rounded border-red-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="acknowledge-stock" className="text-xs text-red-800 font-medium cursor-pointer select-none">
                  Entiendo que el stock quedará en negativo y deseo continuar.
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={hasMissing && !acknowledged}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all flex justify-center items-center gap-2 text-sm ${
                hasMissing 
                  ? (acknowledged ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed') 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {hasMissing ? 'Confirmar (Forzar)' : 'Confirmar y Descontar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};