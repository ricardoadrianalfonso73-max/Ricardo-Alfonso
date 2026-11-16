import { useState, type FormEvent } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { formatPrice } from '../lib/format';
import type { Product } from '../types/store';
import { SmartImage } from './SmartImage';

interface SearchModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onApplySearchFilter: (query: string) => void;
}

export function SearchModal({
  isOpen,
  products,
  onClose,
  onSelectProduct,
  onApplySearchFilter,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed
    ? products.filter((p) =>
        `${p.name} ${p.description} ${p.category} ${p.condition}`
          .toLowerCase()
          .includes(trimmed)
      )
    : products.slice(0, 4);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onApplySearchFilter(query.trim());
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscar productos"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#101010] border border-[#00FF55]/30 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-5 h-14 border-b border-white/10"
        >
          <Search className="w-4 h-4 text-[#00FF55] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá iPhone, Samsung, auriculares, cargadores..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#6F7C73] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador"
            className="w-8 h-8 rounded-lg hover:bg-[#151515] text-[#9AA89F] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {matches.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#8E9B92]">
              No encontramos coincidencias para "{query}".
            </p>
          ) : (
            matches.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[#151515] text-left transition-colors cursor-pointer"
              >
                <div className="w-14 h-12 rounded-lg overflow-hidden bg-[#151515] shrink-0">
                  <SmartImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    fallbackTitle={product.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-[#8E9B92]">
                    {product.category} · {product.condition}
                  </div>
                </div>
                <span className="font-[JetBrains_Mono] text-sm font-semibold text-[#00FF55] tabular-nums shrink-0">
                  {formatPrice(product.price)}
                </span>
              </button>
            ))
          )}
        </div>

        {query.trim() && matches.length > 0 && (
          <div className="px-4 py-3 border-t border-white/10 bg-[#0A0A0A] flex justify-end">
            <button
              type="button"
              onClick={() => {
                onApplySearchFilter(query.trim());
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00FF55] hover:underline cursor-pointer"
            >
              <span>Ver todos los resultados en catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
