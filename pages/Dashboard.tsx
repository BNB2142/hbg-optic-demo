
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  FileText,
  CalendarDays,
  ArrowRight,
  Filter,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Customer, Product, Sale } from '../types';

interface DashboardProps {
  customers: Customer[];
  products: Product[];
  sales: Sale[];
}

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend !== undefined && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-green-100 text-green-700`}>
          +{trend}%
        </span>
      )}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-black text-gray-900">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ customers, sales }) => {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = sale.created_at.split('T')[0];
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [sales, startDate, endDate]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const cDate = c.created_at.split('T')[0];
      return cDate >= startDate && cDate <= endDate;
    });
  }, [customers, startDate, endDate]);

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.total_amount, 0);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const dataMap: Record<string, number> = {};
    filteredSales.forEach(sale => {
      const date = new Date(sale.created_at);
      const monthName = months[date.getMonth()];
      dataMap[monthName] = (dataMap[monthName] || 0) + sale.total_amount;
    });
    return months.map(m => ({ name: m, sales: dataMap[m] || 0 })).filter(d => d.sales > 0 || (new Date().getMonth() >= months.indexOf(d.name)));
  }, [filteredSales]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 px-4">
          <div className="p-2 bg-orange-500 text-white rounded-xl shadow-sm">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Vue d'ensemble</h4>
            <p className="text-xs font-bold text-gray-900 mt-1">Espace de démonstration client</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 ml-auto">
          <CalendarDays className="w-4 h-4 text-orange-500 ml-2" />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent border-none text-xs font-bold text-gray-900 focus:ring-0 cursor-pointer" />
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent border-none text-xs font-bold text-gray-900 focus:ring-0 cursor-pointer pr-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Clients" value={filteredCustomers.length} icon={Users} color="bg-blue-500" trend={12} />
        <StatCard title="Ventes de la période" value={filteredSales.length} icon={FileText} color="bg-orange-500" trend={8} />
        <StatCard title="Chiffre d'Affaires" value={`${totalRevenue.toLocaleString()} MAD`} icon={TrendingUp} color="bg-green-500" trend={15} />
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Performances de Ventes</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Graphique des revenus mensuels</p>
          </div>
          <TrendingUp className="w-6 h-6 text-orange-500" />
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#f97316" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
