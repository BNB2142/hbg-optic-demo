
import React, { useState, useRef, useEffect } from 'react';
import { Building, MapPin, Palette, Phone, Save, Check, Upload, Trash2, ImageIcon } from 'lucide-react';
import { ShopSettings } from '../types';

interface SettingsProps {
  settings: ShopSettings;
  setSettings: (settings: ShopSettings) => void;
}

const PRESET_COLORS = [
  { name: 'Orange HBG', hex: '#f97316' },
  { name: 'Bleu Optique', hex: '#0284c7' },
  { name: 'Vert Médical', hex: '#059669' },
  { name: 'Noir Luxe', hex: '#18181b' },
  { name: 'Rouge Moderne', hex: '#dc2626' },
  { name: 'Violet Soft', hex: '#7c3aed' },
];

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  // Synchroniser l'état local avec les props au montage
  const [localSettings, setLocalSettings] = useState<ShopSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mettre à jour l'état local si les settings parents changent (ex: chargement storage)
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sauvegarde des paramètres...", localSettings);
    setSettings(localSettings);
    setIsSaved(true);
    
    // Feedback visuel de succès
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Le logo est trop lourd. Veuillez choisir une image de moins de 1 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLocalSettings(prev => ({ ...prev, logoUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Paramètres Magasin</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gérez l'identité et le style de votre boutique</p>
          </div>
          {isSaved && (
            <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-bounce flex items-center gap-2">
              <Check className="w-4 h-4" /> Changements Appliqués !
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Identité Visuelle */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 border-b pb-4">
                <Palette className="w-5 h-5 text-orange-500" />
                Identité Visuelle
              </h3>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo de la boutique</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-center relative group overflow-hidden">
                    {localSettings.logoUrl ? (
                      <>
                        <img src={localSettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-white rounded-xl text-gray-900 shadow-lg hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={removeLogo} className="p-2 bg-red-500 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Importer</span>
                      </button>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-bold text-gray-600">Le logo apparaîtra sur vos factures.</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase tracking-widest text-orange-500 border border-orange-100 px-4 py-2 rounded-xl hover:bg-orange-50 transition-all">
                      Choisir une image
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Couleur du thème</label>
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setLocalSettings(prev => ({ ...prev, primaryColor: color.hex }))}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-all group-hover:scale-110" style={{ backgroundColor: color.hex }}>
                        {localSettings.primaryColor === color.hex && <Check className="w-4 h-4" />}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 border-b pb-4">
                <Building className="w-5 h-5 text-orange-500" />
                Informations du Magasin
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom Commercial</label>
                  <input required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={localSettings.name} onChange={e => setLocalSettings(prev => ({...prev, name: e.target.value}))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ICE / Identifiant Fiscale</label>
                  <input required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={localSettings.ice} onChange={e => setLocalSettings(prev => ({...prev, ice: e.target.value}))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adresse</label>
                  <input required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={localSettings.address} onChange={e => setLocalSettings(prev => ({...prev, address: e.target.value}))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                    <input required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={localSettings.phone} onChange={e => setLocalSettings(prev => ({...prev, phone: e.target.value}))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TVA (%)</label>
                    <input type="number" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={localSettings.tva} onChange={e => setLocalSettings(prev => ({...prev, tva: Number(e.target.value)}))} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex justify-end">
          <button 
            type="submit"
            className="px-12 py-5 bg-orange-500 text-white font-black rounded-3xl hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-3 active:scale-95"
          >
            <Save className="w-5 h-5" />
            Mettre à jour tous les paramètres
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
