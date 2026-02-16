
export type Role = 'admin' | 'employee' | 'secretary';
export type SaleStatus = 'En attente' | 'En préparation' | 'Prêt' | 'Livré' | 'Annulé';
export type PaymentStatus = 'Non payé' | 'Avance' | 'Payé';
export type PaymentMethod = 'Espèce' | 'Carte' | 'Virement';
export type StaffRole = 'Opticien' | 'Secrétaire' | 'Vendeur' | 'Technicien' | 'Administrateur';

export interface ShopSettings {
  name: string;
  ice: string;
  address: string;
  phone: string;
  tva: number;
  primaryColor: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  full_name: string;
  avatar_url?: string;
}

export interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: StaffRole;
  salary?: number;
  hire_date: string;
  status: 'Actif' | 'Inactif';
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  notes?: string;
  photo_url?: string;
  created_at: string;
}

export interface VisionPrescription {
  sphere: number;
  cylinder: number;
  axis: number;
  addition: number;
}

export interface SalePrescription {
  visionType: 'Loin' | 'Près' | 'Séparé';
  loinOD?: VisionPrescription;
  loinOG?: VisionPrescription;
  presOD?: VisionPrescription;
  presOG?: VisionPrescription;
  glassType: string;
  insuranceType: string;
  doctor_name?: string;
  doctor_phone?: string;
  doctor_address?: string;
}

export interface Product {
  id: string;
  brand: string;
  model: string;
  reference: string;
  type: 'Vue' | 'Soleil';
  category: string;
  color: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  min_stock: number;
  image_url?: string;
  supplier_id?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface SaleProductItem {
  brand: string;
  model: string;
  quantity: number;
  price: number;
}

export interface PurchaseOrderItem {
  product_id: string;
  brand: string;
  model: string;
  quantity: number;
  unit_price: number;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  invoice_number: string;
  date: string;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  items: PurchaseOrderItem[];
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  staff_id?: string;
  total_amount: number;
  discount: number;
  tax_rate: number;
  payment_method: PaymentMethod;
  payments: Payment[];
  prescription?: SalePrescription;
  items?: SaleProductItem[];
  status: SaleStatus; 
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  glasses_id: string;
  quantity: number;
  unit_price: number;
}

export interface Appointment {
  id: string;
  customer_id: string;
  employee_id: string;
  appointment_date: string;
  status: 'Planifié' | 'Confirmé' | 'Terminé' | 'Annulé';
  notes?: string;
}
