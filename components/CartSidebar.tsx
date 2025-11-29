import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, MessageCircle, Bike, Store, MapPin, Printer } from 'lucide-react';
import { CartItem, RestaurantSettings } from '../types';
import { generateWhatsAppLink } from '../services/whatsapp';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: RestaurantSettings;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onUpdateQty,
  onRemove,
  onClear
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (deliveryMethod === 'delivery' && address.trim().length < 5) {
      alert("Veuillez entrer une adresse de livraison valide.");
      return;
    }

    const link = generateWhatsAppLink(cart, settings, total, deliveryMethod, address);
    window.open(link, '_blank');
    onClear();
    onClose();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const date = new Date().toLocaleString('fr-FR');

    const itemsHtml = cart.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 5px;">
        <div>
          <div style="font-weight: bold;">${item.quantity}x ${item.name}</div>
          ${item.selectedOptions && item.selectedOptions.length > 0 ? `<div style="font-size: 12px; color: #666;">+ ${item.selectedOptions.join(', ')}</div>` : ''}
        </div>
        <div>${item.price * item.quantity} HTG</div>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu - ${settings.name}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .footer { text-align: center; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; font-size: 12px; }
            .total { display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; font-size: 18px; }
            .info { font-size: 12px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0">${settings.name}</h2>
            <p style="margin:5px 0">Jacmel, Haïti</p>
          </div>
          
          <div class="info">
            <div>Date: ${date}</div>
            <div>Type: ${deliveryMethod === 'delivery' ? 'Livraison' : 'À emporter'}</div>
            ${deliveryMethod === 'delivery' ? `<div>Adresse: ${address}</div>` : ''}
          </div>

          <div class="items">
            ${itemsHtml}
          </div>

          <div style="margin-top: 15px; border-top: 1px solid #000; padding-top: 5px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Sous-total:</span>
              <span>${subtotal} HTG</span>
            </div>
            ${deliveryMethod === 'delivery' ? `
            <div style="display: flex; justify-content: space-between;">
              <span>Livraison:</span>
              <span>${deliveryFee} HTG</span>
            </div>` : ''}
            <div class="total">
              <span>TOTAL:</span>
              <span>${total} HTG</span>
            </div>
          </div>

          <div class="footer">
            <p>Merci de votre visite !</p>
            <p>À bientôt</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between bg-white shadow-sm z-10">
          <div className="flex items-center gap-2 text-brand-orange">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold text-gray-800">Votre Panier</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="text-lg">Votre panier est vide</p>
              <button onClick={onClose} className="text-brand-orange hover:underline font-medium">
                Retourner au menu
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedOptions.map((opt, i) => (
                            <span key={i} className="text-xs text-gray-600 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                              + {opt}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-brand-orange font-medium mt-1">{item.price * item.quantity} HTG</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="p-1.5 text-gray-600 hover:text-brand-orange hover:bg-orange-50 rounded-l-lg disabled:opacity-30 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="p-1.5 text-gray-600 hover:text-brand-orange hover:bg-orange-50 rounded-r-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-red-400 flex items-center gap-1 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Options */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Mode de commande</h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${deliveryMethod === 'pickup'
                        ? 'border-brand-green bg-green-50 text-brand-green ring-1 ring-brand-green'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                      }`}
                  >
                    <Store size={24} className="mb-1" />
                    <span className="text-sm font-bold">À emporter</span>
                  </button>

                  <button
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${deliveryMethod === 'delivery'
                        ? 'border-brand-orange bg-orange-50 text-brand-orange ring-1 ring-brand-orange'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                      }`}
                  >
                    <Bike size={24} className="mb-1" />
                    <span className="text-sm font-bold">Livraison</span>
                    <span className="text-[10px] mt-0.5">+{settings.deliveryFee} HTG</span>
                  </button>
                </div>

                {/* Address Input */}
                {deliveryMethod === 'delivery' && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <MapPin size={12} /> Adresse de livraison
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rue, numéro, point de repère..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange outline-none resize-none h-20"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t bg-white space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{subtotal} HTG</span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-brand-orange">
                  <span>Frais de livraison</span>
                  <span>+ {deliveryFee} HTG</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-lg pt-2 border-t border-dashed">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-2xl text-brand-orange">{total} HTG</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-brand-green hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deliveryMethod === 'delivery' && address.trim().length < 5}
            >
              <MessageCircle size={24} />
              {deliveryMethod === 'delivery' ? 'Commander (Livraison)' : 'Commander (À emporter)'}
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Printer size={20} />
              Imprimer le reçu
            </button>

            <button
              onClick={onClear}
              className="w-full py-2 text-gray-400 text-xs hover:text-red-500 transition-colors flex items-center justify-center gap-1"
            >
              <Trash2 size={12} /> Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;