import React, { useState, useEffect } from 'react';
import { ShoppingBasket, Lock } from 'lucide-react';
import { MenuItem, CartItem, RestaurantSettings, CATEGORIES, Category } from './types';
import { INITIAL_MENU, DEFAULT_SETTINGS } from './constants';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import AdminDashboard from './components/AdminDashboard';
import Hero from './components/Hero';
import ProductModal from './components/ProductModal';

const App: React.FC = () => {
  // --- State Management ---
  
  // Menu Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('jacmel_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  // Settings
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('jacmel_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Shopping Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jacmel_cart'); // Session persistence
    return saved ? JSON.parse(saved) : [];
  });

  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('Entrées');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // --- Side Effects (Persistence) ---

  useEffect(() => {
    localStorage.setItem('jacmel_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('jacmel_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('jacmel_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Handlers ---

  const handleOpenProductModal = (item: MenuItem) => {
    setSelectedProduct(item);
  };

  const handleAddToCart = (item: MenuItem, selectedSides: string[] = [], selectedDrinks: MenuItem[] = []) => {
    setCart(prev => {
      let newCart = [...prev];

      // Helper to check array equality for options
      const areOptionsEqual = (arr1?: string[], arr2?: string[]) => {
        if (!arr1 && !arr2) return true;
        if (!arr1 || !arr2) return false;
        if (arr1.length !== arr2.length) return false;
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        return sorted1.every((val, index) => val === sorted2[index]);
      };

      // 1. Add Main Item
      const existingMainIndex = newCart.findIndex(i => 
        i.id === item.id && areOptionsEqual(i.selectedOptions, selectedSides)
      );
      
      if (existingMainIndex > -1) {
        newCart[existingMainIndex].quantity += 1;
      } else {
        newCart.push({ ...item, quantity: 1, selectedOptions: selectedSides });
      }

      // 2. Add Selected Drinks (as separate items)
      selectedDrinks.forEach(drink => {
        const existingDrinkIndex = newCart.findIndex(i => i.id === drink.id && (!i.selectedOptions || i.selectedOptions.length === 0));
        if (existingDrinkIndex > -1) {
          newCart[existingDrinkIndex].quantity += 1;
        } else {
          newCart.push({ ...drink, quantity: 1 });
        }
      });

      return newCart;
    });
    
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- Helpers ---
  const drinks = menuItems.filter(i => i.category === 'Boissons' && i.available);

  // --- Render ---

  if (isAdminMode) {
    return (
      <AdminDashboard 
        menuItems={menuItems}
        settings={settings}
        onUpdateSettings={setSettings}
        onAddProduct={(item) => setMenuItems(prev => [...prev, item])}
        onUpdateProduct={(item) => setMenuItems(prev => prev.map(i => i.id === item.id ? item : i))}
        onDeleteProduct={(id) => setMenuItems(prev => prev.filter(i => i.id !== id))}
        onExit={() => setIsAdminMode(false)}
      />
    );
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {settings.logo && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                    <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
            )}
            <h1 className="text-xl font-bold text-brand-orange tracking-tight">{settings.name}</h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Admin Toggle */}
            <button 
              onClick={() => setIsAdminMode(true)}
              className="text-gray-300 hover:text-gray-600 transition-colors p-2"
              aria-label="Admin Mode"
            >
              <Lock size={16} />
            </button>

            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-brand-dark text-white p-2.5 rounded-full hover:bg-black transition-transform active:scale-95 shadow-lg shadow-gray-300"
            >
              <ShoppingBasket size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-3 border-t border-gray-50 bg-white/50">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                const el = document.getElementById(cat);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 140;
                  window.scrollTo({top: y, behavior: 'smooth'});
                }
              }}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat 
                  ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-200' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Modern Hero Section */}
      <Hero featuredItems={menuItems} />

      {/* Menu Grid */}
      <main className="max-w-5xl mx-auto px-4 space-y-12">
        {CATEGORIES.map(category => {
          const items = menuItems.filter(item => item.category === category);
          if (items.length === 0) return null;

          return (
            <section key={category} id={category} className="scroll-mt-40">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <ProductCard key={item.id} item={item} onAdd={handleOpenProductModal} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t bg-white py-10 px-4">
        <div className="max-w-5xl mx-auto text-center text-gray-400 text-sm">
          <p className="font-semibold text-gray-600 mb-2">{settings.name}</p>
          <p>Jacmel, Haïti</p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} Menu Digital. Fait avec amour pour la cuisine créole.</p>
          <p className="mt-2 text-xs font-medium text-gray-500">Développé par Johnny Frantz T Rene</p>
        </div>
      </footer>

      {/* Product Modal (The new selection flow) */}
      {selectedProduct && (
        <ProductModal 
          item={selectedProduct}
          drinks={drinks}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        settings={settings}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
      />
    </div>
  );
};

export default App;