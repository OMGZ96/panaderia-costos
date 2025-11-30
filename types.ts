
export interface Ingredient {
  id: string;
  name: string;
  quantity: number; // Required for recipe
  stock: number;    // Available in inventory
  unit: string;
  pricePerUnit: number;
}

export interface ProductionData {
  ingredients: Ingredient[];
  yieldUnits: number; // How many loaves of bread produced
  laborCost: number; // Cost of labor
  fixedCosts: number; // Electricity, gas, rent portion
}

export interface CostAnalysis {
  totalMaterials: number;
  totalProduction: number;
  costPerUnit: number;
}

export interface ProductionLog {
  id: string;
  timestamp: string;
  yieldUnits: number;
  totalCost: number;
  costPerUnit: number;
  laborCost?: number; // Snapshot of labor cost
  fixedCosts?: number; // Snapshot of fixed costs
  salePrice?: number; // Snapshot of sale price per unit used for calculation
  totalProfit?: number; // Snapshot of total profit for the batch
  ingredientsUsed: { 
    name: string; 
    quantity: number; 
    unit: string;
    cost?: number; // Snapshot of ingredient cost (quantity * price)
  }[];
}
