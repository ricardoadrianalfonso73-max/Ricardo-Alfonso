import { useState } from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../lib/format';
import type { Product, ProductCategory } from '../types/store';
import { SmartImage } from './SmartImage';

interface OffersSectionProps {
  products: Product[];
  loading: boolean;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const OFFER_FILTERS: { id: 'todos' | ProductCategory; label: string }[] = [
  { id: 'todos', label: 'Todas las ofertas' },
  { id: 'celulares', label: 'Celulares' },
  { id: 'monitores', label: 'Monitores' },
  { id: 'teclados', label: 'Teclados' },
  { id: 'mouse', label: 'Mouse' },
  { id: 'accesorios', label: 'Accesorios' },
];

export function OffersSection({
  products,
  loading,
  onViewProduct,
  onAddToCart,
}: OffersSectionProps) {
  const [filter, setFilter] = useState<'todos' | ProductCategory>('todos');

  const offerProducts = products.filter(
    (p) =>
      p.isOffer &&
      p.previousPrice &&
      (filter === 'todos' || p.category === filter)
  );

  return (
    <section
      id="ofertas"
      className="bg-[#050505] py-12 sm:py-16 min-h-[calc(100vh-14rem)] border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00FF55] mb-2">
              Precios especiales por tiempo limitado
            </p>
            <h1 className="font-[Outfit] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
              OFERTAS QUE NO TE PODÉS PERDER
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#9AA89F]">
              Descuentos exclusivos en smartphones, monitores gamer, teclados mecánicos, mouse inalámbricos y kits de carga.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar ofertas por categoría"
            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#101010] border border-white/10 w-fit"
          >
            {OFFER_FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#00FF55] text-[#050505]'
                      : 'text-[#A9B5AD] hover:text-white hover:bg-[#151515]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="rounded-2xl bg-[#101010] border border-white/10 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#151515]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-[#1A1A1A] rounded" />
                  <div className="h-5 w-3/4 bg-[#1A1A1A] rounded" />
                  <div className="h-10 w-full bg-[#1A1A1A] rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : offerProducts.length === 0 ? (
          <div className="rounded-2xl bg-[#101010] border border-white/10 p-10 text-center">
            <p className="text-base font-medium text-white">
              No hay ofertas activas en esa categoría en este momento.
            </p>
            <button
              type="button"
              onClick={() => setFilter('todos')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#00FF55] text-[#050505] text-xs font-semibold cursor-pointer"
            >
              Ver todas las ofertas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerProducts.map((product, idx) => {
              const discount =
                product.discountPercent ||
                (product.previousPrice
                  ? Math.round(
                      ((product.previousPrice - product.price) /
                        product.previousPrice) *
                        100
                    )
                  : 0);

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(idx * 0.04, 0.24),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col rounded-2xl bg-[#101010] border border-[#00FF55]/25 overflow-hidden neon-border-hover hover:-translate-y-0.5"
                >
                  <button
                    type="button"
                    onClick={() => onViewProduct(product)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#151515] text-left cursor-pointer group"
                  >
                    <SmartImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fallbackTitle={product.name}
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#00FF55] text-[#050505] font-[JetBrains_Mono] text-xs font-bold tabular-nums shadow-[0_0_16px_rgba(0,255,85,0.35)]">
                        -{discount}% OFF
                      </span>
                    )}
                  </button>

                  <div className="flex-1 flex flex-col p-5">
                    <div className="text-xs text-[#8E9B92] flex items-center gap-2">
                      <span className="capitalize">{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.condition}</span>
                    </div>

                    <h3 className="mt-1.5 font-[Outfit] text-base font-semibold text-white leading-snug">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-xs text-[#9AA89F] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-4">
                      <div className="space-y-0.5 mb-4">
                        {product.previousPrice && (
                          <div className="font-[JetBrains_Mono] text-xs text-[#7B8880] line-through tabular-nums">
                            Antes {formatPrice(product.previousPrice)}
                          </div>
                        )}
                        <div className="font-[JetBrains_Mono] text-xl font-bold text-[#00FF55] tabular-nums">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewProduct(product)}
                          aria-label={`Ver ${product.name}`}
                          className="w-10 h-10 shrink-0 rounded-xl bg-[#151515] border border-white/10 hover:border-[#00FF55]/50 text-[#D7E0DA] hover:text-[#00FF55] inline-flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          disabled={product.stock <= 0}
                          onClick={() => onAddToCart(product)}
                          className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] disabled:bg-[#1E2420] disabled:text-[#6F7C73] text-xs font-semibold text-[#050505] inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                          <span>Agregar al carrito</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
