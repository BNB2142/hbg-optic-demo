
import React, { useState } from 'react';
import { ClipboardList, Search, Edit2, Trash2, CheckCircle, Clock, Package, Truck, Ban, X, Save, PlusCircle, History, Wallet, User, UserCheck } from 'lucide-react';
import { Sale, Customer, SaleStatus, PaymentStatus, Payment, PaymentMethod, StaffMember, StaffRole } from '../types';

interface OrdersProps {
  sales: Sale[];
  customers: Customer[];
  staff: StaffMember[];
  onUpdateSale: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
}

const statusColors: Record<SaleStatus, string> = {
  'En attente': 'bg-gray-100 text-gray-600',
  'En préparation': 'bg-blue-100 text-blue-600',
  'Prêt': 'bg-orange-100 text-orange-600',
  'Livré': 'bg-green-100 text-green-600',
  'Annulé': 'bg-red-100 text-red-600',
};

const roleColors: Record<StaffRole, string> = {
  'Administrateur': 'bg-orange-50 text-orange-600 border-orange-100',
  'Opticien': 'bg-blue-50 text-blue-600 border-blue-100',
  'Secrétaire': 'bg-purple-50 text-purple-600 border-purple-100',
  'Vendeur': 'bg-green-50 text-green-600 border-green-100',
  'Technicien': 'bg-gray-50 text-gray-600 border-gray-100',
};

const getPaymentCalculations = (sale: Sale) => {
  const totalPaid = (sale.payments || []).reduce((acc, p) => acc + p.amount, 0);
  const remaining = Math.max(0, sale.total_amount - totalPaid);
  const progress = Math.min(100, (totalPaid / sale.total_amount) * 100);
  
  let status: PaymentStatus = 'Non payé';
  if (totalPaid >= sale.total_amount) status = 'Payé';
  else if (totalPaid > 0) status = 'Avance';

  return { totalPaid, remaining, progress, status };
};

