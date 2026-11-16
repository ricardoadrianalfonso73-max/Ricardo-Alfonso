export type ProductCategory =
  | 'celulares'
  | 'teclados'
  | 'mouse'
  | 'monitores'
  | 'accesorios';

export type ProductCondition = 'Nuevo' | 'Usado';

export type PageSection =
  | 'inicio'
  | 'productos'
  | 'ofertas'
  | 'servicio-tecnico'
  | 'contacto';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: number;
  previousPrice?: number;
  discountPercent?: number;
  description: string;
  specs: string[];
  warranty: string;
  stock: number;
  imageUrl: string;
  isFeatured: boolean;
  isOffer: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface OrderItemRecord {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod: 'transferencia' | 'tarjeta' | 'efectivo_entrega';
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'confirmado' | 'en_preparacion' | 'enviado' | 'entregado';
  items: OrderItemRecord[];
  createdAt: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'nuevo' | 'respondido';
  createdAt: string;
}

export interface ServiceRequestRecord {
  id: string;
  ticketCode: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceModel: string;
  issueType: string;
  description: string;
  status: 'pendiente' | 'en_diagnostico' | 'presupuestado' | 'reparado';
  createdAt: string;
}
