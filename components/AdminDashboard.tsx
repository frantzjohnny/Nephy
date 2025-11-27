import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Settings as SettingsIcon, LogOut, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { MenuItem, RestaurantSettings, CATEGORIES, Category } from '../types';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  settings: RestaurantSettings;
  onUpdateSettings: (settings: RestaurantSettings) => void;
  onAddProduct: (item: MenuItem) => void;
  onUpdateProduct: (item: MenuItem) => void;
  onDeleteProduct: (id: string) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  menuItems,
  settings,
  onUpdateSettings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onExit
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'settings'>('menu');
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  
  // UI State for Image Upload vs URL
  const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');
  const [logoInputType, setLogoInputType] = useState<'url' | 'file'>('url');

  // Settings State
  const [tempSettings, setTempSettings] = useState<RestaurantSettings>(settings);

  // Helper: Convert File to Base64
  const handleFileUpload = (file: File, callback: (base64: string) => void) => {
    if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        alert("L'image est trop grande. Veuillez utiliser une image de moins de 2MB.");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            callback(reader.result);
        }
    };
    reader.readAsDataURL(file);
  };

  // Form Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    alert('Paramètres enregistrés avec succès!');
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.price) return;

    const newItem: MenuItem = {
      id: editingItem.id || Date.now().toString(),
      name: editingItem.name,
      description: editingItem.description || '',
      ingredients: typeof editingItem.ingredients === 'string' 
        ? (editingItem.ingredients as string).split(',').map((s: string) => s.trim()).filter(Boolean)
        : editingItem.ingredients || [],
      price: Number(editingItem.price),
      category: editingItem.category || 'Entrées',
      available: editingItem.available ?? true,
      featured: editingItem.featured ?? false,
      image: editingItem.image || `https://picsum.photos/400/300?random=${Date.now()}`
    };

    if (editingItem.id) {
      onUpdateProduct(newItem);
    } else {
      onAddProduct(newItem);
    }
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Admin Header */}
      <header className="bg-gray-800 text-white p-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-brand-orange p-1.5 rounded-lg">
                <SettingsIcon size={20} className="text-white" />
             </div>
             <h1 className="font-bold text-lg hidden sm:block">Administration</h1>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={() => setActiveTab('menu')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === 'menu' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
             >
                Menu
             </button>
             <button 
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
             >
                Paramètres
             </button>
             <button onClick={onExit} className="ml-4 text-red-400 hover:text-red-300">
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {activeTab === 'settings' ? (
          <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto animate-fade-in">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Configuration du Restaurant</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Logo Upload Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo du Restaurant</label>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2 mb-1">
                        <button
                            type="button"
                            onClick={() => setLogoInputType('url')}
                            className={`flex-1 text-xs py-1.5 rounded border flex items-center justify-center gap-1 ${logoInputType === 'url' ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 text-gray-600'}`}
                        >
                            <LinkIcon size={12} /> Lien URL
                        </button>
                        <button
                            type="button"
                            onClick={() => setLogoInputType('file')}
                            className={`flex-1 text-xs py-1.5 rounded border flex items-center justify-center gap-1 ${logoInputType === 'file' ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 text-gray-600'}`}
                        >
                            <Upload size={12} /> Fichier Local
                        </button>
                    </div>

                    {logoInputType === 'url' ? (
                        <input
                            type="text"
                            placeholder="https://exemple.com/logo.png"
                            value={tempSettings.logo || ''}
                            onChange={(e) => setTempSettings({...tempSettings, logo: e.target.value})}
                            className="w-full p-2 border rounded-lg text-sm"
                        />
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, (base64) => setTempSettings({...tempSettings, logo: base64}));
                            }}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange/10 file:text-brand-orange hover:file:bg-brand-orange/20"
                        />
                    )}

                    {tempSettings.logo && (
                        <div className="mt-2 w-20 h-20 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                            <img src={tempSettings.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                            <button 
                                type="button"
                                onClick={() => setTempSettings({...tempSettings, logo: ''})}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Restaurant</label>
                <input 
                  type="text" 
                  value={tempSettings.name}
                  onChange={e => setTempSettings({...tempSettings, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
                <input 
                  type="text" 
                  value={tempSettings.whatsappNumber}
                  onChange={e => setTempSettings({...tempSettings, whatsappNumber: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                  pattern="[0-9]+"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais de Livraison (HTG)</label>
                <input 
                  type="number" 
                  value={tempSettings.deliveryFee || 0}
                  onChange={e => setTempSettings({...tempSettings, deliveryFee: Number(e.target.value)})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message de Bienvenue</label>
                <textarea 
                  value={tempSettings.welcomeMessage}
                  onChange={e => setTempSettings({...tempSettings, welcomeMessage: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                  rows={3}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-brand-orange text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} /> Sauvegarder
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Gestion du Menu</h2>
              <button 
                onClick={() => setEditingItem({ category: 'Entrées', available: true, featured: false, ingredients: [] })}
                className="bg-brand-green text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Nouveau Plat
              </button>
            </div>

            {/* List by Category */}
            {CATEGORIES.map(category => (
              <div key={category} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                   <h3 className="font-bold text-gray-700">{category}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {menuItems.filter(i => i.category === category).map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                          {item.featured && (
                              <div className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] px-1 font-bold rounded-bl shadow-sm">
                                  Slider
                              </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          <div className="text-sm text-brand-orange font-medium">{item.price} HTG</div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                             if(window.confirm('Supprimer ce plat ?')) onDeleteProduct(item.id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {menuItems.filter(i => i.category === category).length === 0 && (
                    <div className="p-4 text-center text-gray-400 italic text-sm">Aucun plat dans cette catégorie</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for Add/Edit */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">{editingItem.id ? 'Modifier le plat' : 'Nouveau plat'}</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 hover:bg-gray-200 rounded-full">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
                <input 
                  type="text" 
                  value={editingItem.name || ''}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              {/* Image Input Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo du plat</label>
                <div className="flex gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => setImageInputType('url')}
                        className={`flex-1 text-sm py-1.5 rounded border ${imageInputType === 'url' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600'}`}
                    >
                        Lien URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setImageInputType('file')}
                        className={`flex-1 text-sm py-1.5 rounded border ${imageInputType === 'file' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600'}`}
                    >
                        Fichier Local
                    </button>
                </div>
                
                {imageInputType === 'url' ? (
                     <input 
                        type="text"
                        placeholder="https://..."
                        value={editingItem.image || ''}
                        onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                        className="w-full p-2 border rounded-lg text-sm"
                     />
                ) : (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (base64) => setEditingItem({...editingItem, image: base64}));
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange/10 file:text-brand-orange hover:file:bg-brand-orange/20"
                    />
                )}
                
                {/* Preview */}
                {editingItem.image && (
                    <div className="mt-2 h-32 w-full bg-gray-100 rounded-lg overflow-hidden border">
                         <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (HTG)</label>
                  <input 
                    type="number" 
                    value={editingItem.price || ''}
                    onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded-lg"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select 
                    value={editingItem.category}
                    onChange={e => setEditingItem({...editingItem, category: e.target.value as Category})}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editingItem.description || ''}
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients (séparés par virgule)</label>
                <textarea 
                  value={Array.isArray(editingItem.ingredients) ? editingItem.ingredients.join(', ') : editingItem.ingredients || ''}
                  onChange={e => setEditingItem({...editingItem, ingredients: e.target.value as any})} 
                  placeholder="Ex: Riz, Pois, Épices..."
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                 <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="available"
                      checked={editingItem.available ?? true}
                      onChange={e => setEditingItem({...editingItem, available: e.target.checked})}
                      className="w-5 h-5 text-brand-orange rounded cursor-pointer"
                    />
                    <label htmlFor="available" className="text-gray-700 cursor-pointer">Disponible à la vente</label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={editingItem.featured ?? false}
                      onChange={e => setEditingItem({...editingItem, featured: e.target.checked})}
                      className="w-5 h-5 text-brand-orange rounded cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-gray-700 cursor-pointer flex items-center gap-2">
                         Destacar no Slider (Topo)
                         <span className="text-xs bg-brand-orange text-white px-1.5 rounded">Featured</span>
                    </label>
                  </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200"
                >
                  {editingItem.id ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;