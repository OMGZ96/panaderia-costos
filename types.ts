
export interface Ingredient {
  id: string;
  name: string;
  quantity: number; // Required for recipe
  stock: number;    // Available in inventory
  unit: string;
  pricePerUnit: number;
  minStockThreshold?: number; // User defined alert level
}

export interface Buyer {
  id: string;
  name: string;
  quantity: number;
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
  type?: 'production' | 'sale'; // Discriminator between production run and sales record
  timestamp: string;
  yieldUnits: number; // In sales, this represents total items sold
  totalCost: number; // In sales, this might be 0 or derived COGS
  costPerUnit: number; // In sales, this is average price per unit
  laborCost?: number; // Snapshot of labor cost
  fixedCosts?: number; // Snapshot of fixed costs
  salePrice?: number; // Snapshot of sale price per unit used for calculation
  totalProfit?: number; // In sales, this represents Total Revenue
  ingredientsUsed: { 
    name: string; 
    quantity: number; 
    unit: string;
    cost?: number; // Snapshot of ingredient cost (quantity * price)
  }[];
  buyersSnapshot?: Buyer[]; // Snapshot of buyers for sales logs
}