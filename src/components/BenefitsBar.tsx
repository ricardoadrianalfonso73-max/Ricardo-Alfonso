import { ShieldCheck, Truck, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

const BENEFITS = [
  {
    title: 'Envíos a todo el país',
    description:
      'Despachos asegurados en 24 hs con seguimiento en tiempo real hasta la puerta de tu casa.',
    icon: Truck,
  },
  {
    title: 'Compra segura',
    description:
      'Equipos nuevos y usados certificados en 42 puntos de control, con garantía escrita.',
    icon: ShieldCheck,
  },
  {
    title: 'Soporte técnico',
    description:
      'Laboratorio especializado en micro-soldadura, cambio de módulos y baterías originales.',
    icon: Wrench,
  },
];

export function BenefitsBar() {
  return (
    <section
      aria-label="Beneficios de Electro Tecno"
      className="bg-[#080808] py-10 sm:py-12 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group rounded-2xl bg-[#101010] border border-[#00FF55]/20 p-6 neon-border-hover hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#151515] border border-[#00FF55]/30 flex items-center justify-center text-[#00FF55] mb-4 transition-transform duration-150 group-hover:scale-105">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h2 className="font-[Outfit] text-lg font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#9AA89F]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
