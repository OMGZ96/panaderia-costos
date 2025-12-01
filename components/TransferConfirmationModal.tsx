
import React from 'react';

interface TransferConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderCount: number;
  totalItems: number;
}

export const TransferConfirmationModal: React.FC<TransferConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderCount,
  totalItems
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-gray-100">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">Transferir a Ventas</h3>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
             <div className="flex justify-between items-center mb-1">
               <span className="text-xs text-gray-500 font-medium uppercase">Pedidos:</span>
               <span className="text-sm font-bold text-gray-800">{orderCount}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-xs text-gray-500 font-medium uppercase">Total Panes:</span>
               <span className="text-sm font-bold text-blue-600">{totalItems} unid.</span>
             </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            ¿Confirmas la transferencia? Los datos se moverán a la pestaña <strong>Ventas</strong> y la lista de pedidos actual se <strong>vaciará</strong>.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md text-sm transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
