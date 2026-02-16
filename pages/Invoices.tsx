
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FileText, Printer, Eye, Search, X, Stethoscope } from 'lucide-react';
import { Sale, Customer, VisionPrescription, ShopSettings } from '../types';

interface InvoicesProps {
  sales: Sale[];
  customers: Customer[];
  settings: ShopSettings;
}

const VisionTable = ({ label, od, og }: { label: string, od?: VisionPrescription, og?: VisionPrescription }) => (
  <div className="mb-4">
    <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{label}</p>
    <table className="w-full text-center border-collapse text-[10px] border border-gray-100">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-1">Œil</th>
          <th className="border p-1">SPH</th>
          <th className="border p-1">CYL</th>
          <th className="border p-1">AXE</th>
          <th className="border p-1">ADD</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-1 font-bold">OD</td>
          <td className="border p-1">{od?.sphere?.toFixed(2) || '0.00'}</td>
          <td className="border p-1">{od?.cylinder?.toFixed(2) || '0.00'}</td>
          <td className="border p-1">{od?.axis || '0'}</td>
          <td className="border p-1">{od?.addition?.toFixed(2) || '0.00'}</td>
        </tr>
        <tr>
          <td className="border p-1 font-bold">OG</td>
          <td className="border p-1">{og?.sphere?.toFixed(2) || '0.00'}</td>
          <td className="border p-1">{og?.cylinder?.toFixed(2) || '0.00'}</td>
          <td className="border p-1">{og?.axis || '0'}</td>
          <td className="border p-1">{og?.addition?.toFixed(2) || '0.00'}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const ProductTable = ({ items }: { items?: any[] }) => (
  <table className="w-full text-left text-[10px] mb-4 border-collapse">
    <thead>
      <tr className="bg-gray-50 border-y border-gray-100">
        <th className="p-2 font-black uppercase">Article</th>
        <th className="p-2 font-black uppercase text-center">Qté</th>
        <th className="p-2 font-black uppercase text-right">Unit.</th>
        <th className="p-2 font-black uppercase text-right">Total</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {items?.map((item, idx) => (
        <tr key={idx}>
          <td className="p-2">{item.brand} - {item.model}</td>
          <td className="p-2 text-center">{item.quantity}</td>
          <td className="p-2 text-right">{item.price.toFixed(2)}</td>
          <td className="p-2 text-right font-bold">{(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const InvoicePrintLayout = ({ sale, customer, settings }: { sale: Sale, customer?: Customer, settings: ShopSettings }) => {
  const totalPayable = sale.total_amount;
  const totalPaid = (sale.payments || []).reduce((acc, p) => acc + p.amount, 0);
  const discount = sale.discount || 0;
  const rest = totalPayable - totalPaid;

  const CommonHeader = () => (
    <div className="flex justify-between items-start mb-4 border-b pb-4">
      <div className="flex items-center gap-4">
        {settings.logoUrl && (
          <img src={settings.logoUrl} alt="Logo" className="h-16 w-auto object-contain max-w-[150px]" />
        )}
        <div>
          <h2 className="text-xl font-black text-orange-600 uppercase tracking-tighter" style={{ color: settings.primaryColor }}>{settings.name}</h2>
          <p className="text-[10px] text-gray-500 font-bold leading-tight">{settings.address}</p>
          <p className="text-[10px] text-gray-500">Tél: {settings.phone} | ICE: {settings.ice}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-black uppercase">Facture #{sale.id}</p>
        <p className="text-[10px] text-gray-400 font-bold">{new Date(sale.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );

  const SummaryBox = () => (
    <div className="flex justify-between items-start bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
      <div className="flex-1">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Client</p>
        <p className="text-xs font-black uppercase">{customer ? `${customer.first_name} ${customer.last_name}` : 'Client Inconnu'}</p>
        <p className="text-[10px] text-gray-500">{customer?.phone}</p>
      </div>
      
      {sale.prescription?.doctor_name && (
        <div className="flex-1 px-4 border-l border-gray-200">
          <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Stethoscope className="w-2 h-2" /> Médecin</p>
          <p className="text-xs font-black uppercase">{sale.prescription.doctor_name}</p>
          <p className="text-[10px] text-gray-500">{sale.prescription.doctor_phone}</p>
        </div>
      )}

      <div className="text-right min-w-[150px]">
        <div className="flex justify-between text-[10px] font-bold text-gray-600">
          <span>Net HT:</span> <span>{(totalPayable + discount).toFixed(2)} MAD</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[10px] font-bold text-orange-500" style={{ color: settings.primaryColor }}>
            <span>Remise:</span> <span>-{discount.toFixed(2)} MAD</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-black border-t pt-1 mt-1 border-gray-300">
          <span>Total TTC:</span> <span>{totalPayable.toFixed(2)} MAD</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 text-gray-900 font-sans w-[210mm] min-h-[297mm] mx-auto">
      {/* SECTION COPIE BOUTIQUE */}
      <div className="border-2 border-gray-200 p-8 mb-10 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gray-100 text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest text-gray-400">Copie Boutique</div>
        <CommonHeader />
        <SummaryBox />
        
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h4 className="text-[10px] font-black uppercase mb-2 border-b-2 border-gray-50" style={{ color: settings.primaryColor }}>Mesures Vision</h4>
            {sale.prescription?.visionType !== 'Près' && (
              <VisionTable label="Vision de Loin" od={sale.prescription?.loinOD} og={sale.prescription?.loinOG} />
            )}
            {sale.prescription?.visionType !== 'Loin' && (
              <VisionTable label="Vision de Près" od={sale.prescription?.presOD} og={sale.prescription?.presOG} />
            )}
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase mb-2 border-b-2 border-gray-50" style={{ color: settings.primaryColor }}>Détails Articles</h4>
            <ProductTable items={sale.items} />
            <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-100 text-right">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Historique Financier</p>
              {(sale.payments || []).map(p => (
                <p key={p.id} className="text-[11px] font-bold text-green-600 italic">
                  Versé le {new Date(p.date).toLocaleDateString()}: -{p.amount.toFixed(2)} MAD
                </p>
              ))}
              <p className="text-sm font-black text-red-600 mt-2 bg-red-50 inline-block px-4 py-1 rounded-lg">Reste à régler: {rest.toFixed(2)} MAD</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-4 border-dashed border-gray-200 my-12 flex items-center justify-center relative no-print">
        <span className="bg-white px-6 text-gray-300 text-[10px] font-black uppercase tracking-[0.5em] absolute">Couper ici</span>
      </div>

      {/* SECTION REÇU CLIENT */}
      <div className="border-2 border-gray-200 p-8 rounded-[40px] relative">
        <div className="absolute top-0 right-0 bg-gray-100 text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest text-gray-400">Reçu Client</div>
        <CommonHeader />
        <SummaryBox />
        <ProductTable items={sale.items} />
        <div className="flex justify-between items-end pt-8 border-t-2 border-gray-100">
          <div>
            <p className="text-[11px] text-gray-500 font-bold italic">"Votre vue, notre priorité."</p>
            <p className="text-[9px] text-gray-400 uppercase mt-1">Garantie d'adaptation : 1 mois sur les verres.</p>
          </div>
          <div className="text-right">
             <div className="w-40 h-20 border-2 border-gray-100 rounded-3xl mb-2 flex items-center justify-center text-[10px] font-black text-gray-300 uppercase">Cachet du Magasin</div>
             <p className="text-sm font-black text-gray-900">Solde restant: <span className="text-red-600">{rest.toFixed(2)} MAD</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Invoices: React.FC<InvoicesProps> = ({ sales, customers, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (selectedInvoice && isPrinting) {
      const originalTitle = document.title;
      const client = customers.find(c => c.id === selectedInvoice.customer_id);
      if (client) {
        const dateStr = new Date(selectedInvoice.created_at).toLocaleDateString().replace(/\//g, '-');
        const fileName = `${client.last_name}_${client.first_name}_${dateStr}`.replace(/\s+/g, '_');
        document.title = fileName;
      }
      const timer = setTimeout(() => {
        window.print();
        document.title = originalTitle;
        setIsPrinting(false);
        setSelectedInvoice(null);
      }, 500);
      return () => {
        clearTimeout(timer);
        document.title = originalTitle;
      };
    }
  }, [selectedInvoice, isPrinting, customers]);

  const filteredSales = sales.filter(s => {
    const client = customers.find(c => c.id === s.customer_id);
    const clientName = client ? `${client.first_name} ${client.last_name}` : '';
    return s.id.toLowerCase().includes(searchTerm.toLowerCase()) || clientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handlePrint = (invoice: Sale) => {
    setSelectedInvoice(invoice);
    setIsPrinting(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher par # facture ou client..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Facture #</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Solde</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSales.map((sale) => {
                const client = customers.find(c => c.id === sale.customer_id);
                const totalPaid = (sale.payments || []).reduce((acc, p) => acc + p.amount, 0);
                const remaining = sale.total_amount - totalPaid;
                return (
                  <tr key={sale.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500 shadow-sm border border-orange-100" style={{ color: settings.primaryColor, backgroundColor: `${settings.primaryColor}10`, borderColor: `${settings.primaryColor}20` }}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-black text-gray-400 tracking-tighter uppercase">#{sale.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900 uppercase tracking-tighter">
                      {client ? `${client.first_name} ${client.last_name}` : 'Inconnu'}
                    </td>
                    <td className="px-8 py-6 text-xs font-black">
                      {sale.total_amount.toFixed(2)} MAD
                      {remaining > 0 ? <p className="text-[9px] text-red-500 mt-1">Reste: {remaining.toFixed(2)}</p> : <p className="text-[9px] text-green-600 mt-1">Payé</p>}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedInvoice(sale)} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-600 transition-all"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handlePrint(sale)} className="p-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2" style={{ backgroundColor: settings.primaryColor }}>
                          <Printer className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Imprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isPrinting && selectedInvoice && ReactDOM.createPortal(
        <div className="bg-white">
          <InvoicePrintLayout sale={selectedInvoice} customer={customers.find(c => c.id === selectedInvoice.customer_id)} settings={settings} />
        </div>,
        document.getElementById('print-root') as HTMLElement
      )}

      {selectedInvoice && !isPrinting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 no-print overflow-y-auto">
          <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl my-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Aperçu Facture #{selectedInvoice.id}</h3>
              <div className="flex gap-2">
                <button onClick={() => handlePrint(selectedInvoice)} className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2" style={{ backgroundColor: settings.primaryColor }}>
                   <Printer className="w-5 h-5" /> Imprimer
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all"><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="p-12 bg-gray-50 flex justify-center overflow-x-auto">
              <div className="bg-white shadow-2xl scale-90 sm:scale-100 origin-top">
                <InvoicePrintLayout sale={selectedInvoice} customer={customers.find(c => c.id === selectedInvoice.customer_id)} settings={settings} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
