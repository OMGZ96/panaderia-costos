// Servicio de Gemini deshabilitado - Sin API Key configurada
// Este archivo se mantuvo para referencia histórica

export const analyzeProductionCosts = async (
  data: any,
  analysis: any
): Promise<string> => {
  // Retorna un mensaje estático sin hacer llamadas a API
  return `
# Análisis de Costos

## Resumen Financiero
- **Costo Total Materiales**: $${analysis.totalMaterials.toFixed(2)}
- **Costo Total Producción**: $${analysis.totalProduction.toFixed(2)}
- **Costo Unitario**: $${analysis.costPerUnit.toFixed(2)}

## Información
La función de análisis inteligente con IA ha sido deshabilitada en esta versión.
Para usar análisis automático, configura una clave API de Google Gemini.
  `.trim();
};
