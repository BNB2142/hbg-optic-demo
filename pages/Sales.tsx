
import React, { useState } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, FileText, Eye, ShieldCheck, Glasses, UserCheck, Stethoscope, Phone, MapPin } from 'lucide-react';
import { Product, Customer, Sale, SalePrescription, VisionPrescription, Payment, PaymentMethod, StaffMember } from '../types';

interface SalesProps {
  products: Product[];
  customers: Customer[];
  staff: StaffMember[];
  onSaleComplete: (sale: Omit<Sale, 'id'>, items: {productId: string, qty: number}[]) => void;
}

const PrescriptionInput = ({ label, values, onChange }: { label: string, values: VisionPrescription, onChange: (v: VisionPrescription) => void }) => (
  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</h5>
    <div className="grid grid-cols-4 gap-2">
      <div>
        <label className="text-[9px] font-bold text-gray-400 block mb-1">SPH</label>
        <input type="number" step="0.25" className="w-full text-center p-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={values.sphere} onChange={e => onChange({...values, sphere: parseFloat(e.target.value) || 0})} />
      </div>
      <div>
        <label className="text-[9px] font-bold text-gray-400 block mb-1">CYL</label>
        <input type="number" step="0.25" className="w-full text-center p-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={values.cylinder} onChange={e => onChange({...values, cylinder: parseFloat(e.target.value) || 0})} />
      </div>
      <div>
        <label className="text-[9px] font-bold text-gray-400 block mb-1">AXE</label>
        <input type="number" className="w-full text-center p-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={values.axis} onChange={e => onChange({...values, axis: parseInt(e.target.value) || 0})} />
      </div>
      <div>
        <label className="text-[9px] font-bold text-gray-400 block mb-1">ADD</label>
        <input type="number" step="0.25" className="w-full text-center p-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={values.addition} onChange={e => onChange({...values, addition: parseFloat(e.target.value) || 0})} />
      </div>
    </div>
  </div>
);

