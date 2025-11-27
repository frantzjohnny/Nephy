import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { MenuItem } from '../types';

interface HeroProps {
  featuredItems: MenuItem[];
}

const Hero: React.FC<HeroProps> = ({ featuredItems }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtrar apenas itens marcados como destaque (featured) e disponíveis
  // Se não houver destaques, pega os primeiros 3 itens disponíveis como fallback
  let slides = featuredItems.filter(item => item.featured && item.available);
  
  if (slides.length === 0) {
    slides = featuredItems.filter(item => item.available).slice(0, 3);
  }

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-gray-900 mb-8 rounded-b-[2rem] shadow-xl">
      {/* Background Images Slider */}
      {slides.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {item.image ? (
             <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover opacity-70"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center opacity-70">
               <span className="text-white/20 text-4xl font-bold">Sans Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 max-w-5xl mx-auto z-10">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-brand-orange uppercase bg-brand-orange/20 rounded-full w-fit backdrop-blur-sm border border-brand-orange/30 shadow-sm animate-fade-in">
          Délice du Chef
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight drop-shadow-xl animate-slide-up">
          {currentSlide?.name}
        </h1>
        
        <p className="text-gray-100 text-lg md:text-xl max-w-xl mb-8 line-clamp-2 drop-shadow-lg font-medium animate-slide-up animation-delay-100">
          {currentSlide?.description}
        </p>
        
        <div className="flex items-center gap-4 animate-slide-up animation-delay-200">
          <button 
             onClick={() => {
               const el = document.getElementById(currentSlide?.category || 'Entrées');
               if(el) el.scrollIntoView({ behavior: 'smooth' });
             }}
             className="group bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-orange-600/30 hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2 text-lg"
          >
            Commander Maintenant
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                idx === currentIndex ? 'w-8 bg-brand-orange' : 'w-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;