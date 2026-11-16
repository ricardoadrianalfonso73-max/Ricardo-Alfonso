import { useEffect, useState, type FormEvent } from 'react';
import { LogOut, Package, User, Wrench, X } from 'lucide-react';
import {
  fetchAccountProfile,
  loginUser,
  registerUser,
  setStoredToken,
} from '../lib/api';
import { formatDateShort, formatPrice } from '../lib/format';
import type {
  OrderRecord,
  PublicUser,
  ServiceRequestRecord,
} from '../types/store';

interface AuthModalProps {
  isOpen: boolean;
  user: PublicUser | null;
  onClose: () => void;
  onAuthChange: (user: PublicUser | null) => void;
}

export function AuthModal({
  isOpen,
  user,
  onClose,
  onAuthChange,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestRecord[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;
    fetchAccountProfile()
      .then((res) => {
        setOrders(res.orders);
        setServiceRequests(res.serviceRequests);
      })
      .catch(() => {
        // Silencioso si el perfil no carga
      });
  }, [isOpen, user]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await loginUser({ email, password })
          : await registerUser({ name, email, password, phone });
      onAuthChange(res.user);
      setPassword('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo completar el acceso.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setStoredToken(null);
    onAuthChange(null);
    setOrders([]);
    setServiceRequests([]);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl bg-[#101010] border border-[#00FF55]/30 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#151515] border border-[#00FF55]/30 flex items-center justify-center text-[#00FF55]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="auth-modal-title"
                className="font-[Outfit] text-xl font-bold text-white"
              >
                {user
                  ? user.name
                  : mode === 'login'
                    ? 'Iniciar sesión'
                    : 'Crear cuenta'}
              </h2>
              <p className="text-xs text-[#8E9B92]">
                {user
                  ? user.email
                  : 'Seguí tus compras y presupuestos de servicio técnico'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de cuenta"
            className="w-9 h-9 rounded-lg bg-[#151515] border border-white/10 hover:border-[#00FF55]/50 text-[#D7E0DA] hover:text-[#00FF55] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {user ? (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Package className="w-4 h-4 text-[#00FF55]" />
                <span>Mis compras ({orders.length})</span>
              </h3>
              {orders.length === 0 ? (
                <p className="text-xs text-[#8E9B92] rounded-xl bg-[#151515] p-4">
                  Todavía no registraste pedidos con esta cuenta.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl bg-[#151515] border border-white/10 p-3.5 text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-[JetBrains_Mono] font-semibold text-[#00FF55]">
                          {order.orderCode}
                        </div>
                        <div className="text-[#9AA89F] mt-0.5">
                          {formatDateShort(order.createdAt)} · {order.items.length} ítem(s)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-[JetBrains_Mono] font-semibold text-white tabular-nums">
                          {formatPrice(order.total)}
                        </div>
                        <div className="text-[#8E9B92] capitalize mt-0.5">
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Wrench className="w-4 h-4 text-[#00FF55]" />
                <span>Consultas de servicio técnico ({serviceRequests.length})</span>
              </h3>
              {serviceRequests.length === 0 ? (
                <p className="text-xs text-[#8E9B92] rounded-xl bg-[#151515] p-4">
                  No tenés tickets técnicos registrados.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {serviceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-xl bg-[#151515] border border-white/10 p-3.5 text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-[JetBrains_Mono] font-semibold text-[#00FF55]">
                          {req.ticketCode}
                        </div>
                        <div className="text-white font-medium mt-0.5">
                          {req.deviceModel}
                        </div>
                        <div className="text-[#9AA89F]">{req.issueType}</div>
                      </div>
                      <span className="text-[#8E9B92] capitalize shrink-0">
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-11 rounded-xl bg-[#151515] border border-white/15 hover:border-red-400/50 text-sm font-medium text-[#D7E0DA] hover:text-red-300 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#151515] border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#00FF55] text-[#050505]'
                    : 'text-[#A9B5AD] hover:text-white'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#00FF55] text-[#050505]'
                    : 'text-[#A9B5AD] hover:text-white'
                }`}
              >
                Registrarme
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] disabled:opacity-60 text-[#050505] font-semibold text-sm transition-colors cursor-pointer"
            >
              {loading
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Ingresar'
                  : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
