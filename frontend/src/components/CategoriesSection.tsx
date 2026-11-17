import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { ProductFilterTab } from './ProductsSection';
import { SmartImage } from './SmartImage';

interface CategoriesSectionProps {
  onSelectCategory: (target: ProductFilterTab | 'servicio-tecnico') => void;
}

const CATEGORIES = [
  {
    id: 'celulares' as const,
    title: 'CELULARES',
    subtitle: 'Smartphones nuevos sellados y usados seleccionados con garantía escrita.',
    image: '/assets/images/category_smartphones_1794864736180.jpg',
    actionLabel: 'Ver smartphones',
  },
  {
    id: 'servicio-tecnico' as const,
    title: 'SERVICIO TÉCNICO',
    subtitle: 'Diagnóstico preciso, micro-soldadura y repuestos originales en el día.',
    image: '/assets/images/category_repair_lab_1794864737047.jpg',
    actionLabel: 'Ir al laboratorio',
  },
  {
    id: 'todos' as const,
    title: 'ACCESORIOS Y PERIFÉRICOS',
    subtitle: 'Teclados mecánicos, mouse gamer, monitores, auriculares y cargadores GaN.',
    image: '/assets/images/category_accessories_1794864737415.jpg',
    actionLabel: 'Explorar catálogo',
  },
];

export function CategoriesSection({ onSelectCategory }: CategoriesSectionProps) {
  return (
    <section
      id="categorias"
      className="bg-[#050505] py-16 sm:py-20 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <h2 className="font-[Outfit] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
            NUESTRAS CATEGORÍAS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9AA89F]">
            Elegí la sección que buscás para acceder directo a nuestros productos o laboratorio técnico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((category, idx) => (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.35,
                delay: idx * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group text-left rounded-2xl bg-[#101010] border border-[#00FF55]/15 overflow-hidden neon-border-hover hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#151515]">
                <SmartImage
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackTitle={category.title}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/20 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-[Outfit] text-xl font-bold text-white group-hover:text-[#00FF55] transition-colors">
                    {category.title}
                  </h3>
                  <span className="w-9 h-9 rounded-lg bg-[#151515] border border-white/10 group-hover:border-[#00FF55]/50 flex items-center justify-center text-[#B2BEB6] group-hover:text-[#00FF55] transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#9AA89F] leading-relaxed">
                  {category.subtitle}
                </p>
                <span className="mt-4 inline-block text-xs font-semibold text-[#00FF55] tracking-wide">
                  {category.actionLabel}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
