import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAdd }) => {
  if (!item.available) return null;

  return (
    <div 
      onClick={() => onAdd(item)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-brand-orange shadow-sm">
          {item.price} HTG
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{item.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
        </div>
        
        <button 
          className="w-full mt-2 bg-brand-orange/10 group-hover:bg-brand-orange text-brand-orange group-hover:text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
        >
          <Plus size={18} />
          <span>Voir & Ajouter</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;