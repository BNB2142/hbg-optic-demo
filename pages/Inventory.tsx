
import React, { useState } from 'react';
import { Plus, Search, Glasses, Trash2, Edit2, AlertTriangle, Package, PackageOpen, Truck } from 'lucide-react';
import { Product, Supplier } from '../types';
import Modal from '../components/Modal';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  suppliers: Supplier[];
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, suppliers }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'out'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    brand: '', model: '', reference: '', type: 'Vue', color: '',
    purchase_price: 0, selling_price: 0, quantity: 0, min_stock: 5, supplier_id: '', category: 'MONTURE'
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = `${p.brand} ${p.model} ${p.reference}`.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'low') return matchesSearch && p.quantity <= p.min_stock && p.quantity > 0;
    if (activeTab === 'out') return matchesSearch && p.quantity === 0;
    return matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      brand: '', model: '', reference: '', type: 'Vue', color: '',
      purchase_price: 0, selling_price: 0, quantity: 0, min_stock: 5, supplier_id: suppliers[0]?.id || '', category: 'MONTURE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('⚠️ Voulez-vous vraiment supprimer définitivement ce produit du stock ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Product;
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex gap-2 p-2 bg-white border border-gray-100 rounded-[28px] w-fit shadow-sm">
          {(['all', 'low', 'out'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === tab ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {tab === 'all' ? 'Tous' : tab === 'low' ? 'Alertes' : 'Ruptures'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64 shadow-sm"
            />
          </div>
          <button onClick={handleOpenAdd} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl">
            <Plus className="w-5 h-5 inline mr-2" /> Ajouter Produit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Référence</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produit</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fournisseur</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Quantité</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Prix (MAD)</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => {
                const supplier = suppliers.find(s => s.id === product.supplier_id);
                const isLow = product.quantity <= product.min_stock;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-8 py-6"><span className="text-[10px] font-mono font-black text-gray-400">#{product.reference}</span></td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{product.brand}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{product.category} • {product.model}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-[10px] font-black text-gray-500 uppercase">{supplier?.name || '---'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-base font-black ${isLow ? 'text-red-600' : 'text-gray-900'}`}>{product.quantity}</span>
                      <p className="text-[8px] text-gray-300 font-black uppercase">Min: {product.min_stock}</p>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-orange-600">{product.selling_price.toFixed(2)}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleOpenEdit(product)} className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-orange-600 shadow-sm"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-white border border-red-50 rounded-xl text-gray-400 hover:text-red-600 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Modifier Produit" : "Nouvelle Référence"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marque</label>
              <input required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modèle / Référence</label>
              <input required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégorie</label>
              <select className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="MONTURE">MONTURE</option>
                <option value="SOLAIRE">SOLAIRE</option>
                <option value="LENTILLES">LENTILLES</option>
                <option value="ACCESSOIRES">ACCESSOIRES</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fournisseur</label>
              <select className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})}>
                <option value="">Sélectionner...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix d'Achat</label>
              <input type="number" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix Vente</label>
              <input type="number" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Initial</label>
              <input type="number" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seuil d'Alerte (Stock Min)</label>
            <input type="number" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: Number(e.target.value)})} />
          </div>
          <button type="submit" className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-orange-500 transition-all uppercase tracking-widest text-[10px]">
            Enregistrer les modifications
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
