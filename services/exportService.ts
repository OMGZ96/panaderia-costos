import * as XLSX from 'xlsx';

export const exportService = {
  /**
   * Exporta datos a Excel con manejo mejorado para móviles
   */
  exportToExcel: async (data: any[], sheetName: string, fileName: string) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Auto-ajustar ancho de columnas
      const columnWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generar archivo
      XLSX.writeFile(workbook, fileName);
      
      return { success: true, message: `${fileName} descargado correctamente` };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      return { success: false, message: 'Error al exportar archivo' };
    }
  },

  /**
   * Exporta inventario completo
   */
  exportInventory: async (ingredients: any[]) => {
    if (ingredients.length === 0) {
      return { success: false, message: 'No hay ingredientes para exportar' };
    }

    const dataToExport = ingredients.map(ing => ({
      'Ingrediente': ing.name,
      'Stock Actual': ing.stock,
      'Unidad': ing.unit,
      'Precio por Unidad': ing.pricePerUnit.toFixed(2),
      'Valor Total Stock': (ing.stock * ing.pricePerUnit).toFixed(2)
    }));

    // Agregar fila de totales
    const totalValue = ingredients.reduce((sum, ing) => sum + (ing.stock * ing.pricePerUnit), 0);
    dataToExport.push({
      'Ingrediente': 'TOTAL',
      'Stock Actual': '',
      'Unidad': '',
      'Precio por Unidad': '',
      'Valor Total Stock': totalValue.toFixed(2)
    });

    const fileName = `Inventario_Panaderia_${new Date().toISOString().split('T')[0]}.xlsx`;
    return exportService.exportToExcel(dataToExport, 'Inventario Actual', fileName);
  },

  /**
   * Exporta historial de producción
   */
  exportHistory: async (history: any[]) => {
    if (history.length === 0) {
      return { success: false, message: 'No hay historial para exportar' };
    }

    const dataToExport = history.map(log => ({
      'Fecha': new Date(log.timestamp).toLocaleDateString('es-ES'),
      'Hora': new Date(log.timestamp).toLocaleTimeString('es-ES'),
      'Unidades Producidas': log.yieldUnits,
      'Costo Materia Prima': log.totalCost.toFixed(2),
      'Costo por Unidad': log.costPerUnit.toFixed(2),
      'Precio de Venta': log.salePrice.toFixed(2),
      'Ganancia Total': log.totalProfit.toFixed(2),
      'Ganancia por Unidad': (log.totalProfit / log.yieldUnits).toFixed(2)
    }));

    const fileName = `Historial_Produccion_${new Date().toISOString().split('T')[0]}.xlsx`;
    return exportService.exportToExcel(dataToExport, 'Historial', fileName);
  },

  /**
   * Exporta reporte completo (inventario + últimas producciones)
   */
  exportCompleteReport: async (ingredients: any[], history: any[]) => {
    try {
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Inventario actual
      if (ingredients.length > 0) {
        const inventoryData = ingredients.map(ing => ({
          'Ingrediente': ing.name,
          'Stock': ing.stock,
          'Unidad': ing.unit,
          'Precio Unit.': ing.pricePerUnit.toFixed(2),
          'Valor Total': (ing.stock * ing.pricePerUnit).toFixed(2)
        }));

        const totalInventoryValue = ingredients.reduce((sum, ing) => sum + (ing.stock * ing.pricePerUnit), 0);
        inventoryData.push({
          'Ingrediente': 'TOTAL INVENTARIO',
          'Stock': '',
          'Unidad': '',
          'Precio Unit.': '',
          'Valor Total': totalInventoryValue.toFixed(2)
        });

        const inventorySheet = XLSX.utils.json_to_sheet(inventoryData);
        inventorySheet['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Inventario');
      }

      // Sheet 2: Últimas 30 producciones
      if (history.length > 0) {
        const recentHistory = history.slice(0, 30);
        const historyData = recentHistory.map(log => ({
          'Fecha': new Date(log.timestamp).toLocaleDateString('es-ES'),
          'Hora': new Date(log.timestamp).toLocaleTimeString('es-ES'),
          'Unidades': log.yieldUnits,
          'Costo Total': log.totalCost.toFixed(2),
          'Costo/Unit': log.costPerUnit.toFixed(2),
          'Precio Venta': log.salePrice.toFixed(2),
          'Ganancia': log.totalProfit.toFixed(2)
        }));

        const totalProduction = recentHistory.reduce((sum, log) => sum + log.yieldUnits, 0);
        const totalCosts = recentHistory.reduce((sum, log) => sum + log.totalCost, 0);
        const totalRevenue = recentHistory.reduce((sum, log) => sum + (log.salePrice * log.yieldUnits), 0);
        const totalProfits = totalRevenue - totalCosts;

        historyData.push({
          'Fecha': 'TOTALES',
          'Hora': '',
          'Unidades': totalProduction,
          'Costo Total': totalCosts.toFixed(2),
          'Costo/Unit': (totalCosts / totalProduction).toFixed(2),
          'Precio Venta': '',
          'Ganancia': totalProfits.toFixed(2)
        });

        const historySheet = XLSX.utils.json_to_sheet(historyData);
        historySheet['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(workbook, historySheet, 'Historial');
      }

      const fileName = `Reporte_Completo_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      return { success: true, message: 'Reporte descargado correctamente' };
    } catch (error) {
      console.error('Error exporting complete report:', error);
      return { success: false, message: 'Error al generar reporte' };
    }
  }
};
