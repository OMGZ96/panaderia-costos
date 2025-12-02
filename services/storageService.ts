import { Ingredient, ProductionLog } from '../types';

const STORAGE_KEYS = {
  INGREDIENTS: 'panaderia_ingredients',
  PRODUCTION_HISTORY: 'panaderia_productionHistory',
  YIELD_UNITS: 'panaderia_yieldUnits',
  LABOR_COST: 'panaderia_laborCost',
  FIXED_COSTS: 'panaderia_fixedCosts',
  SALE_PRICE: 'panaderia_salePrice',
};

export const storageService = {
  // Ingredients
  saveIngredients: (ingredients: Ingredient[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Failed to save ingredients:', error);
    }
  },

  loadIngredients: (defaultIngredients: Ingredient[]): Ingredient[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
      return saved ? JSON.parse(saved) : defaultIngredients;
    } catch (error) {
      console.error('Failed to load ingredients:', error);
      return defaultIngredients;
    }
  },

  // Production History
  saveProductionHistory: (history: ProductionLog[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTION_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save production history:', error);
    }
  },

  loadProductionHistory: (): ProductionLog[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTION_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load production history:', error);
      return [];
    }
  },

  // Configuration values
  saveConfig: (config: {
    yieldUnits: number;
    laborCost: number;
    fixedCosts: number;
    salePrice: number;
  }) => {
    try {
      localStorage.setItem(STORAGE_KEYS.YIELD_UNITS, JSON.stringify(config.yieldUnits));
      localStorage.setItem(STORAGE_KEYS.LABOR_COST, JSON.stringify(config.laborCost));
      localStorage.setItem(STORAGE_KEYS.FIXED_COSTS, JSON.stringify(config.fixedCosts));
      localStorage.setItem(STORAGE_KEYS.SALE_PRICE, JSON.stringify(config.salePrice));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },

  loadConfig: (defaults: {
    yieldUnits: number;
    laborCost: number;
    fixedCosts: number;
    salePrice: number;
  }) => {
    try {
      return {
        yieldUnits: JSON.parse(localStorage.getItem(STORAGE_KEYS.YIELD_UNITS) || JSON.stringify(defaults.yieldUnits)),
        laborCost: JSON.parse(localStorage.getItem(STORAGE_KEYS.LABOR_COST) || JSON.stringify(defaults.laborCost)),
        fixedCosts: JSON.parse(localStorage.getItem(STORAGE_KEYS.FIXED_COSTS) || JSON.stringify(defaults.fixedCosts)),
        salePrice: JSON.parse(localStorage.getItem(STORAGE_KEYS.SALE_PRICE) || JSON.stringify(defaults.salePrice)),
      };
    } catch (error) {
      console.error('Failed to load config:', error);
      return defaults;
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },

  // Get storage size (in bytes)
  getStorageSize: (): number => {
    try {
      let size = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          size += value.length;
        }
      });
      return size;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  }
};
