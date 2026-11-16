import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { sendContactMessage } from '../lib/api';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmation(null);
    setSubmitting(true);
    try {
      const res = await sendContactMessage({ name, email, message });
      setConfirmation(res.confirmation);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos enviar tu consulta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contacto"
      className="bg-[#050505] py-12 sm:py-16 min-h-[calc(100vh-14rem)] flex items-center border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Información de contacto y canales directos */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00FF55] mb-2">
                Atención personalizada
              </p>
              <h2 className="font-[Outfit] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                CONTACTATE CON ELECTRO TECNO
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#9AA89F] leading-relaxed">
                ¿Buscás un modelo específico, cotizar tu equipo usado o consultar por una reparación? Escribinos y te asesoramos al instante.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#101010] border border-[#00FF55]/25 flex items-center justify-center text-[#00FF55] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Sucursal Central</div>
                    <div className="text-sm text-[#9AA89F]">Av. Corrientes 2450, CABA · Argentina</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#101010] border border-[#00FF55]/25 flex items-center justify-center text-[#00FF55] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Horarios de atención</div>
                    <div className="text-sm text-[#9AA89F]">Lunes a Sábados de 10:00 a 19:30 hs</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#101010] border border-[#00FF55]/25 flex items-center justify-center text-[#00FF55] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Correo directo</div>
                    <div className="text-sm text-[#9AA89F]">contacto@electrotecno.com.ar</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#101010] border border-[#00FF55]/25 flex items-center justify-center text-[#00FF55] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Teléfono</div>
                    <div className="text-sm text-[#9AA89F] tabular-nums">+54 11 4589-2300</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/5491145892300"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] text-[#050505] text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir por WhatsApp</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#101010] border border-white/10 hover:border-[#00FF55]/50 text-xs font-medium text-[#D7E0DA] hover:text-[#00FF55] transition-colors whitespace-nowrap"
              >
                <Instagram className="w-4 h-4" />
                <span>@electrotecno.ar</span>
              </a>
            </div>
          </div>

          {/* Formulario conectado al backend */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-[#101010] border border-[#00FF55]/20 p-6 sm:p-8 space-y-5"
            >
              <div>
                <h3 className="font-[Outfit] text-xl font-semibold text-white">
                  Envianos tu consulta
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#8E9B92]">
                  Respondemos todas las consultas en menos de 2 horas hábiles.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              {confirmation && (
                <div
                  role="status"
                  className="rounded-xl bg-[#00FF55]/10 border border-[#00FF55]/40 px-4 py-3 text-sm text-[#00FF55] flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{confirmation}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-[#C6D1CA] mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full h-11 px-4 rounded-xl bg-[#151515] border border-white/10 text-sm text-white placeholder:text-[#68746C] focus:outline-none focus:border-[#00FF55]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-[#C6D1CA] mb-2"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@correo.com"
                    className="w-full h-11 px-4 rounded-xl bg-[#151515] border border-white/10 text-sm text-white placeholder:text-[#68746C] focus:outline-none focus:border-[#00FF55]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-[#C6D1CA] mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contanos en qué equipo o servicio estás interesado..."
                  className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-white/10 text-sm text-white placeholder:text-[#68746C] focus:outline-none focus:border-[#00FF55] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-h-[44px] px-7 py-3 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] disabled:opacity-60 text-[#050505] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Enviando...' : 'Enviar consulta'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
