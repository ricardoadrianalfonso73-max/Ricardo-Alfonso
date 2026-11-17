import { CheckCircle2, Cpu, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { SmartImage } from './SmartImage';

interface TechServiceSectionProps {
  onOpenServiceModal: () => void;
}

const SERVICE_HIGHLIGHTS = [
  'Cambio de pantallas OLED / AMOLED con calibración True Tone',
  'Reemplazo de baterías certificadas y pines de carga USB-C',
  'Micro-soldadura en placa madre y recuperación por humedad',
];

export function TechServiceSection({ onOpenServiceModal }: TechServiceSectionProps) {
  return (
    <section
      id="servicio-tecnico"
      className="bg-[#050505] py-12 sm:py-16 min-h-[calc(100vh-14rem)] flex items-center border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Imagen del laboratorio */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex"
          >
            <div className="relative w-full min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden bg-[#151515] border border-[#00FF55]/25">
              <SmartImage
                src="/assets/images/tech_service_workshop_1794864739866.jpg"
                alt="Técnico de Electro Tecno reparando un smartphone en laboratorio especializado"
                className="w-full h-full object-cover"
                fallbackTitle="Laboratorio Técnico Electro Tecno"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Contenido del servicio */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#00FF55] mb-3">
              <Cpu className="w-4 h-4" />
              <span>Laboratorio Certificado</span>
            </div>

            <h2 className="font-[Outfit] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
              LE DAMOS UNA SEGUNDA VIDA A TU CELULAR
            </h2>

            <p className="mt-4 text-base text-[#B2BEB6] leading-relaxed">
              Realizamos diagnósticos y reparaciones para que tu dispositivo vuelva a funcionar correctamente.
            </p>

            <ul className="mt-6 space-y-3">
              {SERVICE_HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-[#D7E0DA]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00FF55] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenServiceModal}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] text-[#050505] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-150 shadow-[0_0_24px_rgba(0,255,85,0.28)] whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Wrench className="w-4 h-4" />
                <span>CONSULTAR SERVICIO TÉCNICO</span>
              </button>
              <span className="text-xs text-[#8E9B92]">
                Garantía escrita de 90 días en cada reparación
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
