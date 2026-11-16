import { useState, type FormEvent } from 'react';
import { CheckCircle2, Wrench, X } from 'lucide-react';
import { createServiceRequest } from '../lib/api';
import type { PublicUser, ServiceRequestRecord } from '../types/store';

interface TechServiceModalProps {
  isOpen: boolean;
  user: PublicUser | null;
  onClose: () => void;
}

const ISSUE_TYPES = [
  'Cambio de pantalla / módulo',
  'Reemplazo de batería',
  'Pin de carga / puerto USB-C',
  'Daño por humedad / líquido',
  'Placa madre / micro-soldadura',
  'Otro diagnóstico técnico',
];

export function TechServiceModal({
  isOpen,
  user,
  onClose,
}: TechServiceModalProps) {
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deviceModel, setDeviceModel] = useState('');
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<ServiceRequestRecord | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const created = await createServiceRequest({
        customerName: customerName || user?.name || '',
        customerEmail: customerEmail || user?.email || '',
        customerPhone,
        deviceModel,
        issueType,
        description,
      });
      setTicket(created);
      setDeviceModel('');
      setDescription('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No pudimos registrar la solicitud técnica.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setTicket(null);
    setError(null);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tech-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#101010] border border-[#00FF55]/30 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00FF55]">
              <Wrench className="w-3.5 h-3.5" />
              <span>Servicio Técnico</span>
            </div>
            <h2
              id="tech-modal-title"
              className="mt-1 font-[Outfit] text-xl sm:text-2xl font-bold text-white"
            >
              Solicitar diagnóstico
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar modal de servicio técnico"
            className="w-9 h-9 rounded-lg bg-[#151515] border border-white/10 hover:border-[#00FF55]/50 text-[#D7E0DA] hover:text-[#00FF55] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {ticket ? (
          <div className="space-y-5">
            <div className="rounded-xl bg-[#00FF55]/10 border border-[#00FF55]/40 p-5 text-center">
              <CheckCircle2 className="w-9 h-9 text-[#00FF55] mx-auto mb-2.5" />
              <p className="font-[JetBrains_Mono] text-xs font-semibold text-[#00FF55]">
                TICKET {ticket.ticketCode}
              </p>
              <h3 className="mt-1 font-[Outfit] text-lg font-bold text-white">
                Solicitud registrada
              </h3>
              <p className="mt-2 text-sm text-[#C6D1CA]">
                Recibimos la consulta para tu <strong className="text-white">{ticket.deviceModel}</strong>. Un técnico te enviará el presupuesto estimado por correo o WhatsApp.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full h-11 rounded-xl bg-[#00FF55] text-[#050505] font-semibold text-sm cursor-pointer"
            >
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
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
                  placeholder="+54 9 11..."
                  className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                  Modelo del celular
                </label>
                <input
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="Ej: iPhone 13 Pro / S23"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                  Tipo de falla
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55]"
                >
                  {ISSUE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C6D1CA] mb-1.5">
                Detalle del problema
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contanos qué ocurrió con el equipo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00FF55] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] disabled:opacity-60 text-[#050505] font-semibold text-sm transition-colors cursor-pointer"
            >
              {submitting ? 'Enviando solicitud...' : 'Enviar solicitud técnica'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
