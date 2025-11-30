import { Ingredient } from './types';

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Harina 000', quantity: 50, stock: 100, unit: 'kg', pricePerUnit: 1.20 },
  { id: '2', name: 'Núcleo / Mejorador', quantity: 0.5, stock: 2, unit: 'kg', pricePerUnit: 15.00 },
  { id: '3', name: 'Levadura Fresca', quantity: 1.5, stock: 1, unit: 'kg', pricePerUnit: 4.50 },
  { id: '4', name: 'Aceite', quantity: 1, stock: 10, unit: 'L', pricePerUnit: 2.80 },
  { id: '6', name: 'Sal', quantity: 1, stock: 5, unit: 'kg', pricePerUnit: 0.80 },
];

export const DEFAULT_YIELD = 120; // Default number of breads produced
export const DEFAULT_LABOR = 50; // Default labor cost
export const DEFAULT_FIXED = 20; // Default fixed costs