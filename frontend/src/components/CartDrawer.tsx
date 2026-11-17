import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { createOrder } from '../lib/api';
import { formatPrice } from '../lib/format';
import type { CartItem, OrderRecord, PublicUser } from '../types/store';
import { SmartImage } from './SmartImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  user: PublicUser | null;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCompleted: () => void;
}

const FREE_SHIPPING_THRESHOLD = 120000;
const SHIPPING_COST = 8500;

export function CartDrawer({
  isOpen,
  items,
  user,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCompleted,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'transferencia' | 'tarjeta' | 'efectivo_entrega'
  >('transferencia');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  function handleOpenCheckout() {
    setCustomerName((prev) => prev || user?.name || '');
    setCustomerEmail((prev) => prev || user?.email || '');
    setCustomerPhone((prev) => prev || user?.phone || '');
    setError(null);
    setStep('checkout');
  }

  async function handleCheckoutSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
      setConfirmedOrder(order);
      onClearCart();
      onOrderCompleted();
      setStep('success');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo procesar tu pedido.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseAndReset() {
    if (step === 'success') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      onClick={handleCloseAndReset}
    >
      <div
        className="w-full max-w-md h-full bg-[#0A0A0A] border-l border-[#00FF55]/25 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="px-6 h-16 border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Volver al carrito"
                className="w-8 h-8 rounded-lg bg-[#151515] border border-white/10 flex items-center justify-center text-[#D7E0DA] hover:text-[#00FF55] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-[Outfit] text-lg font-bold text-white">
              {step === 'cart'
                ? 'Tu Carrito'
                : step === 'checkout'
                  ? 'Finalizar Compra'
                  : 'Pedido Confirmado'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseAndReset}
            aria-label="Cerrar carrito"
            className="w-9 h-9 rounded-lg bg-[#151515] border border-white/10 hover:border-[#00FF55]/50 text-[#D7E0DA] hover:text-[#00FF55] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'success' && confirmedOrder ? (
            <div className="space-y-5">
              <div className="rounded-2xl bg-[#101010] border border-[#00FF55]/40 p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#00FF55] mx-auto mb-3" />
                <p className="text-xs font-semibold uppercase tracking-wider text-[#00FF55]">
                  Orden {confirmedOrder.orderCode}
                </p>
                <h3 className="mt-1 font-[Outfit] text-xl font-bold text-white">
                  ¡Compra confirmada!
                </h3>
                <p className="mt-2 text-sm text-[#9AA89F]">
                  Enviamos el comprobante a <strong className="text-white">{confirmedOrder.customerEmail}</strong>. Estamos preparando tu envío a {confirmedOrder.city}.
                </p>
              </div>

              <div className="rounded-2xl bg-[#101010] border border-white/10 p-5 space-y-3 text-sm">
                <div className="font-semibold text-white">Resumen del pedido</div>
                {confirmedOrder.items.map((it) => (
                  <div
                    key={it.productId}
                    className="flex items-center justify-between gap-3 text-[#B2BEB6]"
                  >
                    <span className="truncate">
                      {it.quantity}× {it.productName}
                    </span>
                    <span className="font-[JetBrains_Mono] tabular-nums text-white shrink-0">
                      {formatPrice(it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between font-semibold text-white">
                  <span>Total abonado</span>
                  <span className="font-[JetBrains_Mono] text-[#00FF55] tabular-nums">
                    {formatPrice(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full h-11 rounded-xl bg-[#00FF55] text-[#050505] font-semibold text-sm cursor-pointer"
              >
                Seguir explorando la tienda
              </button>
            </div>
          ) : step === 'checkout' ? (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                  Dirección de entrega
                </label>
                <input
                  type="text"
                  required
                  placeholder="Calle, número, piso / depto"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                  Ciudad / Provincia
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: CABA, Buenos Aires"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                  Medio de pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as 'transferencia' | 'tarjeta' | 'efectivo_entrega'
                    )
                  }
                  className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                >
                  <option value="transferencia">Transferencia bancaria / Alias</option>
                  <option value="tarjeta">Tarjeta de crédito o débito</option>
                  <option value="efectivo_entrega">Efectivo contra entrega</option>
                </select>
              </div>
            </form>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#101010] border border-[#00FF55]/25 flex items-center justify-center text-[#00FF55] mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-[Outfit] text-lg font-semibold text-white">
                Tu carrito está vacío
              </p>
              <p className="mt-1.5 text-sm text-[#8E9B92] max-w-xs">
                Explorá nuestros smartphones y accesorios para sumar productos a tu compra.
              </p>
              <a
                href="#productos"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 rounded-xl bg-[#00FF55] text-[#050505] text-xs font-semibold"
              >
                Ver productos
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-[#101010] border border-white/10"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#151515] shrink-0">
                    <SmartImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      fallbackTitle={product.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Quitar ${product.name}`}
                        className="text-[#7B8880] hover:text-red-400 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#8E9B92] mt-0.5">{product.condition}</p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-lg bg-[#151515] border border-white/10 h-8">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          aria-label="Restar unidad"
                          className="w-7 h-full flex items-center justify-center text-white hover:text-[#00FF55] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold tabular-nums text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              product.id,
                              Math.min(product.stock, quantity + 1)
                            )
                          }
                          aria-label="Sumar unidad"
                          className="w-7 h-full flex items-center justify-center text-white hover:text-[#00FF55] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-[JetBrains_Mono] text-sm font-semibold text-[#00FF55] tabular-nums">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie del carrito */}
        {step !== 'success' && items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#080808] space-y-4 shrink-0">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#9AA89F]">
                <span>Subtotal</span>
                <span className="font-[JetBrains_Mono] tabular-nums text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#9AA89F]">
                <span>Envío asegurado</span>
                <span className="font-[JetBrains_Mono] tabular-nums text-[#00FF55]">
                  {shippingCost === 0 ? 'Bonificado' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-base font-bold text-white">
                <span>Total</span>
                <span className="font-[JetBrains_Mono] text-[#00FF55] tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={handleOpenCheckout}
                className="w-full h-12 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] text-[#050505] font-semibold text-sm transition-colors cursor-pointer"
              >
                Iniciar compra
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] disabled:opacity-60 text-[#050505] font-semibold text-sm transition-colors cursor-pointer"
              >
                {submitting ? 'Confirmando pedido...' : 'Confirmar pedido'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
