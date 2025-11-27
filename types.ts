export type Category = 'Entrées' | 'Plats Principaux' | 'Desserts' | 'Boissons';

export const CATEGORIES: Category[] = ['Entrées', 'Plats Principaux', 'Desserts', 'Boissons'];

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  ingredients?: string[]; // Lista de ingredientes
  price: number;
  category: Category;
  available: boolean;
  featured?: boolean; // Determina se aparece no Slider
  image?: string; // URL or placeholder
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: string[]; // Changed from string to string[] for multiple sides
}

export interface RestaurantSettings {
  name: string;
  whatsappNumber: string;
  welcomeMessage: string;
  deliveryFee: number;
  logo?: string; // Logo do restaurante (URL ou Base64)
}

export interface AppState {
  menuItems: MenuItem[];
  cart: CartItem[];
  settings: RestaurantSettings;
  isAdminMode: boolean;
  isCartOpen: boolean;
}