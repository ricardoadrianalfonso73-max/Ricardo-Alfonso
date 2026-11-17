import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SmartImage } from './SmartImage';

interface HeroSectionProps {
  onBrowseOffers: () => void;
  onBrowseCatalog: () => void;
}

const HERO_IMAGE = '/assets/images/hero_smartphones_1794864736882.jpg';

export function HeroSection({ onBrowseOffers, onBrowseCatalog }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#050505] tech-grid-bg border-b border-white/5"
    >
      {/* Iluminación ambiental verde sutil */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 w-[520px] h-[520px] rounded-full bg-[#00FF55]/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#00FF55]/8 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Columna izquierda: Contenido principal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-[#00FF55] mb-3">
              ELECTRO TECNO
            </p>

            <h1 className="font-[Outfit] text-[clamp(2.35rem,4.4vw,3.85rem)] font-bold leading-[1.06] tracking-tight text-white [text-wrap:balance]">
              TECNOLOGÍA A TU{' '}
              <span className="text-[#00FF55] drop-shadow-[0_0_24px_rgba(0,255,85,0.35)]">
                ALCANCE
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#B2BEB6] max-w-xl">
              Celulares nuevos y usados, reparación, teclados, mouse, monitores y accesorios. Encontrá todo lo que necesitás en un solo lugar.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBrowseOffers}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#00FF55] text-[#050505] font-semibold text-sm tracking-wide hover:bg-[#36FF7A] transition-all duration-150 shadow-[0_0_28px_rgba(0,255,85,0.32)] hover:shadow-[0_0_36px_rgba(0,255,85,0.5)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>VER OFERTAS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBrowseCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101010] text-white border border-[#00FF55]/25 hover:border-[#00FF55]/65 hover:text-[#00FF55] font-medium text-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55]"
              >
                <span>Explorar catálogo</span>
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#8F9C94]">
              <span className="inline-flex items-center gap-1.5 text-[#D5E2DA]">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF55]" />
                Equipos seleccionados y garantizados
              </span>
              <span aria-hidden="true">·</span>
              <span>Laboratorio técnico propio</span>
              <span aria-hidden="true">·</span>
              <span>Envíos asegurados</span>
            </div>
          </motion.div>

          {/* Columna derecha: Fotografía principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex"
          >
            <div className="relative w-full min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] rounded-2xl overflow-hidden bg-[#101010] border border-[#00FF55]/25 shadow-[0_24px_60px_-20px_rgba(0,255,85,0.22)]">
              <SmartImage
                src={HERO_IMAGE}
                alt="Smartphones modernos con iluminación verde neón en Electro Tecno"
                className="w-full h-full object-cover"
                fallbackTitle="Smartphones Flagship Electro Tecno"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
