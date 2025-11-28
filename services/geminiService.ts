import { GoogleGenAI } from "@google/genai";
import { ProductionData, CostAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProductionCosts = async (
  data: ProductionData,
  analysis: CostAnalysis
): Promise<string> => {
  try {
    const prompt = `
      Actúa como un consultor experto en panadería y finanzas. Analiza la siguiente estructura de costos e inventario para una producción de pan.
      
      Datos de Producción:
      - Cantidad producida: ${data.yieldUnits} unidades
      - Costo Mano de Obra Total: $${data.laborCost}
      - Costos Fijos (Luz/Gas): $${data.fixedCosts}
      
      Ingredientes e Inventario:
      ${data.ingredients.map(i => {
        const status = i.stock < i.quantity ? "INSUFICIENTE" : "OK";
        return `- ${i.name}: Requiere ${i.quantity} ${i.unit} | Stock: ${i.stock} ${i.unit} | Costo: $${i.pricePerUnit}/${i.unit} [Estado: ${status}]`;
      }).join('\n')}
      
      Resumen Financiero:
      - Costo Total Materiales: $${analysis.totalMaterials.toFixed(2)}
      - Costo Total Producción: $${analysis.totalProduction.toFixed(2)}
      - Costo Unitario: $${analysis.costPerUnit.toFixed(2)}

      Por favor provee:
      1. Un breve análisis de la rentabilidad.
      2. **Alerta de Inventario**: Si algún ingrediente es insuficiente (stock < requerimiento), indícalo claramente y sugiere acciones de compra urgente.
      3. Tres consejos concretos para optimizar costos o gestión de stock.
      
      Mantén la respuesta concisa, en formato markdown, usa negritas para resaltar puntos clave y alertas de stock bajo.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error al conectar con el asistente de IA. Por favor verifica tu conexión o intenta más tarde.";
  }
};