const Orders: React.FC<OrdersProps> = ({ sales, customers, staff, onUpdateSale, onDeleteSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SaleStatus | 'Tous'>('Tous');
  const [editingOrder, setEditingOrder] = useState<Sale | null>(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState<Sale | null>(null);
  const [newPayment, setNewPayment] = useState<{ amount: number; method: PaymentMethod }>({ amount: 0, method: 'Espèce' });

  const filteredOrders = sales.filter(s => {
    const client = customers.find(c => c.id === s.customer_id);
    const seller = staff.find(st => st.id === s.staff_id);
    const clientName = client ? `${client.first_name} ${client.last_name}`.toLowerCase() : '';
    const sellerName = seller ? `${seller.first_name} ${seller.last_name}`.toLowerCase() : '';
    
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          clientName.includes(searchTerm.toLowerCase()) ||
                          sellerName.includes(searchTerm.toLowerCase());
                          
    const matchesStatus = statusFilter === 'Tous' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalOrder) return;

    const payment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      amount: newPayment.amount,
      method: newPayment.method,
      date: new Date().toISOString()
    };

    const updatedSale = {
      ...paymentModalOrder,
      payments: [...(paymentModalOrder.payments || []), payment]
    };

    onUpdateSale(updatedSale);
    setPaymentModalOrder(null);
    setNewPayment({ amount: 0, method: 'Espèce' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher par # Commande, Client ou Vendeur..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {(['Tous', 'En attente', 'En préparation', 'Prêt', 'Livré', 'Annulé'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === status ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-200'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commande</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Créé Par</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">État Paiement</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Financement</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => {
                const client = customers.find(c => c.id === order.customer_id);
                const seller = staff.find(s => s.id === order.staff_id);
                const { totalPaid, remaining, progress, status } = getPaymentCalculations(order);

                return (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                        <span className="text-xs font-mono font-black text-gray-900 tracking-tighter">#{order.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{client ? `${client.first_name} ${client.last_name}` : 'Inconnu'}</p>
                      <div className="flex gap-1 mt-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {seller ? (
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${roleColors[seller.role]}`}>
                            <UserCheck className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter leading-none">{seller.first_name}</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">{seller.role}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase italic">Non spécifié</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                         <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                           status === 'Payé' ? 'bg-green-100 text-green-700' : 
                           status === 'Avance' ? 'bg-orange-100 text-orange-700' : 
                           'bg-red-50 text-red-600'
                         }`}>
                           {status}
                         </span>
                         <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className={`h-full transition-all duration-500 ${status === 'Payé' ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${progress}%` }}></div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Total: <span className="text-gray-900">{order.total_amount.toFixed(2)} MAD</span></div>
                        <div className="text-[9px] font-bold text-green-600 uppercase">Payé: {totalPaid.toFixed(2)} MAD</div>
                        {remaining > 0 && <div className="text-[10px] font-black text-red-600 border-t border-red-50 mt-1 pt-0.5 uppercase">Reste: {remaining.toFixed(2)} MAD</div>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setPaymentModalOrder(order)}
                          className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-green-600 transition-all shadow-sm"
                          title="Ajouter un paiement"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingOrder(order)}
                          className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-orange-600 transition-all shadow-sm"
                          title="Modifier l'état"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteSale(order.id)}
                          className="p-2 bg-white border border-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-all shadow-sm"
                          title="Supprimer la commande"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Aucune commande ne correspond à votre recherche</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Paiement */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
             <div className="p-6 border-b flex items-center justify-between bg-green-500 text-white">
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tighter">Gestion des Paiements</h3>
                   <p className="text-xs text-green-50 opacity-80">Commande #{paymentModalOrder.id}</p>
                </div>
                <button onClick={() => setPaymentModalOrder(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <History className="w-4 h-4 text-green-500" /> Historique des versements
                   </h4>
                   <div className="space-y-3">
                      {(paymentModalOrder.payments || []).map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-white rounded-xl border border-gray-50">
                           <div>
                              <p className="font-black text-gray-900">{p.amount.toFixed(2)} MAD</p>
                              <p className="text-[10px] text-gray-400 font-medium">{new Date(p.date).toLocaleDateString('fr-FR')} • {p.method}</p>
                           </div>
                           <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase">Versement #{idx+1}</span>
                        </div>
                      ))}
                      {(!paymentModalOrder.payments || paymentModalOrder.payments.length === 0) && (
                        <p className="text-center py-4 text-xs text-gray-400 italic">Aucun paiement enregistré</p>
                      )}
                   </div>
                </div>

                <form onSubmit={handleAddPayment} className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Wallet className="w-4 h-4 text-green-500" /> Nouveau Versement
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant (MAD)</label>
                        <input 
                          type="number" 
                          autoFocus
                          required
                          className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-green-500 outline-none"
                          value={newPayment.amount}
                          onChange={e => setNewPayment({...newPayment, amount: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mode de règlement</label>
                        <select 
                          className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-green-500 outline-none"
                          value={newPayment.method}
                          onChange={e => setNewPayment({...newPayment, method: e.target.value as PaymentMethod})}
                        >
                          <option value="Espèce">Espèce</option>
                          <option value="Carte">Carte</option>
                          <option value="Virement">Virement</option>
                        </select>
                      </div>
                   </div>
                   <button type="submit" className="w-full py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
                     Confirmer le versement
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}

      {/* Modal Edition État Commande */}
      {editingOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b flex items-center justify-between bg-orange-500 text-white">
              <h3 className="text-lg font-black uppercase tracking-tighter">État de la commande #{editingOrder.id}</h3>
              <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Étape de production</label>
                 <select 
                   className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                   value={editingOrder.status}
                   onChange={e => onUpdateSale({...editingOrder, status: e.target.value as SaleStatus})}
                 >
                   {(['En attente', 'En préparation', 'Prêt', 'Livré', 'Annulé'] as SaleStatus[]).map(s => (
                     <option key={s} value={s}>{s}</option>
                   ))}
                 </select>
               </div>
               <button onClick={() => setEditingOrder(null)} className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 transition-all">
                 Valider et fermer
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
