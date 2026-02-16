
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Trash2, Edit2, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Appointment, Customer } from '../types';
import Modal from '../components/Modal';

interface AppointmentsProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  customers: Customer[];
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, setAppointments, customers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<Partial<Appointment>>({
    customer_id: '',
    appointment_date: new Date().toISOString().slice(0, 16),
    status: 'Planifié',
    notes: ''
  });

  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8h to 18h

  const handleOpenAdd = () => {
    setEditingAppointment(null);
    setFormData({
      customer_id: customers[0]?.id || '',
      appointment_date: new Date().toISOString().slice(0, 16),
      status: 'Planifié',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Appointment) => {
    setEditingAppointment(a);
    setFormData({
      ...a,
      appointment_date: new Date(a.appointment_date).toISOString().slice(0, 16)
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Annuler ce rendez-vous ?')) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppointment) {
      setAppointments(prev => prev.map(a => a.id === editingAppointment.id ? { ...a, ...formData } as Appointment : a));
    } else {
      const newRDV: Appointment = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        employee_id: 'current-user-id'
      } as Appointment;
      setAppointments(prev => [...prev, newRDV]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      <div className="lg:w-80 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Octobre 2023</h3>
            <div className="flex gap-1">
              <button className="p-2 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-500 transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
              <span key={day} className="text-[10px] font-bold text-gray-300 uppercase">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: 31 }, (_, i) => (
              <button 
                key={i} 
                className={`w-9 h-9 flex items-center justify-center text-xs rounded-xl transition-all ${i + 1 === 12 ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-100' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mardi 12 Octobre</h2>
            <p className="text-sm text-gray-400 font-medium">{appointments.length} rendez-vous au total</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-100"
          >
            <Plus className="w-5 h-5" />
            Nouveau RDV
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-gray-50/30">
          <div className="relative border-l-2 border-gray-100 ml-16 space-y-2">
            {hours.map(hour => {
              const hourRDVs = appointments.filter(a => new Date(a.appointment_date).getHours() === hour);
              return (
                <div key={hour} className="relative min-h-[100px]">
                  <span className="absolute -left-20 top-0 text-xs font-bold text-gray-300 w-12 text-right">
                    {hour}:00
                  </span>
                  <div className="absolute top-2 right-0 left-4 border-t border-gray-100"></div>
                  
                  <div className="pl-8 pt-4 space-y-3">
                    {hourRDVs.map(rdv => {
                      const client = customers.find(c => c.id === rdv.customer_id);
                      return (
                        <div 
                          key={rdv.id} 
                          className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                              rdv.status === 'Confirmé' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                              <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{client ? `${client.first_name} ${client.last_name}` : 'Client inconnu'}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                  <Clock className="w-3 h-3" /> {new Date(rdv.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-wider">{rdv.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(rdv)} className="p-2 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-600 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(rdv.id)} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingAppointment ? "Modifier Rendez-vous" : "Nouveau Rendez-vous"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Client</label>
            <select 
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500"
              value={formData.customer_id}
              onChange={e => setFormData({...formData, customer_id: e.target.value})}
            >
              <option value="">Choisir un client...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Date et Heure</label>
            <input 
              type="datetime-local"
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500"
              value={formData.appointment_date}
              onChange={e => setFormData({...formData, appointment_date: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Statut</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as any})}
            >
              <option value="Planifié">Planifié</option>
              <option value="Confirmé">Confirmé</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Notes</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 min-h-[80px]"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 mt-6">
            PROGRAMMER LE RENDEZ-VOUS
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
