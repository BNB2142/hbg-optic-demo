
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Package, Search, Plus, Trash2, Printer, 
  Calendar, FileText, Truck, CreditCard, 
  X, Save, ChevronDown, Download, AlertCircle, 
  PlusCircle, ShoppingBag, Eye
} from 'lucide-react';
import { PurchaseOrder, Supplier, Product, PurchaseOrderItem, PaymentMethod, PaymentStatus, ShopSettings } from '../types';

interface DeliveriesProps {
  deliveries: PurchaseOrder[];
  suppliers: Supplier[];
  products: Product[];
  settings: ShopSettings;
  onAddDelivery: (delivery: Omit<PurchaseOrder, 'id'>) => void;
  onDeleteDelivery: (id: string) => void;
}

const PurchasePrintLayout = ({ delivery, supplier, settings }: { delivery: PurchaseOrder, supplier?: Supplier, settings: ShopSettings }) => {
  return (
    <div className="bg-white p-16 text-gray-900 font-sans w-[210mm] min-h-[297mm] mx-auto">
      <div className="flex justify-between items-start mb-12 border-b-8 pb-8" style={{ borderColor: settings.primaryColor }}>
        <div className="flex items-center gap-6">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" className="h-20 w-auto object-contain max-w-[180px]" />
          )}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ color: settings.primaryColor }}>{settings.name}</h2>
            <p className="text-sm text-gray-500 font-bold leading-tight mt-1">{settings.address}</p>
            <p className="text-sm text-gray-500">Tél: {settings.phone} | ICE: {settings.ice}</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-black uppercase tracking-widest text-gray-900">Bon d'Entrée</h1>
          <p className="text-sm font-mono font-bold text-gray-400 mt-2 uppercase">Réception Stock #{delivery.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Expéditeur (Fournisseur)</p>
          <p className="text-lg font-black uppercase text-gray-900">{supplier?.name || 'Inconnu'}</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{supplier?.address}</p>
          <p className="text-sm text-gray-700 font-bold mt-2">{supplier?.phone}</p>
        </div>
        <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Référence Livraison</p>
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-600 uppercase">Facture N°: <span className="text-gray-900 font-black ml-2">{delivery.invoice_number}</span></p>
            <p className="text-xs font-bold text-gray-600 uppercase">Date de réception: <span className="text-gray-900 font-black ml-2">{new Date(delivery.date).toLocaleDateString()}</span></p>
            <p className="text-xs font-bold text-gray-600 uppercase">Règlement: <span className="text-gray-900 font-black ml-2">{delivery.payment_method}</span></p>
          </div>
        </div>
      </div>

      <table className="w-full text-left mb-12 border-collapse overflow-hidden rounded-3xl shadow-sm border border-gray-100">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="p-6 text-xs font-black uppercase tracking-widest">Désignation Produit / Ref</th>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-center">Quantité</th>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-right">P.U HT</th>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-right">Sous-Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {delivery.items.map((item, idx) => (
            <tr key={idx}>
              <td className="p-6">
                <p className="text-sm font-black text-gray-900 uppercase">{item.brand}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">{item.model}</p>
              </td>
              <td className="p-6 text-center text-sm font-black text-gray-900">{item.quantity}</td>
              <td className="p-6 text-right text-sm font-bold text-gray-600">{item.unit_price.toFixed(2)}</td>
              <td className="p-6 text-right text-sm font-black text-gray-900">{(item.quantity * item.unit_price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end pt-10 border-t-8 border-dashed border-gray-50">
        <div className="w-80 space-y-4">
          <div className="flex justify-between items-center text-gray-500 uppercase font-black text-[11px] tracking-widest">
            <span>Base HT</span>
            <span>{delivery.total_amount.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between items-center text-gray-500 uppercase font-black text-[11px] tracking-widest">
            <span>TVA (0%)</span>
            <span>0.00 MAD</span>
          </div>
          <div className="flex justify-between items-center pt-5 border-t-2 text-gray-900 uppercase font-black text-lg tracking-tighter">
            <span>Total Général</span>
            <span className="text-3xl font-black" style={{ color: settings.primaryColor }}>{delivery.total_amount.toFixed(2)} MAD</span>
          </div>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-2 gap-20">
        <div className="border-t-4 border-gray-100 pt-6 text-center">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contrôle Qualité (Magasin)</p>
          <div className="h-24 border-2 border-dashed border-gray-50 rounded-[32px]"></div>
        </div>
        <div className="border-t-4 border-gray-100 pt-6 text-center">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Validation Stock (Opticien)</p>
          <div className="h-24 border-2 border-dashed border-gray-50 rounded-[32px]"></div>
        </div>
      </div>
    </div>
  );
};

const Deliveries: React.FC<DeliveriesProps> = ({ deliveries, suppliers, products, settings, onAddDelivery, onDeleteDelivery }) => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<PurchaseOrder | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (selectedDelivery && isPrinting) {
      const originalTitle = document.title;
      const supplier = suppliers.find(s => s.id === selectedDelivery.supplier_id);
      
      const dateStr = new Date(selectedDelivery.date).toLocaleDateString().replace(/\//g, '-');
      const supplierName = (supplier?.name || 'Fournisseur_Inconnu').replace(/\s+/g, '_');
      document.title = `${supplierName}_${dateStr}`;

      const timer = setTimeout(() => {
        window.print();
        document.title = originalTitle;
        setIsPrinting(false);
        setSelectedDelivery(null);
      }, 500);
      return () => {
        clearTimeout(timer);
        document.title = originalTitle;
      };
    }
  }, [selectedDelivery, isPrinting, suppliers]);

  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    supplier_id: '',
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'Virement',
    payment_status: 'Non payé',
    notes: '',
    items: []
  });

  useEffect(() => {
    if (view === 'create' && !formData.invoice_number) {
      const nextRefNumber = deliveries.length + 1;
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const autoRef = `FF-${nextRefNumber.toString().padStart(5, '0')}-${dateStr}`;
      setFormData(prev => ({ ...prev, invoice_number: autoRef }));
    }
  }, [view, deliveries.length, formData.invoice_number]);

  const filteredDeliveries = deliveries.filter(d => {
    const supplier = suppliers.find(s => s.id === d.supplier_id);
    const searchStr = `${d.invoice_number} ${supplier?.name || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const handleAddItem = () => {
    const newItem: PurchaseOrderItem = {
      product_id: '',
      brand: '',
      model: '',
      quantity: 1,
      unit_price: 0
    };
    setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...(formData.items || [])];
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          product_id: value,
          brand: product.brand,
          model: product.model,
          unit_price: product.purchase_price
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== index) }));
  };

  const totalAmount = useMemo(() => {
    return (formData.items || []).reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  }, [formData.items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_id || (formData.items || []).length === 0) {
      return alert("Veuillez remplir les informations obligatoires et ajouter au moins un produit.");
    }

    const deliveryData: Omit<PurchaseOrder, 'id'> = {
      supplier_id: formData.supplier_id!,
      invoice_number: formData.invoice_number!,
      date: formData.date!,
      payment_method: formData.payment_method!,
      payment_status: formData.payment_status!,
      notes: formData.notes,
      items: formData.items as PurchaseOrderItem[],
      total_amount: totalAmount,
      created_at: new Date().toISOString()
    };

    onAddDelivery(deliveryData);
    setView('list');
    setFormData({
      supplier_id: '',
      invoice_number: '',
      date: new Date().toISOString().split('T')[0],
      payment_method: 'Virement',
      payment_status: 'Non payé',
      notes: '',
      items: []
    });
  };

  const handlePrint = (delivery: PurchaseOrder) => {
    setSelectedDelivery(delivery);
    setIsPrinting(true);
  };

  if (view === 'create') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm no-print">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-3xl text-gray-500 transition-all">
              <X className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Enregistrer une Livraison</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nouveau bon d'entrée en stock</p>
            </div>
          </div>
          <button 
            form="delivery-form"
            type="submit"
            className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-100 transition-all"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Save className="w-5 h-5" />
            Valider l'entrée stock
          </button>
        </div>

        <form id="delivery-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 border-b pb-4">
                <Truck className="w-5 h-5" style={{ color: settings.primaryColor }} />
                Fournisseur & Ref
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fournisseur</label>
                  <select required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Réf. Facture (Suggérée: FF-XXXXX-DATE)</label>
                  <input required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.invoice_number} onChange={e => setFormData({...formData, invoice_number: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Réception</label>
                  <input type="date" required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Package className="w-5 h-5" style={{ color: settings.primaryColor }} /> Produits reçus
              </h3>
              <button type="button" onClick={handleAddItem} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-orange-500 transition-all flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Ajouter ligne
              </button>
             </div>
             <div className="space-y-4">
                {formData.items?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end bg-gray-50 p-6 rounded-[32px] border border-transparent hover:border-orange-100 transition-all">
                     <div className="col-span-6">
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Référence Produit</label>
                        <select className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold" value={item.product_id} onChange={e => updateItem(index, 'product_id', e.target.value)}>
                           <option value="">--- Choisir ---</option>
                           {products.map(p => <option key={p.id} value={p.id}>{p.brand} {p.model}</option>)}
                        </select>
                     </div>
                     <div className="col-span-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Qté</label>
                        <input type="number" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-center" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))} />
                     </div>
                     <div className="col-span-3">
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">P.U HT</label>
                        <input type="number" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-right" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value))} />
                     </div>
                     <div className="col-span-1 text-right">
                        <button type="button" onClick={() => removeItem(index)} className="p-3 text-red-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Entrée Stock (HT)</p>
                   <p className="text-4xl font-black text-gray-900 tracking-tighter">{totalAmount.toFixed(2)} MAD</p>
                </div>
             </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher une livraison..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-medium"
          />
        </div>
        <button onClick={() => setView('create')} className="bg-orange-500 text-white px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-100 flex items-center gap-3" style={{ backgroundColor: settings.primaryColor }}>
          <Plus className="w-6 h-6" /> Enregistrer Entrée Stock
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Réception # / Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fournisseur</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total HT</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDeliveries.map((delivery) => {
                const supplier = suppliers.find(s => s.id === delivery.supplier_id);
                return (
                  <tr key={delivery.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(delivery.date).toLocaleDateString()}</span>
                        <span className="text-xs font-mono font-black text-gray-900 uppercase">#{delivery.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{supplier?.name || 'Inconnu'}</p>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-gray-900">{delivery.total_amount.toFixed(2)} MAD</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handlePrint(delivery)} className="p-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-100 flex items-center gap-2" style={{ backgroundColor: settings.primaryColor }}>
                           <Printer className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Bordereau</span>
                        </button>
                        <button onClick={() => onDeleteDelivery(delivery.id)} className="p-3 bg-white border border-red-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isPrinting && selectedDelivery && ReactDOM.createPortal(
        <div className="bg-white">
          <PurchasePrintLayout 
            delivery={selectedDelivery} 
            supplier={suppliers.find(s => s.id === selectedDelivery.supplier_id)} 
            settings={settings}
          />
        </div>,
        document.getElementById('print-root') as HTMLElement
      )}
    </div>
  );
};

export default Deliveries;