const Sales: React.FC<SalesProps> = ({ products, customers, staff, onSaleComplete }) => {
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  
  // Doctor State
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [doctorAddress, setDoctorAddress] = useState('');

  const [visionType, setVisionType] = useState<'Loin' | 'Près' | 'Séparé'>('Loin');
  const [loinOD, setLoinOD] = useState<VisionPrescription>({sphere: 0, cylinder: 0, axis: 0, addition: 0});
  const [loinOG, setLoinOG] = useState<VisionPrescription>({sphere: 0, cylinder: 0, axis: 0, addition: 0});
  const [presOD, setPresOD] = useState<VisionPrescription>({sphere: 0, cylinder: 0, axis: 0, addition: 0});
  const [presOG, setPresOG] = useState<VisionPrescription>({sphere: 0, cylinder: 0, axis: 0, addition: 0});
  const [glassType, setGlassType] = useState('');
  const [insuranceType, setInsuranceType] = useState('');
  const [discount, setDiscount] = useState(0);
  const [advance, setAdvance] = useState(0);

  const categories = ['Toutes', 'Monture', 'Solaire', 'Lentilles', 'Accessoires'];
  const subTotal = cart.reduce((sum, item) => sum + (item.product.selling_price * item.qty), 0);
  const totalTTC = Math.max(0, subTotal - discount);

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) return alert("Produit en rupture !");
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleFinishSale = (method: PaymentMethod) => {
    if (!selectedClient) return alert("Veuillez choisir un client.");
    if (!selectedStaffId) return alert("Veuillez choisir le collaborateur qui réalise la vente.");
    if (cart.length === 0) return alert("Le panier est vide.");

    const prescription: SalePrescription = {
      visionType,
      loinOD: visionType !== 'Près' ? loinOD : undefined,
      loinOG: visionType !== 'Près' ? loinOG : undefined,
      presOD: visionType !== 'Loin' ? presOD : undefined,
      presOG: visionType !== 'Loin' ? presOG : undefined,
      glassType,
      insuranceType,
      doctor_name: doctorName,
      doctor_phone: doctorPhone,
      doctor_address: doctorAddress
    };

    const initialPayments: Payment[] = advance > 0 ? [{
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      amount: advance,
      method: method,
      date: new Date().toISOString()
    }] : [];

    // L'ID est généré par App.tsx
    const saleData: Omit<Sale, 'id'> = {
      customer_id: selectedClient.id,
      staff_id: selectedStaffId,
      total_amount: totalTTC,
      discount,
      tax_rate: 20,
      payment_method: method,
      payments: initialPayments,
      prescription,
      status: 'En attente',
      created_at: new Date().toISOString()
    };

    onSaleComplete(saleData, cart.map(i => ({ productId: i.product.id, qty: i.qty })));
  };

  const filteredProducts = products.filter(p => selectedCategory === 'Toutes' || p.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500 min-h-[85vh]">
      <div className="xl:col-span-8 flex flex-col gap-6">
        
        {/* Section Médecin */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Médecin Prescripteur</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><FileText className="w-3 h-3" /> Nom du Médecin</label>
              <input value={doctorName} onChange={e => setDoctorName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Dr. Prénom Nom" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</label>
              <input value={doctorPhone} onChange={e => setDoctorPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="06..." />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3" /> Adresse du cabinet</label>
              <input value={doctorAddress} onChange={e => setDoctorAddress(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ville, Quartier..." />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-black text-gray-900 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Eye className="w-5 h-5 text-orange-500" />
              Prescription Vision
            </h3>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['Loin', 'Près', 'Séparé'].map(type => (
                <button key={type} onClick={() => setVisionType(type as any)} className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${visionType === type ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(visionType === 'Loin' || visionType === 'Séparé') && (
              <div className="space-y-4">
                <h4 className="text-xs font-black text-orange-600 flex items-center gap-2 uppercase tracking-widest">Vision de Loin</h4>
                <PrescriptionInput label="Œil Droit (OD)" values={loinOD} onChange={setLoinOD} />
                <PrescriptionInput label="Œil Gauche (OG)" values={loinOG} onChange={setLoinOG} />
              </div>
            )}
            {(visionType === 'Près' || visionType === 'Séparé') && (
              <div className="space-y-4">
                <h4 className="text-xs font-black text-blue-600 flex items-center gap-2 uppercase tracking-widest">Vision de Près</h4>
                <PrescriptionInput label="Œil Droit (OD)" values={presOD} onChange={setPresOD} />
                <PrescriptionInput label="Œil Gauche (OG)" values={presOG} onChange={setPresOG} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Type de Verre</label>
              <input value={glassType} onChange={e => setGlassType(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ex: Progressifs, Polarisés..." />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assurance / Mutuelle</label>
              <input value={insuranceType} onChange={e => setInsuranceType(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ex: AXA, CNSS..." />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Rechercher par modèle ou marque..." className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-black rounded-xl border-2 transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200'}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
            {filteredProducts.map(p => (
              <div key={p.id} onClick={() => addToCart(p)} className="p-4 bg-gray-50 rounded-3xl border-2 border-transparent hover:border-orange-500 transition-all cursor-pointer group relative overflow-hidden text-center">
                <div className="h-24 bg-white rounded-2xl mb-3 flex items-center justify-center text-gray-100 relative">
                  <Glasses className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <div className={`absolute top-1 right-1 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg ${p.quantity === 0 ? 'bg-red-500' : 'bg-orange-500'}`}>{p.quantity === 0 ? 'RUPTURE' : `${p.quantity} EN STOCK`}</div>
                </div>
                <h4 className="text-xs font-black text-gray-900 truncate">{p.brand}</h4>
                <p className="text-[10px] text-gray-400 font-bold mb-1 truncate uppercase">{p.model}</p>
                <p className="text-orange-600 font-black text-sm">{p.selling_price} MAD</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest text-xs">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              Panier
            </h3>
            {selectedClient && <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase">{selectedClient.first_name}</span>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide min-h-[200px]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-40 py-12">
                <ShoppingCart className="w-16 h-16 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Votre panier est vide</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-200"><Glasses className="w-6 h-6" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate">{item.product.brand}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{item.qty} x {item.product.selling_price} MAD</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900">{(item.product.selling_price * item.qty).toFixed(2)}</p>
                    <button onClick={(e) => { e.stopPropagation(); setCart(c => c.filter(i => i.product.id !== item.product.id)); }} className="text-red-400 p-1 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-8 bg-gray-50 border-t space-y-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <FileText className="w-3 h-3" /> Client
                </label>
                <select required className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none" onChange={e => setSelectedClient(customers.find(c => c.id === e.target.value) || null)}>
                  <option value="">Sélectionner un client...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <UserCheck className="w-3 h-3" /> Membre de l'équipe
                </label>
                <select required className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none" value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)}>
                  <option value="">Qui réalise la vente ?</option>
                  {staff.filter(s => s.status === 'Actif').map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Remise (MAD)</label>
                  <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avance (MAD)</label>
                  <input type="number" value={advance} onChange={e => setAdvance(parseFloat(e.target.value) || 0)} className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net à Payer</p>
                  <p className="text-3xl font-black text-gray-900">{totalTTC.toFixed(2)} <span className="text-xs text-orange-500">MAD</span></p>
                </div>
                {advance > 0 && <p className="text-right text-[10px] font-black text-green-600 mt-1 uppercase tracking-widest">Restant: {(totalTTC - advance).toFixed(2)} MAD</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {(['Carte', 'Espèce', 'Virement'] as PaymentMethod[]).map(method => (
                <button key={method} onClick={() => handleFinishSale(method)} className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl hover:border-orange-500 transition-all text-gray-400 hover:text-orange-600 group">
                  {method === 'Carte' && <CreditCard className="w-4 h-4" />}
                  {method === 'Espèce' && <Banknote className="w-4 h-4" />}
                  {method === 'Virement' && <ShieldCheck className="w-4 h-4" />}
                  <span className="text-[8px] font-black uppercase tracking-widest">{method}</span>
                </button>
              ))}
            </div>

            <button 
              disabled={cart.length === 0 || !selectedClient || !selectedStaffId}
              onClick={() => handleFinishSale('Carte')}
              className="w-full py-5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:shadow-none text-white font-black rounded-3xl transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
            >
              <ShoppingCart className="w-5 h-5" />
              Enregistrer la Vente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
