import { CartItem, RestaurantSettings } from '../types';

export const generateWhatsAppLink = (
  cart: CartItem[], 
  settings: RestaurantSettings, 
  total: number,
  deliveryMethod: 'pickup' | 'delivery' = 'pickup',
  address: string = ''
): string => {
  const line = "━━━━━━━━━━━━━━━";
  
  let message = `🍽️ *NOUVELLE COMMANDE*\n`;
  message += `📍 ${settings.name}\n\n`;
  
  // Detalhes dos Itens
  message += `📋 *Détails de la commande:*\n\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}️⃣ *${item.name}* × ${item.quantity}\n`;
    
    // Multiple options support
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      item.selectedOptions.forEach(opt => {
         message += `   _+ ${opt}_\n`;
      });
    }
    // Fallback for backward compatibility if any
    else if ((item as any).selectedOption) {
       message += `   _+ ${(item as any).selectedOption}_\n`;
    }

    message += `   Prix unitaire: ${item.price} HTG\n`;
    message += `   Sous-total: ${item.price * item.quantity} HTG\n\n`;
  });

  message += `${line}\n`;
  
  // Detalhes da Entrega
  if (deliveryMethod === 'delivery') {
    message += `🛵 *MODE: LIVRAISON*\n`;
    message += `📍 Adresse: ${address}\n`;
    message += `📦 Frais: ${settings.deliveryFee} HTG\n`;
  } else {
    message += `🛍️ *MODE: À EMPORTER*\n`;
  }
  
  message += `${line}\n`;
  message += `💰 *TOTAL FINAL: ${total} HTG*\n`;
  message += `${line}\n\n`;
  
  const now = new Date();
  message += `📅 Date: ${now.toLocaleDateString('fr-HT')}\n`;
  message += `🕐 Heure: ${now.toLocaleTimeString('fr-HT', { hour: '2-digit', minute: '2-digit' })}\n`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // Clean phone number (remove +, spaces, dashes)
  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};