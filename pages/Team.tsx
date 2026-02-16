
import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  Edit2, 
  ShieldCheck, 
  Briefcase,
  UserCircle,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { StaffMember, StaffRole } from '../types';
import Modal from '../components/Modal';

interface TeamProps {
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
}

const roleColors: Record<StaffRole, string> = {
  'Administrateur': 'bg-orange-100 text-orange-600',
  'Opticien': 'bg-blue-100 text-blue-600',
  'Secrétaire': 'bg-purple-100 text-purple-600',
  'Vendeur': 'bg-green-100 text-green-600',
  'Technicien': 'bg-gray-100 text-gray-600',
};

const Team: React.FC<TeamProps> = ({ staff, setStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'Tous'>('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState<Partial<StaffMember>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'Vendeur',
    status: 'Actif',
    hire_date: new Date().toISOString().split('T')[0],
    salary: 0
  });

  const filteredStaff = staff.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Tous' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'Vendeur',
      status: 'Actif',
      hire_date: new Date().toISOString().split('T')[0],
      salary: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce membre de l\'équipe ?')) {
      setStaff(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setStaff(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...formData } as StaffMember : m));
    } else {
      const newMember: StaffMember = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as StaffMember;
      setStaff(prev => [newMember, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher un membre..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
            />
          </div>
          <div className="relative">
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="appearance-none bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 outline-none focus:ring-2 focus:ring-orange-500 shadow-sm pr-12"
            >
              <option value="Tous">Tous les rôles</option>
              <option value="Opticien">Opticien</option>
              <option value="Secrétaire">Secrétaire</option>
              <option value="Vendeur">Vendeur</option>
              <option value="Technicien">Technicien</option>
              <option value="Administrateur">Administrateur</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-gray-100"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter membre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => handleOpenEdit(member)} className="p-2 bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-xl transition-all border border-transparent hover:border-orange-100">
                 <Edit2 className="w-4 h-4" />
               </button>
               <button onClick={() => handleDelete(member.id)} className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                <UserCircle className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${member.status === 'Actif' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter leading-none">{member.first_name} {member.last_name}</h3>
                </div>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${roleColors[member.role]}`}>
                  {member.role}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center"><Mail className="w-4 h-4 text-gray-400" /></div>
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center"><Phone className="w-4 h-4 text-gray-400" /></div>
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400 pt-4 border-t border-gray-50">
                <Calendar className="w-4 h-4" />
                <span className="uppercase text-[10px] tracking-widest font-black">Embauché le {new Date(member.hire_date).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredStaff.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-40">
            <UserCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Aucun membre d'équipe trouvé</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingMember ? "Modifier membre" : "Nouveau membre d'équipe"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prénom</label>
              <input required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom</label>
              <input required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email professionnel</label>
              <input type="email" required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
              <input required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Poste / Rôle</label>
              <select className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as StaffRole})}>
                <option value="Opticien">Opticien</option>
                <option value="Secrétaire">Secrétaire</option>
                <option value="Vendeur">Vendeur</option>
                <option value="Technicien">Technicien</option>
                <option value="Administrateur">Administrateur</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</label>
              <select className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Salaire (MAD)</label>
              <input type="number" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date d'embauche</label>
              <input type="date" required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-orange-500 outline-none" value={formData.hire_date} onChange={e => setFormData({...formData, hire_date: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-orange-500 transition-all shadow-xl shadow-gray-100 mt-6 text-xs uppercase tracking-[0.2em]">
            Valider la fiche membre
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Team;
