
import React, { useState } from 'react';
import { 
  UserPlus, Search, Phone, Mail, MapPin, Users, Trash2, Edit2, 
  Info, X, Calendar, ShoppingBag, Eye, TrendingUp, History, Glasses,
  ArrowUpRight, CreditCard, Clock, ShoppingCart, FileText
} from 'lucide-react';
import { Customer, Sale, VisionPrescription } from '../types';
import Modal from '../components/Modal';

// Add the missing interface definition
interface ClientsProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
}

const VisionMiniTable = ({ title, od, og, date }: { title: string, od?: VisionPrescription, og?: VisionPrescription, date?: string }) => (
  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-orange-200 transition-all shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{title}</p>
      {date && <span className="text-[9px] font-bold text-gray-400">Le {new Date(date).toLocaleDateString()}</span>}
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <p className="text-[9px] font-black text-orange-500 uppercase tracking-tighter flex items-center gap-1">
          <Eye className="w-3 h-3" /> Œil Droit (OD)
        </p>
        <div className="grid grid-cols-3 gap-1">
          <div className="bg-white p-1 rounded border border-gray-50 text-center">
            <p className="text-[8px] text-gray-400 uppercase">Sph</p>
            <p className="text-[10px] font-bold text-gray-800">{od?.sphere?.toFixed(2)}</p>
          </div>
          <div className="bg-white p-1 rounded border border-gray-50 text-center">
            <p className="text-[8px] text-gray-400 uppercase">Cyl</p>
            <p className="text-[10px] font-bold text-gray-800">{od?.cylinder?.toFixed(2)}</p>
          </div>
          <div className="bg-white p-1 rounded border border-gray-50 text-center">
            <p className="text-[8px] text-gray-400 uppercase">Axe</p>
            <p className="text-[10px] font-bold text-gray-800">{od?.axis}°</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter flex items-center gap-1">
          <Eye className="w-3 h-3" /> Œil Gauche (OG)
        </p>
        <div className="grid grid-cols-3 gap-1">
          <div className="bg-white p-1 rounded border border-gray-50 text-center">
            <p className="text-[8px] text-gray-400 uppercase">Sph</p>
            <p className="text-[10px] font-bold text-gray-800">{og?.sphere?.toFixed(2)}</p>
          </div>
          <div className="bg-white p-1 rounded border border-gray-50 text-center">
            <p className="text-[8px] text-gray-400 uppercase">Cyl</p>
            <p className="text-[10px] font-bold text-gray-800">{og?.cylinder?.toFixed(2)}</p>
          </div>
          <div className="bg-white p-1 rounded border border-gray-50 text-center">
            <p className="text-[8px] text-gray-400 uppercase">Axe</p>
            <p className="text-[10px] font-bold text-gray-800">{og?.axis}°</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Clients: React.FC<ClientsProps> = ({ customers, setCustomers, sales }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);
  const [editingClient, setEditingClient] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<Partial<Customer>>({
    first_name: '', last_name: '', email: '', phone: '', address: '', birth_date: '', notes: ''
  });

  const filteredClients = customers.filter(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({
      first_name: '', last_name: '', email: '', phone: '', address: '', birth_date: '', notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Customer) => {
    setEditingClient(client);
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (client: Customer) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client et tout son historique ?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setCustomers(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...formData } as Customer : c));
    } else {
      const newClient: Customer = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      } as Customer;
      setCustomers(prev => [newClient, ...prev]);
    }
    setIsModalOpen(false);
  };

  const getClientStats = (clientId: string) => {
    const clientSales = sales
      .filter(s => s.customer_id === clientId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const totalSpent = clientSales.reduce((acc, s) => acc + s.total_amount, 0);
    const visitCount = clientSales.length;
    const lastVisit = clientSales.length > 0 ? clientSales[0].created_at : null;
    const firstVisit = clientSales.length > 0 ? clientSales[clientSales.length - 1].created_at : null;
    
    return { clientSales, totalSpent, visitCount, lastVisit, firstVisit };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher un client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-100"
        >
          <UserPlus className="w-5 h-5" />
          Nouveau Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 font-black text-xl uppercase border border-orange-100">
                  {client.first_name[0]}{client.last_name[0]}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg uppercase tracking-tighter">{client.first_name} {client.last_name}</h3>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Depuis {new Date(client.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(client)} className="p-2.5 bg-gray-50 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-600 transition-colors border border-transparent">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(client.id)} className="p-2.5 bg-gray-50 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors border border-transparent">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 px-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="font-bold">{client.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 px-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="truncate text-xs font-medium">{client.email || 'Pas d\'email'}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50">
              <button 
                onClick={() => handleOpenDetail(client)}
                className="w-full py-4 bg-gray-900 text-white text-[10px] font-black rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] shadow-lg shadow-gray-100"
              >
                <Info className="w-4 h-4" />
                Dossier Complet
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-100">
          <Users className="w-16 h-16 text-gray-100 mx-auto mb-4" />
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Aucun client trouvé</h3>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Vérifiez l'orthographe ou ajoutez un nouveau profil</p>
        </div>
      )}

      {/* Modal Ajout / Edition */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingClient ? "Modifier Profil Client" : "Nouveau Client"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prénom</label>
              <input required className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de Famille</label>
              <input required className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
              <input type="email" className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
              <input required className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adresse</label>
            <input className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes Médicales / Observations</label>
            <textarea className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 min-h-[100px]" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-5 bg-orange-500 text-white font-black rounded-3xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 mt-6 text-xs uppercase tracking-[0.2em]">
            Sauvegarder les modifications
          </button>
        </form>
      </Modal>

      {/* Modal Dossier Client Complet */}
      {isDetailOpen && selectedClient && (() => {
        const { clientSales, totalSpent, visitCount, lastVisit, firstVisit } = getClientStats(selectedClient.id);
        
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-white">
              <div className="p-8 border-b flex items-center justify-between bg-gray-900 text-white">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white font-black text-3xl uppercase shadow-lg shadow-orange-200">
                    {selectedClient.first_name[0]}{selectedClient.last_name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedClient.first_name} {selectedClient.last_name}</h2>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] font-black bg-white/10 text-orange-400 px-3 py-1 rounded-full uppercase tracking-widest">ID #{selectedClient.id.substr(0, 8).toUpperCase()}</span>
                      <span className="text-[10px] font-black bg-white/10 text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest">Depuis {new Date(selectedClient.created_at).getFullYear()}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsDetailOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-10 overflow-y-auto bg-gray-50/50 flex-1 scrollbar-hide">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Stats Cards (Bento style) */}
                  <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3"><TrendingUp className="w-6 h-6" /></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Achats</p>
                      <p className="text-xl font-black text-gray-900">{totalSpent.toFixed(2)} <span className="text-[10px]">MAD</span></p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl mb-3"><ShoppingCart className="w-6 h-6" /></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Nombre Visites</p>
                      <p className="text-xl font-black text-gray-900">{visitCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="p-3 bg-green-50 text-green-600 rounded-2xl mb-3"><ArrowUpRight className="w-6 h-6" /></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Première Visite</p>
                      <p className="text-sm font-black text-gray-900">{firstVisit ? new Date(firstVisit).toLocaleDateString('fr-FR') : 'N/A'}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mb-3"><Clock className="w-6 h-6" /></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Dernière Visite</p>
                      <p className="text-sm font-black text-gray-900">{lastVisit ? new Date(lastVisit).toLocaleDateString('fr-FR') : 'N/A'}</p>
                    </div>
                  </div>

                  {/* Left Column - Contact & History */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2 mb-8 border-b pb-4">
                        <Eye className="w-5 h-5 text-orange-500" />
                        Historique des Mesures (Prescriptions)
                      </h3>
                      
                      <div className="space-y-4">
                        {clientSales.some(s => s.prescription) ? (
                          clientSales.filter(s => s.prescription).map((sale, idx) => (
                            <div key={idx} className="space-y-4 pb-4 border-b border-gray-50 last:border-none">
                              <VisionMiniTable 
                                title={sale.prescription?.visionType || 'Mesure'} 
                                od={sale.prescription?.loinOD || sale.prescription?.presOD} 
                                og={sale.prescription?.loinOG || sale.prescription?.presOG}
                                date={sale.created_at}
                              />
                              <div className="flex gap-4 px-2">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Verre: <span className="text-gray-900">{sale.prescription?.glassType || 'Standard'}</span></span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Assurance: <span className="text-gray-900">{sale.prescription?.insuranceType || 'N/A'}</span></span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Aucun historique de prescription trouvé</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2 mb-8 border-b pb-4">
                        <History className="w-5 h-5 text-orange-500" />
                        Historique des Commandes
                      </h3>
                      <div className="space-y-3">
                        {clientSales.map(sale => (
                          <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm border border-gray-50"><Glasses className="w-5 h-5" /></div>
                              <div>
                                <p className="text-xs font-black text-gray-900 uppercase">Commande #{sale.id}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(sale.created_at).toLocaleDateString('fr-FR')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-gray-900">{sale.total_amount.toFixed(2)} MAD</p>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase border border-gray-100 ${sale.status === 'Livré' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'}`}>
                                {sale.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Contact & Notes */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        Coordonnées Contact
                      </h3>
                      <div className="space-y-5">
                        <div className="flex items-center gap-4 group">
                          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shadow-sm"><Phone className="w-6 h-6" /></div>
                          <div><p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Téléphone</p><p className="text-sm font-black text-gray-900 tracking-tight">{selectedClient.phone}</p></div>
                        </div>
                        <div className="flex items-center gap-4 group">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm"><Mail className="w-6 h-6" /></div>
                          <div><p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Email</p><p className="text-sm font-black text-gray-900 tracking-tight truncate max-w-[200px]">{selectedClient.email || 'Non renseigné'}</p></div>
                        </div>
                        <div className="flex items-center gap-4 group">
                          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform shadow-sm"><MapPin className="w-6 h-6" /></div>
                          <div><p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Adresse</p><p className="text-sm font-black text-gray-900 leading-tight">{selectedClient.address || 'Non renseignée'}</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-500 p-8 rounded-[40px] text-white shadow-xl shadow-orange-100">
                      <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Notes & Observations
                      </h3>
                      <p className="text-xs font-bold leading-relaxed">{selectedClient.notes || 'Aucune note particulière enregistrée pour ce patient.'}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Client depuis</p>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-300" />
                        <span className="text-sm font-black text-gray-900">{new Date(selectedClient.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="p-8 bg-white border-t flex justify-end gap-3">
                <button 
                  onClick={() => { setIsDetailOpen(false); handleOpenEdit(selectedClient); }}
                  className="px-8 py-4 bg-orange-50 text-orange-600 font-black rounded-2xl hover:bg-orange-100 transition-all text-[10px] uppercase tracking-[0.2em]"
                >
                  Modifier Profil
                </button>
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all text-[10px] uppercase tracking-[0.2em]"
                >
                  Fermer Dossier
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Clients;
