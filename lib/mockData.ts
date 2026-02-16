
import { Customer, Product, Appointment, Sale } from '../types';

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', first_name: 'Jean', last_name: 'Dupont', email: 'jean@example.com', phone: '0612345678', address: '12 Rue de Paris, Lyon', birth_date: '1985-05-20', created_at: '2023-01-10' },
  { id: '2', first_name: 'Marie', last_name: 'Curie', email: 'marie@example.com', phone: '0698765432', address: '45 Avenue des Sciences, Paris', birth_date: '1990-11-07', created_at: '2023-03-15' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: '101', brand: 'Ray-Ban', model: 'Wayfarer', reference: 'RB2140', type: 'Soleil', category: 'Solaire', color: 'Noir', purchase_price: 80, selling_price: 150, quantity: 12, min_stock: 3 },
  { id: '102', brand: 'Oakley', model: 'Holbrook', reference: 'OO9102', type: 'Soleil', category: 'Solaire', color: 'Matte Black', purchase_price: 70, selling_price: 130, quantity: 2, min_stock: 5 },
  { id: '103', brand: 'Persol', model: 'PO3092V', reference: '3092V', type: 'Vue', category: 'Monture', color: 'Havane', purchase_price: 110, selling_price: 220, quantity: 8, min_stock: 2 },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', customer_id: '1', employee_id: 'u1', appointment_date: new Date().toISOString(), status: 'Planifié', notes: 'Examen de vue annuel' },
  { id: 'a2', customer_id: '2', employee_id: 'u1', appointment_date: new Date(Date.now() + 86400000).toISOString(), status: 'Confirmé' },
];

export const MOCK_SALES: Sale[] = [
  { 
    id: 's1', 
    customer_id: '1', 
    total_amount: 150, 
    discount: 0, 
    tax_rate: 20, 
    payment_method: 'Carte', 
    payments: [{ id: 'p1', amount: 150, method: 'Carte', date: '2023-10-01' }],
    status: 'Livré', 
    created_at: '2023-10-01' 
  },
  { 
    id: 's2', 
    customer_id: '2', 
    total_amount: 220, 
    discount: 20, 
    tax_rate: 20, 
    payment_method: 'Espèce', 
    payments: [{ id: 'p2', amount: 100, method: 'Espèce', date: '2023-10-05' }],
    status: 'Livré', 
    created_at: '2023-10-05' 
  },
];
