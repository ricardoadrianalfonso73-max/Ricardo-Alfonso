import crypto from 'crypto';
import express from 'express';
import { readDb, saveDb } from '../config/database.ts';
import {
  AuthenticatedRequest,
  hashPassword,
  optionalAuth,
  requireAuth,
  signAuthToken,
  verifyPassword,
} from '../middleware/auth.ts';
import type {
  ContactMessageRecord,
  OrderItemRecord,
  OrderRecord,
  PublicUser,
  ServiceRequestRecord,
} from '../types.ts';

export const apiRouter = express.Router();

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'Electro Tecno API' });
});

apiRouter.get('/products', (req, res) => {
  const db = readDb();
  const category = typeof req.query.category === 'string' ? req.query.category.toLowerCase() : '';
  const condition = typeof req.query.condition === 'string' ? req.query.condition.toLowerCase() : '';
  const offers = req.query.offers === 'true';
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

  const filtered = db.products.filter((product) => {
    if (category && category !== 'todos' && product.category !== category) return false;
    if (condition && product.condition.toLowerCase() !== condition) return false;
    if (offers && !product.isOffer) return false;
    if (query) {
      const haystack = `${product.name} ${product.description} ${product.category} ${product.condition} ${product.specs.join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  res.json({ products: filtered });
});

apiRouter.get('/products/:id', (req, res) => {
  const db = readDb();
  const product = db.products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado.' });
    return;
  }
  res.json({ product });
});

apiRouter.post('/auth/register', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : undefined;

  if (name.length < 2) {
    res.status(400).json({ error: 'Ingresá tu nombre completo (mínimo 2 caracteres).' });
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    res.status(400).json({ error: 'Ingresá un correo electrónico válido.' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    return;
  }

  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo.' });
    return;
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    passwordHash: hashPassword(password),
    role: 'customer' as const,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  const token = signAuthToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  res.status(201).json({
    token,
    user: sanitizeUser(newUser),
  });
});

apiRouter.post('/auth/login', (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    res.status(400).json({ error: 'Completá correo electrónico y contraseña.' });
    return;
  }

  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    return;
  }

  const token = signAuthToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    token,
    user: sanitizeUser(user),
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado.' });
    return;
  }

  const orders = db.orders
    .filter((o) => o.userId === user.id || o.customerEmail === user.email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const serviceRequests = db.serviceRequests
    .filter((s) => s.userId === user.id || s.customerEmail === user.email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  res.json({
    user: sanitizeUser(user),
    orders,
    serviceRequests,
  });
});

apiRouter.post('/orders', optionalAuth, (req: AuthenticatedRequest, res) => {
  const customerName = typeof req.body?.customerName === 'string' ? req.body.customerName.trim() : '';
  const customerEmail = typeof req.body?.customerEmail === 'string' ? req.body.customerEmail.trim().toLowerCase() : '';
  const customerPhone = typeof req.body?.customerPhone === 'string' ? req.body.customerPhone.trim() : '';
  const shippingAddress = typeof req.body?.shippingAddress === 'string' ? req.body.shippingAddress.trim() : '';
  const city = typeof req.body?.city === 'string' ? req.body.city.trim() : '';
  const paymentMethod = req.body?.paymentMethod;
  const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];

  if (customerName.length < 2 || !customerEmail.includes('@') || customerPhone.length < 6) {
    res.status(400).json({ error: 'Completá nombre, correo y teléfono válidos para confirmar el pedido.' });
    return;
  }
  if (shippingAddress.length < 4 || city.length < 2) {
    res.status(400).json({ error: 'Indicá dirección y localidad de entrega.' });
    return;
  }
  if (!['transferencia', 'tarjeta', 'efectivo_entrega'].includes(paymentMethod)) {
    res.status(400).json({ error: 'Seleccioná un medio de pago válido.' });
    return;
  }
  if (rawItems.length === 0) {
    res.status(400).json({ error: 'El carrito está vacío.' });
    return;
  }

  const db = readDb();
  const orderItems: OrderItemRecord[] = [];
  let subtotal = 0;

  for (const item of rawItems) {
    const product = db.products.find((p) => p.id === item.productId);
    const qty = Number(item.quantity);
    if (!product || !Number.isInteger(qty) || qty < 1) {
      res.status(400).json({ error: 'Uno de los productos del carrito ya no está disponible.' });
      return;
    }
    if (product.stock < qty) {
      res.status(409).json({
        error: `Stock insuficiente para ${product.name}. Disponibles: ${product.stock}.`,
      });
      return;
    }
    subtotal += product.price * qty;
    orderItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: qty,
    });
  }

  for (const orderItem of orderItems) {
    const target = db.products.find((p) => p.id === orderItem.productId);
    if (target) {
      target.stock = Math.max(0, target.stock - orderItem.quantity);
    }
  }

  const shippingCost = subtotal >= 120000 ? 0 : 8500;
  const total = subtotal + shippingCost;
  const orderCode = `ET-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: OrderRecord = {
    id: crypto.randomUUID(),
    orderCode,
    userId: req.auth?.userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    city,
    paymentMethod,
    subtotal,
    shippingCost,
    total,
    status: 'confirmado',
    items: orderItems,
    createdAt: new Date().toISOString(),
  };

  db.orders.push(newOrder);
  saveDb(db);

  res.status(201).json({ order: newOrder });
});

apiRouter.post('/contact', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (name.length < 2) {
    res.status(400).json({ error: 'Por favor ingresá tu nombre.' });
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    res.status(400).json({ error: 'Ingresá un correo electrónico válido.' });
    return;
  }
  if (message.length < 10) {
    res.status(400).json({ error: 'Contanos un poco más en tu mensaje (mínimo 10 caracteres).' });
    return;
  }

  const db = readDb();
  const record: ContactMessageRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    message,
    status: 'nuevo',
    createdAt: new Date().toISOString(),
  };

  db.contactMessages.push(record);
  saveDb(db);

  res.status(201).json({
    ok: true,
    messageId: record.id,
    confirmation: 'Recibimos tu consulta. Nuestro equipo comercial te responderá a la brevedad.',
  });
});

apiRouter.post('/service-requests', optionalAuth, (req: AuthenticatedRequest, res) => {
  const customerName = typeof req.body?.customerName === 'string' ? req.body.customerName.trim() : '';
  const customerEmail = typeof req.body?.customerEmail === 'string' ? req.body.customerEmail.trim().toLowerCase() : '';
  const customerPhone = typeof req.body?.customerPhone === 'string' ? req.body.customerPhone.trim() : '';
  const deviceModel = typeof req.body?.deviceModel === 'string' ? req.body.deviceModel.trim() : '';
  const issueType = typeof req.body?.issueType === 'string' ? req.body.issueType.trim() : '';
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';

  if (customerName.length < 2 || !customerEmail.includes('@') || customerPhone.length < 6) {
    res.status(400).json({ error: 'Ingresá tus datos de contacto completos para enviarte el presupuesto.' });
    return;
  }
  if (deviceModel.length < 2 || issueType.length < 2 || description.length < 6) {
    res.status(400).json({ error: 'Detallá el modelo del equipo y la falla que presenta.' });
    return;
  }

  const db = readDb();
  const ticketCode = `ST-${Math.floor(1000 + Math.random() * 9000)}`;

  const record: ServiceRequestRecord = {
    id: crypto.randomUUID(),
    ticketCode,
    userId: req.auth?.userId,
    customerName,
    customerEmail,
    customerPhone,
    deviceModel,
    issueType,
    description,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  };

  db.serviceRequests.push(record);
  saveDb(db);

  res.status(201).json({ serviceRequest: record });
});
