import React, { useState } from 'react';
import { X, Check, ChefHat, Utensils } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductModalProps {
  item: MenuItem;
  drinks: MenuItem[]; // List of available drinks to upsell
  onClose: () => void;
  onAddToCart: (mainItem: MenuItem, selectedSides: string[], selectedDrinks: MenuItem[]) => void;
}

const SIDE_OPTIONS = [
  { id: 'riz_colle', label: "Riz Collé (Pois Rouges)", price: 150 },
  { id: 'riz_blanc', label: "Riz Blanc & Sauce Pois", price: 150 },
  { id: 'bananes', label: "Bananes Pesées", price: 150 },
  { id: 'pikliz', label: "Pikliz Extra", price: 50 },
  { id: 'macaroni', label: "Macaroni au Gratin", price: 250 },
  { id: 'pommes', label: "Pommes de Terre", price: 150 },
  { id: 'frites', label: "Frites", price: 150 }
];

const ProductModal: React.FC<ProductModalProps> = ({ item, drinks, onClose, onAddToCart }) => {
  const [selectedSideIds, setSelectedSideIds] = useState<string[]>([]);
  const [selectedDrinkIds, setSelectedDrinkIds] = useState<string[]>([]);

  const handleToggleSide = (sideId: string) => {
    setSelectedSideIds(prev => {
      if (prev.includes(sideId)) {
        return prev.filter(id => id !== sideId);
      } else {
        if (prev.length >= 4) return prev; // Limit to 4 selections
        return [...prev, sideId];
      }
    });
  };

  const handleToggleDrink = (drinkId: string) => {
    setSelectedDrinkIds(prev => 
      prev.includes(drinkId) 
        ? prev.filter(id => id !== drinkId) 
        : [...prev, drinkId]
    );
  };

  const handleConfirm = () => {
    const drinksToAdd = drinks.filter(d => selectedDrinkIds.includes(d.id));
    
    let finalItem = { ...item };
    let sideLabels: string[] = [];
    let totalSidePrice = 0;

    if (item.category === 'Plats Principaux') {
      SIDE_OPTIONS.forEach(s => {
        if (selectedSideIds.includes(s.id)) {
          totalSidePrice += s.price;
          sideLabels.push(s.label);
        }
      });
      // Add total side prices to the main item price for this instance
      finalItem.price += totalSidePrice;
    }
    
    onAddToCart(finalItem, sideLabels, drinksToAdd);
    onClose();
  };

  // Calculate dynamic totals for display
  const currentSidePriceTotal = SIDE_OPTIONS
    .filter(s => selectedSideIds.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
  
  const drinksTotal = drinks
    .filter(d => selectedDrinkIds.includes(d.id))
    .reduce((sum, d) => sum + d.price, 0);
  
  const totalPrice = item.price + currentSidePriceTotal + drinksTotal;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        
        {/* Image Header */}
        <div className="relative h-64 shrink-0 bg-gray-200">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur transition-colors z-10"
          >
            <X size={20} />
          </button>
          {/* Enhanced Gradient for better text visibility */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-24">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-md">{item.name}</h2>
            <p className="text-gray-200 text-sm leading-relaxed drop-shadow-sm">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Content - White Background Forced */}
        <div className="overflow-y-auto p-6 space-y-8 bg-white flex-1">
          
          {/* Section: Ingredients / Composition */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                <ChefHat size={16} className="text-brand-orange" />
                Ingrédients & Composition
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ing, idx) => (
                  <span key={idx} className="bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section: Accompaniments */}
          {item.category === 'Plats Principaux' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Utensils size={16} className="text-brand-orange" />
                  Accompagnements (Max 4)
                </h3>
                <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2 py-1 rounded-full">
                  {selectedSideIds.length}/4
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {SIDE_OPTIONS.map(side => {
                  const isSelected = selectedSideIds.includes(side.id);
                  const isDisabled = !isSelected && selectedSideIds.length >= 4;

                  return (
                    <label 
                      key={side.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-orange bg-orange-50 ring-1 ring-brand-orange shadow-sm' 
                          : isDisabled 
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => handleToggleSide(side.id)}
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-brand-orange border-brand-orange text-white' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={4} />}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                          {side.label}
                        </span>
                      </div>
                      {side.price > 0 && (
                        <span className={`text-sm font-bold ${isSelected ? 'text-brand-orange' : 'text-gray-400'}`}>
                          +{side.price} HTG
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Drinks Upsell */}
          {item.category !== 'Boissons' && drinks.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <span className="bg-brand-green w-2 h-2 rounded-full block"></span>
                Ajouter une boisson ?
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {drinks.map(drink => {
                   const isSelected = selectedDrinkIds.includes(drink.id);
                   return (
                    <label 
                      key={drink.id}
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-green bg-green-50 ring-1 ring-brand-green shadow-sm' 
                          : 'border-gray-200 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={() => handleToggleDrink(drink.id)}
                      />
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors shrink-0 ${
                        isSelected ? 'bg-brand-green border-brand-green text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={4} />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                          {drink.name}
                        </div>
                      </div>
                      <div className="font-bold text-brand-green">+{drink.price} HTG</div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white shrink-0 safe-area-bottom z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleConfirm}
            className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors flex items-center justify-between px-6 shadow-xl active:scale-[0.98] transform"
          >
            <span>Ajouter au panier</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-base">{totalPrice} HTG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;