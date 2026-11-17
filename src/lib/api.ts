import type {
  OrderRecord,
  Product,
  PublicUser,
  ServiceRequestRecord,
} from '../types/store';

const TOKEN_STORAGE_KEY = 'electro_tecno_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignorar error de almacenamiento privado
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Ocurrió un error al comunicarse con el servidor.');
  }
  return data as T;
}

export async function fetchProducts(params?: {
  category?: string;
  condition?: string;
  offers?: boolean;
  q?: string;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.condition) search.set('condition', params.condition);
  if (params?.offers) search.set('offers', 'true');
  if (params?.q) search.set('q', params.q);
  const qs = search.toString();
  const data = await apiRequest<{ products: Product[] }>(
    `/products${qs ? `?${qs}` : ''}`
  );
  return data.products;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; user: PublicUser }> {
  const data = await apiRequest<{ token: string; user: PublicUser }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  setStoredToken(data.token);
  return data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ token: string; user: PublicUser }> {
  const data = await apiRequest<{ token: string; user: PublicUser }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  setStoredToken(data.token);
  return data;
}

export async function fetchAccountProfile(): Promise<{
  user: PublicUser;
  orders: OrderRecord[];
  serviceRequests: ServiceRequestRecord[];
}> {
  return apiRequest('/auth/me');
}

export async function createOrder(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod: 'transferencia' | 'tarjeta' | 'efectivo_entrega';
  items: { productId: string; quantity: number }[];
}): Promise<OrderRecord> {
  const data = await apiRequest<{ order: OrderRecord }>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.order;
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; confirmation: string }> {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createServiceRequest(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceModel: string;
  issueType: string;
  description: string;
}): Promise<ServiceRequestRecord> {
  const data = await apiRequest<{ serviceRequest: ServiceRequestRecord }>(
    '/service-requests',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  return data.serviceRequest;
}
