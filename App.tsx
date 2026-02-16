
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Sales from './pages/Sales';
import Invoices from './pages/Invoices';
import Orders from './pages/Orders';
import { Customer, Product, Sale, SaleProductItem, StaffMember, ShopSettings } from './types';
import { MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_SALES } from './lib/mockData';

type Page = 'dashboard' | 'clients' | 'sales' | 'invoices' | 'orders';

const STORAGE_KEY = 'hbg_optic_demo_db_v1';

const loadFromStorage = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultValue;
  try {
    const parsed = JSON.parse(saved);
    return parsed[key] !== undefined ? parsed[key] : defaultValue;
  } catch (e) {
    console.error("Erreur de chargement démo :", e);
    return defaultValue;
  }
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 249, g: 115, b: 22 };
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage('customers', MOCK_CUSTOMERS));
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('products', MOCK_PRODUCTS));
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage('sales', MOCK_SALES));
  
  // Paramètres par défaut pour la démo (non modifiables dans la démo mais utilisés pour les factures)
  const [settings] = useState<ShopSettings>(() => loadFromStorage('settings', {
    name: "Optique Belle Vue",
    ice: "001234567890001",
    address: "Rue Mohamed V, Casablanca",
    phone: "05 22 12 34 56",
    tva: 20,
    primaryColor: "#f97316"
  }));

  const staff: StaffMember[] = [
    { id: 'st1', first_name: 'Admin', last_name: 'Demo', email: 'demo@hbg.com', phone: '0600000000', role: 'Administrateur', hire_date: '2024-01-01', status: 'Actif' }
  ];

  useEffect(() => {
    const color = settings.primaryColor;
    const rgb = hexToRgb(color);
    const styleId = 'dynamic-theme-style';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root {
        --theme-primary: ${color};
        --theme-primary-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};
      }
      .bg-orange-500 { background-color: var(--theme-primary) !important; }
      .text-orange-500 { color: var(--theme-primary) !important; }
      .text-orange-600 { color: var(--theme-primary) !important; }
      .border-orange-500 { border-color: var(--theme-primary) !important; }
      .bg-orange-50 { background-color: rgba(var(--theme-primary-rgb), 0.05) !important; }
    `;
  }, [settings.primaryColor]);

  useEffect(() => {
    const database = { customers, products, sales, settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  }, [customers, products, sales, settings]);

  const handleCompleteSale = (saleData: Omit<Sale, 'id'>, items: {productId: string, qty: number}[]) => {
    const saleItems: SaleProductItem[] = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        brand: product?.brand || 'Inconnu',
        model: product?.model || 'Produit',
        quantity: item.qty,
        price: product?.selling_price || 0
      };
    });
    const saleId = `C${(sales.length + 1).toString().padStart(4, '0')}`;
    const enrichedSale: Sale = { ...saleData, id: saleId, items: saleItems };
    setSales(prev => [enrichedSale, ...prev]);
    setCurrentPage('orders');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard customers={customers} products={products} sales={sales} />;
      case 'clients': return <Clients customers={customers} setCustomers={setCustomers} sales={sales} />;
      case 'sales': return <Sales products={products} customers={customers} staff={staff} onSaleComplete={handleCompleteSale} />;
      case 'orders': return <Orders sales={sales} customers={customers} staff={staff} onUpdateSale={s => setSales(prev => prev.map(old => old.id === s.id ? s : old))} onDeleteSale={id => setSales(prev => prev.filter(s => s.id !== id))} />;
      case 'invoices': return <Invoices sales={sales} customers={customers} settings={settings} />;
      default: return <Dashboard customers={customers} products={products} sales={sales} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#BFBFBF]">
      <Sidebar currentPath={currentPage} onNavigate={(path) => setCurrentPage(path as Page)} />
      <div className="flex-1 ml-64">
        <Header title={currentPage.toUpperCase()} />
        <main className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
