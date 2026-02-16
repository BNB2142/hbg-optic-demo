
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingCart, 
  ClipboardList,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const menuItems = [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: 'dashboard' },
    { name: 'Clients', icon: Users, path: 'clients' },
    { name: 'Nouvelle Vente', icon: ShoppingCart, path: 'sales' },
    { name: 'Commandes', icon: ClipboardList, path: 'orders' },
    { name: 'Factures', icon: FileText, path: 'invoices' },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-100">H</div>
          <span className="text-xl font-bold tracking-tight text-gray-800">HBG<span className="text-orange-500 ml-1">Optic Demo</span></span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentPath === item.path 
                ? 'bg-orange-50 text-orange-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t bg-gray-50/50">
        <div className="p-4 bg-orange-500 rounded-2xl text-white mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Mode Démo</p>
          <p className="text-[11px] font-bold mt-1">Application limitée pour évaluation client.</p>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          Quitter la démo
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
