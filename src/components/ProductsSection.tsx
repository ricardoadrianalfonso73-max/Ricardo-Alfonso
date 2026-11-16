import { Eye, ShoppingCart, X } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../lib/format';
import type { Product } from '../types/store';
import { SmartImage } from './SmartImage';

export type ProductFilterTab =
  | 'todos'
  | 'celulares'
  | 'teclados'
  | 'mouse'
  | 'monitores'
  | 'accesorios'
  | 'nuevo'
  | 'usado';

interface ProductsSectionProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  activeTab: ProductFilterTab;
  searchQuery: string;
  onTabChange: (tab: ProductFilterTab) => void;
  onClearSearch: () => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const FILTER_TABS: { id: ProductFilterTab; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'celulares', label: 'Celulares' },
  { id: 'teclados', label: 'Teclados' },
  { id: 'mouse', label: 'Mouse' },
  { id: 'monitores', label: 'Monitores' },
  { id: 'accesorios', label: 'Accesorios' },
  { id: 'nuevo', label: 'Nuevos' },
  { id: 'usado', label: 'Usados' },
];

export function ProductsSection({
  products,
  loading,
  error,
  activeTab,
  searchQuery,
  onTabChange,
  onClearSearch,
  onViewProduct,
  onAddToCart,
}: ProductsSectionProps) {
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'celulares' && p.category !== 'celulares') return false;
    if (activeTab === 'teclados' && p.category !== 'teclados') return false;
    if (activeTab === 'mouse' && p.category !== 'mouse') return false;
    if (activeTab === 'monitores' && p.category !== 'monitores') return false;
    if (activeTab === 'accesorios' && p.category !== 'accesorios') return false;
    if (activeTab === 'nuevo' && p.condition !== 'Nuevo') return false;
    if (activeTab === 'usado' && p.condition !== 'Usado') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const match = `${p.name} ${p.description} ${p.category} ${p.condition} ${p.specs.join(' ')}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  return (
    <section
      id="productos"
      className="bg-[#050505] py-12 sm:py-16 min-h-[calc(100vh-14rem)] border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado y controles de filtro */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00FF55] mb-2">
              Catálogo completo
            </p>
            <h1 className="font-[Outfit] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
              PRODUCTOS DESTACADOS
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#9AA89F]">
              Celulares nuevos y usados, teclados mecánicos, mouse gamer, monitores y accesorios de alto rendimiento.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar catálogo de productos"
            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#101010] border border-white/10 w-fit"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55] ${
                    isActive
                      ? 'bg-[#00FF55] text-[#050505]'
                      : 'text-[#A9B5AD] hover:text-white hover:bg-[#151515]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de búsqueda activa */}
        {searchQuery.trim() && (
          <div className="mb-8 flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-[#101010] border border-[#00FF55]/25">
            <p className="text-sm text-[#D7E0DA]">
              Resultados para <span className="font-semibold text-[#00FF55]">"{searchQuery}"</span>{' '}
              <span className="text-[#8E9B92] tabular-nums">({filteredProducts.length})</span>
            </p>
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A9B5AD] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar búsqueda
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-[#151515] border border-red-500/30 p-6 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div
                key={skeleton}
                className="rounded-2xl bg-[#101010] border border-white/10 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#151515]" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-28 bg-[#1A1A1A] rounded" />
                  <div className="h-5 w-3/4 bg-[#1A1A1A] rounded" />
                  <div className="h-4 w-full bg-[#1A1A1A] rounded" />
                  <div className="h-10 w-full bg-[#1A1A1A] rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-[#101010] border border-white/10 p-10 text-center">
            <p className="text-base font-medium text-white">
              No encontramos productos con ese filtro.
            </p>
            <p className="mt-1.5 text-sm text-[#9AA89F]">
              Probá cambiar de categoría o limpiar el término de búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                onTabChange('todos');
                onClearSearch();
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#00FF55] text-[#050505] text-xs font-semibold cursor-pointer"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: Math.min(idx * 0.04, 0.24),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col rounded-2xl bg-[#101010] border border-[#00FF55]/15 overflow-hidden neon-border-hover hover:-translate-y-0.5"
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
                  {product.isOffer && product.discountPercent && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#00FF55] text-[#050505] font-[JetBrains_Mono] text-xs font-bold tabular-nums">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </button>

                <div className="flex-1 flex flex-col p-6">
                  {/* Metadatos limpios sin pills */}
                  <div className="flex items-center gap-2 text-xs text-[#8E9B92]">
                    <span className="capitalize">{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        product.condition === 'Nuevo'
                          ? 'text-[#00FF55] font-medium'
                          : 'text-[#D7E0DA] font-medium'
                      }
                    >
                      {product.condition}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {product.stock > 0 ? `${product.stock} disp.` : 'Sin stock'}
                    </span>
                  </div>

                  <h3 className="mt-2 font-[Outfit] text-lg font-semibold text-white leading-snug">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-sm text-[#9AA89F] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-baseline gap-2.5 mb-4">
                      <span className="font-[JetBrains_Mono] text-xl font-semibold text-white tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      {product.previousPrice && (
                        <span className="font-[JetBrains_Mono] text-xs text-[#6F7C73] line-through tabular-nums">
                          {formatPrice(product.previousPrice)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => onViewProduct(product)}
                        className="min-h-[42px] px-3 py-2 rounded-xl bg-[#151515] border border-white/10 hover:border-[#00FF55]/50 text-xs font-medium text-[#E2EBE5] hover:text-[#00FF55] inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55]"
                      >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span>Ver producto</span>
                      </button>

                      <button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() => onAddToCart(product)}
                        className="min-h-[42px] px-3 py-2 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] disabled:bg-[#1E2420] disabled:text-[#6F7C73] disabled:cursor-not-allowed text-xs font-semibold text-[#050505] inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                        <span>{product.stock > 0 ? 'Agregar' : 'Agotado'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
